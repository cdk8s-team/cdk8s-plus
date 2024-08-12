import { Testing, ApiObject } from 'cdk8s';
import { Node } from 'constructs';
import * as kplus from '../src';

test('defaultChild', () => {

  const chart = Testing.chart();

  const defaultChild = Node.of(new kplus.Service(chart, 'Service')).defaultChild as ApiObject;

  expect(defaultChild.kind).toEqual('Service');

});

test('Must be configured with at least one port', () => {

  const chart = Testing.chart();

  new kplus.Service(chart, 'service');

  expect(() => Testing.synth(chart)).toThrowError(
    'A service must be configured with a port',
  );

});

test('Can provide cluster IP', () => {
  // GIVEN
  const chart = Testing.chart();

  // WHEN
  new kplus.Service(chart, 'service', {
    ports: [{ port: 9000 }],
    clusterIP: '3000',
  });

  // THEN
  const spec = Testing.synth(chart)[0].spec;
  expect(spec).toEqual({
    clusterIP: '3000',
    externalIPs: [],
    ports: [
      {
        port: 9000,
      },
    ],
    selector: {},
    type: 'ClusterIP',
  });
});

test('can select a deployment', () => {

  const chart = Testing.chart();

  const deployment = new kplus.Deployment(chart, 'Deployment', {
    containers: [{ image: 'image' }],
  });

  new kplus.Service(chart, 'service', {
    ports: [{ port: 9000 }],
    selector: deployment,
  });

  expect(Testing.synth(chart)).toMatchSnapshot();

});

test('Can select by label', () => {

  const chart = Testing.chart();

  const service = new kplus.Service(chart, 'service', {
    ports: [{ port: 9000 }],
  });

  service.selectLabel('key', 'value');

  // assert the k8s spec has it.
  const spec = Testing.synth(chart)[0].spec;
  expect(spec.selector).toEqual({ key: 'value' });

});

test('Can serve by port', () => {

  const chart = Testing.chart();

  const service = new kplus.Service(chart, 'service');

  service.bind(9000, { targetPort: 80, nodePort: 30080 });

  // assert the k8s spec has it.
  const spec = Testing.synth(chart)[0].spec;
  expect(spec.ports).toEqual([{ port: 9000, targetPort: 80, nodePort: 30080 }]);

  // assert the service object has it.
  expect(service.ports).toEqual([{ port: 9000, targetPort: 80, nodePort: 30080 }]);

});

test('Synthesizes spec lazily', () => {

  const chart = Testing.chart();

  const service = new kplus.Service(chart, 'Service');

  service.select(kplus.Pods.select(chart, 'Pods', { labels: { key: 'value' } }));
  service.bind(9000);

  const spec = Testing.synth(chart)[0].spec;
  expect(spec.selector).toEqual({ key: 'value' });
  expect(spec.ports).toEqual([{ port: 9000 }]);

});

test('Must set externalIPs if provided', () => {

  const chart = Testing.chart();
  const externalIPs = ['1.1.1.1', '8.8.8.8'];
  const service = new kplus.Service(chart, 'service', { externalIPs });
  service.bind(53);

  const spec = Testing.synth(chart)[0].spec;

  expect(spec.externalIPs).toEqual(externalIPs);

});

test('Must be configured with externalName if type is EXTERNAL_NAME', () => {

  const chart = Testing.chart();

  const service = new kplus.Service(chart, 'service', {
    type: kplus.ServiceType.EXTERNAL_NAME,
  });

  service.bind(5432);

  expect(() => Testing.synth(chart)).toThrowError(
    'A service with type EXTERNAL_NAME requires an externalName prop',
  );

});

test('Type defaults to EXTERNAL_NAME if externalName if given', () => {

  const chart = Testing.chart();

  const service = new kplus.Service(chart, 'service', {
    externalName: 'test-external-name',
  });

  service.bind(5432);

  const spec = Testing.synth(chart)[0].spec;

  expect(spec.type).toEqual(kplus.ServiceType.EXTERNAL_NAME);

});

test('Can restrict CIDR IP addresses for a LoadBalancer type', () => {
  const sourceRanges = ['143.231.0.0/16'];
  const chart = Testing.chart();
  new kplus.Service(chart, 'service', {
    ports: [{ port: 80 }],
    type: kplus.ServiceType.LOAD_BALANCER,
    loadBalancerSourceRanges: sourceRanges,
  });

  // assert the k8s spec has it.
  const spec = Testing.synth(chart)[0].spec;
  expect(spec.loadBalancerSourceRanges).toEqual(sourceRanges);

});

test('can be exposed by an ingress', () => {

  const chart = Testing.chart();

  const service = new kplus.Service(chart, 'Service');
  service.bind(80);

  service.exposeViaIngress('/hello');
  const ingress = Testing.synth(chart)[1];
  expect(ingress).toMatchSnapshot();
});

test('can set publishNotReadyAddresses', () => {
  const chart = Testing.chart();
  new kplus.Service(chart, 'service', {
    ports: [{ port: 80 }],
    publishNotReadyAddresses: true,
  });

  const spec = Testing.synth(chart)[0].spec;
  expect(spec.publishNotReadyAddresses).toBeTruthy();
});
