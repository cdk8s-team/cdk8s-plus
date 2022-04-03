import { ApiObjectMetadata, ApiObjectMetadataDefinition, Names } from 'cdk8s';
import { Construct } from 'constructs';
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
   * Automatically allocates a pod selector for this workload.
   *
   * @default true
   */
  readonly defaultSelector?: boolean;

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

  private readonly _labelSelector: Record<string, string> = {};

  constructor(scope: Construct, id: string, props: WorkloadProps = {}) {
    super(scope, id, props);

    this.podMetadata = new ApiObjectMetadataDefinition(props.podMetadata);

    if (props.defaultSelector ?? true) {
      const selector = `cdk8s.${this.constructor.name.toLowerCase()}`;
      const matcher = Names.toLabelValue(this);
      this.podMetadata.addLabel(selector, matcher);
      this.selectByLabel(selector, matcher);
    }

  }

  /**
   * Configure a label selector to this workload.
   * Pods that have the label will be selected by workloads configured with this spec.
   *
   * @param key - The label key.
   * @param value - The label value.
   */
  public selectByLabel(key: string, value: string) {
    this._labelSelector[key] = value;
  }

  /**
   * The labels this workload will match against in order to select pods.
   *
   * Returns a a copy. Use `selectByLabel()` to add labels.
   */
  public get labelSelector(): Record<string, string> {
    return { ...this._labelSelector };
  }

}
