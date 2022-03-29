import { Testing, ApiObject } from 'cdk8s';
import { Node } from 'constructs';
import * as kplus from '../src';

test('defaultChild', () => {
  const chart = Testing.chart();

  const defaultChild = Node.of(new kplus.Secret(chart, 'Secret'))
    .defaultChild as ApiObject;

  expect(defaultChild.kind).toEqual('Secret');
});

test('Can be imported from secret name', () => {
  const secret = kplus.Secret.fromSecretName('secret');

  expect(secret.name).toEqual('secret');
});

test('Can create a new secret', () => {
  const chart = Testing.chart();

  new kplus.Secret(chart, 'Secret', {
    stringData: {
      key: 'value',
    },
    type: 'kubernetes.io/tls',
  });

  expect(Testing.synth(chart)).toMatchInlineSnapshot(`
    Array [
      Object {
        "apiVersion": "v1",
        "kind": "Secret",
        "metadata": Object {
          "name": "test-secret-c837fa76",
        },
        "stringData": Object {
          "key": "value",
        },
        "type": "kubernetes.io/tls",
      },
    ]
  `);
});

test('Can add data to new secrets', () => {
  const chart = Testing.chart();

  const secret = new kplus.Secret(chart, 'Secret');
  secret.addStringData('key', 'value');

  expect(Testing.synth(chart)).toMatchInlineSnapshot(`
Array [
  Object {
    "apiVersion": "v1",
    "kind": "Secret",
    "metadata": Object {
      "name": "test-secret-c837fa76",
    },
    "stringData": Object {
      "key": "value",
    },
  },
]
`);
});

test('Can create a basic auth secret', () => {
  const chart = Testing.chart();

  new kplus.BasicAuthSecret(chart, 'BasicAuthSecret', {
    username: 'admin',
    password: 't0p-Secret',
  });

  expect(Testing.synth(chart)).toMatchInlineSnapshot(`
Array [
  Object {
    "apiVersion": "v1",
    "kind": "Secret",
    "metadata": Object {
      "name": "test-basicauthsecret-c82606a8",
    },
    "stringData": Object {
      "password": "t0p-Secret",
      "username": "admin",
    },
    "type": "kubernetes.io/basic-auth",
  },
]
`);
});

test('Can create an ssh auth secret', () => {
  const chart = Testing.chart();

  new kplus.SshAuthSecret(chart, 'SshAuthSecret', {
    sshPrivateKey: 'fake-private-key',
  });

  expect(Testing.synth(chart)).toMatchInlineSnapshot(`
Array [
  Object {
    "apiVersion": "v1",
    "kind": "Secret",
    "metadata": Object {
      "name": "test-sshauthsecret-c8356ec6",
    },
    "stringData": Object {
      "ssh-privatekey": "fake-private-key",
    },
    "type": "kubernetes.io/ssh-auth",
  },
]
`);
});

test('Can create a service account token secret', () => {
  const chart = Testing.chart();

  const sa = new kplus.ServiceAccount(chart, 'ServiceAccount');
  const secret = new kplus.ServiceAccountTokenSecret(chart, 'ServiceAccountToken', {
    serviceAccount: sa,
  });
  secret.addStringData('extra', 'foo');

  // the "token" key in "data" should be automatically filled in by a
  // Kubernetes controller
  expect(Testing.synth(chart)).toMatchInlineSnapshot(`
Array [
  Object {
    "apiVersion": "v1",
    "kind": "ServiceAccount",
    "metadata": Object {
      "name": "test-serviceaccount-c8f15383",
    },
  },
  Object {
    "apiVersion": "v1",
    "kind": "Secret",
    "metadata": Object {
      "annotations": Object {
        "kubernetes.io/service-account.name": "test-serviceaccount-c8f15383",
      },
      "name": "test-serviceaccounttoken-c8eca6af",
    },
    "stringData": Object {
      "extra": "foo",
    },
    "type": "kubernetes.io/service-account-token",
  },
]
`);
});

test('Can create a TLS secret', () => {
  const chart = Testing.chart();

  new kplus.TlsSecret(chart, 'TlsSecret', {
    tlsCert: 'tls-cert-value',
    tlsKey: 'tls-key-value',
  });

  expect(Testing.synth(chart)).toMatchInlineSnapshot(`
Array [
  Object {
    "apiVersion": "v1",
    "kind": "Secret",
    "metadata": Object {
      "name": "test-tlssecret-c8c8af35",
    },
    "stringData": Object {
      "tls.crt": "tls-cert-value",
      "tls.key": "tls-key-value",
    },
    "type": "kubernetes.io/tls",
  },
]
`);
});

test('Can create a Docker config secret', () => {
  const chart = Testing.chart();

  new kplus.DockerConfigSecret(chart, 'DockerConfigSecret', {
    data: {
      auths: {
        'hub.xxx.com': {
          username: 'xxx',
          password: 'xxx',
          email: 'xxx',
          auth: 'xxx',
        },
      },
    },
  });

  expect(Testing.synth(chart)).toMatchInlineSnapshot(`
Array [
  Object {
    "apiVersion": "v1",
    "kind": "Secret",
    "metadata": Object {
      "name": "test-dockerconfigsecret-c8b65039",
    },
    "stringData": Object {
      ".dockerconfigjson": "{\\"auths\\":{\\"hub.xxx.com\\":{\\"username\\":\\"xxx\\",\\"password\\":\\"xxx\\",\\"email\\":\\"xxx\\",\\"auth\\":\\"xxx\\"}}}",
    },
    "type": "kubernetes.io/dockerconfigjson",
  },
]
`);
});
