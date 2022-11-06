# Deployment

Create a deployment to govern the lifecycle and orchestration of a set of identical pods.

!!! tip ""
    [API Reference](../../reference/cdk8s-plus-24/typescript.md#deployment)

## Automatic pod selection

When you specify pods in a deployment, you normally have to configure the appropriate labels and selectors to
make the deployment control the relevant pods. This construct does this automatically.

```typescript
import * as kplus from 'cdk8s-plus-24';
import { Construct } from 'constructs';
import { App, Chart, ChartProps } from 'cdk8s';

export class MyChart extends Chart {
  constructor(scope: Construct, id: string, props: ChartProps = { }) {
    super(scope, id, props);

    new kplus.Deployment(this, 'FrontEnds', {
      containers: [ { image: 'node' } ],
    });
  }
}

const app = new App();
new MyChart(app, 'deployment');
app.synth();
```

Note the resulting manifest contains a special `cdk8s.io/metadata.addr` label that is applied to the pods, and is used as
the selector for the deployment.

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: deployment-frontends-c8e48310
spec:
  minReadySeconds: 0
  progressDeadlineSeconds: 600
  replicas: 2
  selector:
    matchLabels:
      cdk8s.io/metadata.addr: deployment-FrontEnds-c89e9e97
  strategy:
    rollingUpdate:
      maxSurge: 25%
      maxUnavailable: 25%
    type: RollingUpdate
  template:
    metadata:
      labels:
        cdk8s.io/metadata.addr: deployment-FrontEnds-c89e9e97
    spec:
      automountServiceAccountToken: false
      containers:
        - image: node
          imagePullPolicy: Always
          name: main
          resources:
            limits:
              cpu: 1500m
              memory: 2048Mi
            requests:
              cpu: 1000m
              memory: 512Mi
          securityContext:
            allowPrivilegeEscalation: false
            privileged: false
            readOnlyRootFilesystem: true
            runAsGroup: 26000
            runAsNonRoot: true
            runAsUser: 25000
      dnsPolicy: ClusterFirst
      restartPolicy: Always
      securityContext:
        fsGroupChangePolicy: Always
        runAsNonRoot: true
      setHostnameAsFQDN: false
```

## Exposing via a service

Following up on pod selection, you can also easily create a service that will select the pods relevant to the deployment.

```typescript
// store the deployment to created in a constant
const frontends = new kplus.Deployment(this, 'FrontEnds', {
  containers: [ {
    image: 'node',
    portNumber: 9000,
  } ],
});

// create a ClusterIP service that listens on port 9000 and redirects to port 9000 on the containers.
frontends.exposeViaService({ ports: [{
  port: 9000,
}]
});
```

Notice the resulting manifest, will have the same `cdk8s.io/metadata.addr` magic label as the selector.
This will cause the service to attach to the pods that were configured as part of the said deployment.

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: deployment-frontends-c8e48310
spec:
  minReadySeconds: 0
  progressDeadlineSeconds: 600
  replicas: 2
  selector:
    matchLabels:
      cdk8s.io/metadata.addr: deployment-FrontEnds-c89e9e97
  strategy:
    rollingUpdate:
      maxSurge: 25%
      maxUnavailable: 25%
    type: RollingUpdate
  template:
    metadata:
      labels:
        cdk8s.io/metadata.addr: deployment-FrontEnds-c89e9e97
    spec:
      automountServiceAccountToken: false
      containers:
        - image: node
          imagePullPolicy: Always
          name: main
          ports:
            - containerPort: 9000
          resources:
            limits:
              cpu: 1500m
              memory: 2048Mi
            requests:
              cpu: 1000m
              memory: 512Mi
          securityContext:
            allowPrivilegeEscalation: false
            privileged: false
            readOnlyRootFilesystem: true
            runAsGroup: 26000
            runAsNonRoot: true
            runAsUser: 25000
          startupProbe:
            failureThreshold: 3
            tcpSocket:
              port: 9000
      dnsPolicy: ClusterFirst
      restartPolicy: Always
      securityContext:
        fsGroupChangePolicy: Always
        runAsNonRoot: true
      setHostnameAsFQDN: false
---
apiVersion: v1
kind: Service
metadata:
  name: deployment-frontends-service-c8206158
spec:
  externalIPs: []
  ports:
    - port: 9000
  selector:
    cdk8s.io/metadata.addr: deployment-FrontEnds-c89e9e97
  type: ClusterIP
```

## Scheduling

In addition to the scheduling capabilities provided by [pod scheduling](./pod.md#scheduling),
a Deployment offers the following:

### Spreading

A spread is a [separation](./pod.md#pod-separation) of pods from themselves.
It can be used to ensure replicas of the same workload are scheduled on different topologies.

> The same API is also available on all workload resources (i.e `Deployment`, `StatefulSet`, `Job`, `DaemonSet`).

```typescript
const redis = new kplus.Deployment(this, 'Redis', {
  containers: [{ image: 'redis' }],
  replicas: 3,
});

redis.scheduling.spread({
  topology: kplus.Topology.HOSTNAME
});
```

This example ensures that each replica of the `Redis` deployment
will be scheduled on a different node.

Take, for [example](https://kubernetes.io/docs/concepts/scheduling-eviction/assign-pod-node/#more-practical-use-cases), a three-node cluster running a web application with an in-memory cache like redis. You'd like to co-locate the web servers with the cache as much as possible, while still maintaining node failure resistance. (i.e not all pods are on the same node).

Here is how you can accomplish that:

```typescript
const redis = new kplus.Deployment(this, 'Redis', {
  containers: [{ image: 'redis' }],
  replicas: 3,
});

const web = new kplus.Deployment(this, 'Web', {
  containers: [{ image: 'web' }],
  replicas: 3,
});

// ensure redis is spread across all nodes
redis.scheduling.spread({
  topology: kplus.Topology.HOSTNAME
});

// ensure web app is spread across all nodes
web.scheduling.spread({
  topology: kplus.Topology.HOSTNAME
});

// ensure a web app pod always runs along side a cache instance
web.scheduling.colocate(redis);
```

## Connections

See [Pod connections](./pod.md#connections).
