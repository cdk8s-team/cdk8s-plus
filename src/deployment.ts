import { ApiObject, Lazy, Duration } from 'cdk8s';
import { Construct } from 'constructs';
import * as container from './container';
import { IScalable, ScalingTarget } from './horizontal-pod-autoscaler';
import * as k8s from './imports/k8s';
import * as ingress from './ingress';
import * as service from './service';
import * as workload from './workload';

/**
 * Properties for `Deployment`.
 */
export interface DeploymentProps extends workload.WorkloadProps {

  /**
   * Number of desired pods.
   *
   * @default 2
   */
  readonly replicas?: number;

  /**
   * Specifies the strategy used to replace old Pods by new ones.
   *
   * @default - RollingUpdate with maxSurge and maxUnavailable set to 25%.
   */
  readonly strategy?: DeploymentStrategy;

  /**
   * Minimum duration for which a newly created pod should be ready without
   * any of its container crashing, for it to be considered available.
   *
   * Zero means the pod will be considered available as soon as it is ready.
   *
   * @see https://kubernetes.io/docs/concepts/workloads/controllers/deployment/#min-ready-seconds
   * @default Duration.seconds(0)
   */
  readonly minReady?: Duration;

  /**
   * The maximum duration for a deployment to make progress before it
   * is considered to be failed. The deployment controller will continue
   * to process failed deployments and a condition with a ProgressDeadlineExceeded
   * reason will be surfaced in the deployment status.
   *
   * Note that progress will not be estimated during the time a deployment is paused.
   *
   * @see https://kubernetes.io/docs/concepts/workloads/controllers/deployment/#progress-deadline-seconds
   * @default Duration.seconds(600)
   */
  readonly progressDeadline?: Duration;

}

/**
 * Options for `Deployment.exposeViaService`.
 */
export interface DeploymentExposeViaServiceOptions {
  /**
   * The ports that the service should bind to.
   *
   * @default - extracted from the deployment.
   */
  readonly ports?: service.ServicePort[];

  /**
   * The type of the exposed service.
   *
   * @default - ClusterIP.
   */
  readonly serviceType?: service.ServiceType;

  /**
   * The name of the service to expose.
   * If you'd like to expose the deployment multiple times,
   * you must explicitly set a name starting from the second expose call.
   *
   * @default - auto generated.
   */
  readonly name?: string;
}

/**
 * Options for exposing a deployment via an ingress.
 */
export interface ExposeDeploymentViaIngressOptions extends DeploymentExposeViaServiceOptions, service.ExposeServiceViaIngressOptions {}

/**
*
* A Deployment provides declarative updates for Pods and ReplicaSets.
*
* You describe a desired state in a Deployment, and the Deployment Controller changes the actual
* state to the desired state at a controlled rate. You can define Deployments to create new ReplicaSets, or to remove
* existing Deployments and adopt all their resources with new Deployments.
*
* > Note: Do not manage ReplicaSets owned by a Deployment. Consider opening an issue in the main Kubernetes repository if your use case is not covered below.
*
* Use Case
*
* The following are typical use cases for Deployments:
*
* - Create a Deployment to rollout a ReplicaSet. The ReplicaSet creates Pods in the background.
*   Check the status of the rollout to see if it succeeds or not.
* - Declare the new state of the Pods by updating the PodTemplateSpec of the Deployment.
*   A new ReplicaSet is created and the Deployment manages moving the Pods from the old ReplicaSet to the new one at a controlled rate.
*   Each new ReplicaSet updates the revision of the Deployment.
* - Rollback to an earlier Deployment revision if the current state of the Deployment is not stable.
*   Each rollback updates the revision of the Deployment.
* - Scale up the Deployment to facilitate more load.
* - Pause the Deployment to apply multiple fixes to its PodTemplateSpec and then resume it to start a new rollout.
* - Use the status of the Deployment as an indicator that a rollout has stuck.
* - Clean up older ReplicaSets that you don't need anymore.
*
**/
export class Deployment extends workload.Workload implements IScalable {

  /**
   * Number of desired pods.
   */
  public readonly replicas?: number;

  /**
   * Minimum duration for which a newly created pod should be ready without
   * any of its container crashing, for it to be considered available.
   */
  public readonly minReady: Duration;

  /**
   * The maximum duration for a deployment to make progress before it is considered to be failed.
   */
  public readonly progressDeadline: Duration;

  /*
   * The upgrade strategy of this deployment.
   */
  public readonly strategy: DeploymentStrategy;

  /**
   * @see base.Resource.apiObject
   */
  protected readonly apiObject: ApiObject;

  public readonly resourceType = 'deployments';

  public hasAutoscaler = false;

  constructor(scope: Construct, id: string, props: DeploymentProps = {}) {
    super(scope, id, props);

    this.apiObject = new k8s.KubeDeployment(this, 'Resource', {
      metadata: props.metadata,
      spec: Lazy.any({ produce: () => this._toKube() }),
    });

    this.minReady = props.minReady ?? Duration.seconds(0);
    this.progressDeadline = props.progressDeadline ?? Duration.seconds(600);

    if (this.progressDeadline.toSeconds() <= this.minReady.toSeconds()) {
      throw new Error(`'progressDeadline' (${this.progressDeadline.toSeconds()}s) must be greater than 'minReady' (${this.minReady.toSeconds()}s)`);
    }

    this.replicas = props.replicas;
    this.strategy = props.strategy ?? DeploymentStrategy.rollingUpdate();

    if (this.isolate) {
      this.connections.isolate();
    }
  }

  /**
   * Expose a deployment via a service.
   *
   * This is equivalent to running `kubectl expose deployment <deployment-name>`.
   *
   * @param options Options to determine details of the service and port exposed.
   */
  public exposeViaService(options: DeploymentExposeViaServiceOptions = {}): service.Service {
    const myPorts = container.extractContainerPorts(this);
    const myPortNumbers = myPorts.map(p => p.number);
    const ports: service.ServicePort[] = options.ports ?? myPorts.map(p => ({
      port: p.number, targetPort: p.number, protocol: p.protocol, name: p.name,
    }));
    if (ports.length === 0) {
      throw new Error(`Unable to expose deployment ${this.name} via a service: `
        + 'Deployment port cannot be determined.'
        + 'Either pass \'ports\', or configure ports on the containers of the deployment');
    }
    const portNames = ports.map(p => p.name);
    if (ports.length > 1 && portNames.includes(undefined)) {
      throw new Error(`Unable to expose deployment ${this.name} via a service: `
        + 'When using multiple ports for a service, all ports must have port names so they are unambiguous.');
    }

    // validate the ports are owned by our containers
    for (const port of ports) {
      const targetPort = port.targetPort ?? port.port;
      if (!myPortNumbers.includes(targetPort)) {
        throw new Error(`Unable to expose deployment ${this.name} via a service: Port ${targetPort} is not exposed by any container`);
      }
    }

    const metadata: any = { namespace: this.metadata.namespace };
    if (options.name) {
      metadata.name = options.name;
    }
    return new service.Service(this, `${options.name ?? ''}Service`, {
      selector: this,
      ports,
      metadata,
      type: options.serviceType ?? service.ServiceType.CLUSTER_IP,
    });
  }

  /**
   * Expose a deployment via an ingress.
   *
   * This will first expose the deployment with a service, and then expose the service via an ingress.
   *
   * @param path The ingress path to register under.
   * @param options Additional options.
   */
  public exposeViaIngress(path: string, options: ExposeDeploymentViaIngressOptions = {}): ingress.Ingress {
    const ser = this.exposeViaService(options);
    return ser.exposeViaIngress(path, options);
  }

  /**
   * @internal
   */
  public _toKube(): k8s.DeploymentSpec {
    return {
      replicas: this.hasAutoscaler ? undefined : (this.replicas ?? 2),
      minReadySeconds: this.minReady.toSeconds(),
      progressDeadlineSeconds: this.progressDeadline.toSeconds(),
      template: {
        metadata: this.podMetadata.toJson(),
        spec: this._toPodSpec(),
      },
      selector: this._toLabelSelector(),
      strategy: this.strategy._toKube(),
    };
  }

  /**
   * @see IScalable.markHasAutoscaler()
   */
  public markHasAutoscaler() {
    this.hasAutoscaler = true;
  }

  /**
   * @see IScalable.toScalingTarget()
   */
  public toScalingTarget(): ScalingTarget {
    return {
      kind: this.apiObject.kind,
      apiVersion: this.apiObject.apiVersion,
      name: this.name,
      containers: this.containers,
      replicas: this.replicas,
    };
  }
}

/**
 * Options for `DeploymentStrategy.rollingUpdate`.
 */
export interface DeploymentStrategyRollingUpdateOptions {

  /**
   * The maximum number of pods that can be scheduled above the desired number of pods.
   * Value can be an absolute number (ex: 5) or a percentage of desired pods (ex: 10%).
   * Absolute number is calculated from percentage by rounding up.
   * This can not be 0 if `maxUnavailable` is 0.
   *
   * Example: when this is set to 30%, the new ReplicaSet can be scaled up immediately when the rolling update
   * starts, such that the total number of old and new pods do not exceed 130% of desired pods.
   * Once old pods have been killed, new ReplicaSet can be scaled up further, ensuring that
   * total number of pods running at any time during the update is at most 130% of desired pods.
   *
   * @default '25%'
   */
  readonly maxSurge?: PercentOrAbsolute;

  /**
   * The maximum number of pods that can be unavailable during the update.
   * Value can be an absolute number (ex: 5) or a percentage of desired pods (ex: 10%).
   * Absolute number is calculated from percentage by rounding down.
   * This can not be 0 if `maxSurge` is 0.
   *
   * Example: when this is set to 30%, the old ReplicaSet can be scaled down to 70% of desired
   * pods immediately when the rolling update starts. Once new pods are ready, old ReplicaSet can
   * be scaled down further, followed by scaling up the new ReplicaSet, ensuring that the total
   * number of pods available at all times during the update is at least 70% of desired pods.
   *
   * @default '25%'
   */
  readonly maxUnavailable?: PercentOrAbsolute;

}

/**
 * Union like class repsenting either a ration in
 * percents or an absolute number.
 */
export class PercentOrAbsolute {

  /**
   * Percent ratio.
   */
  public static percent(percent: number): PercentOrAbsolute {
    return new PercentOrAbsolute(`${percent}%`);
  }

  /**
   * Absolute number.
   */
  public static absolute(num: number): PercentOrAbsolute {
    return new PercentOrAbsolute(num);
  }

  private constructor(public readonly value: any) {}

  public isZero(): boolean {
    return this.value === PercentOrAbsolute.absolute(0).value || this.value === PercentOrAbsolute.percent(0).value;
  }

}

/**
 * Deployment strategies.
 */
export class DeploymentStrategy {

  /**
   * All existing Pods are killed before new ones are created.
   *
   * @see https://kubernetes.io/docs/concepts/workloads/controllers/deployment/#recreate-deployment
   */
  public static recreate(): DeploymentStrategy {
    return new DeploymentStrategy({
      type: 'Recreate',
    });
  }

  public static rollingUpdate(options: DeploymentStrategyRollingUpdateOptions = {}): DeploymentStrategy {

    const maxSurge = options.maxSurge ?? PercentOrAbsolute.percent(25);
    const maxUnavailable = options.maxUnavailable ?? PercentOrAbsolute.percent(25);

    if (maxSurge.isZero() && maxUnavailable.isZero()) {
      throw new Error('\'maxSurge\' and \'maxUnavailable\' cannot be both zero');
    }

    return new DeploymentStrategy({
      type: 'RollingUpdate',
      rollingUpdate: { maxSurge, maxUnavailable },
    });
  }

  private constructor(private readonly strategy: k8s.DeploymentStrategy) {}

  /**
   * @internal
   */
  public _toKube(): k8s.DeploymentStrategy {
    return this.strategy;
  }

}
