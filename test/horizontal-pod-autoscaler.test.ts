import { Testing, Duration } from 'cdk8s';
import * as kplus from '../src';

test('creates HPA, when target is a deployment', () => {
  const chart = Testing.chart();
  const deployment = new kplus.Deployment(chart, 'Deployment', { containers: [{ image: 'pod' }] });

  new kplus.HorizontalPodAutoscaler(chart, 'Hpa', {
    target: deployment,
    maxReplicas: 10,
  });

  const manifest = Testing.synth(chart);
  expect(manifest).toMatchSnapshot();
  const spec = manifest[1].spec;
  expect(spec.scaleTargetRef.kind).toEqual('Deployment');
});

test('creates HPA, when target is a StatefulSet', () => {
  const chart = Testing.chart();
  const service = new kplus.Service(chart, 'TestService', { ports: [{ port: 80 }] });

  const statefulset = new kplus.StatefulSet(chart, 'StatefulSet', {
    select: false,
    containers: [{ image: 'foobar' }],
    service: service,
  });

  new kplus.HorizontalPodAutoscaler(chart, 'Hpa', {
    target: statefulset,
    maxReplicas: 10,
  });
  const manifest = Testing.synth(chart);
  expect(manifest).toMatchSnapshot();
  const spec = manifest[2].spec;
  expect(spec.scaleTargetRef.kind).toEqual('StatefulSet');
});

test('creates HPA, when minReplicas is same as maxReplicas', () => {
  const chart = Testing.chart();
  const deployment = new kplus.Deployment(chart, 'Deployment', { containers: [{ image: 'pod' }] });

  new kplus.HorizontalPodAutoscaler(chart, 'Hpa', {
    target: deployment,
    maxReplicas: 10,
    minReplicas: 10,
  });

  const manifest = Testing.synth(chart);
  expect(manifest).toMatchSnapshot();
  const spec = manifest[1].spec;
  expect(spec.maxReplicas).toEqual(10);
  expect(spec.minReplicas).toEqual(10);
});

test('creates HPA with expected spec, when metrics, scaleUp, and scaleDown are all configured', () => {
  const chart = Testing.chart();
  const deployment = new kplus.Deployment(chart, 'Deployment', { containers: [{ image: 'pod' }] });

  new kplus.HorizontalPodAutoscaler(chart, 'Hpa', {
    target: deployment,
    maxReplicas: 10,
    minReplicas: 2,
    metrics: [
      kplus.Metric.resourceCpu({
        target: kplus.MetricTarget.averageUtilization(50),
      }),
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

test('creates HPA, when metrics are not provided and one of the two target containers does not have any resources limits/requests', () => {
  const chart = Testing.chart();
  const deployment = new kplus.Deployment(chart, 'Deployment', {
    containers: [{
      image: 'pod1',
      resources: {
        cpu: undefined,
        memory: undefined,
        ephemeralStorage: undefined,
      },
    },
    {
      image: 'pod2',
      resources: {
        cpu: {
          request: kplus.Cpu.millis(256),
        },
        memory: undefined,
        ephemeralStorage: undefined,
      },
    }],
  });

  new kplus.HorizontalPodAutoscaler(chart, 'Hpa', {
    target: deployment,
    maxReplicas: 10,
  });

  const manifest = Testing.synth(chart);
  expect(manifest).toMatchSnapshot();
  const spec = manifest[1].spec;
  expect(spec.maxReplicas).toEqual(10);
});
