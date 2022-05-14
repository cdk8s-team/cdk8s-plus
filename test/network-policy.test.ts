import { Testing } from 'cdk8s';
import * as kplus from '../src';

describe('IpBlock |', () => {

  test('ipv4', () => {
    expect(kplus.IpBlock.ipv4('172.17.0.0/16', ['172.17.1.0/24'])._toKube()).toMatchSnapshot();
  });

  test('throws on invalid ipv4 cidr', () => {
    expect(() => kplus.IpBlock.ipv4('1234')).toThrow(/Invalid IPv4 CIDR:/);
  });

  test('ipv6', () => {
    expect(kplus.IpBlock.ipv6('2002::1234:abcd:ffff:c0a8:101/64', ['2002::1234:abcd:ffff:c0a8:101/24'])._toKube()).toMatchSnapshot();
  });

  test('throws on invalid ipv6 cidr', () => {
    expect(() => kplus.IpBlock.ipv6('1234')).toThrow(/Invalid IPv6 CIDR:/);
  });

  test('anyIpv4', () => {
    expect(kplus.IpBlock.anyIpv4()._toKube()).toMatchSnapshot();
  });

  test('anyIpv6', () => {
    expect(kplus.IpBlock.anyIpv6()._toKube()).toMatchSnapshot();
  });

});

describe('Port |', () => {

  test('tcp', () => {
    expect(kplus.Port.tcp(8080)._toKube()).toMatchSnapshot();
  });

  test('tcpRange', () => {
    expect(kplus.Port.tcpRange(8080, 8085)._toKube()).toMatchSnapshot();
  });

  test('allTcp', () => {
    expect(kplus.Port.allTcp()._toKube()).toMatchSnapshot();
  });

  test('udp', () => {
    expect(kplus.Port.udp(8080)._toKube()).toMatchSnapshot();
  });

  test('udpRange', () => {
    expect(kplus.Port.udpRange(8080, 8085)._toKube()).toMatchSnapshot();
  });

  test('allUcp', () => {
    expect(kplus.Port.allUdp()._toKube()).toMatchSnapshot();
  });

  test('of', () => {
    expect(kplus.Port.of({ port: 5050, endPort: 5500, protocol: kplus.NetworkProtocol.SCTP }));
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


  test('can create a policy for a labeled pod', () => {

    const chart = Testing.chart();
    const web = kplus.Pod.labeled(kplus.LabelQuery.is('app', 'web'));

    new kplus.NetworkPolicy(chart, 'Policy', { selector: web });

    expect(Testing.synth(chart)).toMatchSnapshot();
  });


  test('can create a policy for all pods', () => {

    const chart = Testing.chart();

    new kplus.NetworkPolicy(chart, 'Policy1');
    new kplus.NetworkPolicy(chart, 'Policy2', { selector: kplus.Pod.all() });

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

  test('can allow ingress from an ip block', () => {

    const chart = Testing.chart();
    const db = kplus.Pod.labeled(kplus.LabelQuery.is('role', 'db'));

    const ipBlock = kplus.IpBlock.ipv4('172.17.0.0/16', ['172.17.1.0/24']);

    const policy = new kplus.NetworkPolicy(chart, 'Policy', { selector: db });

    policy.allowFrom(ipBlock, { ports: [kplus.Port.tcp(6379)] });

    expect(Testing.synth(chart)).toMatchSnapshot();

  });

  test('can allow ingress from a managed pod', () => {

    const chart = Testing.chart();
    const db = kplus.Pod.labeled(kplus.LabelQuery.is('role', 'db'));
    const web = new kplus.Pod(chart, 'Web', { containers: [{ image: 'webs' }] });

    const policy = new kplus.NetworkPolicy(chart, 'Policy', { selector: db });

    policy.allowFrom(web, { ports: [kplus.Port.tcp(6379)] });

    expect(Testing.synth(chart)).toMatchSnapshot();

  });

  test('can allow ingress from a labeled pod', () => {

    const chart = Testing.chart();
    const db = kplus.Pod.labeled(kplus.LabelQuery.is('role', 'db'));

    const frontend = kplus.Pod.labeled(kplus.LabelQuery.is('role', 'frontend'));

    const policy = new kplus.NetworkPolicy(chart, 'Policy', { selector: db });

    policy.allowFrom(frontend, { ports: [kplus.Port.tcp(6379)] });

    expect(Testing.synth(chart)).toMatchSnapshot();

  });

  test('can allow ingress from a namespaced labeled pod', () => {

    const chart = Testing.chart();
    const db = kplus.Pod.labeled(kplus.LabelQuery.is('role', 'db'));

    const frontend = kplus.Pod.labeled(kplus.LabelQuery.is('role', 'web'))
      .namespaced(kplus.Namespace.labeled(kplus.LabelQuery.is('project', 'myproject')));

    const policy = new kplus.NetworkPolicy(chart, 'Policy', { selector: db });

    policy.allowFrom(frontend, { ports: [kplus.Port.tcp(6379)] });

    expect(Testing.synth(chart)).toMatchSnapshot();

  });

  test('can allow ingress from all pods', () => {

    const chart = Testing.chart();
    const db = kplus.Pod.labeled(kplus.LabelQuery.is('role', 'db'));

    const all = kplus.Pod.all();

    const policy = new kplus.NetworkPolicy(chart, 'Policy', { selector: db });

    policy.allowFrom(all, { ports: [kplus.Port.tcp(6379)] });

    expect(Testing.synth(chart)).toMatchSnapshot();

  });

  test('can allow ingress from managed namespace', () => {

    const chart = Testing.chart();
    const db = kplus.Pod.labeled(kplus.LabelQuery.is('role', 'db'));

    const namespace = new kplus.Namespace(chart, 'Namespace');

    const policy = new kplus.NetworkPolicy(chart, 'Policy', { selector: db });

    policy.allowFrom(namespace, { ports: [kplus.Port.tcp(6379)] });

    expect(Testing.synth(chart)).toMatchSnapshot();

  });

  test('can allow ingress from labeled namespace', () => {

    const chart = Testing.chart();
    const db = kplus.Pod.labeled(kplus.LabelQuery.is('role', 'db'));

    const namespace = kplus.Namespace.labeled(kplus.LabelQuery.is('role', 'web'));

    const policy = new kplus.NetworkPolicy(chart, 'Policy', { selector: db });

    policy.allowFrom(namespace, { ports: [kplus.Port.tcp(6379)] });

    expect(Testing.synth(chart)).toMatchSnapshot();

  });

  test('can allow ingress from named namespace', () => {

    const chart = Testing.chart();
    const db = kplus.Pod.labeled(kplus.LabelQuery.is('role', 'db'));

    const namespace = kplus.Namespace.named('web');

    const policy = new kplus.NetworkPolicy(chart, 'Policy', { selector: db });

    policy.allowFrom(namespace, { ports: [kplus.Port.tcp(6379)] });

    expect(Testing.synth(chart)).toMatchSnapshot();

  });

  test('can allow ingress from all namespaces', () => {

    const chart = Testing.chart();
    const db = kplus.Pod.labeled(kplus.LabelQuery.is('role', 'db'));

    const namespaces = kplus.Namespace.all();

    const policy = new kplus.NetworkPolicy(chart, 'Policy', { selector: db });

    policy.allowFrom(namespaces, { ports: [kplus.Port.tcp(6379)] });

    expect(Testing.synth(chart)).toMatchSnapshot();

  });

  test('can allow egress to an ip block', () => {

    const chart = Testing.chart();
    const db = kplus.Pod.labeled(kplus.LabelQuery.is('role', 'db'));

    const ipBlock = kplus.IpBlock.ipv4('172.17.0.0/16', ['172.17.1.0/24']);

    const policy = new kplus.NetworkPolicy(chart, 'Policy', { selector: db });

    policy.allowTo(ipBlock, { ports: [kplus.Port.tcp(6379)] });

    expect(Testing.synth(chart)).toMatchSnapshot();

  });

  test('can allow egress to a managed pod', () => {

    const chart = Testing.chart();
    const web = kplus.Pod.labeled(kplus.LabelQuery.is('app', 'web'));
    const db = new kplus.Pod(chart, 'db', { containers: [{ image: 'db' }] });

    const policy = new kplus.NetworkPolicy(chart, 'Policy', { selector: web });

    policy.allowTo(db, { ports: [kplus.Port.tcp(6379)] });

    expect(Testing.synth(chart)).toMatchSnapshot();

  });

  test('can allow egress to a labeled pod', () => {

    const chart = Testing.chart();
    const frontend = kplus.Pod.labeled(kplus.LabelQuery.is('role', 'frontend'));

    const db = kplus.Pod.labeled(kplus.LabelQuery.is('role', 'db'));

    const policy = new kplus.NetworkPolicy(chart, 'Policy', { selector: frontend });

    policy.allowTo(db, { ports: [kplus.Port.tcp(6379)] });

    expect(Testing.synth(chart)).toMatchSnapshot();

  });

  test('can allow egress to a namespaced labeled pod', () => {

    const chart = Testing.chart();
    const frontend = kplus.Pod.labeled(kplus.LabelQuery.is('role', 'frontend'));

    const db = kplus.Pod.labeled(kplus.LabelQuery.is('role', 'db'))
      .namespaced(kplus.Namespace.labeled(kplus.LabelQuery.is('project', 'myproject')));

    const policy = new kplus.NetworkPolicy(chart, 'Policy', { selector: frontend });

    policy.allowTo(db, { ports: [kplus.Port.tcp(6379)] });

    expect(Testing.synth(chart)).toMatchSnapshot();

  });

  test('can allow egress to all pods', () => {

    const chart = Testing.chart();
    const db = kplus.Pod.labeled(kplus.LabelQuery.is('role', 'db'));

    const all = kplus.Pod.all();

    const policy = new kplus.NetworkPolicy(chart, 'Policy', { selector: db });

    policy.allowTo(all, { ports: [kplus.Port.tcp(6379)] });

    expect(Testing.synth(chart)).toMatchSnapshot();

  });

  test('can allow egress to managed namespace', () => {

    const chart = Testing.chart();
    const db = kplus.Pod.labeled(kplus.LabelQuery.is('role', 'db'));

    const namespace = new kplus.Namespace(chart, 'Namespace');

    const policy = new kplus.NetworkPolicy(chart, 'Policy', { selector: db });

    policy.allowTo(namespace, { ports: [kplus.Port.tcp(6379)] });

    expect(Testing.synth(chart)).toMatchSnapshot();

  });

  test('can allow egress to labeled namespace', () => {

    const chart = Testing.chart();
    const db = kplus.Pod.labeled(kplus.LabelQuery.is('role', 'db'));

    const namespace = kplus.Namespace.labeled(kplus.LabelQuery.is('role', 'web'));

    const policy = new kplus.NetworkPolicy(chart, 'Policy', { selector: db });

    policy.allowTo(namespace, { ports: [kplus.Port.tcp(6379)] });

    expect(Testing.synth(chart)).toMatchSnapshot();

  });

  test('can allow egress to named namespace', () => {

    const chart = Testing.chart();
    const db = kplus.Pod.labeled(kplus.LabelQuery.is('role', 'db'));

    const namespace = kplus.Namespace.named('web');

    const policy = new kplus.NetworkPolicy(chart, 'Policy', { selector: db });

    policy.allowTo(namespace, { ports: [kplus.Port.tcp(6379)] });

    expect(Testing.synth(chart)).toMatchSnapshot();

  });

  test('can allow egress to all namespaces', () => {

    const chart = Testing.chart();
    const db = kplus.Pod.labeled(kplus.LabelQuery.is('role', 'db'));

    const namespaces = kplus.Namespace.all();

    const policy = new kplus.NetworkPolicy(chart, 'Policy', { selector: db });

    policy.allowTo(namespaces, { ports: [kplus.Port.tcp(6379)] });

    expect(Testing.synth(chart)).toMatchSnapshot();

  });

  test('ports default to pod container ports on ingress', () => {

    const chart = Testing.chart();
    const web = new kplus.Pod(chart, 'Web', {
      containers: [{ image: 'web' }],
    });

    const redis = new kplus.Pod(chart, 'Redis', {
      containers: [{ image: 'redis', port: 6379 }],
    });

    const policy = new kplus.NetworkPolicy(chart, 'Policy', { selector: redis });

    policy.allowFrom(web);

    expect(Testing.synth(chart)).toMatchSnapshot();

  });

  test('ports default to peer container ports on egress', () => {

    const chart = Testing.chart();
    const web = new kplus.Pod(chart, 'Web', {
      containers: [{ image: 'web' }],
    });

    const redis = new kplus.Pod(chart, 'Redis', {
      containers: [{ image: 'redis', port: 6379 }],
    });

    const policy = new kplus.NetworkPolicy(chart, 'Policy', { selector: web });

    policy.allowTo(redis);

    expect(Testing.synth(chart)).toMatchSnapshot();

  });

});
