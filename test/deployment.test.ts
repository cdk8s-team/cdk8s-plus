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
  const expectedSelector = { 'cdk8s.deployment': expectedValue };

  // assert the k8s spec has it.
  const spec = Testing.synth(chart)[0].spec;
  expect(spec.selector.matchLabels).toEqual(expectedSelector);
  expect(spec.template.metadata?.labels).toEqual(expectedSelector);

  // assert the deployment object has it.
  expect(deployment.matchLabels).toEqual(expectedSelector);

});

test('No selector is generated if "defaultSelector" is false', () => {

  const chart = Testing.chart();

  const deployment = new kplus.Deployment(chart, 'Deployment', {
    select: false,
    containers: [{ image: 'foobar' }],
  });

  // assert the k8s spec doesnt have it.
  const spec = Testing.synth(chart)[0].spec;
  expect(spec.selector.matchLabels).toEqual({});
  expect(spec.template.metadata?.labels).toEqual(undefined);

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

  deployment.select(kplus.LabelSelector.is('foo', expectedSelector.foo));

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
  expect(spec.selector).toEqual({ 'cdk8s.deployment': 'test-Deployment-c83f5e59' });
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
    'cdk8s.deployment': 'test-Deployment-c83f5e59',
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

test('can apply label selector to pod metadata', () => {

  const chart = Testing.chart();

  const deployment = new kplus.Deployment(chart, 'Deployment', {
    containers: [{ image: 'image' }],
    select: false,
  });

  const expectedSelector = { foo: 'bar' };

  deployment.select(kplus.LabelSelector.is('foo', expectedSelector.foo, true));

  // assert the k8s spec has it.
  const spec: k8s.DeploymentSpec = Testing.synth(chart)[0].spec;
  expect(spec.selector.matchLabels).toEqual(expectedSelector);
  expect(spec.template.metadata?.labels).toEqual(expectedSelector);

  // assert the deployment object has it.
  expect(deployment.matchLabels).toEqual(expectedSelector);
  expect(deployment.podMetadata.getLabel('foo')).toEqual(expectedSelector.foo);

});

test('can select with expressions', () => {

  const chart = Testing.chart();

  const deployment = new kplus.Deployment(chart, 'Deployment', {
    containers: [{ image: 'image' }],
    select: false,
  });

  deployment.select(kplus.LabelSelector.in('foo', ['v1', 'v2']));
  deployment.select(kplus.LabelSelector.notIn('foo', ['v1', 'v2']));
  deployment.select(kplus.LabelSelector.exists('foo'));
  deployment.select(kplus.LabelSelector.doesNotExist('foo'));

  const expected: Set<k8s.LabelSelectorRequirement> = new Set([
    { key: 'foo', operator: 'In', values: ['v1', 'v2'] },
    { key: 'foo', operator: 'NotIn', values: ['v1', 'v2'] },
    { key: 'foo', operator: 'Exists' },
    { key: 'foo', operator: 'DoesNotExist' },
  ]);

  // assert the k8s spec has it.
  const spec: k8s.DeploymentSpec = Testing.synth(chart)[0].spec;
  expect(new Set(spec.selector.matchExpressions)).toEqual(expected);

  // assert the deployment object has it.
  expect(new Set(deployment.matchExpressions)).toEqual(expected);
});

test('can assign a pod to a node by selectors at instantiation', () => {

  // example based on https://raw.githubusercontent.com/kubernetes/website/main/content/en/examples/pods/pod-with-node-affinity.yaml
  const chart = Testing.chart();
  new kplus.Deployment(chart, 'Pod', {
    containers: [{ image: 'image' }],
    affinity: {
      requiredNodes: [kplus.NodeLabelSelector.is('kubernetes.io/os', 'linux')],
      preferredNodes: [{ weight: 1, selectors: [kplus.NodeLabelSelector.in('another-node-label-key', ['another-node-label-value'])] }],
    },
  });

  const spec: k8s.DeploymentSpec = Testing.synth(chart)[0].spec;

  expect(spec.template.spec!.affinity!.nodeAffinity).toEqual({
    requiredDuringSchedulingIgnoredDuringExecution: {
      nodeSelectorTerms: [
        { matchExpressions: [{ key: 'kubernetes.io/os', operator: 'In', values: ['linux'] }] },
      ],
    },
    preferredDuringSchedulingIgnoredDuringExecution: [
      {
        weight: 1,
        preference: { matchExpressions: [{ key: 'another-node-label-key', operator: 'In', values: ['another-node-label-value'] }] },
      },
    ],
  });

});

test('can assign a pod to a node by selectors post instantiation', () => {

  // example based on https://raw.githubusercontent.com/kubernetes/website/main/content/en/examples/pods/pod-with-node-affinity.yaml
  const chart = Testing.chart();
  const deployment = new kplus.Deployment(chart, 'Pod', {
    containers: [{ image: 'image' }],
  });

  deployment.affinity.requireNodes(kplus.NodeLabelSelector.is('kubernetes.io/os', 'linux'));
  deployment.affinity.preferNodes(1, kplus.NodeLabelSelector.in('another-node-label-key', ['another-node-label-value']));

  const spec: k8s.DeploymentSpec = Testing.synth(chart)[0].spec;

  expect(spec.template.spec!.affinity!.nodeAffinity).toEqual({
    requiredDuringSchedulingIgnoredDuringExecution: {
      nodeSelectorTerms: [
        { matchExpressions: [{ key: 'kubernetes.io/os', operator: 'In', values: ['linux'] }] },
      ],
    },
    preferredDuringSchedulingIgnoredDuringExecution: [
      {
        weight: 1,
        preference: { matchExpressions: [{ key: 'another-node-label-key', operator: 'In', values: ['another-node-label-value'] }] },
      },
    ],
  });

});
