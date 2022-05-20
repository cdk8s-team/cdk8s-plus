import { ApiObjectMetadata, ApiObjectMetadataDefinition, Names } from 'cdk8s';
import { Construct } from 'constructs';
import * as k8s from './imports/k8s';
import * as pod from './pod';
import { undefinedIfEmpty } from './utils';

/**
 * Properties for `Workload`.
 */
export interface WorkloadProps extends pod.AbstractPodProps {

  /**
   * The pod metadata of this workload.
   */
  readonly podMetadata?: ApiObjectMetadata;

  /**
   * Automatically allocates a pod label selector for this workload and add
   * it to the pod metadata. This ensures this workload manages pods created by
   * its pod template.
   *
   * @default true
   */
  readonly select?: boolean;

}

/**
 * A label selector requirement is a selector that contains values, a key, and an operator that
 * relates the key and values.
 */
export interface LabelSelectorRequirement {
  /**
   * The label key that the selector applies to.
   */
  readonly key: string;

  /**
   * Represents a key's relationship to a set of values.
   */
  readonly operator: string;

  /**
   * An array of string values. If the operator is In or NotIn, the values array
   * must be non-empty. If the operator is Exists or DoesNotExist,
   * the values array must be empty. This array is replaced during a strategic merge patch.
   */
  readonly values?: string[];
}

/**
 * A workload is an application running on Kubernetes. Whether your workload is a single
 * component or several that work together, on Kubernetes you run it inside a set of pods.
 * In Kubernetes, a Pod represents a set of running containers on your cluster.
 */
export abstract class Workload extends pod.AbstractPod {

  /**
   * The metadata of pods in this workload.
   */
  public readonly podMetadata: ApiObjectMetadataDefinition;

  public readonly scheduling: WorkloadScheduling;

  private readonly _selectors: k8s.LabelSelector[] = [];

  constructor(scope: Construct, id: string, props: WorkloadProps = {}) {
    super(scope, id, props);

    this.podMetadata = new ApiObjectMetadataDefinition(props.podMetadata);
    this.scheduling = new WorkloadScheduling(this);

    const matcher = Names.toLabelValue(this);
    this.podMetadata.addLabel(pod.Pod.ADDRESS_LABEL, matcher);

    if (props.select ?? true) {
      this.select(pod.LabelSelector.of({ labels: { [pod.Pod.ADDRESS_LABEL]: matcher } }));
    }

  }

  /**
   * Configure selectors for this workload.
   */
  public select(...selectors: pod.LabelSelector[]) {
    this._selectors.push(...selectors.map(s => s._toKube()));
  }

  /**
   * The label matchers this workload will use in order to select pods.
   *
   * Returns a a copy. Use `select()` to add label matchers.
   */
  public get matchLabels(): Record<string, string> {
    const labels: any = {};
    for (const selector of this._selectors) {
      for (const [key, value] of Object.entries(selector.matchLabels ?? {})) {
        labels[key] = value;
      }
    }
    return labels;
  }

  /**
   * The expression matchers this workload will use in order to select pods.
   *
   * Returns a a copy. Use `select()` to add expression matchers.
   */
  public get matchExpressions(): LabelSelectorRequirement[] {
    const expressions: LabelSelectorRequirement[] = [];
    for (const selector of this._selectors) {
      for (const expression of selector.matchExpressions ?? []) {
        expressions.push(expression);
      }
    }

    return expressions;
  }

  /**
   * @internal
   */
  public _toLabelSelector(): k8s.LabelSelector {
    return {
      matchExpressions: undefinedIfEmpty(this.matchExpressions),
      matchLabels: undefinedIfEmpty(this.matchLabels),
    };
  }

  /**
   * @internal
   */
  public _toPodSpec(): k8s.PodSpec {
    const scheduling = this.scheduling._toKube();
    return {
      ...super._toPodSpec(),
      affinity: scheduling.affinity,
      nodeName: scheduling.nodeName,
      tolerations: scheduling.tolerations,
    };
  }
}

/**
 * Options for `WorkloadScheduling.spread`.
 */
export interface WorkloadSchedulingSpreadOptions {

  /**
   * Indicates the spread is optional, with this weight score.
   *
   * @default - no weight. spread is assumed to be required.
   */
  readonly weight?: number;

  /**
   * Which topology to spread on.
   *
   * @default - Topology.HOSTNAME
   */
  readonly topology?: pod.Topology;

}

/**
 * Controls the pod scheduling strategy of this workload.
 * It offers some additional API's on top of the core pod scheduling.
 */
export class WorkloadScheduling extends pod.PodScheduling {

  /**
   * Spread the pods in this workload by the topology key.
   * A spread is a separation of the pod from itself and is used to
   * balance out pod replicas across a given topology.
   */
  public spread(options: WorkloadSchedulingSpreadOptions = {}) {
    this.separate(this.instance, { weight: options.weight, topology: options.topology ?? pod.Topology.HOSTNAME });
  }

}