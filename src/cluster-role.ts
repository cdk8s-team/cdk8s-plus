import { ApiObject, Lazy, Names } from 'cdk8s';
import { Construct } from 'constructs';
import { IApiEndpoint } from './api-resource.generated';
import * as base from './base';
import * as clusterrb from './cluster-role-binding';
import * as k8s from './imports/k8s';
import * as role from './role';
import * as rb from './role-binding';

/**
 * Represents a cluster-level role.
 */
export interface IClusterRole extends base.IResource {}

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
 * ClusterRole is a cluster level, logical grouping of PolicyRules that can be
 * referenced as a unit by a RoleBinding or ClusterRoleBinding.
 */
export class ClusterRole extends base.Resource implements IClusterRole, role.IRole {

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

  private readonly _labelSelector: Record<string, string> = {};
  private readonly _rules: Array<k8s.PolicyRule> = [];

  constructor(scope: Construct, id: string, props: ClusterRoleProps = {}) {
    super(scope, id);

    this.apiObject = new k8s.KubeClusterRole(this, 'Resource', {
      metadata: props.metadata,
      rules: Lazy.any({ produce: () => this._rules }),
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
   * Add permission to perform a list of HTTP verbs on a collection of
   * resources.
   *
   * @param endpoints The endpoints(s) to apply to
   * @see https://kubernetes.io/docs/reference/access-authn-authz/authorization/#determine-the-request-verb
   */
  public allow(verbs: string[], ...endpoints: IApiEndpoint[]): void {
    for (const endpoint of endpoints) {

      const resource = endpoint.asApiResource();
      const nonResource = endpoint.asNonApiResource();

      if (resource && nonResource) {
        throw new Error('Endpoint must be either resource or non resource. not both.');
      }

      if (!resource && !nonResource) {
        throw new Error('Endpoint must be either resource or non resource. not neither.');
      }

      if (resource) {
        this._rules.push({
          apiGroups: [resource.apiGroup === 'core' ? '' : resource.apiGroup],
          resources: [resource.resourceType],
          resourceNames: resource.resourceName ? [resource.resourceName] : [],
          verbs,
        });
      }
      if (nonResource) {
        this._rules.push({ verbs, nonResourceUrLs: [nonResource] });
      }
    }
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
  public bind(...subjects: rb.ISubject[]): clusterrb.ClusterRoleBinding {
    const binding = new clusterrb.ClusterRoleBinding(this, 'ClusterRoleBinding', {
      role: this,
    });
    binding.addSubjects(...subjects);
    return binding;
  }

  private synthesizeAggregationRules(): k8s.AggregationRule | undefined {
    if (Object.keys(this._labelSelector).length === 0) {
      return undefined;
    }

    return { clusterRoleSelectors: [{ matchLabels: this._labelSelector }] };
  }
}