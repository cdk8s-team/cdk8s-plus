import { ApiObjectMetadata, ApiObjectMetadataDefinition, Names } from 'cdk8s';
import { Construct } from 'constructs';
import * as k8s from './imports/k8s';
import { AbstractPod, AbstractPodProps } from './pod';

/**
 * Properties for `Workload`.
 */
export interface WorkloadProps extends AbstractPodProps {

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
 * A workload is an application running on Kubernetes. Whether your workload is a single
 * component or several that work together, on Kubernetes you run it inside a set of pods.
 * In Kubernetes, a Pod represents a set of running containers on your cluster.
 */
export abstract class Workload extends AbstractPod {

  /**
   * The metadata of pods in this workload.
   */
  public readonly podMetadata: ApiObjectMetadataDefinition;

  private readonly _matchLabels: Record<string, string> = {};
  private readonly _matchExpressions: k8s.LabelSelectorRequirement[] = [];

  constructor(scope: Construct, id: string, props: WorkloadProps = {}) {
    super(scope, id, props);

    this.podMetadata = new ApiObjectMetadataDefinition(props.podMetadata);

    if (props.select ?? true) {
      const selector = `cdk8s.${this.constructor.name.toLowerCase()}`;
      const matcher = Names.toLabelValue(this);
      this.select(LabelSelector.equals(selector, matcher, true));
    }

  }

  /**
   * Configure selectors for this workload.
   */
  public select(...selectors: LabelSelector[]) {
    for (const selector of selectors) {
      if (selector.operator) {
        this._matchExpressions.push({ key: selector.key, values: selector.values, operator: selector.operator });
      } else {
        const value = selector.values![0];
        this._matchLabels[selector.key] = value;
        if (selector.applyToTemplate) {
          this.podMetadata.addLabel(selector.key, value);
        }
      }
    }
  }

  /**
   * The label matchers this workload will use in order to select pods.
   *
   * Returns a a copy. Use `select()` to add label matchers.
   */
  public get matchLabels(): Record<string, string> {
    return { ...this._matchLabels };
  }

  /**
   * The expression matchers this workload will use in order to select pods.
   *
   * Returns a a copy. Use `select()` to add expression matchers.
   */
  public get matchExpressions(): k8s.LabelSelectorRequirement[] {
    return [...this._matchExpressions];
  }

}

/**
 * A label selector is a label query over a set of resources.
 *
 * @see https://kubernetes.io/docs/concepts/overview/working-with-objects/labels/#label-selectors
 */
export class LabelSelector {

  /**
   * Creates a `matchLabels` entry from the key and value.
   * Use `applyToTemplate` to also add this label to the pod metadata of the workload.
   */
  public static equals(key: string, value: string, applyToTemplate?: boolean) {
    return new LabelSelector(applyToTemplate ?? false, key, [value], undefined);
  }

  /**
   * Creates a `matchExpressions` "In" entry.
   */
  public static in(key: string, values: string[]) {
    return new LabelSelector(false, key, values, 'In');
  }

  /**
   * Creates a `matchExpressions` "NotIn" entry.
   */
  public static notIn(key: string, values: string[]) {
    return new LabelSelector(false, key, values, 'NotIn');
  }

  /**
   * Creates a `matchExpressions` "Exists" entry.
   */
  public static exists(key: string) {
    return new LabelSelector(false, key, undefined, 'Exists');
  }

  /**
   * Creates a `matchExpressions` "DoesNotExist" entry.
   */
  public static doesNotExist(key: string) {
    return new LabelSelector(false, key, undefined, 'DoesNotExist');
  }

  private constructor(
    public readonly applyToTemplate: boolean,
    public readonly key: string,
    public readonly values?: string[],
    public readonly operator?: string) {
  }
}