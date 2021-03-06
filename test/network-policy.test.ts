import { Testing } from 'cdk8s';
import * as kplus from '../src';

describe('IpBlock |', () => {

  test('ipv4', () => {
    const chart = Testing.chart();
    expect(kplus.NetworkPolicyIpBlock.ipv4(chart, 'Block', '172.17.0.0/16', ['172.17.1.0/24'])._toKube()).toMatchSnapshot();
  });

  test('throws on invalid ipv4 cidr', () => {
    const chart = Testing.chart();
    expect(() => kplus.NetworkPolicyIpBlock.ipv4(chart, 'Block', '1234')).toThrow(/Invalid IPv4 CIDR:/);
  });

  test('ipv6', () => {
    const chart = Testing.chart();
    expect(kplus.NetworkPolicyIpBlock.ipv6(chart, 'Block', '2002::1234:abcd:ffff:c0a8:101/64', ['2002::1234:abcd:ffff:c0a8:101/24'])._toKube()).toMatchSnapshot();
  });

  test('throws on invalid ipv6 cidr', () => {
    const chart = Testing.chart();
    expect(() => kplus.NetworkPolicyIpBlock.ipv6(chart, 'Block', '1234')).toThrow(/Invalid IPv6 CIDR:/);
  });

  test('anyIpv4', () => {
    const chart = Testing.chart();
    expect(kplus.NetworkPolicyIpBlock.anyIpv4(chart, 'Block')._toKube()).toMatchSnapshot();
  });

  test('anyIpv6', () => {
    const chart = Testing.chart();
    expect(kplus.NetworkPolicyIpBlock.anyIpv6(chart, 'Block')._toKube()).toMatchSnapshot();
  });

});

describe('NetworkPolicyPort |', () => {

  test('tcp', () => {
    expect(kplus.NetworkPolicyPort.tcp(8080)._toKube()).toMatchSnapshot();
  });

  test('tcpRange', () => {
    expect(kplus.NetworkPolicyPort.tcpRange(8080, 8085)._toKube()).toMatchSnapshot();
  });

  test('allTcp', () => {
    expect(kplus.NetworkPolicyPort.allTcp()._toKube()).toMatchSnapshot();
  });

  test('udp', () => {
    expect(kplus.NetworkPolicyPort.udp(8080)._toKube()).toMatchSnapshot();
  });

  test('udpRange', () => {
    expect(kplus.NetworkPolicyPort.udpRange(8080, 8085)._toKube()).toMatchSnapshot();
  });

  test('allUcp', () => {
    expect(kplus.NetworkPolicyPort.allUdp()._toKube()).toMatchSnapshot();
  });

  test('of', () => {
    expect(kplus.NetworkPolicyPort.of({ port: 5050, endPort: 5500, protocol: kplus.NetworkProtocol.SCTP }));
  });

});

describe('NeworkPolicy |', () => {

  test('can create a policy for a managed pod', () => {

    const chart = Testing.chart();
    const web = new kplus.Pod(chart, 'Web', {
      containers: [{ image: 'web' }],
    });

    new kplus.NetworkPolicy(chart, 'Policy', { selector: web });

    expect(Testing.synth(chart)).toMatchSnapshot();

  });

  test('can create a policy for a managed workload resource', () => {

    const chart = Testing.chart();
    const web = new kplus.Deployment(chart, 'Web', {
      containers: [{ image: 'web' }],
    });

    new kplus.NetworkPolicy(chart, 'Policy', { selector: web });

    expect(Testing.synth(chart)).toMatchSnapshot();

  });

  test('can create a policy for selected pods', () => {

    const chart = Testing.chart();
    const web = kplus.Pods.select(chart, 'Pods', { labels: { app: 'web' } });

    new kplus.NetworkPolicy(chart, 'Policy', { selector: web });

    expect(Testing.synth(chart)).toMatchSnapshot();
  });

  test('can create a policy for all pods', () => {

    const chart = Testing.chart();

    new kplus.NetworkPolicy(chart, 'Policy1');
    new kplus.NetworkPolicy(chart, 'Policy2', { selector: kplus.Pods.all(chart, 'AllPods') });

    expect(Testing.synth(chart)).toMatchSnapshot();
  });

  test('can create a policy that allows all ingress by default', () => {

    const chart = Testing.chart();

    new kplus.NetworkPolicy(chart, 'Policy', {
      ingress: { default: kplus.NetworkPolicyTrafficDefault.ALLOW },
    });

    expect(Testing.synth(chart)).toMatchSnapshot();

  });

  test('can create a policy that denies all ingress by default', () => {

    const chart = Testing.chart();

    new kplus.NetworkPolicy(chart, 'Policy', {
      ingress: { default: kplus.NetworkPolicyTrafficDefault.DENY },
    });

    expect(Testing.synth(chart)).toMatchSnapshot();

  });

  test('can create a policy that allows all egress by default', () => {

    const chart = Testing.chart();

    new kplus.NetworkPolicy(chart, 'Policy', {
      egress: { default: kplus.NetworkPolicyTrafficDefault.ALLOW },
    });

    expect(Testing.synth(chart)).toMatchSnapshot();

  });

  test('can create a policy that denies all egress by default', () => {

    const chart = Testing.chart();

    new kplus.NetworkPolicy(chart, 'Policy', {
      egress: { default: kplus.NetworkPolicyTrafficDefault.DENY },
    });

    expect(Testing.synth(chart)).toMatchSnapshot();

  });

  test('cannot create a policy for a selector that selects pods in multiple namespaces', () => {

    const chart = Testing.chart();
    const web = kplus.Pods.select(chart, 'Pods', {
      namespaces: kplus.Namespaces.select(chart, 'Namespaces', {
        names: ['n1', 'n2'],
      }),
    });

    expect(() => new kplus.NetworkPolicy(chart, 'Policy', {
      selector: web,
    })).toThrow('Unable to create a network policy for a selector (test/Pods) that selects pods in multiple namespaces');

  });

  test('cannot create a policy for a selector that selects pods in namespaces based on labels', () => {

    const chart = Testing.chart();
    const web = kplus.Pods.select(chart, 'Pods', {
      labels: { app: 'web' },
      namespaces: kplus.Namespaces.select(chart, 'Namespaces', {
        labels: { tier: 'web' },
      }),
    });

    expect(() => new kplus.NetworkPolicy(chart, 'Policy', {
      selector: web,
    })).toThrow('Unable to create a network policy for a selector (test/Pods) that selects pods in namespaces based on labels');

  });

  test('policy namespace defaults to selector namespace', () => {

    const chart = Testing.chart();
    const web = new kplus.Pod(chart, 'Web', {
      containers: [{ image: 'web' }],
      metadata: { namespace: 'n1' },
    });

    const policy = new kplus.NetworkPolicy(chart, 'Policy', { selector: web });

    expect(policy.metadata.namespace).toEqual('n1');

  });

  test('can add ingress from an ip block', () => {

    const chart = Testing.chart();
    const pod = new kplus.Pod(chart, 'Pod', { containers: [{ image: 'pod' }] });

    const ipBlock = kplus.NetworkPolicyIpBlock.ipv4(chart, 'Block', '172.17.0.0/16', ['172.17.1.0/24']);

    const policy = new kplus.NetworkPolicy(chart, 'Policy', { selector: pod });

    policy.addIngressRule(ipBlock, [kplus.NetworkPolicyPort.tcp(6379)]);

    expect(Testing.synth(chart)).toMatchSnapshot();

  });

  test('can add ingress from a managed pod', () => {

    const chart = Testing.chart();
    const pod1 = new kplus.Pod(chart, 'Pod1', { containers: [{ image: 'pod' }] });
    const pod2 = new kplus.Pod(chart, 'Pod2', { containers: [{ image: 'pod' }] });

    const policy = new kplus.NetworkPolicy(chart, 'Policy', { selector: pod1 });

    policy.addIngressRule(pod2, [kplus.NetworkPolicyPort.tcp(6379)]);

    expect(Testing.synth(chart)).toMatchSnapshot();

  });

  test('can add ingress from a managed workload resource', () => {

    const chart = Testing.chart();
    const pod = new kplus.Pod(chart, 'Pod', { containers: [{ image: 'pod' }] });
    const deployment = new kplus.Deployment(chart, 'Deployment', { containers: [{ image: 'pod' }] });

    const policy = new kplus.NetworkPolicy(chart, 'Policy', { selector: pod });

    policy.addIngressRule(deployment, [kplus.NetworkPolicyPort.tcp(6379)]);

    expect(Testing.synth(chart)).toMatchSnapshot();

  });

  test('can add ingress from pods selected without namespaces', () => {

    const chart = Testing.chart();
    const pod = new kplus.Pod(chart, 'Pod', { containers: [{ image: 'pod' }] });

    const selected = kplus.Pods.select(chart, 'Pods', { labels: { type: 'selected' } });

    const policy = new kplus.NetworkPolicy(chart, 'Policy', { selector: pod });

    policy.addIngressRule(selected, [kplus.NetworkPolicyPort.tcp(6379)]);

    expect(Testing.synth(chart)).toMatchSnapshot();

  });

  test('can add ingress from pods selected with namespaces selected by labes', () => {

    const chart = Testing.chart();
    const pod = new kplus.Pod(chart, 'Pod', { containers: [{ image: 'pod' }] });

    const selected = kplus.Pods.select(chart, 'Pods', {
      labels: { type: 'selected' },
      namespaces: kplus.Namespaces.select(chart, 'Namespaces', { labels: { type: 'selected' } }),
    });

    const policy = new kplus.NetworkPolicy(chart, 'Policy', { selector: pod });

    policy.addIngressRule(selected, [kplus.NetworkPolicyPort.tcp(6379)]);

    expect(Testing.synth(chart)).toMatchSnapshot();

  });

  test('can add ingress from pods selected with namespaces selected by names', () => {

    const chart = Testing.chart();
    const pod = new kplus.Pod(chart, 'Pod', { containers: [{ image: 'pod' }] });

    const selected = kplus.Pods.select(chart, 'Pods', {
      labels: { type: 'selected' },
      namespaces: kplus.Namespaces.select(chart, 'Namespaces', {
        labels: { type: 'selected' },
        names: ['selected1', 'selected2'],
      }),
    });

    const policy = new kplus.NetworkPolicy(chart, 'Policy', { selector: pod });

    policy.addIngressRule(selected, [kplus.NetworkPolicyPort.tcp(6379)]);

    expect(Testing.synth(chart)).toMatchSnapshot();

  });

  test('can add ingress from all pods', () => {

    const chart = Testing.chart();
    const pod = new kplus.Pod(chart, 'Pod', { containers: [{ image: 'pod' }] });

    const all = kplus.Pods.all(chart, 'AllPods');

    const policy = new kplus.NetworkPolicy(chart, 'Policy', { selector: pod });

    policy.addIngressRule(all, [kplus.NetworkPolicyPort.tcp(6379)]);

    expect(Testing.synth(chart)).toMatchSnapshot();

  });

  test('can add ingress from managed namespace', () => {

    const chart = Testing.chart();
    const pod = new kplus.Pod(chart, 'Pod', { containers: [{ image: 'pod' }] });

    const namespace = new kplus.Namespace(chart, 'Namespace');

    const policy = new kplus.NetworkPolicy(chart, 'Policy', { selector: pod });

    policy.addIngressRule(namespace, [kplus.NetworkPolicyPort.tcp(6379)]);

    expect(Testing.synth(chart)).toMatchSnapshot();

  });

  test('can add ingress from selected namespaces', () => {

    const chart = Testing.chart();
    const pod = new kplus.Pod(chart, 'Pod', { containers: [{ image: 'pod' }] });

    const namespace = kplus.Namespaces.select(chart, 'Namespaces', { labels: { type: 'selected' } });

    const policy = new kplus.NetworkPolicy(chart, 'Policy', { selector: pod });

    policy.addIngressRule(namespace, [kplus.NetworkPolicyPort.tcp(6379)]);

    expect(Testing.synth(chart)).toMatchSnapshot();

  });

  test('can add ingress from all namespaces', () => {

    const chart = Testing.chart();
    const pod = new kplus.Pod(chart, 'Pod', { containers: [{ image: 'pod' }] });

    const namespaces = kplus.Namespaces.all(chart, 'AllPods');

    const policy = new kplus.NetworkPolicy(chart, 'Policy', { selector: pod });

    policy.addIngressRule(namespaces, [kplus.NetworkPolicyPort.tcp(6379)]);

    expect(Testing.synth(chart)).toMatchSnapshot();

  });


  test('can add egress to an ip block', () => {

    const chart = Testing.chart();
    const pod = new kplus.Pod(chart, 'Pod', { containers: [{ image: 'pod' }] });

    const ipBlock = kplus.NetworkPolicyIpBlock.ipv4(chart, 'Block', '172.17.0.0/16', ['172.17.1.0/24']);

    const policy = new kplus.NetworkPolicy(chart, 'Policy', { selector: pod });

    policy.addEgressRule(ipBlock, [kplus.NetworkPolicyPort.tcp(6379)]);

    expect(Testing.synth(chart)).toMatchSnapshot();

  });

  test('can add egress to a managed pod', () => {

    const chart = Testing.chart();
    const pod1 = new kplus.Pod(chart, 'Pod1', { containers: [{ image: 'pod' }] });
    const pod2 = new kplus.Pod(chart, 'Pod2', { containers: [{ image: 'pod' }] });

    const policy = new kplus.NetworkPolicy(chart, 'Policy', { selector: pod1 });

    policy.addEgressRule(pod2, [kplus.NetworkPolicyPort.tcp(6379)]);

    expect(Testing.synth(chart)).toMatchSnapshot();

  });

  test('can add egress to a managed workload resource', () => {

    const chart = Testing.chart();
    const pod = new kplus.Pod(chart, 'Pod', { containers: [{ image: 'pod' }] });
    const deployment = new kplus.Deployment(chart, 'Deployment', { containers: [{ image: 'pod' }] });

    const policy = new kplus.NetworkPolicy(chart, 'Policy', { selector: pod });

    policy.addEgressRule(deployment, [kplus.NetworkPolicyPort.tcp(6379)]);

    expect(Testing.synth(chart)).toMatchSnapshot();

  });

  test('can add egress to pods selected without namespaces', () => {

    const chart = Testing.chart();
    const pod = new kplus.Pod(chart, 'Pod', { containers: [{ image: 'pod' }] });

    const selected = kplus.Pods.select(chart, 'Pods', { labels: { type: 'selected' } });

    const policy = new kplus.NetworkPolicy(chart, 'Policy', { selector: pod });

    policy.addEgressRule(selected, [kplus.NetworkPolicyPort.tcp(6379)]);

    expect(Testing.synth(chart)).toMatchSnapshot();

  });

  test('can add egress to pods selected with namespaces selected by labes', () => {

    const chart = Testing.chart();
    const pod = new kplus.Pod(chart, 'Pod', { containers: [{ image: 'pod' }] });

    const selected = kplus.Pods.select(chart, 'Pods', {
      labels: { type: 'selected' },
      namespaces: kplus.Namespaces.select(chart, 'Namespaces', { labels: { type: 'selected' } }),
    });

    const policy = new kplus.NetworkPolicy(chart, 'Policy', { selector: pod });

    policy.addEgressRule(selected, [kplus.NetworkPolicyPort.tcp(6379)]);

    expect(Testing.synth(chart)).toMatchSnapshot();

  });

  test('can add egress to pods selected with namespaces selected by names', () => {

    const chart = Testing.chart();
    const pod = new kplus.Pod(chart, 'Pod', { containers: [{ image: 'pod' }] });

    const selected = kplus.Pods.select(chart, 'Pods', {
      labels: { type: 'selected' },
      namespaces: kplus.Namespaces.select(chart, 'Namespaces', {
        labels: { type: 'selected' },
        names: ['selected1', 'selected2'],
      }),
    });

    const policy = new kplus.NetworkPolicy(chart, 'Policy', { selector: pod });

    policy.addEgressRule(selected, [kplus.NetworkPolicyPort.tcp(6379)]);

    expect(Testing.synth(chart)).toMatchSnapshot();

  });

  test('can add egress to all pods', () => {

    const chart = Testing.chart();
    const pod = new kplus.Pod(chart, 'Pod', { containers: [{ image: 'pod' }] });

    const all = kplus.Pods.all(chart, 'AllPods');

    const policy = new kplus.NetworkPolicy(chart, 'Policy', { selector: pod });

    policy.addEgressRule(all, [kplus.NetworkPolicyPort.tcp(6379)]);

    expect(Testing.synth(chart)).toMatchSnapshot();

  });

  test('can add egress to managed namespace', () => {

    const chart = Testing.chart();
    const pod = new kplus.Pod(chart, 'Pod', { containers: [{ image: 'pod' }] });

    const namespace = new kplus.Namespace(chart, 'Namespace');

    const policy = new kplus.NetworkPolicy(chart, 'Policy', { selector: pod });

    policy.addEgressRule(namespace, [kplus.NetworkPolicyPort.tcp(6379)]);

    expect(Testing.synth(chart)).toMatchSnapshot();

  });

  test('can add egress to selected namespaces', () => {

    const chart = Testing.chart();
    const pod = new kplus.Pod(chart, 'Pod', { containers: [{ image: 'pod' }] });

    const namespace = kplus.Namespaces.select(chart, 'Namespaces', { labels: { type: 'selected' } });

    const policy = new kplus.NetworkPolicy(chart, 'Policy', { selector: pod });

    policy.addEgressRule(namespace, [kplus.NetworkPolicyPort.tcp(6379)]);

    expect(Testing.synth(chart)).toMatchSnapshot();

  });

  test('can add egress to all namespaces', () => {

    const chart = Testing.chart();
    const pod = new kplus.Pod(chart, 'Pod', { containers: [{ image: 'pod' }] });

    const namespaces = kplus.Namespaces.all(chart, 'AllPods');

    const policy = new kplus.NetworkPolicy(chart, 'Policy', { selector: pod });

    policy.addEgressRule(namespaces, [kplus.NetworkPolicyPort.tcp(6379)]);

    expect(Testing.synth(chart)).toMatchSnapshot();

  });


});
