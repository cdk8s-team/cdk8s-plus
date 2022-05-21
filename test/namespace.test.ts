import { Testing, ApiObject } from 'cdk8s';
import { Node } from 'constructs';
import * as kplus from '../src';

test('defaultChild', () => {

  const chart = Testing.chart();

  const defaultChild = Node.of(new kplus.Namespace(chart, 'Namespace'))
    .defaultChild as ApiObject;

  expect(defaultChild.kind).toEqual('Namespace');

});

test('defaults', () => {

  const chart = Testing.chart();

  new kplus.Namespace(chart, 'Namespace');

  expect(Testing.synth(chart)).toMatchSnapshot();
});

test('can select namespaces', () => {
  const namespaces = kplus.Namespaces.select({
    labels: { foo: 'bar' },
    expressions: [kplus.LabelExpression.exists('web')],
    names: ['web'],
  });
  expect(namespaces.toNamespaceSelectorConfig().names).toEqual(['web']);
  expect(namespaces.toNamespaceSelectorConfig()?.labelSelector?._toKube()).toMatchSnapshot();
});

test('can select all namespaces', () => {
  const namespaces = kplus.Namespaces.all();
  expect(namespaces.toNamespaceSelectorConfig().names).toBeUndefined();
  expect(namespaces.toNamespaceSelectorConfig()?.labelSelector?._toKube()).toMatchSnapshot();
});
