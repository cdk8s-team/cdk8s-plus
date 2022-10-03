import { ApiObject, Duration, Lazy } from 'cdk8s';
import { Construct } from 'constructs';
import * as kplus from '../src';
import { Resource, ResourceProps } from './base';
import { Container } from './container';
import * as k8s from './imports/k8s';
import { Workload } from './workload';

/**
 * Properties for HorizontalPodAutoscaler
 */
export interface HorizontalPodAutoscalerProps extends ResourceProps {
  /**
   * The workload to scale up or down.
   *
   * Scalable workload types:
   * * Deployment
   * * ReplicaSet
   * * ReplicationController
   * * StatefulSet
   *
   * Cannot be used with workloads that do not scale, such as DaemonSet.
   */
  readonly target: Workload;
  /**
   * The maximum number of replicas that can be scaled up to.
   */
  readonly maxReplicas: number;
  /**
   * The minimum number of replicas that can be scaled down to.
   *
   * Can be set to 0 if the alpha feature gate `HPAScaleToZero` is enabled and
   * at least one Object or External metric is configured.
   *
   * @default 1
   */
  readonly minReplicas?: number;
  /**
   * The metric conditions that trigger a scale up or scale down.
   *
   * @default
   * No metrics are configured. Only scales on the requests or limits defined on the target.
   */
  readonly metrics?: Metric[];
  /**
   * The scaling behavior when scaling up.
   *
   * @default
   * Is the higher of:
   * * Increase no more than 4 pods per 60 seconds
   * * Double the number of pods per 60 seconds
   */
  readonly scaleUp?: IScalingRules;
  /**
   * The scaling behavior when scaling down.
   *
   * @default
   * Scale down to minReplica count with a 5 minute stabilization window.
   */
  readonly scaleDown?: IScalingRules;
}

/**
 * A HorizontalPodAutoscaler scales a workload up or down in response to a metric
 * change. This allows your services to scale up when demand is high and scale down
 * when they are no longer needed.
 *
 *
 * The following are typical use cases for HorizontalPodAutoscaler:
 *
 * * When Memory usage is above 70%, scale up the number of replicas to meet the demand.
 * * When CPU usage is below 30%, scale down the number of replicas to save resources.
 * * When a service is experiencing a spike in traffic, scale up the number of replicas
 *   to meet the demand. Then, when the traffic subsides, scale down the number of
 *   replicas to save resources.
 *
 * HorizontalPodAutoscaler's can be used to scale the following workloads:
 * * Deployment
 * * ReplicaSet
 * * ReplicationController
 * * StatefulSet
 *
 * :warning: HorizontalPodAutoscaler cannot be used with a DaemonSet.
 *
 * The autoscaler uses the following algorithm when determining the number of replicas to scale:
 * `desiredReplicas = ceil[currentReplicas * ( currentMetricValue / desiredMetricValue )]`
 *
 * ### Targets that already have a replica count defined.
 *
 * It is recommended to remove any replica counts from the target resource before using a
 * HorizontalPodAutoscaler. If this isn't done, then any time a change to that object is applied,
 * Kubernetes will scale the current number of Pods to the value of the target.replicas key. This
 * may not be desired and could lead to unexpected behavior.
 *
 *
 * @see https://kubernetes.io/docs/tasks/run-application/horizontal-pod-autoscale/#implicit-maintenance-mode-deactivation
 *
 * @example
 * const backend = new kplus.Deployment(this, 'Backend', ...);
 *
 * const hpa = new kplus.HorizontalPodAutoscaler(chart, 'Hpa', {
 *  target: backend,
 *  maxReplicas: 10,
 *  scaleUp: {
 *    policies: [
 *      {
 *        replicas: kplus.Replicas.absolute(3),
 *        duration: Duration.minutes(5),
 *      },
 *    ],
 *  },
 * });
 */
export class HorizontalPodAutoscaler extends Resource {
  /**
 * @see base.Resource.apiObject
 */
  protected readonly apiObject: ApiObject;
  public readonly resourceType = 'horizontalpodautoscaler';
  /**
   * The workload to scale up or down.
   *
   * Scalable workload types:
   * * Deployment
   * * ReplicaSet
   * * ReplicationController
   * * StatefulSet
   *
   * Cannot be used with workloads that do not scale, such as DaemonSet.
   */
  public readonly target: Workload;
  /**
   * The maximum number of replicas that can be scaled up to.
   */
  public readonly maxReplicas: number;
  /**
   * The minimum number of replicas that can be scaled down to.
   *
   * Can be set to 0 if the alpha feature gate `HPAScaleToZero` is enabled and
   * at least one Object or External metric is configured.
   *
   * @default 1
   */
  public readonly minReplicas?: number;
  /**
   * The metric conditions that trigger a scale up or scale down.
   *
   * @default
   * No metrics are configured. Only scales on the requests or limits defined on the target.
   */
  public readonly metrics?: Metric[];
  /**
   * The scaling behavior when scaling up.
   *
   * @default
   * Is the higher of:
   * * Increase no more than 4 pods per 60 seconds
   * * Double the number of pods per 60 seconds
   */
  public scaleUp: IScalingRules;
  /**
   * The scaling behavior when scaling down.
   *
   * @default
   * Scale down to minReplica count with a 5 minute stabilization window.
   */
  public scaleDown: IScalingRules;

  // Defaults
  private readonly _defaultScaleUp: IScalingRules = {
    strategy: ScalingStrategy.MAX_CHANGE,
    stabilizationWindow: Duration.seconds(0),
    policies: [
      {
        replicas: Replicas.absolute(4),
        duration: Duration.minutes(1),
      },
      {
        replicas: Replicas.percent(200),
        duration: Duration.minutes(1),
      },
    ],
  };
  private readonly _defaultScaleDown: IScalingRules = {
    strategy: ScalingStrategy.MAX_CHANGE,
    stabilizationWindow: Duration.minutes(5),
    policies: [
      {
        replicas: Replicas.absolute(this.minReplicas ?? 1),
        duration: Duration.minutes(5),
      },
    ],
  };
  private readonly _defaultScalingPolicy = {
    duration: Duration.seconds(15),
  };


  constructor(scope: Construct, id: string, props: HorizontalPodAutoscalerProps) {
    super(scope, id);
    this.apiObject = new k8s.KubeHorizontalPodAutoscalerV2(this, 'Resource', {
      metadata: props.metadata,
      spec: Lazy.any({ produce: () => this._toKube() }),
    });

    if (props.target.kind === 'DaemonSet') {
      throw new Error('HorizontalPodAutoscaler cannot be used with workloads that do not scale, such as a DaemonSet.');
    }
    const hasResourceConstraints = props.target.containers.some((c) => this._hasRequestsOrLimits(c));
    if (!hasResourceConstraints && !props.metrics) {
      throw new Error('Every container in the HorizontalPodAutoscaler target must have CPU or memory resources defined');
    }
    if (props?.minReplicas && props.minReplicas > props.maxReplicas) {
      throw new Error("'minReplicas' must be less than or equal to maxReplicas in order for HorizontalPodAutoscaler to scale.");
    }
    if (props?.scaleUp?.stabilizationWindow && !this._isStabilizationWindowWithinRange(props.scaleUp.stabilizationWindow)) {
      throw new Error("'scaleUp.stabilizationWindow' must be more than 0 seconds and no longer than 1 hour.");
    }
    if (props?.scaleDown?.stabilizationWindow && !this._isStabilizationWindowWithinRange(props.scaleDown.stabilizationWindow)) {
      throw new Error("'scaleDown.stabilizationWindow' must be more than 0 seconds and no longer than 1 hour.");
    }
    if (props?.scaleUp?.policies?.length) {
      this._validateScalingPolicies(ScalingDirection.UP, props.scaleUp.policies);
      props.scaleUp.policies = this._setDefaultsOnScalingPolicies(props.scaleUp.policies);
    }
    if (props?.scaleDown?.policies?.length) {
      this._validateScalingPolicies(ScalingDirection.DOWN, props.scaleDown.policies);
      props.scaleDown.policies = this._setDefaultsOnScalingPolicies(props.scaleDown.policies);
    }

    this.target = props.target;
    this.maxReplicas = props.maxReplicas;
    this.minReplicas = props.minReplicas ?? 1;
    this.metrics = props.metrics;
    this.scaleUp = {
      ...this._defaultScaleUp,
      ...props.scaleUp,
    };
    this.scaleDown = {
      ...this._defaultScaleDown,
      ...props.scaleDown,
    };
  }

  /**
   * Validate a list of scaling policies.
   * @internal
   */
  private _validateScalingPolicies(direction: ScalingDirection, policies: ScalingPolicy[]) {
    return policies.map((p) => {
      if (p?.duration && !this._isScalingPolicyDurationWithinRange(p.duration)) {
        throw new Error(`'${direction}' policies may only be configured with a duration that is at least 1 second long and no longer than 30 minutes.`);
      }
    });
  }
  /**
   * Set the default values on a list of scaling policies.
   * @internal
   */
  private _setDefaultsOnScalingPolicies(policies: ScalingPolicy[]) {
    return policies.map((p) => ({
      ...this._defaultScalingPolicy,
      ...p,
    }));
  }

  /**
   * Validate that the container has at least one CPU/memory request/limit defined.
   * If the container does not have a request/limit and there are no metrics defined,
   * then the HPA will not work.
   * @internal
   */
  private _hasRequestsOrLimits(container: Container): Boolean {
    const hasRequests = container.resources?.cpu?.request || container.resources?.memory?.request;
    const hasLimits = container.resources?.cpu?.limit || container.resources?.memory?.limit;
    return Boolean(hasRequests || hasLimits);
  }

  /**
   * @internal
   */
  private _isStabilizationWindowWithinRange(window?: Duration): Boolean {
    const windowSeconds = window?.toSeconds();
    const isWithinRange = windowSeconds && (0 < windowSeconds && windowSeconds <= 3600);
    return Boolean(isWithinRange);
  }

  /**
   * @internal
   */
  private _isScalingPolicyDurationWithinRange(duration: Duration): Boolean {
    const periodSeconds = duration?.toSeconds() ?? 15;
    const isWithinRange = 0 < periodSeconds && periodSeconds <= 1800;
    return Boolean(isWithinRange);
  }

  /**
   * @internal
   */
  public _toKube(): k8s.HorizontalPodAutoscalerSpecV2 {
    return {
      maxReplicas: this.maxReplicas,
      minReplicas: this.minReplicas,
      scaleTargetRef: {
        apiVersion: this.target.apiVersion,
        kind: this.target.kind,
        name: this.target.name,
      },
      metrics: this.metrics?.map(m => m?._toKube()),
      behavior: {
        scaleUp: {
          policies: this.scaleUp?.policies?.map(p => ({
            type: p.replicas.type,
            value: p.replicas.value,
            periodSeconds: p.duration?.toSeconds() ?? this._defaultScalingPolicy.duration.toSeconds(),
          })),
          selectPolicy: this.scaleUp?.strategy,
          stabilizationWindowSeconds: this.scaleUp?.stabilizationWindow?.toSeconds(),
        },
        scaleDown: {
          policies: this.scaleDown?.policies?.map(p => ({
            type: p.replicas.type,
            value: p.replicas.value,
            periodSeconds: p.duration?.toSeconds() ?? this._defaultScalingPolicy.duration.toSeconds(),
          })),
          selectPolicy: this.scaleDown?.strategy,
          stabilizationWindowSeconds: this.scaleDown?.stabilizationWindow?.toSeconds(),
        },
      },
    };
  }
}


/**
 * Metric source types.
 */
export enum MetricSourceType {
  /**
   * A container metric that will be tracked across all pods of the current scale target.
   * Only a single container may be tracked in each pod. In other words, a pod
   * that hosts two of the same container, will be ignored.
   */
  CONTAINER_RESOURCE = 'ContainerResource',
  /**
   * A global metric that is not associated with any Kubernetes object.
   * Allows for autoscaling based on information coming from components running outside of
   * the cluster.
   */
  EXTERNAL = 'External',
  /**
  * Metric that describes a kubernetes object
  */
  OBJECT = 'Object',
  /**
   * A pod metric that will be averaged across all pods of the current scale target.
   */
  PODS = 'Pods',
  /**
   * A resource metric can be used to track the current available resources of a
   * scale target.
   */
  RESOURCE = 'Resource',
}

/**
 * Base options for a Metric
 */
export interface MetricOptions {
  /**
   * The target metric value that will trigger scaling.
   */
  readonly target: MetricTarget;
  /**
  * The name of the metric to scale on.
  */
  readonly name: string;
  /**
   * A selector to find a metric by labels.
   */
  readonly labelSelector?: kplus.LabelSelector;
}


/**
 * Options for `Metric.containerResource()`
 */
export interface MetricContainerResourceOptions {
  /**
   * Container where the metric can be found.
   */
  readonly container: Container;
  /**
   * Target metric value that will trigger scaling.
   */
  readonly target: MetricTarget;
}

/**
 * Options for `Metric.object()`
 */
export interface MetricObjectOptions extends MetricOptions {
  /**
   * Resource where the metric can be found.
   */
  readonly object: Resource;
}

/**
 * A metric condition that HorizontalPodAutoscaler's scale on.
 */
export class Metric {

  /**
   * Metric that tracks the CPU of a container. This metric
   * will be tracked across all pods of the current scale target. Only a single
   * container may be tracked in each pod. In other words, a pod that hosts two
   * of the same container, will be ignored.
   *
   */
  public static containerCpu(options: MetricContainerResourceOptions): Metric {
    return new Metric({
      type: MetricSourceType.CONTAINER_RESOURCE,
      containerResource: {
        name: ResourceType.CPU,
        container: options.container.name,
        target: options.target._toKube(),
      },
    });
  }

  /**
   * Metric that tracks the Memory of a container. This metric
   * will be tracked across all pods of the current scale target. Only a single
   * container may be tracked in each pod. In other words, a pod that hosts two
   * of the same container, will be ignored.
   *
   */
  public static containerMemory(options: MetricContainerResourceOptions): Metric {
    return new Metric({
      type: MetricSourceType.CONTAINER_RESOURCE,
      containerResource: {
        name: ResourceType.MEMORY,
        container: options.container.name,
        target: options.target._toKube(),
      },
    });
  }

  /**
   * Metric that tracks the volume size of a container. This metric
   * will be tracked across all pods of the current scale target. Only a single
   * container may be tracked in each pod. In other words, a pod that hosts two
   * of the same container, will be ignored.
   *
   */
  public static containerStorage(options: MetricContainerResourceOptions): Metric {
    return new Metric({
      type: MetricSourceType.CONTAINER_RESOURCE,
      containerResource: {
        name: ResourceType.STORAGE,
        container: options.container.name,
        target: options.target._toKube(),
      },
    });
  }

  /**
   * Metric that tracks the local ephemeral storage of a container. This metric
   * will be tracked across all pods of the current scale target. Only a single
   * container may be tracked in each pod. In other words, a pod that hosts two
   * of the same container, will be ignored.
   *
   */
  public static containerEphemeralStorage(options: MetricContainerResourceOptions): Metric {
    return new Metric({
      type: MetricSourceType.CONTAINER_RESOURCE,
      containerResource: {
        name: ResourceType.EPHEMERAL_STORAGE,
        container: options.container.name,
        target: options.target._toKube(),
      },
    });
  }

  /**
   * A global metric that is not associated with any Kubernetes object.
   * Allows for autoscaling based on information coming from components running outside of
   * the cluster.
   *
   * Use case:
   * * Scale up when the length of an SQS queue is greater than 1000 messages.
   * * Scale down when an outside load balancer's queries are less than 10 per second.
   */
  public static external(options: MetricOptions): Metric {
    return new Metric({
      type: MetricSourceType.EXTERNAL,
      external: {
        metric: {
          name: options.name,
          selector: options?.labelSelector?._toKube(),
        },
        target: options.target._toKube(),
      },
    });
  }

  /**
  * Metric that describes a kubernetes object
  *
  * Use case:
  * * Scale on a Kubernetes Ingress's hits-per-second metric.
  */
  public static object(options: MetricObjectOptions): Metric {
    return new Metric({
      type: MetricSourceType.OBJECT,
      object: {
        describedObject: {
          apiVersion: options.object.apiVersion,
          kind: options.object.kind,
          name: options.object.name,
        },
        metric: {
          name: options.name,
          selector: options?.labelSelector?._toKube(),
        },
        target: options.target._toKube(),
      },
    });
  }

  /**
   * A pod metric that will be averaged across all pods of the current scale target.
   *
   * Use case:
   * * Average CPU utilization across all pods
   * * Transactions processed per second across all pods
   */
  public static pods(options: MetricOptions): Metric {
    return new Metric({
      type: MetricSourceType.PODS,
      pods: {
        metric: {
          name: options.name,
          selector: options?.labelSelector?._toKube(),
        },
        target: options.target._toKube(),
      },
    });
  }

  /**
   * Tracks the available memory of a target.
   *
   * Use case:
   * * Scale up when CPU is above 40%.
   */
  public static resourceCpu(target: MetricTarget): Metric {
    return new Metric({
      type: MetricSourceType.RESOURCE,
      resource: {
        name: ResourceType.CPU,
        target: target._toKube(),
      },
    });
  }

  /**
   * Tracks the available CPU of a target.
   *
   * Use case:
   * * Scale up when Memory is above 512MB.
   */
  public static resourceMemory(target: MetricTarget): Metric {
    return new Metric({
      type: MetricSourceType.RESOURCE,
      resource: {
        name: ResourceType.MEMORY,
        target: target._toKube(),
      },
    });
  }

  /**
   * Tracks the available Storage of a target.
   */
  public static resourceStorage(target: MetricTarget): Metric {
    return new Metric({
      type: MetricSourceType.RESOURCE,
      resource: {
        name: ResourceType.STORAGE,
        target: target._toKube(),
      },
    });
  }

  /**
   * Tracks the available Ephemeral Storage of a target.
   */
  public static resourceEphemeralStorage(target: MetricTarget): Metric {
    return new Metric({
      type: MetricSourceType.RESOURCE,
      resource: {
        name: ResourceType.EPHEMERAL_STORAGE,
        target: target._toKube(),
      },
    });
  }

  public readonly type: string;
  private constructor(private readonly metric: k8s.MetricSpecV2) {
    this.type = metric.type;
  }

  /**
   * @internal
   */
  public _toKube(): k8s.MetricSpecV2 {
    return this.metric;
  }

}

export enum ResourceType {
  /**
   * CPU
   */
  CPU= 'cpu',
  /**
   * Memory
   */
  MEMORY = 'memory',
  /**
   * Volume size
   */
  STORAGE = 'storage',
  /**
   * Local ephemeral storage
   */
  EPHEMERAL_STORAGE = 'ephemeral-storage',
}


/**
 * How to interpret the metric value.
 */
export enum MetricTargetType {
  /**
   * The target value must be exactly the same as the metric value.
   */
  VALUE = 'Value',
  /**
   * The target value is an average metric value measured across all relevant pods.
   */
  AVERAGE_VALUE = 'AverageValue',
  /**
   * The target value is a percentage of the metric measured across all relevant pods.
   */
  UTILIZATION = 'Utilization',
}


/**
 * A metric condition that will trigger scaling behavior when satisfied.
 *
 * @example
 *
 * MetricTarget.averageUtilization(70); // 70% average utilization
 *
 */
export class MetricTarget {
  /**
  * Target a specific target value.
  *
  * @param value The target value. Floats can be passed within a string. i.g. `"1.2"`
  */
  public static value(value: string): MetricTarget {
    return new MetricTarget({
      type: MetricTargetType.VALUE,
      value: k8s.Quantity.fromString(value),
    });
  }

  /**
   * Target the average value across all relevant pods.
   *
   * @param averageValue The average metric value. Floats can be passed within a string. i.g. `"1.2"`
   */
  public static averageValue(averageValue: string): MetricTarget {
    return new MetricTarget({
      type: MetricTargetType.AVERAGE_VALUE,
      averageValue: k8s.Quantity.fromString(averageValue),
    });
  }

  /**
   * Target a percentage value across all relevant pods.
   *
   * @param averageUtilization The percentage of the utilization metric. i.g. `50` for 50%.
   */
  public static averageUtilization(averageUtilization: number): MetricTarget {
    return new MetricTarget({
      type: MetricTargetType.UTILIZATION,
      averageUtilization,
    });
  }

  private constructor(private readonly metric: k8s.MetricTargetV2) { }

  /**
   * @internal
   */
  public _toKube(): k8s.MetricSpecV2 {
    return this.metric;
  }
}


/**
 * The direction to scale in.
 */
export enum ScalingDirection {
  /**
   * Scale up
   */
  UP = 'scaleUp',
  /**
   * Scale down
   */
  DOWN = 'scaleDown',
}

/**
 * Defines the scaling behavior for one direction.
 */
export interface IScalingRules {
  /**
   * Defines the window of past metrics that the autoscaler should consider when calculating
   * wether or not autoscaling should occur.
   *
   * Minimum duration is 1 second, max is 1 hour.
   *
   * @example
   * stabilizationWindow: Duration.minutes(30)
   * // Autoscaler considers the last 30 minutes of metrics when deciding whether to scale.
   *
   * @default
   * * On scale down no stabilization is performed.
   * * On scale up stabilization is performed for 5 minutes.
   */
  readonly stabilizationWindow?: Duration;
  /**
   * The strategy to use when scaling.
   *
   * @default MAX_CHANGE
   */
  readonly strategy?: ScalingStrategy;
  /**
   * The scaling policies.
   *
   * @default
   * If not scaling polices are defined then…
   * * Scale up defaults to
   *    * Increase no more than 4 pods per 60 seconds
   *    * Double the number of pods per 60 seconds
   * * Scale down defaults to
   *    * Decrease to minReplica count
   */
  policies?: ScalingPolicy[];
}


export enum ScalingStrategy {
  /**
   * Use the policy that provisions the most changes.
   */
  MAX_CHANGE = 'Max',
  /**
   * Use the policy that provisions the least amount of changes.
   */
  MIN_CHANGE = 'Min',
  /**
   * Disables scaling in this direction.
   *
   * @deprecated - Omit the ScalingRule instead
   */
  DISABLED = 'Disabled',
}

/**
* The type of scaling policy that could be used to make scaling decisions.
*/
export enum ScalingPolicyType {
  /**
   * Changes the number of pods.
   */
  PODS = 'Pods',
  /**
   * Changes the pods by a percentage of the it's current value.
   */
  PERCENT = 'Percent',
}

export interface ScalingPolicy {
  /**
   * The type and quantity of replicas to change.
   */
  readonly replicas: ReplicasToScale;
  /**
   * The amount of time the scaling policy has to
   * continue scaling before the target metric must be
   * revalidated.
   *
   * Must be greater than 0 seconds and no longer than 30 minutes.
   *
   * @default 15 seconds
   */
  readonly duration?: Duration;
}


/**
 * Describes how much change will be applied when a ScalingPolicy is selected
 * for scaling.
 */
export interface ReplicasToScale {
  /**
   * The type of scaling change.
   */
  readonly type: ScalingPolicyType;
  /**
   * The amount of scaling that should be applied.
   */
  readonly value: number;
}

/**
 * The amount of replicas that will change.
 */
export class Replicas {

  /**
   * Changes the pods by a percentage of the it's current value.
   *
   * @param value The amount of change to apply. Must be greater than 0.
   */
  public static percent(value:number): ReplicasToScale {
    return {
      type: ScalingPolicyType.PERCENT,
      value,
    };
  }

  /**
   * Changes the pods by a percentage of the it's current value.
   *
   * @param value The amount of change to apply. Must be greater than 0.
   */
  public static absolute(value:number): ReplicasToScale {
    return {
      type: ScalingPolicyType.PODS,
      value,
    };
  }
}
