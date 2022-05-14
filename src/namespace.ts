import { ApiObject, Lazy } from 'cdk8s';
import { Construct } from 'constructs';
import * as base from './base';
import * as k8s from './imports/k8s';
import * as networkpolicy from './network-policy';
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
  toNamespaceName(): string | undefined;
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
export class Namespace extends base.Resource implements INamespaceSelector, networkpolicy.IPeer {

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
    return Namespace.named(this.name).toNamespaceLabelSelector();
  }

  /**
   * @see INamespaceSelector.toNamespaceName()
   */
  public toNamespaceName(): string | undefined {
    return this.name;
  }

  /**
   * @see IPeer.toIpBlock()
   */
  public toIpBlock(): networkpolicy.IpBlock | undefined {
    return undefined;
  }

  /**
   * @see IPeer.toNamespacedPodSelector()
   */
  public toNamespacedPodSelector(): pod.INamespacedPodSelector | undefined {
    return pod.Pod.all().namespaced(this);
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
export class LabeledNamespace implements INamespaceSelector, networkpolicy.IPeer {

  public constructor(private readonly queries: pod.LabelQuery[]) {};

  /**
   * @see INamespaceSelector.toNamespaceLabelSelector()
   */
  public toNamespaceLabelSelector(): pod.LabelSelector | undefined {
    return pod.LabelSelector.of(...this.queries);
  }

  /**
   * @see INamespaceSelector.toNamespaceName()
   */
  public toNamespaceName(): string | undefined {

    // a named namespace also uses label queries by specifying a magic label.
    // this means that if the appropriate query exists, we can use it to detect the namespace name.

    const namespaceNameQuery = this.queries.filter(q => q.key === Namespace.NAME_LABEL && q.operator === 'In');

    if (namespaceNameQuery.length === 0) {
      // the magic query doesn't exist, we cant know
      // the namesapce name.
      return undefined;
    }

    // make sure only one such magic query exists.
    if (namespaceNameQuery.length > 1) {
      throw new Error(`Error extracting namespace name: Found multiple 'In' queries with key '${Namespace.NAME_LABEL}'`);
    }

    // a single magic query exists, make sure its valid.
    const values = namespaceNameQuery[0].values;
    if (!values) {
      throw new Error(`Error extracting namespace name: Found multiple values for 'In' query with key '${Namespace.NAME_LABEL}': ${values}`);
    }
    if (values.length === 0) {
      throw new Error(`Error extracting namespace name: No values found for 'In' query with key ${Namespace.NAME_LABEL}`);
    }

    // the single value in the query is the namespace name.
    return values[0];
  }

  /**
   * @see IPeer.toIpBlock();
   */
  public toIpBlock(): networkpolicy.IpBlock | undefined {
    return undefined;
  }

  /**
   * @see IPeer.toNamespacedPodSelector()
   */
  public toNamespacedPodSelector(): pod.INamespacedPodSelector | undefined {
    return pod.Pod.all().namespaced(this);
  }

}

/**
 * Namespace identified by a name.
 */
export class NamedNamespace implements INamespaceSelector, networkpolicy.IPeer {

  public constructor(private readonly name: string) {};

  /**
   * @see INamespaceSelector.toNamespaceLabelSelector()
   */
  public toNamespaceLabelSelector(): pod.LabelSelector | undefined {
    return Namespace.labeled(pod.LabelQuery.is(Namespace.NAME_LABEL, this.name)).toNamespaceLabelSelector();
  }

  /**
   * @see INamespaceSelector.toNamespaceName()
   */
  public toNamespaceName(): string | undefined {
    return this.name;
  }

  /**
   * @see IPeer.toIpBlock();
   */
  public toIpBlock(): networkpolicy.IpBlock | undefined {
    return undefined;
  }

  /**
   * @see IPeer.toNamespacedPodSelector()
   */
  public toNamespacedPodSelector(): pod.INamespacedPodSelector | undefined {
    return pod.Pod.all().namespaced(this);
  }

}