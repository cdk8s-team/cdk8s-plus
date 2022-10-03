import { Testing } from 'cdk8s';
import * as kplus from '../src';


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
      kplus.Metric.resourceCpu(kplus.MetricTarget.averageValue('47.2')),
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
        averageValue: '47.2',
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
      kplus.Metric.resourceCpu(kplus.MetricTarget.value('29.5')),
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
        value: '29.5',
        type: 'Value',
      },
    },
  }]);
});
