import { ApiObject, Duration, Lazy } from 'cdk8s';
import { Construct } from 'constructs';
import { Resource, ResourceProps, IResource } from './base';
import * as container from './container';
import * as k8s from './imports/k8s';
import * as pod from './pod';


/**
 * Properties used to configure the target of an Autoscaler.
 */
export interface ScalingTarget {
  /**
   * The object kind (e.g. "Deployment").
   */
  readonly kind: string;
  /**
   * The object's API version (e.g. "authorization.k8s.io/v1")
   */
  readonly apiVersion: string;
  /**
   * The Kubernetes name of this resource.
   */
  readonly name: string;
  /**
   * Container definitions associated with the target.
   */
  readonly containers: container.Container[];
  /**
   * The fixed number of replicas defined on the target. This is used
   * for validation purposes as Scalable targets should not have a
   * fixed number of replicas.
   */
  readonly replicas?: number;


}

/**
 * Represents a scalable workload.
 */
export interface IScalable {
  /**
   * If this is a target of an autoscaler.
   */
  hasAutoscaler: boolean;
  /**
   * Called on all IScalable targets when they are associated with an autoscaler.
   */
  markHasAutoscaler(): void;
  /**
   * Return the target spec properties of this Scalable.
   */
  toScalingTarget(): ScalingTarget;
}

/**
 * Properties for HorizontalPodAutoscaler
 */
export interface HorizontalPodAutoscalerProps extends ResourceProps {
  /**
   * The workload to scale up or down.
   *
   * Scalable workload types:
   * * Deployment
   * * StatefulSet
   */
  readonly target: IScalable;
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
   * @default - If metrics are not provided, then the target resource
   * constraints (e.g. cpu limit) will be used as scaling metrics.
   */
  readonly metrics?: Metric[];
  /**
   * The scaling behavior when scaling up.
   *
   * @default - Is the higher of:
   * * Increase no more than 4 pods per 60 seconds
   * * Double the number of pods per 60 seconds
   */
  readonly scaleUp?: ScalingRules;
  /**
   * The scaling behavior when scaling down.
   *
   * @default - Scale down to minReplica count with a 5 minute stabilization window.
   */
  readonly scaleDown?: ScalingRules;
}

/**
 * A HorizontalPodAutoscaler scales a workload up or down in response to a metric
 * change. This allows your services to scale up when demand is high and scale down
 * when they are no longer needed.
 *
 *
 * Typical use cases for HorizontalPodAutoscaler:
 *
 * * When Memory usage is above 70%, scale up the number of replicas to meet the demand.
 * * When CPU usage is below 30%, scale down the number of replicas to save resources.
 * * When a service is experiencing a spike in traffic, scale up the number of replicas
 *   to meet the demand. Then, when the traffic subsides, scale down the number of
 *   replicas to save resources.
 *
 * The autoscaler uses the following algorithm to determine the number of replicas to scale:
 *
 * `desiredReplicas = ceil[currentReplicas * ( currentMetricValue / desiredMetricValue )]`
 *
 * HorizontalPodAutoscaler's can be used to with any `Scalable` workload:
 * * Deployment
 * * StatefulSet
 *
 * **Targets that already have a replica count defined:**
 *
 * Remove any replica counts from the target resource before associating with a
 * HorizontalPodAutoscaler. If this isn't done, then any time a change to that object is applied,
 * Kubernetes will scale the current number of Pods to the value of the target.replicas key. This
 * may not be desired and could lead to unexpected behavior.
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
   */
  public readonly target: IScalable;
  /**
   * The maximum number of replicas that can be scaled up to.
   */
  public readonly maxReplicas: number;
  /**
   * The minimum number of replicas that can be scaled down to.
   */
  public readonly minReplicas: number;
  /**
   * The metric conditions that trigger a scale up or scale down.
   */
  public readonly metrics?: Metric[];
  /**
   * The scaling behavior when scaling up.
   */
  public readonly scaleUp: ScalingRules;
  /**
   * The scaling behavior when scaling down.
   */
  public readonly scaleDown: ScalingRules;

  private readonly _defaultScalingDuration = Duration.seconds(15);


  constructor(scope: Construct, id: string, props: HorizontalPodAutoscalerProps) {
    super(scope, id);

    this.apiObject = new k8s.KubeHorizontalPodAutoscalerV2(this, 'Resource', {
      metadata: props.metadata,
      spec: Lazy.any({ produce: () => this._toKube() }),
    });

    if (props?.minReplicas && props.minReplicas > props.maxReplicas) {
      throw new Error(`'minReplicas' (${props.minReplicas}) must be less than or equal to 'maxReplicas' (${props.maxReplicas}) in order for HorizontalPodAutoscaler to scale.`);
    }
    if (props?.scaleUp?.stabilizationWindow !== undefined) {
      this._validateStabilizationWindow('scaleUp', props.scaleUp.stabilizationWindow);
    }
    if (props?.scaleDown?.stabilizationWindow !== undefined) {
      this._validateStabilizationWindow('scaleDown', props.scaleDown.stabilizationWindow);
    }
    if (props?.scaleUp?.policies?.length) {
      this._validateScalingPolicies('scaleUp', props.scaleUp.policies);
    }
    if (props?.scaleDown?.policies?.length) {
      this._validateScalingPolicies('scaleDown', props.scaleDown.policies);
    }

    this.target = props.target;
    this.target.markHasAutoscaler();
    this.maxReplicas = props.maxReplicas;
    this.minReplicas = props.minReplicas ?? 1;
    this.metrics = props.metrics;
    this.scaleUp = {
      strategy: ScalingStrategy.MAX_CHANGE,
      stabilizationWindow: Duration.seconds(0),
      ...props.scaleUp,
      policies: props.scaleUp?.policies?.map((p) => ({ duration: this._defaultScalingDuration, ...p })) ?? [
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
    if (props?.scaleUp?.policies?.length) {
      this._validateScalingPolicies('scaleUp', props.scaleUp.policies);
    }
    this.scaleDown = {
      strategy: ScalingStrategy.MAX_CHANGE,
      stabilizationWindow: Duration.minutes(5),
      ...props.scaleDown,
      policies: props.scaleDown?.policies?.map((p) => ({ duration: this._defaultScalingDuration, ...p })) ?? [
        {
          replicas: Replicas.absolute(this.minReplicas),
          duration: Duration.minutes(5),
        },
      ],
    };

    this.node.addValidation({ validate: () => this._validateTargetReplicas() });
    this.node.addValidation({ validate: () => this._validateTargetContainers() });
  }

  /**
   * Validate a list of scaling policies.
   * @internal
   */
  private _validateScalingPolicies(direction: 'scaleUp' | 'scaleDown', policies: ScalingPolicy[]) {
    policies.forEach((p) => {
      if (p.duration !== undefined) {
        this._validateScalingPolicyDuration(direction, p.duration);
      }
    });
  }

  /**
   * Validate `ScalingPolicy.duration` is within the allowed range.
   *
   * `duration` range: 1 second - 30 min
   *
   * Kubernetes name: `ScalingPolicy.periodSeconds`.
   * @see https://kubernetes.io/docs/reference/kubernetes-api/workload-resources/horizontal-pod-autoscaler-v2/#HorizontalPodAutoscalerSpec
   * @internal
   */
  private _validateScalingPolicyDuration(direction: 'scaleUp' | 'scaleDown', duration: Duration) {
    const periodSeconds = duration.toSeconds() ?? 15;
    const isWithinRange = Boolean(0 < periodSeconds && periodSeconds <= 1800);
    if (!isWithinRange) {
      throw new Error(`'${direction}.policies' duration (${duration.toHumanString()}) is outside of the allowed range. Must be at least 1 second long and no longer than 30 minutes.`);
    }
  }

  /**
   * Validate `ScalingRules.stabilizationWindow` is within the allowed range.
   *
   * `stabilizationWindow` range: 0 seconds - 1 hour
   *
   * @see https://kubernetes.io/docs/reference/kubernetes-api/workload-resources/horizontal-pod-autoscaler-v2/#HorizontalPodAutoscalerSpec
   * @internal
   */
  private _validateStabilizationWindow(direction: 'scaleUp' | 'scaleDown', window: Duration) {
    const windowSeconds = window.toSeconds();
    const isWithinRange = Boolean(0 <= windowSeconds && windowSeconds <= 3600);
    if (!isWithinRange) {
      throw new Error(`'${direction}.stabilizationWindow' (${window.toHumanString()}) must be 0 seconds or more with a max of 1 hour.`);
    }
  }

  /**
   * Guarantee the HPA has a metric to scale on.
   * Verify that metrics are configured, if not check every pod container has a resource limit or
   * request defined.
   * @internal
   */
  private _validateTargetContainers() {
    const containers = this.target.toScalingTarget().containers;
    const hasResourceConstraints = containers.some((c) => this._hasRequestsOrLimits(c));
    if (!hasResourceConstraints && !this.metrics) {
      return ['If HorizontalPodAutoscaler does not have metrics defined, then every container in the target must have a CPU or memory resource constraint defined.'];
    }
    return [];
  }

  /**
   * Prevent the HPA from scaling a target with a replica count defined.
   * @see https://kubernetes.io/docs/tasks/run-application/horizontal-pod-autoscale/#implicit-maintenance-mode-deactivation
   * @internal
   */
  private _validateTargetReplicas() {
    const replicas = this.target.toScalingTarget().replicas;
    if (replicas) {
      return [
        `HorizontalPodAutoscaler target cannot have a fixed number of replicas (${replicas}).`,
      ];
    }
    return [];
  }

  /**
   * Validate that the container has at least one CPU/memory request/limit defined.
   * @internal
   */
  private _hasRequestsOrLimits(c: container.Container): Boolean {
    const hasRequests = c.resources?.cpu?.request || c.resources?.memory?.request;
    const hasLimits = c.resources?.cpu?.limit || c.resources?.memory?.limit;
    return Boolean(hasRequests || hasLimits);
  }


  /**
   * @internal
   */
  public _toKube(): k8s.HorizontalPodAutoscalerSpecV2 {
    const scalingTarget = this.target.toScalingTarget();
    return {
      maxReplicas: this.maxReplicas,
      minReplicas: this.minReplicas,
      scaleTargetRef: {
        apiVersion: scalingTarget.apiVersion,
        name: scalingTarget.name,
        kind: scalingTarget.kind,
      },
      metrics: this.metrics?.map(m => m._toKube()),
      behavior: {
        scaleUp: {
          policies: this.scaleUp.policies?.map((p) => ({
            ...p.replicas._toKube(),
            periodSeconds: p.duration?.toSeconds() ?? this._defaultScalingDuration.toSeconds(),
          })),
          selectPolicy: this.scaleUp.strategy,
          stabilizationWindowSeconds: this.scaleUp.stabilizationWindow?.toSeconds(),
        },
        scaleDown: {
          policies: this.scaleDown.policies?.map((p) => ({
            ...p.replicas._toKube(),
            periodSeconds: p.duration?.toSeconds() ?? this._defaultScalingDuration.toSeconds(),
          })),
          selectPolicy: this.scaleDown.strategy,
          stabilizationWindowSeconds: this.scaleDown.stabilizationWindow?.toSeconds(),
        },
      },
    };
  }
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
   * A selector to find a metric by label.
   *
   * When set, it is passed as an additional parameter to the metrics server
   * for more specific metrics scoping.
   *
   * @default - Just the metric 'name' will be used to gather metrics.
   */
  readonly labelSelector?: pod.LabelSelector;
}


/**
 * Options for `Metric.containerResource()`
 */
export interface MetricContainerResourceOptions {
  /**
   * Container where the metric can be found.
   */
  readonly container: container.Container;
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
  readonly object: IResource;
}

/**
 * A metric condition that HorizontalPodAutoscaler's scale on.
 */
export class Metric {

  /**
   * Metric that tracks the CPU of a container. This metric
   * will be tracked across all pods of the current scale target.
   *
   */
  public static containerCpu(options: MetricContainerResourceOptions): Metric {
    return new Metric({
      type: 'ContainerResource',
      containerResource: {
        name: 'cpu',
        container: options.container.name,
        target: options.target._toKube(),
      },
    });
  }

  /**
   * Metric that tracks the Memory of a container. This metric
   * will be tracked across all pods of the current scale target.
   *
   */
  public static containerMemory(options: MetricContainerResourceOptions): Metric {
    return new Metric({
      type: 'ContainerResource',
      containerResource: {
        name: 'memory',
        container: options.container.name,
        target: options.target._toKube(),
      },
    });
  }

  /**
   * Metric that tracks the volume size of a container. This metric
   * will be tracked across all pods of the current scale target.
   *
   */
  public static containerStorage(options: MetricContainerResourceOptions): Metric {
    return new Metric({
      type: 'ContainerResource',
      containerResource: {
        name: 'storage',
        container: options.container.name,
        target: options.target._toKube(),
      },
    });
  }

  /**
   * Metric that tracks the local ephemeral storage of a container. This metric
   * will be tracked across all pods of the current scale target.
   *
   */
  public static containerEphemeralStorage(options: MetricContainerResourceOptions): Metric {
    return new Metric({
      type: 'ContainerResource',
      containerResource: {
        name: 'ephemeral-storage',
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
   * * Scale up when the length of an SQS queue is greater than 10 messages.
   * * Scale down when an outside load balancer's queries are less than 10000 per second.
   */
  public static external(options: MetricOptions): Metric {
    return new Metric({
      type: 'External',
      external: {
        metric: {
          name: options.name,
          selector: options.labelSelector?._toKube(),
        },
        target: options.target._toKube(),
      },
    });
  }

  /**
  * Metric that describes a metric of a kubernetes object
  *
  * Use case:
  * * Scale on a Kubernetes Ingress's hits-per-second metric.
  */
  public static object(options: MetricObjectOptions): Metric {
    return new Metric({
      type: 'Object',
      object: {
        describedObject: {
          apiVersion: options.object.apiVersion,
          kind: options.object.kind,
          name: options.object.name,
        },
        metric: {
          name: options.name,
          selector: options.labelSelector?._toKube(),
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
      type: 'Pods',
      pods: {
        metric: {
          name: options.name,
          selector: options.labelSelector?._toKube(),
        },
        target: options.target._toKube(),
      },
    });
  }

  /**
   * Tracks the available CPU of the pods in a target.
   *
   * Note: Since the resource usages of all the containers are summed up the total
   * pod utilization may not accurately represent the individual container resource
   * usage. This could lead to situations where a single container might be running
   * with high usage and the HPA will not scale out because the overall pod usage
   * is still within acceptable limits.
   *
   * Use case:
   * * Scale up when CPU is above 40%.
   */
  public static resourceCpu(target: MetricTarget): Metric {
    return new Metric({
      type: 'Resource',
      resource: {
        name: 'cpu',
        target: target._toKube(),
      },
    });
  }

  /**
   * Tracks the available Memory of the pods in a target.
   *
   * Note: Since the resource usages of all the containers are summed up the total
   * pod utilization may not accurately represent the individual container resource
   * usage. This could lead to situations where a single container might be running
   * with high usage and the HPA will not scale out because the overall pod usage
   * is still within acceptable limits.
   *
   * Use case:
   * * Scale up when Memory is above 512MB.
   */
  public static resourceMemory(target: MetricTarget): Metric {
    return new Metric({
      type: 'Resource',
      resource: {
        name: 'memory',
        target: target._toKube(),
      },
    });
  }

  /**
   * Tracks the available Storage of the pods in a target.
   *
   * Note: Since the resource usages of all the containers are summed up the total
   * pod utilization may not accurately represent the individual container resource
   * usage. This could lead to situations where a single container might be running
   * with high usage and the HPA will not scale out because the overall pod usage
   * is still within acceptable limits.
   *
   */
  public static resourceStorage(target: MetricTarget): Metric {
    return new Metric({
      type: 'Resource',
      resource: {
        name: 'storage',
        target: target._toKube(),
      },
    });
  }

  /**
   * Tracks the available Ephemeral Storage of the pods in a target.
   *
   * Note: Since the resource usages of all the containers are summed up the total
   * pod utilization may not accurately represent the individual container resource
   * usage. This could lead to situations where a single container might be running
   * with high usage and the HPA will not scale out because the overall pod usage
   * is still within acceptable limits.
   *
   */
  public static resourceEphemeralStorage(target: MetricTarget): Metric {
    return new Metric({
      type: 'Resource',
      resource: {
        name: 'ephemeral-storage',
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
  * @param value The target value.
  */
  public static value(value: number): MetricTarget {
    return new MetricTarget({
      type: 'Value',
      value: k8s.Quantity.fromNumber(value),
    });
  }

  /**
   * Target the average value across all relevant pods.
   *
   * @param averageValue The average metric value.
   */
  public static averageValue(averageValue: number): MetricTarget {
    return new MetricTarget({
      type: 'AverageValue',
      averageValue: k8s.Quantity.fromNumber(averageValue),
    });
  }

  /**
   * Target a percentage value across all relevant pods.
   *
   * @param averageUtilization The percentage of the utilization metric. e.g. `50` for 50%.
   */
  public static averageUtilization(averageUtilization: number): MetricTarget {
    return new MetricTarget({
      type: 'Utilization',
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
 * Defines the scaling behavior for one direction.
 */
export interface ScalingRules {
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
   * @default * On scale down no stabilization is performed.
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
   * @default * Scale up
   *            * Increase no more than 4 pods per 60 seconds
   *            * Double the number of pods per 60 seconds
   *          * Scale down
   *            * Decrease to minReplica count
   */
  readonly policies?: ScalingPolicy[];
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

export interface ScalingPolicy {
  /**
   * The type and quantity of replicas to change.
   */
  readonly replicas: Replicas;
  /**
   * The amount of time the scaling policy has to
   * continue scaling before the target metric must be
   * revalidated.
   *
   * Must be greater than 0 seconds and no longer than 30 minutes.
   *
   * @default - 15 seconds
   */
  readonly duration?: Duration;
}


/**
 * The amount of replicas that will change.
 */
export class Replicas {

  /**
   * Changes the pods by a percentage of the it's current value.
   *
   * @param value The percentage of change to apply. Must be greater than 0.
   */
  public static percent(value: number) {
    return new Replicas ({
      type: 'Percent',
      value,
    });
  }

  /**
   * Changes the pods by a percentage of the it's current value.
   *
   * @param value The amount of change to apply. Must be greater than 0.
   */
  public static absolute(value: number) {
    return new Replicas({
      type: 'Pods',
      value,
    });
  }

  private constructor(private readonly replicas: Pick<k8s.HpaScalingPolicyV2, 'type' | 'value'>) { }

  /**
   * @internal
   */
  public _toKube(): Pick<k8s.HpaScalingPolicyV2, 'type' | 'value'> {
    return {
      type: this.replicas.type,
      value: this.replicas.value,
    };
  }
}
