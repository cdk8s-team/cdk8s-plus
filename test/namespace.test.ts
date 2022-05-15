import { Testing, ApiObject } from 'cdk8s';
import { Node } from 'constructs';
import * as kplus from '../src';

test('defaultChild', () => {

  const chart = Testing.chart();

  const defaultChild = Node.of(new kplus.Namespace(chart, 'Namespace'))
    .defaultChild as ApiObject;

  expect(defaultChild.kind).toEqual('Namespace');

});

test('can select a namespace by name', () => {
  expect(kplus.Namespace.named('web').toNamespaceLabelSelector()?._toKube()).toMatchSnapshot();
});

test('can select a namespace by labels', () => {
  expect(kplus.Namespace.queried(kplus.LabelQuery.exists('role')).toNamespaceLabelSelector()?._toKube()).toMatchSnapshot();
});

test('can select all namespaces', () => {
  expect(kplus.Namespace.all().toNamespaceLabelSelector()?._toKube()).toMatchSnapshot();
});
