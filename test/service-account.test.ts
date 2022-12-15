import { Testing, ApiObject } from 'cdk8s';
import { Node } from 'constructs';
import * as kplus from '../src';

test('can grant permissions on imported', () => {

  const chart = Testing.chart();
  const sa = kplus.ServiceAccount.fromServiceAccountName(chart, 'ServiceAccount', 'service-account');

  const role = new kplus.Role(chart, 'Role');
  role.allowRead(sa);

  expect(Testing.synth(chart)).toMatchSnapshot();

});

test('defaultChild', () => {
  const chart = Testing.chart();

  const defaultChild = Node.of(
    new kplus.ServiceAccount(chart, 'ServiceAccount'),
  ).defaultChild as ApiObject;

  expect(defaultChild.kind).toEqual('ServiceAccount');
});

test('minimal definition', () => {
  // GIVEN
  const chart = Testing.chart();

  // WHEN
  const sa = new kplus.ServiceAccount(chart, 'my-service-account');

  // THEN
  expect(sa.automountToken).toBeFalsy();
  expect(Testing.synth(chart)).toMatchInlineSnapshot(`
Array [
  Object {
    "apiVersion": "v1",
    "automountServiceAccountToken": false,
    "kind": "ServiceAccount",
    "metadata": Object {
      "name": "test-my-service-account-c84bb46b",
    },
  },
]
`);
});

test('secrets can be added to the service account', () => {
  // GIVEN
  const chart = Testing.chart();
  const secret1 = kplus.Secret.fromSecretName(chart, 'Secret1', 'my-secret-1');
  const secret2 = kplus.Secret.fromSecretName(chart, 'Secret2', 'my-secret-2');

  // WHEN
  const sa = new kplus.ServiceAccount(chart, 'my-service-account', {
    secrets: [secret1],
  });

  sa.addSecret(secret2);

  // THEN
  const manifest = Testing.synth(chart);
  expect(manifest[0]?.secrets[0]).toStrictEqual({ name: 'my-secret-1' });
  expect(manifest[0]?.secrets[1]).toStrictEqual({ name: 'my-secret-2' });
});

test('auto mounting token can be disabled', () => {

  const chart = Testing.chart();
  const sa = new kplus.ServiceAccount(chart, 'my-service-account', {
    automountToken: false,
  });

  expect(sa.automountToken).toBeFalsy();
  expect(Testing.synth(chart)).toMatchInlineSnapshot(`
    Array [
      Object {
        "apiVersion": "v1",
        "automountServiceAccountToken": false,
        "kind": "ServiceAccount",
        "metadata": Object {
          "name": "test-my-service-account-c84bb46b",
        },
      },
    ]
  `);

});