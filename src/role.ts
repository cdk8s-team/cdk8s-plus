import { ApiObject, Lazy, Names } from 'cdk8s';
import { Construct } from 'constructs';
import { IApiResource } from './api-resource.generated';
import { IResource, Resource, ResourceProps } from './base';
import * as k8s from './imports/k8s';
import { ClusterRoleBinding, ISubject, RoleBinding } from './role-binding';

/**
 * Properties for `RoleBase`.
 */
export interface RoleCommonProps extends ResourceProps {

  /**
   * A list of explicit rules the role should grant permission to.
   *
   * @default []
   */
  readonly rules?: ResourcePolicyRule[];

}

/**
 * Properties for defining a resource based rule.
 */
export interface ResourcePolicyRule {
  /**
   * Names of the api groups that contains the resources. If
   * multiple API groups are specified, any action requested against one of the
   * enumerated resources in any API group will be allowed.
   */
  readonly apiGroups: string[];

  /**
   * List of resources this rule applies to. '*' represents all
   * resources.
   */
  readonly resourceTypes: string[];

  /**
   * Verbs is a list of Verbs that apply to ALL the ResourceKinds and
   * AttributeRestrictions contained in this rule. '*' represents all verbs.
   */
  readonly verbs: string[];

  /**
   * ResourceNames is an optional white list of names that the rule applies to.
   * An empty set means that everything is allowed.
   */
  readonly resourceNames?: string[];

}

/**
 * An abstract class containing APIs shared between `Role` and `ClusterRole`.
 */
abstract class RoleBase extends Resource {
  /**
   * @internal
   */
  protected readonly _resourceRules: Array<ResourcePolicyRule>;

  constructor(scope: Construct, id: string, props: RoleCommonProps = {}) {
    super(scope, id);

    this._resourceRules = [];

    for (const rule of props.rules ?? []) {
      this.addResourceRule(rule);
    }

  }

  /**
   * Add a resource policy rule.
   */
  public addResourceRule(rule: ResourcePolicyRule) {
    this._resourceRules.push(rule);
  }

  /**
   * Add permission to perform a list of HTTP verbs on a collection of
   * resources.
   *
   * @param resources The resource(s) to apply to
   * @see https://kubernetes.io/docs/reference/access-authn-authz/authorization/#determine-the-request-verb
   */
  public allow(verbs: string[], ...resources: IApiResource[]): void {
    for (const resource of resources) {
      this.addResourceRule({
        apiGroups: [resource.apiGroup === 'core' ? '' : resource.apiGroup],
        resourceTypes: [resource.resourceType],
        resourceNames: resource.resourceName ? [resource.resourceName] : [],
        verbs,
      });
    }
  }

  /**
   * Add "create" permission for the resources.
   * @param resources The resource(s) to apply to
   */
  public allowCreate(...resources: IApiResource[]): void {
    this.allow(['create'], ...resources);
  }

  /**
   * Add "get" permission for the resources.
   * @param resources The resource(s) to apply to
   */
  public allowGet(...resources: IApiResource[]): void {
    this.allow(['get'], ...resources);
  }

  /**
   * Add "list" permission for the resources.
   * @param resources The resource(s) to apply to
   */
  public allowList(...resources: IApiResource[]): void {
    this.allow(['list'], ...resources);
  }

  /**
   * Add "watch" permission for the resources.
   * @param resources The resource(s) to apply to
   */
  public allowWatch(...resources: IApiResource[]): void {
    this.allow(['watch'], ...resources);
  }

  /**
   * Add "update" permission for the resources.
   * @param resources The resource(s) to apply to
   */
  public allowUpdate(...resources: IApiResource[]): void {
    this.allow(['update'], ...resources);
  }

  /**
   * Add "patch" permission for the resources.
   * @param resources The resource(s) to apply to
   */
  public allowPatch(...resources: IApiResource[]): void {
    this.allow(['patch'], ...resources);
  }

  /**
   * Add "delete" permission for the resources.
   * @param resources The resource(s) to apply to
   */
  public allowDelete(...resources: IApiResource[]): void {
    this.allow(['delete'], ...resources);
  }

  /**
   * Add "deletecollection" permission for the resources.
   * @param resources The resource(s) to apply to
   */
  public allowDeleteCollection(...resources: IApiResource[]): void {
    this.allow(['deletecollection'], ...resources);
  }

  /**
   * Add "get", "list", and "watch" permissions for the resources.
   * @param resources The resource(s) to apply to
   */
  public allowRead(...resources: IApiResource[]): void {
    this.allow(['get', 'list', 'watch'], ...resources);
  }

  /**
   * Add "get", "list", "watch", "create", "update", "patch", "delete", and
   * "deletecollection" permissions for the resources.
   *
   * @param resources The resource(s) to apply to
   */
  public allowReadWrite(...resources: IApiResource[]): void {
    this.allow(['get', 'list', 'watch', 'create', 'update', 'patch', 'delete', 'deletecollection'], ...resources);
  }

  /**
   * List of rules included in this role.
   *
   * Returns a copy. To add a rule, use `addRule()`.
   */
  public get rules() {
    return [...this._resourceRules];
  }

  /**
   * @internal
   */
  protected _synthesizePolicyRules(): k8s.PolicyRule[] {
    const rules: k8s.PolicyRule[] = [];
    for (const resourceRule of this._resourceRules) {
      rules.push({
        verbs: resourceRule.verbs,
        apiGroups: resourceRule.apiGroups,
        resourceNames: resourceRule.resourceNames,
        resources: resourceRule.resourceTypes,
      });
    }
    return rules;
  }

}

/**
 * A reference to any Role or ClusterRole.
 */
export interface IRole extends IResource {

}

/**
 * Properties for `Role`.
 */
export interface RoleProps extends RoleCommonProps {}

/**
 * Role is a namespaced, logical grouping of PolicyRules that can be referenced
 * as a unit by a RoleBinding.
 */
export class Role extends RoleBase implements IRole {

  /**
   * Imports a role from the cluster as a reference.
   * @param name The name of the role resource.
   */
  public static fromRoleName(name: string): IRole {
    return {
      apiGroup: 'rbac.authorization.k8s.io',
      name,
      ...k8s.KubeRole.GVK,
    };
  }

  /**
   * @see base.Resource.apiObject
   */
  protected readonly apiObject: ApiObject;

  public readonly resourceType = 'roles';

  constructor(scope: Construct, id: string, props: RoleProps = {}) {
    super(scope, id);

    this.apiObject = new k8s.KubeRole(this, 'Resource', {
      metadata: props.metadata,
      rules: Lazy.any({ produce: () => this._synthesizePolicyRules() }),
    });
  }

  /**
   * Create a RoleBinding that binds the permissions in this Role
   * to a list of subjects, that will only apply this role's namespace.
   * @param subjects a list of subjects to bind to
   */
  public bind(...subjects: ISubject[]): RoleBinding {
    const binding = new RoleBinding(this, 'RoleBinding', {
      metadata: {
        namespace: this.metadata.namespace,
      },
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
   * A list of explicit rules the role should grant permission to.
   *
   * @default []
   */
  readonly nonResourceRules?: NonResourcePolicyRule[];

  /**
   * Specify labels that should be used to locate ClusterRoles, whose rules
   * will be automatically filled into this ClusterRole's rules.
   */
  readonly aggregationLabels?: { [key: string]: string };
}

/**
 * Properties for defining a non resource based rule.
 */
export interface NonResourcePolicyRule {
  /**
   * NonResourceURLs is a set of partial urls that a user should have access to.
   * *s are allowed, but only as the full, final step in the path. Since
   * non-resource URLs are not namespaced, this field is only applicable for
   * ClusterRoles referenced from a ClusterRoleBinding. Rules can either apply
   * to API resources (such as "pods" or "secrets") or non-resource URL paths
   * (such as "/api"),  but not both.
   */
  readonly nonResourceUrls: string[];

  /**
   * Verbs is a list of Verbs that apply to ALL the ResourceKinds and
   * AttributeRestrictions contained in this rule. '*' represents all verbs.
   */
  readonly verbs: string[];
}

/**
 * ClusterRole is a cluster level, logical grouping of PolicyRules that can be
 * referenced as a unit by a RoleBinding or ClusterRoleBinding.
 */
export class ClusterRole extends RoleBase {

  /**
   * Imports a role from the cluster as a reference.
   * @param name The name of the role resource.
   */
  public static fromClusterRoleName(name: string): IClusterRole {
    return {
      apiGroup: 'rbac.authorization.k8s.io',
      name,
      ...k8s.KubeClusterRole.GVK,
    };
  }

  /**
   * @see base.Resource.apiObject
   */
  protected readonly apiObject: ApiObject;

  public readonly resourceType = 'clusterroles';

  private readonly _labelSelector: Record<string, string>;
  private readonly _nonResourceRules: NonResourcePolicyRule[] = [];

  constructor(scope: Construct, id: string, props: ClusterRoleProps = {}) {
    super(scope, id);

    this._labelSelector = props.aggregationLabels ?? {};

    this.apiObject = new k8s.KubeClusterRole(this, 'Resource', {
      metadata: props.metadata,
      rules: Lazy.any({ produce: () => this._synthesizePolicyRules() }),
      aggregationRule: Lazy.any({ produce: () => this.synthesizeAggregationRules() }),
    });

    for (const rule of props.nonResourceRules ?? []) {
      this.addNonResourceRule(rule);
    }
  }

  /**
   * Add a non resource policy rule.
   */
  public addNonResourceRule(rule: NonResourcePolicyRule) {
    this._nonResourceRules.push(rule);
  }

  /**
   * Aggregate rules from roles matching this label selector.
   */
  public aggregate(key: string, value: string): void {
    this._labelSelector[key] = value;
  }

  /**
   * Combines the rules of the argument ClusterRole into this ClusterRole
   * using aggregation labels.
   * @param role
   */
  public combine(role: ClusterRole): void {
    const key = `cdk8s.cluster-role/aggregate-to-${Names.toLabelValue(this)}`;
    const value = 'true';
    role.metadata.addLabel(key, value);
    this.aggregate(key, value);
  }

  /**
   * Create a RoleBinding that binds the permissions in this ClusterRole
   * to a list of subjects, that will only apply to the given namespace.
   * @param namespace the namespace to limit permissions to.
   * @param subjects a list of subjects to bind to
   */
  public bindInNamespace(namespace: string, ...subjects: ISubject[]): RoleBinding {
    const binding = new RoleBinding(this, `RoleBinding-${namespace}`, {
      metadata: {
        namespace,
      },
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
  public bind(...subjects: ISubject[]): ClusterRoleBinding {
    const binding = new ClusterRoleBinding(this, 'ClusterRoleBinding', {
      role: this,
    });
    binding.addSubjects(...subjects);
    return binding;
  }

  /**
   * @internal
   */
  protected _synthesizePolicyRules(): k8s.PolicyRule[] {
    const rules: k8s.PolicyRule[] = super._synthesizePolicyRules();
    for (const nonResourceRule of this._nonResourceRules) {
      rules.push({
        verbs: nonResourceRule.verbs,
        nonResourceUrLs: nonResourceRule.nonResourceUrls,
      });
    }
    return rules;
  }

  private synthesizeAggregationRules(): k8s.AggregationRule | undefined {
    if (Object.keys(this._labelSelector).length === 0) {
      return undefined;
    }

    return { clusterRoleSelectors: [{ matchLabels: this._labelSelector }] };
  }
}