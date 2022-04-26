import { ApiObjectMetadata, ApiObject, ApiObjectMetadataDefinition } from 'cdk8s';
import { Construct } from 'constructs';
import { IApiResource } from './api-resource.generated';

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
export interface IResource {
  /**
   * The Kubernetes name of this resource.
   */
  readonly name: string;

  /**
   * The object's API version (e.g. "authorization.k8s.io/v1")
   */
  readonly apiVersion: string;

  /**
   * The group portion of the API version (e.g. "authorization.k8s.io")
   */
  readonly apiGroup: string;

  /**
   * The object kind (e.g. "Deployment").
   */
  readonly kind: string;
}

/**
 * Base class for all Kubernetes objects in stdk8s. Represents a single
 * resource.
 */
export abstract class Resource extends Construct implements IResource, IApiResource {

  /**
   * The underlying cdk8s API object.
   */
  protected abstract readonly apiObject: ApiObject;

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

  public readonly abstract resourceType: string;
}