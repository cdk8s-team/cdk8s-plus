import { Testing } from 'cdk8s';
import * as kplus from '../src';

test('can add ingress rules for a managed pod', () => {

  const chart = Testing.chart();

  const web = new kplus.Pod(chart, 'Web', {
    containers: [{ image: 'web' }],
  });

  const policy = new kplus.NetworkPolicy(chart, 'Policy', {
    selector: web,
  });

});


test('can add ingress rules for an unmanaged pod', () => {

  const chart = Testing.chart();

  const web = kplus.Pod.labeled(kplus.LabelQuery.is('app', 'web'));

  const policy = new kplus.NetworkPolicy(chart, 'Policy', {
    selector: web,
  });

});
