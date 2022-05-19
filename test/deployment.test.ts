import { Testing, ApiObject, Duration } from 'cdk8s';
import { Node } from 'constructs';
import * as kplus from '../src';
import { DeploymentStrategy, PercentOrAbsolute } from '../src';
import * as k8s from '../src/imports/k8s';

test('defaultChild', () => {

  const chart = Testing.chart();

  const defaultChild = Node.of(new kplus.Deployment(chart, 'Deployment')).defaultChild as ApiObject;

  expect(defaultChild.kind).toEqual('Deployment');

});

test('A label selector is automatically allocated', () => {

  const chart = Testing.chart();

  const deployment = new kplus.Deployment(chart, 'Deployment');
  deployment.addContainer({ image: 'foobar' });

  const expectedValue = 'test-Deployment-c83f5e59';
  const expectedSelector = { 'cdk8s.io/metadata.addr': expectedValue };

  // assert the k8s spec has it.
  const spec = Testing.synth(chart)[0].spec;
  expect(spec.selector.matchLabels).toEqual(expectedSelector);
  expect(spec.template.metadata?.labels).toEqual(expectedSelector);

  // assert the deployment object has it.
  expect(deployment.matchLabels).toEqual(expectedSelector);

});

test('No selector is generated if "select" is false', () => {

  const chart = Testing.chart();

  const deployment = new kplus.Deployment(chart, 'Deployment', {
    select: false,
    containers: [{ image: 'foobar' }],
  });

  // assert the k8s spec doesnt have it.
  const spec = Testing.synth(chart)[0].spec;
  expect(spec.selector.matchLabels).toBeUndefined();

  // assert the deployment object doesnt have it.
  expect(deployment.matchLabels).toEqual({});

});

test('Can select by label', () => {

  const chart = Testing.chart();

  const deployment = new kplus.Deployment(chart, 'Deployment', {
    containers: [
      {
        image: 'image',
      },
    ],
    select: false,
  });

  const expectedSelector = { foo: 'bar' };

  deployment.select(kplus.LabelQuery.is('foo', expectedSelector.foo));

  // assert the k8s spec has it.
  const spec = Testing.synth(chart)[0].spec;
  expect(spec.selector.matchLabels).toEqual(expectedSelector);

  // assert the deployment object has it.
  expect(deployment.matchLabels).toEqual(expectedSelector);

});

test('Can be exposed as via service', () => {

  const chart = Testing.chart();

  const deployment = new kplus.Deployment(chart, 'Deployment', {
    containers: [
      {
        image: 'image',
        port: 9300,
      },
    ],
  });

  deployment.exposeViaService({ port: 9200, serviceType: kplus.ServiceType.LOAD_BALANCER });

  const spec = Testing.synth(chart)[1].spec;
  expect(spec.type).toEqual('LoadBalancer');
  expect(spec.selector).toEqual({ 'cdk8s.io/metadata.addr': 'test-Deployment-c83f5e59' });
  expect(spec.ports![0].port).toEqual(9200);
  expect(spec.ports![0].targetPort).toEqual(9300);

});

test('Can be exposed as via ingress', () => {

  const chart = Testing.chart();

  const deployment = new kplus.Deployment(chart, 'Deployment', {
    containers: [
      {
        image: 'image',
        port: 9300,
      },
    ],
  });

  deployment.exposeViaIngress('/hello');

  expect(Testing.synth(chart)).toMatchSnapshot();
});

test('Expose uses the correct default values', () => {

  const chart = Testing.chart();

  const deployment = new kplus.Deployment(chart, 'Deployment', {
    containers: [
      {
        image: 'image',
        port: 9300,
      },
    ],
  });

  deployment.exposeViaService();

  const spec = Testing.synth(chart)[1].spec;
  expect(spec.type).toEqual('ClusterIP');
  expect(spec.ports![0].targetPort).toEqual(9300);
  expect(spec.ports![0].port).toEqual(9300);

});

test('Expose can set service and port details', () => {
  const chart = Testing.chart();

  const deployment = new kplus.Deployment(chart, 'Deployment', {
    containers: [
      {
        image: 'image',
        port: 9300,
      },
    ],
  });

  deployment.exposeViaService({
    port: 9200,
    name: 'test-srv',
    serviceType: kplus.ServiceType.CLUSTER_IP,
    protocol: kplus.Protocol.UDP,
    targetPort: 9500,
  });

  const srv = Testing.synth(chart)[1];
  const spec = srv.spec;

  expect(srv.metadata.name).toEqual('test-srv');
  expect(spec.type).toEqual('ClusterIP');
  expect(spec.selector).toEqual({
    'cdk8s.io/metadata.addr': 'test-Deployment-c83f5e59',
  });
  expect(spec.ports![0].port).toEqual(9200);
  expect(spec.ports![0].targetPort).toEqual(9500);
  expect(spec.ports![0].protocol).toEqual('UDP');
});


test('Cannot be exposed if there are no containers in spec', () => {

  const chart = Testing.chart();

  const deployment = new kplus.Deployment(chart, 'Deployment');

  expect(() => deployment.exposeViaService()).toThrowError('Cannot expose a deployment without containers');
});

test('Synthesizes spec lazily', () => {

  const chart = Testing.chart();

  const deployment = new kplus.Deployment(chart, 'Deployment');
  deployment.addContainer(
    {
      image: 'image',
      port: 9300,
    },
  );

  const container = Testing.synth(chart)[0].spec.template.spec.containers[0];

  expect(container.image).toEqual('image');
  expect(container.ports[0].containerPort).toEqual(9300);

});

test('default deployment strategy', () => {

  const chart = Testing.chart();

  const deployment = new kplus.Deployment(chart, 'Deployment');
  deployment.addContainer({ image: 'image' });

  const spec: k8s.DeploymentSpec = Testing.synth(chart)[0].spec;

  expect(deployment.strategy).toEqual(DeploymentStrategy.rollingUpdate());
  expect(spec.strategy).toEqual({
    type: 'RollingUpdate',
    rollingUpdate: {
      maxSurge: '25%',
      maxUnavailable: '25%',
    },
  });

});

test('custom deployment strategy', () => {

  const chart = Testing.chart();

  const deployment = new kplus.Deployment(chart, 'Deployment', {
    strategy: DeploymentStrategy.recreate(),
  });
  deployment.addContainer({ image: 'image' });

  const spec: k8s.DeploymentSpec = Testing.synth(chart)[0].spec;

  expect(deployment.strategy).toEqual(DeploymentStrategy.recreate());
  expect(spec.strategy).toEqual({ type: 'Recreate' });

});

test('throws is maxSurge and maxUnavailable is set to zero for rolling update', () => {

  const chart = Testing.chart();

  expect(() => new kplus.Deployment(chart, 'Deployment', {
    containers: [{ image: 'image' }],
    strategy: DeploymentStrategy.rollingUpdate({ maxSurge: PercentOrAbsolute.absolute(0), maxUnavailable: PercentOrAbsolute.percent(0) }),
  })).toThrowError('\'maxSurge\' and \'maxUnavailable\' cannot be both zero');
});

test('PercentOrAbsoulte zero', () => {

  expect(PercentOrAbsolute.percent(0).isZero()).toBeTruthy();
  expect(PercentOrAbsolute.absolute(0).isZero()).toBeTruthy();
  expect(PercentOrAbsolute.percent(1).isZero()).toBeFalsy();
  expect(PercentOrAbsolute.absolute(1).isZero()).toBeFalsy();

});

test('default minReadySeconds', () => {

  const chart = Testing.chart();
  const deployment = new kplus.Deployment(chart, 'Deployment', {
    containers: [{ image: 'image' }],
  });

  const spec: k8s.DeploymentSpec = Testing.synth(chart)[0].spec;

  expect(deployment.minReady).toEqual(Duration.seconds(0));
  expect(spec.minReadySeconds).toEqual(0);

});

test('default progressDeadlineSeconds', () => {

  const chart = Testing.chart();
  const deployment = new kplus.Deployment(chart, 'Deployment', {
    containers: [{ image: 'image' }],
  });

  const spec: k8s.DeploymentSpec = Testing.synth(chart)[0].spec;

  expect(deployment.progressDeadline).toEqual(Duration.seconds(600));
  expect(spec.progressDeadlineSeconds).toEqual(600);

});

test('can configure minReadySeconds', () => {

  const chart = Testing.chart();
  const deployment = new kplus.Deployment(chart, 'Deployment', {
    containers: [{ image: 'image' }],
    minReady: Duration.seconds(60),
  });

  const spec: k8s.DeploymentSpec = Testing.synth(chart)[0].spec;

  expect(deployment.minReady).toEqual(Duration.seconds(60));
  expect(spec.minReadySeconds).toEqual(60);

});

test('can configure progressDeadlineSeconds', () => {

  const chart = Testing.chart();
  const deployment = new kplus.Deployment(chart, 'Deployment', {
    containers: [{ image: 'image' }],
    progressDeadline: Duration.seconds(60),
  });

  const spec: k8s.DeploymentSpec = Testing.synth(chart)[0].spec;

  expect(deployment.progressDeadline).toEqual(Duration.seconds(60));
  expect(spec.progressDeadlineSeconds).toEqual(60);

});

test('throws if minReadySeconds > progressDeadlineSeconds', () => {

  const chart = Testing.chart();

  expect(() => new kplus.Deployment(chart, 'Deployment', {
    containers: [{ image: 'image' }],
    minReady: Duration.seconds(60),
    progressDeadline: Duration.seconds(30),
  })).toThrowError("'progressDeadline' (30s) must be greater than 'minReady' (60s)");

});

test('throws if minReadySeconds = progressDeadlineSeconds', () => {

  const chart = Testing.chart();

  expect(() => new kplus.Deployment(chart, 'Deployment', {
    containers: [{ image: 'image' }],
    minReady: Duration.seconds(60),
    progressDeadline: Duration.seconds(60),
  })).toThrowError("'progressDeadline' (60s) must be greater than 'minReady' (60s)");

});

test('can select with expressions', () => {

  const chart = Testing.chart();

  const deployment = new kplus.Deployment(chart, 'Deployment', {
    containers: [{ image: 'image' }],
    select: false,
  });

  deployment.select(kplus.LabelQuery.in('foo', ['v1', 'v2']));
  deployment.select(kplus.LabelQuery.notIn('foo', ['v1', 'v2']));
  deployment.select(kplus.LabelQuery.exists('foo'));
  deployment.select(kplus.LabelQuery.doesNotExist('foo'));

  const expected: Set<k8s.LabelSelectorRequirement> = new Set([
    { key: 'foo', operator: 'In', values: ['v1', 'v2'] },
    { key: 'foo', operator: 'NotIn', values: ['v1', 'v2'] },
    { key: 'foo', operator: 'Exists' },
    { key: 'foo', operator: 'DoesNotExist' },
  ]);

  // assert the k8s spec has it.
  const spec: k8s.DeploymentSpec = Testing.synth(chart)[0].spec;
  expect(new Set(spec.selector.matchExpressions)).toEqual(expected);
});

describe('scheduling', () => {

  test('can tolerate tainted nodes', () => {

    const chart = Testing.chart();

    const devNodes = kplus.Node.tainted(
      kplus.NodeTaintQuery.is('key1', 'value1'),
      kplus.NodeTaintQuery.is('key2', 'value2', { effect: kplus.TaintEffect.PREFER_NO_SCHEDULE }),
      kplus.NodeTaintQuery.exists('key3'),
      kplus.NodeTaintQuery.exists('key4', { effect: kplus.TaintEffect.NO_SCHEDULE }),
      kplus.NodeTaintQuery.is('key5', 'value5', {
        effect: kplus.TaintEffect.NO_EXECUTE,
        evictAfter: Duration.hours(1),
      }),
      kplus.NodeTaintQuery.any(),
    );
    const redis = new kplus.Pod(chart, 'Redis', { containers: [{ image: 'redis' }] });
    redis.scheduling.tolerate(devNodes);

    expect(Testing.synth(chart)).toMatchSnapshot();

  });

  test('can be assigned to a node by name', () => {

    const chart = Testing.chart();

    const redis = new kplus.Deployment(chart, 'Redis', { containers: [{ image: 'redis' }] });
    redis.scheduling.assign(kplus.Node.named('node1'));

    expect(Testing.synth(chart)).toMatchSnapshot();

  });

  test('can be attracted to a node by selector - default', () => {

    const chart = Testing.chart();

    const redis = new kplus.Deployment(chart, 'Redis', { containers: [{ image: 'redis' }] });
    redis.scheduling.attract(kplus.Node.labeled(kplus.NodeLabelQuery.is('memory', 'high')));

    expect(Testing.synth(chart)).toMatchSnapshot();

  });

  test('can be attracted to a node by selector - custom', () => {

    const chart = Testing.chart();

    const redis = new kplus.Deployment(chart, 'Redis', {
      containers: [{ image: 'redis' }],
    });
    redis.scheduling.attract(kplus.Node.labeled(kplus.NodeLabelQuery.is('memory', 'high')), {
      weight: 1,
    });

    expect(Testing.synth(chart)).toMatchSnapshot();

  });

  test('can be co-located with a managed deployment - default', () => {

    const chart = Testing.chart();

    const redis = new kplus.Deployment(chart, 'Redis', {
      containers: [{ image: 'redis' }],
    });
    const web = new kplus.Deployment(chart, 'Web', {
      containers: [{ image: 'web' }],
    });

    web.scheduling.colocate(redis);

    expect(Testing.synth(chart)).toMatchSnapshot();

  });

  test('can be co-located with a managed deployment - custom', () => {

    const chart = Testing.chart();

    const redis = new kplus.Deployment(chart, 'Redis', {
      containers: [{ image: 'redis' }],
    });
    const web = new kplus.Deployment(chart, 'Web', {
      containers: [{ image: 'web' }],
    });

    web.scheduling.colocate(redis, {
      topology: kplus.Topology.ZONE,
      weight: 1,
    });

    expect(Testing.synth(chart)).toMatchSnapshot();

  });

  test('can be co-located with an unmanaged deployment - default', () => {

    const chart = Testing.chart();

    const redis = kplus.Pod.labeled(kplus.LabelQuery.is('app', 'store'))
      .namespaced(kplus.Namespaces.select({ labels: { net: '1' } }));

    const web = new kplus.Deployment(chart, 'Web', {
      containers: [{ image: 'web' }],
    });

    web.scheduling.colocate(redis);

    expect(Testing.synth(chart)).toMatchSnapshot();

  });

  test('can be co-located with an unmanaged deployment - custom', () => {

    const chart = Testing.chart();

    const redis = kplus.Pod.labeled(kplus.LabelQuery.is('app', 'store'))
      .namespaced(kplus.Namespaces.select({ labels: { net: '1' } }));

    const web = new kplus.Deployment(chart, 'Web', {
      containers: [{ image: 'web' }],
    });

    web.scheduling.colocate(redis, {
      topology: kplus.Topology.ZONE,
      weight: 1,
    });

    expect(Testing.synth(chart)).toMatchSnapshot();

  });

  test('can be spread - default', () => {

    const chart = Testing.chart();

    const deployment = new kplus.Deployment(chart, 'Deployment', {
      containers: [{ image: 'redis' }],
    });

    deployment.scheduling.spread(kplus.Topology.HOSTNAME);

    expect(Testing.synth(chart)).toMatchSnapshot();

  });

  test('can be spread - custom', () => {

    const chart = Testing.chart();

    const deployment = new kplus.Deployment(chart, 'Deployment', {
      containers: [{ image: 'redis' }],
    });

    deployment.scheduling.spread(kplus.Topology.HOSTNAME, { weight: 1 });

    expect(Testing.synth(chart)).toMatchSnapshot();

  });

  test('can be separated from a managed deployment - default', () => {

    const chart = Testing.chart();

    const redis = new kplus.Deployment(chart, 'Redis', {
      containers: [{ image: 'redis' }],
    });
    const web = new kplus.Deployment(chart, 'Web', {
      containers: [{ image: 'web' }],
    });

    web.scheduling.separate(redis);

    expect(Testing.synth(chart)).toMatchSnapshot();

  });

  test('can be separated from a managed deployment - custom', () => {

    const chart = Testing.chart();

    const redis = new kplus.Deployment(chart, 'Redis', {
      containers: [{ image: 'redis' }],
    });
    const web = new kplus.Deployment(chart, 'Web', {
      containers: [{ image: 'web' }],
    });

    web.scheduling.separate(redis, {
      topology: kplus.Topology.ZONE,
      weight: 1,
    });

    expect(Testing.synth(chart)).toMatchSnapshot();

  });

  test('can be separated from an unmanaged deployment - default', () => {

    const chart = Testing.chart();

    const redis = kplus.Pod.labeled(kplus.LabelQuery.is('app', 'store'))
      .namespaced(kplus.Namespaces.select({ labels: { net: '1' } }));

    const web = new kplus.Deployment(chart, 'Web', {
      containers: [{ image: 'web' }],
    });

    web.scheduling.separate(redis);

    expect(Testing.synth(chart)).toMatchSnapshot();

  });

  test('can be separated from an unmanaged deployment - custom', () => {

    const chart = Testing.chart();

    const redis = kplus.Pod.labeled(kplus.LabelQuery.is('app', 'store'))
      .namespaced(kplus.Namespaces.select({ labels: { net: '1' } }));

    const web = new kplus.Deployment(chart, 'Web', {
      containers: [{ image: 'web' }],
    });

    web.scheduling.separate(redis, {
      topology: kplus.Topology.ZONE,
      weight: 1,
    });

    expect(Testing.synth(chart)).toMatchSnapshot();

  });

});
