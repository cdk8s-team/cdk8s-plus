import { ApiObject, Lazy } from 'cdk8s';
import { Construct } from 'constructs';
import { Workload, WorkloadProps } from './_workload';
import * as k8s from './imports/k8s';
import { Service } from './service';


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
export interface StatefulSetProps extends WorkloadProps {
  /**
   * Service to associate with the statefulset.
   */
  readonly service: Service;

  /**
    * Number of desired pods.
    *
    * @default 1
    */
  readonly replicas?: number;

  /**
    * Pod management policy to use for this statefulset.
    *
    * @default PodManagementPolicy.ORDERED_READY
    */
  readonly podManagementPolicy?: PodManagementPolicy;
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
export class StatefulSet extends Workload {
  /**
    * Number of desired pods.
    */
  public readonly replicas: number;

  /**
    * Management policy to use for the set.
    */
  public readonly podManagementPolicy: PodManagementPolicy;

  /**
    * @see base.Resource.apiObject
    */
  protected readonly apiObject: ApiObject;

  private readonly _service: Service;

  constructor(scope: Construct, id: string, props: StatefulSetProps) {
    super(scope, id, props);

    this.apiObject = new k8s.KubeStatefulSet(this, 'Resource', {
      metadata: props.metadata,
      spec: Lazy.any({ produce: () => this._toKube() }),
    });
    this._service = props.service;

    this.apiObject.addDependency(this._service);

    this.replicas = props.replicas ?? 1;
    this.podManagementPolicy = props.podManagementPolicy ?? PodManagementPolicy.ORDERED_READY;

    const selectors = Object.entries(this.labelSelector);
    for (const [k, v] of selectors) {
      this._service.addSelector(k, v);
    }
  }

  /**
    * @internal
    */
  public _toKube(): k8s.StatefulSetSpec {
    return {
      serviceName: this._service.name,
      replicas: this.replicas,
      template: {
        metadata: this.podMetadata.toJson(),
        spec: this._toPodSpec(),
      },
      selector: {
        matchLabels: this.labelSelector,
      },
      podManagementPolicy: this.podManagementPolicy,
    };
  }
}
