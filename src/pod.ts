import { ApiObject, Lazy } from 'cdk8s';
import { Construct } from 'constructs';
import { Workload } from './_workload';
import { ResourceProps } from './base';
import { ContainerProps } from './container';
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

}

/**
 * Pod is a collection of containers that can run on a host. This resource is
 * created by clients and scheduled onto hosts.
 */
export class Pod extends Workload {

  /**
   * @see base.Resource.apiObject
   */
  protected readonly apiObject: ApiObject;

  constructor(scope: Construct, id: string, props: PodProps = {}) {
    super(scope, id, props);

    this.apiObject = new k8s.KubePod(this, 'Resource', {
      metadata: props.metadata,
      spec: Lazy.any({ produce: () => this.podSpec }),
    });

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
