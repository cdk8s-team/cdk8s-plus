import { ApiObject, Lazy } from 'cdk8s';
import { Construct } from 'constructs';
import * as base from './base';
import * as k8s from './imports/k8s';
import * as pod from './pod';

export interface NetworkPolicyProps extends base.ResourceProps {

  /**
   * Which pods does this policy object applies to.
   *
   * This can either be a single pod / workload, or a grouping of pods selected
   * via the `Pod.select` function. The array of ingress rules is applied to any
   * pods selected by this field. Multiple network policies can select the same
   * set of pods. In this case, the ingress rules for each are combined additively.
   *
   * @default - applies to all pods in this namespace
   */
  readonly select?: pod.IPod;
}

export class NetworkPolicy extends base.Resource {

  /**
   * @see base.Resource.apiObject
   */
  protected apiObject: ApiObject;

  private readonly _podLabelQueries?: pod.PodLabelQuery[];

  public constructor(scope: Construct, id: string, props: NetworkPolicyProps = {}) {
    super(scope, id);

    this.apiObject = new k8s.KubeNetworkPolicy(this, 'Resource', {
      metadata: props.metadata,
      spec: Lazy.any({ produce: () => this._toKube() }),
    });

    this._podLabelQueries = props.select?.labelSelector?.queries;
  }

  /**
   * @internal
   */
  public _toKube(): k8s.NetworkPolicySpec {
    return {
      podSelector: this._podLabelQueries ? {
        matchExpressions: this._podLabelQueries.map(q => ({ key: q.key, operator: q.operator, values: q.values })),
      } : {},
    };
  }

}