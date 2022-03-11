import { ApiObject, Lazy, Names } from 'cdk8s';
import { Construct } from 'constructs';
import { IResource, Resource, ResourceProps } from './base';
import * as k8s from './imports/k8s';
import { filterUndefined, undefinedIfEmpty } from './utils';

export interface RoleCommonProps extends ResourceProps {
  readonly rules?: PolicyRuleProps[];
}

export abstract class RoleBase extends Resource implements IResource {
  /**
   * @internal
   */
  protected readonly _rules: Array<PolicyRule>;

  constructor(scope: Construct, id: string, props: RoleCommonProps = {}) {
    super(scope, id);

    this._rules = [];

    for (const rule of props.rules ?? []) {
      this.addRule(rule);
    }
  }

  /**
   * Adds a policy rule to the role.
   * @param rule The rule to add
   */
  public addRule(rule: PolicyRuleProps): PolicyRule {
    const impl = new PolicyRule(rule);
    this._rules.push(impl);
    return impl;
  }

  /**
   * List of rules included in this rule.
   *
   * Returns a copy. To add a rule, use `addRule()`.
   */
  public get rules() {
    return [...this._rules];
  }
}

export interface IRole extends IResource {

}

/**
 * Options for `Role`.
 */
export interface RoleProps extends RoleCommonProps {

}

/**
 * Role is a namespaced, logical grouping of PolicyRules that can be referenced
 * as a unit by a RoleBinding.
 */
export class Role extends RoleBase implements IRole {
  /**
   * @see base.Resource.apiObject
   */
  protected readonly apiObject: ApiObject;

  constructor(scope: Construct, id: string, props: RoleProps = {}) {
    super(scope, id);

    this.apiObject = new k8s.KubeRole(this, 'Resource', {
      metadata: props.metadata,
      rules: Lazy.any({ produce: () => this.synthesizeRules() }),
    });
  }

  private synthesizeRules(): any {
    return undefinedIfEmpty(this._rules.map(rule => rule._toKube()));
  }
}

export interface IClusterRole extends IResource {

}

/**
 * Options for `ClusterRole`.
 */
export interface ClusterRoleProps extends RoleCommonProps {
  /**
   * Specify labels that should be used to locate ClusterRoles, whose rules
   * will be automatically filled into this ClusterRole's rules.
   */
  readonly aggregationLabels?: { [key: string]: string };
}

/**
 * ClusterRole is a cluster level, logical grouping of PolicyRules that can be
 * referenced as a unit by a RoleBinding or ClusterRoleBinding.
 */
export class ClusterRole extends RoleBase implements IClusterRole {
  /**
   * @see base.Resource.apiObject
   */
  protected readonly apiObject: ApiObject;

  private readonly _labelSelector: Record<string, string>;

  constructor(scope: Construct, id: string, props: ClusterRoleProps = {}) {
    super(scope, id);

    this._labelSelector = props.aggregationLabels ?? {};

    this.apiObject = new k8s.KubeClusterRole(this, 'Resource', {
      metadata: props.metadata,
      rules: Lazy.any({ produce: () => this.synthesizeRules() }),
      aggregationRule: Lazy.any({ produce: () => this.synthesizeAggregationRules() }),
    });
  }

  /**
   * Add the rules of the argument ClusterRole into this ClusterRole.
   * @param partialRole
   */
  public aggregateFrom(partialRole: ClusterRole): void {
    const name = Names.toLabelValue(this);
    const selector = `cdk8s.cluster-role/aggregate-to-${name}`;
    partialRole.metadata.addLabel(selector, 'true');
    this._labelSelector[selector] = 'true';
  }

  private synthesizeRules(): any {
    return undefinedIfEmpty(this._rules.map(rule => rule._toKube()));
  }

  private synthesizeAggregationRules(): k8s.AggregationRule | undefined {
    if (Object.keys(this._labelSelector).length === 0) {
      return undefined;
    }

    return { clusterRoleSelectors: [{ matchLabels: this._labelSelector }] };
  }
}

/**
 * Options for `Rule`.
 */
export interface PolicyRuleProps {
  /**
   * APIGroups is the name of the APIGroup that contains the resources.  If
   * multiple API groups are specified, any action requested against one of the
   * enumerated resources in any API group will be allowed.
   */
  readonly apiGroups?: string[];

  /**
   * NonResourceURLs is a set of partial urls that a user should have access to.
   * *s are allowed, but only as the full, final step in the path Since
   * non-resource URLs are not namespaced, this field is only applicable for
   * ClusterRoles referenced from a ClusterRoleBinding. Rules can either apply
   * to API resources (such as "pods" or "secrets") or non-resource URL paths
   * (such as "/api"),  but not both.
   */
  readonly nonResourceUrLs?: string[];

  /**
   * ResourceNames is an optional white list of names that the rule applies to.
   * An empty set means that everything is allowed.
   */
  readonly resourceNames?: string[];

  /**
   * Resources is a list of resources this rule applies to. '*' represents all
   * resources.
   */
  readonly resources?: string[];

  /**
   * Verbs is a list of Verbs that apply to ALL the ResourceKinds and
   * AttributeRestrictions contained in this rule. '*' represents all verbs.
   */
  readonly verbs: string[];
}

/**
 * Information that describes a policy rule, but does not contain information
 * about who the rule applies to or which namespace the rule applies to.
 */
export class PolicyRule {
  constructor(public readonly props: PolicyRuleProps) {}

  /**
   * @internal
   */
  public _toKube(): k8s.PolicyRule {
    return filterUndefined(this.props);
  }
}
