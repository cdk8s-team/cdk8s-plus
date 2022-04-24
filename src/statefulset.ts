import { ApiObject, Lazy, Names, ApiObjectMetadataDefinition } from 'cdk8s';
import { Construct } from 'constructs';
import * as base from './base';
import * as container from './container';
import * as k8s from './imports/k8s';
import * as pod from './pod';
import * as service from './service';
import * as serviceaccount from './service-account';
import * as volume from './volume';


/**
 * Controls how pods are created during initial scale up, when replacing pods on nodes,
 * or when scaling down.
 *
 * The default policy is `OrderedReady`, where pods are created in increasing order
 * (pod-0, then pod-1, etc) and the controller will wait until each pod is ready before
 * continuing. When scaling down, the pods are removed in the opposite order.
 *
 * The alternative policy is `Parallel` which will create pods in parallel to match the
 * desired scale without waiting, and on scale down will delete all pods at once.
 */
export enum PodManagementPolicy {
  ORDERED_READY = 'OrderedReady',
  PARALLEL = 'Parallel',
}

/**
 * Properties for initialization of `StatefulSet`.
 */
export interface StatefulSetProps extends base.ResourceProps, pod.PodTemplateProps {
  /**
   * Service to associate with the statefulset.
   */
  readonly service: service.Service;

  /**
    * Number of desired pods.
    *
    * @default 1
    */
  readonly replicas?: number;

  /**
    * Automatically allocates a pod selector for this statefulset.
    *
    * If this is set to `false` you must define your selector through
    * `statefulset.podMetadata.addLabel()` and `statefulset.selectByLabel()`.
    *
    * @default true
    */
  readonly defaultSelector?: boolean;

  /**
    * Pod management policy to use for this statefulset.
    *
    * @default PodManagementPolicy.ORDERED_READY
    */
  readonly podManagementPolicy?: PodManagementPolicy;

  /**
   * Indicates the StatefulSetUpdateStrategy that will be employed to update Pods in the StatefulSet when a revision is made to Template.
   *
   * @default - RollingUpdate with partition set to 0
   */
  readonly strategy?: StatefulSetUpdateStrategy;
}

/**
 * StatefulSet is the workload API object used to manage stateful applications.
 *
 * Manages the deployment and scaling of a set of Pods, and provides guarantees
 * about the ordering and uniqueness of these Pods.
 *
 * Like a Deployment, a StatefulSet manages Pods that are based on an identical
 * container spec. Unlike a Deployment, a StatefulSet maintains a sticky identity
 * for each of their Pods. These pods are created from the same spec, but are not
 * interchangeable: each has a persistent identifier that it maintains across any
 * rescheduling.
 *
 * If you want to use storage volumes to provide persistence for your workload, you
 * can use a StatefulSet as part of the solution. Although individual Pods in a StatefulSet
 * are susceptible to failure, the persistent Pod identifiers make it easier to match existing
 * volumes to the new Pods that replace any that have failed.
 *
 * Using StatefulSets
 * ------------------
 * StatefulSets are valuable for applications that require one or more of the following.
 *
 * - Stable, unique network identifiers.
 * - Stable, persistent storage.
 * - Ordered, graceful deployment and scaling.
 * - Ordered, automated rolling updates.
 */
export class StatefulSet extends base.Resource implements pod.IPodTemplate {
  /**
    * Number of desired pods.
    */
  public readonly replicas: number;

  /**
    * Management policy to use for the set.
    */
  public readonly podManagementPolicy: PodManagementPolicy;

  /**
   * The update startegy of this stateful set.
   */
  public readonly strategy: StatefulSetUpdateStrategy;

  /**
    * @see base.Resource.apiObject
    */
  protected readonly apiObject: ApiObject;

  private readonly _podTemplate: pod.PodTemplate;
  private readonly _labelSelector: Record<string, string>;

  private readonly _service: service.Service;

  constructor(scope: Construct, id: string, props: StatefulSetProps) {
    super(scope, id);

    this.apiObject = new k8s.KubeStatefulSet(this, 'Resource', {
      metadata: props.metadata,
      spec: Lazy.any({ produce: () => this._toKube() }),
    });
    this._service = props.service;

    this.apiObject.addDependency(this._service);

    this.replicas = props.replicas ?? 1;
    this.strategy = props.strategy ?? StatefulSetUpdateStrategy.rollingUpdate(),
    this.podManagementPolicy = props.podManagementPolicy ?? PodManagementPolicy.ORDERED_READY;
    this._podTemplate = new pod.PodTemplate(props);
    this._labelSelector = {};

    if (props.defaultSelector ?? true) {
      const selector = 'cdk8s.statefulset';
      const matcher = Names.toLabelValue(this);
      this.podMetadata.addLabel(selector, matcher);
      this.selectByLabel(selector, matcher);
    }

    const selectors = Object.entries(this.labelSelector);
    for (const [k, v] of selectors) {
      this._service.addSelector(k, v);
    }
  }

  public get podMetadata(): ApiObjectMetadataDefinition {
    return this._podTemplate.podMetadata;
  }

  /**
    * The labels this statefulset will match against in order to select pods.
    *
    * Returns a a copy. Use `selectByLabel()` to add labels.
    */
  public get labelSelector(): Record<string, string> {
    return { ...this._labelSelector };
  }

  public get containers(): container.Container[] {
    return this._podTemplate.containers;
  }

  public get initContainers(): container.Container[] {
    return this._podTemplate.initContainers;
  }

  public get hostAliases(): pod.HostAlias[] {
    return this._podTemplate.hostAliases;
  }

  public get volumes(): volume.Volume[] {
    return this._podTemplate.volumes;
  }

  public get restartPolicy(): pod.RestartPolicy | undefined {
    return this._podTemplate.restartPolicy;
  }

  public get serviceAccount(): serviceaccount.IServiceAccount | undefined {
    return this._podTemplate.serviceAccount;
  }

  /**
    * Configure a label selector to this deployment.
    * Pods that have the label will be selected by deployments configured with this spec.
    *
    * @param key - The label key.
    * @param value - The label value.
    */
  public selectByLabel(key: string, value: string): void {
    this._labelSelector[key] = value;
  }

  public addContainer(cont: container.ContainerProps): container.Container {
    return this._podTemplate.addContainer(cont);
  }

  public addInitContainer(cont: container.ContainerProps): container.Container {
    return this._podTemplate.addInitContainer(cont);
  }

  public addHostAlias(hostAlias: pod.HostAlias): void {
    return this._podTemplate.addHostAlias(hostAlias);
  }

  public addVolume(vol: volume.Volume): void {
    return this._podTemplate.addVolume(vol);
  }

  public get securityContext(): pod.PodSecurityContext {
    return this._podTemplate.securityContext;
  }

  /**
    * @internal
    */
  public _toKube(): k8s.StatefulSetSpec {
    return {
      serviceName: this._service.name,
      replicas: this.replicas,
      template: this._podTemplate._toPodTemplateSpec(),
      selector: {
        matchLabels: this._labelSelector,
      },
      podManagementPolicy: this.podManagementPolicy,
      updateStrategy: this.strategy._toKube(),
    };
  }
}

/**
 * Options for `StatefulSetUpdateStrategy.rollingUpdate`.
 */
export interface StatefulSetUpdateStrategyRollingUpdateOptions {

  /**
   * If specified, all Pods with an ordinal that is greater than or equal to the partition will
   * be updated when the StatefulSet's .spec.template is updated. All Pods with an ordinal that
   * is less than the partition will not be updated, and, even if they are deleted, they will be
   * recreated at the previous version.
   *
   * If the partition is greater than replicas, updates to the pod template will not be propagated to Pods.
   * In most cases you will not need to use a partition, but they are useful if you want to stage an
   * update, roll out a canary, or perform a phased roll out.
   *
   * @see https://kubernetes.io/docs/concepts/workloads/controllers/statefulset/#partitions
   * @default 0
   */
  readonly partition?: number;

}

/**
 * StatefulSet update strategies.
 */
export class StatefulSetUpdateStrategy {

  /**
   * The controller will not automatically update the Pods in a StatefulSet.
   * Users must manually delete Pods to cause the controller to create new Pods
   * that reflect modifications.
   */
  public static onDelete(): StatefulSetUpdateStrategy {
    return new StatefulSetUpdateStrategy({
      type: 'OnDelete',
    });
  }

  /**
   * The controller will delete and recreate each Pod in the StatefulSet.
   * It will proceed in the same order as Pod termination (from the largest ordinal to the smallest),
   * updating each Pod one at a time. The Kubernetes control plane waits until an updated
   * Pod is Running and Ready prior to updating its predecessor.
   */
  public static rollingUpdate(options: StatefulSetUpdateStrategyRollingUpdateOptions = {}): StatefulSetUpdateStrategy {

    return new StatefulSetUpdateStrategy({
      type: 'RollingUpdate',
      rollingUpdate: { partition: options.partition ?? 0 },
    });
  }

  private constructor(private readonly strategy: k8s.StatefulSetUpdateStrategy) {}

  /**
   * @internal
   */
  public _toKube(): k8s.StatefulSetUpdateStrategy {
    return this.strategy;
  }

}