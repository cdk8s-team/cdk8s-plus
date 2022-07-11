import { ApiObject, Lazy } from 'cdk8s';
import { Construct } from 'constructs';
import * as base from './base';
import * as k8s from './imports/k8s';
import * as rb from './role-binding';
import * as secret from './secret';
import { undefinedIfEmpty } from './utils';


export interface IServiceAccount extends base.IResource {

}

/**
 * Properties for initialization of `ServiceAccount`.
 */
export interface ServiceAccountProps extends base.ResourceProps {
  /**
   * List of secrets allowed to be used by pods running using this
   * ServiceAccount.
   *
   * @see https://kubernetes.io/docs/concepts/configuration/secret
   */
  readonly secrets?: secret.ISecret[];

  /**
   * Indicates whether pods running as this service account
   * should have an API token automatically mounted. Can be overridden at the pod level.
   *
   * @default true
   * @see https://kubernetes.io/docs/tasks/configure-pod-container/configure-service-account/#use-the-default-service-account-to-access-the-api-server
   */
  readonly automountToken?: boolean;
}

class ImportedServiceAccount extends Construct implements IServiceAccount {

  private readonly _name: string;

  constructor(scope: Construct, id: string, name: string) {
    super(scope, id);
    this._name = name;
  }

  public get name(): string {
    return this._name;
  }

  public get apiVersion(): string {
    return k8s.KubeServiceAccount.GVK.apiVersion;
  }

  public get apiGroup(): string {
    return '';
  }

  public get kind(): string {
    return k8s.KubeServiceAccount.GVK.kind;
  }

}

/**
 * A service account provides an identity for processes that run in a Pod.
 *
 * When you (a human) access the cluster (for example, using kubectl), you are
 * authenticated by the apiserver as a particular User Account (currently this
 * is usually admin, unless your cluster administrator has customized your
 * cluster). Processes in containers inside pods can also contact the apiserver.
 * When they do, they are authenticated as a particular Service Account (for
 * example, default).
 *
 * @see https://kubernetes.io/docs/tasks/configure-pod-container/configure-service-account
 */
export class ServiceAccount extends base.Resource implements IServiceAccount, rb.ISubject {

  /**
   * Imports a service account from the cluster as a reference.
   * @param name The name of the service account resource.
   */
  public static fromServiceAccountName(scope: Construct, id: string, name: string): IServiceAccount {
    return new ImportedServiceAccount(scope, id, name);
  }

  /**
   * @see base.Resource.apiObject
   */
  protected readonly apiObject: ApiObject;

  public readonly resourceType = 'serviceaccounts';

  private readonly _secrets: secret.ISecret[];

  /**
   * Whether or not a token is automatically mounted for this
   * service account.
   */
  public readonly automountToken: boolean;

  constructor(scope: Construct, id: string, props: ServiceAccountProps = { }) {
    super(scope, id);

    this._secrets = props.secrets ?? [];
    this.automountToken = props.automountToken ?? true;

    this.apiObject = new k8s.KubeServiceAccount(this, 'Resource', {
      metadata: props.metadata,
      secrets: Lazy.any({ produce: () => undefinedIfEmpty(this._secrets.map(s => ({ name: s.name }))) }),
      automountServiceAccountToken: this.automountToken,
    });
  }

  /**
   * Allow a secret to be accessed by pods using this service account.
   * @param secr The secret
   */
  public addSecret(secr: secret.ISecret) {
    this._secrets.push(secr);
  }

  /**
   * List of secrets allowed to be used by pods running using this service
   * account.
   *
   * Returns a copy. To add a secret, use `addSecret()`.
   */
  public get secrets() {
    return [...this._secrets];
  }

  /**
   * @see ISubect.toSubjectConfiguration()
   */
  public toSubjectConfiguration(): rb.SubjectConfiguration {
    return {
      kind: this.kind,
      name: this.name,
      apiGroup: this.apiGroup,
      namespace: this.metadata.namespace,
    };
  }

}