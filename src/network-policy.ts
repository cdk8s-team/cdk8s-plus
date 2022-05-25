import { ApiObject, Lazy } from 'cdk8s';
import { Construct, IConstruct } from 'constructs';
import * as base from './base';
import * as k8s from './imports/k8s';
import * as namespace from './namespace';
import * as pod from './pod';
import { undefinedIfEmpty } from './utils';

/**
 * Properties for `NetworkPolicyPort`.
 */
export interface NetworkPolicyPortProps {

  /**
   * Specific port number.
   *
   * @default - all ports are allowed.
   */
  readonly port?: number;

  /**
   * End port (relative to `port`). Only applies if `port` is defined.
   * Use this to specify a port range, rather that a specific one.
   *
   * @default - not a port range.
   */
  readonly endPort?: number;

  /**
   * Protocol.
   *
   * @default NetworkProtocol.TCP
   */
  readonly protocol?: NetworkProtocol;
}

/**
 * Describes a port to allow traffic on.
 */
export class NetworkPolicyPort {

  /**
   * Distinct TCP ports
   */
  public static tcp(port: number): NetworkPolicyPort {
    return new NetworkPolicyPort(k8s.IntOrString.fromNumber(port), undefined, NetworkProtocol.TCP);
  }

  /**
   * A TCP port range
   */
  public static tcpRange(startPort: number, endPort: number) {
    return new NetworkPolicyPort(k8s.IntOrString.fromNumber(startPort), endPort, NetworkProtocol.TCP);
  }

  /**
   * Any TCP traffic
   */
  public static allTcp() {
    return new NetworkPolicyPort(k8s.IntOrString.fromNumber(0), 65535, NetworkProtocol.TCP);
  }

  /**
   * Distinct UDP ports
   */
  public static udp(port: number): NetworkPolicyPort {
    return new NetworkPolicyPort(k8s.IntOrString.fromNumber(port), undefined, NetworkProtocol.UDP);
  }

  /**
   * A UDP port range
   */
  public static udpRange(startPort: number, endPort: number) {
    return new NetworkPolicyPort(k8s.IntOrString.fromNumber(startPort), endPort, NetworkProtocol.UDP);
  }

  /**
   * Any UDP traffic
   */
  public static allUdp() {
    return new NetworkPolicyPort(k8s.IntOrString.fromNumber(0), 65535, NetworkProtocol.UDP);
  }

  /**
   * Custom port configuration.
   */
  public static of(props: NetworkPolicyPortProps): NetworkPolicyPort {
    return new NetworkPolicyPort(props.port ? k8s.IntOrString.fromNumber(props.port) : undefined, props.endPort, props.protocol);
  }

  private constructor(
    private readonly port?: k8s.IntOrString,
    private readonly endPort?: number,
    private readonly protocol?: NetworkProtocol) {}

  /**
   * @internal
   */
  public _toKube(): k8s.NetworkPolicyPort {
    return { port: this.port, endPort: this.endPort, protocol: this.protocol };
  }

}

/**
 * Configuration for network peers.
 * A peer can either by an ip block, or a selection of pods, not both.
 */
export interface NetworkPolicyPeerConfig {

  /**
   * The ip block this peer represents.
   */
  readonly ipBlock?: NetworkPolicyIpBlock;

  /**
   * The pod selector this peer represents.
   */
  readonly podSelector?: pod.PodSelectorConfig;

}

/**
 * Describes a peer to allow traffic to/from.
 */
export interface INetworkPolicyPeer extends IConstruct {
  /**
   * Return the configuration of this peer.
   */
  toNetworkPolicyPeerConfig(): NetworkPolicyPeerConfig;

  /**
   * Convert the peer into a pod selector, if possible.
   */
  toPodSelector(): pod.IPodSelector | undefined;
}

/**
 * Describes a rule allowing traffic from / to pods matched by a network policy selector.
 */
export interface NetworkPolicyRule {

  /**
   * The ports of the rule.
   *
   * @default - traffic is allowed on all ports.
   */
  readonly ports?: NetworkPolicyPort[];

  /**
   * Peer this rule interacts with.
   */
  readonly peer: INetworkPolicyPeer;

}

/**
 * Describes a particular CIDR (Ex. "192.168.1.1/24","2001:db9::/64") that is
 * allowed to the pods matched by a network policy selector.
 * The except entry describes CIDRs that should not be included within this rule.
 */
export class NetworkPolicyIpBlock extends Construct implements INetworkPolicyPeer {

  /**
   * Create an IPv4 peer from a CIDR
   */
  public static ipv4(scope: Construct, id: string, cidrIp: string, except?: string[]): NetworkPolicyIpBlock {
    const cidrMatch = cidrIp.match(/^(\d{1,3}\.){3}\d{1,3}(\/\d+)?$/);

    if (!cidrMatch) {
      throw new Error(`Invalid IPv4 CIDR: "${cidrIp}"`);
    }

    if (!cidrMatch[2]) {
      throw new Error(`CIDR mask is missing in IPv4: "${cidrIp}". Did you mean "${cidrIp}/32"?`);
    }

    return new NetworkPolicyIpBlock(scope, id, cidrIp, except);
  }

  /**
   * Any IPv4 address
   */
  public static anyIpv4(scope: Construct, id: string): NetworkPolicyIpBlock {
    return new NetworkPolicyIpBlock(scope, id, '0.0.0.0/0');
  }

  /**
   * Create an IPv6 peer from a CIDR
   */
  public static ipv6(scope: Construct, id: string, cidrIp: string, except?: string[]): NetworkPolicyIpBlock {

    const cidrMatch = cidrIp.match(/^([\da-f]{0,4}:){2,7}([\da-f]{0,4})?(\/\d+)?$/);

    if (!cidrMatch) {
      throw new Error(`Invalid IPv6 CIDR: "${cidrIp}"`);
    }

    if (!cidrMatch[3]) {
      throw new Error(`CIDR mask is missing in IPv6: "${cidrIp}". Did you mean "${cidrIp}/128"?`);
    }

    return new NetworkPolicyIpBlock(scope, id, cidrIp, except);
  }

  /**
   * Any IPv6 address
   */
  public static anyIpv6(scope: Construct, id: string): NetworkPolicyIpBlock {
    return new NetworkPolicyIpBlock(scope, id, '::/0');
  }

  private constructor(scope: Construct, id: string,
    /**
     * A string representing the IP Block Valid examples are "192.168.1.1/24" or "2001:db9::/64".
     */
    public readonly cidr: string,
    /**
     * A slice of CIDRs that should not be included within an IP Block Valid examples are "192.168.1.1/24" or "2001:db9::/64".
     * Except values will be rejected if they are outside the CIDR range.
     */
    public readonly except?: string[]) {
    super(scope, id);
  }

  /**
   * @see INetworkPolicyPeer.toNetworkPolicyPeerConfig()
   */
  public toNetworkPolicyPeerConfig(): NetworkPolicyPeerConfig {
    return { ipBlock: this };
  }

  /**
   * @see INetworkPolicyPeer.toPodSelector()
   */
  public toPodSelector(): pod.IPodSelector | undefined {
    return undefined;
  }

  /**
   * @internal
   */
  public _toKube(): k8s.IpBlock {
    return { cidr: this.cidr, except: this.except };
  }

}

/**
 * Network protocols.
 */
export enum NetworkProtocol {
  /**
   * TCP.
   */
  TCP = 'TCP',
  /**
   * UDP.
   */
  UDP = 'UDP',
  /**
   * SCTP.
   */
  SCTP = 'SCTP',
}

/**
 * Default behaviors of network traffic in policies.
 */
export enum NetworkPolicyTrafficDefault {
  /**
   * The policy denies all traffic.
   * Since rules are additive, additional rules or policies can allow
   * specific traffic.
   */
  DENY = 'DENY',
  /**
   * The policy denies all traffic (either ingress or egress).
   * Since rules are additive, no additional rule or policies can
   * subsequently deny the traffic.
   */
  ALLOW = 'ALLOW',
}

/**
 * Describes how the network policy should configure egress / ingress traffic.
 */
export interface NetworkPolicyTraffic {

  /**
   * Specifies the default behavior of the policy when
   * no egress rules are defined.
   *
   * @default - unset, the policy does not change the behavior.
   */
  readonly default?: NetworkPolicyTrafficDefault;

  /**
   * List of rules to be applied to the selected pods.
   * If empty, the behavior of the policy is dictated by the `default` property.
   *
   * @default - no rules
   */
  readonly rules?: NetworkPolicyRule[];
}

/**
 * Options for `NetworkPolicy.addEgressRule`.
 */
export interface NetworkPolicyAddEgressRuleOptions {

  /**
   * Ports the rule should allow outgoing traffic to.
   *
   * @default - If the peer is a managed pod, take its ports. Otherwise, all ports are allowed.
   */
  readonly ports?: NetworkPolicyPort[];

}


/**
 * Properties for `NetworkPolicy`.
 */
export interface NetworkPolicyProps extends base.ResourceProps {

  /**
   * Which pods does this policy object applies to.
   *
   * This can either be a single pod / workload, or a grouping of pods selected
   * via the `Pod.select` function. Rules is applied to any pods selected by this property.
   * Multiple network policies can select the same set of pods.
   * In this case, the rules for each are combined additively.
   *
   * Note that
   *
   * @default - will select all pods in the namespace of the policy.
   */
  readonly selector?: pod.IPodSelector;

  /**
   * Egress traffic configuration.
   *
   * @default - the policy doesn't change egress behavior of the pods it selects.
   */
  readonly egress?: NetworkPolicyTraffic;

  /**
   * Ingress traffic configuration.
   *
   * @default - the policy doesn't change ingress behavior of the pods it selects.
   */
  readonly ingress?: NetworkPolicyTraffic;
}

/**
 * Control traffic flow at the IP address or port level (OSI layer 3 or 4),
 * network policies are an application-centric construct which allow you
 * to specify how a pod is allowed to communicate with various network peers.
 *
 * - Outgoing traffic is allowed if there are no network policies selecting
 *   the pod (and cluster policy otherwise allows the traffic),
 *   OR if the traffic matches at least one egress rule across all of the
 *   network policies that select the pod.
 *
 * - Incoming traffic is allowed to a pod if there are no network policies
 *   selecting the pod (and cluster policy otherwise allows the traffic),
 *   OR if the traffic source is the pod's local node,
 *   OR if the traffic matches at least one ingress rule across all of
 *   the network policies that select the pod.
 *
 * Network policies do not conflict; they are additive.
 * If any policy or policies apply to a given pod for a given
 * direction, the connections allowed in that direction from
 * that pod is the union of what the applicable policies allow.
 * Thus, order of evaluation does not affect the policy result.
 *
 * For a connection from a source pod to a destination pod to be allowed,
 * both the egress policy on the source pod and the ingress policy on the
 * destination pod need to allow the connection.
 * If either side does not allow the connection, it will not happen.
 *
 * @see https://kubernetes.io/docs/concepts/services-networking/network-policies/#networkpolicy-resource
 */
export class NetworkPolicy extends base.Resource {

  /**
   * @see base.Resource.apiObject
   */
  protected readonly apiObject: ApiObject;

  public readonly resourceType: string = 'networkpolicies';

  private readonly _podSelectorConfig: pod.PodSelectorConfig;
  private readonly _egressRules: k8s.NetworkPolicyEgressRule[] = [];
  private readonly _ingressRules: k8s.NetworkPolicyIngressRule[] = [];
  private readonly _policyTypes: Set<string> = new Set();

  public constructor(scope: Construct, id: string, props: NetworkPolicyProps = {}) {
    super(scope, id);

    this._podSelectorConfig = (props.selector ?? pod.Pods.all(this, 'AllPods')).toPodSelectorConfig();

    let ns;

    if (!props.metadata?.namespace) {

      if (this._podSelectorConfig.namespaces?.labelSelector && !this._podSelectorConfig.namespaces?.labelSelector.isEmpty()) {
        throw new Error('Unable to create a network policy for a selector that selects pods in namespaces based on labes');
      }

      if (this._podSelectorConfig.namespaces?.names && this._podSelectorConfig.namespaces.names.length > 1) {
        throw new Error('Unable to create a network policy for a selector that selects pods in multiple namespace');
      }

      ns = this._podSelectorConfig.namespaces?.names ? this._podSelectorConfig.namespaces?.names[0] : undefined;

    } else {
      ns = props.metadata.namespace;
    }

    this.apiObject = new k8s.KubeNetworkPolicy(this, 'Resource', {
      metadata: { ...props.metadata, namespace: ns },
      spec: Lazy.any({ produce: () => this._toKube() }),
    });

    this.configureDefaultBehavior('Egress', props.egress?.default);
    this.configureDefaultBehavior('Ingress', props.ingress?.default);

    for (const rule of props.egress?.rules ?? []) {
      this.addEgressRule(rule.peer, rule.ports);
    }

    for (const rule of props.ingress?.rules ?? []) {
      this.addIngressRule(rule.peer, rule.ports);
    }
  }

  /**
   * Allow outgoing traffic to the peer.
   *
   * If ports are not passed, traffic will be allowed on all ports.
   */
  public addEgressRule(peer: INetworkPolicyPeer, ports?: NetworkPolicyPort[]) {
    this._policyTypes.add('Egress');
    this._egressRules.push({ ports: (ports ?? []).map(p => p._toKube()), to: this.createNetworkPolicyPeers(peer) });
  }

  /**
   * Allow incoming traffic from the peer.
   *
   * If ports are not passed, traffic will be allowed on all ports.
   */
  public addIngressRule(peer: INetworkPolicyPeer, ports?: NetworkPolicyPort[]) {
    this._policyTypes.add('Ingress');
    this._ingressRules.push({ ports: (ports ?? []).map(p => p._toKube()), from: this.createNetworkPolicyPeers(peer) });
  }

  private createNetworkPolicyPeers(peer: INetworkPolicyPeer): k8s.NetworkPolicyPeer[] {

    const config = peer.toNetworkPolicyPeerConfig();

    validatePeerConfig(config);

    if (config.ipBlock) {
      // ip block is a single peer.
      return [{ ipBlock: config.ipBlock._toKube() }];
    }

    if (!config.podSelector!.namespaces?.names) {
      // when no explicit namespaces are defined we can just use
      // the selector as is
      return [{
        namespaceSelector: config.podSelector!.namespaces?.labelSelector?._toKube(),
        podSelector: config.podSelector!.labelSelector._toKube(),
      }];
    }

    // when explicit namespaces are defined, we need to create a separate
    // peer for each, since a label selector cannot have multiple name labels. (they will conflict)
    const namespaceSelector = config.podSelector?.namespaces?.labelSelector?._toKube() ?? {};
    return config.podSelector!.namespaces.names!.map(n => ({
      podSelector: config.podSelector!.labelSelector._toKube(),
      namespaceSelector: {
        matchExpressions: namespaceSelector.matchExpressions,
        matchLabels: {
          ...namespaceSelector.matchLabels,
          [namespace.Namespace.NAME_LABEL]: n,
        },
      },
    }));
  }

  private configureDefaultBehavior(direction: 'Ingress' | 'Egress', _default?: NetworkPolicyTrafficDefault) {

    if (!_default) { return;}

    if (_default === NetworkPolicyTrafficDefault.DENY) {
      // https://kubernetes.io/docs/concepts/services-networking/network-policies/#default-deny-all-egress-traffic
      this._policyTypes.add(direction);
    }

    if (_default === NetworkPolicyTrafficDefault.ALLOW) {
      // https://kubernetes.io/docs/concepts/services-networking/network-policies/#allow-all-egress-traffic
      this._policyTypes.add(direction);
      if (direction === 'Egress') {
        this._egressRules.push({});
      } else {
        this._ingressRules.push({});
      }
    }
  }

  /**
   * @internal
   */
  public _toKube(): k8s.NetworkPolicySpec {
    return {
      podSelector: this._podSelectorConfig.labelSelector._toKube(),
      egress: undefinedIfEmpty(this._egressRules),
      ingress: undefinedIfEmpty(this._ingressRules),
      policyTypes: undefinedIfEmpty(Array.from(this._policyTypes)),
    };
  }

}

export function validatePeerConfig(peerConfig: NetworkPolicyPeerConfig) {
  if (!peerConfig.ipBlock && !peerConfig.podSelector) {
    throw new Error('Inavlid peer: either \'ipBlock\' or \'podSelector\' must be defined');
  }
  if (peerConfig.ipBlock && peerConfig.podSelector) {
    throw new Error('Inavlid peer: only one of \'ipBlock\' and \'podSelector\' must be defined');
  }
}
