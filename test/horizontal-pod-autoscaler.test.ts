import { Testing, Duration, ApiObject } from 'cdk8s';
import { Node } from 'constructs';
import * as kplus from '../src';

// Checking defaults
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

// Metrics

test('creates HPA with CPU ContainerResource metric, when provided a Metric.containerCpu()', () => {
  const chart = Testing.chart();
  const deployment = new kplus.Deployment(chart, 'Deployment', { containers: [{ image: 'pod' }] });

  new kplus.HorizontalPodAutoscaler(chart, 'Hpa', {
    target: deployment,
    maxReplicas: 10,
    metrics: [
      kplus.Metric.containerCpu({
        container: deployment.containers[0],
        target: kplus.MetricTarget.averageUtilization(50),
      }),
    ],
  });

  const manifest = Testing.synth(chart);
  expect(manifest).toMatchSnapshot();
  const spec = manifest[1].spec;
  expect(spec.maxReplicas).toEqual(10);
  expect(spec.metrics).toEqual([{
    type: 'ContainerResource',
    containerResource: {
      container: 'main',
      name: 'cpu',
      target: {
        averageUtilization: 50,
        type: 'Utilization',
      },
    },
  }]);
});


test('creates HPA with Memory ContainerResource metric, when provided a Metric.containerMemory()', () => {
  const chart = Testing.chart();
  const deployment = new kplus.Deployment(chart, 'Deployment', { containers: [{ image: 'pod' }] });

  new kplus.HorizontalPodAutoscaler(chart, 'Hpa', {
    target: deployment,
    maxReplicas: 10,
    metrics: [
      kplus.Metric.containerMemory({
        container: deployment.containers[0],
        target: kplus.MetricTarget.averageUtilization(50),
      }),
    ],
  });

  const manifest = Testing.synth(chart);
  expect(manifest).toMatchSnapshot();
  const spec = manifest[1].spec;
  expect(spec.maxReplicas).toEqual(10);
  expect(spec.metrics).toEqual([{
    type: 'ContainerResource',
    containerResource: {
      container: 'main',
      name: 'memory',
      target: {
        averageUtilization: 50,
        type: 'Utilization',
      },
    },
  }]);
});

test('creates HPA with Storage ContainerResource metric, when provided a Metric.containerStorage()', () => {
  const chart = Testing.chart();
  const deployment = new kplus.Deployment(chart, 'Deployment', { containers: [{ image: 'pod' }] });

  new kplus.HorizontalPodAutoscaler(chart, 'Hpa', {
    target: deployment,
    maxReplicas: 10,
    metrics: [
      kplus.Metric.containerStorage({
        container: deployment.containers[0],
        target: kplus.MetricTarget.averageUtilization(50),
      }),
    ],
  });

  const manifest = Testing.synth(chart);
  expect(manifest).toMatchSnapshot();
  const spec = manifest[1].spec;
  expect(spec.maxReplicas).toEqual(10);
  expect(spec.metrics).toEqual([{
    type: 'ContainerResource',
    containerResource: {
      container: 'main',
      name: 'storage',
      target: {
        averageUtilization: 50,
        type: 'Utilization',
      },
    },
  }]);
});

test('creates HPA with Ephemeral Storage ContainerResource metric, when provided a Metric.containerStorage()', () => {
  const chart = Testing.chart();
  const deployment = new kplus.Deployment(chart, 'Deployment', { containers: [{ image: 'pod' }] });

  new kplus.HorizontalPodAutoscaler(chart, 'Hpa', {
    target: deployment,
    maxReplicas: 10,
    metrics: [
      kplus.Metric.containerEphemeralStorage({
        container: deployment.containers[0],
        target: kplus.MetricTarget.averageUtilization(50),
      }),
    ],
  });

  const manifest = Testing.synth(chart);
  expect(manifest).toMatchSnapshot();
  const spec = manifest[1].spec;
  expect(spec.maxReplicas).toEqual(10);
  expect(spec.metrics).toEqual([{
    type: 'ContainerResource',
    containerResource: {
      container: 'main',
      name: 'ephemeral-storage',
      target: {
        averageUtilization: 50,
        type: 'Utilization',
      },
    },
  }]);
});

test('creates HPA with external metric, when provided a Metric.external()', () => {
  const chart = Testing.chart();
  const deployment = new kplus.Deployment(chart, 'Deployment', { containers: [{ image: 'pod' }] });

  new kplus.HorizontalPodAutoscaler(chart, 'Hpa', {
    target: deployment,
    maxReplicas: 10,
    metrics: [
      kplus.Metric.external({
        labelSelector: kplus.LabelSelector.of({ labels: { app: 'scraper' } }),
        name: 'sqs-queue',
        target: kplus.MetricTarget.averageUtilization(50),
      }),
    ],
  });

  const manifest = Testing.synth(chart);
  expect(manifest).toMatchSnapshot();
  const spec = manifest[1].spec;
  expect(spec.maxReplicas).toEqual(10);
  expect(spec.metrics).toEqual([{
    type: 'External',
    external: {
      metric: {
        name: 'sqs-queue',
        selector: {
          matchLabels: {
            app: 'scraper',
          },
        },
      },
      target: {
        averageUtilization: 50,
        type: 'Utilization',
      },
    },
  }]);
});

test('creates HPA with object metric, when provided a Metric.object()', () => {
  const chart = Testing.chart();
  const deployment = new kplus.Deployment(chart, 'Deployment', { containers: [{ image: 'pod' }] });
  const service = new kplus.Service(chart, 'my-service', { ports: [{ port: 80 }] } );
  const ingress = new kplus.Ingress(chart, 'my-ingress', {
    defaultBackend: kplus.IngressBackend.fromService(service),
  });

  new kplus.HorizontalPodAutoscaler(chart, 'Hpa', {
    target: deployment,
    maxReplicas: 10,
    metrics: [
      kplus.Metric.object({
        object: ingress,
        name: 'requests-per-second',
        target: kplus.MetricTarget.averageUtilization(50),
      }),
    ],
  });

  const manifest = Testing.synth(chart);
  expect(manifest).toMatchSnapshot();
  const spec = manifest[3].spec;
  expect(spec.maxReplicas).toEqual(10);
  expect(spec.metrics).toEqual([{
    type: 'Object',
    object: {
      describedObject: {
        apiVersion: 'networking.k8s.io/v1',
        kind: 'Ingress',
        name: 'test-my-ingress-c8135042',
      },
      metric: {
        name: 'requests-per-second',
      },
      target: {
        averageUtilization: 50,
        type: 'Utilization',
      },
    },
  }]);
});

test('creates HPA with pods metric, when provided a Metric.pods()', () => {
  const chart = Testing.chart();
  const deployment = new kplus.Deployment(chart, 'Deployment', { containers: [{ image: 'pod' }] });

  new kplus.HorizontalPodAutoscaler(chart, 'Hpa', {
    target: deployment,
    maxReplicas: 10,
    metrics: [
      kplus.Metric.pods({
        name: 'requests-per-second',
        target: kplus.MetricTarget.averageUtilization(50),
        labelSelector: kplus.LabelSelector.of({ labels: { app: 'scraper' } }),
      }),
    ],
  });

  const manifest = Testing.synth(chart);
  expect(manifest).toMatchSnapshot();
  const spec = manifest[1].spec;
  expect(spec.maxReplicas).toEqual(10);
  expect(spec.metrics).toEqual([{
    type: 'Pods',
    pods: {
      metric: {
        name: 'requests-per-second',
        selector: {
          matchLabels: {
            app: 'scraper',
          },
        },
      },
      target: {
        averageUtilization: 50,
        type: 'Utilization',
      },
    },
  }]);
});

test('creates HPA with Resource CPU metric, when provided a Metric.resourceCpu()', () => {
  const chart = Testing.chart();
  const deployment = new kplus.Deployment(chart, 'Deployment', { containers: [{ image: 'pod' }] });

  new kplus.HorizontalPodAutoscaler(chart, 'Hpa', {
    target: deployment,
    maxReplicas: 10,
    metrics: [
      kplus.Metric.resourceCpu( kplus.MetricTarget.averageUtilization(50)),
    ],
  });

  const manifest = Testing.synth(chart);
  expect(manifest).toMatchSnapshot();
  const spec = manifest[1].spec;
  expect(spec.maxReplicas).toEqual(10);
  expect(spec.metrics).toEqual([{
    type: 'Resource',
    resource: {
      name: 'cpu',
      target: {
        averageUtilization: 50,
        type: 'Utilization',
      },
    },
  }]);
});

test('creates HPA with Resource Memory metric, when provided a Metric.resourceMemory()', () => {
  const chart = Testing.chart();
  const deployment = new kplus.Deployment(chart, 'Deployment', { containers: [{ image: 'pod' }] });

  new kplus.HorizontalPodAutoscaler(chart, 'Hpa', {
    target: deployment,
    maxReplicas: 10,
    metrics: [
      kplus.Metric.resourceMemory( kplus.MetricTarget.averageUtilization(50)),
    ],
  });

  const manifest = Testing.synth(chart);
  expect(manifest).toMatchSnapshot();
  const spec = manifest[1].spec;
  expect(spec.maxReplicas).toEqual(10);
  expect(spec.metrics).toEqual([{
    type: 'Resource',
    resource: {
      name: 'memory',
      target: {
        averageUtilization: 50,
        type: 'Utilization',
      },
    },
  }]);
});

test('creates HPA with Resource Storage metric, when provided a Metric.resourceStorage()', () => {
  const chart = Testing.chart();
  const deployment = new kplus.Deployment(chart, 'Deployment', { containers: [{ image: 'pod' }] });

  new kplus.HorizontalPodAutoscaler(chart, 'Hpa', {
    target: deployment,
    maxReplicas: 10,
    metrics: [
      kplus.Metric.resourceStorage( kplus.MetricTarget.averageUtilization(50)),
    ],
  });

  const manifest = Testing.synth(chart);
  expect(manifest).toMatchSnapshot();
  const spec = manifest[1].spec;
  expect(spec.maxReplicas).toEqual(10);
  expect(spec.metrics).toEqual([{
    type: 'Resource',
    resource: {
      name: 'storage',
      target: {
        averageUtilization: 50,
        type: 'Utilization',
      },
    },
  }]);
});

test('creates HPA with Resource Ephemeral Storage metric, when provided a Metric.resourceEphemeralStorage()', () => {
  const chart = Testing.chart();
  const deployment = new kplus.Deployment(chart, 'Deployment', { containers: [{ image: 'pod' }] });

  new kplus.HorizontalPodAutoscaler(chart, 'Hpa', {
    target: deployment,
    maxReplicas: 10,
    metrics: [
      kplus.Metric.resourceEphemeralStorage( kplus.MetricTarget.averageUtilization(50)),
    ],
  });

  const manifest = Testing.synth(chart);
  expect(manifest).toMatchSnapshot();
  const spec = manifest[1].spec;
  expect(spec.maxReplicas).toEqual(10);
  expect(spec.metrics).toEqual([{
    type: 'Resource',
    resource: {
      name: 'ephemeral-storage',
      target: {
        averageUtilization: 50,
        type: 'Utilization',
      },
    },
  }]);
});

test('creates HPA with Resource CPU metric targeting 70% average utilization, when provided a MetricTarget.averageUtilization()', () => {
  const chart = Testing.chart();
  const deployment = new kplus.Deployment(chart, 'Deployment', { containers: [{ image: 'pod' }] });

  new kplus.HorizontalPodAutoscaler(chart, 'Hpa', {
    target: deployment,
    maxReplicas: 10,
    metrics: [
      kplus.Metric.resourceCpu(kplus.MetricTarget.averageUtilization(70)),
    ],
  });

  const manifest = Testing.synth(chart);
  expect(manifest).toMatchSnapshot();
  const spec = manifest[1].spec;
  expect(spec.maxReplicas).toEqual(10);
  expect(spec.metrics).toEqual([{
    type: 'Resource',
    resource: {
      name: 'cpu',
      target: {
        averageUtilization: 70,
        type: 'Utilization',
      },
    },
  }]);
});

test('creates HPA with Resource CPU metric targeting 47.2 average value, when provided a MetricTarget.averageUtilization()', () => {
  const chart = Testing.chart();
  const deployment = new kplus.Deployment(chart, 'Deployment', { containers: [{ image: 'pod' }] });

  new kplus.HorizontalPodAutoscaler(chart, 'Hpa', {
    target: deployment,
    maxReplicas: 10,
    metrics: [
      kplus.Metric.resourceCpu(kplus.MetricTarget.averageValue(47.2)),
    ],
  });

  const manifest = Testing.synth(chart);
  expect(manifest).toMatchSnapshot();
  const spec = manifest[1].spec;
  expect(spec.maxReplicas).toEqual(10);
  expect(spec.metrics).toEqual([{
    type: 'Resource',
    resource: {
      name: 'cpu',
      target: {
        averageValue: 47.2,
        type: 'AverageValue',
      },
    },
  }]);
});

test('creates HPA with Resource CPU metric targeting the exact value of 29.5, when provided a MetricTarget.value()', () => {
  const chart = Testing.chart();
  const deployment = new kplus.Deployment(chart, 'Deployment', { containers: [{ image: 'pod' }] });

  new kplus.HorizontalPodAutoscaler(chart, 'Hpa', {
    target: deployment,
    maxReplicas: 10,
    metrics: [
      kplus.Metric.resourceCpu(kplus.MetricTarget.value(29.5)),
    ],
  });

  const manifest = Testing.synth(chart);
  expect(manifest).toMatchSnapshot();
  const spec = manifest[1].spec;
  expect(spec.maxReplicas).toEqual(10);
  expect(spec.metrics).toEqual([{
    type: 'Resource',
    resource: {
      name: 'cpu',
      target: {
        value: 29.5,
        type: 'Value',
      },
    },
  }]);
});


// Different config combinations
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

// Errors

test('throws error at synth, when metrics are not provided and target container does not have resource constraints specified', () => {
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

  new kplus.HorizontalPodAutoscaler(chart, 'Hpa', {
    target: deployment,
    maxReplicas: 10,
  });
  const regex = new RegExp(/Validation failed with the following errors:[\s]*\[test\/Hpa\] If HorizontalPodAutoscaler does not have metrics defined, then every container in the target must have a CPU or memory resource constraint defined\./);
  expect(() => Testing.synth(chart)).toThrowError(regex);
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
  ).toThrowError("'minReplicas' (11) must be less than or equal to 'maxReplicas' (10) in order for HorizontalPodAutoscaler to scale.");
});

test('throws error, when scaleUp.stabilizationWindow is more than 1 hour', () => {
  const chart = Testing.chart();
  const deployment = new kplus.Deployment(chart, 'Deployment', { containers: [{ image: 'pod' }] });

  expect(() =>
    new kplus.HorizontalPodAutoscaler(chart, 'Hpa', {
      target: deployment,
      maxReplicas: 10,
      scaleUp: {
        stabilizationWindow: Duration.hours(2),
      },
    }),
  ).toThrowError("'scaleUp.stabilizationWindow' (1 hour 60 minutes) must be 0 seconds or more with a max of 1 hour.");
});


test('throws error, when scaleDown.stabilizationWindow is more than 1 hour', () => {
  const chart = Testing.chart();
  const deployment = new kplus.Deployment(chart, 'Deployment', { containers: [{ image: 'pod' }] });

  expect(() =>
    new kplus.HorizontalPodAutoscaler(chart, 'Hpa', {
      target: deployment,
      maxReplicas: 10,
      scaleDown: {
        stabilizationWindow: Duration.hours(2),
      },
    }),
  ).toThrowError("'scaleDown.stabilizationWindow' (1 hour 60 minutes) must be 0 seconds or more with a max of 1 hour.");
});

test('throws error, when scaleUp.stabilizationWindow is -1', () => {
  const chart = Testing.chart();
  const deployment = new kplus.Deployment(chart, 'Deployment', { containers: [{ image: 'pod' }] });

  expect(() =>
    new kplus.HorizontalPodAutoscaler(chart, 'Hpa', {
      target: deployment,
      maxReplicas: 10,
      scaleUp: {
        stabilizationWindow: Duration.seconds(-1),
      },
    }),
  ).toThrowError('Duration amounts cannot be negative. Received: -1');
});

test('throws error, when scaleDown.stabilizationWindow is -1 seconds', () => {
  const chart = Testing.chart();
  const deployment = new kplus.Deployment(chart, 'Deployment', { containers: [{ image: 'pod' }] });

  expect(() =>
    new kplus.HorizontalPodAutoscaler(chart, 'Hpa', {
      target: deployment,
      maxReplicas: 10,
      scaleDown: {
        stabilizationWindow: Duration.seconds(-1),
      },
    }),
  ).toThrowError('Duration amounts cannot be negative. Received: -1');
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
  ).toThrowError("'scaleUp.policies' duration (31 minutes) is outside of the allowed range. Must be at least 1 second long and no longer than 30 minutes.");
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
  ).toThrowError("'scaleDown.policies' duration (31 minutes) is outside of the allowed range. Must be at least 1 second long and no longer than 30 minutes.");
});

test('throws error, when scaleUp policy has a duration set to 0', () => {
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
            duration: Duration.minutes(0),
          },
        ],
      },
    }),
  ).toThrowError("'scaleUp.policies' duration (0 minutes) is outside of the allowed range. Must be at least 1 second long and no longer than 30 minutes.");
});

test('throws error, when scaleDown policy has a duration set to 0', () => {
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
            duration: Duration.minutes(0),
          },
        ],
      },
    }),
  ).toThrowError("'scaleDown.policies' duration (0 minutes) is outside of the allowed range. Must be at least 1 second long and no longer than 30 minutes.");
});

test('throws error, when scaleUp policy has a duration set to -10 minutes', () => {
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
            duration: Duration.minutes(-10),
          },
        ],
      },
    }),
  ).toThrowError('Duration amounts cannot be negative. Received: -10');
});

test('throws error, when scaleDown policy has a duration set to -10 minutes', () => {
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
            duration: Duration.minutes(-10),
          },
        ],
      },
    }),
  ).toThrowError('Duration amounts cannot be negative. Received: -10');
});

test('throws error at synth, when Deployment target has replicas defined', () => {
  const chart = Testing.chart();

  const deployment = new kplus.Deployment(chart, 'Deployment', {
    containers: [{ image: 'pod' }],
    replicas: 3,
  });

  new kplus.HorizontalPodAutoscaler(chart, 'Hpa', {
    target: deployment,
    maxReplicas: 10,
  });
  const regex = new RegExp(/Validation failed with the following errors:[\s]*\[test\/Hpa\] HorizontalPodAutoscaler target cannot have a fixed number of replicas \(3\)\./);
  expect(() => Testing.synth(chart) ).toThrowError(regex);
});

test('throws error at synth, when StatefulSet target has replicas defined', () => {
  const chart = Testing.chart();
  const service = new kplus.Service(chart, 'TestService', { ports: [{ port: 80 }] });

  const statefulset = new kplus.StatefulSet(chart, 'StatefulSet', {
    select: false,
    containers: [{ image: 'foobar' }],
    service: service,
    replicas: 5,
  });

  new kplus.HorizontalPodAutoscaler(chart, 'Hpa', {
    target: statefulset,
    maxReplicas: 10,
  });
  const regex = new RegExp(/Validation failed with the following errors:[\s]*\[test\/Hpa\] HorizontalPodAutoscaler target cannot have a fixed number of replicas \(5\)\./);
  expect(() =>Testing.synth(chart)).toThrowError(regex);
});
