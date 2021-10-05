import { Testing, ApiObject } from 'cdk8s';
import { Node } from 'constructs';
import * as kplus from '../src';
import * as k8s from '../src/imports/k8s';

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

test('Can select by label', () => {

  const chart = Testing.chart();

  const service = new kplus.Service(chart, 'service', {
    ports: [{ port: 9000 }],
  });

  service.addSelector('key', 'value');

  // assert the k8s spec has it.
  const spec = Testing.synth(chart)[0].spec;
  expect(spec.selector).toEqual({ key: 'value' });

  // assert the service object has it.
  expect(service.selector).toEqual({ key: 'value' });

});

test('Can serve by port', () => {

  const chart = Testing.chart();

  const service = new kplus.Service(chart, 'service');

  service.serve(9000, { targetPort: 80, nodePort: 30080 });

  // assert the k8s spec has it.
  const spec = Testing.synth(chart)[0].spec;
  expect(spec.ports).toEqual([{ port: 9000, targetPort: 80, nodePort: 30080 }]);

  // assert the service object has it.
  expect(service.ports).toEqual([{ port: 9000, targetPort: 80, nodePort: 30080 }]);

});

test('Cannot add a deployment if the deployment does not have any containers', () => {

  const chart = Testing.chart();

  const service = new kplus.Service(chart, 'service');
  const deployment = new kplus.Deployment(chart, 'dep');

  // THEN
  expect(() => service.addDeployment(deployment))
    .toThrow(/Cannot expose a deployment without containers/);

});

test('Synthesizes spec lazily', () => {

  const chart = Testing.chart();

  const service = new kplus.Service(chart, 'Service');

  service.addSelector('key', 'value');
  service.serve(9000);

  const spec = Testing.synth(chart)[0].spec;
  expect(spec.selector).toEqual({ key: 'value' });
  expect(spec.ports).toEqual([{ port: 9000 }]);

});

test('Can associate a deployment with an existing service', () => {

  const chart = Testing.chart();

  const service = new kplus.Service(chart, 'service');
  const deployment = new kplus.Deployment(chart, 'dep');
  deployment.addContainer({ image: 'foo', port: 7777 });

  service.addDeployment(deployment);

  const expectedSelector = { 'cdk8s.deployment': 'test-dep-c8cc9f8f' };

  const deploymentSpec: k8s.DeploymentSpec = Testing.synth(chart)[1].spec;
  const serviceSpec: k8s.ServiceSpec = Testing.synth(chart)[0].spec;
  expect(deploymentSpec.selector.matchLabels).toEqual(expectedSelector);
  expect(deploymentSpec.template.metadata?.labels).toEqual(expectedSelector);
  expect(serviceSpec.selector).toEqual(expectedSelector);
  expect(serviceSpec.ports![0].port).toEqual(7777);
  expect(serviceSpec.ports![0].targetPort).toEqual(7777);

});

test('Cannot add a deployment if it does not have a label selector', () => {

  const chart = Testing.chart();

  const service = new kplus.Service(chart, 'service');
  const deployment = new kplus.Deployment(chart, 'dep', {
    defaultSelector: false,
    containers: [{ image: 'foo' }],
  });

  expect(() => service.addDeployment(deployment, { port: 1122 }))
    .toThrow(/deployment does not have a label selector/);

});

test('Cannot add a deployment if a selector is already defined for this service', () => {

  const chart = Testing.chart();
  const service = new kplus.Service(chart, 'service');

  const deployment = new kplus.Deployment(chart, 'dep1', {
    containers: [{ image: 'foo' }],
  });
  service.addSelector('random', 'selector');

  // THEN
  expect(() => service.addDeployment(deployment, { port: 1010 }))
    .toThrow(/a selector is already defined for this service. cannot add a deployment/);

});

test('Must set externalIPs if provided', () => {

  const chart = Testing.chart();
  const externalIPs = ['1.1.1.1', '8.8.8.8'];
  const service = new kplus.Service(chart, 'service', { externalIPs });
  service.serve(53);

  const spec = Testing.synth(chart)[0].spec;

  expect(spec.externalIPs).toEqual(externalIPs);

});

test('Must be configured with externalName if type is EXTERNAL_NAME', () => {

  const chart = Testing.chart();

  const service = new kplus.Service(chart, 'service', {
    type: kplus.ServiceType.EXTERNAL_NAME,
  });

  service.serve(5432);

  expect(() => Testing.synth(chart)).toThrowError(
    'A service with type EXTERNAL_NAME requires an externalName prop',
  );

});

test('Type defaults to EXTERNAL_NAME if externalName if given', () => {

  const chart = Testing.chart();

  const service = new kplus.Service(chart, 'service', {
    externalName: 'test-external-name',
  });

  service.serve(5432);

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
  service.serve(80);

  service.exposeViaIngress('/hello');
  const ingress = Testing.synth(chart)[1];
  expect(ingress).toMatchSnapshot();
});
