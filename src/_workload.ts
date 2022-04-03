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

  protected readonly podSpec: PodSpec;

  /**
   * The metadata of pods in this deployment.
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