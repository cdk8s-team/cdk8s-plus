import { ApiObject, Lazy } from 'cdk8s';
import { Construct } from 'constructs';
import { Resource, ResourceProps } from './base';
import { Container, ContainerProps } from './container';
import * as k8s from './imports/k8s';
import { IServiceAccount } from './service-account';
import { Volume } from './volume';

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

/**
 * Properties for `AbstractPod`.
 */
export interface AbstractPodProps extends ResourceProps {

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

}

export abstract class AbstractPod extends Resource {

  public readonly restartPolicy?: RestartPolicy;
  public readonly serviceAccount?: IServiceAccount;
  public readonly securityContext: PodSecurityContext;

  private readonly _containers: Container[] = [];
  private readonly _initContainers: Container[] = [];
  private readonly _hostAliases: HostAlias[] = [];
  private readonly _volumes: Map<string, Volume> = new Map();

  constructor(scope: Construct, id: string, props: AbstractPodProps = {}) {
    super(scope, id);

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

  protected get podSpec(): k8s.PodSpec {

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
      securityContext: this.securityContext._toKube(),
      initContainers: initContainers,
      hostAliases: this.hostAliases,
      volumes: Array.from(volumes.values()).map(v => v._toKube()),
    };

  }

}

/**
 * Properties for `Pod`.
 */
export interface PodProps extends AbstractPodProps {}

/**
 * Pod is a collection of containers that can run on a host. This resource is
 * created by clients and scheduled onto hosts.
 */
export class Pod extends AbstractPod {

  /**
   * @see base.Resource.apiObject
   */
  protected readonly apiObject: ApiObject;

  constructor(scope: Construct, id: string, props: PodProps = {}) {
    super(scope, id, props);

    this.apiObject = new k8s.KubePod(this, 'Resource', {
      metadata: props.metadata,
      spec: Lazy.any({ produce: () => this._toKube() }),
    });

  }

  /**
   * @internal
   */
  public _toKube(): k8s.PodSpec {
    return this.podSpec;
  }

}
