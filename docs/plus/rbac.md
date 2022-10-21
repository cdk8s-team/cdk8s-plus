# Role Based Access Control

Role Based Access Control(RBAC) helps you restrict actions that can be performed on specific Kubernetes resources. To make this possible, RBAC lets you create roles with rules which define access permissions for your specified resource.

These roles can then be binded to Kubernetes subjects, which could be User, Group or ServiceAccount. 

!!! note
    Rules or permissions are purely additive and there are no deny rules.

Now, there are two types of roles available,
* Role: These set permissions within a particular namespace i.e. is for namespaced resources, like, pods, deployments.
* ClusterRole: These set permissions for non-namespaced resources, like, nodes, urls.

and, similarly there are two types of binding available,
* RoleBinding: These grant permissions within a specific namespace.
* ClusterRoleBinding: These grant cluster wide permissions .

!!! tip "Learn more"
    * [Role API Reference](../../reference/cdk8s-plus-24/typescript.md#role)
    * [RoleBinding API Reference](../../reference/cdk8s-plus-24/typescript.md#role-binding)

## Role

### Create role and add rules to it

```typescript
import * as kplus from 'cdk8s-plus-24';
import { Construct } from 'constructs';
import { App, Chart, ChartProps } from 'cdk8s';

export class MyChart extends Chart {
  constructor(scope: Construct, id: string, props: ChartProps = { }) {
    super(scope, id, props);

    // Creating RBAC Role
    const role = new kplus.Role(this, 'SampleRole');

    // The convenience method here `allowReadWrite` would add 
    // `get, list, watch, create, update, patch, delete, 
    // deletecollection` rules to the role for deployment resources.
    role.allowReadWrite(kplus.ApiResource.DEPLOYMENTS);

    const user = kplus.User.fromName(this, 'SampleUser', 'Jane');
    const group = kplus.Group.fromName(this, 'SampleGroup', 'sample-group');
    const serviceAccount = new kplus.ServiceAccount(this, 'SampleServiceAccount');

    // You can bind this role to a specific user, group or service account
    role.bind(user, group, serviceAccount);
  }
}

const app = new App();
new MyChart(app, 'rbac-docs');
app.synth();
```

## ClusterRole

### Create ClusterRole and add rules to it

```typescript
// Creating RBAC ClusterRole
const clusterRole = new kplus.ClusterRole(this, 'SampleClusterRole');

// Adding list of rules to the ClusterRole for 'Nodes' and 'URL' non-namespaced resource
clusterRole.allowReadWrite(kplus.ApiResource.NODES, kplus.NonApiResource.of('/healthz'));

const user = kplus.User.fromName(this, 'SampleUser', 'Jane');
const group = kplus.Group.fromName(this, 'SampleGroup', 'sample-group');
const serviceAccount = new kplus.ServiceAccount(this, 'SampleServiceAccount');

// You can bind this cluster role to a specific user, group or service account
clusterRole.bind(user, group, serviceAccount);
```

## Resource Permission Methods

You can use convenience methods like `grantRead` and `grantReadWrite` which would make it easier to grant list of subjects set of permissions for the resource.

### `grantReadWrite` Method

```typescript
// Creating a Pod resource
const pod = new kplus.Pod(this, 'Pod', {
    containers: [{ image: 'image' }],
});

const user = kplus.User.fromName(this, 'SampleUser', 'Jane');
const group = kplus.Group.fromName(this, 'SampleGroup', 'sample-group');
const serviceAccount = new kplus.ServiceAccount(this, 'SampleServiceAccount');

// You can grant permissions to specific user, group or service account. 
pod.permissions.grantReadWrite(user, group, serviceAccount);
```

## Add subjects to an already bound role

```typescript
const user = kplus.User.fromName(this, 'SampleUser', 'Jane');
const binding = role.bind(user);

const anotherUser = kplus.User.fromName(this, 'AnotherSampleUser', 'James');
binding.addSubjects(anotherUser);
```