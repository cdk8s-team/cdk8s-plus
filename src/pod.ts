import { ApiObject, ApiObjectMetadataDefinition, Lazy } from 'cdk8s';
import { Construct } from 'constructs';
import * as base from './base';
import * as container from './container';
import * as k8s from './imports/k8s';
import * as secret from './secret';
import * as serviceaccount from './service-account';
import * as volume from './volume';

export abstract class AbstractPod extends base.Resource {

  public readonly restartPolicy?: RestartPolicy;
  public readonly serviceAccount?: serviceaccount.IServiceAccount;
  public readonly securityContext: PodSecurityContext;
  public readonly dns: PodDns;
  public readonly dockerRegistryAuth?: secret.DockerConfigSecret;
  public readonly automountServiceAccountToken: boolean;

  private readonly _containers: container.Container[] = [];
  private readonly _initContainers: container.Container[] = [];
  private readonly _hostAliases: HostAlias[] = [];
  private readonly _volumes: Map<string, volume.Volume> = new Map();

  constructor(scope: Construct, id: string, props: AbstractPodProps = {}) {
    super(scope, id);

    this.restartPolicy = props.restartPolicy;
    this.serviceAccount = props.serviceAccount;
    this.securityContext = new PodSecurityContext(props.securityContext);
    this.dns = new PodDns(props.dns);
    this.dockerRegistryAuth = props.dockerRegistryAuth;
    this.automountServiceAccountToken = props.automountServiceAccountToken ?? true;

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

  public addContainer(cont: container.ContainerProps): container.Container {
    const impl = new container.Container(cont);
    this._containers.push(impl);
    return impl;
  }

  public addInitContainer(cont: container.ContainerProps): container.Container {

    // https://kubernetes.io/docs/concepts/workloads/pods/init-containers/#differences-from-regular-containers
    if (cont.readiness) {
      throw new Error('Init containers must not have a readiness probe');
    }

    if (cont.liveness) {
      throw new Error('Init containers must not have a liveness probe');
    }

    if (cont.startup) {
      throw new Error('Init containers must not have a startup probe');
    }

    const impl = new container.Container({
      ...cont,
      name: cont.name ?? `init-${this._initContainers.length}`,
    });

    this._initContainers.push(impl);
    return impl;
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
      securityContext: this.securityContext._toKube(),
      initContainers: initContainers,
      hostAliases: this.hostAliases,
      volumes: Array.from(volumes.values()).map(v => v._toKube()),
      dnsPolicy: dns.policy,
      dnsConfig: dns.config,
      hostname: dns.hostname,
      subdomain: dns.subdomain,
      setHostnameAsFqdn: dns.hostnameAsFQDN,
      imagePullSecrets: this.dockerRegistryAuth ? [{ name: this.dockerRegistryAuth.name }] : undefined,
      automountServiceAccountToken: this.automountServiceAccountToken,
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
   * @default false
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
   *   ensureNonRoot: false
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
  readonly dockerRegistryAuth?: secret.DockerConfigSecret;

  /**
   * Indicates whether a service account token should be automatically mounted.
   *
   * @default true
   * @see https://kubernetes.io/docs/tasks/configure-pod-container/configure-service-account/#use-the-default-service-account-to-access-the-api-server
   */
  readonly automountServiceAccountToken?: boolean;

}

/**
 * Properties for `Pod`.
 */
export interface PodProps extends AbstractPodProps {}

/**
 * Represents a pod that can be selected during scheduling.
 */
export interface IPodSchedulingSelection {
  /**
   * List of label queries that the pod labels need to satisfy.
   */
  readonly labelSelector?: PodLabelQuery[];

  /**
   * List of label queries that the pod namespace needs to satisfy.
   */
  readonly namespaceSelector?: PodLabelQuery[];

  /**
   * Static list of namespaces the pods can belong to.
   */
  readonly namespaces?: string[];
}

/**
 * Pod is a collection of containers that can run on a host. This resource is
 * created by clients and scheduled onto hosts.
 */
export class Pod extends AbstractPod implements IPodSchedulingSelection {

  /**
   * Create a selector for selecting pods by queries.
   */
  public static select(selection: IPodSchedulingSelection): IPodSchedulingSelection {
    // this seems strange, I know.
    // it's like this solely for API consistency with `Node.select`.
    return selection;
  }

  /**
   * @see base.Resource.apiObject
   */
  protected readonly apiObject: ApiObject;

  public readonly scheduling: PodScheduling;

  constructor(scope: Construct, id: string, props: PodProps = {}) {
    super(scope, id, props);

    this.apiObject = new k8s.KubePod(this, 'Resource', {
      metadata: props.metadata,
      spec: Lazy.any({ produce: () => this._toKube() }),
    });

    this.scheduling = new PodScheduling(this.metadata);

  }

  public get podMetadata(): ApiObjectMetadataDefinition {
    return this.metadata;
  }

  public get namespaces(): string[] | undefined {
    return this.metadata.namespace ? [this.metadata.namespace] : [];
  }

  public get namespaceSelector(): PodLabelQuery[] | undefined {
    return undefined;
  }

  public get labelSelector(): PodLabelQuery[] | undefined {
    return Object.keys(this.metadata.toJson().labels).map(l => PodLabelQuery.is(l, this.metadata.getLabel(l)!));
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
  public _toKube(): { hostname?: string; subdomain?: string; hostnameAsFQDN: boolean; policy: string; config: k8s.PodDnsConfig } {

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
        nameservers: this.nameservers,
        searches: this.searches,
        options: this.options,
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
    this.ensureNonRoot = props.ensureNonRoot ?? false;
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
      sysctls: this._sysctls,
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
 * Label queries that can be perofmed against nodes.
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
    public readonly key: string,
    public readonly operator: string,
    public readonly values?: string[]) {
  }
}

/**
 * Label queries that can be perofmed against pods.
 */
export class PodLabelQuery {

  /**
   * Requires value of label `key` to equal `value`.
   */
  public static is(key: string, value: string) {
    return PodLabelQuery.in(key, [value]);
  }

  /**
   * Requires value of label `key` to be one of `values`.
   */
  public static in(key: string, values: string[]) {
    return new PodLabelQuery(key, 'In', values);
  }

  /**
   * Requires value of label `key` to be none of `values`.
   */
  public static notIn(key: string, values: string[]) {
    return new PodLabelQuery(key, 'NotIn', values);
  }

  /**
   * Requires label `key` to exist.
   */
  public static exists(key: string) {
    return new PodLabelQuery(key, 'Exists', undefined);
  }

  /**
   * Requires label `key` to not exist.
   */
  public static doesNotExist(key: string) {
    return new PodLabelQuery(key, 'DoesNotExist', undefined);
  }

  private constructor(
    public readonly key: string,
    public readonly operator: string,
    public readonly values?: string[]) {
  }
}

/**
 * Represents a node in the cluster.
 */
export class Node {

  /**
   * Select a node based on node label queries.
   */
  public static select(...labelSelector: NodeLabelQuery[]): SelectedNode {
    return new SelectedNode(labelSelector);
  }

  /**
   * Select a node based on the node name.
   */
  public static named(nodeName: string): NamedNode {
    return new NamedNode(nodeName);
  }

}

/**
 * A node that is matched by selectors.
 */
export class SelectedNode {

  public constructor(public readonly labelSelector: NodeLabelQuery[]) {};

}

/**
 * A specific node matched by name.
 */
export class NamedNode {

  public constructor(public readonly name: string) {};
}

/**
 * A key for the node label that the system uses to denote the topology domain.
 */
export class TopologyKey {

  /**
   * A hostname represents a single node in the cluster.
   *
   * @see https://kubernetes.io/docs/reference/labels-annotations-taints/#kubernetesiohostname
   */
  public static readonly HOSTNAME = new TopologyKey('kubernetes.io/hostname');

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
  public static readonly ZONE = new TopologyKey('topology.kubernetes.io/zone');

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
  public static readonly REGION = new TopologyKey('topology.kubernetes.io/region');

  /**
   * Custom topology key.
   */
  public static custom(key: string): TopologyKey {
    return new TopologyKey(key);
  }

  private constructor(public readonly key: string) {};
}

/**
 * Options for `PodScheduling.coloate`.
 */
export interface PodSchedulingColocateOptions {
  /**
   * Which topology to coloate on.
   *
   * @default - TopologyKey.HOSTNAME
   */
  readonly topologyKey?: TopologyKey;

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
   * Which topology to coloate on.
   *
   * @default - TopologyKey.HOSTNAME
   */
  readonly topologyKey?: TopologyKey;

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

  private _affinity?: k8s.Affinity;
  private _nodeName?: string;

  constructor(protected readonly podMetadata: ApiObjectMetadataDefinition) {
    this._affinity = {
      nodeAffinity: {
        preferredDuringSchedulingIgnoredDuringExecution: [],
        requiredDuringSchedulingIgnoredDuringExecution: {
          nodeSelectorTerms: [],
        },
      },
      podAffinity: {
        preferredDuringSchedulingIgnoredDuringExecution: [],
        requiredDuringSchedulingIgnoredDuringExecution: [],
      },
      podAntiAffinity: {
        preferredDuringSchedulingIgnoredDuringExecution: [],
        requiredDuringSchedulingIgnoredDuringExecution: [],
      },
    };
  }

  private get affinity(): k8s.Affinity {
    if (!this._affinity) {
      this._affinity = {
        nodeAffinity: {
          preferredDuringSchedulingIgnoredDuringExecution: [],
          requiredDuringSchedulingIgnoredDuringExecution: {
            nodeSelectorTerms: [],
          },
        },
        podAffinity: {
          preferredDuringSchedulingIgnoredDuringExecution: [],
          requiredDuringSchedulingIgnoredDuringExecution: [],
        },
        podAntiAffinity: {
          preferredDuringSchedulingIgnoredDuringExecution: [],
          requiredDuringSchedulingIgnoredDuringExecution: [],
        },
      };
    }
    return this._affinity;
  }

  /**
   * Assign this pod a specific node by name.
   *
   * Under the hood, this method utilizes the `nodeName` property.
   */
  public assign(node: NamedNode) {

    if (node.name && this._nodeName) {
      if (this._nodeName) {
        // disallow overriding an static node assignment
        throw new Error(`Cannot assign ${this.podMetadata.name} to node ${node.name}. It is already assigned to node ${this._nodeName}`);
      }
      this._nodeName = node.name;
    }
  }

  /**
   * Attract this pod to a node matched by selectors.
   * You can select a node by using `Node.select()`.
   *
   * Attracting to multiple nodes (i.e invoking this method multiple times) acts as
   * an OR condition, meaning the pod will be assigned to either one of the nodes.
   *
   * Under the hood, this method utilizes the `nodeAffinity` property.
   *
   * @see https://kubernetes.io/docs/concepts/scheduling-eviction/assign-pod-node/#node-affinity
   */
  public attract(node: SelectedNode, options: PodSchedulingAttractOptions = {}) {

    const term = this.createNodeAffinityTerm(node);

    if (options.weight) {
      this.validateWeight(options.weight);
      this.affinity.nodeAffinity?.preferredDuringSchedulingIgnoredDuringExecution?.push({ weight: options.weight, preference: term });
    } else {
      this.affinity.nodeAffinity?.requiredDuringSchedulingIgnoredDuringExecution?.nodeSelectorTerms.push(term);
    }
  }

  /**
   * Co-locate this pod with a scheduling selection.
   *
   * A selection can be one of:
   *
   * - An instance of a `Pod`.
   * - An instance of a `Workload` (e.g `Deployment`, `StatefulSet`).
   * - An un-managed pod that can be selected via `Pod.select()`.
   *
   * Co-locating with multiple selections acts as an AND condition. meaning the pod
   * will be assigned to a node that satisfies all selections (i.e runs at least one pod that satisifies each selection).
   *
   * Under the hood, this method utilizes the `podAffinity` property.
   *
   * @see https://kubernetes.io/docs/concepts/scheduling-eviction/assign-pod-node/#inter-pod-affinity-and-anti-affinity
   */
  public colocate(selection: IPodSchedulingSelection, options: PodSchedulingColocateOptions = {}) {

    const topologyKey = options.topologyKey ?? TopologyKey.HOSTNAME;
    const term = this.createPodAffinityTerm(topologyKey, selection);

    if (options.weight) {
      this.validateWeight(options.weight);
      this.affinity.podAffinity?.preferredDuringSchedulingIgnoredDuringExecution?.push({ weight: options.weight, podAffinityTerm: term });
    } else {
      this.affinity.podAffinity?.requiredDuringSchedulingIgnoredDuringExecution?.push(term);
    }
  }

  /**
   * Seperate this pod from a scheduling selection.
   *
   * A selection can be one of:
   *
   * - An instance of a `Pod`.
   * - An instance of a `Workload` (e.g `Deployment`, `StatefulSet`).
   * - An un-managed pod that can be selected via `Pod.select()`.
   *
   * Seperating from multiple selections acts as an AND condition. meaning the pod
   * will not be assigned to a node that satisfies all selections (i.e runs at least one pod that satisifies each selection).
   *
   * Under the hood, this method utilizes the `podAntiAffinity` property.
   *
   * @see https://kubernetes.io/docs/concepts/scheduling-eviction/assign-pod-node/#inter-pod-affinity-and-anti-affinity
   */
  public separate(selectable: IPodSchedulingSelection, options: PodSchedulingSeparateOptions = {}) {

    const topologyKey = options.topologyKey ?? TopologyKey.HOSTNAME;
    const term = this.createPodAffinityTerm(topologyKey, selectable);

    if (options.weight) {
      this.validateWeight(options.weight);
      this.affinity.podAntiAffinity?.preferredDuringSchedulingIgnoredDuringExecution?.push({ weight: options.weight, podAffinityTerm: term });
    } else {
      this.affinity.podAntiAffinity?.requiredDuringSchedulingIgnoredDuringExecution?.push(term);
    }

  }

  private createPodAffinityTerm(topologyKey: TopologyKey, selectable: IPodSchedulingSelection): k8s.PodAffinityTerm {
    return {
      topologyKey: topologyKey.key,
      namespaces: selectable.namespaces,
      labelSelector: selectable.labelSelector ? {
        matchExpressions: selectable.labelSelector.map(s => ({ key: s.key, operator: s.operator!, values: s.values })),
      } : undefined,
      namespaceSelector: selectable.namespaceSelector ? {
        matchExpressions: selectable.namespaceSelector.map(s => ({ key: s.key, operator: s.operator!, values: s.values })),
      } : undefined,
    };
  }

  private createNodeAffinityTerm(node: SelectedNode): k8s.NodeSelectorTerm {
    return { matchExpressions: node.labelSelector.map(s => ({ key: s.key, operator: s.operator!, values: s.values })) };
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
  public _toKube(): { affinity?: k8s.Affinity; nodeName?: string } {
    return { affinity: this._affinity, nodeName: this._nodeName };
  }
}
