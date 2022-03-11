import { Testing, ApiObject } from 'cdk8s';
import { Node } from 'constructs';
import * as kplus from '../src';

describe('Role', () => {
  test('defaultChild', () => {
    // GIVEN
    const chart = Testing.chart();

    // WHEN
    const defaultChild = Node.of(
      new kplus.Role(chart, 'my-role'),
    ).defaultChild as ApiObject;

    // THEN
    expect(defaultChild.kind).toEqual('Role');
  });

  test('minimal definition', () => {
    // GIVEN
    const chart = Testing.chart();

    // WHEN
    new kplus.Role(chart, 'my-role');

    // THEN
    expect(Testing.synth(chart)).toMatchInlineSnapshot(`
Array [
  Object {
    "apiVersion": "rbac.authorization.k8s.io/v1",
    "kind": "Role",
    "metadata": Object {
      "name": "test-my-role-c8fa903b",
    },
  },
]
`);
  });

  test('with a basic rule', () => {
    // GIVEN
    const chart = Testing.chart();

    // WHEN
    const role = new kplus.Role(chart, 'pod-reader');
    role.addRule({
      apiGroups: [''],
      resources: ['pods'],
      verbs: ['get', 'watch', 'list'],
    });

    const manifest = Testing.synth(chart);
    expect(manifest[0]?.rules).toMatchInlineSnapshot(`
Array [
  Object {
    "apiGroups": Array [
      "",
    ],
    "resources": Array [
      "pods",
    ],
    "verbs": Array [
      "get",
      "watch",
      "list",
    ],
  },
]
`);
  });
});

describe('ClusterRole', () => {
  // GIVEN
  test('defaultChild', () => {
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

  test('with a basic rule', () => {
    // GIVEN
    const chart = Testing.chart();

    // WHEN
    const role = new kplus.ClusterRole(chart, 'pod-reader');
    role.addRule({
      apiGroups: [''],
      resources: ['pods'],
      verbs: ['get', 'watch', 'list'],
    });

    const manifest = Testing.synth(chart);
    expect(manifest[0]?.rules).toMatchInlineSnapshot(`
Array [
  Object {
    "apiGroups": Array [
      "",
    ],
    "resources": Array [
      "pods",
    ],
    "verbs": Array [
      "get",
      "watch",
      "list",
    ],
  },
]
`);
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
    expect(manifest).toMatchInlineSnapshot(`
Array [
  Object {
    "aggregationRule": Object {
      "clusterRoleSelectors": Array [
        Object {
          "matchLabels": Object {
            "rbac.authorization.k8s.io/aggregate-to-view": "true",
          },
        },
      ],
    },
    "apiVersion": "rbac.authorization.k8s.io/v1",
    "kind": "ClusterRole",
    "metadata": Object {
      "name": "test-secrets-reader-c8685656",
    },
    "rules": Array [
      Object {
        "apiGroups": Array [
          "",
        ],
        "resources": Array [
          "secrets",
        ],
        "verbs": Array [
          "get",
          "watch",
          "list",
        ],
      },
    ],
  },
]
`);
  });
});
