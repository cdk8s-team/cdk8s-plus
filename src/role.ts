import { ApiObject, Lazy, Names } from 'cdk8s';
import { Construct } from 'constructs';
import { IApiResource, IApiEndpoint } from './api-resource';
import * as base from './base';
import * as k8s from './imports/k8s';
import * as rb from './role-binding';
import { address } from './utils';

/**
 * A reference to any Role or ClusterRole.
 */
export interface IRole extends base.IResource {

}

/**
 * Properties for `Role`.
 */
export interface RoleProps extends base.ResourceProps {

  /**
   * A list of rules the role should allow.
   *
   * @default []
   */
  readonly rules?: RolePolicyRule[];
}

/**
 * Policy rule of a `Role.
 */
export interface RolePolicyRule {

  /**
   * Verbs to allow. (e.g ['get', 'watch'])
   */
  readonly verbs: string[];

  /**
   * Resources this rule applies to.
   */
  readonly resources: IApiResource[];
}

class ImportedRole extends Construct implements IRole {

  private readonly _name: string;

  public readonly resourceType = 'roles';

  constructor(scope: Construct, id: string, name: string) {
    super(scope, id);
    this._name = name;
  }

  public get name(): string {
    return this._name;
  }

  public get apiVersion(): string {
    return k8s.KubeRole.GVK.apiVersion;
  }

  public get apiGroup(): string {
    return 'rbac.authorization.k8s.io';
  }

  public get kind(): string {
    return k8s.KubeRole.GVK.kind;
  }

  public get resourceName(): string {
    return this.name;
  }

}

/**
 * Role is a namespaced, logical grouping of PolicyRules that can be referenced
 * as a unit by a RoleBinding.
 */
export class Role extends base.Resource implements IRole {

  /**
   * Imports a role from the cluster as a reference.
   */
  public static fromRoleName(scope: Construct, id: string, name: string): IRole {
    return new ImportedRole(scope, id, name);
  }

  /**
   * @see base.Resource.apiObject
   */
  protected readonly apiObject: ApiObject;

  public readonly resourceType = 'roles';

  private readonly _rules: Array<RolePolicyRule> = [];

  constructor(scope: Construct, id: string, props: RoleProps = {}) {
    super(scope, id);

    this.apiObject = new k8s.KubeRole(this, 'Resource', {
      metadata: props.metadata,
      rules: Lazy.any({ produce: () => this.synthesizeRules() }),
    });

    for (const rule of props.rules ?? []) {
      this.allow(rule.verbs, ...rule.resources);
    }
  }

  /**
   * Rules associaated with this Role.
   * Returns a copy, use `allow` to add rules.
   */
  public get rules(): RolePolicyRule[] {
    return [...this._rules];
  }

  /**
   * Add permission to perform a list of HTTP verbs on a collection of
   * resources.
   *
   * @param resources The resource(s) to apply to
   * @see https://kubernetes.io/docs/reference/access-authn-authz/authorization/#determine-the-request-verb
   */
  public allow(verbs: string[], ...resources: IApiResource[]): void {
    this._rules.push({ verbs, resources });
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
   * Create a RoleBinding that binds the permissions in this Role
   * to a list of subjects, that will only apply this role's namespace.
   * @param subjects a list of subjects to bind to
   */
  public bind(...subjects: rb.ISubject[]): rb.RoleBinding {
    const subjectsAddress = address(...subjects);
    const binding = new rb.RoleBinding(this, `RoleBinding${subjectsAddress}`, {
      metadata: {
        namespace: this.metadata.namespace,
      },
      role: this,
    });
    binding.addSubjects(...subjects);
    return binding;
  }

  private synthesizeRules(): k8s.PolicyRule[] {
    const rules: k8s.PolicyRule[] = [];
    for (const rule of this._rules) {
      for (const resource of rule.resources) {
        rules.push({
          verbs: rule.verbs,
          apiGroups: [resource.apiGroup === 'core' ? '' : resource.apiGroup],
          resourceNames: resource.resourceName ? [resource.resourceName] : undefined,
          resources: resource.resourceType ? [resource.resourceType] : undefined,
        });
      }
    }
    return rules;
  }
}

/**
 * Represents a cluster-level role.
 */
export interface IClusterRole extends base.IResource {

}

/**
 * Properties for `ClusterRole`.
 */
export interface ClusterRoleProps extends base.ResourceProps {

  /**
    * A list of rules the role should allow.
    *
    * @default []
    */
  readonly rules?: ClusterRolePolicyRule[];

  /**
    * Specify labels that should be used to locate ClusterRoles, whose rules
    * will be automatically filled into this ClusterRole's rules.
    */
  readonly aggregationLabels?: { [key: string]: string };
}

/**
 * Policy rule of a `ClusterRole.
 */
export interface ClusterRolePolicyRule {

  /**
   * Verbs to allow. (e.g ['get', 'watch'])
   */
  readonly verbs: string[];

  /**
   * Endpoints this rule applies to. Can be either api resources
   * or non api resources.
   */
  readonly endpoints: IApiEndpoint[];
}

class ImportedClusterRole extends Construct implements IClusterRole {

  private readonly _name: string;

  public readonly resourceType: string = 'clusterroles';

  constructor(scope: Construct, id: string, name: string) {
    super(scope, id);
    this._name = name;
  }

  public get name(): string {
    return this._name;
  }

  public get apiVersion(): string {
    return k8s.KubeClusterRole.GVK.apiVersion;
  }

  public get apiGroup(): string {
    return 'rbac.authorization.k8s.io';
  }

  public get kind(): string {
    return k8s.KubeClusterRole.GVK.kind;
  }

  public get resourceName(): string {
    return this.name;
  }

}

/**
 * ClusterRole is a cluster level, logical grouping of PolicyRules that can be
 * referenced as a unit by a RoleBinding or ClusterRoleBinding.
 */
export class ClusterRole extends base.Resource implements IClusterRole, IRole {

  /**
   * Imports a role from the cluster as a reference.
   */
  public static fromClusterRoleName(scope: Construct, id: string, name: string): IClusterRole {
    return new ImportedClusterRole(scope, id, name);
  }

  /**
   * @see base.Resource.apiObject
   */
  protected readonly apiObject: ApiObject;

  public readonly resourceType = 'clusterroles';

  private readonly _labelSelector: Record<string, string> = {};
  private readonly _rules: Array<ClusterRolePolicyRule> = [];

  constructor(scope: Construct, id: string, props: ClusterRoleProps = {}) {
    super(scope, id);

    this.apiObject = new k8s.KubeClusterRole(this, 'Resource', {
      metadata: props.metadata,
      rules: Lazy.any({ produce: () => this.synthesizeRules() }),
      aggregationRule: Lazy.any({ produce: () => this.synthesizeAggregationRules() }),
    });

    for (const rule of props.rules ?? []) {
      this.allow(rule.verbs, ...rule.endpoints);
    }

    for (const [key, value] of Object.entries(props.aggregationLabels ?? {})) {
      this.aggregate(key, value);
    }
  }

  /**
   * Rules associaated with this Role.
   * Returns a copy, use `allow` to add rules.
   */
  public get rules(): ClusterRolePolicyRule[] {
    return [...this._rules];
  }

  /**
   * Add permission to perform a list of HTTP verbs on a collection of
   * resources.
   *
   * @param endpoints The endpoints(s) to apply to
   * @see https://kubernetes.io/docs/reference/access-authn-authz/authorization/#determine-the-request-verb
   */
  public allow(verbs: string[], ...endpoints: IApiEndpoint[]): void {
    this._rules.push({ verbs, endpoints });
  }

  /**
   * Add "create" permission for the resources.
   * @param endpoints The resource(s) to apply to
   */
  public allowCreate(...endpoints: IApiEndpoint[]): void {
    this.allow(['create'], ...endpoints);
  }

  /**
   * Add "get" permission for the resources.
   * @param endpoints The resource(s) to apply to
   */
  public allowGet(...endpoints: IApiEndpoint[]): void {
    this.allow(['get'], ...endpoints);
  }

  /**
   * Add "list" permission for the resources.
   * @param endpoints The resource(s) to apply to
   */
  public allowList(...endpoints: IApiEndpoint[]): void {
    this.allow(['list'], ...endpoints);
  }

  /**
   * Add "watch" permission for the resources.
   * @param endpoints The resource(s) to apply to
   */
  public allowWatch(...endpoints: IApiEndpoint[]): void {
    this.allow(['watch'], ...endpoints);
  }

  /**
   * Add "update" permission for the resources.
   * @param endpoints The resource(s) to apply to
   */
  public allowUpdate(...endpoints: IApiEndpoint[]): void {
    this.allow(['update'], ...endpoints);
  }

  /**
   * Add "patch" permission for the resources.
   * @param endpoints The resource(s) to apply to
   */
  public allowPatch(...endpoints: IApiEndpoint[]): void {
    this.allow(['patch'], ...endpoints);
  }

  /**
   * Add "delete" permission for the resources.
   * @param endpoints The resource(s) to apply to
   */
  public allowDelete(...endpoints: IApiEndpoint[]): void {
    this.allow(['delete'], ...endpoints);
  }

  /**
   * Add "deletecollection" permission for the resources.
   * @param endpoints The resource(s) to apply to
   */
  public allowDeleteCollection(...endpoints: IApiEndpoint[]): void {
    this.allow(['deletecollection'], ...endpoints);
  }

  /**
   * Add "get", "list", and "watch" permissions for the resources.
   * @param endpoints The resource(s) to apply to
   */
  public allowRead(...endpoints: IApiEndpoint[]): void {
    this.allow(['get', 'list', 'watch'], ...endpoints);
  }

  /**
   * Add "get", "list", "watch", "create", "update", "patch", "delete", and
   * "deletecollection" permissions for the resources.
   *
   * @param endpoints The resource(s) to apply to
   */
  public allowReadWrite(...endpoints: IApiEndpoint[]): void {
    this.allow(['get', 'list', 'watch', 'create', 'update', 'patch', 'delete', 'deletecollection'], ...endpoints);
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
   * @param rol
   */
  public combine(rol: ClusterRole): void {
    const key = `cdk8s.cluster-role/aggregate-to-${Names.toLabelValue(this)}`;
    const value = 'true';
    rol.metadata.addLabel(key, value);
    this.aggregate(key, value);
  }

  /**
   * Create a RoleBinding that binds the permissions in this ClusterRole
   * to a list of subjects, that will only apply to the given namespace.
   * @param namespace the namespace to limit permissions to.
   * @param subjects a list of subjects to bind to
   */
  public bindInNamespace(namespace: string, ...subjects: rb.ISubject[]): rb.RoleBinding {
    const binding = new rb.RoleBinding(this, `RoleBinding-${namespace}`, {
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
  public bind(...subjects: rb.ISubject[]): rb.ClusterRoleBinding {
    const binding = new rb.ClusterRoleBinding(this, 'ClusterRoleBinding', {
      role: this,
    });
    binding.addSubjects(...subjects);
    return binding;
  }

  private synthesizeRules(): k8s.PolicyRule[] {
    const rules: k8s.PolicyRule[] = [];
    for (const rule of this._rules) {
      for (const endpoint of rule.endpoints) {
        const resource = endpoint.asApiResource();
        const nonResource = endpoint.asNonApiResource();

        if (resource && nonResource) {
          throw new Error('Endpoint must be either resource or non resource. not both.');
        }

        if (!resource && !nonResource) {
          throw new Error('Endpoint must be either resource or non resource. not neither.');
        }

        if (resource) {
          rules.push({
            apiGroups: [resource.apiGroup === 'core' ? '' : resource.apiGroup],
            resources: [resource.resourceType],
            resourceNames: resource.resourceName ? [resource.resourceName] : [],
            verbs: rule.verbs,
          });
        }
        if (nonResource) {
          rules.push({ verbs: rule.verbs, nonResourceUrLs: [nonResource] });
        }
      }

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
