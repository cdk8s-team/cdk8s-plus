import { ApiObjectMetadata, ApiObject, ApiObjectMetadataDefinition } from 'cdk8s';
import { Construct, IConstruct } from 'constructs';
import { IApiResource, IApiEndpoint } from './api-resource';

/**
 * Initialization properties for resources.
 */
export interface ResourceProps {
  /**
   * Metadata that all persisted resources must have, which includes all objects
   * users must create.
   */
  readonly metadata?: ApiObjectMetadata;
}

/**
 * Represents a resource.
 */
export interface IResource extends IConstruct, IApiResource {
  /**
   * The Kubernetes name of this resource.
   */
  readonly name: string;

  /**
   * The object's API version (e.g. "authorization.k8s.io/v1")
   */
  readonly apiVersion: string;

  /**
   * The object kind (e.g. "Deployment").
   */
  readonly kind: string;
}

/**
 * Base class for all Kubernetes objects in stdk8s. Represents a single
 * resource.
 */
export abstract class Resource extends Construct implements IResource, IApiResource, IApiEndpoint {

  /**
   * The underlying cdk8s API object.
   */
  protected abstract readonly apiObject: ApiObject;

  public readonly abstract resourceType: string;

  public readonly permissions: ResourcePermissions;

  public constructor(scope: Construct, id: string) {
    super(scope, id);
    this.permissions = new ResourcePermissions(this);
  }

  public get metadata(): ApiObjectMetadataDefinition {
    return this.apiObject.metadata;
  }

  /**
   * The name of this API object.
   */
  public get name(): string {
    return this.apiObject.name;
  }

  /**
   * The object's API version (e.g. "authorization.k8s.io/v1")
   */
  public get apiVersion(): string {
    return this.apiObject.apiVersion;
  }

  /**
   * The group portion of the API version (e.g. "authorization.k8s.io").
   */
  public get apiGroup(): string {
    return this.apiObject.apiGroup;
  }

  /**
   * The object kind (e.g. "Deployment").
   */
  public get kind(): string {
    return this.apiObject.kind;
  }

  public get resourceName(): string | undefined {
    return this.name;
  }

  public asApiResource(): IApiResource | undefined {
    return this;
  }

  public asNonApiResource(): string | undefined {
    return undefined;
  }

}

/**
 * Controls permissions for operations on resources.
 */
export class ResourcePermissions {

  constructor(protected readonly instance: Resource) {}

  /**
   * Grants the list of subjects permissions to read this resource.
   */
  public grantRead(...subjects: rb.ISubject[]): rb.RoleBinding {
    const subjectsAddress = address(...subjects);
    const role = new r.Role(this.instance, `Role${subjectsAddress}`, {
      metadata: { namespace: this.instance.metadata.namespace },
    });
    role.allowRead(this.instance);
    return role.bind(...subjects);
  }

  /**
   * Grants the list of subjects permissions to read and write this resource.
   */
  public grantReadWrite(...subjects: rb.ISubject[]): rb.RoleBinding {
    const subjectsAddress = address(...subjects);
    const role = new r.Role(this.instance, `Role${subjectsAddress}`, {
      metadata: { namespace: this.instance.metadata.namespace },
    });
    role.allowReadWrite(this.instance);
    return role.bind(...subjects);
  }

}

// meh, avoiding errors due to circular imports...
import * as r from './role';
import * as rb from './role-binding';
import { address } from './utils';
