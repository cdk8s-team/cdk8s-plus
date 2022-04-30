import { ApiObject, Lazy } from 'cdk8s';
import { Construct } from 'constructs';
import { Resource, ResourceProps } from './base';
import * as clusterrole from './cluster-role';
import * as k8s from './imports/k8s';
import * as rb from './role-binding';
import { filterUndefined } from './utils';

/**
 * Properties for `ClusterRoleBinding`.
 */
export interface ClusterRoleBindingProps extends ResourceProps {
  /**
   * The role to bind to.
   */
  readonly role: clusterrole.IClusterRole;
}

/**
 * A ClusterRoleBinding grants permissions cluster-wide to a user or
 * set of users.
 */
export class ClusterRoleBinding extends Resource {
  /**
   * @see base.Resource.apiObject
   */
  protected readonly apiObject: ApiObject;

  public readonly resourceType = 'clusterrolebindings';

  public readonly role: clusterrole.IClusterRole;

  private readonly _subjects: Array<rb.ISubject>;

  constructor(scope: Construct, id: string, props: ClusterRoleBindingProps) {
    super(scope, id);

    this.role = props.role;

    this._subjects = new Array<rb.ISubject>();

    this.apiObject = new k8s.KubeClusterRoleBinding(this, 'Resource', {
      metadata: props.metadata,
      subjects: Lazy.any({ produce: () => this.synthesizeSubjects() }),
      roleRef: Lazy.any({ produce: () => this.synthesizeRoleRef() }),
    });
  }

  /**
   * Adds a subject to the role.
   * @param subjects The subjects to add
   */
  public addSubjects(...subjects: rb.ISubject[]): void {
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
