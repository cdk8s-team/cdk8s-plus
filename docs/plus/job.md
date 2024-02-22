# Job

Jobs are a very useful concept in kubernetes deployments.
They can be used for add-hoc provisioning tasks, as well as long running processing jobs.

In configuration, they don't differ much from regular pods, but offer some
additional properties.

!!! tip ""
    [API Reference](../../reference/cdk8s-plus-28/typescript.md#job)

## Delete a Job after its finished

You can configure a TTL for the job after it finished its execution successfully.

```typescript
import * as kplus from 'cdk8s-plus-28';
import { Construct } from 'constructs';
import { App, Chart, ChartProps, Duration } from 'cdk8s';

export class MyChart extends Chart {
  constructor(scope: Construct, id: string, props: ChartProps = { }) {
    super(scope, id, props);

    // let's define a job spec, and set a 1 second TTL.
    const job = new kplus.Job(this, 'LoadData', {
      ttlAfterFinished: Duration.seconds(1)
    });

    // now add a container to all the pods created by this job
    job.addContainer({
      image: 'loader'
    });
  }
}

const app = new App();
new MyChart(app, 'Job');
app.synth();
```

## Scheduling

See [Deployment scheduling](./deployment.md#scheduling).

## Connections

See [Pod connections](./pod.md#connections).
