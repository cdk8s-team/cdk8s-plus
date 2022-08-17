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
  ALLOW = 'allow',
  FORBID = 'forbid',
  REPLACE = 'replace',
}

/**
 * Properties for `CronJob`.
 */
export interface CronJobProps extends workload.WorkloadProps {
  /**
   * Properties of the Job that is being scheduled by CronJob.
   */
  readonly jobProperties: JobProps;

  /**
   * Specifies the time in which the job would run again.
   *
   * @default - Runs at every minute.
   */
  readonly schedule?: CronOptions;

  /**
   * Specifies the timezone for the job. This helps aligining the schedule to follow the specified timezone.
   *
   * @default - Timezone of kube-controller-manager process.
   */
  readonly timeZone?: string;

  /**
   * Specifies the concurrency policy for the job.
   *
   * @default - Allow
   */
  readonly concurrencyPolicy?: ConcurrencyPolicy;

  /**
   * Specifies the time by which a recurring job should be scheduled after it has passed its expected scheduling time.
   * Missed jobs are counted as failed ones.
   *
   * @default - There is no deadline.
   */
  readonly startingDeadline?: Duration;

  /**
   * Specifies if the recurring job should be suspended.
   *
   * @default - false.
   */
  readonly suspend?: boolean;

  /**
   * Specifies the number of successful jobs history retained.
   *
   * @default - 3.
   */
  readonly successfulJobsRetained?: number;

  /**
   * Specifies the number of failed jobs history retained.
   *
   * @default - 1.
   */
  readonly failedJobsRetained?: number;
}

/**
 * A CronJob is responsible for creating a Job and scheduling it based on provided scheduled. This helps running Jobs in a recurring manner.
 */
export class CronJob extends workload.Workload {
  /**
   * Properties of the recurring `Job`.
   */
  public readonly jobProperties: JobProps;

  /**
   * Schedule for which to run the recurring job. By default, the job would be scheduled to run every minute.
   */
  public readonly schedule?: CronOptions;

  /**
   * Timezone in which the recurring job is scheduled.
   */
  public readonly timeZone?: string;

  /**
   * Concurrency policy for the recurring job. This specifies how the job scheduling would be handled based on which policy is selected.
   */
  public readonly concurrencyPolicy?: string;

  /**
   * Deadline to start next instance of job after the expected scheduling time. The job is considered as failed if it misses this deadline.
   */
  public readonly startingDeadline?: Duration;

  /**
   * Flag that tells to suspend the upcoming executions of the job.
   */
  public readonly suspend?: boolean;

  /**
   * The number of successful jobs to retain.
   */
  public readonly successfulJobsRetained?: number;

  /**
   * The number of failed jobs to retain.
   */
  public readonly failedJobsRetained?: number;

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
      restartPolicy: RestartPolicy.ON_FAILURE,
      select: false, //Why is this false in Job?
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
    this.concurrencyPolicy = props.concurrencyPolicy;
    this.startingDeadline = props.startingDeadline;
    this.suspend = props.suspend;
    this.successfulJobsRetained = props.successfulJobsRetained;
    this.failedJobsRetained = props.failedJobsRetained;
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
        spec: this.getJobSpec(),
      },
      schedule: this.getCronExpression(this.schedule),
      startingDeadlineSeconds: this.startingDeadline?.toSeconds(),
      successfulJobsHistoryLimit: this.successfulJobsRetained,
      suspend: this.suspend,
      timeZone: this.timeZone,
    };
  }

  /**
   * Returns the job spec.
   */
  private getJobSpec(): k8s.JobSpec {
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
  private getCronExpression(cronOptions: CronOptions | undefined): string {
    const runJobEveryMinute: CronOptions = {
      minute: '*',
      hour: '*',
      day: '*',
      month: '*',
      year: '*',
    };

    if (cronOptions == undefined) {
      return `${runJobEveryMinute.day} ${runJobEveryMinute.hour} ${runJobEveryMinute.day} ${runJobEveryMinute.month} ${runJobEveryMinute.year}`;
    }

    const schedule = Schedule.cron(cronOptions);

    const regularExpression = '\\((.*?)\\)';
    const regExp = new RegExp(regularExpression);
    const matches = regExp.exec(schedule.expressionString);

    if (matches == null) {
      throw new Error(`An error was encountered during regular expression conversion for schedule provided: ${schedule.expressionString}`);
    }

    return matches[1];
  }
}