import { Testing, ApiObject, Duration, Size } from 'cdk8s';
import { Node } from 'constructs';
import * as kplus from '../src';
import { StatefulSetUpdateStrategy, k8s, Volume } from '../src';

test('defaultChild', () => {

  const chart = Testing.chart();

  const service = new kplus.Service(chart, 'TestService', { ports: [{ port: 80 }] });
  const defaultChild = Node.of(new kplus.StatefulSet(chart, 'StatefulSet', { service })).defaultChild as ApiObject;

  expect(defaultChild.kind).toEqual('StatefulSet');

});

test('A label selector is automatically allocated', () => {

  const chart = Testing.chart();

  const service = new kplus.Service(chart, 'TestService', { ports: [{ port: 80 }] });

  const statefulset = new kplus.StatefulSet(chart, 'StatefulSet', { service });
  statefulset.addContainer({ image: 'foobar' });

  const expectedValue = 'test-StatefulSet-c809b559';
  const expectedSelector = { 'cdk8s.io/metadata.addr': expectedValue };

  // assert the k8s spec has it.
  const spec = Testing.synth(chart)[1].spec;
  expect(spec.selector.matchLabels).toEqual(expectedSelector);
  expect(spec.template.metadata?.labels).toEqual(expectedSelector);

  // assert the statefulset object has it.
  expect(statefulset.matchLabels).toEqual(expectedSelector);

});

test('No selector is generated if "select" is false', () => {

  const chart = Testing.chart();

  const service = new kplus.Service(chart, 'TestService', { ports: [{ port: 80 }] });
  const statefulset = new kplus.StatefulSet(chart, 'StatefulSet', {
    select: false,
    containers: [{ image: 'foobar' }],
    service: service,
  });

  // assert the k8s spec doesnt have it.
  const spec = Testing.synth(chart)[1].spec;
  expect(spec.selector.matchLabels).toBeUndefined();

  // assert the statefulset object doesnt have it.
  expect(statefulset.matchLabels).toEqual({});

});

test('Can select by label', () => {

  const chart = Testing.chart();

  const service = new kplus.Service(chart, 'TestService', { ports: [{ port: 80 }] });
  const statefulset = new kplus.StatefulSet(chart, 'StatefulSet', {
    containers: [
      {
        image: 'image',
      },
    ],
    select: false,
    service,
  });

  const expectedSelector = { foo: 'bar' };

  statefulset.select(kplus.LabelSelector.of({ labels: { foo: expectedSelector.foo } }));

  // assert the k8s spec has it.
  const spec = Testing.synth(chart)[1].spec;
  expect(spec.selector.matchLabels).toEqual(expectedSelector);

  // assert the statefulset object has it.
  expect(statefulset.matchLabels).toEqual(expectedSelector);

});

test('StatefulSet gets defaults', () => {

  const chart = Testing.chart();

  new kplus.StatefulSet(chart, 'StatefulSet', {
    containers: [{ image: 'image', portNumber: 6000 }],
  });

  expect(Testing.synth(chart)).toMatchSnapshot();
});


test('StatefulSet allows overrides', () => {

  const chart = Testing.chart();

  const service = new kplus.Service(chart, 'TestService', {
    metadata: { name: 'test-srv' },
    type: kplus.ServiceType.NODE_PORT,
    ports: [{ port: 9000, targetPort: 9900 }],
  });
  new kplus.StatefulSet(chart, 'StatefulSet', {
    containers: [{ image: 'image' }],
    replicas: 5,
    podManagementPolicy: kplus.PodManagementPolicy.PARALLEL,
    minReady: Duration.seconds(30),
    service,
  });

  const resources = Testing.synth(chart);
  const setSpec = resources[1].spec;
  expect(setSpec.replicas).toEqual(5);
  expect(setSpec.serviceName).toEqual('test-srv');
  expect(setSpec.podManagementPolicy).toEqual(kplus.PodManagementPolicy.PARALLEL);
  expect(setSpec.minReadySeconds).toEqual(30);
});


test('Synthesizes spec lazily', () => {

  const chart = Testing.chart();

  const service = new kplus.Service(chart, 'TestService', { ports: [{ port: 9300 }] });
  const statefulset = new kplus.StatefulSet(chart, 'StatefulSet', { service });
  statefulset.addContainer(
    {
      image: 'image',
      port: 9300,
    },
  );

  const container = Testing.synth(chart)[1].spec.template.spec.containers[0];

  expect(container.image).toEqual('image');
  expect(container.ports[0].containerPort).toEqual(9300);
});

test('default update strategy', () => {

  const chart = Testing.chart();

  const service = new kplus.Service(chart, 'Service', {
    ports: [{ port: 80 }],
  });

  const set = new kplus.StatefulSet(chart, 'StatefulSet', { service });
  set.addContainer({ image: 'image' });

  const spec: k8s.StatefulSetSpec = Testing.synth(chart)[1].spec;

  expect(set.strategy).toEqual(kplus.StatefulSetUpdateStrategy.rollingUpdate());
  expect(spec.updateStrategy).toEqual({
    type: 'RollingUpdate',
    rollingUpdate: {
      partition: 0,
    },
  });

});

test('custom update strategy', () => {

  const chart = Testing.chart();

  const service = new kplus.Service(chart, 'Service', {
    ports: [{ port: 80 }],
  });

  const set = new kplus.StatefulSet(chart, 'StatefulSet', {
    service,
    strategy: StatefulSetUpdateStrategy.onDelete(),
  });
  set.addContainer({ image: 'image' });

  const spec: k8s.StatefulSetSpec = Testing.synth(chart)[1].spec;

  expect(set.strategy).toEqual(kplus.StatefulSetUpdateStrategy.onDelete());
  expect(spec.updateStrategy).toEqual({ type: 'OnDelete' });

});

test('Can be isolated', () => {

  const chart = Testing.chart();

  const service = new kplus.Service(chart, 'Service', {
    ports: [{ port: 80 }],
  });

  new kplus.StatefulSet(chart, 'StatefulSet', {
    containers: [{ image: 'foobar' }],
    service: service,
    isolate: true,
  });

  const manifest = Testing.synth(chart);
  expect(manifest).toMatchSnapshot();

  const networkPolicy = manifest[2].spec;
  expect(networkPolicy.podSelector.matchLabels).toBeDefined;
  expect(networkPolicy.policyTypes).toEqual(['Egress', 'Ingress']);
});

test('volumeClaimTemplates', () => {
  const chart = Testing.chart();
  const secret = new kplus.Secret(chart, 'AwsSecret');
  new kplus.StatefulSet(chart, 'StatefulSet', {
    containers: [
      {
        image: 'foobar',
        portNumber: 80,
        volumeMounts: [
          {
            volume: Volume.fromName(chart, 'data', 'data'),
            path: '/mnt/data',
          }, {
            volume: Volume.fromName(chart, 'temp', 'temp'),
            path: '/mnt/temp',
          }, {
            volume: Volume.fromSecret(chart, 'secret', secret),
            path: '/mnt/secret',
          },
        ],
      },
    ],
    volumeClaimTemplates: [{
      name: 'data',
      storage: Size.gibibytes(20),
      accessModes: [kplus.PersistentVolumeAccessMode.READ_WRITE_ONCE_POD],
      storageClassName: 'standard',
    }],
  }).addVolumeClaimTemplate({
    name: 'temp',
    storage: Size.gibibytes(20),
    accessModes: [kplus.PersistentVolumeAccessMode.READ_WRITE_ONCE_POD],
    storageClassName: 'standard',
  });

  const synthesized = Testing.synth(chart);
  const spec: k8s.StatefulSetSpec = synthesized[2].spec;
  expect(spec.template.spec?.volumes).toEqual([{
    name: 'secret-test-awssecret-c8d3e80d',
    secret: { secretName: 'test-awssecret-c8d3e80d' },
  }]);
  expect(spec.volumeClaimTemplates).toEqual([
    {
      metadata: { name: 'data' },
      spec: {
        accessModes: ['ReadWriteOncePod'],
        resources: { requests: { storage: '20Gi' } },
        storageClassName: 'standard',
      },
    },
    {
      metadata: { name: 'temp' },
      spec: {
        accessModes: ['ReadWriteOncePod'],
        resources: { requests: { storage: '20Gi' } },
        storageClassName: 'standard',
      },
    },
  ]);

  expect(Testing.synth(chart)).toMatchSnapshot();
});
