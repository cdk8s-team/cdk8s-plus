import { Testing, Duration } from 'cdk8s';
import * as kplus from '../src';

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
  expect(() => Testing.synth(chart)).toThrowError('Every container in the HorizontalPodAutoscaler target must have CPU or memory resources defined');
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
        stabilizationWindow: Duration.hours(2),
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
        stabilizationWindow: Duration.hours(2),
      },
    }),
  ).toThrowError("'scaleDown.stabilizationWindow' must be more than 0 seconds and no longer than 1 hour.");
});

test('throws error, when scaleUp.stabilizationWindow is 0', () => {
  const chart = Testing.chart();
  const deployment = new kplus.Deployment(chart, 'Deployment', { containers: [{ image: 'pod' }] });

  expect(() =>
    new kplus.HorizontalPodAutoscaler(chart, 'Hpa', {
      target: deployment,
      maxReplicas: 10,
      scaleUp: {
        stabilizationWindow: Duration.hours(0),
      },
    }),
  ).toThrowError("'scaleUp.stabilizationWindow' must be more than 0 seconds and no longer than 1 hour.");
});

test('throws error, when scaleDown.stabilizationWindow is 0', () => {
  const chart = Testing.chart();
  const deployment = new kplus.Deployment(chart, 'Deployment', { containers: [{ image: 'pod' }] });

  expect(() =>
    new kplus.HorizontalPodAutoscaler(chart, 'Hpa', {
      target: deployment,
      maxReplicas: 10,
      scaleDown: {
        stabilizationWindow: Duration.hours(0),
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
  ).toThrowError("'scaleUp' policies may only be configured with a duration that is at least 1 second long and no longer than 30 minutes.");
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
  ).toThrowError("'scaleDown' policies may only be configured with a duration that is at least 1 second long and no longer than 30 minutes.");
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
  ).toThrowError("'scaleUp' policies may only be configured with a duration that is at least 1 second long and no longer than 30 minutes.");
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
  ).toThrowError("'scaleDown' policies may only be configured with a duration that is at least 1 second long and no longer than 30 minutes.");
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
  expect(() => Testing.synth(chart) ).toThrowError('HorizontalPodAutoscaler target cannot have a fixed number of replicas. Found 3');
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
  expect(() =>Testing.synth(chart)).toThrowError('HorizontalPodAutoscaler target cannot have a fixed number of replicas. Found 5');
});
