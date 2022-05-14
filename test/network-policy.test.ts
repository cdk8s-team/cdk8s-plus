import { Testing } from 'cdk8s';
import * as kplus from '../src';

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

    policy.addIngressRule(kplus.Port.tcp(6379), ipBlock);

    expect(Testing.synth(chart)).toMatchSnapshot();

  });

  test('can allow ingress from a managed pod', () => {

    const chart = Testing.chart();
    const db = kplus.Pod.labeled(kplus.LabelQuery.is('role', 'db'));
    const web = new kplus.Pod(chart, 'Web', { containers: [{ image: 'webs' }] });

    const policy = new kplus.NetworkPolicy(chart, 'Policy', { selector: db });

    policy.addIngressRule(kplus.Port.tcp(6379), web);

    expect(Testing.synth(chart)).toMatchSnapshot();

  });

  test('can allow ingress from a labeled pod', () => {

    const chart = Testing.chart();
    const db = kplus.Pod.labeled(kplus.LabelQuery.is('role', 'db'));

    const frontend = kplus.Pod.labeled(kplus.LabelQuery.is('role', 'frontend'));

    const policy = new kplus.NetworkPolicy(chart, 'Policy', { selector: db });

    policy.addIngressRule(kplus.Port.tcp(6379), frontend);

    expect(Testing.synth(chart)).toMatchSnapshot();

  });

  test('can allow ingress from a namespaced labeled pod', () => {

    const chart = Testing.chart();
    const db = kplus.Pod.labeled(kplus.LabelQuery.is('role', 'db'));

    const frontend = kplus.Pod.labeled(kplus.LabelQuery.is('role', 'web'))
      .namespaced(kplus.Namespace.labeled(kplus.LabelQuery.is('project', 'myproject')));

    const policy = new kplus.NetworkPolicy(chart, 'Policy', { selector: db });

    policy.addIngressRule(kplus.Port.tcp(6379), frontend);

    expect(Testing.synth(chart)).toMatchSnapshot();

  });

  test('can allow ingress from all pods', () => {

    const chart = Testing.chart();
    const db = kplus.Pod.labeled(kplus.LabelQuery.is('role', 'db'));

    const all = kplus.Pod.all();

    const policy = new kplus.NetworkPolicy(chart, 'Policy', { selector: db });

    policy.addIngressRule(kplus.Port.tcp(6379), all);

    expect(Testing.synth(chart)).toMatchSnapshot();

  });

  test('can allow ingress from managed namespace', () => {

    const chart = Testing.chart();
    const db = kplus.Pod.labeled(kplus.LabelQuery.is('role', 'db'));

    const namespace = new kplus.Namespace(chart, 'Namespace');

    const policy = new kplus.NetworkPolicy(chart, 'Policy', { selector: db });

    policy.addIngressRule(kplus.Port.tcp(6379), namespace);

    expect(Testing.synth(chart)).toMatchSnapshot();

  });

  test('can allow ingress from labeled namespace', () => {

    const chart = Testing.chart();
    const db = kplus.Pod.labeled(kplus.LabelQuery.is('role', 'db'));

    const namespace = kplus.Namespace.labeled(kplus.LabelQuery.is('role', 'web'));

    const policy = new kplus.NetworkPolicy(chart, 'Policy', { selector: db });

    policy.addIngressRule(kplus.Port.tcp(6379), namespace);

    expect(Testing.synth(chart)).toMatchSnapshot();

  });

  test('can allow ingress from named namespace', () => {

    const chart = Testing.chart();
    const db = kplus.Pod.labeled(kplus.LabelQuery.is('role', 'db'));

    const namespace = kplus.Namespace.named('web');

    const policy = new kplus.NetworkPolicy(chart, 'Policy', { selector: db });

    policy.addIngressRule(kplus.Port.tcp(6379), namespace);

    expect(Testing.synth(chart)).toMatchSnapshot();

  });

  test('can allow ingress from all namespaces', () => {

    const chart = Testing.chart();
    const db = kplus.Pod.labeled(kplus.LabelQuery.is('role', 'db'));

    const namespaces = kplus.Namespace.all();

    const policy = new kplus.NetworkPolicy(chart, 'Policy', { selector: db });

    policy.addIngressRule(kplus.Port.tcp(6379), namespaces);

    expect(Testing.synth(chart)).toMatchSnapshot();

  });

  test('can allow egress to an ip block', () => {

    const chart = Testing.chart();
    const db = kplus.Pod.labeled(kplus.LabelQuery.is('role', 'db'));

    const ipBlock = kplus.IpBlock.ipv4('172.17.0.0/16', ['172.17.1.0/24']);

    const policy = new kplus.NetworkPolicy(chart, 'Policy', { selector: db });

    policy.addEgressRule(kplus.Port.tcp(6379), ipBlock);

    expect(Testing.synth(chart)).toMatchSnapshot();

  });

  test('can allow egress to a managed pod', () => {

    const chart = Testing.chart();
    const web = kplus.Pod.labeled(kplus.LabelQuery.is('app', 'web'));
    const db = new kplus.Pod(chart, 'db', { containers: [{ image: 'db' }] });

    const policy = new kplus.NetworkPolicy(chart, 'Policy', { selector: web });

    policy.addEgressRule(kplus.Port.tcp(6379), db);

    expect(Testing.synth(chart)).toMatchSnapshot();

  });

  test('can allow egress to a labeled pod', () => {

    const chart = Testing.chart();
    const frontend = kplus.Pod.labeled(kplus.LabelQuery.is('role', 'frontend'));

    const db = kplus.Pod.labeled(kplus.LabelQuery.is('role', 'db'));

    const policy = new kplus.NetworkPolicy(chart, 'Policy', { selector: frontend });

    policy.addEgressRule(kplus.Port.tcp(6379), db);

    expect(Testing.synth(chart)).toMatchSnapshot();

  });

  test('can allow egress to a namespaced labeled pod', () => {

    const chart = Testing.chart();
    const frontend = kplus.Pod.labeled(kplus.LabelQuery.is('role', 'frontend'));

    const db = kplus.Pod.labeled(kplus.LabelQuery.is('role', 'db'))
      .namespaced(kplus.Namespace.labeled(kplus.LabelQuery.is('project', 'myproject')));

    const policy = new kplus.NetworkPolicy(chart, 'Policy', { selector: frontend });

    policy.addEgressRule(kplus.Port.tcp(6379), db);

    expect(Testing.synth(chart)).toMatchSnapshot();

  });

  test('can allow egress to all pods', () => {

    const chart = Testing.chart();
    const db = kplus.Pod.labeled(kplus.LabelQuery.is('role', 'db'));

    const all = kplus.Pod.all();

    const policy = new kplus.NetworkPolicy(chart, 'Policy', { selector: db });

    policy.addEgressRule(kplus.Port.tcp(6379), all);

    expect(Testing.synth(chart)).toMatchSnapshot();

  });

  test('can allow egress to managed namespace', () => {

    const chart = Testing.chart();
    const db = kplus.Pod.labeled(kplus.LabelQuery.is('role', 'db'));

    const namespace = new kplus.Namespace(chart, 'Namespace');

    const policy = new kplus.NetworkPolicy(chart, 'Policy', { selector: db });

    policy.addEgressRule(kplus.Port.tcp(6379), namespace);

    expect(Testing.synth(chart)).toMatchSnapshot();

  });

  test('can allow egress to labeled namespace', () => {

    const chart = Testing.chart();
    const db = kplus.Pod.labeled(kplus.LabelQuery.is('role', 'db'));

    const namespace = kplus.Namespace.labeled(kplus.LabelQuery.is('role', 'web'));

    const policy = new kplus.NetworkPolicy(chart, 'Policy', { selector: db });

    policy.addEgressRule(kplus.Port.tcp(6379), namespace);

    expect(Testing.synth(chart)).toMatchSnapshot();

  });

  test('can allow egress to named namespace', () => {

    const chart = Testing.chart();
    const db = kplus.Pod.labeled(kplus.LabelQuery.is('role', 'db'));

    const namespace = kplus.Namespace.named('web');

    const policy = new kplus.NetworkPolicy(chart, 'Policy', { selector: db });

    policy.addEgressRule(kplus.Port.tcp(6379), namespace);

    expect(Testing.synth(chart)).toMatchSnapshot();

  });

  test('can allow egress to all namespaces', () => {

    const chart = Testing.chart();
    const db = kplus.Pod.labeled(kplus.LabelQuery.is('role', 'db'));

    const namespaces = kplus.Namespace.all();

    const policy = new kplus.NetworkPolicy(chart, 'Policy', { selector: db });

    policy.addEgressRule(kplus.Port.tcp(6379), namespaces);

    expect(Testing.synth(chart)).toMatchSnapshot();

  });

});
