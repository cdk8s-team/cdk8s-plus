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
   * The resource to scale up or down.
   */
  readonly target: Workload;
  /**
   * The maximum number of replicas that can be scaled up to.
   */
  readonly maxReplicas: number;
  /**
   * The minimum number of replicas that can be scaled down to.
   */
  readonly minReplicas?: number;
  /**
   * The metric conditions that trigger a scale up or scale down.
   */
  readonly metrics?: Metric[];
  /**
  * The scaling behavior when scaling up.
  */
  readonly scaleUp?: ScalingRules;
  /**
  * The scaling behavior when scaling down.
  */
  readonly scaleDown?: ScalingRules;
}

/**
 * A HorizontalPodAutoscaler scales a workload up or down in response to a metric
 * change. This allows a service to meet demand as it peeks.
 *
 *
 * The following are typical use cases for HorizontalPodAutoscaler:
 *
 * - When Memory usage is above 70%, scale up the number of replicas to meet the demand.
 * - When CPU usage is below 30%, scale down the number of replicas to save resources.
 * - When a service is experiencing a spike in traffic, scale up the number of replicas
 * to meet the demand. Then, when the traffic subsides, scale down the number of
 * replicas to save resources.
 *
 * HorizontalPodAutoscaler's can be used to scale the following workloads:
 * - Deployment
 * - ReplicaSet
 * - ReplicationController
 * - StatefulSet
 */
export class HorizontalPodAutoscaler extends Resource {
  /**
 * @see base.Resource.apiObject
 */
  protected readonly apiObject: ApiObject;
  public readonly resourceType = 'horizontalpodautoscaler';
  /**
   * The resource to scale up or down.
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
   * @default - No metrics are configured.
   */
  public readonly metrics?: Metric[];
  /**
   * The scaling behavior when scaling up.
   *
   * @default is the higher of
   * - Increase no more than 4 pods per 60 seconds
   * - Double the number of pods per 60 seconds
   */
  public readonly scaleUp?: ScalingRules;
  /**
   * The scaling behavior when scaling down.
   *
   * @default - Scale down to minReplica count, with a 5 minute stabilization window.
   */
  public readonly scaleDown?: ScalingRules;


  constructor(scope: Construct, id: string, props: HorizontalPodAutoscalerProps) {
    super(scope, id);
    this.apiObject = new k8s.KubeHorizontalPodAutoscalerV2(this, 'Resource', {
      metadata: props.metadata,
      spec: Lazy.any({ produce: () => this._toKube() }),
    });

    const hasContainerWithoutResources = props.target.containers.some((c) => this._hasRequestsOrLimits(c));
    if (!hasContainerWithoutResources && !props.metrics) {
      throw new Error('Every container in the HorizontalPodAutoscaler target must have CPU or memory resources defined');
    }
    if (props.minReplicas && props.minReplicas > props.maxReplicas) {
      throw new Error('minReplicas must be less than or equal to maxReplicas in order for HorizontalPodAutoscaler to scale.');
    }
    if (props?.scaleUp?.stabilizationWindow) {
      this._isValidStabilizationWindow(props.scaleUp.stabilizationWindow);
    }
    if (props?.scaleDown?.stabilizationWindow) {
      this._isValidStabilizationWindow(props.scaleDown.stabilizationWindow);
    }

    this.target = props.target;
    this.maxReplicas = props.maxReplicas;
    this.minReplicas = props.minReplicas ?? 1;
    this.metrics = props.metrics ?? undefined;
    this.scaleUp = {
      strategy: props.scaleUp?.strategy ?? ScalingStrategy.MAX_CHANGE,
      policies: props.scaleUp?.policies ?? [
        ScalingPolicy.pods(4, { scalingDuration: Duration.minutes(1) }),
        ScalingPolicy.percent(200, { scalingDuration: Duration.minutes(1) }),
      ],
      stabilizationWindow: props?.scaleDown?.stabilizationWindow ?? Duration.seconds(0),
    },
    this.scaleDown = {
      strategy: props.scaleUp?.strategy ?? ScalingStrategy.MAX_CHANGE,
      policies: props.scaleUp?.policies ?? [
        ScalingPolicy.pods(this.minReplicas, { scalingDuration: Duration.minutes(5) }),
      ],
      stabilizationWindow: props?.scaleDown?.stabilizationWindow ?? Duration.minutes(5),
    };
  }

  /**
   * Validate that the container has at least one CPU/memory request/limit defined.
   * If the container does not have a request/limit and there are no metrics defined,
   * then the HPA will not work.
   * @internal
   */
  private _hasRequestsOrLimits(container: Container) {
    const hasRequests = container.resources?.cpu?.request || container.resources?.memory?.request;
    const hasLimits = container.resources?.cpu?.limit || container.resources?.memory?.limit;
    return hasRequests || hasLimits;
  }

  /**
   * @internal
   */
  private _isValidStabilizationWindow(window?: Duration) {
    const windowSeconds = window?.toSeconds();
    if (windowSeconds && (0 >= windowSeconds || windowSeconds > 3600)) {
      throw new Error('ScalingRules stabilizationWindow must be more than 0 and no more than 1 hour.');
    }
    return window;
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
          policies: this.scaleUp?.policies?.map(p => p?._toKube()),
          selectPolicy: this.scaleUp?.strategy,
          stabilizationWindowSeconds: this.scaleUp?.stabilizationWindow?.toSeconds(),
        },
        scaleDown: {
          policies: this.scaleDown?.policies?.map(p => p?._toKube()),
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
   * Name of the container's resource.
   */
  readonly name: string;
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
 * Options for `Metric.containerResource()`
 */
export interface MetricResourceMetricOptions {
  /**
   * Name of the resource.
   */
  readonly name: string;
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
   * A container metric that will be tracked across all pods of the current scale target.
   * Only a single container may be tracked in each pod. In other words, a pod
   * that hosts two of the same container, will be ignored.
   *
   */
  public static containerResource(options: MetricContainerResourceOptions): Metric {
    return new Metric({
      type: MetricSourceType.CONTAINER_RESOURCE,
      containerResource: {
        container: options.container.name,
        name: options.name,
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
   * - Scale up when the length of an SQS queue is greater than 1000 messages.
   * - Scale down when an outside load balancer's queries are less than 10 per second.
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
  * - Scale on a Kubernetes Ingress's hits-per-second metric.
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
   * - Average CPU utilization across all pods
   * - Transactions processed per second across all pods
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
   * A resource metric can be used to track the current available resources of a
   * scale target.
   *
   * Use case:
   * - Scale up when CPU is above the reserved threshold.
   */
  public static resource(options: MetricResourceMetricOptions): Metric {
    return new Metric({
      type: MetricSourceType.RESOURCE,
      resource: {
        name: options.name,
        target: options.target._toKube(),
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
  * Target a specific target metric value.
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
   * Target the average metric value across all relevant pods.
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
   * Target the average percentage of the metric across all relevant pods.
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
 * A ScalingRules defines the scaling behavior for one direction.
 */
export interface ScalingRules {
  /**
   * How long past recommendations should be considered while
   * scaling.
   *
   * Minimum duration is 1 second, max is 1 hour.
   *
   * @default - On scale down no stabilization is performed. On scale up stabilization is
   * performed for 5 minutes.
   */
  readonly stabilizationWindow: Duration;
  /**
   * The strategy used when determining the ScalingPolicy to use.
   *
   * @default - MAX_CHANGE
   */
  readonly strategy: ScalingStrategy;
  /**
   * The scaling policies.
   *
   * @default
   * - Scale up defaults to
   *    - Increase no more than 4 pods per 60 seconds
   *    - Double the number of pods per 60 seconds
   * - Scale down defaults to
   *    - Decrease to minReplica count
   */
  readonly policies: ScalingPolicy[];
}


export enum ScalingStrategy {
  /**
   * Use the policy that provisions the most changes.
   *
   * This is the default.
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


/**
 * Options for `ScalingPolicy`.
 */
export interface ScalingPolicyOptions {
  /**
   * The amount of time the scaling policy has to
   * continue scaling before the target metric must be
   * revalidated.
   *
   * Must be greater than 0 seconds and no longer than 30 minutes.
   *
   * @default 15 seconds
   */
  readonly scalingDuration: Duration;
}

/**
 * A ScalePolicy defines how scaling should be applied.
 */
export class ScalingPolicy {

  /**
   * Changes the pods by a percentage of the it's current value.
   *
   * @param value The amount of change to apply. Must be greater than 0.
   * @param options Options for `ScalingPolicy`.
   */
  public static percent(value:number, options?: ScalingPolicyOptions): ScalingPolicy {
    return new ScalingPolicy({
      type: ScalingPolicyType.PERCENT,
      value,
      periodSeconds: this._periodSeconds(options?.scalingDuration),
    });
  }

  /**
   * Changes the pods by a percentage of the it's current value.
   *
   * @param value The amount of change to apply. Must be greater than 0.
   * @param options Options for `ScalingPolicy`.
   */
  public static pods(value:number, options?: ScalingPolicyOptions): ScalingPolicy {
    return new ScalingPolicy({
      type: ScalingPolicyType.PODS,
      value,
      periodSeconds: this._periodSeconds(options?.scalingDuration),
    });
  }

  private static _periodSeconds(duration?: Duration): number {
    const periodSeconds = duration?.toSeconds() ?? 15;
    if (0 >= periodSeconds && periodSeconds > 1800) {
      throw new Error('ScalePolicy period must be greater than 0 seconds and no longer than 30 minutes.');
    }
    return periodSeconds;
  }

  public readonly type: string;
  private constructor(private readonly metric: k8s.HpaScalingPolicyV2) {
    this.type = metric.type;
  }

  /**
   * @internal
   */
  public _toKube(): k8s.HpaScalingPolicyV2 {
    return this.metric;
  }
}
