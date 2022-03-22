import { Testing, ApiObject } from 'cdk8s';
import { Node } from 'constructs';
import * as kplus from '../src';

describe('Role', () => {
  test('defaultChild', () => {

    // GIVEN
    const chart = Testing.chart();

    // WHEN
    const defaultChild = Node.of(
      new kplus.Role(chart, 'my-role', {
        namespace: 'default',
      }),
    ).defaultChild as ApiObject;

    // THEN
    expect(defaultChild.kind).toEqual('Role');

  });

  test('minimal definition', () => {

    // GIVEN
    const chart = Testing.chart();

    // WHEN
    new kplus.Role(chart, 'my-role', {
      namespace: 'default',
    });

    // THEN
    expect(Testing.synth(chart)).toMatchInlineSnapshot(`
Array [
  Object {
    "apiVersion": "rbac.authorization.k8s.io/v1",
    "kind": "Role",
    "metadata": Object {
      "name": "test-my-role-c8fa903b",
      "namespace": "default",
    },
  },
]
`);
  });

  test('with a custom rule', () => {

    // GIVEN
    const chart = Testing.chart();

    // WHEN
    const role = new kplus.Role(chart, 'pod-reader', {
      namespace: 'default',
    });
    role.addRule({
      apiGroups: [''],
      resources: ['pods'],
      verbs: ['get', 'watch', 'list'],
    });

    // THEN
    const manifest = Testing.synth(chart);
    expect(manifest[0]?.rules).toEqual(expect.arrayContaining([
      {
        apiGroups: [''],
        resources: ['pods'],
        verbs: ['get', 'watch', 'list'],
      },
    ]));

  });

  test('with a custom namespace', () => {

    // GIVEN
    const chart = Testing.chart();

    // WHEN
    new kplus.Role(chart, 'pod-reader', {
      namespace: 'my-namespace',
    });

    // THEN
    const manifest = Testing.synth(chart);
    expect(manifest[0].metadata.namespace).toEqual('my-namespace');

  });

  test('can be granted read access to a pod and secret', () => {

    // GIVEN
    const chart = Testing.chart();
    const pod = new kplus.Pod(chart, 'my-pod', {
      containers: [
        {
          image: 'nginx',
        },
      ],
    });
    const secret = new kplus.Secret(chart, 'Secret', {
      stringData: {
        key: 'value',
      },
      type: 'kubernetes.io/tls',
    });

    // WHEN
    const role = new kplus.Role(chart, 'pod-reader', {
      namespace: 'default',
    });
    role.allowRead(kplus.Resources.fromObjects(pod, secret));

    // THEN
    const manifest = Testing.synth(chart);
    expect(manifest[2].rules).toEqual(expect.arrayContaining([
      {
        apiGroups: [''],
        resourceNames: [pod.name, secret.name],
        verbs: ['get', 'list', 'watch'],
      },
    ]));

  });

  test('can be granted read access to all pods and secrets in a namespace', () => {

    // GIVEN
    const chart = Testing.chart();

    // WHEN
    const role = new kplus.Role(chart, 'pod-reader', {
      namespace: 'default',
    });
    role.allowRead(kplus.Resources.fromTypes(kplus.ApiResource.SECRET, kplus.ApiResource.POD));

    // THEN
    const manifest = Testing.synth(chart);
    expect(manifest[0].rules).toEqual(expect.arrayContaining([
      {
        apiGroups: [''],
        resources: ['pods', 'secrets'],
        verbs: ['get', 'list', 'watch'],
      },
    ]));

  });

});

describe('ClusterRole', () => {

  test('defaultChild', () => {

    // GIVEN
    const chart = Testing.chart();

    // WHEN
    const defaultChild = Node.of(
      new kplus.ClusterRole(chart, 'my-cluster-role'),
    ).defaultChild as ApiObject;

    // THEN
    expect(defaultChild.kind).toEqual('ClusterRole');

  });

  test('minimal definition', () => {

    // GIVEN
    const chart = Testing.chart();

    // WHEN
    new kplus.ClusterRole(chart, 'my-cluster-role');

    // THEN
    expect(Testing.synth(chart)).toMatchInlineSnapshot(`
Array [
  Object {
    "apiVersion": "rbac.authorization.k8s.io/v1",
    "kind": "ClusterRole",
    "metadata": Object {
      "name": "test-my-cluster-role-c86cea4f",
    },
  },
]
`);

  });

  test('with a custom rule', () => {

    // GIVEN
    const chart = Testing.chart();

    // WHEN
    const role = new kplus.ClusterRole(chart, 'pod-reader');
    role.addRule({
      apiGroups: [''],
      resources: ['pods'],
      verbs: ['get', 'watch', 'list'],
    });

    // THEN
    const manifest = Testing.synth(chart);
    expect(manifest[0]?.rules).toEqual(expect.arrayContaining([
      {
        apiGroups: [''],
        resources: ['pods'],
        verbs: ['get', 'watch', 'list'],
      },
    ]));

  });

  test('can be granted read access to a pod and secret', () => {

    // GIVEN
    const chart = Testing.chart();
    const pod = new kplus.Pod(chart, 'my-pod', {
      containers: [
        {
          image: 'nginx',
        },
      ],
    });
    const secret = new kplus.Secret(chart, 'Secret', {
      stringData: {
        key: 'value',
      },
      type: 'kubernetes.io/tls',
    });

    // WHEN
    const role = new kplus.ClusterRole(chart, 'my-cluster-role');
    role.allowRead(kplus.Resources.fromObjects(pod, secret));

    const manifest = Testing.synth(chart);
    expect(manifest[2].rules).toEqual(expect.arrayContaining([
      {
        apiGroups: [''],
        resourceNames: [pod.name, secret.name],
        verbs: ['get', 'list', 'watch'],
      },
    ]));

  });

  test('can be granted read access to all pods and secrets in the cluster', () => {

    // GIVEN
    const chart = Testing.chart();

    // WHEN
    const role = new kplus.ClusterRole(chart, 'my-cluster-role');
    role.allowRead(kplus.Resources.fromTypes(kplus.ApiResource.SECRET, kplus.ApiResource.POD));

    const manifest = Testing.synth(chart);
    expect(manifest[0].rules).toEqual(expect.arrayContaining([
      {
        apiGroups: [''],
        resources: ['pods', 'secrets'],
        verbs: ['get', 'list', 'watch'],
      },
    ]));

  });

  test('can be aggregated', () => {

    // GIVEN
    const chart = Testing.chart();

    // WHEN
    const role1 = new kplus.ClusterRole(chart, 'pod-reader');
    role1.addRule({
      apiGroups: [''],
      resources: ['pods'],
      verbs: ['get', 'watch', 'list'],
    });

    const role2 = new kplus.ClusterRole(chart, 'secrets-reader');
    role2.addRule({
      apiGroups: [''],
      resources: ['secrets'],
      verbs: ['get', 'watch', 'list'],
    });

    const combined = new kplus.ClusterRole(chart, 'combined-role');
    combined.aggregateFrom(role1);
    combined.aggregateFrom(role2);

    // THEN
    const manifest = Testing.synth(chart);
    expect(manifest[0].metadata.labels).toMatchInlineSnapshot(`
Object {
  "cdk8s.cluster-role/aggregate-to-test-combined-role-c8db37c0": "true",
}
`);
    expect(manifest[1].metadata.labels).toMatchInlineSnapshot(`
Object {
  "cdk8s.cluster-role/aggregate-to-test-combined-role-c8db37c0": "true",
}
`);
    expect(manifest[2].aggregationRule).toMatchInlineSnapshot(`
Object {
  "clusterRoleSelectors": Array [
    Object {
      "matchLabels": Object {
        "cdk8s.cluster-role/aggregate-to-test-combined-role-c8db37c0": "true",
      },
    },
  ],
}
`);

  });

  test('custom aggregation labels can be added', () => {

    // GIVEN
    const chart = Testing.chart();

    // WHEN
    const role = new kplus.ClusterRole(chart, 'secrets-reader', {
      aggregationLabels: {
        // adds these permissions to the "view" default role
        'rbac.authorization.k8s.io/aggregate-to-view': 'true',
      },
    });
    role.addRule({
      apiGroups: [''],
      resources: ['secrets'],
      verbs: ['get', 'watch', 'list'],
    });

    // THEN
    const manifest = Testing.synth(chart);
    expect(manifest[0].aggregationRule).toMatchInlineSnapshot(`
Object {
  "clusterRoleSelectors": Array [
    Object {
      "matchLabels": Object {
        "rbac.authorization.k8s.io/aggregate-to-view": "true",
      },
    },
  ],
}
`);

  });

});
