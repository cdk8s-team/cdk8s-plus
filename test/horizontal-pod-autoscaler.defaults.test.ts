import { Testing, ApiObject, Duration } from 'cdk8s';
import { Node } from 'constructs';
import * as kplus from '../src';

test('defaultChild', () => {
  const chart = Testing.chart();
  const deployment = new kplus.Deployment(chart, 'Deployment', { containers: [{ image: 'pod' }] });

  const hpa = new kplus.HorizontalPodAutoscaler(chart, 'Hpa', {
    target: deployment,
    maxReplicas: 10,
  });

  const defaultChild = Node.of(hpa).defaultChild as ApiObject;
  expect(defaultChild.kind).toEqual('HorizontalPodAutoscaler');
});

test('default configuration', () => {
  const chart = Testing.chart();
  const deployment = new kplus.Deployment(chart, 'Deployment', { containers: [{ image: 'pod' }] });

  new kplus.HorizontalPodAutoscaler(chart, 'Hpa', {
    target: deployment,
    maxReplicas: 10,
  });

  const manifest = Testing.synth(chart);
  expect(manifest).toMatchSnapshot();
  const spec = manifest[1].spec;
  expect(spec.maxReplicas).toEqual(10);
  expect(spec.minReplicas).toEqual(1);
  expect(spec.metrics).toEqual(undefined);
  expect(spec.behavior.scaleUp).toEqual({
    policies: [
      {
        periodSeconds: 60,
        type: 'Pods',
        value: 4,
      },
      {
        periodSeconds: 60,
        type: 'Percent',
        value: 200,
      },
    ],
    selectPolicy: 'Max',
    stabilizationWindowSeconds: 0,
  });
  expect(spec.behavior.scaleDown).toEqual({
    policies: [
      { periodSeconds: 300, type: 'Pods', value: 1 },
    ],
    selectPolicy: 'Max',
    stabilizationWindowSeconds: 300,
  });
});

test('creates HPA with 2 default scaleUp policies and 1 default scaleDown policy, when all other scaleUp and scaleDown options are provided', () => {
  const chart = Testing.chart();
  const deployment = new kplus.Deployment(chart, 'Deployment', { containers: [{ image: 'pod' }] });

  new kplus.HorizontalPodAutoscaler(chart, 'Hpa', {
    target: deployment,
    maxReplicas: 10,
    scaleUp: {
      stabilizationWindow: Duration.minutes(5),
      strategy: kplus.ScalingStrategy.MAX_CHANGE,
    },
    scaleDown: {
      stabilizationWindow: Duration.minutes(5),
      strategy: kplus.ScalingStrategy.MAX_CHANGE,
    },
  });

  const manifest = Testing.synth(chart);
  expect(manifest).toMatchSnapshot();
  const spec = manifest[1].spec;
  expect(spec.maxReplicas).toEqual(10);
  expect(spec.behavior.scaleUp).toEqual({
    policies: [
      {
        periodSeconds: 60,
        type: 'Pods',
        value: 4,
      },
      {
        periodSeconds: 60,
        type: 'Percent',
        value: 200,
      },
    ],
    selectPolicy: 'Max',
    stabilizationWindowSeconds: 300,
  });
  expect(spec.behavior.scaleDown).toEqual({
    policies: [{
      periodSeconds: 300,
      type: 'Pods',
      value: 1,
    }],
    selectPolicy: 'Max',
    stabilizationWindowSeconds: 300,
  });
});


test('creates HPA with scaleUp and scaleDown policies with the default 15 second periodSeconds, when policies are provided without duration option', () => {
  const chart = Testing.chart();
  const deployment = new kplus.Deployment(chart, 'Deployment', { containers: [{ image: 'pod' }] });

  new kplus.HorizontalPodAutoscaler(chart, 'Hpa', {
    target: deployment,
    maxReplicas: 10,
    scaleUp: {
      policies: [
        {
          replicas: kplus.Replicas.absolute(3),
        },
        {
          replicas: kplus.Replicas.percent(30),
        },
      ],
    },
    scaleDown: {
      policies: [
        {
          replicas: kplus.Replicas.absolute(3),
        },
        {
          replicas: kplus.Replicas.percent(30),
        },
      ],
    },
  });

  const manifest = Testing.synth(chart);
  expect(manifest).toMatchSnapshot();
  const spec = manifest[1].spec;
  expect(spec.maxReplicas).toEqual(10);
  expect(spec.behavior.scaleUp).toEqual({
    policies: [
      { periodSeconds: 15, type: 'Pods', value: 3 },
      { periodSeconds: 15, type: 'Percent', value: 30 },
    ],
    selectPolicy: 'Max',
    stabilizationWindowSeconds: 0,
  });
  expect(spec.behavior.scaleDown).toEqual({
    policies: [
      { periodSeconds: 15, type: 'Pods', value: 3 },
      { periodSeconds: 15, type: 'Percent', value: 30 },
    ],
    selectPolicy: 'Max',
    stabilizationWindowSeconds: 300,
  });
});

test('creates HPA with two different scaling strategies, when provided a scaleUp strategy of Max and scaleDown strategy of Min', () => {
  const chart = Testing.chart();
  const deployment = new kplus.Deployment(chart, 'Deployment', { containers: [{ image: 'pod' }] });

  new kplus.HorizontalPodAutoscaler(chart, 'Hpa', {
    target: deployment,
    maxReplicas: 10,
    minReplicas: 2,
    metrics: [
      kplus.Metric.resourceCpu(kplus.MetricTarget.averageUtilization(50)),
    ],
    scaleUp: {
      stabilizationWindow: Duration.minutes(5),
      strategy: kplus.ScalingStrategy.MAX_CHANGE,
      policies: [
        {
          replicas: kplus.Replicas.absolute(3),
          duration: Duration.minutes(3),
        },
      ],
    },
    scaleDown: {
      stabilizationWindow: Duration.minutes(5),
      strategy: kplus.ScalingStrategy.MIN_CHANGE,
      policies: [
        {
          replicas: kplus.Replicas.absolute(3),
          duration: Duration.minutes(3),
        },
      ],
    },
  });

  const manifest = Testing.synth(chart);
  expect(manifest).toMatchSnapshot();
  const spec = manifest[1].spec;
  expect(spec.maxReplicas).toEqual(10);
  expect(spec.minReplicas).toEqual(2);
  expect(spec.metrics).toEqual([{
    resource: {
      name: 'cpu',
      target: {
        averageUtilization: 50,
        type: 'Utilization',
      },
    },
    type: 'Resource',
  }]);
  expect(spec.behavior.scaleUp).toEqual({
    policies: [
      { periodSeconds: 180, type: 'Pods', value: 3 },
    ],
    selectPolicy: 'Max',
    stabilizationWindowSeconds: 300,
  });
  expect(spec.behavior.scaleDown).toEqual({
    policies: [
      { periodSeconds: 180, type: 'Pods', value: 3 },
    ],
    selectPolicy: 'Min',
    stabilizationWindowSeconds: 300,
  });
});
