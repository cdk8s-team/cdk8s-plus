import { ApiObject, ApiObjectMetadataDefinition, Duration, Lazy, Names } from 'cdk8s';
import { Construct, IConstruct } from 'constructs';
import * as base from './base';
import * as container from './container';
import * as k8s from './imports/k8s';
import * as namespace from './namespace';
import * as networkpolicy from './network-policy';
import * as rb from './role-binding';
import * as secret from './secret';
import * as serviceaccount from './service-account';
import { undefinedIfEmpty, address } from './utils';
import * as volume from './volume';

export abstract class AbstractPod extends base.Resource implements IPodSelector, networkpolicy.INetworkPolicyPeer, rb.ISubject {

  public readonly restartPolicy?: RestartPolicy;
  public readonly serviceAccount?: serviceaccount.IServiceAccount;
  public readonly securityContext: PodSecurityContext;
  public readonly dns: PodDns;
  public readonly dockerRegistryAuth?: secret.ISecret;
  public readonly automountServiceAccountToken: boolean;
  public readonly hostNetwork?: boolean;
  public readonly terminationGracePeriod?: Duration;

  protected readonly isolate: boolean;

  private readonly _containers: container.Container[] = [];
  private readonly _initContainers: container.Container[] = [];
  private readonly _hostAliases: HostAlias[] = [];
  private readonly _volumes: Map<string, volume.Volume> = new Map();

  public abstract readonly podMetadata: ApiObjectMetadataDefinition;

  constructor(scope: Construct, id: string, props: AbstractPodProps = {}) {
    super(scope, id);

    this.restartPolicy = props.restartPolicy ?? RestartPolicy.ALWAYS;
    this.serviceAccount = props.serviceAccount;
    this.securityContext = new PodSecurityContext(props.securityContext);
    this.dns = new PodDns(props.dns);
    this.dockerRegistryAuth = props.dockerRegistryAuth;
    this.automountServiceAccountToken = props.automountServiceAccountToken ?? false;
    this.isolate = props.isolate ?? false;
    this.hostNetwork = props.hostNetwork ?? false;
    this.terminationGracePeriod = props.terminationGracePeriod ?? Duration.seconds(30);

    if (props.containers) {
      props.containers.forEach(c => this.addContainer(c));
    }

    if (props.volumes) {
      props.volumes.forEach(v => this.addVolume(v));
    }

    if (props.initContainers) {
      props.initContainers.forEach(c => this.addInitContainer(c));
    }

    if (props.hostAliases) {
      props.hostAliases.forEach(c => this.addHostAlias(c));
    }

  }

  public get containers(): container.Container[] {
    return [...this._containers];
  }

  public get initContainers(): container.Container[] {
    return [...this._initContainers];
  }

  public get volumes(): volume.Volume[] {
    return Array.from(this._volumes.values());
  }

  public get hostAliases(): HostAlias[] {
    return [...this._hostAliases];
  }

  /**
   * @see IPodSelector.toPodSelectorConfig()
   */
  public toPodSelectorConfig(): PodSelectorConfig {
    const podAddress = this.podMetadata.getLabel(Pod.ADDRESS_LABEL);
    if (!podAddress) {
      // shouldn't happen because we add this label automatically in both pods and workloads.
      throw new Error(`Unable to create a label selector since ${Pod.ADDRESS_LABEL} label is missing`);
    }
    return {
      labelSelector: LabelSelector.of({ labels: { [Pod.ADDRESS_LABEL]: podAddress } }),
      namespaces: this.metadata.namespace ? {
        names: [this.metadata.namespace],
      } : undefined,
    };
  }

  /**
   * @see INetworkPolicyPeer.toNetworkPolicyPeerConfig()
   */
  public toNetworkPolicyPeerConfig(): networkpolicy.NetworkPolicyPeerConfig {
    return { podSelector: this.toPodSelectorConfig() };
  }

  /**
   * @see INetworkPolicyPeer.toPodSelector()
   */
  public toPodSelector(): IPodSelector | undefined {
    return this;
  }

  public addContainer(cont: container.ContainerProps): container.Container {
    const impl = new container.Container(cont);
    this.attachContainer(impl);
    return impl;
  }

  public attachContainer(cont: container.Container) {
    this._containers.push(cont);
  }

  public addInitContainer(cont: container.ContainerProps): container.Container {

    // https://kubernetes.io/docs/concepts/workloads/pods/init-containers/#differences-from-regular-containers
    if (!this.isSidecarContainer(cont) && cont.readiness) {
      throw new Error('Init containers must not have a readiness probe');
    }

    if (!this.isSidecarContainer(cont) && cont.liveness) {
      throw new Error('Init containers must not have a liveness probe');
    }

    if (!this.isSidecarContainer(cont) && cont.startup) {
      throw new Error('Init containers must not have a startup probe');
    }

    const impl = new container.Container({
      ...cont,
      name: cont.name ?? `init-${this._initContainers.length}`,
    });

    this._initContainers.push(impl);
    return impl;
  }

  // Any initContainer that has `restartPolicy=Always` is a sidecar container. Please refer to
  // documentation for more details:
  // https://kubernetes.io/docs/concepts/workloads/pods/sidecar-containers/#differences-from-init-containers
  private isSidecarContainer(cont: container.ContainerProps) {
    return this.restartPolicy && cont.restartPolicy === container.ContainerRestartPolicy.ALWAYS
  }

  public addHostAlias(hostAlias: HostAlias): void {
    this._hostAliases.push(hostAlias);
  }

  public addVolume(vol: volume.Volume): void {
    const existingVolume = this._volumes.get(vol.name);
    if (existingVolume) {
      throw new Error(`Volume with name ${vol.name} already exists`);
    }
    this._volumes.set(vol.name, vol);
  }

  /**
   * @see ISubect.toSubjectConfiguration()
   */
  public toSubjectConfiguration(): rb.SubjectConfiguration {

    if (!this.serviceAccount && !this.automountServiceAccountToken) {
      throw new Error(`${this.name} cannot be converted to a role binding subject:`
        + ' You must either assign a service account to it, or use \'automountServiceAccountToken: true\'');
    }

    // 'default' is assumed to be the name of the default service account
    // in the cluster.
    const serviceAccountName = this.serviceAccount?.name ?? 'default';

    return {
      kind: 'ServiceAccount',
      name: serviceAccountName,
      apiGroup: '',
    };
  }

  /**
   * @internal
   */
  public _toPodSpec(): k8s.PodSpec {

    if (this.containers.length === 0) {
      throw new Error('PodSpec must have at least 1 container');
    }

    const volumes: Map<string, volume.Volume> = new Map();
    const containers: k8s.Container[] = [];
    const initContainers: k8s.Container[] = [];

    for (const cont of this.containers) {
      // check if restartPolicy is defined for containers
      if (cont.restartPolicy) {
        throw new Error(`Invalid container spec: ${cont.name} has non-empty restartPolicy field. The field can only be specified for initContainers`);
      }
      // automatically add volume from the container mount
      // to this pod so thats its available to the container.
      for (const mount of cont.mounts) {
        addVolume(mount.volume);
      }
      containers.push(cont._toKube());
    }

    for (const cont of this.initContainers) {
      // automatically add volume from the container mount
      // to this pod so thats its available to the container.
      for (const mount of cont.mounts) {
        addVolume(mount.volume);
      }
      initContainers.push(cont._toKube());
    }

    for (const vol of this.volumes) {
      addVolume(vol);
    }

    function addVolume(vol: volume.Volume) {
      const existingVolume = volumes.get(vol.name);
      // its ok to call this function twice on the same volume, but its not ok to
      // call it twice on a different volume with the same name.
      if (existingVolume && existingVolume !== vol) {
        throw new Error(`Invalid mount configuration. At least two different volumes have the same name: ${vol.name}`);
      }
      volumes.set(vol.name, vol);
    }

    const dns = this.dns._toKube();

    return {
      restartPolicy: this.restartPolicy,
      serviceAccountName: this.serviceAccount?.name,
      containers: containers,
      securityContext: undefinedIfEmpty(this.securityContext._toKube()),
      initContainers: undefinedIfEmpty(initContainers),
      hostAliases: undefinedIfEmpty(this.hostAliases),
      volumes: undefinedIfEmpty(Array.from(volumes.values()).map(v => v._toKube())),
      dnsPolicy: dns.policy,
      dnsConfig: undefinedIfEmpty(dns.config),
      hostname: dns.hostname,
      subdomain: dns.subdomain,
      setHostnameAsFqdn: dns.hostnameAsFQDN,
      imagePullSecrets: this.dockerRegistryAuth ? [{ name: this.dockerRegistryAuth.name }] : undefined,
      automountServiceAccountToken: this.automountServiceAccountToken,
      hostNetwork: this.hostNetwork,
      terminationGracePeriodSeconds: this.terminationGracePeriod?.toSeconds(),
    };

  }

}

/**
 * Sysctl defines a kernel parameter to be set
 */
export interface Sysctl {
  /**
   * Name of a property to set
   */
  readonly name: string;

  /**
   * Value of a property to set
   */
  readonly value: string;
}

/**
 * Properties for `PodSecurityContext`
 */
export interface PodSecurityContextProps {

  /**
   * Modify the ownership and permissions of pod volumes to this GID.
   *
   * @default - Volume ownership is not changed.
   */
  readonly fsGroup?: number;

  /**
   * Defines behavior of changing ownership and permission of the volume before being exposed inside Pod.
   * This field will only apply to volume types which support fsGroup based ownership(and permissions).
   * It will have no effect on ephemeral volume types such as: secret, configmaps and emptydir.
   *
   * @default FsGroupChangePolicy.ALWAYS
   */
  readonly fsGroupChangePolicy?: FsGroupChangePolicy;

  /**
   * The UID to run the entrypoint of the container process.
   *
   * @default - User specified in image metadata
   */
  readonly user?: number;

  /**
   * The GID to run the entrypoint of the container process.
   *
   * @default - Group configured by container runtime
   */
  readonly group?: number;

  /**
   * Indicates that the container must run as a non-root user.
   * If true, the Kubelet will validate the image at runtime to ensure that it does
   * not run as UID 0 (root) and fail to start the container if it does.
   *
   * @default true
   */
  readonly ensureNonRoot?: boolean;

  /**
   * Sysctls hold a list of namespaced sysctls used for the pod.
   * Pods with unsupported sysctls (by the container runtime) might fail to launch.
   *
   * @default - No sysctls
   */
  readonly sysctls?: Sysctl[];
}

/**
 * Properties for `AbstractPod`.
 */
export interface AbstractPodProps extends base.ResourceProps {

  /**
   * List of containers belonging to the pod. Containers cannot currently be
   * added or removed. There must be at least one container in a Pod.
   *
   * You can add additionnal containers using `podSpec.addContainer()`
   *
   * @default - No containers. Note that a pod spec must include at least one container.
   */
  readonly containers?: container.ContainerProps[];

  /**
   * List of initialization containers belonging to the pod.
   * Init containers are executed in order prior to containers being started.
   * If any init container fails, the pod is considered to have failed and is handled according to its restartPolicy.
   * The name for an init container or normal container must be unique among all containers.
   * Init containers may not have Lifecycle actions, Readiness probes, Liveness probes, or Startup probes.
   * The resourceRequirements of an init container are taken into account during scheduling by finding the highest request/limit
   * for each resource type, and then using the max of of that value or the sum of the normal containers.
   * Limits are applied to init containers in a similar fashion.
   *
   * Init containers cannot currently be added ,removed or updated.
   *
   * @see https://kubernetes.io/docs/concepts/workloads/pods/init-containers/
   * @default - No init containers.
   */
  readonly initContainers?: container.ContainerProps[];

  /**
   * List of volumes that can be mounted by containers belonging to the pod.
   *
   * You can also add volumes later using `podSpec.addVolume()`
   *
   * @see https://kubernetes.io/docs/concepts/storage/volumes
   *
   * @default - No volumes.
   */
  readonly volumes?: volume.Volume[];

  /**
   * Restart policy for all containers within the pod.
   *
   * @see https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle/#restart-policy
   *
   * @default RestartPolicy.ALWAYS
   */
  readonly restartPolicy?: RestartPolicy;

  /**
   * A service account provides an identity for processes that run in a Pod.
   *
   * When you (a human) access the cluster (for example, using kubectl), you are
   * authenticated by the apiserver as a particular User Account (currently this
   * is usually admin, unless your cluster administrator has customized your
   * cluster). Processes in containers inside pods can also contact the
   * apiserver. When they do, they are authenticated as a particular Service
   * Account (for example, default).
   *
   * @see https://kubernetes.io/docs/tasks/configure-pod-container/configure-service-account/
   *
   * @default - No service account.
   */
  readonly serviceAccount?: serviceaccount.IServiceAccount;

  /**
   * SecurityContext holds pod-level security attributes and common container settings.
   *
   * @default
   *
   *   fsGroupChangePolicy: FsGroupChangePolicy.FsGroupChangePolicy.ALWAYS
   *   ensureNonRoot: true
   */
  readonly securityContext?: PodSecurityContextProps;

  /**
   * HostAlias holds the mapping between IP and hostnames that will be injected as an entry in the pod's hosts file.
   *
   * @schema io.k8s.api.core.v1.HostAlias
   */
  readonly hostAliases?: HostAlias[];

  /**
   * DNS settings for the pod.
   *
   * @see https://kubernetes.io/docs/concepts/services-networking/dns-pod-service/
   *
   * @default
   *
   *  policy: DnsPolicy.CLUSTER_FIRST
   *  hostnameAsFQDN: false
   */
  readonly dns?: PodDnsProps;

  /**
   * A secret containing docker credentials for authenticating to a registry.
   *
   * @default - No auth. Images are assumed to be publicly available.
   */
  readonly dockerRegistryAuth?: secret.ISecret;

  /**
   * Indicates whether a service account token should be automatically mounted.
   *
   * @default false
   * @see https://kubernetes.io/docs/tasks/configure-pod-container/configure-service-account/#use-the-default-service-account-to-access-the-api-server
   */
  readonly automountServiceAccountToken?: boolean;

  /**
   * Isolates the pod. This will prevent any ingress or egress connections to / from this pod.
   * You can however allow explicit connections post instantiation by using the `.connections` property.
   *
   * @default false
   */
  readonly isolate?: boolean;

  /**
   * Host network for the pod.
   *
   * @default false
   */
  readonly hostNetwork?: boolean;

  /**
   * Grace period until the pod is terminated
   *
   * @default Duration.seconds(30)
   */
  readonly terminationGracePeriod?: Duration;
}

/**
 * Properties for `Pod`.
 */
export interface PodProps extends AbstractPodProps {}

/**
 * Options for `LabelSelector.of`.
 */
export interface LabelSelectorOptions {

  /**
   * Strict label matchers.
   */
  readonly labels?: { [key: string]: string };

  /**
   * Expression based label matchers.
   */
  readonly expressions?: LabelExpression[];
}

/**
 * Match a resource by labels.
 */
export class LabelSelector {

  public static of(options: LabelSelectorOptions = {}) {
    return new LabelSelector(options.expressions ?? [], options.labels ?? {});
  }

  private constructor(
    private readonly expressions: LabelExpression[],
    private readonly labels: { [key: string]: string }) {}

  public isEmpty() {
    return this.expressions.length === 0 && Object.keys(this.labels).length === 0;
  }

  /**
   * @internal
   */
  public _toKube(): k8s.LabelSelector {
    if (this.isEmpty()) {
      return {};
    }
    return {
      matchExpressions: undefinedIfEmpty(this.expressions.map(q => ({ key: q.key, operator: q.operator, values: q.values }))),
      matchLabels: undefinedIfEmpty(this.labels),
    };
  }
}

/**
 * Configuration for selecting pods, optionally in particular namespaces.
 */
export interface PodSelectorConfig {

  /**
   * A selector to select pods by labels.
   */
  readonly labelSelector: LabelSelector;

  /**
   * Configuration for selecting which namepsaces are the pods allowed to be in.
   */
  readonly namespaces?: namespace.NamespaceSelectorConfig;

}

/**
 * Represents an object that can select pods.
 */
export interface IPodSelector extends IConstruct {
  /**
   * Return the configuration of this selector.
   */
  toPodSelectorConfig(): PodSelectorConfig;
}

/**
 * Pod is a collection of containers that can run on a host. This resource is
 * created by clients and scheduled onto hosts.
 */
export class Pod extends AbstractPod {

  /**
   * This label is autoamtically added by cdk8s to any pod. It provides
   * a unique and stable identifier for the pod.
   */
  public static readonly ADDRESS_LABEL = 'cdk8s.io/metadata.addr';

  /**
   * @see base.Resource.apiObject
   */
  protected readonly apiObject: ApiObject;

  public readonly resourceType = 'pods';

  public readonly scheduling: PodScheduling;
  public readonly connections: PodConnections;

  constructor(scope: Construct, id: string, props: PodProps = {}) {
    super(scope, id, props);

    this.apiObject = new k8s.KubePod(this, 'Resource', {
      metadata: props.metadata,
      spec: Lazy.any({ produce: () => this._toKube() }),
    });

    this.metadata.addLabel(Pod.ADDRESS_LABEL, Names.toLabelValue(this));

    this.scheduling = new PodScheduling(this);
    this.connections = new PodConnections(this);

    if (this.isolate) {
      this.connections.isolate();
    }
  }

  public get podMetadata(): ApiObjectMetadataDefinition {
    return this.metadata;
  }

  /**
   * @internal
   */
  public _toKube(): k8s.PodSpec {
    const scheduling = this.scheduling._toKube();

    return {
      ...this._toPodSpec(),
      affinity: scheduling.affinity,
      nodeName: scheduling.nodeName,
      tolerations: scheduling.tolerations,
    };
  }

}

/**
 * Properties for `PodDns`.
 */
export interface PodDnsProps {

  /**
   * Specifies the hostname of the Pod.
   *
   * @default - Set to a system-defined value.
   */
  readonly hostname?: string;

  /**
   * If specified, the fully qualified Pod hostname will be "<hostname>.<subdomain>.<pod namespace>.svc.<cluster domain>".
   *
   * @default - No subdomain.
   */
  readonly subdomain?: string;

  /**
   * If true the pod's hostname will be configured as the pod's FQDN, rather than the leaf name (the default).
   * In Linux containers, this means setting the FQDN in the hostname field of the kernel (the nodename field of struct utsname).
   * In Windows containers, this means setting the registry value of hostname for the registry
   * key HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\Tcpip\Parameters to FQDN.
   * If a pod does not have FQDN, this has no effect.
   *
   * @default false
   */
  readonly hostnameAsFQDN?: boolean;

  /**
   * Set DNS policy for the pod.
   *
   * If policy is set to `None`, other configuration must be supplied.
   *
   * @default DnsPolicy.CLUSTER_FIRST
   */
  readonly policy?: DnsPolicy;

  /**
   * A list of IP addresses that will be used as DNS servers for the Pod. There can be at most 3 IP addresses specified.
   * When the policy is set to "NONE", the list must contain at least one IP address,
   * otherwise this property is optional.
   * The servers listed will be combined to the base nameservers generated from
   * the specified DNS policy with duplicate addresses removed.
   */
  readonly nameservers?: string[];

  /**
   * A list of DNS search domains for hostname lookup in the Pod.
   * When specified, the provided list will be merged into the base
   * search domain names generated from the chosen DNS policy.
   * Duplicate domain names are removed.
   *
   * Kubernetes allows for at most 6 search domains.
   */
  readonly searches?: string[];

  /**
   * List of objects where each object may have a name property (required)
   * and a value property (optional). The contents in this property
   * will be merged to the options generated from the specified DNS policy.
   * Duplicate entries are removed.
   */
  readonly options?: DnsOption[];
}

/**
 * Holds dns settings of the pod.
 */
export class PodDns {

  /**
   * The DNS policy of this pod.
   */
  public readonly policy: DnsPolicy;

  /**
   * The configured hostname of the pod. Undefined means its set to a system-defined value.
   */
  public readonly hostname?: string;

  /**
   * The configured subdomain of the pod.
   */
  public readonly subdomain?: string;

  /**
   * Whether or not the pods hostname is set to its FQDN.
   */
  public readonly hostnameAsFQDN: boolean;

  private readonly _nameservers: string[];
  private readonly _searches: string[];
  private readonly _options: DnsOption[];

  constructor(props: PodDnsProps = {}) {
    this.hostname = props.hostname;
    this.subdomain = props.subdomain;
    this.policy = props.policy ?? DnsPolicy.CLUSTER_FIRST;
    this.hostnameAsFQDN = props.hostnameAsFQDN ?? false;
    this._nameservers = props.nameservers ?? [];
    this._searches = props.searches ?? [];
    this._options = props.options ?? [];
  }

  /**
   * Nameservers defined for this pod.
   */
  public get nameservers(): string[] {
    return [...this._nameservers];
  }

  /**
   * Search domains defined for this pod.
   */
  public get searches(): string[] {
    return [...this._searches];
  }

  /**
   * Custom dns options defined for this pod.
   */
  public get options(): DnsOption[] {
    return [...this._options];
  }

  /**
   * Add a nameserver.
   */
  public addNameserver(...nameservers: string[]) {
    this._nameservers.push(...nameservers);
  }

  /**
   * Add a search domain.
   */
  public addSearch(...searches: string[]) {
    this._searches.push(...searches);
  }

  /**
   * Add a custom option.
   */
  public addOption(...options: DnsOption[]) {
    this._options.push(...options);
  }

  /**
   * @internal
   */
  public _toKube(): {
    hostname?: string;
    subdomain?: string;
    hostnameAsFQDN: boolean;
    policy: string;
    config: k8s.PodDnsConfig; } {

    if (this.policy === DnsPolicy.NONE && this.nameservers.length === 0) {
      throw new Error('When dns policy is set to NONE, at least one nameserver is required');
    }

    if (this.nameservers.length > 3) {
      throw new Error('There can be at most 3 nameservers specified');
    }

    if (this.searches.length > 6) {
      throw new Error('There can be at most 6 search domains specified');
    }

    return {
      hostname: this.hostname,
      subdomain: this.subdomain,
      hostnameAsFQDN: this.hostnameAsFQDN,
      policy: this.policy,
      config: {
        nameservers: undefinedIfEmpty(this.nameservers),
        searches: undefinedIfEmpty(this.searches),
        options: undefinedIfEmpty(this.options),
      },
    };
  }

}

/**
 * Holds pod-level security attributes and common container settings.
 */
export class PodSecurityContext {

  public readonly ensureNonRoot: boolean;
  public readonly user?: number;
  public readonly group?: number;
  public readonly fsGroup?: number;
  public readonly fsGroupChangePolicy: FsGroupChangePolicy;

  private readonly _sysctls: Sysctl[] = [];

  constructor(props: PodSecurityContextProps = {}) {
    this.ensureNonRoot = props.ensureNonRoot ?? true;
    this.fsGroupChangePolicy = props.fsGroupChangePolicy ?? FsGroupChangePolicy.ALWAYS;
    this.user = props.user;
    this.group = props.group;
    this.fsGroup = props.fsGroup;

    for (const sysctl of props.sysctls ?? []) {
      this._sysctls.push(sysctl);
    }

  }

  public get sysctls(): Sysctl[] {
    return [...this._sysctls];
  }

  /**
   * @internal
   */
  public _toKube(): k8s.PodSecurityContext {
    return {
      runAsGroup: this.group,
      runAsUser: this.user,
      fsGroup: this.fsGroup,
      runAsNonRoot: this.ensureNonRoot,
      fsGroupChangePolicy: this.fsGroupChangePolicy,
      sysctls: undefinedIfEmpty(this._sysctls),
    };
  }

}

/**
 * Restart policy for all containers within the pod.
 */
export enum RestartPolicy {
  /**
   * Always restart the pod after it exits.
   */
  ALWAYS = 'Always',

  /**
   * Only restart if the pod exits with a non-zero exit code.
   */
  ON_FAILURE = 'OnFailure',

  /**
   * Never restart the pod.
   */
  NEVER = 'Never'
}

export enum FsGroupChangePolicy {

  /**
   * Only change permissions and ownership if permission and ownership of root directory does
   * not match with expected permissions of the volume.
   * This could help shorten the time it takes to change ownership and permission of a volume
   */
  ON_ROOT_MISMATCH = 'OnRootMismatch',

  /**
   * Always change permission and ownership of the volume when volume is mounted.
   */
  ALWAYS = 'Always'
}

/**
 * Custom DNS option.
 */
export interface DnsOption {

  /**
   * Option name.
   */
  readonly name: string;

  /**
   * Option value.
   *
   * @default - No value.
   */
  readonly value?: string;
}

/**
 * Pod DNS policies.
 */
export enum DnsPolicy {

  /**
   * Any DNS query that does not match the configured cluster domain suffix,
   * such as "www.kubernetes.io", is forwarded to the
   * upstream nameserver inherited from the node.
   * Cluster administrators may have extra stub-domain and upstream DNS servers configured.
   */
  CLUSTER_FIRST = 'ClusterFirst',

  /**
   * For Pods running with hostNetwork, you should
   * explicitly set its DNS policy "ClusterFirstWithHostNet".
   */
  CLUSTER_FIRST_WITH_HOST_NET = 'ClusterFirstWithHostNet',

  /**
   * The Pod inherits the name resolution configuration
   * from the node that the pods run on.
   */
  DEFAULT = 'Default',

  /**
   * It allows a Pod to ignore DNS settings from the Kubernetes environment.
   * All DNS settings are supposed to be provided using the dnsConfig
   * field in the Pod Spec.
   */
  NONE = 'None',

}

/**
 * HostAlias holds the mapping between IP and hostnames that will be injected as
 * an entry in the pod's /etc/hosts file.
 */
export interface HostAlias {
  /**
   * Hostnames for the chosen IP address.
   */
  readonly hostnames: string[];

  /**
   * IP address of the host file entry.
   */
  readonly ip: string;
}

/**
 * Represents a query that can be performed against nodes with labels.
 */
export class NodeLabelQuery {

  /**
   * Requires value of label `key` to equal `value`.
   */
  public static is(key: string, value: string) {
    return NodeLabelQuery.in(key, [value]);
  }

  /**
   * Requires value of label `key` to be one of `values`.
   */
  public static in(key: string, values: string[]) {
    return new NodeLabelQuery(key, 'In', values);
  }

  /**
   * Requires value of label `key` to be none of `values`.
   */
  public static notIn(key: string, values: string[]) {
    return new NodeLabelQuery(key, 'NotIn', values);
  }

  /**
   * Requires label `key` to exist.
   */
  public static exists(key: string) {
    return new NodeLabelQuery(key, 'Exists', undefined);
  }

  /**
   * Requires label `key` to not exist.
   */
  public static doesNotExist(key: string) {
    return new NodeLabelQuery(key, 'DoesNotExist', undefined);
  }

  /**
   * Requires value of label `key` to greater than all elements in `values`.
   */
  public static gt(key: string, values: string[]) {
    return new NodeLabelQuery(key, 'Gt', values);
  }

  /**
   * Requires value of label `key` to less than all elements in `values`.
   */
  public static lt(key: string, values: string[]) {
    return new NodeLabelQuery(key, 'Lt', values);
  }

  private constructor(
    private readonly key: string,
    private readonly operator: string,
    private readonly values?: string[]) {
  }

  /**
   * @internal
   */
  public _toKube(): k8s.NodeSelectorRequirement {
    return {
      key: this.key,
      operator: this.operator,
      values: this.values,
    };
  }
}

/**
 * Represents a query that can be performed against resources with labels.
 */
export class LabelExpression {

  /**
   * Requires value of label `key` to be one of `values`.
   */
  public static in(key: string, values: string[]) {
    return new LabelExpression(key, 'In', values);
  }

  /**
   * Requires value of label `key` to be none of `values`.
   */
  public static notIn(key: string, values: string[]) {
    return new LabelExpression(key, 'NotIn', values);
  }

  /**
   * Requires label `key` to exist.
   */
  public static exists(key: string) {
    return new LabelExpression(key, 'Exists', undefined);
  }

  /**
   * Requires label `key` to not exist.
   */
  public static doesNotExist(key: string) {
    return new LabelExpression(key, 'DoesNotExist', undefined);
  }

  private constructor(
    public readonly key: string,
    public readonly operator: string,
    public readonly values?: string[]) {
  }

}

/**
 * Taint effects.
 */
export enum TaintEffect {
  /**
   * This means that no pod will be able to schedule
   * onto the node unless it has a matching toleration.
   */
  NO_SCHEDULE = 'NoSchedule',

  /**
   * This is a "preference" or "soft" version of `NO_SCHEDULE` -- the system
   * will try to avoid placing a pod that does not tolerate the taint on the node,
   * but it is not required
   */
  PREFER_NO_SCHEDULE = 'PreferNoSchedule',

  /**
   * This affects pods that are already running on the node as follows:
   *
   * - Pods that do not tolerate the taint are evicted immediately.
   * - Pods that tolerate the taint without specifying `duration` remain bound forever.
   * - Pods that tolerate the taint with a specified `duration` remain bound for
   *   the specified amount of time.
   */
  NO_EXECUTE = 'NoExecute',
}

/**
 * Options for `NodeTaintQuery`.
 */
export interface NodeTaintQueryOptions {
  /**
   * The taint effect to match.
   *
   * @default - all effects are matched.
   */
  readonly effect?: TaintEffect;

  /**
   * How much time should a pod that tolerates the `NO_EXECUTE` effect
   * be bound to the node. Only applies for the `NO_EXECUTE` effect.
   *
   * @default - bound forever.
   */
  readonly evictAfter?: Duration;
}

/**
 * Taint queries that can be perfomed against nodes.
 */
export class NodeTaintQuery {

  /**
   * Matches a taint with a specific key and value.
   */
  public static is(key: string, value: string, options: NodeTaintQueryOptions = {}): NodeTaintQuery {
    return new NodeTaintQuery('Equal', key, value, options.effect, options.evictAfter);
  }

  /**
   * Matches a tain with any value of a specific key.
   */
  public static exists(key: string, options: NodeTaintQueryOptions = {}): NodeTaintQuery {
    return new NodeTaintQuery('Exists', key, undefined, options.effect, options.evictAfter);
  }

  /**
   * Matches any taint.
   */
  public static any(): NodeTaintQuery {
    return new NodeTaintQuery('Exists');
  }

  private constructor(
    private readonly operator: string,
    private readonly key?: string,
    private readonly value?: string,
    private readonly effect?: TaintEffect,
    private readonly evictAfter?: Duration,
  ) {
    if (evictAfter && effect !== TaintEffect.NO_EXECUTE) {
      throw new Error('Only \'NO_EXECUTE\' effects can specify \'evictAfter\'');
    }
  }

  /**
   * @internal
   */
  public _toKube(): k8s.Toleration {

    return {
      effect: this.effect,
      key: this.key,
      operator: this.operator,
      tolerationSeconds: this.evictAfter?.toSeconds(),
      value: this.value,
    };
  }

}

/**
 * Options for `Pods.all`.
 */
export interface PodsAllOptions {

  /**
   * Namespaces the pods are allowed to be in.
   * Use `Namespaces.all()` to allow all namespaces.
   *
   * @default - unset, implies the namespace of the resource this selection is used in.
   */
  readonly namespaces?: namespace.Namespaces;
}

/**
 * Options for `Pods.select`.
 */
export interface PodsSelectOptions {

  /**
   * Labels the pods must have.
   *
   * @default - no strict labels requirements.
   */
  readonly labels?: { [key: string]: string };

  /**
    * Expressions the pods must satisify.
    *
    * @default - no expressions requirements.
    */
  readonly expressions?: LabelExpression[];

  /**
   * Namespaces the pods are allowed to be in.
   * Use `Namespaces.all()` to allow all namespaces.
   *
   * @default - unset, implies the namespace of the resource this selection is used in.
   */
  readonly namespaces?: namespace.Namespaces;

}

/**
 * Represents a group of pods.
 */
export class Pods extends Construct implements IPodSelector {

  /**
   * Select pods in the cluster with various selectors.
   */
  public static select(scope: Construct, id: string, options: PodsSelectOptions): Pods {
    return new Pods(scope, id, options.expressions, options.labels, options.namespaces);
  }

  /**
   * Select all pods.
   */
  public static all(scope: Construct, id: string, options: PodsAllOptions = {}) {
    return Pods.select(scope, id, { namespaces: options.namespaces });
  }

  constructor(scope: Construct, id: string,
    private readonly expressions?: LabelExpression[],
    private readonly labels?: { [key: string]: string },
    private readonly namespaces?: namespace.INamespaceSelector) {
    super(scope, id);
  }

  /**
   * @see IPodSelector.toPodSelectorConfig()
   */
  public toPodSelectorConfig(): PodSelectorConfig {
    return {
      labelSelector: LabelSelector.of({ expressions: this.expressions, labels: this.labels }),
      namespaces: this.namespaces?.toNamespaceSelectorConfig(),
    };
  }

  /**
   * @see INetworkPolicyPeer.toNetworkPolicyPeerConfig()
   */
  public toNetworkPolicyPeerConfig(): networkpolicy.NetworkPolicyPeerConfig {
    return { podSelector: this.toPodSelectorConfig() };
  }

  /**
   * @see INetworkPolicyPeer.toPodSelector()
   */
  public toPodSelector(): IPodSelector | undefined {
    return this;
  }

}

/**
 * A node that is matched by label selectors.
 */
export class LabeledNode {
  public constructor(public readonly labelSelector: NodeLabelQuery[]) {};
}

/**
 * A node that is matched by taint selectors.
 */
export class TaintedNode {
  public constructor(public readonly taintSelector: NodeTaintQuery[]) {};
}

/**
 * A node that is matched by its name.
 */
export class NamedNode {
  public constructor(public readonly name: string) {};
}

/**
 * Represents a node in the cluster.
 */
export class Node {

  /**
   * Match a node by its labels.
   */
  public static labeled(...labelSelector: NodeLabelQuery[]): LabeledNode {
    return new LabeledNode(labelSelector);
  }

  /**
   * Match a node by its name.
   */
  public static named(nodeName: string): NamedNode {
    return new NamedNode(nodeName);
  }

  /**
   * Match a node by its taints.
   */
  public static tainted(...taintSelector: NodeTaintQuery[]): TaintedNode {
    return new TaintedNode(taintSelector);
  }

}

/**
 * Available topology domains.
 */
export class Topology {

  /**
   * A hostname represents a single node in the cluster.
   *
   * @see https://kubernetes.io/docs/reference/labels-annotations-taints/#kubernetesiohostname
   */
  public static readonly HOSTNAME = new Topology('kubernetes.io/hostname');

  /**
   * A zone represents a logical failure domain. It is common for Kubernetes clusters to
   * span multiple zones for increased availability. While the exact definition of a zone is
   * left to infrastructure implementations, common properties of a zone include very low
   * network latency within a zone, no-cost network traffic within a zone, and failure
   * independence from other zones. For example, nodes within a zone might share a network
   * switch, but nodes in different zones should not.
   *
   * @see https://kubernetes.io/docs/reference/labels-annotations-taints/#topologykubernetesiozone
   */
  public static readonly ZONE = new Topology('topology.kubernetes.io/zone');

  /**
   * A region represents a larger domain, made up of one or more zones. It is uncommon
   * for Kubernetes clusters to span multiple regions. While the exact definition of a
   * zone or region is left to infrastructure implementations, common properties of a region
   * include higher network latency between them than within them, non-zero cost for network
   * traffic between them, and failure independence from other zones or regions.
   *
   * For example, nodes within a region might share power infrastructure (e.g. a UPS or generator), but
   * nodes in different regions typically would not.
   *
   * @see https://kubernetes.io/docs/reference/labels-annotations-taints/#topologykubernetesioregion
   */
  public static readonly REGION = new Topology('topology.kubernetes.io/region');

  /**
   * Custom key for the node label that the system uses to denote the topology domain.
   */
  public static custom(key: string): Topology {
    return new Topology(key);
  }

  private constructor(public readonly key: string) {};
}

/**
 * Options for `PodScheduling.colocate`.
 */
export interface PodSchedulingColocateOptions {
  /**
   * Which topology to coloate on.
   *
   * @default - Topology.HOSTNAME
   */
  readonly topology?: Topology;

  /**
   * Indicates the co-location is optional (soft), with this weight score.
   *
   * @default - no weight. co-location is assumed to be required (hard).
   */
  readonly weight?: number;
}

/**
 * Options for `PodScheduling.separate`.
 */
export interface PodSchedulingSeparateOptions {
  /**
   * Which topology to separate on.
   *
   * @default - Topology.HOSTNAME
   */
  readonly topology?: Topology;

  /**
   * Indicates the separation is optional (soft), with this weight score.
   *
   * @default - no weight. separation is assumed to be required (hard).
   */
  readonly weight?: number;
}

/**
 * Options for `PodScheduling.attract`.
 */
export interface PodSchedulingAttractOptions {
  /**
   * Indicates the attraction is optional (soft), with this weight score.
   *
   * @default - no weight. assignment is assumed to be required (hard).
   */
  readonly weight?: number;
}

/**
 * Controls the pod scheduling strategy.
 */
export class PodScheduling {

  private _nodeAffinityPreferred: k8s.PreferredSchedulingTerm[] = [];
  private _nodeAffinityRequired: k8s.NodeSelectorTerm[] = [];
  private _podAffinityPreferred: k8s.WeightedPodAffinityTerm[] = [];
  private _podAffinityRequired: k8s.PodAffinityTerm[] = [];
  private _podAntiAffinityPreferred: k8s.WeightedPodAffinityTerm[] = [];
  private _podAntiAffinityRequired: k8s.PodAffinityTerm[] = [];
  private _tolerations: k8s.Toleration[] = [];
  private _nodeName?: string;

  constructor(protected readonly instance: AbstractPod) {}

  /**
   * Assign this pod a specific node by name.
   *
   * The scheduler ignores the Pod, and the kubelet on the named node
   * tries to place the Pod on that node. Overrules any affinity rules of the pod.
   *
   * Some limitations of static assignment are:
   *
   * - If the named node does not exist, the Pod will not run, and in some
   *   cases may be automatically deleted.
   * - If the named node does not have the resources to accommodate the Pod,
   *   the Pod will fail and its reason will indicate why, for example OutOfmemory or OutOfcpu.
   * - Node names in cloud environments are not always predictable or stable.
   *
   * Will throw is the pod is already assigned to named node.
   *
   * Under the hood, this method utilizes the `nodeName` property.
   */
  public assign(node: NamedNode) {

    if (this._nodeName) {
      // disallow overriding an static node assignment
      throw new Error(`Cannot assign ${this.instance.podMetadata.name} to node ${node.name}. It is already assigned to node ${this._nodeName}`);
    } else {
      this._nodeName = node.name;
    }
  }

  /**
   * Allow this pod to tolerate taints matching these tolerations.
   *
   * You can put multiple taints on the same node and multiple tolerations on the same pod.
   * The way Kubernetes processes multiple taints and tolerations is like a filter: start with
   * all of a node's taints, then ignore the ones for which the pod has a matching toleration;
   * the remaining un-ignored taints have the indicated effects on the pod. In particular:
   *
   * - if there is at least one un-ignored taint with effect NoSchedule then Kubernetes will
   *   not schedule the pod onto that node
   * - if there is no un-ignored taint with effect NoSchedule but there is at least one un-ignored
   *   taint with effect PreferNoSchedule then Kubernetes will try to not schedule the pod onto the node
   * - if there is at least one un-ignored taint with effect NoExecute then the pod will be evicted from
   *   the node (if it is already running on the node), and will not be scheduled onto the node (if it is
   *   not yet running on the node).
   *
   * Under the hood, this method utilizes the `tolerations` property.
   *
   * @see https://kubernetes.io/docs/concepts/scheduling-eviction/taint-and-toleration/
   */
  public tolerate(node: TaintedNode) {
    for (const query of node.taintSelector) {
      this._tolerations.push(query._toKube());
    }
  }

  /**
   * Attract this pod to a node matched by selectors.
   * You can select a node by using `Node.labeled()`.
   *
   * Attracting to multiple nodes (i.e invoking this method multiple times) acts as
   * an OR condition, meaning the pod will be assigned to either one of the nodes.
   *
   * Under the hood, this method utilizes the `nodeAffinity` property.
   *
   * @see https://kubernetes.io/docs/concepts/scheduling-eviction/assign-pod-node/#node-affinity
   */
  public attract(node: LabeledNode, options: PodSchedulingAttractOptions = {}) {

    const term = this.createNodeAffinityTerm(node);

    if (options.weight) {
      this.validateWeight(options.weight);
      this._nodeAffinityPreferred.push({ weight: options.weight, preference: term });
    } else {
      this._nodeAffinityRequired.push(term);
    }
  }

  /**
   * Co-locate this pod with a scheduling selection.
   *
   * A selection can be one of:
   *
   * - An instance of a `Pod`.
   * - An instance of a `Workload` (e.g `Deployment`, `StatefulSet`).
   * - An un-managed pod that can be selected via `Pods.select()`.
   *
   * Co-locating with multiple selections ((i.e invoking this method multiple times)) acts as
   * an AND condition. meaning the pod will be assigned to a node that satisfies all
   * selections (i.e runs at least one pod that satisifies each selection).
   *
   * Under the hood, this method utilizes the `podAffinity` property.
   *
   * @see https://kubernetes.io/docs/concepts/scheduling-eviction/assign-pod-node/#inter-pod-affinity-and-anti-affinity
   */
  public colocate(selector: IPodSelector, options: PodSchedulingColocateOptions = {}) {

    const topology = options.topology ?? Topology.HOSTNAME;
    const term = this.createPodAffinityTerm(topology, selector);

    if (options.weight) {
      this.validateWeight(options.weight);
      this._podAffinityPreferred.push({ weight: options.weight, podAffinityTerm: term });
    } else {
      this._podAffinityRequired.push(term);
    }
  }

  /**
   * Seperate this pod from a scheduling selection.
   *
   * A selection can be one of:
   *
   * - An instance of a `Pod`.
   * - An instance of a `Workload` (e.g `Deployment`, `StatefulSet`).
   * - An un-managed pod that can be selected via `Pods.select()`.
   *
   * Seperating from multiple selections acts as an AND condition. meaning the pod
   * will not be assigned to a node that satisfies all selections (i.e runs at least one pod that satisifies each selection).
   *
   * Under the hood, this method utilizes the `podAntiAffinity` property.
   *
   * @see https://kubernetes.io/docs/concepts/scheduling-eviction/assign-pod-node/#inter-pod-affinity-and-anti-affinity
   */
  public separate(selector: IPodSelector, options: PodSchedulingSeparateOptions = {}) {

    const topology = options.topology ?? Topology.HOSTNAME;
    const term = this.createPodAffinityTerm(topology, selector);

    if (options.weight) {
      this.validateWeight(options.weight);
      this._podAntiAffinityPreferred.push({ weight: options.weight, podAffinityTerm: term });
    } else {
      this._podAntiAffinityRequired.push(term);
    }

  }

  private createPodAffinityTerm(topology: Topology, selector: IPodSelector): k8s.PodAffinityTerm {
    const config = selector.toPodSelectorConfig();
    return {
      topologyKey: topology.key,
      labelSelector: config.labelSelector._toKube(),
      namespaceSelector: config.namespaces?.labelSelector?._toKube(),
      namespaces: config.namespaces?.names,
    };
  }

  private createNodeAffinityTerm(node: LabeledNode): k8s.NodeSelectorTerm {
    return { matchExpressions: node.labelSelector.map(s => s._toKube()) };
  }

  private validateWeight(weight: number) {
    if (weight < 1 || weight > 100) {
      // https://kubernetes.io/docs/concepts/scheduling-eviction/assign-pod-node/#node-affinity-weight
      throw new Error(`Invalid affinity weight: ${weight}. Must be in range 1-100`);
    }
  }

  /**
   * @internal
   */
  public _toKube(): { affinity?: k8s.Affinity; nodeName?: string; tolerations?: k8s.Toleration[] } {

    const atLeastOne = (...arrays: Array<any>[]) => {
      return arrays.flat().length > 0;
    };

    const hasNodeAffinity = atLeastOne(this._nodeAffinityPreferred, this._nodeAffinityRequired);
    const hasPodAffinity = atLeastOne(this._podAffinityPreferred, this._podAffinityRequired);
    const hasPodAntiAffinty = atLeastOne(this._podAntiAffinityPreferred, this._podAntiAffinityRequired);
    const hasAffinity = hasNodeAffinity || hasPodAffinity || hasPodAntiAffinty;

    return {
      affinity: hasAffinity ? {
        nodeAffinity: hasNodeAffinity ? {
          preferredDuringSchedulingIgnoredDuringExecution: undefinedIfEmpty(this._nodeAffinityPreferred),
          requiredDuringSchedulingIgnoredDuringExecution: this._nodeAffinityRequired.length > 0 ? {
            nodeSelectorTerms: this._nodeAffinityRequired,
          } : undefined,
        } : undefined,
        podAffinity: hasPodAffinity ? {
          preferredDuringSchedulingIgnoredDuringExecution: undefinedIfEmpty(this._podAffinityPreferred),
          requiredDuringSchedulingIgnoredDuringExecution: undefinedIfEmpty(this._podAffinityRequired),
        } : undefined,
        podAntiAffinity: hasPodAntiAffinty ? {
          preferredDuringSchedulingIgnoredDuringExecution: undefinedIfEmpty(this._podAntiAffinityPreferred),
          requiredDuringSchedulingIgnoredDuringExecution: undefinedIfEmpty(this._podAntiAffinityRequired),
        } : undefined,
      } : undefined,
      nodeName: this._nodeName,
      tolerations: undefinedIfEmpty(this._tolerations),
    };
  }
}

/**
 * Isolation determines which policies are created
 * when allowing connections from a a pod / workload to peers.
 */
export enum PodConnectionsIsolation {

  /**
   * Only creates network policies that select the pod.
   */
  POD = 'POD',

  /**
   * Only creates network policies that select the peer.
   */
  PEER = 'PEER',

}

/**
 * Options for `PodConnections.allowTo`.
 */
export interface PodConnectionsAllowToOptions {

  /**
   * Which isolation should be applied to establish the connection.
   *
   * @default - unset, isolates both the pod and the peer.
   */
  readonly isolation?: PodConnectionsIsolation;

  /**
   * Ports to allow outgoing traffic to.
   *
   * @default - If the peer is a managed pod, take its ports. Otherwise, all ports are allowed.
   */
  readonly ports?: networkpolicy.NetworkPolicyPort[];

}

/**
 * Options for `PodConnections.allowFrom`.
 */
export interface PodConnectionsAllowFromOptions {

  /**
   * Which isolation should be applied to establish the connection.
   *
   * @default - unset, isolates both the pod and the peer.
   */
  readonly isolation?: PodConnectionsIsolation;

  /**
   * Ports to allow incoming traffic to.
   *
   * @default - The pod ports.
   */
  readonly ports?: networkpolicy.NetworkPolicyPort[];

}

/**
 * Controls network isolation rules for inter-pod communication.
 */
export class PodConnections {

  constructor(protected readonly instance: AbstractPod) {}

  /**
   * Allow network traffic from this pod to the peer.
   *
   * By default, this will create an egress network policy for this pod, and an ingress
   * network policy for the peer. This is required if both sides are already isolated.
   * Use `options.isolation` to control this behavior.
   *
   * @example
   *
   * // create only an egress policy that selects the 'web' pod to allow outgoing traffic
   * // to the 'redis' pod. this requires the 'redis' pod to not be isolated for ingress.
   * web.connections.allowTo(redis, { isolation: Isolation.POD })
   *
   * // create only an ingress policy that selects the 'redis' peer to allow incoming traffic
   * // from the 'web' pod. this requires the 'web' pod to not be isolated for egress.
   * web.connections.allowTo(redis, { isolation: Isolation.PEER })
   *
   */
  public allowTo(peer: networkpolicy.INetworkPolicyPeer, options: PodConnectionsAllowToOptions = {}) {
    return this.allow('Egress', peer, { ports: this.extractPorts(peer), ...options });
  }

  /**
   * Allow network traffic from the peer to this pod.
   *
   * By default, this will create an ingress network policy for this pod, and an egress
   * network policy for the peer. This is required if both sides are already isolated.
   * Use `options.isolation` to control this behavior.
   *
   * @example
   *
   * // create only an egress policy that selects the 'web' pod to allow outgoing traffic
   * // to the 'redis' pod. this requires the 'redis' pod to not be isolated for ingress.
   * redis.connections.allowFrom(web, { isolation: Isolation.PEER })
   *
   * // create only an ingress policy that selects the 'redis' peer to allow incoming traffic
   * // from the 'web' pod. this requires the 'web' pod to not be isolated for egress.
   * redis.connections.allowFrom(web, { isolation: Isolation.POD })
   *
   */
  public allowFrom(peer: networkpolicy.INetworkPolicyPeer, options: PodConnectionsAllowFromOptions = {}) {
    return this.allow('Ingress', peer, { ports: this.extractPorts(this.instance), ...options });
  }

  private allow(direction: 'Ingress' | 'Egress', peer: networkpolicy.INetworkPolicyPeer, options: PodConnectionsAllowToOptions | PodConnectionsAllowFromOptions = {}) {

    const config = peer.toNetworkPolicyPeerConfig();
    networkpolicy.validatePeerConfig(config);

    const peerAddress = address(peer);

    if (!options.isolation || options.isolation === PodConnectionsIsolation.POD) {

      const src = new networkpolicy.NetworkPolicy(this.instance, `Allow${direction}${peerAddress}`, {
        selector: this.instance,
        // the policy must be defined in the namespace of the pod
        // so it can select it.
        metadata: { namespace: this.instance.metadata.namespace },
      });

      switch (direction) {
        case 'Egress':
          src.addEgressRule(peer, options.ports);
          break;
        case 'Ingress':
          src.addIngressRule(peer, options.ports);
      }

    }

    if (!options.isolation || options.isolation === PodConnectionsIsolation.PEER) {

      if (config.ipBlock) {
        // for an ip block we don't need to create the opposite policies
        return;
      }

      const podSelector = peer.toPodSelector();
      if (!podSelector) {
        throw new Error(`Unable to create policies for peer '${peer.node.addr}' since its not a pod selector`);
      }

      const oppositeDirection = direction === 'Egress' ? 'Ingress' : 'Egress';

      const podSelectorConfig = podSelector.toPodSelectorConfig();
      let namespaces: (string | undefined)[];

      if (!podSelectorConfig.namespaces) {

        // if the peer doesn't specify namespaces, we assume the same namespace.
        namespaces = [this.instance.metadata.namespace];

      } else {

        // a peer cannot specify namespaces by labels because
        // we won't be able to extract the names of those namespaces.
        if (podSelectorConfig.namespaces.labelSelector && !podSelectorConfig.namespaces.labelSelector.isEmpty()) {
          throw new Error(`Unable to create an ${oppositeDirection} policy for peer '${peer.node.path}' (pod=${this.instance.name}). Peer must specify namespaces only by name`);
        }

        // a peer must specify namespaces by name.
        if (!podSelectorConfig.namespaces.names) {
          throw new Error(`Unable to create an ${oppositeDirection} policy for peer '${peer.node.path}' (pod=${this.instance.name}). Peer must specify namespace names`);
        }

        namespaces = podSelectorConfig.namespaces.names;
      }

      for (const name of namespaces) {
        switch (direction) {
          case 'Egress':
            new networkpolicy.NetworkPolicy(this.instance, `AllowIngress${name}${peerAddress}`, {
              selector: podSelector,
              metadata: { namespace: name },
              ingress: { rules: [{ peer: this.instance, ports: options.ports }] },
            });
            break;
          case 'Ingress':
            new networkpolicy.NetworkPolicy(this.instance, `AllowEgress${name}${peerAddress}`, {
              selector: podSelector,
              metadata: { namespace: name },
              egress: { rules: [{ peer: this.instance, ports: options.ports }] },
            });
            break;
          default:
            throw new Error(`Unsupported direction: ${direction}`);
        }
      }

    }
  }

  private extractPorts(selector?: networkpolicy.INetworkPolicyPeer): networkpolicy.NetworkPolicyPort[] {
    return container.extractContainerPorts(selector).map(n => networkpolicy.NetworkPolicyPort.tcp(n.number));
  }

  /**
   * Sets the default network policy for Pod/Workload to have all egress and ingress connections as disabled
   */
  public isolate() {
    new networkpolicy.NetworkPolicy(this.instance, 'DefaultDenyAll', {
      selector: this.instance,
      // the policy must be defined in the namespace of the pod
      // so it can select it.
      metadata: { namespace: this.instance.metadata.namespace },
      egress: {
        default: networkpolicy.NetworkPolicyTrafficDefault.DENY,
      },
      ingress: {
        default: networkpolicy.NetworkPolicyTrafficDefault.DENY,
      },
    });
  }
}
