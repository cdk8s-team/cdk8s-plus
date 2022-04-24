import { ApiObject, ApiObjectMetadata, ApiObjectMetadataDefinition, Lazy } from 'cdk8s';
import { Construct } from 'constructs';
import { ResourceProps, Resource } from './base';
import { Container, ContainerProps } from './container';
import * as k8s from './imports/k8s';
import { DockerConfigSecret } from './secret';
import { IServiceAccount } from './service-account';
import { Volume } from './volume';

/**
 * Represents a resource that can be configured with a kuberenets pod spec. (e.g `Deployment`, `Job`, `Pod`, ...).
 *
 * Use the `PodSpec` class as an implementation helper.
 */
export interface IPodSpec {

  /**
   * The containers belonging to the pod.
   *
   * Use `addContainer` to add containers.
   */
  readonly containers: Container[];

  /**
   * The init containers belonging to the pod.
   *
   * Use `addInitContainer` to add init containers.
   */
  readonly initContainers: Container[];

  /**
   * The volumes associated with this pod.
   *
   * Use `addVolume` to add volumes.
   */
  readonly volumes: Volume[];

  /**
   * Restart policy for all containers within the pod.
   */
  readonly restartPolicy?: RestartPolicy;

  /**
   * The service account used to run this pod.
   */
  readonly serviceAccount?: IServiceAccount;

  /**
   * An optional list of hosts and IPs that will be injected into the pod's
   * hosts file if specified. This is only valid for non-hostNetwork pods.
   */
  readonly hostAliases: HostAlias[];

  /**
   * The pod's DNS settings.
   */
  readonly dns: PodDns;

  /**
   * The pod's security context.
   */
  readonly securityContext: PodSecurityContext;

  /**
   * Add a container to the pod.
   *
   * @param container The container.
   */
  addContainer(container: ContainerProps): Container;

  /**
   * Add an init container to the pod.
   *
   * @param container The container.
   */
  addInitContainer(container: ContainerProps): Container;

  /**
   * Add a volume to the pod.
   *
   * @param volume The volume.
   */
  addVolume(volume: Volume): void;

}

/**
 * Represents a resource that can be configured with a kuberenets pod template. (e.g `Deployment`, `Job`, ...).
 *
 * Use the `PodTemplate` class as an implementation helper.
 */
export interface IPodTemplate extends IPodSpec {

  /**
   * Provides read/write access to the underlying pod metadata of the resource.
   */
  readonly podMetadata: ApiObjectMetadataDefinition;
}

/**
 * Provides read/write capabilities ontop of a `PodSpecProps`.
 */
export class PodSpec implements IPodSpec {

  public readonly restartPolicy?: RestartPolicy;
  public readonly serviceAccount?: IServiceAccount;
  public readonly securityContext: PodSecurityContext;
  public readonly dns: PodDns;
  public readonly dockerRegistryAuth?: DockerConfigSecret;

  private readonly _containers: Container[] = [];
  private readonly _initContainers: Container[] = [];
  private readonly _hostAliases: HostAlias[] = [];
  private readonly _volumes: Map<string, Volume> = new Map();

  constructor(props: PodSpecProps = {}) {
    this.restartPolicy = props.restartPolicy;
    this.serviceAccount = props.serviceAccount;
    this.securityContext = new PodSecurityContext(props.securityContext);
    this.dns = new PodDns(props.dns);
    this.dockerRegistryAuth = props.dockerRegistryAuth;

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

  public get containers(): Container[] {
    return [...this._containers];
  }

  public get initContainers(): Container[] {
    return [...this._initContainers];
  }

  public get volumes(): Volume[] {
    return Array.from(this._volumes.values());
  }

  public get hostAliases(): HostAlias[] {
    return [...this._hostAliases];
  }

  public addContainer(container: ContainerProps): Container {
    const impl = new Container(container);
    this._containers.push(impl);
    return impl;
  }

  public addInitContainer(container: ContainerProps): Container {

    // https://kubernetes.io/docs/concepts/workloads/pods/init-containers/#differences-from-regular-containers
    if (container.readiness) {
      throw new Error('Init containers must not have a readiness probe');
    }

    if (container.liveness) {
      throw new Error('Init containers must not have a liveness probe');
    }

    if (container.startup) {
      throw new Error('Init containers must not have a startup probe');
    }

    const impl = new Container({
      ...container,
      name: container.name ?? `init-${this._initContainers.length}`,
    });

    this._initContainers.push(impl);
    return impl;
  }

  public addHostAlias(hostAlias: HostAlias): void {
    this._hostAliases.push(hostAlias);
  }

  public addVolume(volume: Volume): void {
    const existingVolume = this._volumes.get(volume.name);
    if (existingVolume) {
      throw new Error(`Volume with name ${volume.name} already exists`);
    }
    this._volumes.set(volume.name, volume);
  }

  /**
   * @internal
   */
  public _toPodSpec(): k8s.PodSpec {

    if (this.containers.length === 0) {
      throw new Error('PodSpec must have at least 1 container');
    }

    const volumes: Map<string, Volume> = new Map();
    const containers: k8s.Container[] = [];
    const initContainers: k8s.Container[] = [];

    for (const container of this.containers) {
      // automatically add volume from the container mount
      // to this pod so thats its available to the container.
      for (const mount of container.mounts) {
        addVolume(mount.volume);
      }
      containers.push(container._toKube());
    }

    for (const container of this.initContainers) {
      // automatically add volume from the container mount
      // to this pod so thats its available to the container.
      for (const mount of container.mounts) {
        addVolume(mount.volume);
      }
      initContainers.push(container._toKube());
    }

    for (const volume of this.volumes) {
      addVolume(volume);
    }

    function addVolume(volume: Volume) {
      const existingVolume = volumes.get(volume.name);
      // its ok to call this function twice on the same volume, but its not ok to
      // call it twice on a different volume with the same name.
      if (existingVolume && existingVolume !== volume) {
        throw new Error(`Invalid mount configuration. At least two different volumes have the same name: ${volume.name}`);
      }
      volumes.set(volume.name, volume);
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
    };

  }

}

/**
 * Properties of a `PodTemplate`.
 *
 * Adds metadata information on top of the spec.
 */
export interface PodTemplateProps extends PodSpecProps {

  /**
   * The pod metadata.
   */
  readonly podMetadata?: ApiObjectMetadata;
}


/**
 * Provides read/write capabilities ontop of a `PodTemplateProps`.
 */
export class PodTemplate extends PodSpec implements IPodTemplate {

  public readonly podMetadata: ApiObjectMetadataDefinition;

  constructor(props: PodTemplateProps = {}) {
    super(props);
    this.podMetadata = new ApiObjectMetadataDefinition(props.podMetadata);
  }

  /**
   * @internal
   */
  public _toPodTemplateSpec(): k8s.PodTemplateSpec {
    return {
      metadata: this.podMetadata.toJson(),
      spec: this._toPodSpec(),
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
 * Properties for initialization of `Pod`.
 */
export interface PodProps extends ResourceProps, PodSpecProps {}

/**
 * Properties of a `PodSpec`.
 */
export interface PodSpecProps {

  /**
   * List of containers belonging to the pod. Containers cannot currently be
   * added or removed. There must be at least one container in a Pod.
   *
   * You can add additionnal containers using `podSpec.addContainer()`
   *
   * @default - No containers. Note that a pod spec must include at least one container.
   */
  readonly containers?: ContainerProps[];

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
  readonly initContainers?: ContainerProps[];

  /**
   * List of volumes that can be mounted by containers belonging to the pod.
   *
   * You can also add volumes later using `podSpec.addVolume()`
   *
   * @see https://kubernetes.io/docs/concepts/storage/volumes
   *
   * @default - No volumes.
   */
  readonly volumes?: Volume[];

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
  readonly serviceAccount?: IServiceAccount;

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
  readonly dockerRegistryAuth?: DockerConfigSecret;
}

/**
 * Pod is a collection of containers that can run on a host. This resource is
 * created by clients and scheduled onto hosts.
 */
export class Pod extends Resource implements IPodSpec {

  /**
   * @see base.Resource.apiObject
   */
  protected readonly apiObject: ApiObject;

  private readonly _spec: PodSpec;

  constructor(scope: Construct, id: string, props: PodProps = {}) {
    super(scope, id);

    this.apiObject = new k8s.KubePod(this, 'Resource', {
      metadata: props.metadata,
      spec: Lazy.any({ produce: () => this._spec._toPodSpec() }),
    });

    this._spec = new PodSpec(props);
  }

  public get containers(): Container[] {
    return this._spec.containers;
  }

  public get initContainers(): Container[] {
    return this._spec.initContainers;
  }

  public get volumes(): Volume[] {
    return this._spec.volumes;
  }

  public get restartPolicy(): RestartPolicy | undefined {
    return this._spec.restartPolicy;
  }

  public get serviceAccount(): IServiceAccount | undefined {
    return this._spec.serviceAccount;
  }

  public get securityContext(): PodSecurityContext {
    return this._spec.securityContext;
  }

  public get hostAliases(): HostAlias[] {
    return this._spec.hostAliases;
  }

  public get dns(): PodDns {
    return this._spec.dns;
  }

  public addContainer(container: ContainerProps): Container {
    return this._spec.addContainer(container);
  }

  public addInitContainer(container: ContainerProps): Container {
    return this._spec.addInitContainer(container);
  }

  public addVolume(volume: Volume): void {
    return this._spec.addVolume(volume);
  }

  public addHostAlias(hostAlias: HostAlias): void {
    return this._spec.addHostAlias(hostAlias);
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
