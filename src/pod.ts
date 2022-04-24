import { ApiObject, ApiObjectMetadata, ApiObjectMetadataDefinition, Lazy } from 'cdk8s';
import { Construct } from 'constructs';
import * as base from './base';
import * as container from './container';
import * as k8s from './imports/k8s';
import * as secret from './secret';
import * as serviceaccount from './service-account';
import * as volume from './volume';

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
  readonly containers: container.Container[];

  /**
   * The init containers belonging to the pod.
   *
   * Use `addInitContainer` to add init containers.
   */
  readonly initContainers: container.Container[];

  /**
   * The volumes associated with this pod.
   *
   * Use `addVolume` to add volumes.
   */
  readonly volumes: volume.Volume[];

  /**
   * Restart policy for all containers within the pod.
   */
  readonly restartPolicy?: RestartPolicy;

  /**
   * The service account used to run this pod.
   */
  readonly serviceAccount?: serviceaccount.IServiceAccount;

  /**
   * An optional list of hosts and IPs that will be injected into the pod's
   * hosts file if specified. This is only valid for non-hostNetwork pods.
   */
  readonly hostAliases: HostAlias[];

  /**
   * Add a container to the pod.
   *
   * @param container The container.
   */
  addContainer(container: container.ContainerProps): container.Container;

  /**
   * Add an init container to the pod.
   *
   * @param container The container.
   */
  addInitContainer(container: container.ContainerProps): container.Container;

  /**
   * Add a volume to the pod.
   *
   * @param volume The volume.
   */
  addVolume(volume: volume.Volume): void;

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
  public readonly serviceAccount?: serviceaccount.IServiceAccount;
  public readonly securityContext: PodSecurityContext;
  public readonly dockerRegistryAuth?: secret.DockerConfigSecret;

  private readonly _containers: container.Container[] = [];
  private readonly _initContainers: container.Container[] = [];
  private readonly _hostAliases: HostAlias[] = [];
  private readonly _volumes: Map<string, volume.Volume> = new Map();

  constructor(props: PodSpecProps = {}) {
    this.restartPolicy = props.restartPolicy;
    this.serviceAccount = props.serviceAccount;
    this.securityContext = new PodSecurityContext(props.securityContext);
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

    return {
      restartPolicy: this.restartPolicy,
      serviceAccountName: this.serviceAccount?.name,
      containers: containers,
      securityContext: this.securityContext._toKube(),
      initContainers: initContainers,
      hostAliases: this.hostAliases,
      volumes: Array.from(volumes.values()).map(v => v._toKube()),
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
export interface PodProps extends base.ResourceProps, PodSpecProps {}

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
   * A secret containing docker credentials for authenticating to a registry.
   *
   * @default - No auth. Images are assumed to be publicly available.
   */
  readonly dockerRegistryAuth?: secret.DockerConfigSecret;

}

/**
 * Pod is a collection of containers that can run on a host. This resource is
 * created by clients and scheduled onto hosts.
 */
export class Pod extends base.Resource implements IPodSpec {

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

  public get containers(): container.Container[] {
    return this._spec.containers;
  }

  public get initContainers(): container.Container[] {
    return this._spec.initContainers;
  }

  public get volumes(): volume.Volume[] {
    return this._spec.volumes;
  }

  public get restartPolicy(): RestartPolicy | undefined {
    return this._spec.restartPolicy;
  }

  public get serviceAccount(): serviceaccount.IServiceAccount | undefined {
    return this._spec.serviceAccount;
  }

  public get securityContext(): PodSecurityContext {
    return this._spec.securityContext;
  }

  public get hostAliases(): HostAlias[] {
    return this._spec.hostAliases;
  }

  public addContainer(cont: container.ContainerProps): container.Container {
    return this._spec.addContainer(cont);
  }

  public addInitContainer(cont: container.ContainerProps): container.Container {
    return this._spec.addInitContainer(cont);
  }

  public addVolume(vol: volume.Volume): void {
    return this._spec.addVolume(vol);
  }

  public addHostAlias(hostAlias: HostAlias): void {
    return this._spec.addHostAlias(hostAlias);
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
