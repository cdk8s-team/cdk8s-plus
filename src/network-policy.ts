import { ApiObject, Lazy } from 'cdk8s';
import { Construct } from 'constructs';
import * as base from './base';
import * as k8s from './imports/k8s';
import * as pod from './pod';

/**
 * Properties for `NetworkPolicy`.
 */
export interface NetworkPolicyProps extends base.ResourceProps {
  /**
   * Which pods does this policy object applies to.
   *
   * This can either be a single pod / workload, or a grouping of pods selected
   * via the `Pod.labeled` function. The array of ingress rules is applied to any
   * pods selected by this field. Multiple network policies can select the same
   * set of pods. In this case, the ingress rules for each are combined additively.
   *
   * To apply the policy on all pods, use `Pod.all()`.
   */
  readonly selector: pod.IPodSelector;
}

/**
 * Control traffic flow at the IP address or port level (OSI layer 3 or 4),
 * network policies are an application-centric construct which allow you to specify how a pod is
 * allowed to communicate with various network peers.
 */
export class NetworkPolicy extends base.Resource {

  /**
   * @see base.Resource.apiObject
   */
  protected apiObject: ApiObject;

  public readonly resourceType: string = 'networkpolicies';

  private readonly _podSelector: pod.IPodSelector;

  public constructor(scope: Construct, id: string, props: NetworkPolicyProps) {
    super(scope, id);

    this.apiObject = new k8s.KubeNetworkPolicy(this, 'Resource', {
      metadata: props.metadata,
      spec: Lazy.any({ produce: () => this._toKube() }),
    });

    this._podSelector = props.selector;
  }

  /**
   * @internal
   */
  public _toKube(): k8s.NetworkPolicySpec {
    const queries = this._podSelector.podLabelSelector.queries;
    return {
      podSelector: queries.length > 0 ? {
        matchExpressions: this._podSelector.podLabelSelector.queries.map(q => ({ key: q.key, operator: q.operator, values: q.values })),
      } : {},
    };
  }

}