import { ApiObject, CronOptions, Duration, Lazy, Schedule } from 'cdk8s';
import { Construct } from 'constructs';
import * as timezone from 'moment-timezone';
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
   * Properties of the Job that is being scheduled by CronJob.
   */
  readonly jobProperties: JobProps;

  /**
   * Specifies the time in which the job would run again.
   */
  readonly schedule: CronOptions;

  /**
   * Specifies the timezone for the job. This helps aligining the schedule to follow the specified timezone.
   *
   * @default - Timezone of kube-controller-manager process.
   */
  readonly timeZone?: string;

  /**
   * Specifies the concurrency policy for the job.
   *
   * @default Forbid
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
   * @default - There is no deadline.
   */
  readonly startingDeadline?: Duration;

  /**
   * Specifies if the recurring job should be suspended. Only applies to future executions, current ones are remained untouched.
   *
   * @default false
   */
  readonly suspend?: boolean;

  /**
   * Specifies the number of successful jobs history retained.
   *
   * @default 3
   */
  readonly successfulJobsRetained?: number;

  /**
   * Specifies the number of failed jobs history retained.
   *
   * @default 1
   */
  readonly failedJobsRetained?: number;
}

/**
 * A CronJob is responsible for creating a Job and scheduling it based on provided scheduled. This helps running Jobs in a recurring manner.
 */
export class CronJob extends workload.Workload {
  /**
   * The properties of the recurring `Job` that this cronjob will schedule.
   */
  public readonly jobProperties: JobProps;

  /**
   * The schedule this cron job is scheduled to run in.
   */
  public readonly schedule: CronOptions;

  /**
   * The timezone in which this cron job will schedule job in.
   */
  public readonly timeZone?: string;

  /**
   * The policy used by this cron job to determine the concurrency mode in which to schedule jobs.
   */
  public readonly concurrencyPolicy: string;

  /**
   * The time by which the running cron job should schedule the next job execution. The job is considered as failed if it misses this deadline.
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

    if (!this.isValidTimezone(props.timeZone)) {
      throw new Error(`Invalid timezone: ${props.timeZone}`);
    }

    this.jobProperties = props.jobProperties;
    this.schedule = props.schedule;
    this.timeZone = props.timeZone;
    this.concurrencyPolicy = props.concurrencyPolicy ?? ConcurrencyPolicy.FORBID;
    this.startingDeadline = props.startingDeadline ?? Duration.seconds(10);
    this.suspend = props.suspend ?? false;
    this.successfulJobsRetained = props.successfulJobsRetained ?? 3;
    this.failedJobsRetained = props.failedJobsRetained ?? 1;
  }

  /**
   * @internal
   */
  public _toKube(): k8s.CronJobSpec {
    return {
      concurrencyPolicy: this.concurrencyPolicy,
      failedJobsHistoryLimit: this.failedJobsRetained,
      jobTemplate: {
        metadata: this.jobProperties.metadata,
        spec: this._toJobSpec(),
      },
      schedule: this.getCronExpression(this.schedule),
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

  /**
   * Checks if the timezone passed if valid or not.
   * @param tz Timezone.
   * @returns result as boolean value for timezone validity.
   */
  private isValidTimezone(tz: string | undefined): boolean {
    if (tz == undefined) {
      return true;
    }
    return timezone.tz.zone(tz) != null;
  }

  /**
   * Get cron expression in format expected by CronJob manifest.
   * @param cronOptions Cron expression passed as CronOptions.
   * @returns Cron expression.
   */
  private getCronExpression(cronOptions: CronOptions): string {
    const schedule = Schedule.cron(cronOptions);

    const regularExpression = '\\((.*?)\\)';
    const regExp = new RegExp(regularExpression);
    const matches = regExp.exec(schedule.expressionString);

    if (matches == null) {
      throw new Error(`An error was encountered during regular expression conversion for schedule provided: ${schedule.expressionString}`);
    }

    return this.formatCronExpression(matches[1]);
  }

  /**
   * Format cron expression since Kubernetes CronJob is expecting five cron values.
   * Schedule CronOptions substitute weekday or day with ? when undefined.
   * @param cronExpression
   */

  /**
   * Format cron expression since Kubernetes CronJob is expecting five cron values.
   * Schedule CronOptions substitute weekday or day with ? when undefined.
   * @see {@link https://github.com/cdk8s-team/cdk8s-core/blob/2.x/src/schedule.ts#L47-L49 | Schedule Class}
   * @param cronExpression The cron expression passed to the construct.
   * @returns Formatted cron expression.
   */
  private formatCronExpression(cronExpression: string): string {
    return cronExpression.replace(' ?', '');
  }
}

// Add details to Timezone that it is behind a feature flag and how it works as a default.
// Add details for StartingDeadline and how it can not be below 10 sec. Add validation for it.
// Add mention about job property of ttlAfterFinished and how it works against cronjob history limits.