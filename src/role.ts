import { ApiObject, Lazy } from 'cdk8s';
import { Construct } from 'constructs';
import { IApiResource } from './api-resource.generated';
import { IResource, Resource, ResourceProps } from './base';
import * as k8s from './imports/k8s';
import { ISubject, RoleBinding } from './role-binding';

/**
 * A reference to any Role or ClusterRole.
 */
export interface IRole extends IResource {}

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

/**
 * Properties for `Role`.
 */
export interface RoleProps extends ResourceProps {

  /**
   * A list of rules the role should allow.
   *
   * @default []
   */
  readonly rules?: RolePolicyRule[];
}

/**
 * Role is a namespaced, logical grouping of PolicyRules that can be referenced
 * as a unit by a RoleBinding.
 */
export class Role extends Resource implements IRole {

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

  private readonly _rules: Array<k8s.PolicyRule> = [];

  constructor(scope: Construct, id: string, props: RoleProps = {}) {
    super(scope, id);

    this.apiObject = new k8s.KubeRole(this, 'Resource', {
      metadata: props.metadata,
      rules: Lazy.any({ produce: () => this._rules }),
    });
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
      this._rules.push({
        apiGroups: [resource.apiGroup === 'core' ? '' : resource.apiGroup],
        resources: [resource.resourceType],
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