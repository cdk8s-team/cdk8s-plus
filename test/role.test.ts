import { Testing, ApiObject } from 'cdk8s';
import { Node } from 'constructs';
import * as kplus from '../src';
import { ApiResource } from '../src';

describe('Role', () => {

  test('can grant permissions on imported', () => {

    const chart = Testing.chart();
    const r2 = kplus.Role.fromRoleName(chart, 'R2', 'r2');

    const role = new kplus.Role(chart, 'Role');
    role.allowRead(r2);

    expect(Testing.synth(chart)).toMatchSnapshot();

  });

  test('defaultChild', () => {

    // GIVEN
    const chart = Testing.chart();

    // WHEN
    const defaultChild = Node.of(
      new kplus.Role(chart, 'pod-reader'),
    ).defaultChild as ApiObject;

    // THEN
    expect(defaultChild.kind).toEqual('Role');

  });

  test('minimal definition', () => {

    // GIVEN
    const chart = Testing.chart();

    // WHEN
    new kplus.Role(chart, 'pod-reader');

    // THEN
    expect(Testing.synth(chart)).toMatchInlineSnapshot(`
Array [
  Object {
    "apiVersion": "rbac.authorization.k8s.io/v1",
    "kind": "Role",
    "metadata": Object {
      "name": "test-pod-reader-c8ec1643",
    },
    "rules": Array [],
  },
]
`);
  });

  test('with a custom resource rule', () => {

    // GIVEN
    const chart = Testing.chart();

    // WHEN
    const role = new kplus.Role(chart, 'pod-reader');
    role.allow(['get', 'watch', 'list'], ApiResource.custom({
      apiGroup: '',
      resourceType: 'pods',
    }));

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

  test('can be allowed read access to a pod and secret', () => {

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
    const role = new kplus.Role(chart, 'pod-reader');
    role.allowRead(pod, secret);

    // THEN
    const manifest = Testing.synth(chart);
    expect(manifest[2].rules).toEqual(expect.arrayContaining([
      {
        apiGroups: [''],
        resources: ['pods'],
        resourceNames: [pod.name],
        verbs: ['get', 'list', 'watch'],
      },
      {
        apiGroups: [''],
        resources: ['secrets'],
        resourceNames: [secret.name],
        verbs: ['get', 'list', 'watch'],
      },
    ]));

  });

  test('can be allowed read access to a mix of resources', () => {

    // GIVEN
    const chart = Testing.chart();
    const pod = new kplus.Pod(chart, 'my-pod', {
      containers: [
        {
          image: 'nginx',
        },
      ],
    });

    // WHEN
    const role = new kplus.Role(chart, 'my-role');
    role.allowRead(kplus.ApiResource.SECRETS, pod);

    // THEN
    const manifest = Testing.synth(chart);
    expect(manifest[1].rules).toEqual(expect.arrayContaining([
      {
        apiGroups: [''],
        resources: ['secrets'],
        verbs: ['get', 'list', 'watch'],
      },
      {
        apiGroups: [''],
        resources: ['pods'],
        resourceNames: ['test-my-pod-c8a0e457'],
        verbs: ['get', 'list', 'watch'],
      },
    ]));

  });

  test('specify access from props', () => {

    // GIVEN
    const chart = Testing.chart();

    // WHEN
    new kplus.Role(chart, 'my-role', {
      rules: [
        {
          verbs: ['get', 'list', 'watch'],
          resources: [kplus.ApiResource.PODS],
        },
      ],
    });

    // THEN
    const manifest = Testing.synth(chart);
    expect(manifest[0].rules).toEqual(expect.arrayContaining([
      {
        apiGroups: [''],
        resources: ['pods'],
        verbs: ['get', 'list', 'watch'],
      },
    ]));
  });

  test('giving access to a single pod and all pods still gives access to all pods', () => {

    // GIVEN
    const chart = Testing.chart();
    const pod = new kplus.Pod(chart, 'my-pod', {
      containers: [
        {
          image: 'nginx',
        },
      ],
    });

    // WHEN
    const role = new kplus.Role(chart, 'my-role');
    role.allowRead(kplus.ApiResource.PODS, pod);

    // THEN
    const manifest = Testing.synth(chart);
    expect(manifest[1].rules).toEqual(expect.arrayContaining([
      {
        apiGroups: [''],
        resources: ['pods'],
        verbs: ['get', 'list', 'watch'],
      },
    ]));
    expect(manifest[1].rules).not.toEqual([
      {
        apiGroups: [''],
        resources: ['pods'],
        resourceNames: ['test-my-pod-c8a0e457'],
        verbs: ['get', 'list', 'watch'],
      },
    ]);

  });

  test('can be allowed read access to all pods and secrets in a namespace', () => {

    // GIVEN
    const chart = Testing.chart();

    // WHEN
    const role = new kplus.Role(chart, 'pod-reader');
    role.allowRead(kplus.ApiResource.SECRETS, kplus.ApiResource.PODS);

    // THEN
    const manifest = Testing.synth(chart);
    expect(manifest[0].rules).toEqual(expect.arrayContaining([
      {
        apiGroups: [''],
        resources: ['pods'],
        verbs: ['get', 'list', 'watch'],
      },
      {
        apiGroups: [''],
        resources: ['secrets'],
        verbs: ['get', 'list', 'watch'],
      },
    ]));

  });

  test('can be allowed read access to a custom resource type', () => {

    // GIVEN
    const chart = Testing.chart();

    // WHEN
    const role = new kplus.Role(chart, 'pod-reader');
    role.allowRead(kplus.ApiResource.custom({ apiGroup: '', resourceType: 'pods/log' }));

    // THEN
    const manifest = Testing.synth(chart);
    expect(manifest[0].rules).toEqual(expect.arrayContaining([
      {
        apiGroups: [''],
        resources: ['pods/log'],
        verbs: ['get', 'list', 'watch'],
      },
    ]));

  });

  test('can be allowed access to a specific resource and a resource type', () => {

    // GIVEN
    const chart = Testing.chart();

    const pod = new kplus.Pod(chart, 'Pod', { containers: [{ image: 'image' }] });

    // WHEN
    const role = new kplus.Role(chart, 'pod-reader');
    role.allow(['get'], pod, kplus.ApiResource.PODS);

    // THEN
    const manifest = Testing.synth(chart);
    expect(manifest[1].rules).toEqual(expect.arrayContaining([
      { apiGroups: [''], resourceNames: ['test-pod-c890e1b8'], resources: ['pods'], verbs: ['get'] },
      { apiGroups: [''], resources: ['pods'], verbs: ['get'] },
    ]));

  });

});

describe('ClusterRole', () => {

  test('can grant permissions on imported', () => {

    const chart = Testing.chart();
    const r2 = kplus.ClusterRole.fromClusterRoleName(chart, 'R2', 'r2');

    const role = new kplus.Role(chart, 'Role');
    role.allowRead(r2);

    expect(Testing.synth(chart)).toMatchSnapshot();

  });

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
    "rules": Array [],
  },
]
`);

  });

  test('with a custom resource rule', () => {

    // GIVEN
    const chart = Testing.chart();

    // WHEN
    const role = new kplus.ClusterRole(chart, 'pod-reader');
    role.allow(['get', 'watch', 'list'], ApiResource.custom({
      apiGroup: '',
      resourceType: 'pods',
    }));

    // THEN
    const manifest = Testing.synth(chart);
    expect(manifest[0]?.rules).toEqual(expect.arrayContaining([
      {
        apiGroups: [''],
        resources: ['pods'],
        resourceNames: [],
        verbs: ['get', 'watch', 'list'],
      },
    ]));

  });

  test('with a custom non-resource rule', () => {

    // GIVEN
    const chart = Testing.chart();

    // WHEN
    const role = new kplus.ClusterRole(chart, 'pod-reader');
    role.allow(['get', 'post'], kplus.NonApiResource.of('/healthz'), kplus.NonApiResource.of('/healthz/*'));

    // THEN
    const manifest = Testing.synth(chart);
    expect(manifest[0]?.rules).toEqual(expect.arrayContaining([
      {
        nonResourceURLs: ['/healthz'],
        verbs: ['get', 'post'],
      },
      {
        nonResourceURLs: ['/healthz/*'],
        verbs: ['get', 'post'],
      },
    ]));

  });

  test('can be allowed read access to a pod and secret', () => {

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
    role.allowRead(pod, secret);

    const manifest = Testing.synth(chart);
    expect(manifest[2].rules).toEqual(expect.arrayContaining([
      {
        apiGroups: [''],
        resources: ['pods'],
        resourceNames: [pod.name],
        verbs: ['get', 'list', 'watch'],
      },
      {
        apiGroups: [''],
        resources: ['secrets'],
        resourceNames: [secret.name],
        verbs: ['get', 'list', 'watch'],
      },
    ]));

  });

  test('can be allowed read access to all pods and secrets in the cluster', () => {

    // GIVEN
    const chart = Testing.chart();

    // WHEN
    const role = new kplus.ClusterRole(chart, 'my-cluster-role');
    role.allowRead(kplus.ApiResource.SECRETS, kplus.ApiResource.PODS);

    const manifest = Testing.synth(chart);
    expect(manifest[0].rules).toEqual(expect.arrayContaining([
      {
        apiGroups: [''],
        resources: ['pods'],
        resourceNames: [],
        verbs: ['get', 'list', 'watch'],
      },
      {
        apiGroups: [''],
        resources: ['secrets'],
        resourceNames: [],
        verbs: ['get', 'list', 'watch'],
      },
    ]));

  });

  test('can be allowed read access to a custom resource type', () => {

    // GIVEN
    const chart = Testing.chart();

    // WHEN
    const role = new kplus.ClusterRole(chart, 'pod-reader');
    role.allowRead(kplus.ApiResource.custom({ apiGroup: '', resourceType: 'pods/log' }));

    // THEN
    const manifest = Testing.synth(chart);
    expect(manifest[0].rules).toEqual(expect.arrayContaining([
      {
        apiGroups: [''],
        resources: ['pods/log'],
        resourceNames: [],
        verbs: ['get', 'list', 'watch'],
      },
    ]));

  });

  test('can be allowed access to a specific resource, a resource type, and non resource endpoints', () => {

    // GIVEN
    const chart = Testing.chart();

    const pod = new kplus.Pod(chart, 'Pod', { containers: [{ image: 'image' }] });

    // WHEN
    const role = new kplus.ClusterRole(chart, 'pod-reader');
    role.allow(['get'], pod, kplus.ApiResource.PODS, kplus.NonApiResource.of('/healthz'));

    // THEN
    const manifest = Testing.synth(chart);
    expect(manifest[1].rules).toEqual(expect.arrayContaining([
      { apiGroups: [''], resourceNames: ['test-pod-c890e1b8'], resources: ['pods'], verbs: ['get'] },
      { apiGroups: [''], resourceNames: [], resources: ['pods'], verbs: ['get'] },
      { nonResourceURLs: ['/healthz'], verbs: ['get'] },
    ]));

  });

  test('can be aggregated', () => {

    // GIVEN
    const chart = Testing.chart();

    // WHEN
    const role1 = new kplus.ClusterRole(chart, 'pod-reader');
    role1.allow(['get', 'watch', 'list'], ApiResource.PODS);

    const role2 = new kplus.ClusterRole(chart, 'secrets-reader');
    role2.allow(['get', 'watch', 'list'], ApiResource.SECRETS);

    const combined = new kplus.ClusterRole(chart, 'combined-role');
    combined.combine(role1);
    combined.combine(role2);

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
    // add these permissions to the "admin" default role
    role.aggregate('rbac.authorization.k8s.io/aggregate-to-admin', 'true');
    role.allow(['get', 'watch', 'list'], ApiResource.SECRETS);

    // THEN
    const manifest = Testing.synth(chart);
    expect(manifest[0].aggregationRule).toMatchInlineSnapshot(`
Object {
  "clusterRoleSelectors": Array [
    Object {
      "matchLabels": Object {
        "rbac.authorization.k8s.io/aggregate-to-admin": "true",
        "rbac.authorization.k8s.io/aggregate-to-view": "true",
      },
    },
  ],
}
`);

  });

});
