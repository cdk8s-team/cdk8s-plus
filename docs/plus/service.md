# Service

Use services when you want to expose a set of pods using a stable network
identity. They can also be used for externalizing endpoints to clients outside
of the kubernetes cluster.

!!! tip ""
    [API Reference](../../reference/cdk8s-plus-37/typescript.md#service)

## Selectors

Services must be configured with selectors that tell it which pods should it serve.
The most common selector method is using labels.

```typescript
import * as k from 'cdk8s';
import * as kplus from 'cdk8s-plus-37';

const app = new k.App();
const chart = new k.Chart(app, 'Chart');
const frontends = new kplus.Service(chart, 'FrontEnds');

// this will cause the service to select all pods with the 'run: frontend' label.
frontends.select(kplus.LabelSelector.equals('run', 'frontend'));
```

## Ports

Ports that the service will listen and redirect to can be configured like so:

```typescript
import * as k from 'cdk8s';
import * as kplus from 'cdk8s-plus-37';

const app = new k.App();
const chart = new k.Chart(app, 'Chart');
const frontends = new kplus.Service(chart, 'FrontEnds');

// make the service bind to port 9000 and redirect to port 80 on the associated containers.
frontends.bind({port: 9000, targetPort: 80})
```

## Headless Services

Services that don't need load-balancing or a single service IP can be made
headless by setting `clusterIP` to `None`. Since headless services are not
proxied, they can be configured without any ports, for example when they are
only used for DNS-based discovery of the selected pods:

```typescript
import * as k from 'cdk8s';
import * as kplus from 'cdk8s-plus-37';

const app = new k.App();
const chart = new k.Chart(app, 'Chart');
const backend = new kplus.Deployment(chart, 'Backend', {
  containers: [{ image: 'backend' }],
});

new kplus.Service(chart, 'Headless', {
  clusterIP: 'None',
  selector: backend,
});
```
