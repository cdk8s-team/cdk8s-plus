import { Testing, ApiObject, Duration, CronOptions, Cron } from 'cdk8s';
import { Node } from 'constructs';
import * as kplus from '../src';

test('defaultChild', () => {

  const chart = Testing.chart();

  const cronOptions: CronOptions = {
    minute: '*',
    hour: '*',
    day: '*',
    month: '*',
    weekDay: '*',
  };

  const schedule = new Cron(cronOptions);

  const defaultChild = Node.of(new kplus.CronJob(chart, 'CronJob', {
    schedule: schedule,
  })).defaultChild as ApiObject;

  expect(defaultChild.kind).toEqual('CronJob');
});

test('default configuration', () => {

  const chart = Testing.chart();

  const schedule = Cron.everyMinute();

  new kplus.CronJob(chart, 'CronJob', {
    schedule: schedule,
    containers: [{ image: 'image' }],
  });

  // assert the k8s spec has it.
  const manifest = Testing.synth(chart);
  expect(manifest).toMatchSnapshot();
  const spec = manifest[0].spec;

  expect(spec.schedule).toEqual('* * * * *');
  expect(spec.concurrencyPolicy).toEqual('Forbid');
  expect(spec.timeZone).toEqual(undefined);
  expect(spec.startingDeadlineSeconds).toEqual(10);
  expect(spec.suspend).toEqual(false);
  expect(spec.successfulJobsHistoryLimit).toEqual(3);
  expect(spec.failedJobsHistoryLimit).toEqual(1);
});

test('custom configuration', () => {

  const chart = Testing.chart();

  const cronOptions: CronOptions = {
    minute: '5',
    hour: '*',
    day: '*',
    month: '*',
    weekDay: '*',
  };

  const schedule = Cron.schedule(cronOptions);

  new kplus.CronJob(chart, 'CronJob', {
    activeDeadline: Duration.seconds(60),
    backoffLimit: 4,
    schedule: schedule,
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

test('Can be isolated', () => {

  const chart = Testing.chart();

  new kplus.CronJob(chart, 'CronJob', {
    containers: [{ image: 'foobar' }],
    schedule: Cron.daily(),
    isolate: true,
  });

  const manifest = Testing.synth(chart);
  expect(manifest).toMatchSnapshot();

  const networkPolicy = manifest[1].spec;
  expect(networkPolicy.podSelector.matchLabels).toBeDefined;
  expect(networkPolicy.policyTypes).toEqual(['Egress', 'Ingress']);
});