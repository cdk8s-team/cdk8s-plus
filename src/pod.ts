import { ApiObject, ApiObjectMetadata, ApiObjectMetadataDefinition, Lazy } from 'cdk8s';
import { Construct } from 'constructs';
import { ResourceProps, Resource } from './base';
import { Container, ContainerProps } from './container';
import * as k8s from './imports/k8s';
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

  private readonly _containers: Container[] = [];
  private readonly _initContainers: Container[] = [];
  private readonly _volumes: Map<string, Volume> = new Map();

  constructor(props: PodSpecProps = {}) {
    this.restartPolicy = props.restartPolicy;
    this.serviceAccount = props.serviceAccount;
    this.securityContext = new PodSecurityContext(props.securityContext);

    if (props.containers) {
      props.containers.forEach(c => this.addContainer(c));
    }

    if (props.volumes) {
      props.volumes.forEach(v => this.addVolume(v));
    }

    if (props.initContainers) {
      props.initContainers.forEach(c => this.addInitContainer(c));
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

    return {
      restartPolicy: this.restartPolicy,
      serviceAccountName: this.serviceAccount?.name,
      containers: containers,
      securityContext: this.securityContext ? this.securityContext._toKube() : undefined,
      initContainers: initContainers,
      volumes: Array.from(volumes.values()).map(v => v._toKube()),
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
   * @default - Default security context.
   */
  readonly securityContext?: PodSecurityContextProps;

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

  public addContainer(container: ContainerProps): Container {
    return this._spec.addContainer(container);
  }

  public addInitContainer(container: ContainerProps): Container {
    return this._spec.addInitContainer(container);
  }

  public addVolume(volume: Volume): void {
    return this._spec.addVolume(volume);
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

    (props.sysctls ?? []).forEach(s => this._sysctls.push(s));
  }

  public get sysctls(): Sysctl[] {
    return [...this._sysctls];
  }

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

