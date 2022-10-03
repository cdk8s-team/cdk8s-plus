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

test('creates HPA, when metrics, scaleUp, and scaleDown are all configured', () => {
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
        {
          replicas: kplus.Replicas.percent(30),
        },
      ],
    },
    scaleDown: {
      stabilizationWindow: Duration.minutes(5),
      strategy: kplus.ScalingStrategy.MAX_CHANGE,
      policies: [
        {
          replicas: kplus.Replicas.absolute(3),
          duration: Duration.minutes(3),
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

test('throws error, when target is set to DaemonSet', () => {
  const chart = Testing.chart();
  const daemonSet = new kplus.DaemonSet(chart, 'DaemonSet', { containers: [{ image: 'pod' }] });

  expect(() =>
    new kplus.HorizontalPodAutoscaler(chart, 'Hpa', {
      target: daemonSet,
      maxReplicas: 10,
    }),
  ).toThrowError('HorizontalPodAutoscaler cannot be used with workloads that do not scale, such as a DaemonSet.');
});

test('throws error, when metrics are not provided and target container does not have resource constraints specified', () => {
  const chart = Testing.chart();
  const deployment = new kplus.Deployment(chart, 'Deployment', {
    containers: [{
      image: 'pod',
      resources: {
        cpu: undefined,
        memory: undefined,
        ephemeralStorage: undefined,
      },
    }],
  });

  expect(() =>
    new kplus.HorizontalPodAutoscaler(chart, 'Hpa', {
      target: deployment,
      maxReplicas: 10,
    }),
  ).toThrowError('Every container in the HorizontalPodAutoscaler target must have CPU or memory resources defined');
});


test('throws error, when minReplicas is more than maxReplicas', () => {
  const chart = Testing.chart();
  const deployment = new kplus.Deployment(chart, 'Deployment', { containers: [{ image: 'pod' }] });

  expect(() =>
    new kplus.HorizontalPodAutoscaler(chart, 'Hpa', {
      target: deployment,
      maxReplicas: 10,
      minReplicas: 11,
    }),
  ).toThrowError("'minReplicas' must be less than or equal to maxReplicas in order for HorizontalPodAutoscaler to scale.");
});

test('throws error, when scaleUp.stabilizationWindow is more than 1 hour', () => {
  const chart = Testing.chart();
  const deployment = new kplus.Deployment(chart, 'Deployment', { containers: [{ image: 'pod' }] });

  expect(() =>
    new kplus.HorizontalPodAutoscaler(chart, 'Hpa', {
      target: deployment,
      maxReplicas: 10,
      scaleUp: {
        stabilizationWindow: Duration.hours(4),
      },
    }),
  ).toThrowError("'scaleUp.stabilizationWindow' must be more than 0 seconds and no longer than 1 hour.");
});

test('throws error, when scaleDown.stabilizationWindow is more than 1 hour', () => {
  const chart = Testing.chart();
  const deployment = new kplus.Deployment(chart, 'Deployment', { containers: [{ image: 'pod' }] });

  expect(() =>
    new kplus.HorizontalPodAutoscaler(chart, 'Hpa', {
      target: deployment,
      maxReplicas: 10,
      scaleDown: {
        stabilizationWindow: Duration.hours(4),
      },
    }),
  ).toThrowError("'scaleDown.stabilizationWindow' must be more than 0 seconds and no longer than 1 hour.");
});

test('throws error, when scaleUp policy has a duration longer than 30 minutes', () => {
  const chart = Testing.chart();
  const deployment = new kplus.Deployment(chart, 'Deployment', { containers: [{ image: 'pod' }] });

  expect(() =>
    new kplus.HorizontalPodAutoscaler(chart, 'Hpa', {
      target: deployment,
      maxReplicas: 10,
      scaleUp: {
        policies: [
          {
            replicas: kplus.Replicas.absolute(3),
            duration: Duration.minutes(31),
          },
        ],
      },
    }),
  ).toThrowError("'scaleUp' and 'scaleDown' policies may only be configured with a duration that is at least 1 second long and no longer than 30 minutes.");
});

test('throws error, when scaleDown policy has a duration longer than 30 minutes', () => {
  const chart = Testing.chart();
  const deployment = new kplus.Deployment(chart, 'Deployment', { containers: [{ image: 'pod' }] });

  expect(() =>
    new kplus.HorizontalPodAutoscaler(chart, 'Hpa', {
      target: deployment,
      maxReplicas: 10,
      scaleDown: {
        policies: [
          {
            replicas: kplus.Replicas.absolute(3),
            duration: Duration.minutes(31),
          },
        ],
      },
    }),
  ).toThrowError("'scaleUp' and 'scaleDown' policies may only be configured with a duration that is at least 1 second long and no longer than 30 minutes.");
});
