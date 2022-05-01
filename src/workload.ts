import { ApiObjectMetadata, ApiObjectMetadataDefinition, Names } from 'cdk8s';
import { Construct } from 'constructs';
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
 * Possible operators.
 */
export enum LabelSelectorRequirementOperator {

  /**
   * In.
   */
  IN = 'In',

  /**
   * NotIn.
   */
  NOT_IN = 'NotIn',

  /**
   * Exists.
   */
  EXISTS = 'Exists',

  /**
   * DoesNotExist.
   */
  DOES_NOT_EXIST = 'DoesNotExist'
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
  readonly operator: LabelSelectorRequirementOperator;

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

  private readonly _matchLabels: Record<string, string> = {};
  private readonly _matchExpressions: LabelSelectorRequirement[] = [];

  constructor(scope: Construct, id: string, props: WorkloadProps = {}) {
    super(scope, id, props);

    this.podMetadata = new ApiObjectMetadataDefinition(props.podMetadata);

    if (props.select ?? true) {
      const selector = `cdk8s.${this.constructor.name.toLowerCase()}`;
      const matcher = Names.toLabelValue(this);
      this.select(LabelSelector.is(selector, matcher, true));
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
  public get matchExpressions(): LabelSelectorRequirement[] {
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
  public static is(key: string, value: string, applyToTemplate?: boolean) {
    return new LabelSelector(applyToTemplate ?? false, key, [value], undefined);
  }

  /**
   * Creates a `matchExpressions` "In" entry.
   */
  public static in(key: string, values: string[]) {
    return new LabelSelector(false, key, values, LabelSelectorRequirementOperator.IN);
  }

  /**
   * Creates a `matchExpressions` "NotIn" entry.
   */
  public static notIn(key: string, values: string[]) {
    return new LabelSelector(false, key, values, LabelSelectorRequirementOperator.NOT_IN);
  }

  /**
   * Creates a `matchExpressions` "Exists" entry.
   */
  public static exists(key: string) {
    return new LabelSelector(false, key, undefined, LabelSelectorRequirementOperator.EXISTS);
  }

  /**
   * Creates a `matchExpressions` "DoesNotExist" entry.
   */
  public static doesNotExist(key: string) {
    return new LabelSelector(false, key, undefined, LabelSelectorRequirementOperator.DOES_NOT_EXIST);
  }

  private constructor(
    public readonly applyToTemplate: boolean,
    public readonly key: string,
    public readonly values?: string[],
    public readonly operator?: LabelSelectorRequirementOperator) {
  }
}