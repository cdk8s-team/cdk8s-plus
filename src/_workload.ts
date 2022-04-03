import { ApiObjectMetadata, ApiObjectMetadataDefinition, Names } from 'cdk8s';
import { Construct } from 'constructs';
import { Resource, ResourceProps } from './base';
import { Container, ContainerProps } from './container';
import { HostAlias, PodSecurityContext, PodSpec, PodSpecProps, RestartPolicy } from './pod';
import { IServiceAccount } from './service-account';
import { Volume } from './volume';

/**
 * Properties for `Workload`.
 */
export interface WorkloadProps extends ResourceProps, PodSpecProps {

  /**
   * The pod metadata of this workload.
   */
  readonly podMetadata?: ApiObjectMetadata;

}

export abstract class Workload extends Resource {

  protected readonly podSpec: PodSpec;

  /**
   * The metadata of pods in this workload.
   */
  public readonly podMetadata: ApiObjectMetadataDefinition;

  constructor(scope: Construct, id: string, props: WorkloadProps = {}) {
    super(scope, id);

    this.podSpec = new PodSpec(props);
    this.podMetadata = new ApiObjectMetadataDefinition(props.podMetadata);
  }

  public get containers(): Container[] {
    return this.podSpec.containers;
  }

  public get initContainers(): Container[] {
    return this.podSpec.initContainers;
  }

  public get volumes(): Volume[] {
    return this.podSpec.volumes;
  }

  public get restartPolicy(): RestartPolicy | undefined {
    return this.podSpec.restartPolicy;
  }

  public get serviceAccount(): IServiceAccount | undefined {
    return this.podSpec.serviceAccount;
  }

  public get securityContext(): PodSecurityContext {
    return this.podSpec.securityContext;
  }

  public get hostAliases(): HostAlias[] {
    return this.podSpec.hostAliases;
  }

  public addContainer(container: ContainerProps): Container {
    return this.podSpec.addContainer(container);
  }

  public addInitContainer(container: ContainerProps): Container {
    return this.podSpec.addInitContainer(container);
  }

  public addVolume(volume: Volume): void {
    return this.podSpec.addVolume(volume);
  }

  public addHostAlias(hostAlias: HostAlias): void {
    return this.podSpec.addHostAlias(hostAlias);
  }

}

export interface LongRunningWorkloadProps extends WorkloadProps {

  /**
   * Automatically allocates a pod selector for this deployment.
   *
   * If this is set to `false` you must define your selector through
   * `deployment.podMetadata.addLabel()` and `deployment.selectByLabel()`.
   *
   * @default true
   */
  readonly defaultSelector?: boolean;

}

export abstract class LongRunningWorkload extends Workload {

  private readonly _labelSelector: Record<string, string> = {};

  constructor(scope: Construct, id: string, props: LongRunningWorkloadProps = {}) {
    super(scope, id, props);

    if (props.defaultSelector ?? true) {
      const selector = `cdk8s.${this.constructor.name.toLowerCase()}`;
      const matcher = Names.toLabelValue(this);
      this.podMetadata.addLabel(selector, matcher);
      this.selectByLabel(selector, matcher);
    }
  }

  /**
   * Configure a label selector to this deployment.
   * Pods that have the label will be selected by deployments configured with this spec.
   *
   * @param key - The label key.
   * @param value - The label value.
   */
  public selectByLabel(key: string, value: string) {
    this._labelSelector[key] = value;
  }

  /**
   * The labels this deployment will match against in order to select pods.
   *
   * Returns a a copy. Use `selectByLabel()` to add labels.
   */
  public get labelSelector(): Record<string, string> {
    return { ...this._labelSelector };
  }

}