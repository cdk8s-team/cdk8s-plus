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
  target: Workload;
  /**
   * The maximum number of replicas that can be scaled up to.
   */
  maxReplicas: number;
  /**
   * The minimum number of replicas that can be scaled down to.
   */
  minReplicas?: number;
  /**
   * The metric conditions that trigger a scale up or scale down.
   */
  metrics?: Metric[];
  /**
  * The scaling behavior when scaling up.
  */
  scaleUp?: {
    selected?: ScalePolicy['type'];
    policies?: ScalePolicy[];
    stabilizationWindow?: Duration;
  };
  /**
  * The scaling behavior when scaling down.
  */
  scaleDown?: {
    selected?: ScalePolicy['type'];
    policies?: ScalePolicy[];
    stabilizationWindow?: Duration;
  };
}

/**
 * A HorizontalPodAutoscaler scales a workload up or down in response to a metric
 * change. This allows a service to meet demand as it peeks.
 *
 * Use Case
 *
 * The following are typical use cases for HorizontalPodAutoscaler:
 *
 * - When CPU usage is above 70%, scale up the number of replicas to meet the demand.
 * - When CPU usage is below 30%, scale down the number of replicas to save resources.
 * - When a service is experiencing a spike in traffic, scale up the number of replicas
 * to meet the demand. Then, when the traffic subsides, scale down the number of
 * replicas to save resources.
 */
export class HorizontalPodAutoscaler extends Resource {
  /**
 * @see base.Resource.apiObject
 */
  protected readonly apiObject: ApiObject;

  public readonly resourceType = 'horizontalpodautoscaler';

  /**
   * The maximum number of replicas that can be scaled up to.
   */
  public readonly maxReplicas: number;

  /**
   * The minimum number of replicas that can be scaled down to.
   */
  public readonly minReplicas?: number;

  /**
   * The resource to scale up or down.
   */
  public readonly target: Workload;

  /**
   * The metric conditions that trigger a scale up or scale down.
   */
  public readonly metrics?: Metric[];

  /**
   * The scaling behavior when scaling up.
   */
  public readonly scaleUp?: {
    selected?: ScalePolicy['type'];
    policies?: ScalePolicy[];
    stabilizationWindow?: Duration;
  };

  /**
   * The scaling behavior when scaling down.
   */
  public readonly scaleDown?: {
    selected?: ScalePolicy['type'];
    policies?: ScalePolicy[];
    stabilizationWindow?: Duration;
  };


  constructor(scope: Construct, id: string, props: HorizontalPodAutoscalerProps) {
    super(scope, id);
    this.apiObject = new k8s.KubeHorizontalPodAutoscalerV2(this, 'Resource', {
      metadata: props.metadata,
      spec: Lazy.any({ produce: () => this._toKube() }),
    });

    const hasContainerWithoutResources = props.target.containers.some((r) => !r.resources?.cpu || !r.resources?.memory);
    if (hasContainerWithoutResources && !props.metrics) {
      throw new Error('Every container in the HorizontalPodAutoscaler target must have CPU or memory resources defined');
    }

    this.maxReplicas = props.maxReplicas;
    this.target = props.target;
    this.metrics = props.metrics || [];
    this.scaleUp = props?.scaleUp || {};
    this.scaleDown = props?.scaleDown || {};
  }

  /**
   * @internal
   */
  public _toKube(): k8s.HorizontalPodAutoscalerSpecV2 {
    return {
      maxReplicas: this.maxReplicas,
      scaleTargetRef: {
        apiVersion: this.target.apiVersion,
        kind: this.target.kind,
        name: this.target.name,
      },
      metrics: this.metrics?.map(m => m?._toKube()),
      behavior: {
        scaleUp: {
          policies: this.scaleUp?.policies?.map(p => p?._toKube()),
          selectPolicy: this.scaleUp?.selected,
          stabilizationWindowSeconds: this.scaleUp?.stabilizationWindow?.toSeconds(),
        },
        scaleDown: {
          policies: this.scaleDown?.policies?.map(p => p?._toKube()),
          selectPolicy: this.scaleDown?.selected,
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
  CONTAINER_RESOURCE = 'ContainerResource',
  EXTERNAL = 'External',
  OBJECT = 'Object',
  PODS = 'Pods',
  RESOURCE = 'Resource',
}

/**
 * Base options for a Metric
 */
export interface MetricOptions {
  /**
   * The target metric value that will trigger scaling.
   */
  target: MetricTarget;
  /**
  * The name of the metric to scale on.
  */
  name: string;
  /**
   * A selector to find a metric by labels.
   */
  labelSelector?: kplus.LabelSelector;
}


/**
 * Options for `Metric.containerResource()`
 */
export interface MetricContainerResourceOptions extends Omit<MetricOptions, 'labelSelector'> {
  /**
   * The container where the metric can be found.
   */
  container: Container;
}

/**
 * Options for `Metric.object()`
 */
export interface MetricObjectOptions extends MetricOptions {
  /**
   * The Resource where the metric can be found.
   */
  object: Resource;
}

/**
 * A metric condition that HorizontalPodAutoscaler's scale on.
 */
export class Metric {

  /**
   * A container metric that will be tracked across all pods of the current scale target.
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
   * Global metric that is not associated with any Kubernetes object. It allows
   * autoscaling based on information coming from components running outside of
   * cluster (for example length of queue in cloud messaging service, or QPS from
   * loadbalancer running outside of cluster).
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
  * Metric that describes a kubernetes object (for example,
  * hits-per-second on an Ingress object)
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
   * Metric that describes each pod in the current scale target (for
   * example, transactions-processed-per-second). The values will be
   * averaged together before being compared to the target value
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
  * A resource metric known to Kubernetes, as specified in requests and
  * limits, describing each pod in the current scale target (e.g. CPU or
  * memory).  Such metrics are built in to Kubernetes, and have special
  * scaling options on top of those available to normal per-pod metrics
  * (the "pods" source).
  */
  public static resource(options: MetricOptions): Metric {
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
 */
export class MetricTarget {
  public static value(target: string): MetricTarget {
    return new MetricTarget({
      type: MetricTargetType.VALUE,
      value: k8s.Quantity.fromString(target),
    });
  }

  public static averageValue(target: string): MetricTarget {
    return new MetricTarget({
      type: MetricTargetType.AVERAGE_VALUE,
      averageValue: k8s.Quantity.fromString(target),
    });
  }

  public static averageUtilization(target: number): MetricTarget {
    return new MetricTarget({
      type: MetricTargetType.UTILIZATION,
      averageUtilization: target,
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
 * Options for `ScalePolicy`.
 */
export interface ScalePolicyOptions {
  /**
   * The type of scaling behavior to configure.
   */
  type: string;
  /**
   * The amount of change to apply.
   */
  value: number;
  /**
   * The amount of time the change is applied for before the scaling condition is
   * revalidated.
   *
   * Must be greater than 0 seconds and no longer than 30 minutes.
   */
  period: Duration;
}


/**
 * A ScalePolicy defines how scaling should be applied.
 */
export class ScalePolicy {

  public static value(options: ScalePolicyOptions): ScalePolicy {
    const periodSeconds = options.period.toSeconds();
    if (0 >= periodSeconds && periodSeconds > 1800) {
      throw new Error('ScalePolicy period must be greater than 0 seconds and no longer than 30 minutes.');
    }

    return new ScalePolicy({
      type: options.type,
      value: options.value,
      periodSeconds,
    });
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
