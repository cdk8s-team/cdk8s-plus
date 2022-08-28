import { Testing, ApiObject, Duration, CronOptions } from 'cdk8s';
import { Node } from 'constructs';
import * as kplus from '../src';

test('defaultChild', () => {

  const chart = Testing.chart();

  const jobProperties = {};

  const cronOptions: CronOptions = {
    minute: '*',
    hour: '*',
    day: '*',
    month: '*',
    year: '*',
  };

  const defaultChild = Node.of(new kplus.CronJob(chart, 'CronJob', {
    jobProperties: jobProperties,
    schedule: cronOptions,
  })).defaultChild as ApiObject;

  expect(defaultChild.kind).toEqual('CronJob');
});

test('allow setting jobProperties / default configuration', () => {

  const chart = Testing.chart();

  const cronOptions: CronOptions = {
    minute: '*',
    hour: '*',
    day: '*',
    month: '*',
    year: '*',
  };

  new kplus.CronJob(chart, 'CronJob', {
    jobProperties: {
      activeDeadline: Duration.seconds(60),
      backoffLimit: 4,
    },
    schedule: cronOptions,
    containers: [{ image: 'image' }],
  });

  // assert the k8s spec has it.
  const manifest = Testing.synth(chart);
  expect(manifest).toMatchSnapshot();
  const spec = manifest[0].spec;

  console.log(`Spec: ${JSON.stringify(manifest, null, 2)}`);

  expect(spec.schedule).toEqual('* * * * *');
  expect(spec.concurrencyPolicy).toEqual('Forbid');
  expect(spec.timeZone).toEqual(undefined);
  expect(spec.startingDeadlineSeconds).toEqual(10);
  expect(spec.suspend).toEqual(false);
  expect(spec.successfulJobsHistoryLimit).toEqual(3);
  expect(spec.failedJobsHistoryLimit).toEqual(1);

  expect(spec.jobTemplate.spec.activeDeadlineSeconds).toEqual(60);
  expect(spec.jobTemplate.spec.backoffLimit).toEqual(4);
  expect(spec.jobTemplate.spec.template.spec.containers[0].image).toEqual('image');
});

test('allows setting all options', () => {

  const chart = Testing.chart();

  const cronOptions: CronOptions = {
    minute: '5',
    hour: '*',
    day: '*',
    month: '*',
    year: '*',
  };

  new kplus.CronJob(chart, 'CronJob', {
    jobProperties: {
      activeDeadline: Duration.seconds(60),
      backoffLimit: 4,
    },
    schedule: cronOptions,
    timeZone: 'America/Los_Angeles',
    concurrencyPolicy: kplus.ConcurrencyPolicy.ALLOW,
    startingDeadline: Duration.seconds(60),
    suspend: false,
    successfulJobsRetained: 3,
    failedJobsRetained: 3,
    containers: [{ image: 'image' }],
  });

  // assert the k8s spec has it.
  const manifest = Testing.synth(chart);
  expect(manifest).toMatchSnapshot();
  const spec = manifest[0].spec;

  console.log(`Spec: ${JSON.stringify(manifest, null, 2)}`);

  expect(spec.schedule).toEqual('5 * * * *');
  expect(spec.concurrencyPolicy).toEqual('Allow');
  expect(spec.timeZone).toEqual('America/Los_Angeles');
  expect(spec.startingDeadlineSeconds).toEqual(60);
  expect(spec.suspend).toEqual(false);
  expect(spec.successfulJobsHistoryLimit).toEqual(3);
  expect(spec.failedJobsHistoryLimit).toEqual(3);

  expect(spec.jobTemplate.spec.activeDeadlineSeconds).toEqual(60);
  expect(spec.jobTemplate.spec.backoffLimit).toEqual(4);
  expect(spec.jobTemplate.spec.template.spec.containers[0].image).toEqual('image');
});