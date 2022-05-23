import * as cdk8s from 'cdk8s';
import { Size, Testing } from 'cdk8s';
import * as kplus from '../src';
import { Container, Cpu, Handler } from '../src';
import * as k8s from '../src/imports/k8s';

describe('EnvValue', () => {

  test('Can be created from value', () => {

    const actual = kplus.EnvValue.fromValue('value');

    expect(actual.value).toEqual('value');
    expect(actual.valueFrom).toBeUndefined();

  });

  test('Can be created from config map name', () => {

    const actual = kplus.EnvValue.fromConfigMap(kplus.ConfigMap.fromConfigMapName('ConfigMap'), 'key');

    expect(actual.value).toBeUndefined();
    expect(actual.valueFrom).toEqual({
      configMapKeyRef: {
        key: 'key',
        name: 'ConfigMap',
      },
    });

  });

  test('Can be created from secret value', () => {
    const secretValue = {
      secret: kplus.Secret.fromSecretName('Secret'),
      key: 'my-key',
    };

    const actual = kplus.EnvValue.fromSecretValue(secretValue);

    expect(actual.value).toBeUndefined();
    expect(actual.valueFrom).toEqual({
      secretKeyRef: {
        key: 'my-key',
        name: 'Secret',
      },
    });
  });

  test('Cannot be created from missing required process env', () => {

    const key = 'cdk8s-plus.tests.container.env.fromProcess';
    expect(() => kplus.EnvValue.fromProcess(key, { required: true })).toThrowError(`Missing ${key} env variable`);

  });

  test('Can be created from missing optional process env', () => {

    const key = 'cdk8s-plus.tests.container.env.fromProcess';
    const actual = kplus.EnvValue.fromProcess(key);

    expect(actual.value).toBeUndefined();
    expect(actual.valueFrom).toBeUndefined();

  });

  test('Can be created from existing process env', () => {

    const key = 'cdk8s-plus.tests.container.env.fromProcess';
    try {
      process.env[key] = 'value';
      const actual = kplus.EnvValue.fromProcess(key);

      expect(actual.value).toEqual('value');
      expect(actual.valueFrom).toBeUndefined();

    } finally {
      delete process.env[key];
    }

  });

  test('Can be created from fieldRef', () => {
    const actual = kplus.EnvValue.fromFieldRef(kplus.EnvFieldPaths.POD_NAME);

    expect(actual.value).toBeUndefined();
    expect(actual.valueFrom).toEqual({
      fieldRef: {
        fieldPath: 'metadata.name',
      },
    });
  });

  test('Can be created from fieldRef with key', () => {
    const actual = kplus.EnvValue.fromFieldRef(kplus.EnvFieldPaths.POD_LABEL, { key: 'someLabel' });

    expect(actual.value).toBeUndefined();
    expect(actual.valueFrom).toEqual({
      fieldRef: {
        fieldPath: 'metadata.labels[\'someLabel\']',
      },
    });
  });

  test('Can not be created from fieldRef without key', () => {
    expect(() => kplus.EnvValue.fromFieldRef(kplus.EnvFieldPaths.POD_LABEL)).toThrowError(`${kplus.EnvFieldPaths.POD_LABEL} requires a key`);
  });

  test('Can be created from resourceFieldRef', () => {
    const actual = kplus.EnvValue.fromResource(kplus.ResourceFieldPaths.CPU_LIMIT);

    expect(actual.value).toBeUndefined();
    expect(actual.valueFrom).toEqual({
      resourceFieldRef: {
        resource: 'limits.cpu',
      },
    });
  });

  test('Can be created from resourceFieldRef with divisor', () => {
    const actual = kplus.EnvValue.fromResource(kplus.ResourceFieldPaths.MEMORY_LIMIT, { divisor: '1Mi' });

    expect(actual.value).toBeUndefined();
    expect(actual.valueFrom).toEqual({
      resourceFieldRef: {
        resource: 'limits.memory',
        divisor: k8s.IntOrString.fromString('1Mi'),
      },
    });
  });

  test('Can be created from resourceFieldRef with container', () => {
    const container = new kplus.Container({
      image: 'image',
      name: 'name',
      imagePullPolicy: kplus.ImagePullPolicy.NEVER,
    });

    const actual = kplus.EnvValue.fromResource(kplus.ResourceFieldPaths.CPU_LIMIT, { container });

    expect(actual.value).toBeUndefined();
    expect(actual.valueFrom).toEqual({
      resourceFieldRef: {
        resource: 'limits.cpu',
        containerName: container.name,
      },
    });
  });
});

describe('Container', () => {

  test('Instantiation properties are all respected', () => {

    const container = new kplus.Container({
      image: 'image',
      name: 'name',
      imagePullPolicy: kplus.ImagePullPolicy.NEVER,
      workingDir: 'workingDir',
      port: 9000,
      command: ['command'],
      envVariables: {
        key: kplus.EnvValue.fromValue('value'),
      },
    });

    const actual: k8s.Container = container._toKube();

    const expected: k8s.Container = {
      name: 'name',
      imagePullPolicy: 'Never',
      image: 'image',
      workingDir: 'workingDir',
      ports: [{
        containerPort: 9000,
      }],
      command: ['command'],
      env: [{
        name: 'key',
        value: 'value',
      }],
      securityContext: {
        privileged: false,
        readOnlyRootFilesystem: false,
        runAsNonRoot: false,
      },
    };

    expect(actual).toEqual(expected);

  });

  test('Must use container props', () => {

    const container = new kplus.Container({
      image: 'image',
    });
    expect(() => {
      new kplus.Container(container);
    }).toThrow();

  });

  test('Can add environment variable', () => {

    const container = new kplus.Container({
      image: 'image',
    });

    container.env.addVariable('key', kplus.EnvValue.fromValue('value'));

    const actual: k8s.EnvVar[] = container._toKube().env!;
    const expected: k8s.EnvVar[] = [{
      name: 'key',
      value: 'value',
      valueFrom: undefined,
    }];

    expect(actual).toEqual(expected);

  });

  test('can add environment variables from a source', () => {

    const chart = Testing.chart();

    const cm = new kplus.ConfigMap(chart, 'ConfigMap');
    const secret = new kplus.Secret(chart, 'Secret');

    const cmSource = kplus.Env.fromConfigMap(cm, 'pref');
    const secretSource = kplus.Env.fromSecret(secret);

    const container = new kplus.Container({
      image: 'image',
      envFrom: [cmSource],
    });

    container.env.copyFrom(secretSource);

    const spec: k8s.Container = container._toKube();

    expect(spec.envFrom).toEqual([
      { configMapRef: { name: cm.name }, prefix: 'pref' },
      { secretRef: { name: secret.name } },
    ]);

    expect(container.env.sources).toEqual([cmSource, secretSource]);
  });

  test('can add environment variables from a secret', () => {});

  test('Can mount container to volume', () => {

    const container = new kplus.Container({
      image: 'image',
    });

    const volume = kplus.Volume.fromConfigMap(kplus.ConfigMap.fromConfigMapName('ConfigMap'));

    container.mount('/path/to/mount', volume);

    const expected: k8s.VolumeMount = {
      mountPath: '/path/to/mount',
      name: volume.name,
    };

    expect(container._toKube().volumeMounts).toEqual([expected]);
  });

  test('can mount container to a pv', () => {

    const chart = Testing.chart();
    const pod = new kplus.Pod(chart, 'Pod');

    const volume = new kplus.AwsElasticBlockStorePersistentVolume(chart, 'PV', { volumeId: 'vol' });

    const container = pod.addContainer({ image: 'image' });
    container.mount('/path/to/mount', volume);

    const resources = Testing.synth(chart);
    expect(resources).toMatchSnapshot();
  });

  test('mount options', () => {
    const container = new kplus.Container({
      image: 'image',
    });

    const volume = kplus.Volume.fromConfigMap(kplus.ConfigMap.fromConfigMapName('ConfigMap'));

    container.mount('/path/to/mount', volume, {
      propagation: kplus.MountPropagation.BIDIRECTIONAL,
      readOnly: true,
    });

    const expected: k8s.VolumeMount = {
      mountPath: '/path/to/mount',
      name: volume.name,
      mountPropagation: 'Bidirectional',
      readOnly: true,
    };

    expect(container._toKube().volumeMounts).toEqual([expected]);
  });

  test('mount from ctor', () => {
    const container = new kplus.Container({
      image: 'image',
      volumeMounts: [
        {
          path: '/foo',
          volume: kplus.Volume.fromEmptyDir('empty'),
          subPath: 'subPath',
        },
      ],
    });

    const expected: k8s.VolumeMount = {
      mountPath: '/foo',
      name: 'empty',
      subPath: 'subPath',
    };

    expect(container._toKube().volumeMounts).toEqual([expected]);
  });

  test('"readiness", "liveness", and "startup" can be used to define probes', () => {
    // GIVEN
    const container = new kplus.Container({
      image: 'foo',
      readiness: kplus.Probe.fromHttpGet('/ping', {
        timeoutSeconds: cdk8s.Duration.minutes(2),
      }),
      liveness: kplus.Probe.fromHttpGet('/live', {
        timeoutSeconds: cdk8s.Duration.minutes(3),
      }),
      startup: kplus.Probe.fromHttpGet('/startup', {
        timeoutSeconds: cdk8s.Duration.minutes(4),
      }),
    });

    // THEN
    expect(container._toKube().readinessProbe).toEqual({
      failureThreshold: 3,
      httpGet: { path: '/ping', port: k8s.IntOrString.fromNumber(80) },
      initialDelaySeconds: undefined,
      periodSeconds: undefined,
      successThreshold: undefined,
      timeoutSeconds: 120,
    });
    expect(container._toKube().livenessProbe).toEqual({
      failureThreshold: 3,
      httpGet: { path: '/live', port: k8s.IntOrString.fromNumber(80) },
      initialDelaySeconds: undefined,
      periodSeconds: undefined,
      successThreshold: undefined,
      timeoutSeconds: 180,
    });
    expect(container._toKube().startupProbe).toEqual({
      failureThreshold: 3,
      httpGet: { path: '/startup', port: k8s.IntOrString.fromNumber(80) },
      initialDelaySeconds: undefined,
      periodSeconds: undefined,
      successThreshold: undefined,
      timeoutSeconds: 240,
    });
  });

  test('Can add resource limits and requests', () => {
    const container = new kplus.Container({
      resources: {
        cpu: {
          request: Cpu.millis(300),
          limit: Cpu.units(0.5),
        },
        memory: {
          request: Size.mebibytes(256),
          limit: Size.mebibytes(384),
        },
      },
      image: 'image',
    });

    expect(container._toKube().resources).toEqual({
      limits: {
        cpu: k8s.Quantity.fromString('0.5'),
        memory: k8s.Quantity.fromString('384Mi'),
      },
      requests: {
        cpu: k8s.Quantity.fromString('300m'),
        memory: k8s.Quantity.fromString('256Mi'),
      },
    });

  });

});

test('Can add only resource requests', () => {
  const container = new kplus.Container({
    resources: {
      cpu: {
        request: Cpu.millis(300),
      },
      memory: {
        request: Size.mebibytes(128),
      },
    },
    image: 'image',
  });

  expect(container._toKube().resources).toEqual({
    requests: {
      cpu: k8s.Quantity.fromString('300m'),
      memory: k8s.Quantity.fromString('128Mi'),
    },
  });
});

test('Can add only resource limits', () => {
  const container = new kplus.Container({
    resources: {
      cpu: {
        limit: Cpu.millis(500),
      },
      memory: {
        limit: Size.mebibytes(1024),
      },
    },
    image: 'image',
  });

  expect(container._toKube().resources).toEqual({
    limits: {
      cpu: k8s.Quantity.fromString('500m'),
      memory: k8s.Quantity.fromString('1024Mi'),
    },
  });
});

test('Can add only limits and requests on memory', () => {
  const container = new kplus.Container({
    resources: {
      memory: {
        limit: Size.mebibytes(1024),
        request: Size.mebibytes(512),
      },
    },
    image: 'image',
  });

  expect(container._toKube().resources).toEqual({
    limits: {
      memory: k8s.Quantity.fromString('1024Mi'),
    },
    requests: {
      memory: k8s.Quantity.fromString('512Mi'),
    },
  });
});

test('Can add only limits and requests on cpu', () => {
  const container = new kplus.Container({
    resources: {
      cpu: {
        limit: Cpu.units(1),
        request: Cpu.millis(250),
      },
    },
    image: 'image',
  });

  expect(container._toKube().resources).toEqual({
    limits: {
      cpu: k8s.Quantity.fromString('1'),
    },
    requests: {
      cpu: k8s.Quantity.fromString('250m'),
    },
  });
});

test('default security context', () => {

  const container = new Container({ image: 'image' });

  expect(container.securityContext.ensureNonRoot).toBeFalsy();
  expect(container.securityContext.privileged).toBeFalsy();
  expect(container.securityContext.readOnlyRootFilesystem).toBeFalsy();
  expect(container.securityContext.user).toBeUndefined();
  expect(container.securityContext.group).toBeUndefined();

  expect(container._toKube().securityContext).toEqual(container.securityContext._toKube());
  expect(container.securityContext._toKube()).toStrictEqual({
    privileged: container.securityContext.privileged,
    readOnlyRootFilesystem: container.securityContext.readOnlyRootFilesystem,
    runAsGroup: container.securityContext.group,
    runAsNonRoot: container.securityContext.ensureNonRoot,
    runAsUser: container.securityContext.user,
  });

});

test('custom security context', () => {

  const container = new Container({
    image: 'image',
    securityContext: {
      ensureNonRoot: true,
      readOnlyRootFilesystem: true,
      privileged: true,
      user: 1000,
      group: 2000,
    },
  });

  expect(container.securityContext.ensureNonRoot).toBeTruthy();
  expect(container.securityContext.privileged).toBeTruthy();
  expect(container.securityContext.readOnlyRootFilesystem).toBeTruthy();
  expect(container.securityContext.user).toEqual(1000);
  expect(container.securityContext.group).toEqual(2000);

});

test('can configure a postStart lifecycle hook', () => {

  const container = new Container({
    image: 'image',
    lifecycle: {
      postStart: Handler.fromCommand(['hello']),
    },
  });

  const spec = container._toKube();
  expect(spec.lifecycle!.postStart).toEqual({ exec: { command: ['hello'] } });

});

test('can configure a preStop lifecycle hook', () => {

  const container = new Container({
    image: 'image',
    lifecycle: {
      preStop: Handler.fromCommand(['hello']),
    },
  });

  const spec = container._toKube();
  expect(spec.lifecycle!.preStop).toEqual({ exec: { command: ['hello'] } });

});

