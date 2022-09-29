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

test('throws error, when resource container does not have a request/limit defined and metrics is undefined', () => {
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

test('creates HPA, metrics, scaleUp,and scaleDown are configured', () => {
  const chart = Testing.chart();
  const deployment = new kplus.Deployment(chart, 'Deployment', { containers: [{ image: 'pod' }] });

  new kplus.HorizontalPodAutoscaler(chart, 'Hpa', {
    target: deployment,
    maxReplicas: 10,
    minReplicas: 2,
    metrics: [
      kplus.Metric.resource({
        name: 'cpu',
        target: kplus.MetricTarget.averageUtilization(50),
      }),
    ],
    scaleUp: {
      stabilizationWindow: Duration.minutes(5),
      strategy: kplus.ScalingStrategy.MAX_CHANGE,
      policies: [
        kplus.ScalingPolicy.pods(3, { scalingDuration: Duration.minutes(3) }),
        kplus.ScalingPolicy.percent(30),
      ],
    },
    scaleDown: {
      stabilizationWindow: Duration.minutes(5),
      strategy: kplus.ScalingStrategy.MAX_CHANGE,
      policies: [
        kplus.ScalingPolicy.pods(3, { scalingDuration: Duration.minutes(3) }),
        kplus.ScalingPolicy.percent(30),
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
      { periodSeconds: 15, type: 'Percent', value: 30 },
    ],
    selectPolicy: 'Max',
    stabilizationWindowSeconds: 300,
  });
  expect(spec.behavior.scaleDown).toEqual({
    policies: [
      { periodSeconds: 180, type: 'Pods', value: 3 },
      { periodSeconds: 15, type: 'Percent', value: 30 },
    ],
    selectPolicy: 'Max',
    stabilizationWindowSeconds: 300,
  });
});
