import { Testing, ApiObject } from 'cdk8s';
import { Construct } from 'constructs';
import { Resource, ResourceProps, k8s } from '../src';

test('Can mutate metadata', () => {

  interface CustomProps extends ResourceProps {

  }

  class Custom extends Resource {

    public readonly apiObject: ApiObject;

    public readonly resourceType = 'configmaps';

    constructor(scope: Construct, id: string, props: CustomProps) {
      super(scope, id);

      this.apiObject = new k8s.KubeConfigMap(this, 'ConfigMap', {
        metadata: props.metadata,
      });
    }
  }

  const chart = Testing.chart();

  const custom = new Custom(chart, 'Custom', {});

  custom.metadata.addLabel('key', 'value');

  expect(Testing.synth(chart)).toStrictEqual([{
    apiVersion: 'v1',
    kind: 'ConfigMap',
    metadata: {
      labels: {
        key: 'value',
      },
      name: 'test-custom-configmap-c8a1da6c',
    },
  }]);

});