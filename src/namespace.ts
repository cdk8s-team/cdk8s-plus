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
  toNamespaceLabelSelector(): pod.LabelSelector | undefined;

  /**
   * Return the namespace name (if known).
   */
  toNamespaceNames(): string[] | undefined;
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
   * @see base.Resource.apiObject
   */
  protected readonly apiObject: ApiObject;

  public readonly resourceType: string = 'namespaces';

  public constructor(scope: Construct, id: string, props: NamespaceProps = {}) {
    super(scope, id);

    this.apiObject = new k8s.KubeNamespace(this, 'Resource', {
      metadata: props.metadata,
      spec: Lazy.any({ produce: () => this._toKube() }),
    });
  }

  /**
   * @see INamespaceSelector.toNamespaceLabelSelector()
   */
  public toNamespaceLabelSelector(): pod.LabelSelector | undefined {
    return Namespaces.select({ names: [this.name] }).toNamespaceLabelSelector();
  }

  /**
   * @see INamespaceSelector.toNamespaceNames()
   */
  public toNamespaceNames(): string[] | undefined {
    return [this.name];
  }

  /**
   * @internal
   */
  public _toKube(): k8s.NamespaceSpec {
    return {};
  }

}

export interface NamespacesSelectOptions {

  readonly labels?: { [key: string]: string };
  readonly selectors?: pod.LabelQuery[];
  readonly names?: string[];

}

/**
 * Represents a group of namespaces.
 */
export class Namespaces implements INamespaceSelector {

  /**
   * Select specific namespaces.
   */
  public static select(options: NamespacesSelectOptions): Namespaces {

    const selectors = options.selectors ?? [];

    for (const [key, value] of Object.entries(options.labels ?? {})) {
      selectors.push(pod.LabelQuery.is(key, value));
    }

    return new Namespaces(selectors, options.names);
  }

  /**
   * Select all namespaces.
   */
  public static all(): Namespaces {
    return Namespaces.select({});
  }

  constructor(public readonly queries: pod.LabelQuery[], public readonly names?: string[]) { }

  /**
   * @see INamespaceSelector.toNamespaceLabelSelector()
   */
  public toNamespaceLabelSelector(): pod.LabelSelector | undefined {
    return pod.LabelSelector.of(...this.queries);
  }

  /**
   * @see INamespaceSelector.toNamespaceNames()
   */
  public toNamespaceNames(): string[] | undefined {
    return this.names;
  }

}
