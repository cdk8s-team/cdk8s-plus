import { Testing, ApiObject } from 'cdk8s';
import { Node } from 'constructs';
import * as kplus from '../src';
import { DockerConfigSecret, FsGroupChangePolicy, Probe } from '../src';
import * as k8s from '../src/imports/k8s';

test('fails with two volumes with the same name', () => {

  const chart = Testing.chart();

  const cm1 = new kplus.ConfigMap(chart, 'cm1', { data: { f1: 'f1-content' } });
  const cm2 = new kplus.ConfigMap(chart, 'cm2', { data: { f2: 'f2-content' } });

  const v1 = kplus.Volume.fromConfigMap(cm1, { name: 'v' });
  const v2 = kplus.Volume.fromConfigMap(cm2, { name: 'v' });

  expect(() => new kplus.Pod(chart, 'Pod', { volumes: [v1, v2] })).toThrow('Volume with name v already exists');

});

test('fails adding a volume with the same name', () => {

  const chart = Testing.chart();

  const cm1 = new kplus.ConfigMap(chart, 'cm1', { data: { f1: 'f1-content' } });
  const cm2 = new kplus.ConfigMap(chart, 'cm2', { data: { f2: 'f2-content' } });

  const v1 = kplus.Volume.fromConfigMap(cm1, { name: 'v' });
  const v2 = kplus.Volume.fromConfigMap(cm2, { name: 'v' });

  const pod = new kplus.Pod(chart, 'Pod');
  pod.addVolume(v1);

  expect(() => pod.addVolume(v2)).toThrow('Volume with name v already exists');

});

test('fails with a container that has mounts with different volumes of the same name', () => {

  const chart = Testing.chart();

  const cm1 = new kplus.ConfigMap(chart, 'cm1', { data: { f1: 'f1-content' } });
  const cm2 = new kplus.ConfigMap(chart, 'cm2', { data: { f2: 'f2-content' } });

  const v1 = kplus.Volume.fromConfigMap(cm1, { name: 'v' });
  const v2 = kplus.Volume.fromConfigMap(cm2, { name: 'v' });

  new kplus.Pod(chart, 'Pod', {
    containers: [{
      image: 'nginx',
      volumeMounts: [
        {
          volume: v1,
          path: 'f1',
          subPath: 'f1',
        },
        {
          volume: v2,
          path: 'f2',
          subPath: 'f2',
        },
      ],
    }],
  });

  expect(() => Testing.synth(chart)).toThrow('Invalid mount configuration. At least two different volumes have the same name: v');

});

test('can configure multiple mounts with the same volume', () => {

  const chart = Testing.chart();

  const configMap = new kplus.ConfigMap(chart, 'Config', {
    data: {
      f1: 'f1-content',
      f2: 'f2-content',
    },
  });

  const volume = kplus.Volume.fromConfigMap(configMap);

  new kplus.Pod(chart, 'Pod', {
    containers: [
      {
        image: 'image',
        volumeMounts: [
          {
            volume: volume,
            path: 'f1',
            subPath: 'f1',
          },
          {
            volume: volume,
            path: 'f2',
            subPath: 'f2',
          },
        ],
      },
    ],
  });

  const podSpec = Testing.synth(chart).filter(r => r.kind === 'Pod')[0].spec;

  expect(podSpec.volumes).toEqual([{
    configMap: {
      name: 'test-config-c8c927dd',
    },
    name: 'configmap-test-config-c8c927dd',
  }]);

});

test('defaultChild', () => {

  const chart = Testing.chart();

  const defaultChild = Node.of(new kplus.Pod(chart, 'Pod')).defaultChild as ApiObject;

  expect(defaultChild.kind).toEqual('Pod');

});

test('Can add container post instantiation', () => {

  const chart = Testing.chart();

  const pod = new kplus.Pod(chart, 'Pod');
  pod.addContainer({ image: 'image' });

  const spec = Testing.synth(chart)[0].spec;

  expect(spec.containers[0].image).toEqual('image');

});

test('Must have at least one container', () => {

  const chart = Testing.chart();

  new kplus.Pod(chart, 'Pod');

  expect(() => Testing.synth(chart)).toThrow(
    'PodSpec must have at least 1 container',
  );

});

test('Can add volume post instantiation', () => {

  const chart = Testing.chart();

  const pod = new kplus.Pod(chart, 'Pod', {
    containers: [
      { image: 'image' },
    ],
  });

  const volume = kplus.Volume.fromEmptyDir('volume');
  pod.addVolume(volume);

  const spec = Testing.synth(chart)[0].spec;

  expect(spec.volumes[0].name).toEqual('volume');
  expect(spec.volumes[0].emptyDir).toBeTruthy();
});

test('Automatically adds volumes from container mounts', () => {

  const chart = Testing.chart();

  const pod = new kplus.Pod(chart, 'Pod');

  const volume = kplus.Volume.fromEmptyDir('volume');

  const container = pod.addContainer({ image: 'image' });
  container.mount('/path/to/mount', volume);

  const spec = Testing.synth(chart)[0].spec;

  expect(spec.volumes[0].name).toEqual('volume');
  expect(spec.volumes[0].emptyDir).toBeTruthy();

});

test('Synthesizes spec lazily', () => {

  const chart = Testing.chart();

  const pod = new kplus.Pod(chart, 'Pod', {});

  pod.addContainer({ image: 'image' });

  const spec = Testing.synth(chart)[0].spec;

  expect(spec.containers[0].image).toEqual('image');

});

test('init containers cannot have liveness probe', () => {

  const chart = Testing.chart();
  const pod = new kplus.Pod(chart, 'Pod', { containers: [{ image: 'image' }] });

  expect(() => pod.addInitContainer({ image: 'image', liveness: Probe.fromTcpSocket() })).toThrow('Init containers must not have a liveness probe');

});

test('init containers cannot have readiness probe', () => {

  const chart = Testing.chart();
  const pod = new kplus.Pod(chart, 'Pod', { containers: [{ image: 'image' }] });

  expect(() => pod.addInitContainer({ image: 'image', readiness: Probe.fromTcpSocket() })).toThrow('Init containers must not have a readiness probe');

});

test('init containers cannot have startup probe', () => {

  const chart = Testing.chart();
  const pod = new kplus.Pod(chart, 'Pod', { containers: [{ image: 'image' }] });

  expect(() => pod.addInitContainer({ image: 'image', startup: Probe.fromTcpSocket() })).toThrow('Init containers must not have a startup probe');

});

test('can specify init containers at instantiation', () => {

  const chart = Testing.chart();

  new kplus.Pod(chart, 'Pod', {
    containers: [{ image: 'image' }],
    initContainers: [{ image: 'image' }],
  });

  const spec = Testing.synth(chart)[0].spec;

  expect(spec.initContainers[0].image).toEqual('image');

});

test('can add init container post instantiation', () => {

  const chart = Testing.chart();

  const pod = new kplus.Pod(chart, 'Pod', {
    containers: [{ image: 'image' }],
  });
  pod.addInitContainer({ image: 'image' });

  const spec = Testing.synth(chart)[0].spec;

  expect(spec.initContainers[0].image).toEqual('image');

});

test('init container names are indexed', () => {

  const chart = Testing.chart();

  const pod = new kplus.Pod(chart, 'Pod', {
    containers: [{ image: 'image' }],
  });

  pod.addInitContainer({ image: 'image1' });
  pod.addInitContainer({ image: 'image2' });

  const spec = Testing.synth(chart)[0].spec;

  expect(spec.initContainers[0].name).toEqual('init-0');
  expect(spec.initContainers[1].name).toEqual('init-1');

});

test('automatically adds volumes from init container mounts', () => {

  const chart = Testing.chart();

  const pod = new kplus.Pod(chart, 'Pod', {
    containers: [{ image: 'image' }],
  });

  const volume = kplus.Volume.fromEmptyDir('volume');

  const container = pod.addInitContainer({ image: 'image' });
  container.mount('/path/to/mount', volume);

  const spec = Testing.synth(chart)[0].spec;

  expect(spec.volumes[0].name).toEqual('volume');
  expect(spec.volumes[0].emptyDir).toBeTruthy();

});

test('default security context', () => {

  const chart = Testing.chart();

  const pod = new kplus.Pod(chart, 'Pod', {
    containers: [{ image: 'image' }],
  });

  const spec = Testing.synth(chart)[0].spec;

  expect(pod.securityContext.ensureNonRoot).toBeFalsy();
  expect(pod.securityContext.sysctls).toEqual([]);
  expect(pod.securityContext.fsGroup).toBeUndefined();
  expect(pod.securityContext.fsGroupChangePolicy).toEqual(FsGroupChangePolicy.ALWAYS);
  expect(pod.securityContext.user).toBeUndefined();
  expect(pod.securityContext.group).toBeUndefined();

  expect(spec.securityContext).toEqual(pod.securityContext._toKube());
  expect(spec.securityContext).toStrictEqual({
    // undefined values are ommitted at synth
    fsGroupChangePolicy: pod.securityContext.fsGroupChangePolicy.toString(),
    runAsNonRoot: pod.securityContext.ensureNonRoot,
    sysctls: pod.securityContext.sysctls,
  });

});

test('custom security context', () => {

  const chart = Testing.chart();

  const pod = new kplus.Pod(chart, 'Pod', {
    containers: [{ image: 'image' }],
    securityContext: {
      ensureNonRoot: true,
      fsGroup: 5000,
      fsGroupChangePolicy: FsGroupChangePolicy.ON_ROOT_MISMATCH,
      group: 2000,
      user: 1000,
      sysctls: [{ name: 's1', value: 'v1' }],
    },
  });

  expect(pod.securityContext.ensureNonRoot).toBeTruthy();
  expect(pod.securityContext.sysctls).toEqual([{ name: 's1', value: 'v1' }]);
  expect(pod.securityContext.fsGroup).toEqual(5000);
  expect(pod.securityContext.fsGroupChangePolicy).toEqual(FsGroupChangePolicy.ON_ROOT_MISMATCH);
  expect(pod.securityContext.user).toEqual(1000);
  expect(pod.securityContext.group).toEqual(2000);

});

test('custom host aliases', () => {

  const chart = Testing.chart();

  const pod = new kplus.Pod(chart, 'Pod', {
    containers: [{ image: 'image' }],
    hostAliases: [{ ip: '127.0.0.1', hostnames: ['foo.local', 'bar.local'] }],
  });
  pod.addHostAlias({ ip: '10.1.2.3', hostnames: ['foo.remote', 'bar.remote'] });

  const spec = Testing.synth(chart)[0].spec;

  expect(spec.hostAliases).toEqual([
    { ip: '127.0.0.1', hostnames: ['foo.local', 'bar.local'] },
    { ip: '10.1.2.3', hostnames: ['foo.remote', 'bar.remote'] },
  ]);

});

test('default dns settings', () => {

  const chart = Testing.chart();

  const pod = new kplus.Pod(chart, 'Pod', {
    containers: [{ image: 'image' }],
  });

  expect(pod.dns.hostname).toBeUndefined();
  expect(pod.dns.subdomain).toBeUndefined();
  expect(pod.dns.hostnameAsFQDN).toBeFalsy();
  expect(pod.dns.policy).toEqual(kplus.DnsPolicy.CLUSTER_FIRST);
  expect(pod.dns.searches).toEqual([]);
  expect(pod.dns.nameservers).toEqual([]);
  expect(pod.dns.options).toEqual([]);

  const spec = Testing.synth(chart)[0].spec;
  expect(spec.hostname).toBeUndefined();
  expect(spec.subdomain).toBeUndefined();
  expect(spec.setHostnameAsFQDN).toBeFalsy();
  expect(spec.dnsPolicy).toEqual('ClusterFirst');
  expect(spec.dnsConfig.searches).toEqual([]);
  expect(spec.dnsConfig.nameservers).toEqual([]);
  expect(spec.dnsConfig.options).toEqual([]);

});

test('custom dns settings', () => {

  const chart = Testing.chart();

  const pod = new kplus.Pod(chart, 'Pod', {
    containers: [{ image: 'image' }],
    dns: {
      hostname: 'hostname',
      subdomain: 'subdomain',
      hostnameAsFQDN: true,
      nameservers: ['n1'],
      searches: ['s1'],
      options: [{ name: 'opt1', value: 'opt1-value' }],
      policy: kplus.DnsPolicy.DEFAULT,
    },
  });

  pod.dns.addNameserver('n2');
  pod.dns.addSearch('s2');
  pod.dns.addOption({ name: 'opt2' });

  expect(pod.dns.hostname).toEqual('hostname');
  expect(pod.dns.subdomain).toEqual('subdomain');
  expect(pod.dns.hostnameAsFQDN).toBeTruthy();
  expect(pod.dns.policy).toEqual(kplus.DnsPolicy.DEFAULT);
  expect(pod.dns.searches).toEqual(['s1', 's2']);
  expect(pod.dns.nameservers).toEqual(['n1', 'n2']);
  expect(pod.dns.options).toEqual([{ name: 'opt1', value: 'opt1-value' }, { name: 'opt2' }]);

  const spec = Testing.synth(chart)[0].spec;
  expect(spec.hostname).toEqual('hostname');
  expect(spec.subdomain).toEqual('subdomain');
  expect(spec.setHostnameAsFQDN).toBeTruthy();
  expect(spec.dnsPolicy).toEqual(kplus.DnsPolicy.DEFAULT);
  expect(spec.dnsConfig.searches).toEqual(['s1', 's2']);
  expect(spec.dnsConfig.nameservers).toEqual(['n1', 'n2']);
  expect(spec.dnsConfig.options).toEqual([{ name: 'opt1', value: 'opt1-value' }, { name: 'opt2' }]);

});

test('throws if more than 3 nameservers are configured', () => {

  const chart = Testing.chart();

  new kplus.Pod(chart, 'Pod', {
    containers: [{ image: 'image' }],
    dns: {
      nameservers: ['n1', 'n2', 'n3', 'n4'],
    },
  });

  expect(() => Testing.synth(chart)).toThrow('There can be at most 3 nameservers specified');
});

test('throws if more than 6 search domains are configured', () => {

  const chart = Testing.chart();

  new kplus.Pod(chart, 'Pod', {
    containers: [{ image: 'image' }],
    dns: {
      searches: ['s1', 's2', 's3', 's4', 's5', 's6', 's7'],
    },
  });

  expect(() => Testing.synth(chart)).toThrow('There can be at most 6 search domains specified');

});

test('throws if no nameservers are given when dns policy is set to NONE', () => {

  const chart = Testing.chart();

  new kplus.Pod(chart, 'Pod', {
    containers: [{ image: 'image' }],
    dns: {
      policy: kplus.DnsPolicy.NONE,
    },
  });

  expect(() => Testing.synth(chart)).toThrow('When dns policy is set to NONE, at least one nameserver is required');

});

test('can configure auth to docker registry', () => {

  const chart = Testing.chart();

  const auth = new DockerConfigSecret(chart, 'Secret', {
    data: { foo: 'bar' },
  });

  new kplus.Pod(chart, 'Pod', {
    containers: [{ image: 'image' }],
    dockerRegistryAuth: auth,
  });

  const spec: k8s.PodSpec = Testing.synth(chart)[1].spec;

  expect(spec.imagePullSecrets).toEqual([{ name: auth.name }]);

});

test('auto mounting token defaults to true', () => {

  const chart = Testing.chart();
  const pod = new kplus.Pod(chart, 'Pod', {
    containers: [{ image: 'image' }],
  });

  const spec: k8s.PodSpec = Testing.synth(chart)[0].spec;

  expect(pod.automountServiceAccountToken).toBeTruthy();
  expect(spec.automountServiceAccountToken).toBeTruthy();

});

test('auto mounting token can be disabled', () => {

  const chart = Testing.chart();
  const pod = new kplus.Pod(chart, 'Pod', {
    containers: [{ image: 'image' }],
    automountServiceAccountToken: false,
  });

  const spec: k8s.PodSpec = Testing.synth(chart)[0].spec;

  expect(pod.automountServiceAccountToken).toBeFalsy();
  expect(spec.automountServiceAccountToken).toBeFalsy();

});

test('can assign a pod to a node by name', () => {

  const chart = Testing.chart();
  const pod = new kplus.Pod(chart, 'Pod', {
    containers: [{ image: 'image' }],
    automountServiceAccountToken: false,
    nodeAssignment: {
      name: 'node1',
    },
  });

  const spec: k8s.PodSpec = Testing.synth(chart)[0].spec;

  expect(pod.nodeName).toEqual('node1');
  expect(spec.nodeName).toEqual('node1');

});

test('can assign a pod to a node by selectors at instantiation', () => {

  // example based on https://raw.githubusercontent.com/kubernetes/website/main/content/en/examples/pods/pod-with-node-affinity.yaml
  const chart = Testing.chart();
  new kplus.Pod(chart, 'Pod', {
    containers: [{ image: 'image' }],
    automountServiceAccountToken: false,
    nodeAssignment: {
      requirements: [
        { selectors: [kplus.NodeSelector.is('kubernetes.io/os', 'linux')] },
        { selectors: [kplus.NodeSelector.in('another-node-label-key', ['another-node-label-value'])], weight: 1 },
      ],
    },
  });

  const spec: k8s.PodSpec = Testing.synth(chart)[0].spec;

  expect(spec.affinity!.nodeAffinity).toEqual({
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
  const pod = new kplus.Pod(chart, 'Pod', {
    containers: [{ image: 'image' }],
    automountServiceAccountToken: false,
  });

  pod.assignNode([kplus.NodeSelector.is('kubernetes.io/os', 'linux')]);
  pod.assignNode([kplus.NodeSelector.in('another-node-label-key', ['another-node-label-value'])], 1);

  const spec: k8s.PodSpec = Testing.synth(chart)[0].spec;

  expect(spec.affinity!.nodeAffinity).toEqual({
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
