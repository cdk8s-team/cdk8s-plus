import { ApiObject, Lazy } from 'cdk8s';
import { Construct } from 'constructs';
import * as base from './base';
import { Container } from './container';
import * as k8s from './imports/k8s';
import * as pod from './pod';
import { undefinedIfEmpty } from './utils';

/**
 * Properties for `Port.
 */
export interface PortProps {

  /**
   * Specific port number.
   */
  readonly port?: number;

  /**
   * End port (relative to `port`). Only applies if `port` is defined.
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
export class Port {

  /**
   * Distinct TCP ports
   */
  public static tcp(port: number): Port {
    return new Port(k8s.IntOrString.fromNumber(port), undefined, NetworkProtocol.TCP);
  }

  /**
   * A TCP port range
   */
  public static tcpRange(startPort: number, endPort: number) {
    return new Port(k8s.IntOrString.fromNumber(startPort), endPort, NetworkProtocol.TCP);
  }

  /**
   * Any TCP traffic
   */
  public static allTcp() {
    return new Port(k8s.IntOrString.fromNumber(0), 65535, NetworkProtocol.TCP);
  }

  /**
   * Distinct UDP ports
   */
  public static udp(port: number): Port {
    return new Port(k8s.IntOrString.fromNumber(port), undefined, NetworkProtocol.UDP);
  }

  /**
   * A UDP port range
   */
  public static udpRange(startPort: number, endPort: number) {
    return new Port(k8s.IntOrString.fromNumber(startPort), endPort, NetworkProtocol.UDP);
  }

  /**
   * Any UDP traffic
   */
  public static allUdp() {
    return new Port(k8s.IntOrString.fromNumber(0), 65535, NetworkProtocol.UDP);
  }

  /**
   * Custom port configuration.
   */
  public static of(props: PortProps): Port {
    return new Port(props.port ? k8s.IntOrString.fromNumber(props.port) : undefined, props.endPort, props.protocol);
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
 * Describes a peer to allow traffic to/from.
 * A peer can either by an ip block, or a selection of pods, not both.
 */
export interface IPeer {
  /**
   * Returns the ip block this peer represents.
   *
   * - Implementors should return `undefined` if the peer doesn't represent an ip block.
   */
  toIpBlock(): IpBlock | undefined;

  /**
   * Returns the namespaced pod this peer represents.
   *
   * - Implementors should return `undefined` if the peer doesn't represent a namespaced pod.
   */
  toNamespacedPodSelector(): pod.INamespacedPodSelector | undefined;
}

/**
 * Describes a rule allowing ougoing traffic from pods matched by a network policy selector.
 */
export interface NetworkPolicyEgressRule extends NetworkPolicyAddEgressRuleOptions {

  /**
   * Peer this rule interacts with.
   */
  readonly peer: IPeer;

}

/**
 * Describes a rule allowing incoming traffic to pods matched by a network policy selector.
 */
export interface NetworkPolicyIngressRule extends NetworkPolicyAddIngressRuleOptions {

  /**
   * Peer this rule interacts with.
   */
  readonly peer: IPeer;

}

/**
 * Describes a particular CIDR (Ex. "192.168.1.1/24","2001:db9::/64") that is
 * allowed to the pods matched by a network policy selector.
 * The except entry describes CIDRs that should not be included within this rule.
 */
export class IpBlock implements IPeer {

  /**
   * Create an IPv4 peer from a CIDR
   */
  public static ipv4(cidrIp: string, except?: string[]): IpBlock {
    const cidrMatch = cidrIp.match(/^(\d{1,3}\.){3}\d{1,3}(\/\d+)?$/);

    if (!cidrMatch) {
      throw new Error(`Invalid IPv4 CIDR: "${cidrIp}"`);
    }

    if (!cidrMatch[2]) {
      throw new Error(`CIDR mask is missing in IPv4: "${cidrIp}". Did you mean "${cidrIp}/32"?`);
    }

    return new IpBlock(cidrIp, except);
  }

  /**
   * Any IPv4 address
   */
  public static anyIpv4(): IpBlock {
    return new IpBlock('0.0.0.0/0');
  }

  /**
   * Create an IPv6 peer from a CIDR
   */
  public static ipv6(cidrIp: string, except?: string[]): IpBlock {

    const cidrMatch = cidrIp.match(/^([\da-f]{0,4}:){2,7}([\da-f]{0,4})?(\/\d+)?$/);

    if (!cidrMatch) {
      throw new Error(`Invalid IPv6 CIDR: "${cidrIp}"`);
    }

    if (!cidrMatch[3]) {
      throw new Error(`CIDR mask is missing in IPv6: "${cidrIp}". Did you mean "${cidrIp}/128"?`);
    }

    return new IpBlock(cidrIp, except);
  }

  /**
   * Any IPv6 address
   */
  public static anyIpv6(): IpBlock {
    return new IpBlock('::/0');
  }

  private constructor(
    /**
     * A string representing the IP Block Valid examples are "192.168.1.1/24" or "2001:db9::/64".
     */
    public readonly cidr: string,
    /**
     * A slice of CIDRs that should not be included within an IP Block Valid examples are "192.168.1.1/24" or "2001:db9::/64".
     * Except values will be rejected if they are outside the CIDR range.
     */
    public readonly except?: string[]) {}

  /**
   * @see IPeer.toIpBlock()
   */
  public toIpBlock(): IpBlock | undefined {
    return this;
  }

  /**
   * @see IPeer.toNamespacedPodSelector()
   */
  public toNamespacedPodSelector(): pod.INamespacedPodSelector | undefined {
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
 * Describes how the network policy should configure egress traffic.
 */
export interface NetworkPolicyEgressTraffic {

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
   * @default - no egress rules
   */
  readonly rules?: NetworkPolicyEgressRule[];
}

/**
 * Describes how the network policy should configure ingress traffic.
 */
export interface NetworkPolicyIngressTraffic {

  /**
   * Specifies the default behavior of the policy when
   * no ingress rules are defined.
   *
   * @default - unset, the policy does not change the behavior.
   */
  readonly default?: NetworkPolicyTrafficDefault;

  /**
   * List of rules to be applied to the selected pods.
   * If empty, the behavior of the policy is dictated by the `default` property.
   *
   * @default - no ingress rules
   */
  readonly rules?: NetworkPolicyIngressRule[];
}

/**
 * Options for `NetworkPolicy.addIngressRule`.
 */
export interface NetworkPolicyAddIngressRuleOptions {

  /**
   * Ports the rule should allow incoming traffic to.
   *
   * @default - If the policy selects a managed pod, take its ports. Otherwise, all ports are allowed.
   */
  readonly ports?: Port[];

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
  readonly ports?: Port[];

}


/**
 * Properties for `NetworkPolicy`.
 */
export interface NetworkPolicyProps extends base.ResourceProps {

  /**
   * Which pods does this policy object applies to.
   *
   * This can either be a single pod / workload, or a grouping of pods selected
   * via the `Pod.labeled` function. The array of ingress rules is applied to any
   * pods selected by this field. Multiple network policies can select the same
   * set of pods. In this case, the ingress rules for each are combined additively.
   *
   * @default - will select all pods in the namespace of the policy.
   */
  readonly selector?: pod.IPodSelector;

  /**
   * Egress traffic configuration.
   *
   * @default - the policy doesn't change egress behavior of the pods it selects.
   */
  readonly egress?: NetworkPolicyEgressTraffic;

  /**
   * Ingress traffic configuration.
   *
   * @default - the policy doesn't change ingress behavior of the pods it selects.
   */
  readonly ingress?: NetworkPolicyIngressTraffic;
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

  private readonly _podSelector: pod.IPodSelector;
  private readonly _egressRules: k8s.NetworkPolicyEgressRule[] = [];
  private readonly _ingressRules: k8s.NetworkPolicyIngressRule[] = [];
  private readonly _policyTypes: Set<string> = new Set();

  public constructor(scope: Construct, id: string, props: NetworkPolicyProps = {}) {
    super(scope, id);

    this.apiObject = new k8s.KubeNetworkPolicy(this, 'Resource', {
      metadata: props.metadata,
      spec: Lazy.any({ produce: () => this._toKube() }),
    });

    this._podSelector = props.selector ?? pod.Pod.all();

    this.configureDefaultBehavior('Egress', props.egress?.default);
    this.configureDefaultBehavior('Ingress', props.ingress?.default);

    for (const rule of props.egress?.rules ?? []) {
      this.allowTo(rule.peer, rule);
    }

    for (const rule of props.ingress?.rules ?? []) {
      this.allowFrom(rule.peer, rule);
    }
  }

  /**
   * Allow outgoing traffic to the peer.
   *
   * If the peer represents a managed pod, its container ports will be used
   * as the target ports. Otherwise, all ports will be allowed.
   * Use `options.ports` to explicitly specify ports.
   */
  public allowTo(peer: IPeer, options: NetworkPolicyAddEgressRuleOptions = {}) {

    const podSelector = peer.toNamespacedPodSelector()?.toPodSelector();

    const ports = options.ports ?? this.extractPorts(podSelector);
    this._policyTypes.add('Egress');
    this._egressRules.push({ ports: ports.map(p => p._toKube()), to: [this.createNetworkPolicyPeer(peer)] });
  }

  /**
   * Allow incoming traffic from the peer.
   *
   * If the policy selects a managed pod, its container ports will be used
   * as the target ports. Otherwise, all ports will be allowed.
   * Use `options.ports` to explicitly specify ports.
   */
  public allowFrom(peer: IPeer, options: NetworkPolicyAddIngressRuleOptions = {}) {
    const ports = options.ports ?? this.extractPorts(this._podSelector);
    this._policyTypes.add('Ingress');
    this._ingressRules.push({ ports: ports.map(p => p._toKube()), from: [this.createNetworkPolicyPeer(peer)] });
  }

  private extractPorts(selector?: pod.IPodSelector): Port[] {

    // empty means all ports
    if (!selector) { return []; }

    const ports = [];

    // we don't use instanceof intentionally since it can create
    // cyclic import problems.
    const containers: Container[] = (selector as any).containers;

    for (const container of containers ?? []) {
      if (container.port) {
        ports.push(Port.tcp(container.port));
      }
    }

    return ports;
  }

  private createNetworkPolicyPeer(peer: IPeer): k8s.NetworkPolicyPeer {
    const ipBlock = peer.toIpBlock();
    if (ipBlock) {
      return { ipBlock: ipBlock._toKube() };
    } else {

      // TODO validate this is actually defined.
      const namespacedPod = peer.toNamespacedPodSelector()!;
      return {
        namespaceSelector: namespacedPod.toNamespaceSelector()?.toNamespaceLabelSelector()?._toKube(),
        podSelector: namespacedPod.toPodSelector().toPodLabelSelector()._toKube(),
      };
    }
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
      podSelector: this._podSelector.toPodLabelSelector()._toKube(),
      egress: undefinedIfEmpty(this._egressRules),
      ingress: undefinedIfEmpty(this._ingressRules),
      policyTypes: undefinedIfEmpty(Array.from(this._policyTypes)),
    };
  }

}