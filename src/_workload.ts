import { ApiObjectMetadata, ApiObjectMetadataDefinition } from 'cdk8s';
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

  protected readonly _spec: PodSpec;

  /**
   * The metadata of pods in this deployment.
   */
  public readonly podMetadata: ApiObjectMetadataDefinition;

  constructor(scope: Construct, id: string, props: WorkloadProps = {}) {
    super(scope, id);

    this._spec = new PodSpec(props);
    this.podMetadata = new ApiObjectMetadataDefinition(props.podMetadata);
  }

  public get containers(): Container[] {
    return this._spec.containers;
  }

  public get initContainers(): Container[] {
    return this._spec.initContainers;
  }

  public get volumes(): Volume[] {
    return this._spec.volumes;
  }

  public get restartPolicy(): RestartPolicy | undefined {
    return this._spec.restartPolicy;
  }

  public get serviceAccount(): IServiceAccount | undefined {
    return this._spec.serviceAccount;
  }

  public get securityContext(): PodSecurityContext {
    return this._spec.securityContext;
  }

  public get hostAliases(): HostAlias[] {
    return this._spec.hostAliases;
  }

  public addContainer(container: ContainerProps): Container {
    return this._spec.addContainer(container);
  }

  public addInitContainer(container: ContainerProps): Container {
    return this._spec.addInitContainer(container);
  }

  public addVolume(volume: Volume): void {
    return this._spec.addVolume(volume);
  }

  public addHostAlias(hostAlias: HostAlias): void {
    return this._spec.addHostAlias(hostAlias);
  }

}