import { Testing } from 'cdk8s';
import * as kplus from '../src';

test('can create a policy for a managed pod', () => {

  const chart = Testing.chart();
  const web = new kplus.Pod(chart, 'Web', {
    containers: [{ image: 'web' }],
  });

  new kplus.NetworkPolicy(chart, 'Policy', { selector: web });

  expect(Testing.synth(chart)).toMatchSnapshot();

});


test('can create a policy for a labeled pod', () => {

  const chart = Testing.chart();
  const web = kplus.Pod.labeled(kplus.LabelQuery.is('app', 'web'));

  new kplus.NetworkPolicy(chart, 'Policy', { selector: web });

  expect(Testing.synth(chart)).toMatchSnapshot();
});


test('can create a policy for all pods', () => {

  const chart = Testing.chart();
  const web = kplus.Pod.all();

  new kplus.NetworkPolicy(chart, 'Policy', { selector: web });

  expect(Testing.synth(chart)).toMatchSnapshot();
});
