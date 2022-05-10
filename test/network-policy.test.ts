import { Testing } from 'cdk8s';
import * as kplus from '../src';

test('can create a policy for a managed pod', () => {

  const chart = Testing.chart();
  const web = new kplus.Pod(chart, 'Web', {
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
  const web = kplus.Pod.all();

  new kplus.NetworkPolicy(chart, 'Policy', { selector: web });

  expect(Testing.synth(chart)).toMatchSnapshot();
});

test('can create a policy that allows all ingress by default', () => {

  const chart = Testing.chart();
  const web = kplus.Pod.all();

  new kplus.NetworkPolicy(chart, 'Policy', {
    selector: web,
    ingress: {
      default: kplus.NetworkPolicyTrafficDefault.ALLOW,
    },
  });

  expect(Testing.synth(chart)).toMatchSnapshot();

});

test('can create a policy that denies all ingress by default', () => {

  const chart = Testing.chart();
  const web = kplus.Pod.all();

  new kplus.NetworkPolicy(chart, 'Policy', {
    selector: web,
    ingress: {
      default: kplus.NetworkPolicyTrafficDefault.DENY,
    },
  });

  expect(Testing.synth(chart)).toMatchSnapshot();

});

test('can create a policy that allows all egress by default', () => {

  const chart = Testing.chart();
  const web = kplus.Pod.all();

  new kplus.NetworkPolicy(chart, 'Policy', {
    selector: web,
    egress: {
      default: kplus.NetworkPolicyTrafficDefault.ALLOW,
    },
  });

  expect(Testing.synth(chart)).toMatchSnapshot();

});

test('can create a policy that denies all egress by default', () => {

  const chart = Testing.chart();
  const web = kplus.Pod.all();

  new kplus.NetworkPolicy(chart, 'Policy', {
    selector: web,
    egress: {
      default: kplus.NetworkPolicyTrafficDefault.DENY,
    },
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

  const myproject = kplus.Pod.all().namespaced(kplus.Namespace.labeled(kplus.LabelQuery.is('project', 'myproject')));

  const policy = new kplus.NetworkPolicy(chart, 'Policy', { selector: db });

  policy.addIngressRule(kplus.Port.tcp(6379), myproject);

  expect(Testing.synth(chart)).toMatchSnapshot();

});

test('can allow egress from an ip block', () => {

  const chart = Testing.chart();
  const db = kplus.Pod.labeled(kplus.LabelQuery.is('role', 'db'));

  const ipBlock = kplus.IpBlock.ipv4('172.17.0.0/16', ['172.17.1.0/24']);

  const policy = new kplus.NetworkPolicy(chart, 'Policy', { selector: db });

  policy.addEgressRule(kplus.Port.tcp(6379), ipBlock);

  expect(Testing.synth(chart)).toMatchSnapshot();

});

test('can allow egress from a labeled pod', () => {

  const chart = Testing.chart();
  const db = kplus.Pod.labeled(kplus.LabelQuery.is('role', 'db'));

  const frontend = kplus.Pod.labeled(kplus.LabelQuery.is('role', 'frontend'));

  const policy = new kplus.NetworkPolicy(chart, 'Policy', { selector: db });

  policy.addEgressRule(kplus.Port.tcp(6379), frontend);

  expect(Testing.synth(chart)).toMatchSnapshot();

});

test('can allow egress from a namespaced labeled pod', () => {

  const chart = Testing.chart();
  const db = kplus.Pod.labeled(kplus.LabelQuery.is('role', 'db'));

  const myproject = kplus.Pod.all().namespaced(kplus.Namespace.labeled(kplus.LabelQuery.is('project', 'myproject')));

  const policy = new kplus.NetworkPolicy(chart, 'Policy', { selector: db });

  policy.addEgressRule(kplus.Port.tcp(6379), myproject);

  expect(Testing.synth(chart)).toMatchSnapshot();

});
