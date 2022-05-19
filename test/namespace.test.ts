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

test('can select namespaces by name', () => {
  const namespaces = kplus.Namespaces.select({ names: ['web'] });
  expect(namespaces.toNamespaceNames()).toEqual(['web']);
  expect(namespaces.toNamespaceLabelSelector()?._toKube()).toMatchSnapshot();
});

test('can select namespaces by labels and selectors', () => {
  const namespaces = kplus.Namespaces.select({
    labels: { team: 'backoffice' },
    selectors: [kplus.LabelQuery.exists('role')],
  });
  expect(namespaces.toNamespaceNames()).toBeUndefined();
  expect(namespaces.toNamespaceLabelSelector()?._toKube()).toMatchSnapshot();
});

test('can select namespaces by labels and selectors and names', () => {
  const namespaces = kplus.Namespaces.select({
    labels: { team: 'backoffice' },
    selectors: [kplus.LabelQuery.exists('role')],
    names: ['web'],
  });
  expect(namespaces.toNamespaceNames()).toEqual(['web']);
  expect(namespaces.toNamespaceLabelSelector()?._toKube()).toMatchSnapshot();
});

test('can select all namespaces', () => {
  const namespaces = kplus.Namespaces.all();
  expect(namespaces.toNamespaceLabelSelector()?._toKube()).toMatchSnapshot();
  expect(namespaces.toNamespaceNames()).toBeUndefined();
});
