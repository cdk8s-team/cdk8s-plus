import { ApiObjectMetadata, ApiObjectMetadataDefinition, Names } from 'cdk8s';
import { Construct } from 'constructs';
import { Resource, ResourceProps } from './base';
import { Container, ContainerProps } from './container';
import * as k8s from './imports/k8s';
import { HostAlias, PodSecurityContext, PodSpecProps, RestartPolicy } from './pod';
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

  public readonly restartPolicy?: RestartPolicy;
  public readonly serviceAccount?: IServiceAccount;
  public readonly securityContext: PodSecurityContext;

  private readonly _containers: Container[] = [];
  private readonly _initContainers: Container[] = [];
  private readonly _hostAliases: HostAlias[] = [];
  private readonly _volumes: Map<string, Volume> = new Map();

  /**
   * The metadata of pods in this workload.
   */
  public readonly podMetadata: ApiObjectMetadataDefinition;

  constructor(scope: Construct, id: string, props: WorkloadProps = {}) {
    super(scope, id);

    this.restartPolicy = props.restartPolicy;
    this.serviceAccount = props.serviceAccount;
    this.securityContext = new PodSecurityContext(props.securityContext);

    if (props.containers) {
      props.containers.forEach(c => this.addContainer(c));
    }

    if (props.volumes) {
      props.volumes.forEach(v => this.addVolume(v));
    }

    if (props.initContainers) {
      props.initContainers.forEach(c => this.addInitContainer(c));
    }

    if (props.hostAliases) {
      props.hostAliases.forEach(c => this.addHostAlias(c));
    }

    this.podMetadata = new ApiObjectMetadataDefinition(props.podMetadata);
  }

  public get containers(): Container[] {
    return [...this._containers];
  }

  public get initContainers(): Container[] {
    return [...this._initContainers];
  }

  public get volumes(): Volume[] {
    return Array.from(this._volumes.values());
  }

  public get hostAliases(): HostAlias[] {
    return [...this._hostAliases];
  }

  public addContainer(container: ContainerProps): Container {
    const impl = new Container(container);
    this._containers.push(impl);
    return impl;
  }

  public addInitContainer(container: ContainerProps): Container {

    // https://kubernetes.io/docs/concepts/workloads/pods/init-containers/#differences-from-regular-containers
    if (container.readiness) {
      throw new Error('Init containers must not have a readiness probe');
    }

    if (container.liveness) {
      throw new Error('Init containers must not have a liveness probe');
    }

    if (container.startup) {
      throw new Error('Init containers must not have a startup probe');
    }

    const impl = new Container({
      ...container,
      name: container.name ?? `init-${this._initContainers.length}`,
    });

    this._initContainers.push(impl);
    return impl;
  }

  public addHostAlias(hostAlias: HostAlias): void {
    this._hostAliases.push(hostAlias);
  }

  public addVolume(volume: Volume): void {
    const existingVolume = this._volumes.get(volume.name);
    if (existingVolume) {
      throw new Error(`Volume with name ${volume.name} already exists`);
    }
    this._volumes.set(volume.name, volume);
  }

  protected get podSpec(): k8s.PodSpec {

    if (this.containers.length === 0) {
      throw new Error('PodSpec must have at least 1 container');
    }

    const volumes: Map<string, Volume> = new Map();
    const containers: k8s.Container[] = [];
    const initContainers: k8s.Container[] = [];

    for (const container of this.containers) {
      // automatically add volume from the container mount
      // to this pod so thats its available to the container.
      for (const mount of container.mounts) {
        addVolume(mount.volume);
      }
      containers.push(container._toKube());
    }

    for (const container of this.initContainers) {
      // automatically add volume from the container mount
      // to this pod so thats its available to the container.
      for (const mount of container.mounts) {
        addVolume(mount.volume);
      }
      initContainers.push(container._toKube());
    }

    for (const volume of this.volumes) {
      addVolume(volume);
    }

    function addVolume(volume: Volume) {
      const existingVolume = volumes.get(volume.name);
      // its ok to call this function twice on the same volume, but its not ok to
      // call it twice on a different volume with the same name.
      if (existingVolume && existingVolume !== volume) {
        throw new Error(`Invalid mount configuration. At least two different volumes have the same name: ${volume.name}`);
      }
      volumes.set(volume.name, volume);
    }

    return {
      restartPolicy: this.restartPolicy,
      serviceAccountName: this.serviceAccount?.name,
      containers: containers,
      securityContext: this.securityContext._toKube(),
      initContainers: initContainers,
      hostAliases: this.hostAliases,
      volumes: Array.from(volumes.values()).map(v => v._toKube()),
    };

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