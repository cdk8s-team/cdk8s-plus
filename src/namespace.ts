import { ApiObject, Lazy } from 'cdk8s';
import { Construct } from 'constructs';
import * as base from './base';
import * as k8s from './imports/k8s';
import * as networkpolicy from './network-policy';
import * as pod from './pod';

/**
 * Configuration for selecting namespaces.
 */
export interface NamespaceSelectorConfig {

  /**
   * A selector to select namespaces by labels.
   */
  readonly labelSelector?: pod.LabelSelector;

  /**
   * A list of names to select namespaces by names.
   */
  readonly names?: string[];
}

/**
 * Represents an object that can select namespaces.
 */
export interface INamespaceSelector {
  /**
   * Return the configuration of this selector.
   */
  toNamespaceSelectorConfig(): NamespaceSelectorConfig;
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
export class Namespace extends base.Resource implements INamespaceSelector, networkpolicy.INetworkPolicyPeer {

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
   * @see INamespaceSelector.toNamespaceSelectorConfig()
   */
  public toNamespaceSelectorConfig(): NamespaceSelectorConfig {
    return { names: [this.name] };
  }

  /**
   * @see INetworkPolicyPeer.toNetworkPolicyPeerConfig()
   */
  public toNetworkPolicyPeerConfig(): networkpolicy.NetworkPolicyPeerConfig {
    const pods = pod.Pods.all({
      namespaces: Namespaces.select({ names: [this.name] }),
    });
    return pods.toNetworkPolicyPeerConfig();
  }

  /**
   * @internal
   */
  public _toKube(): k8s.NamespaceSpec {
    return {};
  }

}

/**
 * Options for `Namespaces.select`.
 */
export interface NamespacesSelectOptions {

  /**
   * Labels the namespaces must have.
   * This is equivalent to using an 'Is' selector.
   *
   * @default - no strict labels requirements.
   */
  readonly labels?: { [key: string]: string };

  /**
   * Namespaces must satisfy these selectors.
   * The selectors query labels, just like the `labels` property, but they
   * provide a more advanced matching mechanism.
   *
   * @default - no selector requirements.
   */
  readonly expressions?: pod.LabelExpression[];

  /**
   * Namespaces names must be one of these.
   *
   * @default - no name requirements.
   */
  readonly names?: string[];

}

/**
 * Represents a group of namespaces.
 */
export class Namespaces implements INamespaceSelector, networkpolicy.INetworkPolicyPeer {

  /**
   * Select specific namespaces.
   */
  public static select(options: NamespacesSelectOptions): Namespaces {
    return new Namespaces(options.expressions, options.names, options.labels);
  }

  /**
   * Select all namespaces.
   */
  public static all(): Namespaces {
    return Namespaces.select({ expressions: [], labels: {} });
  }

  constructor(
    private readonly expressions?: pod.LabelExpression[],
    private readonly names?: string[],
    private readonly labels?: { [key: string]: string }) { }

  /**
   * @see INamespaceSelector.toNamespaceSelectorConfig()
   */
  public toNamespaceSelectorConfig(): NamespaceSelectorConfig {
    return {
      labelSelector: pod.LabelSelector.of({ expressions: this.expressions, labels: this.labels } ),
      names: this.names,
    };
  }

  /**
   * @see INetworkPolicyPeer.toNetworkPolicyPeerConfig()
   */
  public toNetworkPolicyPeerConfig(): networkpolicy.NetworkPolicyPeerConfig {
    return pod.Pods.all({ namespaces: this }).toNetworkPolicyPeerConfig();
  }

}
