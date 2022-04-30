import { ApiObject, Lazy } from 'cdk8s';
import { Construct } from 'constructs';
import { Resource, ResourceProps } from './base';
import * as k8s from './imports/k8s';
import * as role from './role';
import { filterUndefined } from './utils';

/**
 * Subject contains a reference to the object or user identities a role binding
 * applies to.  This can either hold a direct API object reference, or a value
 * for non-objects such as user and group names.
 */
export interface ISubject {
  /**
   * APIGroup holds the API group of the referenced subject. Defaults to "" for
   * ServiceAccount subjects. Defaults to "rbac.authorization.k8s.io" for User
   * and Group subjects.
   */
  readonly apiGroup?: string;

  /**
   * Kind of object being referenced. Values defined by this API group are
   * "User", "Group", and "ServiceAccount". If the Authorizer does not
   * recognized the kind value, the Authorizer should report an error.
   */
  readonly kind: string;

  /**
   * Name of the object being referenced.
   */
  readonly name: string;

  /**
   * Namespace of the referenced object.  If the object kind is non-namespace,
   * such as "User" or "Group", and this value is not empty the Authorizer
   * should report an error.
   */
  readonly namespace?: string;
}

/**
 * Properties for `RoleBinding`.
 */
export interface RoleBindingProps extends ResourceProps {
  /**
   * The role to bind to. A RoleBinding can reference a Role or a ClusterRole.
   */
  readonly role: role.IRole;
}

/**
 * A RoleBinding grants permissions within a specific namespace to a user or
 * set of users.
 */
export class RoleBinding extends Resource {
  /**
   * @see base.Resource.apiObject
   */
  protected readonly apiObject: ApiObject;

  public readonly resourceType = 'rolebindings';

  public readonly role: role.IRole;

  private readonly _subjects: Array<ISubject>;

  constructor(scope: Construct, id: string, props: RoleBindingProps) {
    super(scope, id);

    this.role = props.role;

    this._subjects = new Array<ISubject>();

    this.apiObject = new k8s.KubeRoleBinding(this, 'Resource', {
      metadata: props.metadata,
      subjects: Lazy.any({ produce: () => this.synthesizeSubjects() }),
      roleRef: Lazy.any({ produce: () => this.synthesizeRoleRef() }),
    });
  }

  /**
   * Adds a subject to the role.
   * @param subjects The subjects to add
   */
  public addSubjects(...subjects: ISubject[]): void {
    for (const subject of subjects) {
      this._subjects.push(subject);
    }
  }

  public get subjects() {
    return [...this._subjects];
  }

  private synthesizeRoleRef(): k8s.RoleRef {
    return {
      apiGroup: this.role.apiGroup,
      kind: this.role.kind,
      name: this.role.name,
    };
  }

  private synthesizeSubjects(): k8s.Subject[] {
    return this._subjects.map((subject) => filterUndefined({
      apiGroup: subject.apiGroup === 'core' ? '' : subject.apiGroup,
      kind: subject.kind,
      name: subject.name,
      namespace: subject.namespace,
    }));
  }
}

/**
 * Properties for `User`.
 */
export interface UserProps {
  /**
   * The name of the user.
   */
  readonly name: string;
}

/**
 * Represents a user.
 */
export class User implements ISubject {
  public readonly apiGroup: string | undefined = 'rbac.authorization.k8s.io';
  public readonly kind: string = 'User';
  public readonly name: string;
  constructor(props: UserProps) {
    this.name = props.name;
  }
}

/**
 * Properties for `Group`.
 */
export interface GroupProps {
  /**
   * The name of the group.
   */
  readonly name: string;
}

/**
 * Represents a group.
 */
export class Group implements ISubject {
  public readonly apiGroup: string | undefined = 'rbac.authorization.k8s.io';
  public readonly kind: string = 'Group';
  public readonly name: string;
  constructor(props: GroupProps) {
    this.name = props.name;
  }
}
