import { ApiObject, ApiObjectMetadata, Lazy, Names } from 'cdk8s';
import { Construct } from 'constructs';
import { IApiResource } from './api-resource.generated';
import { IResource, Resource, ResourceProps } from './base';
import * as k8s from './imports/k8s';
import { ClusterRoleBinding, ISubject, RoleBinding } from './role-binding';
import { filterUndefined, undefinedIfEmpty } from './utils';

/**
 * Properties for `RoleBase`.
 */
export interface RoleCommonProps extends ResourceProps {

}

/**
 * An abstract class containing APIs shared between `Role` and `ClusterRole`.
 */
abstract class RoleBase extends Resource implements IResource {
  /**
   * @internal
   */
  protected readonly _rules: Array<PolicyRule>;

  constructor(scope: Construct, id: string, _props: RoleCommonProps = {}) {
    super(scope, id);

    this._rules = [];
  }

  public abstract addRule(rule: PolicyRuleProps): PolicyRule;

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
   * Add permission to perform a list of HTTP verbs on a collection of
   * resources.
   *
   * @param resources The resource(s) to apply to
   * @see https://kubernetes.io/docs/reference/access-authn-authz/authorization/#determine-the-request-verb
   */
  public allow(verbs: string[], ...resources: IApiResource[]): void {
    const apiGroups: string[] = normalizedArray(resources
      .map((resource) => resource.apiGroup)
      .map((apiGroup) => apiGroup === 'core' ? '' : apiGroup),
    );
    const resourceTypes = normalizedArray(resources
      .map((resource) => resource.resourceType)
      .filter((x) => typeof x === 'string'),
    ) as string[];
    const resourceNames = normalizedArray(resources
      .map((resource) => resource.resourceName)
      .filter((x) => typeof x === 'string'),
    ) as string[];

    this.addRule({
      apiGroups,
      resources: resourceTypes,
      resourceNames,
      verbs,
    });
  }

  /**
   * List of rules included in this role.
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
 * Properties for `Role`.
 */
export interface RoleProps extends RoleCommonProps {
  /**
   * A list of explicit rules the role should grant permission to.
   *
   * @default []
   */
  readonly rules?: ResourcePolicyRuleProps[];

  /**
   * The namespace this role is created in. Permissions added to this role must
   * refer to resources in the same namespace.
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

  public readonly resourceType = 'roles';

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

    for (const rule of props.rules ?? []) {
      this.addRule(rule);
    }
  }

  /**
   * Directly add a custom policy rule to the role.
   * @param rule The rule to add
   */
  public addRule(rule: ResourcePolicyRuleProps): ResourcePolicyRule {
    const impl = new ResourcePolicyRule(rule);
    this._rules.push(impl);
    return impl;
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
   * A list of explicit rules the role should grant permission to.
   *
   * @default []
   */
  readonly rules?: PolicyRuleProps[];

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
export class ClusterRole extends RoleBase implements IRole, IClusterRole {
  /**
   * @see base.Resource.apiObject
   */
  protected readonly apiObject: ApiObject;

  public readonly resourceType = 'clusterroles';

  private readonly _labelSelector: Record<string, string>;

  constructor(scope: Construct, id: string, props: ClusterRoleProps = {}) {
    super(scope, id);

    this._labelSelector = props.aggregationLabels ?? {};

    this.apiObject = new k8s.KubeClusterRole(this, 'Resource', {
      metadata: props.metadata,
      rules: Lazy.any({ produce: () => this.synthesizeRules() }),
      aggregationRule: Lazy.any({ produce: () => this.synthesizeAggregationRules() }),
    });

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
 * Options for `PolicyRule`.
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
  readonly nonResourceUrls?: string[];

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
 * Information that describes a policy rule that can be applied to a
 * ClusterRole.
 */
export class PolicyRule {
  constructor(public readonly config: PolicyRuleProps) {
    this.config = config;

    if (config.nonResourceUrls && (config.apiGroups || config.resourceNames || config.resources)) {
      throw new Error(`A rule cannot refer to both API resources and non-resource URLs.`);
    }

    if (!config.nonResourceUrls && !config.apiGroups && !config.resources) {
      throw new Error('A rule must refer to either API resources ("apiGroups" and "resources") or non-resource URLs ("nonResourceUrls").');
    }
  }

  /**
   * @internal
   */
  public _toKube(): k8s.PolicyRule {
    return filterUndefined({
      apiGroups: this.config.apiGroups,
      // named due to bug in how k8s is generated
      // see https://github.com/cdk8s-team/cdk8s-cli/issues/251
      nonResourceUrLs: this.config.nonResourceUrls,
      resourceNames: this.config.resourceNames,
      resources: this.config.resources,
      verbs: this.config.verbs,
    });
  }
}

/**
 * Options for `ResourcePolicyRule`.
 */
export interface ResourcePolicyRuleProps {
  /**
   * APIGroups is the name of the APIGroup that contains the resources.  If
   * multiple API groups are specified, any action requested against one of the
   * enumerated resources in any API group will be allowed.
   */
  readonly apiGroups: string[];

  /**
   * ResourceNames is an optional white list of names that the rule applies to.
   * An empty set means that everything is allowed.
   */
  readonly resourceNames?: string[];

  /**
   * Resources is a list of resources this rule applies to. '*' represents all
   * resources.
   */
  readonly resources: string[];

  /**
   * Verbs is a list of Verbs that apply to ALL the ResourceKinds and
   * AttributeRestrictions contained in this rule. '*' represents all verbs.
   */
  readonly verbs: string[];
}

/**
 * Information that describes a policy rule about an API resource. This rule can
 * be applied to a Role or a ClusterRole.
 */
export class ResourcePolicyRule extends PolicyRule {
  constructor(config: ResourcePolicyRuleProps) {
    super(config);
  }
}

function normalizedArray<T>(xs: T[]): T[] {
  return Array.from(new Set(xs)).sort();
}
