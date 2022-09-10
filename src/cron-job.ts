import { ApiObject, Duration, Lazy, Cron } from 'cdk8s';
import { Construct } from 'constructs';
import * as k8s from './imports/k8s';
import { JobProps } from './job';
import { RestartPolicy } from './pod';
import * as workload from './workload';

/**
 * Concurrency policy for CronJobs.
 */
export enum ConcurrencyPolicy {
  /**
   * This policy allows to run job concurrently.
   */
  ALLOW = 'Allow',
  /**
   * This policy does not allow to run job concurrently. It does not let a new job to be scheduled if the previous one is not finished yet.
   */
  FORBID = 'Forbid',
  /**
   * This policy replaces the currently running job if a new job is being scheduled.
   */
  REPLACE = 'Replace',
}

/**
 * Properties for `CronJob`.
 */
export interface CronJobProps extends JobProps {
  /**
   * Specifies the time in which the job would run again. This is defined as a cron expression in the CronJob resource.
   */
  readonly schedule: Cron;

  /**
   * Specifies the timezone for the job. This helps aligining the schedule to follow the specified timezone.
   *
   * @see {@link https://en.wikipedia.org/wiki/List_of_tz_database_time_zones} for list of valid timezone values.
   *
   * @default - Timezone of kube-controller-manager process.
   */
  readonly timeZone?: string;

  /**
   * Specifies the concurrency policy for the job.
   *
   * @default ConcurrencyPolicy.Forbid
   */
  readonly concurrencyPolicy?: ConcurrencyPolicy;

  /**
   * Kubernetes attempts to start cron jobs at its schedule time, but this is not guaranteed. This deadline specifies
   * how much time can pass after a schedule point, for which kubernetes can still start the job.
   * For example, if this is set to 100 seconds, kubernetes is allowed to start the job at a maximum 100 seconds after
   * the scheduled time.
   *
   * Note that the Kubernetes CronJobController checks for things every 10 seconds, for this reason, a deadline below 10
   * seconds is not allowed, as it may cause your job to never be scheduled.
   *
   * In addition, kubernetes will stop scheduling jobs if more than 100 schedules were missed (for any reason).
   * This property also controls what time interval should kubernetes consider when counting for missed schedules.
   *
   * For example, suppose a CronJob is set to schedule a new Job every one minute beginning at 08:30:00,
   * and its `startingDeadline` field is not set. If the CronJob controller happens to be down from 08:29:00 to 10:21:00,
   * the job will not start as the number of missed jobs which missed their schedule is greater than 100.
   * However, if `startingDeadline` is set to 200 seconds, kubernetes will only count 3 missed schedules, and thus
   * start a new execution at 10:22:00.
   *
   * @default Duration.seconds(10)
   */
  readonly startingDeadline?: Duration;

  /**
   * Specifies if the cron job should be suspended. Only applies to future executions, current ones are remained untouched.
   *
   * @default false
   */
  readonly suspend?: boolean;

  /**
   * Specifies the number of successful jobs history retained. This would retain the Job and the associated Pod resource and can be useful for debugging.
   *
   * @default 3
   */
  readonly successfulJobsRetained?: number;

  /**
   * Specifies the number of failed jobs history retained. This would retain the Job and the associated Pod resource and can be useful for debugging.
   *
   * @default 1
   */
  readonly failedJobsRetained?: number;
}

/**
 * A CronJob is responsible for creating a Job and scheduling it based on provided cron schedule. This helps running Jobs in a recurring manner.
 */
export class CronJob extends workload.Workload {
  /**
   * The schedule this cron job is scheduled to run in.
   */
  public readonly schedule: Cron;

  /**
   * The timezone which this cron job would follow to schedule jobs.
   */
  public readonly timeZone?: string;

  /**
   * The policy used by this cron job to determine the concurrency mode in which to schedule jobs.
   */
  public readonly concurrencyPolicy: string;

  /**
   * The time by which the running cron job needs to schedule the next job execution. The job is considered as failed if it misses this deadline.
   */
  public readonly startingDeadline: Duration;

  /**
   * Whether or not the cron job is currently suspended or not.
   */
  public readonly suspend: boolean;

  /**
   * The number of successful jobs retained by this cron job.
   */
  public readonly successfulJobsRetained: number;

  /**
   * The number of failed jobs retained by this cron job.
   */
  public readonly failedJobsRetained: number;

  /**
   * The properties of the recurring `Job` that this cronjob will schedule.
   */
  private readonly jobProperties: JobProps;

  /**
   * @see base.Resource.apiObject
   */
  protected readonly apiObject: ApiObject;

  /**
   * Represents the resource type.
   */
  public readonly resourceType = 'cronjob';

  constructor(scope: Construct, id: string, props: CronJobProps) {
    super(scope, id, {
      restartPolicy: RestartPolicy.NEVER,
      select: false,
      ...props,
    });

    this.apiObject = new k8s.KubeCronJob(this, 'Resource', {
      metadata: props.metadata,
      spec: Lazy.any({ produce: () => this._toKube() }),
    });

    if (props.startingDeadline != undefined && props.startingDeadline.toSeconds() < 10) {
      throw new Error(`The 'startingDeadline' property cannot be less than 10 seconds since the Kubernetes CronJobController checks things every 10 seconds and hence the CronJob may not be scheduled. The value passed is: ${props.startingDeadline}`);
    }

    if (props.ttlAfterFinished != undefined && (props.successfulJobsRetained != undefined || props.failedJobsRetained != undefined)) {
      throw new Error('The \'ttlAfterFinished\' property cannot be set if \'successfulJobsRetained\' property or \'failedJobsRetained\' property is set. This would cause the retention of jobs to not work properly since it would delete the job based on its value.');
    }

    this.schedule = props.schedule;
    this.timeZone = props.timeZone;
    this.concurrencyPolicy = props.concurrencyPolicy ?? ConcurrencyPolicy.FORBID;
    this.startingDeadline = props.startingDeadline ?? Duration.seconds(10);
    this.suspend = props.suspend ?? false;
    this.successfulJobsRetained = props.successfulJobsRetained ?? 3;
    this.failedJobsRetained = props.failedJobsRetained ?? 1;
    this.jobProperties = {
      activeDeadline: props.activeDeadline,
      backoffLimit: props.backoffLimit,
      ttlAfterFinished: props.ttlAfterFinished,
    };
  }

  /**
   * @internal
   */
  public _toKube(): k8s.CronJobSpec {
    return {
      concurrencyPolicy: this.concurrencyPolicy,
      failedJobsHistoryLimit: this.failedJobsRetained,
      jobTemplate: {
        spec: this._toJobSpec(),
      },
      schedule: this.schedule.expressionString,
      startingDeadlineSeconds: this.startingDeadline.toSeconds(),
      successfulJobsHistoryLimit: this.successfulJobsRetained,
      suspend: this.suspend,
      timeZone: this.timeZone,
    };
  }

  /**
   * Returns the job spec.
   */
  private _toJobSpec(): k8s.JobSpec {
    return {
      template: {
        metadata: this.podMetadata.toJson(),
        spec: this._toPodSpec(),
      },
      activeDeadlineSeconds: this.jobProperties.activeDeadline?.toSeconds(),
      backoffLimit: this.jobProperties.backoffLimit,
      ttlSecondsAfterFinished: this.jobProperties.ttlAfterFinished?.toSeconds(),
    };
  }
}