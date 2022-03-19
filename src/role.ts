import { ApiObject, ApiObjectMetadata, Lazy, Names } from 'cdk8s';
import { Construct } from 'constructs';
import { IResource, Resource, ResourceProps } from './base';
import { IGrantee } from './grants';
import * as k8s from './imports/k8s';
import { ClusterRoleBinding, ISubject, RoleBinding } from './role-binding';
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
   * Directly add a custom policy rule to the role.
   * @param rule The rule to add
   */
  public addRule(rule: PolicyRuleProps): PolicyRule {
    const impl = new PolicyRule(rule);
    this._rules.push(impl);
    return impl;
  }

  /**
   * Grant "create" permission for the grantee.
   * @param grantees The resource(s) to apply to
   */
  public grantCreate(...grantees: IGrantee[]): void {
    this.grant(['create'], grantees);
  }

  /**
   * Grant "get" permission for the grantee.
   * @param grantees The resource(s) to apply to
   */
  public grantGet(...grantees: IGrantee[]): void {
    this.grant(['get'], grantees);
  }

  /**
   * Grant "list" permission for the grantee.
   * @param grantees The resource(s) to apply to
   */
  public grantList(...grantees: IGrantee[]): void {
    this.grant(['list'], grantees);
  }

  /**
   * Grant "watch" permission for the grantee.
   * @param grantees The resource(s) to apply to
   */
  public grantWatch(...grantees: IGrantee[]): void {
    this.grant(['watch'], grantees);
  }

  /**
   * Grant "update" permission for the grantee.
   * @param grantees The resource(s) to apply to
   */
  public grantUpdate(...grantees: IGrantee[]): void {
    this.grant(['update'], grantees);
  }

  /**
   * Grant "patch" permission for the grantee.
   * @param grantees The resource(s) to apply to
   */
  public grantPatch(...grantees: IGrantee[]): void {
    this.grant(['patch'], grantees);
  }

  /**
   * Grant "delete" permission for the grantee.
   * @param grantees The resource(s) to apply to
   */
  public grantDelete(...grantees: IGrantee[]): void {
    this.grant(['delete'], grantees);
  }

  /**
   * Grant "deletecollection" permission for the grantee.
   * @param grantees The resource(s) to apply to
   */
  public grantDeleteCollection(...grantees: IGrantee[]): void {
    this.grant(['deletecollection'], grantees);
  }

  /**
   * Grant "get", "list", and "watch" permissions for the grantee.
   * @param grantees The resource(s) to apply to
   */
  public grantRead(...grantees: IGrantee[]): void {
    this.grant(['get', 'list', 'watch'], grantees);
  }

  /**
   * Grant "get", "list", "watch", "create", "update", "patch", "delete", and
   * "deletecollection" permissions for the grantee.
   *
   * @param grantees The resource(s) to apply to
   */
  public grantReadWrite(...grantees: IGrantee[]): void {
    this.grant(['get', 'list', 'watch', 'create', 'update', 'patch', 'delete', 'deletecollection'], grantees);
  }

  /**
   * Grant permission to perform a list of HTTP verbs on the grantee.
   *
   * @param grantees The resource(s) to apply to
   * @see https://kubernetes.io/docs/reference/access-authn-authz/authorization/#determine-the-request-verb
   */
  public grant(verbs: string[], grantees: IGrantee[]): void {
    for (const grantee of grantees) {
      this.addRule({
        apiGroups: grantee.apiGroups,
        resources: grantee.resources,
        resourceNames: grantee.resourceNames,
        verbs,
      });
    }
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

/**
 * A reference to any Role or ClusterRole.
 */
export interface IRole extends IResource {

}

/**
 * Options for `Role`.
 */
export interface RoleProps extends RoleCommonProps {
  /**
   * The namespace of the resources this role's permissions should apply to
   * (required).
   */
  readonly namespace: string;
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

  constructor(scope: Construct, id: string, props: RoleProps) {
    super(scope, id);

    if (props.metadata?.namespace && props.metadata.namespace !== props.namespace) {
      throw new Error('If `metadata.namespace` is passed as an option, its value must match the value of `namespace`.');
    }

    const metadata: ApiObjectMetadata = {
      ...props.metadata,
      namespace: props.namespace,
    };

    this.apiObject = new k8s.KubeRole(this, 'Resource', {
      metadata,
      rules: Lazy.any({ produce: () => this.synthesizeRules() }),
    });
  }

  private synthesizeRules(): any {
    return undefinedIfEmpty(this._rules.map(rule => rule._toKube()));
  }

  /**
   * Create a RoleBinding that binds the permissions in this Role
   * to a list of subjects, that will only apply this role's namespace.
   * @param subjects a list of subjects to bind to
   */
  public bind(...subjects: ISubject[]): RoleBinding {
    const binding = new RoleBinding(this, 'RoleBinding', {
      namespace: this.metadata.namespace!,
      role: this,
    });
    binding.addSubjects(...subjects);
    return binding;
  }
}

/**
 * Represents a cluster-level role.
 */
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
   * @param role
   */
  public aggregateFrom(role: ClusterRole): void {
    const name = Names.toLabelValue(this);
    const selector = `cdk8s.cluster-role/aggregate-to-${name}`;
    role.metadata.addLabel(selector, 'true');
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

  /**
   * Create a RoleBinding that binds the permissions in this ClusterRole
   * to a list of subjects, that will only apply to the given namespace.
   * @param namespace the namespace to limit permissions to.
   * @param subjects a list of subjects to bind to
   */
  public bindInNamespace(namespace: string, ...subjects: ISubject[]): RoleBinding {
    const binding = new RoleBinding(this, 'RoleBinding', {
      namespace,
      role: this,
    });
    binding.addSubjects(...subjects);
    return binding;
  }

  /**
   * Create a ClusterRoleBinding that binds the permissions in this
   * ClusterRole to a list of subjects, without namespace restrictions.
   * @param subjects a list of subjects to bind to
   */
  public bindInCluster(...subjects: ISubject[]): ClusterRoleBinding {
    const binding = new ClusterRoleBinding(this, 'ClusterRoleBinding', {
      role: this,
    });
    binding.addSubjects(...subjects);
    return binding;
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
   * *s are allowed, but only as the full, final step in the path. Since
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
