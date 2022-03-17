import * as cdk8s from 'cdk8s';
import { Construct } from 'constructs';

/**
 * Initialization properties for resources.
 */
export interface ResourceProps {
  /**
   * Metadata that all persisted resources must have, which includes all objects
   * users must create.
   */
  readonly metadata?: cdk8s.ApiObjectMetadata;
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
   * The object's API version (e.g. `authorization.k8s.io/v1`)
   */
  readonly apiVersion: string;

  /**
   * The group portion of the API version (e.g. `authorization.k8s.io`)
   */
  readonly apiGroup: string;

  /**
   * The object kind.
   */
  readonly kind: string;
}

/**
 * Base class for all Kubernetes objects in stdk8s. Represents a single
 * resource.
 */
export abstract class Resource extends Construct implements IResource {

  /**
   * The underlying cdk8s API object.
   */
  protected abstract readonly apiObject: cdk8s.ApiObject;

  public get metadata(): cdk8s.ApiObjectMetadataDefinition {
    return this.apiObject.metadata;
  }

  /**
   * The name of this API object.
   */
  public get name(): string {
    return this.apiObject.name;
  }

  /**
   * The group portion of the API version (e.g. `authorization.k8s.io`).
   */
  public get apiVersion(): string {
    return this.apiObject.apiVersion;
  }

  /**
   * The group portion of the API version (e.g. `authorization.k8s.io`).
   */
  public get apiGroup(): string {
    return this.apiObject.apiGroup;
  }

  /**
   * The group portion of the API version (e.g. `authorization.k8s.io`).
   */
  public get kind(): string {
    return this.apiObject.kind;
  }
}