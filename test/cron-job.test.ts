import { Testing, ApiObject, Duration, CronOptions } from 'cdk8s';
import { Node } from 'constructs';
import * as kplus from '../src';

test('defaultChild', () => {

  const chart = Testing.chart();

  const jobProperties = {};

  const defaultChild = Node.of(new kplus.CronJob(chart, 'CronJob', {
    jobProperties: jobProperties,
  })).defaultChild as ApiObject;

  expect(defaultChild.kind).toEqual('CronJob');
});

test('allow setting jobProperties / default configuration', () => {

  const chart = Testing.chart();

  new kplus.CronJob(chart, 'CronJob', {
    jobProperties: {
      activeDeadline: Duration.seconds(20),
      backoffLimit: 4,
      ttlAfterFinished: Duration.seconds(1),
    },
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
  expect(spec.startingDeadlineSeconds).toEqual(undefined);
  expect(spec.suspend).toEqual(undefined);
  expect(spec.successfulJobsHistoryLimit).toEqual(undefined);
  expect(spec.failedJobsHistoryLimit).toEqual(undefined);

  expect(spec.jobTemplate.spec.activeDeadlineSeconds).toEqual(20);
  expect(spec.jobTemplate.spec.backoffLimit).toEqual(4);
  expect(spec.jobTemplate.spec.ttlSecondsAfterFinished).toEqual(1);
  expect(spec.jobTemplate.spec.template.spec.containers[0].image).toEqual('image');
});

test('allow setting schedule using cron options', () => {

  const chart = Testing.chart();

  const cronOptions = {
    minute: '5',
    hour: '*',
    day: '*',
    month: '*',
    year: '*',
  };

  new kplus.CronJob(chart, 'CronJob', {
    jobProperties: {
      activeDeadline: Duration.seconds(20),
      backoffLimit: 4,
      ttlAfterFinished: Duration.seconds(1),
    },
    schedule: cronOptions,
    containers: [{ image: 'image' }],
  });

  // assert the k8s spec has it.
  const manifest = Testing.synth(chart);
  expect(manifest).toMatchSnapshot();
  const spec = manifest[0].spec;

  expect(spec.schedule).toEqual('5 * * * *');

  expect(spec.jobTemplate.spec.activeDeadlineSeconds).toEqual(20);
  expect(spec.jobTemplate.spec.backoffLimit).toEqual(4);
  expect(spec.jobTemplate.spec.ttlSecondsAfterFinished).toEqual(1);
  expect(spec.jobTemplate.spec.template.spec.containers[0].image).toEqual('image');
});

test('allow setting timezone', () => {

  const chart = Testing.chart();

  new kplus.CronJob(chart, 'CronJob', {
    jobProperties: {
      activeDeadline: Duration.seconds(20),
      backoffLimit: 4,
      ttlAfterFinished: Duration.seconds(1),
    },
    timeZone: 'America/Los_Angeles',
    containers: [{ image: 'image' }],
  });

  // assert the k8s spec has it.
  const manifest = Testing.synth(chart);
  expect(manifest).toMatchSnapshot();
  const spec = manifest[0].spec;

  expect(spec.timeZone).toEqual('America/Los_Angeles');

  expect(spec.jobTemplate.spec.activeDeadlineSeconds).toEqual(20);
  expect(spec.jobTemplate.spec.backoffLimit).toEqual(4);
  expect(spec.jobTemplate.spec.ttlSecondsAfterFinished).toEqual(1);
  expect(spec.jobTemplate.spec.template.spec.containers[0].image).toEqual('image');
});

test('allow setting concurrency policy', () => {

  const chart = Testing.chart();

  new kplus.CronJob(chart, 'CronJob', {
    jobProperties: {
      activeDeadline: Duration.seconds(20),
      backoffLimit: 4,
      ttlAfterFinished: Duration.seconds(1),
    },
    concurrencyPolicy: kplus.ConcurrencyPolicy.ALLOW,
    containers: [{ image: 'image' }],
  });

  // assert the k8s spec has it.
  const manifest = Testing.synth(chart);
  expect(manifest).toMatchSnapshot();
  const spec = manifest[0].spec;

  expect(spec.concurrencyPolicy).toEqual('Allow');

  expect(spec.jobTemplate.spec.activeDeadlineSeconds).toEqual(20);
  expect(spec.jobTemplate.spec.backoffLimit).toEqual(4);
  expect(spec.jobTemplate.spec.ttlSecondsAfterFinished).toEqual(1);
  expect(spec.jobTemplate.spec.template.spec.containers[0].image).toEqual('image');
});

test('allow setting starting deadline', () => {

  const chart = Testing.chart();

  new kplus.CronJob(chart, 'CronJob', {
    jobProperties: {
      activeDeadline: Duration.seconds(20),
      backoffLimit: 4,
      ttlAfterFinished: Duration.seconds(1),
    },
    startingDeadline: Duration.seconds(5),
    containers: [{ image: 'image' }],
  });

  // assert the k8s spec has it.
  const manifest = Testing.synth(chart);
  expect(manifest).toMatchSnapshot();
  const spec = manifest[0].spec;

  expect(spec.startingDeadlineSeconds).toEqual(5);

  expect(spec.jobTemplate.spec.activeDeadlineSeconds).toEqual(20);
  expect(spec.jobTemplate.spec.backoffLimit).toEqual(4);
  expect(spec.jobTemplate.spec.ttlSecondsAfterFinished).toEqual(1);
  expect(spec.jobTemplate.spec.template.spec.containers[0].image).toEqual('image');
});

test('allow setting suspend', () => {

  const chart = Testing.chart();

  new kplus.CronJob(chart, 'CronJob', {
    jobProperties: {
      activeDeadline: Duration.seconds(20),
      backoffLimit: 4,
      ttlAfterFinished: Duration.seconds(1),
    },
    suspend: false,
    containers: [{ image: 'image' }],
  });

  // assert the k8s spec has it.
  const manifest = Testing.synth(chart);
  expect(manifest).toMatchSnapshot();
  const spec = manifest[0].spec;

  expect(spec.suspend).toEqual(false);

  expect(spec.jobTemplate.spec.activeDeadlineSeconds).toEqual(20);
  expect(spec.jobTemplate.spec.backoffLimit).toEqual(4);
  expect(spec.jobTemplate.spec.ttlSecondsAfterFinished).toEqual(1);
  expect(spec.jobTemplate.spec.template.spec.containers[0].image).toEqual('image');
});

test('allow setting successfulJobsRetained', () => {

  const chart = Testing.chart();

  new kplus.CronJob(chart, 'CronJob', {
    jobProperties: {
      activeDeadline: Duration.seconds(20),
      backoffLimit: 4,
      ttlAfterFinished: Duration.seconds(1),
    },
    successfulJobsRetained: 3,
    containers: [{ image: 'image' }],
  });

  // assert the k8s spec has it.
  const manifest = Testing.synth(chart);
  expect(manifest).toMatchSnapshot();
  const spec = manifest[0].spec;

  expect(spec.successfulJobsHistoryLimit).toEqual(3);

  expect(spec.jobTemplate.spec.activeDeadlineSeconds).toEqual(20);
  expect(spec.jobTemplate.spec.backoffLimit).toEqual(4);
  expect(spec.jobTemplate.spec.ttlSecondsAfterFinished).toEqual(1);
  expect(spec.jobTemplate.spec.template.spec.containers[0].image).toEqual('image');
});

test('allow setting failedJobsRetained', () => {

  const chart = Testing.chart();

  new kplus.CronJob(chart, 'CronJob', {
    jobProperties: {
      activeDeadline: Duration.seconds(20),
      backoffLimit: 4,
      ttlAfterFinished: Duration.seconds(1),
    },
    failedJobsRetained: 3,
    containers: [{ image: 'image' }],
  });

  // assert the k8s spec has it.
  const manifest = Testing.synth(chart);
  expect(manifest).toMatchSnapshot();
  const spec = manifest[0].spec;

  expect(spec.failedJobsHistoryLimit).toEqual(3);

  expect(spec.jobTemplate.spec.activeDeadlineSeconds).toEqual(20);
  expect(spec.jobTemplate.spec.backoffLimit).toEqual(4);
  expect(spec.jobTemplate.spec.ttlSecondsAfterFinished).toEqual(1);
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
      activeDeadline: Duration.seconds(20),
      backoffLimit: 4,
      ttlAfterFinished: Duration.seconds(1),
    },
    schedule: cronOptions,
    timeZone: 'America/Los_Angeles',
    concurrencyPolicy: kplus.ConcurrencyPolicy.ALLOW,
    startingDeadline: Duration.seconds(5),
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
  expect(spec.startingDeadlineSeconds).toEqual(5);
  expect(spec.suspend).toEqual(false);
  expect(spec.successfulJobsHistoryLimit).toEqual(3);
  expect(spec.failedJobsHistoryLimit).toEqual(3);

  expect(spec.jobTemplate.spec.activeDeadlineSeconds).toEqual(20);
  expect(spec.jobTemplate.spec.backoffLimit).toEqual(4);
  expect(spec.jobTemplate.spec.ttlSecondsAfterFinished).toEqual(1);
  expect(spec.jobTemplate.spec.template.spec.containers[0].image).toEqual('image');
});