import { ApiObjectMetadata, ApiObjectMetadataDefinition, Names } from 'cdk8s';
import { Construct } from 'constructs';
import * as k8s from './imports/k8s';
import * as pod from './pod';

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
 * Options for `workload.spread`.
 */
export interface WorkloadSpreadOptions {

  /**
   * Indicates the spread is optional, with this weight score.
   *
   * @default - no weight. spread is assumed to be required.
   */
  readonly weight?: number;

}

/**
 * Options for `workload.coloate`.
 */
export interface WorkloadColocateOptions {

  /**
   * Which labels to use as the label selector.
   *
   * @default - all labels are selected.
   */
  readonly labels?: string[];

  /**
   * Which topology to coloate on.
   *
   * @default - TopologyKey.HOSTNAME
   */
  readonly topologyKey?: pod.TopologyKey;

  /**
   * Indicates the co-location is optional, with this weight score.
   *
   * @default - no weight. co-location is assumed to be required.
   */
  readonly weight?: number;

  /**
   * Spread the workloads based on the topology key.
   *
   * @default true
   */
  readonly spread?: boolean;
}

export interface WorkloadRepelOptions {
  /**
   * Which labels to use as the label selector.
   *
   * @default - all labels are selected.
   */
  readonly labels?: string[];

  /**
   * Which topology to coloate on.
   *
   * @default - TopologyKey.HOSTNAME
   */
  readonly topologyKey?: pod.TopologyKey;

  /**
   * Indicates the repel is optional, with this weight score.
   *
   * @default - no weight. repel is assumed to be required.
   */
  readonly weight?: number;

}

/**
 *
 */
export interface ISelectable {

  /**
   * List of label queries that the node needs to satisfy.
   */
  readonly labelSelector?: pod.PodLabelQuery[];

  /**
   * List of label queries that the namespace needs to satisfy.
   */
  readonly namespaceSelector?: pod.PodLabelQuery[];

  /**
   * Static list of namespaces the pods can belong to.
   */
  readonly namespaces?: string[];

}


/**
 * A workload is an application running on Kubernetes. Whether your workload is a single
 * component or several that work together, on Kubernetes you run it inside a set of pods.
 * In Kubernetes, a Pod represents a set of running containers on your cluster.
 */
export abstract class Workload extends pod.AbstractPod implements ISelectable {

  /**
   * The metadata of pods in this workload.
   */
  public readonly podMetadata: ApiObjectMetadataDefinition;

  private readonly _matchExpressions: k8s.LabelSelectorRequirement[] = [];
  private readonly _matchLabels: Record<string, string> = {};

  constructor(scope: Construct, id: string, props: WorkloadProps = {}) {
    super(scope, id, props);

    this.podMetadata = new ApiObjectMetadataDefinition(props.podMetadata);

    if (props.select ?? true) {
      const selector = `cdk8s.${this.constructor.name.toLowerCase()}`;
      const matcher = Names.toLabelValue(this);
      this.select(pod.PodLabelQuery.is(selector, matcher));
      this.podMetadata.addLabel(selector, matcher);
    }

  }

  public get namespaces(): string[] | undefined {
    return this.podMetadata.namespace ? [this.podMetadata.namespace] : [];
  }

  public get namespaceSelector(): pod.PodLabelQuery[] | undefined {
    return undefined;
  }

  public get labelSelector(): pod.PodLabelQuery[] | undefined {
    return this._labels(this).map(l => pod.PodLabelQuery.is(l, this.podMetadata.getLabel(l)!));
  }

  /**
   * Configure selectors for this workload.
   */
  public select(...selectors: pod.PodLabelQuery[]) {
    for (const selector of selectors) {
      if (selector.operator === 'In' && selector.values?.length === 1) {
        this._matchLabels[selector.key] = selector.values[0];
      } else {
        this._matchExpressions.push({ key: selector.key, values: selector.values, operator: selector.operator });
      }
    }
  }

  /**
   * Spread the pods in this workload by the topology key.
   */
  public spread(topologyKey: pod.TopologyKey, options: WorkloadSpreadOptions = {}) {

    const labels: string[] = this._labels(this);
    const labelSelector = labels.map(l => pod.PodLabelQuery.is(l, this.podMetadata.getLabel(l)!));

    if (options.weight) {
      this.affinity.avoidPod({ weight: options.weight, preference: { topologyKey, labelSelector } });
    } else {
      this.affinity.rejectPod({ topologyKey, labelSelector });
    }
  }

  /**
   * Co-locate this workload with another one.
   */
  public colocate(selectable: ISelectable, options: WorkloadColocateOptions = {}) {

    const topologyKey = options.topologyKey ?? pod.TopologyKey.HOSTNAME;
    const requirement: pod.PodRequirement = {
      topologyKey,
      labelSelector: selectable.labelSelector,
      namespaces: selectable.namespaces,
      namespaceSelector: selectable.namespaceSelector,
    };

    if (options.weight) {
      this.affinity.preferPod({ weight: options.weight, preference: requirement });
    } else {
      this.affinity.requirePod(requirement);
    }
  }

  /**
   * Repel this workload from the other one.
   */
  public repel(workload: Workload, options: WorkloadRepelOptions = {}) {

    const labels: string[] = options.labels ?? this._labels(workload);
    const topologyKey = options.topologyKey ?? pod.TopologyKey.HOSTNAME;
    const labelSelector = labels.map(l => pod.PodLabelQuery.is(l, workload.podMetadata.getLabel(l)!));
    const namespaces = workload.podMetadata.namespace ? [workload.podMetadata.namespace] : [];
    const requirement: pod.PodRequirement = { topologyKey, labelSelector, namespaces };

    if (options.weight) {
      this.affinity.avoidPod({ weight: options.weight, preference: requirement });
    } else {
      this.affinity.rejectPod(requirement);
    }

  }

  /**
   * The label matchers this workload will use in order to select pods.
   *
   * Returns a a copy. Use `select()` to add label matchers.
   */
  public get matchLabels(): Record<string, string> {
    return this._matchLabels;
  }

  /**
   * The expression matchers this workload will use in order to select pods.
   *
   * Returns a a copy. Use `select()` to add expression matchers.
   */
  public get matchExpressions(): LabelSelectorRequirement[] {
    return [...this._matchExpressions];
  }

  private _labels(workload: Workload) {
    // TODO: expose labels from podMetadata in cdk8s-core.
    return Object.keys(workload.podMetadata.toJson().labels);
  }

  /**
   * @internal
   */
  public _toLabelSelector(): k8s.LabelSelector {
    return { matchExpressions: this._matchExpressions, matchLabels: this._matchLabels };
  }

}

export class Pods implements ISelectable {

  public static query(): Pods {
    return new Pods();
  }

  private constructor(
    public readonly labelSelector?: pod.PodLabelQuery[],
    public readonly namespaceSelector?: pod.PodLabelQuery[],
    public readonly namespaces?: string[],
  ) {};

  public withLabelSelector(...labelSelector: pod.PodLabelQuery[]): Pods {
    return new Pods(labelSelector);
  }

  public withNamespaceSelector(...namespaceSelector: pod.PodLabelQuery[]): Pods {
    return new Pods(this.labelSelector, namespaceSelector);
  }

  public withNamespaces(...namespaces: string[]): Pods {
    return new Pods(this.labelSelector, this.namespaceSelector, namespaces);
  }

}