import { ApiObject, Testing } from 'cdk8s';
import { Node } from 'constructs';
import * as kplus from '../src';

test('default child', () => {

  const chart = Testing.chart();
  const ds = new kplus.DaemonSet(chart, 'DaemonSet');
  const defaultChild = Node.of(ds).defaultChild as ApiObject;

  expect(defaultChild.kind).toEqual('DaemonSet');

});

test('defaults', () => {

  const chart = Testing.chart();
  new kplus.DaemonSet(chart, 'DaemonSet', {
    containers: [{ image: 'image' }],
  });

  expect(Testing.synth(chart)).toMatchSnapshot();

});

test('custom', () => {

  const chart = Testing.chart();
  new kplus.DaemonSet(chart, 'DaemonSet', {
    containers: [{ image: 'image' }],
    minReadySeconds: 5,
  });

  expect(Testing.synth(chart)).toMatchSnapshot();

});

test('a label selector is automatically allocated', () => {

  const chart = Testing.chart();

  const ds = new kplus.DaemonSet(chart, 'DaemonSet');
  ds.addContainer({ image: 'foobar' });

  const expectedValue = 'test-DaemonSet-c8f77186';
  const expectedSelector = { 'cdk8s.io/metadata.addr': expectedValue };

  // assert the k8s spec has it.
  const spec = Testing.synth(chart)[0].spec;
  expect(spec.selector.matchLabels).toEqual(expectedSelector);
  expect(spec.template.metadata?.labels).toEqual(expectedSelector);

  // assert the deployment object has it.
  expect(ds.matchLabels).toEqual(expectedSelector);

});

test('no selector is generated if "defaultSelector" is false', () => {

  const chart = Testing.chart();

  const ds = new kplus.DaemonSet(chart, 'DaemonSet', {
    select: false,
    containers: [{ image: 'foobar' }],
  });

  // assert the k8s spec doesnt have it.
  const spec = Testing.synth(chart)[0].spec;
  expect(spec.selector.matchLabels).toEqual({});

  // assert the deployment object doesnt have it.
  expect(ds.matchLabels).toEqual({});

});

test('can select by label', () => {

  const chart = Testing.chart();

  const ds = new kplus.DaemonSet(chart, 'DaemonSet', {
    containers: [{ image: 'image' }],
    select: false,
  });

  const expectedSelector = { foo: 'bar' };

  ds.select(kplus.LabelQuery.is('foo', expectedSelector.foo));

  // assert the k8s spec has it.
  const spec = Testing.synth(chart)[0].spec;
  expect(spec.selector.matchLabels).toEqual(expectedSelector);

  // assert the deployment object has it.
  expect(ds.matchLabels).toEqual(expectedSelector);

});
