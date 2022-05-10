import { ApiObject, Lazy } from 'cdk8s';
import { Construct } from 'constructs';
import * as base from './base';
import * as k8s from './imports/k8s';
import * as pod from './pod';

/**
 * Represents an object that can select namespaces.
 */
export interface INamespaceSelector {
  /**
   * Return the label selector that selects the namespaces.
   */
  asNamespaceLabelSelector(): pod.LabelSelector | undefined;
}

/**
 * Properties for `Namespace`.
 */
export interface NamespaceProps extends base.ResourceProps {}

/**
 * In Kubernetes, namespaces provides a mechanism for isolating groups of resources within a single cluster.
 * Names of resources need to be unique within a namespace, but not across namespaces.
 * Namespace-based scoping is applicable only for namespaced objects (e.g. Deployments, Services, etc) and
 * not for cluster-wide objects (e.g. StorageClass, Nodes, PersistentVolumes, etc).
 */
export class Namespace extends base.Resource implements INamespaceSelector {

  /**
   * @see https://kubernetes.io/docs/concepts/overview/working-with-objects/namespaces/#automatic-labelling
   */
  public static readonly NAME_LABEL = 'kubernetes.io/metadata.name';

  /**
   * Match a namespace by its labels.
   */
  public static labeled(...queries: pod.LabelQuery[]): LabeledNamespace {
    return new LabeledNamespace(queries);
  }

  /**
   * Match a namespace by its name.
   */
  public static named(name: string): NamedNamespace {
    return new NamedNamespace(name);
  }

  /**
   * Match all namespaces.
   */
  public static all(): LabeledNamespace {
    return Namespace.labeled();
  }

  /**
   * @see base.Resource.apiObject
   */
  protected readonly apiObject: ApiObject;

  public readonly resourceType: string = 'namespaces';

  public constructor(scope: Construct, id: string, props: NamespaceProps) {
    super(scope, id);

    this.apiObject = new k8s.KubeNamespace(this, 'Resource', {
      metadata: props.metadata,
      spec: Lazy.any({ produce: () => this._toKube() }),
    });
  }

  /**
   * @see INamespaceSelector.asNamespaceLabelSelector
   */
  public asNamespaceLabelSelector(): pod.LabelSelector | undefined {
    return Namespace.named(this.name ?? 'default').asNamespaceLabelSelector();
  }

  /**
   * @internal
   */
  public _toKube(): k8s.NamespaceSpec {
    return {};
  }

}

/**
 * Namespace(s) identified by labels.
 */
export class LabeledNamespace implements INamespaceSelector {

  public constructor(private readonly queries: pod.LabelQuery[]) {};

  public asNamespaceLabelSelector(): pod.LabelSelector | undefined {
    return pod.LabelSelector.of(...this.queries);
  }
}

/**
 * Namespace identified by a name.
 */
export class NamedNamespace implements INamespaceSelector {

  public constructor(private readonly name: string) {};

  public asNamespaceLabelSelector(): pod.LabelSelector | undefined {
    return Namespace.labeled(pod.LabelQuery.is(Namespace.NAME_LABEL, this.name)).asNamespaceLabelSelector();
  }

}