# API Reference <a name="API Reference"></a>

## Constructs <a name="Constructs"></a>

### AwsElasticBlockStorePersistentVolume <a name="cdk8s-plus-22.AwsElasticBlockStorePersistentVolume"></a>

Represents an AWS Disk resource that is attached to a kubelet's host machine and then exposed to the pod.

> https://kubernetes.io/docs/concepts/storage/volumes#awselasticblockstore

#### Initializers <a name="cdk8s-plus-22.AwsElasticBlockStorePersistentVolume.Initializer"></a>

```typescript
import { AwsElasticBlockStorePersistentVolume } from 'cdk8s-plus-22'

new AwsElasticBlockStorePersistentVolume(scope: Construct, id: string, props: AwsElasticBlockStorePersistentVolumeProps)
```

##### `scope`<sup>Required</sup> <a name="cdk8s-plus-22.AwsElasticBlockStorePersistentVolume.parameter.scope"></a>

- *Type:* [`constructs.Construct`](#constructs.Construct)

---

##### `id`<sup>Required</sup> <a name="cdk8s-plus-22.AwsElasticBlockStorePersistentVolume.parameter.id"></a>

- *Type:* `string`

---

##### `props`<sup>Required</sup> <a name="cdk8s-plus-22.AwsElasticBlockStorePersistentVolume.parameter.props"></a>

- *Type:* [`cdk8s-plus-22.AwsElasticBlockStorePersistentVolumeProps`](#cdk8s-plus-22.AwsElasticBlockStorePersistentVolumeProps)

---



#### Properties <a name="Properties"></a>

##### `fsType`<sup>Required</sup> <a name="cdk8s-plus-22.AwsElasticBlockStorePersistentVolume.property.fsType"></a>

```typescript
public readonly fsType: string;
```

- *Type:* `string`

File system type of this volume.

---

##### `readOnly`<sup>Required</sup> <a name="cdk8s-plus-22.AwsElasticBlockStorePersistentVolume.property.readOnly"></a>

```typescript
public readonly readOnly: boolean;
```

- *Type:* `boolean`

Whether or not it is mounted as a read-only volume.

---

##### `volumeId`<sup>Required</sup> <a name="cdk8s-plus-22.AwsElasticBlockStorePersistentVolume.property.volumeId"></a>

```typescript
public readonly volumeId: string;
```

- *Type:* `string`

Volume id of this volume.

---

##### `partition`<sup>Optional</sup> <a name="cdk8s-plus-22.AwsElasticBlockStorePersistentVolume.property.partition"></a>

```typescript
public readonly partition: number;
```

- *Type:* `number`

Partition of this volume.

---


### AzureDiskPersistentVolume <a name="cdk8s-plus-22.AzureDiskPersistentVolume"></a>

AzureDisk represents an Azure Data Disk mount on the host and bind mount to the pod.

#### Initializers <a name="cdk8s-plus-22.AzureDiskPersistentVolume.Initializer"></a>

```typescript
import { AzureDiskPersistentVolume } from 'cdk8s-plus-22'

new AzureDiskPersistentVolume(scope: Construct, id: string, props: AzureDiskPersistentVolumeProps)
```

##### `scope`<sup>Required</sup> <a name="cdk8s-plus-22.AzureDiskPersistentVolume.parameter.scope"></a>

- *Type:* [`constructs.Construct`](#constructs.Construct)

---

##### `id`<sup>Required</sup> <a name="cdk8s-plus-22.AzureDiskPersistentVolume.parameter.id"></a>

- *Type:* `string`

---

##### `props`<sup>Required</sup> <a name="cdk8s-plus-22.AzureDiskPersistentVolume.parameter.props"></a>

- *Type:* [`cdk8s-plus-22.AzureDiskPersistentVolumeProps`](#cdk8s-plus-22.AzureDiskPersistentVolumeProps)

---



#### Properties <a name="Properties"></a>

##### `cachingMode`<sup>Required</sup> <a name="cdk8s-plus-22.AzureDiskPersistentVolume.property.cachingMode"></a>

```typescript
public readonly cachingMode: AzureDiskPersistentVolumeCachingMode;
```

- *Type:* [`cdk8s-plus-22.AzureDiskPersistentVolumeCachingMode`](#cdk8s-plus-22.AzureDiskPersistentVolumeCachingMode)

Caching mode of this volume.

---

##### `diskName`<sup>Required</sup> <a name="cdk8s-plus-22.AzureDiskPersistentVolume.property.diskName"></a>

```typescript
public readonly diskName: string;
```

- *Type:* `string`

Disk name of this volume.

---

##### `diskUri`<sup>Required</sup> <a name="cdk8s-plus-22.AzureDiskPersistentVolume.property.diskUri"></a>

```typescript
public readonly diskUri: string;
```

- *Type:* `string`

Disk URI of this volume.

---

##### `fsType`<sup>Required</sup> <a name="cdk8s-plus-22.AzureDiskPersistentVolume.property.fsType"></a>

```typescript
public readonly fsType: string;
```

- *Type:* `string`

File system type of this volume.

---

##### `kind`<sup>Required</sup> <a name="cdk8s-plus-22.AzureDiskPersistentVolume.property.kind"></a>

```typescript
public readonly kind: AzureDiskPersistentVolumeKind;
```

- *Type:* [`cdk8s-plus-22.AzureDiskPersistentVolumeKind`](#cdk8s-plus-22.AzureDiskPersistentVolumeKind)

Azure kind of this volume.

---

##### `readOnly`<sup>Required</sup> <a name="cdk8s-plus-22.AzureDiskPersistentVolume.property.readOnly"></a>

```typescript
public readonly readOnly: boolean;
```

- *Type:* `boolean`

Whether or not it is mounted as a read-only volume.

---


### BasicAuthSecret <a name="cdk8s-plus-22.BasicAuthSecret"></a>

Create a secret for basic authentication.

> https://kubernetes.io/docs/concepts/configuration/secret/#basic-authentication-secret

#### Initializers <a name="cdk8s-plus-22.BasicAuthSecret.Initializer"></a>

```typescript
import { BasicAuthSecret } from 'cdk8s-plus-22'

new BasicAuthSecret(scope: Construct, id: string, props: BasicAuthSecretProps)
```

##### `scope`<sup>Required</sup> <a name="cdk8s-plus-22.BasicAuthSecret.parameter.scope"></a>

- *Type:* [`constructs.Construct`](#constructs.Construct)

---

##### `id`<sup>Required</sup> <a name="cdk8s-plus-22.BasicAuthSecret.parameter.id"></a>

- *Type:* `string`

---

##### `props`<sup>Required</sup> <a name="cdk8s-plus-22.BasicAuthSecret.parameter.props"></a>

- *Type:* [`cdk8s-plus-22.BasicAuthSecretProps`](#cdk8s-plus-22.BasicAuthSecretProps)

---





### ConfigMap <a name="cdk8s-plus-22.ConfigMap"></a>

- *Implements:* [`cdk8s-plus-22.IConfigMap`](#cdk8s-plus-22.IConfigMap)

ConfigMap holds configuration data for pods to consume.

#### Initializers <a name="cdk8s-plus-22.ConfigMap.Initializer"></a>

```typescript
import { ConfigMap } from 'cdk8s-plus-22'

new ConfigMap(scope: Construct, id: string, props?: ConfigMapProps)
```

##### `scope`<sup>Required</sup> <a name="cdk8s-plus-22.ConfigMap.parameter.scope"></a>

- *Type:* [`constructs.Construct`](#constructs.Construct)

---

##### `id`<sup>Required</sup> <a name="cdk8s-plus-22.ConfigMap.parameter.id"></a>

- *Type:* `string`

---

##### `props`<sup>Optional</sup> <a name="cdk8s-plus-22.ConfigMap.parameter.props"></a>

- *Type:* [`cdk8s-plus-22.ConfigMapProps`](#cdk8s-plus-22.ConfigMapProps)

---

#### Methods <a name="Methods"></a>

##### `addBinaryData` <a name="cdk8s-plus-22.ConfigMap.addBinaryData"></a>

```typescript
public addBinaryData(key: string, value: string)
```

###### `key`<sup>Required</sup> <a name="cdk8s-plus-22.ConfigMap.parameter.key"></a>

- *Type:* `string`

The key.

---

###### `value`<sup>Required</sup> <a name="cdk8s-plus-22.ConfigMap.parameter.value"></a>

- *Type:* `string`

The value.

---

##### `addData` <a name="cdk8s-plus-22.ConfigMap.addData"></a>

```typescript
public addData(key: string, value: string)
```

###### `key`<sup>Required</sup> <a name="cdk8s-plus-22.ConfigMap.parameter.key"></a>

- *Type:* `string`

The key.

---

###### `value`<sup>Required</sup> <a name="cdk8s-plus-22.ConfigMap.parameter.value"></a>

- *Type:* `string`

The value.

---

##### `addDirectory` <a name="cdk8s-plus-22.ConfigMap.addDirectory"></a>

```typescript
public addDirectory(localDir: string, options?: AddDirectoryOptions)
```

###### `localDir`<sup>Required</sup> <a name="cdk8s-plus-22.ConfigMap.parameter.localDir"></a>

- *Type:* `string`

A path to a local directory.

---

###### `options`<sup>Optional</sup> <a name="cdk8s-plus-22.ConfigMap.parameter.options"></a>

- *Type:* [`cdk8s-plus-22.AddDirectoryOptions`](#cdk8s-plus-22.AddDirectoryOptions)

Options.

---

##### `addFile` <a name="cdk8s-plus-22.ConfigMap.addFile"></a>

```typescript
public addFile(localFile: string, key?: string)
```

###### `localFile`<sup>Required</sup> <a name="cdk8s-plus-22.ConfigMap.parameter.localFile"></a>

- *Type:* `string`

The path to the local file.

---

###### `key`<sup>Optional</sup> <a name="cdk8s-plus-22.ConfigMap.parameter.key"></a>

- *Type:* `string`

The ConfigMap key (default to the file name).

---

#### Static Functions <a name="Static Functions"></a>

##### `fromConfigMapName` <a name="cdk8s-plus-22.ConfigMap.fromConfigMapName"></a>

```typescript
import { ConfigMap } from 'cdk8s-plus-22'

ConfigMap.fromConfigMapName(name: string)
```

###### `name`<sup>Required</sup> <a name="cdk8s-plus-22.ConfigMap.parameter.name"></a>

- *Type:* `string`

The name of the config map to import.

---

#### Properties <a name="Properties"></a>

##### `binaryData`<sup>Required</sup> <a name="cdk8s-plus-22.ConfigMap.property.binaryData"></a>

```typescript
public readonly binaryData: {[ key: string ]: string};
```

- *Type:* {[ key: string ]: `string`}

The binary data associated with this config map.

Returns a copy. To add data records, use `addBinaryData()` or `addData()`.

---

##### `data`<sup>Required</sup> <a name="cdk8s-plus-22.ConfigMap.property.data"></a>

```typescript
public readonly data: {[ key: string ]: string};
```

- *Type:* {[ key: string ]: `string`}

The data associated with this config map.

Returns an copy. To add data records, use `addData()` or `addBinaryData()`.

---


### Deployment <a name="cdk8s-plus-22.Deployment"></a>

- *Implements:* [`cdk8s-plus-22.IPodTemplate`](#cdk8s-plus-22.IPodTemplate)

A Deployment provides declarative updates for Pods and ReplicaSets.

You describe a desired state in a Deployment, and the Deployment Controller changes the actual
state to the desired state at a controlled rate. You can define Deployments to create new ReplicaSets, or to remove
existing Deployments and adopt all their resources with new Deployments.

> Note: Do not manage ReplicaSets owned by a Deployment. Consider opening an issue in the main Kubernetes repository if your use case is not covered below.

Use Case
---------

The following are typical use cases for Deployments:

- Create a Deployment to rollout a ReplicaSet. The ReplicaSet creates Pods in the background.
   Check the status of the rollout to see if it succeeds or not.
- Declare the new state of the Pods by updating the PodTemplateSpec of the Deployment.
   A new ReplicaSet is created and the Deployment manages moving the Pods from the old ReplicaSet to the new one at a controlled rate.
   Each new ReplicaSet updates the revision of the Deployment.
- Rollback to an earlier Deployment revision if the current state of the Deployment is not stable.
   Each rollback updates the revision of the Deployment.
- Scale up the Deployment to facilitate more load.
- Pause the Deployment to apply multiple fixes to its PodTemplateSpec and then resume it to start a new rollout.
- Use the status of the Deployment as an indicator that a rollout has stuck.
- Clean up older ReplicaSets that you don't need anymore.

#### Initializers <a name="cdk8s-plus-22.Deployment.Initializer"></a>

```typescript
import { Deployment } from 'cdk8s-plus-22'

new Deployment(scope: Construct, id: string, props?: DeploymentProps)
```

##### `scope`<sup>Required</sup> <a name="cdk8s-plus-22.Deployment.parameter.scope"></a>

- *Type:* [`constructs.Construct`](#constructs.Construct)

---

##### `id`<sup>Required</sup> <a name="cdk8s-plus-22.Deployment.parameter.id"></a>

- *Type:* `string`

---

##### `props`<sup>Optional</sup> <a name="cdk8s-plus-22.Deployment.parameter.props"></a>

- *Type:* [`cdk8s-plus-22.DeploymentProps`](#cdk8s-plus-22.DeploymentProps)

---

#### Methods <a name="Methods"></a>

##### `addContainer` <a name="cdk8s-plus-22.Deployment.addContainer"></a>

```typescript
public addContainer(container: ContainerProps)
```

###### `container`<sup>Required</sup> <a name="cdk8s-plus-22.Deployment.parameter.container"></a>

- *Type:* [`cdk8s-plus-22.ContainerProps`](#cdk8s-plus-22.ContainerProps)

---

##### `addHostAlias` <a name="cdk8s-plus-22.Deployment.addHostAlias"></a>

```typescript
public addHostAlias(hostAlias: HostAlias)
```

###### `hostAlias`<sup>Required</sup> <a name="cdk8s-plus-22.Deployment.parameter.hostAlias"></a>

- *Type:* [`cdk8s-plus-22.HostAlias`](#cdk8s-plus-22.HostAlias)

---

##### `addInitContainer` <a name="cdk8s-plus-22.Deployment.addInitContainer"></a>

```typescript
public addInitContainer(container: ContainerProps)
```

###### `container`<sup>Required</sup> <a name="cdk8s-plus-22.Deployment.parameter.container"></a>

- *Type:* [`cdk8s-plus-22.ContainerProps`](#cdk8s-plus-22.ContainerProps)

---

##### `addVolume` <a name="cdk8s-plus-22.Deployment.addVolume"></a>

```typescript
public addVolume(volume: Volume)
```

###### `volume`<sup>Required</sup> <a name="cdk8s-plus-22.Deployment.parameter.volume"></a>

- *Type:* [`cdk8s-plus-22.Volume`](#cdk8s-plus-22.Volume)

---

##### `exposeViaIngress` <a name="cdk8s-plus-22.Deployment.exposeViaIngress"></a>

```typescript
public exposeViaIngress(path: string, options?: ExposeDeploymentViaIngressOptions)
```

###### `path`<sup>Required</sup> <a name="cdk8s-plus-22.Deployment.parameter.path"></a>

- *Type:* `string`

The ingress path to register under.

---

###### `options`<sup>Optional</sup> <a name="cdk8s-plus-22.Deployment.parameter.options"></a>

- *Type:* [`cdk8s-plus-22.ExposeDeploymentViaIngressOptions`](#cdk8s-plus-22.ExposeDeploymentViaIngressOptions)

Additional options.

---

##### `exposeViaService` <a name="cdk8s-plus-22.Deployment.exposeViaService"></a>

```typescript
public exposeViaService(options?: ExposeDeploymentViaServiceOptions)
```

###### `options`<sup>Optional</sup> <a name="cdk8s-plus-22.Deployment.parameter.options"></a>

- *Type:* [`cdk8s-plus-22.ExposeDeploymentViaServiceOptions`](#cdk8s-plus-22.ExposeDeploymentViaServiceOptions)

Options to determine details of the service and port exposed.

---

##### `selectByLabel` <a name="cdk8s-plus-22.Deployment.selectByLabel"></a>

```typescript
public selectByLabel(key: string, value: string)
```

###### `key`<sup>Required</sup> <a name="cdk8s-plus-22.Deployment.parameter.key"></a>

- *Type:* `string`

The label key.

---

###### `value`<sup>Required</sup> <a name="cdk8s-plus-22.Deployment.parameter.value"></a>

- *Type:* `string`

The label value.

---


#### Properties <a name="Properties"></a>

##### `containers`<sup>Required</sup> <a name="cdk8s-plus-22.Deployment.property.containers"></a>

```typescript
public readonly containers: Container[];
```

- *Type:* [`cdk8s-plus-22.Container`](#cdk8s-plus-22.Container)[]

The containers belonging to the pod.

Use `addContainer` to add containers.

---

##### `hostAliases`<sup>Required</sup> <a name="cdk8s-plus-22.Deployment.property.hostAliases"></a>

```typescript
public readonly hostAliases: HostAlias[];
```

- *Type:* [`cdk8s-plus-22.HostAlias`](#cdk8s-plus-22.HostAlias)[]

An optional list of hosts and IPs that will be injected into the pod's hosts file if specified.

This is only valid for non-hostNetwork pods.

---

##### `initContainers`<sup>Required</sup> <a name="cdk8s-plus-22.Deployment.property.initContainers"></a>

```typescript
public readonly initContainers: Container[];
```

- *Type:* [`cdk8s-plus-22.Container`](#cdk8s-plus-22.Container)[]

The init containers belonging to the pod.

Use `addInitContainer` to add init containers.

---

##### `labelSelector`<sup>Required</sup> <a name="cdk8s-plus-22.Deployment.property.labelSelector"></a>

```typescript
public readonly labelSelector: {[ key: string ]: string};
```

- *Type:* {[ key: string ]: `string`}

The labels this deployment will match against in order to select pods.

Returns a a copy. Use `selectByLabel()` to add labels.

---

##### `podMetadata`<sup>Required</sup> <a name="cdk8s-plus-22.Deployment.property.podMetadata"></a>

```typescript
public readonly podMetadata: ApiObjectMetadataDefinition;
```

- *Type:* [`cdk8s.ApiObjectMetadataDefinition`](#cdk8s.ApiObjectMetadataDefinition)

Provides read/write access to the underlying pod metadata of the resource.

---

##### `replicas`<sup>Required</sup> <a name="cdk8s-plus-22.Deployment.property.replicas"></a>

```typescript
public readonly replicas: number;
```

- *Type:* `number`

Number of desired pods.

---

##### `securityContext`<sup>Required</sup> <a name="cdk8s-plus-22.Deployment.property.securityContext"></a>

```typescript
public readonly securityContext: PodSecurityContext;
```

- *Type:* [`cdk8s-plus-22.PodSecurityContext`](#cdk8s-plus-22.PodSecurityContext)

---

##### `volumes`<sup>Required</sup> <a name="cdk8s-plus-22.Deployment.property.volumes"></a>

```typescript
public readonly volumes: Volume[];
```

- *Type:* [`cdk8s-plus-22.Volume`](#cdk8s-plus-22.Volume)[]

The volumes associated with this pod.

Use `addVolume` to add volumes.

---

##### `restartPolicy`<sup>Optional</sup> <a name="cdk8s-plus-22.Deployment.property.restartPolicy"></a>

```typescript
public readonly restartPolicy: RestartPolicy;
```

- *Type:* [`cdk8s-plus-22.RestartPolicy`](#cdk8s-plus-22.RestartPolicy)

Restart policy for all containers within the pod.

---

##### `serviceAccount`<sup>Optional</sup> <a name="cdk8s-plus-22.Deployment.property.serviceAccount"></a>

```typescript
public readonly serviceAccount: IServiceAccount;
```

- *Type:* [`cdk8s-plus-22.IServiceAccount`](#cdk8s-plus-22.IServiceAccount)

The service account used to run this pod.

---


### DockerConfigSecret <a name="cdk8s-plus-22.DockerConfigSecret"></a>

Create a secret for storing credentials for accessing a container image registry.

> https://kubernetes.io/docs/concepts/configuration/secret/#docker-config-secrets

#### Initializers <a name="cdk8s-plus-22.DockerConfigSecret.Initializer"></a>

```typescript
import { DockerConfigSecret } from 'cdk8s-plus-22'

new DockerConfigSecret(scope: Construct, id: string, props: DockerConfigSecretProps)
```

##### `scope`<sup>Required</sup> <a name="cdk8s-plus-22.DockerConfigSecret.parameter.scope"></a>

- *Type:* [`constructs.Construct`](#constructs.Construct)

---

##### `id`<sup>Required</sup> <a name="cdk8s-plus-22.DockerConfigSecret.parameter.id"></a>

- *Type:* `string`

---

##### `props`<sup>Required</sup> <a name="cdk8s-plus-22.DockerConfigSecret.parameter.props"></a>

- *Type:* [`cdk8s-plus-22.DockerConfigSecretProps`](#cdk8s-plus-22.DockerConfigSecretProps)

---





### GCEPersistentDiskPersistentVolume <a name="cdk8s-plus-22.GCEPersistentDiskPersistentVolume"></a>

GCEPersistentDisk represents a GCE Disk resource that is attached to a kubelet's host machine and then exposed to the pod.

Provisioned by an admin.

> https://kubernetes.io/docs/concepts/storage/volumes#gcepersistentdisk

#### Initializers <a name="cdk8s-plus-22.GCEPersistentDiskPersistentVolume.Initializer"></a>

```typescript
import { GCEPersistentDiskPersistentVolume } from 'cdk8s-plus-22'

new GCEPersistentDiskPersistentVolume(scope: Construct, id: string, props: GCEPersistentDiskPersistentVolumeProps)
```

##### `scope`<sup>Required</sup> <a name="cdk8s-plus-22.GCEPersistentDiskPersistentVolume.parameter.scope"></a>

- *Type:* [`constructs.Construct`](#constructs.Construct)

---

##### `id`<sup>Required</sup> <a name="cdk8s-plus-22.GCEPersistentDiskPersistentVolume.parameter.id"></a>

- *Type:* `string`

---

##### `props`<sup>Required</sup> <a name="cdk8s-plus-22.GCEPersistentDiskPersistentVolume.parameter.props"></a>

- *Type:* [`cdk8s-plus-22.GCEPersistentDiskPersistentVolumeProps`](#cdk8s-plus-22.GCEPersistentDiskPersistentVolumeProps)

---



#### Properties <a name="Properties"></a>

##### `fsType`<sup>Required</sup> <a name="cdk8s-plus-22.GCEPersistentDiskPersistentVolume.property.fsType"></a>

```typescript
public readonly fsType: string;
```

- *Type:* `string`

File system type of this volume.

---

##### `pdName`<sup>Required</sup> <a name="cdk8s-plus-22.GCEPersistentDiskPersistentVolume.property.pdName"></a>

```typescript
public readonly pdName: string;
```

- *Type:* `string`

PD resource in GCE of this volume.

---

##### `readOnly`<sup>Required</sup> <a name="cdk8s-plus-22.GCEPersistentDiskPersistentVolume.property.readOnly"></a>

```typescript
public readonly readOnly: boolean;
```

- *Type:* `boolean`

Whether or not it is mounted as a read-only volume.

---

##### `partition`<sup>Optional</sup> <a name="cdk8s-plus-22.GCEPersistentDiskPersistentVolume.property.partition"></a>

```typescript
public readonly partition: number;
```

- *Type:* `number`

Partition of this volume.

---


### Ingress <a name="cdk8s-plus-22.Ingress"></a>

Ingress is a collection of rules that allow inbound connections to reach the endpoints defined by a backend.

An Ingress can be configured to give services
externally-reachable urls, load balance traffic, terminate SSL, offer name
based virtual hosting etc.

#### Initializers <a name="cdk8s-plus-22.Ingress.Initializer"></a>

```typescript
import { Ingress } from 'cdk8s-plus-22'

new Ingress(scope: Construct, id: string, props?: IngressProps)
```

##### `scope`<sup>Required</sup> <a name="cdk8s-plus-22.Ingress.parameter.scope"></a>

- *Type:* [`constructs.Construct`](#constructs.Construct)

---

##### `id`<sup>Required</sup> <a name="cdk8s-plus-22.Ingress.parameter.id"></a>

- *Type:* `string`

---

##### `props`<sup>Optional</sup> <a name="cdk8s-plus-22.Ingress.parameter.props"></a>

- *Type:* [`cdk8s-plus-22.IngressProps`](#cdk8s-plus-22.IngressProps)

---

#### Methods <a name="Methods"></a>

##### `addDefaultBackend` <a name="cdk8s-plus-22.Ingress.addDefaultBackend"></a>

```typescript
public addDefaultBackend(backend: IngressBackend)
```

###### `backend`<sup>Required</sup> <a name="cdk8s-plus-22.Ingress.parameter.backend"></a>

- *Type:* [`cdk8s-plus-22.IngressBackend`](#cdk8s-plus-22.IngressBackend)

The backend to use for requests that do not match any rule.

---

##### `addHostDefaultBackend` <a name="cdk8s-plus-22.Ingress.addHostDefaultBackend"></a>

```typescript
public addHostDefaultBackend(host: string, backend: IngressBackend)
```

###### `host`<sup>Required</sup> <a name="cdk8s-plus-22.Ingress.parameter.host"></a>

- *Type:* `string`

The host name to match.

---

###### `backend`<sup>Required</sup> <a name="cdk8s-plus-22.Ingress.parameter.backend"></a>

- *Type:* [`cdk8s-plus-22.IngressBackend`](#cdk8s-plus-22.IngressBackend)

The backend to route to.

---

##### `addHostRule` <a name="cdk8s-plus-22.Ingress.addHostRule"></a>

```typescript
public addHostRule(host: string, path: string, backend: IngressBackend, pathType?: HttpIngressPathType)
```

###### `host`<sup>Required</sup> <a name="cdk8s-plus-22.Ingress.parameter.host"></a>

- *Type:* `string`

The host name.

---

###### `path`<sup>Required</sup> <a name="cdk8s-plus-22.Ingress.parameter.path"></a>

- *Type:* `string`

The HTTP path.

---

###### `backend`<sup>Required</sup> <a name="cdk8s-plus-22.Ingress.parameter.backend"></a>

- *Type:* [`cdk8s-plus-22.IngressBackend`](#cdk8s-plus-22.IngressBackend)

The backend to route requests to.

---

###### `pathType`<sup>Optional</sup> <a name="cdk8s-plus-22.Ingress.parameter.pathType"></a>

- *Type:* [`cdk8s-plus-22.HttpIngressPathType`](#cdk8s-plus-22.HttpIngressPathType)

How the path is matched against request paths.

---

##### `addRule` <a name="cdk8s-plus-22.Ingress.addRule"></a>

```typescript
public addRule(path: string, backend: IngressBackend, pathType?: HttpIngressPathType)
```

###### `path`<sup>Required</sup> <a name="cdk8s-plus-22.Ingress.parameter.path"></a>

- *Type:* `string`

The HTTP path.

---

###### `backend`<sup>Required</sup> <a name="cdk8s-plus-22.Ingress.parameter.backend"></a>

- *Type:* [`cdk8s-plus-22.IngressBackend`](#cdk8s-plus-22.IngressBackend)

The backend to route requests to.

---

###### `pathType`<sup>Optional</sup> <a name="cdk8s-plus-22.Ingress.parameter.pathType"></a>

- *Type:* [`cdk8s-plus-22.HttpIngressPathType`](#cdk8s-plus-22.HttpIngressPathType)

How the path is matched against request paths.

---

##### `addRules` <a name="cdk8s-plus-22.Ingress.addRules"></a>

```typescript
public addRules(rules: IngressRule)
```

###### `rules`<sup>Required</sup> <a name="cdk8s-plus-22.Ingress.parameter.rules"></a>

- *Type:* [`cdk8s-plus-22.IngressRule`](#cdk8s-plus-22.IngressRule)

The rules to add.

---

##### `addTls` <a name="cdk8s-plus-22.Ingress.addTls"></a>

```typescript
public addTls(tls: IngressTls[])
```

###### `tls`<sup>Required</sup> <a name="cdk8s-plus-22.Ingress.parameter.tls"></a>

- *Type:* [`cdk8s-plus-22.IngressTls`](#cdk8s-plus-22.IngressTls)[]

---




### Job <a name="cdk8s-plus-22.Job"></a>

- *Implements:* [`cdk8s-plus-22.IPodTemplate`](#cdk8s-plus-22.IPodTemplate)

A Job creates one or more Pods and ensures that a specified number of them successfully terminate.

As pods successfully complete,
the Job tracks the successful completions. When a specified number of successful completions is reached, the task (ie, Job) is complete.
Deleting a Job will clean up the Pods it created. A simple case is to create one Job object in order to reliably run one Pod to completion.
The Job object will start a new Pod if the first Pod fails or is deleted (for example due to a node hardware failure or a node reboot).
You can also use a Job to run multiple Pods in parallel.

#### Initializers <a name="cdk8s-plus-22.Job.Initializer"></a>

```typescript
import { Job } from 'cdk8s-plus-22'

new Job(scope: Construct, id: string, props?: JobProps)
```

##### `scope`<sup>Required</sup> <a name="cdk8s-plus-22.Job.parameter.scope"></a>

- *Type:* [`constructs.Construct`](#constructs.Construct)

---

##### `id`<sup>Required</sup> <a name="cdk8s-plus-22.Job.parameter.id"></a>

- *Type:* `string`

---

##### `props`<sup>Optional</sup> <a name="cdk8s-plus-22.Job.parameter.props"></a>

- *Type:* [`cdk8s-plus-22.JobProps`](#cdk8s-plus-22.JobProps)

---

#### Methods <a name="Methods"></a>

##### `addContainer` <a name="cdk8s-plus-22.Job.addContainer"></a>

```typescript
public addContainer(container: ContainerProps)
```

###### `container`<sup>Required</sup> <a name="cdk8s-plus-22.Job.parameter.container"></a>

- *Type:* [`cdk8s-plus-22.ContainerProps`](#cdk8s-plus-22.ContainerProps)

---

##### `addHostAlias` <a name="cdk8s-plus-22.Job.addHostAlias"></a>

```typescript
public addHostAlias(hostAlias: HostAlias)
```

###### `hostAlias`<sup>Required</sup> <a name="cdk8s-plus-22.Job.parameter.hostAlias"></a>

- *Type:* [`cdk8s-plus-22.HostAlias`](#cdk8s-plus-22.HostAlias)

---

##### `addInitContainer` <a name="cdk8s-plus-22.Job.addInitContainer"></a>

```typescript
public addInitContainer(container: ContainerProps)
```

###### `container`<sup>Required</sup> <a name="cdk8s-plus-22.Job.parameter.container"></a>

- *Type:* [`cdk8s-plus-22.ContainerProps`](#cdk8s-plus-22.ContainerProps)

---

##### `addVolume` <a name="cdk8s-plus-22.Job.addVolume"></a>

```typescript
public addVolume(volume: Volume)
```

###### `volume`<sup>Required</sup> <a name="cdk8s-plus-22.Job.parameter.volume"></a>

- *Type:* [`cdk8s-plus-22.Volume`](#cdk8s-plus-22.Volume)

---


#### Properties <a name="Properties"></a>

##### `containers`<sup>Required</sup> <a name="cdk8s-plus-22.Job.property.containers"></a>

```typescript
public readonly containers: Container[];
```

- *Type:* [`cdk8s-plus-22.Container`](#cdk8s-plus-22.Container)[]

The containers belonging to the pod.

Use `addContainer` to add containers.

---

##### `hostAliases`<sup>Required</sup> <a name="cdk8s-plus-22.Job.property.hostAliases"></a>

```typescript
public readonly hostAliases: HostAlias[];
```

- *Type:* [`cdk8s-plus-22.HostAlias`](#cdk8s-plus-22.HostAlias)[]

An optional list of hosts and IPs that will be injected into the pod's hosts file if specified.

This is only valid for non-hostNetwork pods.

---

##### `initContainers`<sup>Required</sup> <a name="cdk8s-plus-22.Job.property.initContainers"></a>

```typescript
public readonly initContainers: Container[];
```

- *Type:* [`cdk8s-plus-22.Container`](#cdk8s-plus-22.Container)[]

The init containers belonging to the pod.

Use `addInitContainer` to add init containers.

---

##### `podMetadata`<sup>Required</sup> <a name="cdk8s-plus-22.Job.property.podMetadata"></a>

```typescript
public readonly podMetadata: ApiObjectMetadataDefinition;
```

- *Type:* [`cdk8s.ApiObjectMetadataDefinition`](#cdk8s.ApiObjectMetadataDefinition)

Provides read/write access to the underlying pod metadata of the resource.

---

##### `securityContext`<sup>Required</sup> <a name="cdk8s-plus-22.Job.property.securityContext"></a>

```typescript
public readonly securityContext: PodSecurityContext;
```

- *Type:* [`cdk8s-plus-22.PodSecurityContext`](#cdk8s-plus-22.PodSecurityContext)

---

##### `volumes`<sup>Required</sup> <a name="cdk8s-plus-22.Job.property.volumes"></a>

```typescript
public readonly volumes: Volume[];
```

- *Type:* [`cdk8s-plus-22.Volume`](#cdk8s-plus-22.Volume)[]

The volumes associated with this pod.

Use `addVolume` to add volumes.

---

##### `activeDeadline`<sup>Optional</sup> <a name="cdk8s-plus-22.Job.property.activeDeadline"></a>

```typescript
public readonly activeDeadline: Duration;
```

- *Type:* [`cdk8s.Duration`](#cdk8s.Duration)

Duration before job is terminated.

If undefined, there is no deadline.

---

##### `backoffLimit`<sup>Optional</sup> <a name="cdk8s-plus-22.Job.property.backoffLimit"></a>

```typescript
public readonly backoffLimit: number;
```

- *Type:* `number`

Number of retries before marking failed.

---

##### `restartPolicy`<sup>Optional</sup> <a name="cdk8s-plus-22.Job.property.restartPolicy"></a>

```typescript
public readonly restartPolicy: RestartPolicy;
```

- *Type:* [`cdk8s-plus-22.RestartPolicy`](#cdk8s-plus-22.RestartPolicy)

Restart policy for all containers within the pod.

---

##### `serviceAccount`<sup>Optional</sup> <a name="cdk8s-plus-22.Job.property.serviceAccount"></a>

```typescript
public readonly serviceAccount: IServiceAccount;
```

- *Type:* [`cdk8s-plus-22.IServiceAccount`](#cdk8s-plus-22.IServiceAccount)

The service account used to run this pod.

---

##### `ttlAfterFinished`<sup>Optional</sup> <a name="cdk8s-plus-22.Job.property.ttlAfterFinished"></a>

```typescript
public readonly ttlAfterFinished: Duration;
```

- *Type:* [`cdk8s.Duration`](#cdk8s.Duration)

TTL before the job is deleted after it is finished.

---


### PersistentVolume <a name="cdk8s-plus-22.PersistentVolume"></a>

- *Implements:* [`cdk8s-plus-22.IPersistentVolume`](#cdk8s-plus-22.IPersistentVolume)

A PersistentVolume (PV) is a piece of storage in the cluster that has been provisioned by an administrator or dynamically provisioned using Storage Classes.

It is a resource in the cluster just like a node is a cluster resource.
PVs are volume plugins like Volumes, but have a lifecycle independent of any
individual Pod that uses the PV. This API object captures the details of the
implementation of the storage, be that NFS, iSCSI, or a
cloud-provider-specific storage system.

#### Initializers <a name="cdk8s-plus-22.PersistentVolume.Initializer"></a>

```typescript
import { PersistentVolume } from 'cdk8s-plus-22'

new PersistentVolume(scope: Construct, id: string, props?: PersistentVolumeProps)
```

##### `scope`<sup>Required</sup> <a name="cdk8s-plus-22.PersistentVolume.parameter.scope"></a>

- *Type:* [`constructs.Construct`](#constructs.Construct)

---

##### `id`<sup>Required</sup> <a name="cdk8s-plus-22.PersistentVolume.parameter.id"></a>

- *Type:* `string`

---

##### `props`<sup>Optional</sup> <a name="cdk8s-plus-22.PersistentVolume.parameter.props"></a>

- *Type:* [`cdk8s-plus-22.PersistentVolumeProps`](#cdk8s-plus-22.PersistentVolumeProps)

---

#### Methods <a name="Methods"></a>

##### `bind` <a name="cdk8s-plus-22.PersistentVolume.bind"></a>

```typescript
public bind(pvc: IPersistentVolumeClaim)
```

###### `pvc`<sup>Required</sup> <a name="cdk8s-plus-22.PersistentVolume.parameter.pvc"></a>

- *Type:* [`cdk8s-plus-22.IPersistentVolumeClaim`](#cdk8s-plus-22.IPersistentVolumeClaim)

The PVC to bind to.

---

##### `reserve` <a name="cdk8s-plus-22.PersistentVolume.reserve"></a>

```typescript
public reserve()
```

#### Static Functions <a name="Static Functions"></a>

##### `fromPersistentVolumeName` <a name="cdk8s-plus-22.PersistentVolume.fromPersistentVolumeName"></a>

```typescript
import { PersistentVolume } from 'cdk8s-plus-22'

PersistentVolume.fromPersistentVolumeName(volumeName: string)
```

###### `volumeName`<sup>Required</sup> <a name="cdk8s-plus-22.PersistentVolume.parameter.volumeName"></a>

- *Type:* `string`

The name of the pv to reference.

---

#### Properties <a name="Properties"></a>

##### `mode`<sup>Required</sup> <a name="cdk8s-plus-22.PersistentVolume.property.mode"></a>

```typescript
public readonly mode: PersistentVolumeMode;
```

- *Type:* [`cdk8s-plus-22.PersistentVolumeMode`](#cdk8s-plus-22.PersistentVolumeMode)

Volume mode of this volume.

---

##### `reclaimPolicy`<sup>Required</sup> <a name="cdk8s-plus-22.PersistentVolume.property.reclaimPolicy"></a>

```typescript
public readonly reclaimPolicy: PersistentVolumeReclaimPolicy;
```

- *Type:* [`cdk8s-plus-22.PersistentVolumeReclaimPolicy`](#cdk8s-plus-22.PersistentVolumeReclaimPolicy)

Reclaim policy of this volume.

---

##### `accessModes`<sup>Optional</sup> <a name="cdk8s-plus-22.PersistentVolume.property.accessModes"></a>

```typescript
public readonly accessModes: PersistentVolumeAccessMode[];
```

- *Type:* [`cdk8s-plus-22.PersistentVolumeAccessMode`](#cdk8s-plus-22.PersistentVolumeAccessMode)[]

Access modes requirement of this claim.

---

##### `claim`<sup>Optional</sup> <a name="cdk8s-plus-22.PersistentVolume.property.claim"></a>

```typescript
public readonly claim: IPersistentVolumeClaim;
```

- *Type:* [`cdk8s-plus-22.IPersistentVolumeClaim`](#cdk8s-plus-22.IPersistentVolumeClaim)

PVC this volume is bound to.

Undefined means this volume is not yet
claimed by any PVC.

---

##### `mountOptions`<sup>Optional</sup> <a name="cdk8s-plus-22.PersistentVolume.property.mountOptions"></a>

```typescript
public readonly mountOptions: string[];
```

- *Type:* `string`[]

Mount options of this volume.

---

##### `storage`<sup>Optional</sup> <a name="cdk8s-plus-22.PersistentVolume.property.storage"></a>

```typescript
public readonly storage: Size;
```

- *Type:* [`cdk8s.Size`](#cdk8s.Size)

Storage size of this volume.

---

##### `storageClassName`<sup>Optional</sup> <a name="cdk8s-plus-22.PersistentVolume.property.storageClassName"></a>

```typescript
public readonly storageClassName: string;
```

- *Type:* `string`

Storage class this volume belongs to.

---


### PersistentVolumeClaim <a name="cdk8s-plus-22.PersistentVolumeClaim"></a>

- *Implements:* [`cdk8s-plus-22.IPersistentVolumeClaim`](#cdk8s-plus-22.IPersistentVolumeClaim)

A PersistentVolumeClaim (PVC) is a request for storage by a user.

It is similar to a Pod. Pods consume node resources and PVCs consume PV resources.
Pods can request specific levels of resources (CPU and Memory).
Claims can request specific size and access modes

#### Initializers <a name="cdk8s-plus-22.PersistentVolumeClaim.Initializer"></a>

```typescript
import { PersistentVolumeClaim } from 'cdk8s-plus-22'

new PersistentVolumeClaim(scope: Construct, id: string, props?: PersistentVolumeClaimProps)
```

##### `scope`<sup>Required</sup> <a name="cdk8s-plus-22.PersistentVolumeClaim.parameter.scope"></a>

- *Type:* [`constructs.Construct`](#constructs.Construct)

---

##### `id`<sup>Required</sup> <a name="cdk8s-plus-22.PersistentVolumeClaim.parameter.id"></a>

- *Type:* `string`

---

##### `props`<sup>Optional</sup> <a name="cdk8s-plus-22.PersistentVolumeClaim.parameter.props"></a>

- *Type:* [`cdk8s-plus-22.PersistentVolumeClaimProps`](#cdk8s-plus-22.PersistentVolumeClaimProps)

---

#### Methods <a name="Methods"></a>

##### `bind` <a name="cdk8s-plus-22.PersistentVolumeClaim.bind"></a>

```typescript
public bind(pv: IPersistentVolume)
```

###### `pv`<sup>Required</sup> <a name="cdk8s-plus-22.PersistentVolumeClaim.parameter.pv"></a>

- *Type:* [`cdk8s-plus-22.IPersistentVolume`](#cdk8s-plus-22.IPersistentVolume)

The PV to bind to.

---

#### Static Functions <a name="Static Functions"></a>

##### `fromClaimName` <a name="cdk8s-plus-22.PersistentVolumeClaim.fromClaimName"></a>

```typescript
import { PersistentVolumeClaim } from 'cdk8s-plus-22'

PersistentVolumeClaim.fromClaimName(claimName: string)
```

###### `claimName`<sup>Required</sup> <a name="cdk8s-plus-22.PersistentVolumeClaim.parameter.claimName"></a>

- *Type:* `string`

The name of the pvc to reference.

---

#### Properties <a name="Properties"></a>

##### `volumeMode`<sup>Required</sup> <a name="cdk8s-plus-22.PersistentVolumeClaim.property.volumeMode"></a>

```typescript
public readonly volumeMode: PersistentVolumeMode;
```

- *Type:* [`cdk8s-plus-22.PersistentVolumeMode`](#cdk8s-plus-22.PersistentVolumeMode)

Volume mode requirement of this claim.

---

##### `accessModes`<sup>Optional</sup> <a name="cdk8s-plus-22.PersistentVolumeClaim.property.accessModes"></a>

```typescript
public readonly accessModes: PersistentVolumeAccessMode[];
```

- *Type:* [`cdk8s-plus-22.PersistentVolumeAccessMode`](#cdk8s-plus-22.PersistentVolumeAccessMode)[]

Access modes requirement of this claim.

---

##### `storage`<sup>Optional</sup> <a name="cdk8s-plus-22.PersistentVolumeClaim.property.storage"></a>

```typescript
public readonly storage: Size;
```

- *Type:* [`cdk8s.Size`](#cdk8s.Size)

Storage requirement of this claim.

---

##### `storageClassName`<sup>Optional</sup> <a name="cdk8s-plus-22.PersistentVolumeClaim.property.storageClassName"></a>

```typescript
public readonly storageClassName: string;
```

- *Type:* `string`

Storage class requirment of this claim.

---

##### `volume`<sup>Optional</sup> <a name="cdk8s-plus-22.PersistentVolumeClaim.property.volume"></a>

```typescript
public readonly volume: IPersistentVolume;
```

- *Type:* [`cdk8s-plus-22.IPersistentVolume`](#cdk8s-plus-22.IPersistentVolume)

PV this claim is bound to.

Undefined means the claim is not bound
to any specific volume.

---


### Pod <a name="cdk8s-plus-22.Pod"></a>

- *Implements:* [`cdk8s-plus-22.IPodSpec`](#cdk8s-plus-22.IPodSpec)

Pod is a collection of containers that can run on a host.

This resource is
created by clients and scheduled onto hosts.

#### Initializers <a name="cdk8s-plus-22.Pod.Initializer"></a>

```typescript
import { Pod } from 'cdk8s-plus-22'

new Pod(scope: Construct, id: string, props?: PodProps)
```

##### `scope`<sup>Required</sup> <a name="cdk8s-plus-22.Pod.parameter.scope"></a>

- *Type:* [`constructs.Construct`](#constructs.Construct)

---

##### `id`<sup>Required</sup> <a name="cdk8s-plus-22.Pod.parameter.id"></a>

- *Type:* `string`

---

##### `props`<sup>Optional</sup> <a name="cdk8s-plus-22.Pod.parameter.props"></a>

- *Type:* [`cdk8s-plus-22.PodProps`](#cdk8s-plus-22.PodProps)

---

#### Methods <a name="Methods"></a>

##### `addContainer` <a name="cdk8s-plus-22.Pod.addContainer"></a>

```typescript
public addContainer(container: ContainerProps)
```

###### `container`<sup>Required</sup> <a name="cdk8s-plus-22.Pod.parameter.container"></a>

- *Type:* [`cdk8s-plus-22.ContainerProps`](#cdk8s-plus-22.ContainerProps)

---

##### `addHostAlias` <a name="cdk8s-plus-22.Pod.addHostAlias"></a>

```typescript
public addHostAlias(hostAlias: HostAlias)
```

###### `hostAlias`<sup>Required</sup> <a name="cdk8s-plus-22.Pod.parameter.hostAlias"></a>

- *Type:* [`cdk8s-plus-22.HostAlias`](#cdk8s-plus-22.HostAlias)

---

##### `addInitContainer` <a name="cdk8s-plus-22.Pod.addInitContainer"></a>

```typescript
public addInitContainer(container: ContainerProps)
```

###### `container`<sup>Required</sup> <a name="cdk8s-plus-22.Pod.parameter.container"></a>

- *Type:* [`cdk8s-plus-22.ContainerProps`](#cdk8s-plus-22.ContainerProps)

---

##### `addVolume` <a name="cdk8s-plus-22.Pod.addVolume"></a>

```typescript
public addVolume(volume: Volume)
```

###### `volume`<sup>Required</sup> <a name="cdk8s-plus-22.Pod.parameter.volume"></a>

- *Type:* [`cdk8s-plus-22.Volume`](#cdk8s-plus-22.Volume)

---


#### Properties <a name="Properties"></a>

##### `containers`<sup>Required</sup> <a name="cdk8s-plus-22.Pod.property.containers"></a>

```typescript
public readonly containers: Container[];
```

- *Type:* [`cdk8s-plus-22.Container`](#cdk8s-plus-22.Container)[]

The containers belonging to the pod.

Use `addContainer` to add containers.

---

##### `hostAliases`<sup>Required</sup> <a name="cdk8s-plus-22.Pod.property.hostAliases"></a>

```typescript
public readonly hostAliases: HostAlias[];
```

- *Type:* [`cdk8s-plus-22.HostAlias`](#cdk8s-plus-22.HostAlias)[]

An optional list of hosts and IPs that will be injected into the pod's hosts file if specified.

This is only valid for non-hostNetwork pods.

---

##### `initContainers`<sup>Required</sup> <a name="cdk8s-plus-22.Pod.property.initContainers"></a>

```typescript
public readonly initContainers: Container[];
```

- *Type:* [`cdk8s-plus-22.Container`](#cdk8s-plus-22.Container)[]

The init containers belonging to the pod.

Use `addInitContainer` to add init containers.

---

##### `securityContext`<sup>Required</sup> <a name="cdk8s-plus-22.Pod.property.securityContext"></a>

```typescript
public readonly securityContext: PodSecurityContext;
```

- *Type:* [`cdk8s-plus-22.PodSecurityContext`](#cdk8s-plus-22.PodSecurityContext)

---

##### `volumes`<sup>Required</sup> <a name="cdk8s-plus-22.Pod.property.volumes"></a>

```typescript
public readonly volumes: Volume[];
```

- *Type:* [`cdk8s-plus-22.Volume`](#cdk8s-plus-22.Volume)[]

The volumes associated with this pod.

Use `addVolume` to add volumes.

---

##### `restartPolicy`<sup>Optional</sup> <a name="cdk8s-plus-22.Pod.property.restartPolicy"></a>

```typescript
public readonly restartPolicy: RestartPolicy;
```

- *Type:* [`cdk8s-plus-22.RestartPolicy`](#cdk8s-plus-22.RestartPolicy)

Restart policy for all containers within the pod.

---

##### `serviceAccount`<sup>Optional</sup> <a name="cdk8s-plus-22.Pod.property.serviceAccount"></a>

```typescript
public readonly serviceAccount: IServiceAccount;
```

- *Type:* [`cdk8s-plus-22.IServiceAccount`](#cdk8s-plus-22.IServiceAccount)

The service account used to run this pod.

---


### Resource <a name="cdk8s-plus-22.Resource"></a>

- *Implements:* [`cdk8s-plus-22.IResource`](#cdk8s-plus-22.IResource)

Base class for all Kubernetes objects in stdk8s.

Represents a single
resource.

#### Initializers <a name="cdk8s-plus-22.Resource.Initializer"></a>

```typescript
import { Resource } from 'cdk8s-plus-22'

new Resource(scope: Construct, id: string, options?: ConstructOptions)
```

##### `scope`<sup>Required</sup> <a name="cdk8s-plus-22.Resource.parameter.scope"></a>

- *Type:* [`constructs.Construct`](#constructs.Construct)

The scope in which to define this construct.

---

##### `id`<sup>Required</sup> <a name="cdk8s-plus-22.Resource.parameter.id"></a>

- *Type:* `string`

The scoped construct ID.

Must be unique amongst siblings. If
the ID includes a path separator (`/`), then it will be replaced by double
dash `--`.

---

##### `options`<sup>Optional</sup> <a name="cdk8s-plus-22.Resource.parameter.options"></a>

- *Type:* [`constructs.ConstructOptions`](#constructs.ConstructOptions)

Options.

---



#### Properties <a name="Properties"></a>

##### `metadata`<sup>Required</sup> <a name="cdk8s-plus-22.Resource.property.metadata"></a>

```typescript
public readonly metadata: ApiObjectMetadataDefinition;
```

- *Type:* [`cdk8s.ApiObjectMetadataDefinition`](#cdk8s.ApiObjectMetadataDefinition)

---

##### `name`<sup>Required</sup> <a name="cdk8s-plus-22.Resource.property.name"></a>

```typescript
public readonly name: string;
```

- *Type:* `string`

The name of this API object.

---


### Secret <a name="cdk8s-plus-22.Secret"></a>

- *Implements:* [`cdk8s-plus-22.ISecret`](#cdk8s-plus-22.ISecret)

Kubernetes Secrets let you store and manage sensitive information, such as passwords, OAuth tokens, and ssh keys.

Storing confidential information in a
Secret is safer and more flexible than putting it verbatim in a Pod
definition or in a container image.

> https://kubernetes.io/docs/concepts/configuration/secret

#### Initializers <a name="cdk8s-plus-22.Secret.Initializer"></a>

```typescript
import { Secret } from 'cdk8s-plus-22'

new Secret(scope: Construct, id: string, props?: SecretProps)
```

##### `scope`<sup>Required</sup> <a name="cdk8s-plus-22.Secret.parameter.scope"></a>

- *Type:* [`constructs.Construct`](#constructs.Construct)

---

##### `id`<sup>Required</sup> <a name="cdk8s-plus-22.Secret.parameter.id"></a>

- *Type:* `string`

---

##### `props`<sup>Optional</sup> <a name="cdk8s-plus-22.Secret.parameter.props"></a>

- *Type:* [`cdk8s-plus-22.SecretProps`](#cdk8s-plus-22.SecretProps)

---

#### Methods <a name="Methods"></a>

##### `addStringData` <a name="cdk8s-plus-22.Secret.addStringData"></a>

```typescript
public addStringData(key: string, value: string)
```

###### `key`<sup>Required</sup> <a name="cdk8s-plus-22.Secret.parameter.key"></a>

- *Type:* `string`

Key.

---

###### `value`<sup>Required</sup> <a name="cdk8s-plus-22.Secret.parameter.value"></a>

- *Type:* `string`

Value.

---

##### `getStringData` <a name="cdk8s-plus-22.Secret.getStringData"></a>

```typescript
public getStringData(key: string)
```

###### `key`<sup>Required</sup> <a name="cdk8s-plus-22.Secret.parameter.key"></a>

- *Type:* `string`

Key.

---

#### Static Functions <a name="Static Functions"></a>

##### `fromSecretName` <a name="cdk8s-plus-22.Secret.fromSecretName"></a>

```typescript
import { Secret } from 'cdk8s-plus-22'

Secret.fromSecretName(name: string)
```

###### `name`<sup>Required</sup> <a name="cdk8s-plus-22.Secret.parameter.name"></a>

- *Type:* `string`

The name of the secret to reference.

---



### Service <a name="cdk8s-plus-22.Service"></a>

An abstract way to expose an application running on a set of Pods as a network service.

With Kubernetes you don't need to modify your application to use an unfamiliar service discovery mechanism.
Kubernetes gives Pods their own IP addresses and a single DNS name for a set of Pods, and can load-balance across them.

For example, consider a stateless image-processing backend which is running with 3 replicas. Those replicas are fungible—frontends do not care which backend they use.
While the actual Pods that compose the backend set may change, the frontend clients should not need to be aware of that,
nor should they need to keep track of the set of backends themselves.
The Service abstraction enables this decoupling.

If you're able to use Kubernetes APIs for service discovery in your application, you can query the API server for Endpoints,
that get updated whenever the set of Pods in a Service changes. For non-native applications, Kubernetes offers ways to place a network port
or load balancer in between your application and the backend Pods.

#### Initializers <a name="cdk8s-plus-22.Service.Initializer"></a>

```typescript
import { Service } from 'cdk8s-plus-22'

new Service(scope: Construct, id: string, props?: ServiceProps)
```

##### `scope`<sup>Required</sup> <a name="cdk8s-plus-22.Service.parameter.scope"></a>

- *Type:* [`constructs.Construct`](#constructs.Construct)

---

##### `id`<sup>Required</sup> <a name="cdk8s-plus-22.Service.parameter.id"></a>

- *Type:* `string`

---

##### `props`<sup>Optional</sup> <a name="cdk8s-plus-22.Service.parameter.props"></a>

- *Type:* [`cdk8s-plus-22.ServiceProps`](#cdk8s-plus-22.ServiceProps)

---

#### Methods <a name="Methods"></a>

##### `addDeployment` <a name="cdk8s-plus-22.Service.addDeployment"></a>

```typescript
public addDeployment(deployment: Deployment, options?: AddDeploymentOptions)
```

###### `deployment`<sup>Required</sup> <a name="cdk8s-plus-22.Service.parameter.deployment"></a>

- *Type:* [`cdk8s-plus-22.Deployment`](#cdk8s-plus-22.Deployment)

The deployment to expose.

---

###### `options`<sup>Optional</sup> <a name="cdk8s-plus-22.Service.parameter.options"></a>

- *Type:* [`cdk8s-plus-22.AddDeploymentOptions`](#cdk8s-plus-22.AddDeploymentOptions)

Optional settings for the port.

---

##### `addSelector` <a name="cdk8s-plus-22.Service.addSelector"></a>

```typescript
public addSelector(label: string, value: string)
```

###### `label`<sup>Required</sup> <a name="cdk8s-plus-22.Service.parameter.label"></a>

- *Type:* `string`

The label key.

---

###### `value`<sup>Required</sup> <a name="cdk8s-plus-22.Service.parameter.value"></a>

- *Type:* `string`

The label value.

---

##### `exposeViaIngress` <a name="cdk8s-plus-22.Service.exposeViaIngress"></a>

```typescript
public exposeViaIngress(path: string, options?: ExposeServiceViaIngressOptions)
```

###### `path`<sup>Required</sup> <a name="cdk8s-plus-22.Service.parameter.path"></a>

- *Type:* `string`

The path to expose the service under.

---

###### `options`<sup>Optional</sup> <a name="cdk8s-plus-22.Service.parameter.options"></a>

- *Type:* [`cdk8s-plus-22.ExposeServiceViaIngressOptions`](#cdk8s-plus-22.ExposeServiceViaIngressOptions)

Additional options.

---

##### `serve` <a name="cdk8s-plus-22.Service.serve"></a>

```typescript
public serve(port: number, options?: ServicePortOptions)
```

###### `port`<sup>Required</sup> <a name="cdk8s-plus-22.Service.parameter.port"></a>

- *Type:* `number`

The port definition.

---

###### `options`<sup>Optional</sup> <a name="cdk8s-plus-22.Service.parameter.options"></a>

- *Type:* [`cdk8s-plus-22.ServicePortOptions`](#cdk8s-plus-22.ServicePortOptions)

---


#### Properties <a name="Properties"></a>

##### `ports`<sup>Required</sup> <a name="cdk8s-plus-22.Service.property.ports"></a>

```typescript
public readonly ports: ServicePort[];
```

- *Type:* [`cdk8s-plus-22.ServicePort`](#cdk8s-plus-22.ServicePort)[]

Ports for this service.

Use `serve()` to expose additional service ports.

---

##### `selector`<sup>Required</sup> <a name="cdk8s-plus-22.Service.property.selector"></a>

```typescript
public readonly selector: {[ key: string ]: string};
```

- *Type:* {[ key: string ]: `string`}

Returns the labels which are used to select pods for this service.

---

##### `type`<sup>Required</sup> <a name="cdk8s-plus-22.Service.property.type"></a>

```typescript
public readonly type: ServiceType;
```

- *Type:* [`cdk8s-plus-22.ServiceType`](#cdk8s-plus-22.ServiceType)

Determines how the Service is exposed.

---

##### `clusterIP`<sup>Optional</sup> <a name="cdk8s-plus-22.Service.property.clusterIP"></a>

```typescript
public readonly clusterIP: string;
```

- *Type:* `string`

The IP address of the service and is usually assigned randomly by the master.

---

##### `externalName`<sup>Optional</sup> <a name="cdk8s-plus-22.Service.property.externalName"></a>

```typescript
public readonly externalName: string;
```

- *Type:* `string`

The externalName to be used for EXTERNAL_NAME types.

---


### ServiceAccount <a name="cdk8s-plus-22.ServiceAccount"></a>

- *Implements:* [`cdk8s-plus-22.IServiceAccount`](#cdk8s-plus-22.IServiceAccount)

A service account provides an identity for processes that run in a Pod.

When you (a human) access the cluster (for example, using kubectl), you are
authenticated by the apiserver as a particular User Account (currently this
is usually admin, unless your cluster administrator has customized your
cluster). Processes in containers inside pods can also contact the apiserver.
When they do, they are authenticated as a particular Service Account (for
example, default).

> https://kubernetes.io/docs/tasks/configure-pod-container/configure-service-account

#### Initializers <a name="cdk8s-plus-22.ServiceAccount.Initializer"></a>

```typescript
import { ServiceAccount } from 'cdk8s-plus-22'

new ServiceAccount(scope: Construct, id: string, props?: ServiceAccountProps)
```

##### `scope`<sup>Required</sup> <a name="cdk8s-plus-22.ServiceAccount.parameter.scope"></a>

- *Type:* [`constructs.Construct`](#constructs.Construct)

---

##### `id`<sup>Required</sup> <a name="cdk8s-plus-22.ServiceAccount.parameter.id"></a>

- *Type:* `string`

---

##### `props`<sup>Optional</sup> <a name="cdk8s-plus-22.ServiceAccount.parameter.props"></a>

- *Type:* [`cdk8s-plus-22.ServiceAccountProps`](#cdk8s-plus-22.ServiceAccountProps)

---

#### Methods <a name="Methods"></a>

##### `addSecret` <a name="cdk8s-plus-22.ServiceAccount.addSecret"></a>

```typescript
public addSecret(secret: ISecret)
```

###### `secret`<sup>Required</sup> <a name="cdk8s-plus-22.ServiceAccount.parameter.secret"></a>

- *Type:* [`cdk8s-plus-22.ISecret`](#cdk8s-plus-22.ISecret)

The secret.

---

#### Static Functions <a name="Static Functions"></a>

##### `fromServiceAccountName` <a name="cdk8s-plus-22.ServiceAccount.fromServiceAccountName"></a>

```typescript
import { ServiceAccount } from 'cdk8s-plus-22'

ServiceAccount.fromServiceAccountName(name: string)
```

###### `name`<sup>Required</sup> <a name="cdk8s-plus-22.ServiceAccount.parameter.name"></a>

- *Type:* `string`

The name of the service account resource.

---

#### Properties <a name="Properties"></a>

##### `secrets`<sup>Required</sup> <a name="cdk8s-plus-22.ServiceAccount.property.secrets"></a>

```typescript
public readonly secrets: ISecret[];
```

- *Type:* [`cdk8s-plus-22.ISecret`](#cdk8s-plus-22.ISecret)[]

List of secrets allowed to be used by pods running using this service account.

Returns a copy. To add a secret, use `addSecret()`.

---


### ServiceAccountTokenSecret <a name="cdk8s-plus-22.ServiceAccountTokenSecret"></a>

Create a secret for a service account token.

> https://kubernetes.io/docs/concepts/configuration/secret/#service-account-token-secrets

#### Initializers <a name="cdk8s-plus-22.ServiceAccountTokenSecret.Initializer"></a>

```typescript
import { ServiceAccountTokenSecret } from 'cdk8s-plus-22'

new ServiceAccountTokenSecret(scope: Construct, id: string, props: ServiceAccountTokenSecretProps)
```

##### `scope`<sup>Required</sup> <a name="cdk8s-plus-22.ServiceAccountTokenSecret.parameter.scope"></a>

- *Type:* [`constructs.Construct`](#constructs.Construct)

---

##### `id`<sup>Required</sup> <a name="cdk8s-plus-22.ServiceAccountTokenSecret.parameter.id"></a>

- *Type:* `string`

---

##### `props`<sup>Required</sup> <a name="cdk8s-plus-22.ServiceAccountTokenSecret.parameter.props"></a>

- *Type:* [`cdk8s-plus-22.ServiceAccountTokenSecretProps`](#cdk8s-plus-22.ServiceAccountTokenSecretProps)

---





### SshAuthSecret <a name="cdk8s-plus-22.SshAuthSecret"></a>

Create a secret for ssh authentication.

> https://kubernetes.io/docs/concepts/configuration/secret/#ssh-authentication-secrets

#### Initializers <a name="cdk8s-plus-22.SshAuthSecret.Initializer"></a>

```typescript
import { SshAuthSecret } from 'cdk8s-plus-22'

new SshAuthSecret(scope: Construct, id: string, props: SshAuthSecretProps)
```

##### `scope`<sup>Required</sup> <a name="cdk8s-plus-22.SshAuthSecret.parameter.scope"></a>

- *Type:* [`constructs.Construct`](#constructs.Construct)

---

##### `id`<sup>Required</sup> <a name="cdk8s-plus-22.SshAuthSecret.parameter.id"></a>

- *Type:* `string`

---

##### `props`<sup>Required</sup> <a name="cdk8s-plus-22.SshAuthSecret.parameter.props"></a>

- *Type:* [`cdk8s-plus-22.SshAuthSecretProps`](#cdk8s-plus-22.SshAuthSecretProps)

---





### StatefulSet <a name="cdk8s-plus-22.StatefulSet"></a>

- *Implements:* [`cdk8s-plus-22.IPodTemplate`](#cdk8s-plus-22.IPodTemplate)

StatefulSet is the workload API object used to manage stateful applications.

Manages the deployment and scaling of a set of Pods, and provides guarantees
about the ordering and uniqueness of these Pods.

Like a Deployment, a StatefulSet manages Pods that are based on an identical
container spec. Unlike a Deployment, a StatefulSet maintains a sticky identity
for each of their Pods. These pods are created from the same spec, but are not
interchangeable: each has a persistent identifier that it maintains across any
rescheduling.

If you want to use storage volumes to provide persistence for your workload, you
can use a StatefulSet as part of the solution. Although individual Pods in a StatefulSet
are susceptible to failure, the persistent Pod identifiers make it easier to match existing
volumes to the new Pods that replace any that have failed.

Using StatefulSets
------------------
StatefulSets are valuable for applications that require one or more of the following.

- Stable, unique network identifiers.
- Stable, persistent storage.
- Ordered, graceful deployment and scaling.
- Ordered, automated rolling updates.

#### Initializers <a name="cdk8s-plus-22.StatefulSet.Initializer"></a>

```typescript
import { StatefulSet } from 'cdk8s-plus-22'

new StatefulSet(scope: Construct, id: string, props: StatefulSetProps)
```

##### `scope`<sup>Required</sup> <a name="cdk8s-plus-22.StatefulSet.parameter.scope"></a>

- *Type:* [`constructs.Construct`](#constructs.Construct)

---

##### `id`<sup>Required</sup> <a name="cdk8s-plus-22.StatefulSet.parameter.id"></a>

- *Type:* `string`

---

##### `props`<sup>Required</sup> <a name="cdk8s-plus-22.StatefulSet.parameter.props"></a>

- *Type:* [`cdk8s-plus-22.StatefulSetProps`](#cdk8s-plus-22.StatefulSetProps)

---

#### Methods <a name="Methods"></a>

##### `addContainer` <a name="cdk8s-plus-22.StatefulSet.addContainer"></a>

```typescript
public addContainer(container: ContainerProps)
```

###### `container`<sup>Required</sup> <a name="cdk8s-plus-22.StatefulSet.parameter.container"></a>

- *Type:* [`cdk8s-plus-22.ContainerProps`](#cdk8s-plus-22.ContainerProps)

---

##### `addHostAlias` <a name="cdk8s-plus-22.StatefulSet.addHostAlias"></a>

```typescript
public addHostAlias(hostAlias: HostAlias)
```

###### `hostAlias`<sup>Required</sup> <a name="cdk8s-plus-22.StatefulSet.parameter.hostAlias"></a>

- *Type:* [`cdk8s-plus-22.HostAlias`](#cdk8s-plus-22.HostAlias)

---

##### `addInitContainer` <a name="cdk8s-plus-22.StatefulSet.addInitContainer"></a>

```typescript
public addInitContainer(container: ContainerProps)
```

###### `container`<sup>Required</sup> <a name="cdk8s-plus-22.StatefulSet.parameter.container"></a>

- *Type:* [`cdk8s-plus-22.ContainerProps`](#cdk8s-plus-22.ContainerProps)

---

##### `addVolume` <a name="cdk8s-plus-22.StatefulSet.addVolume"></a>

```typescript
public addVolume(volume: Volume)
```

###### `volume`<sup>Required</sup> <a name="cdk8s-plus-22.StatefulSet.parameter.volume"></a>

- *Type:* [`cdk8s-plus-22.Volume`](#cdk8s-plus-22.Volume)

---

##### `selectByLabel` <a name="cdk8s-plus-22.StatefulSet.selectByLabel"></a>

```typescript
public selectByLabel(key: string, value: string)
```

###### `key`<sup>Required</sup> <a name="cdk8s-plus-22.StatefulSet.parameter.key"></a>

- *Type:* `string`

The label key.

---

###### `value`<sup>Required</sup> <a name="cdk8s-plus-22.StatefulSet.parameter.value"></a>

- *Type:* `string`

The label value.

---


#### Properties <a name="Properties"></a>

##### `containers`<sup>Required</sup> <a name="cdk8s-plus-22.StatefulSet.property.containers"></a>

```typescript
public readonly containers: Container[];
```

- *Type:* [`cdk8s-plus-22.Container`](#cdk8s-plus-22.Container)[]

The containers belonging to the pod.

Use `addContainer` to add containers.

---

##### `hostAliases`<sup>Required</sup> <a name="cdk8s-plus-22.StatefulSet.property.hostAliases"></a>

```typescript
public readonly hostAliases: HostAlias[];
```

- *Type:* [`cdk8s-plus-22.HostAlias`](#cdk8s-plus-22.HostAlias)[]

An optional list of hosts and IPs that will be injected into the pod's hosts file if specified.

This is only valid for non-hostNetwork pods.

---

##### `initContainers`<sup>Required</sup> <a name="cdk8s-plus-22.StatefulSet.property.initContainers"></a>

```typescript
public readonly initContainers: Container[];
```

- *Type:* [`cdk8s-plus-22.Container`](#cdk8s-plus-22.Container)[]

The init containers belonging to the pod.

Use `addInitContainer` to add init containers.

---

##### `labelSelector`<sup>Required</sup> <a name="cdk8s-plus-22.StatefulSet.property.labelSelector"></a>

```typescript
public readonly labelSelector: {[ key: string ]: string};
```

- *Type:* {[ key: string ]: `string`}

The labels this statefulset will match against in order to select pods.

Returns a a copy. Use `selectByLabel()` to add labels.

---

##### `podManagementPolicy`<sup>Required</sup> <a name="cdk8s-plus-22.StatefulSet.property.podManagementPolicy"></a>

```typescript
public readonly podManagementPolicy: PodManagementPolicy;
```

- *Type:* [`cdk8s-plus-22.PodManagementPolicy`](#cdk8s-plus-22.PodManagementPolicy)

Management policy to use for the set.

---

##### `podMetadata`<sup>Required</sup> <a name="cdk8s-plus-22.StatefulSet.property.podMetadata"></a>

```typescript
public readonly podMetadata: ApiObjectMetadataDefinition;
```

- *Type:* [`cdk8s.ApiObjectMetadataDefinition`](#cdk8s.ApiObjectMetadataDefinition)

Provides read/write access to the underlying pod metadata of the resource.

---

##### `replicas`<sup>Required</sup> <a name="cdk8s-plus-22.StatefulSet.property.replicas"></a>

```typescript
public readonly replicas: number;
```

- *Type:* `number`

Number of desired pods.

---

##### `securityContext`<sup>Required</sup> <a name="cdk8s-plus-22.StatefulSet.property.securityContext"></a>

```typescript
public readonly securityContext: PodSecurityContext;
```

- *Type:* [`cdk8s-plus-22.PodSecurityContext`](#cdk8s-plus-22.PodSecurityContext)

---

##### `volumes`<sup>Required</sup> <a name="cdk8s-plus-22.StatefulSet.property.volumes"></a>

```typescript
public readonly volumes: Volume[];
```

- *Type:* [`cdk8s-plus-22.Volume`](#cdk8s-plus-22.Volume)[]

The volumes associated with this pod.

Use `addVolume` to add volumes.

---

##### `restartPolicy`<sup>Optional</sup> <a name="cdk8s-plus-22.StatefulSet.property.restartPolicy"></a>

```typescript
public readonly restartPolicy: RestartPolicy;
```

- *Type:* [`cdk8s-plus-22.RestartPolicy`](#cdk8s-plus-22.RestartPolicy)

Restart policy for all containers within the pod.

---

##### `serviceAccount`<sup>Optional</sup> <a name="cdk8s-plus-22.StatefulSet.property.serviceAccount"></a>

```typescript
public readonly serviceAccount: IServiceAccount;
```

- *Type:* [`cdk8s-plus-22.IServiceAccount`](#cdk8s-plus-22.IServiceAccount)

The service account used to run this pod.

---


### TlsSecret <a name="cdk8s-plus-22.TlsSecret"></a>

Create a secret for storing a TLS certificate and its associated key.

> https://kubernetes.io/docs/concepts/configuration/secret/#tls-secrets

#### Initializers <a name="cdk8s-plus-22.TlsSecret.Initializer"></a>

```typescript
import { TlsSecret } from 'cdk8s-plus-22'

new TlsSecret(scope: Construct, id: string, props: TlsSecretProps)
```

##### `scope`<sup>Required</sup> <a name="cdk8s-plus-22.TlsSecret.parameter.scope"></a>

- *Type:* [`constructs.Construct`](#constructs.Construct)

---

##### `id`<sup>Required</sup> <a name="cdk8s-plus-22.TlsSecret.parameter.id"></a>

- *Type:* `string`

---

##### `props`<sup>Required</sup> <a name="cdk8s-plus-22.TlsSecret.parameter.props"></a>

- *Type:* [`cdk8s-plus-22.TlsSecretProps`](#cdk8s-plus-22.TlsSecretProps)

---





## Structs <a name="Structs"></a>

### AddDeploymentOptions <a name="cdk8s-plus-22.AddDeploymentOptions"></a>

Options to add a deployment to a service.

#### Initializer <a name="[object Object].Initializer"></a>

```typescript
import { AddDeploymentOptions } from 'cdk8s-plus-22'

const addDeploymentOptions: AddDeploymentOptions = { ... }
```

##### `name`<sup>Optional</sup> <a name="cdk8s-plus-22.AddDeploymentOptions.property.name"></a>

```typescript
public readonly name: string;
```

- *Type:* `string`

The name of this port within the service.

This must be a DNS_LABEL. All
ports within a ServiceSpec must have unique names. This maps to the 'Name'
field in EndpointPort objects. Optional if only one ServicePort is defined
on this service.

---

##### `nodePort`<sup>Optional</sup> <a name="cdk8s-plus-22.AddDeploymentOptions.property.nodePort"></a>

```typescript
public readonly nodePort: number;
```

- *Type:* `number`
- *Default:* auto-allocate a port if the ServiceType of this Service requires one.

The port on each node on which this service is exposed when type=NodePort or LoadBalancer.

Usually assigned by the system. If specified, it will be
allocated to the service if unused or else creation of the service will
fail. Default is to auto-allocate a port if the ServiceType of this Service
requires one.

> https://kubernetes.io/docs/concepts/services-networking/service/#type-nodeport

---

##### `protocol`<sup>Optional</sup> <a name="cdk8s-plus-22.AddDeploymentOptions.property.protocol"></a>

```typescript
public readonly protocol: Protocol;
```

- *Type:* [`cdk8s-plus-22.Protocol`](#cdk8s-plus-22.Protocol)
- *Default:* Protocol.TCP

The IP protocol for this port.

Supports "TCP", "UDP", and "SCTP". Default is TCP.

---

##### `targetPort`<sup>Optional</sup> <a name="cdk8s-plus-22.AddDeploymentOptions.property.targetPort"></a>

```typescript
public readonly targetPort: number;
```

- *Type:* `number`
- *Default:* The value of `port` will be used.

The port number the service will redirect to.

---

##### `port`<sup>Optional</sup> <a name="cdk8s-plus-22.AddDeploymentOptions.property.port"></a>

```typescript
public readonly port: number;
```

- *Type:* `number`
- *Default:* Copied from the first container of the deployment.

The port number the service will bind to.

---

### AddDirectoryOptions <a name="cdk8s-plus-22.AddDirectoryOptions"></a>

Options for `configmap.addDirectory()`.

#### Initializer <a name="[object Object].Initializer"></a>

```typescript
import { AddDirectoryOptions } from 'cdk8s-plus-22'

const addDirectoryOptions: AddDirectoryOptions = { ... }
```

##### `exclude`<sup>Optional</sup> <a name="cdk8s-plus-22.AddDirectoryOptions.property.exclude"></a>

```typescript
public readonly exclude: string[];
```

- *Type:* `string`[]
- *Default:* include all files

Glob patterns to exclude when adding files.

---

##### `keyPrefix`<sup>Optional</sup> <a name="cdk8s-plus-22.AddDirectoryOptions.property.keyPrefix"></a>

```typescript
public readonly keyPrefix: string;
```

- *Type:* `string`
- *Default:* ""

A prefix to add to all keys in the config map.

---

### AwsElasticBlockStorePersistentVolumeProps <a name="cdk8s-plus-22.AwsElasticBlockStorePersistentVolumeProps"></a>

Properties for `AwsElasticBlockStorePersistentVolume`.

#### Initializer <a name="[object Object].Initializer"></a>

```typescript
import { AwsElasticBlockStorePersistentVolumeProps } from 'cdk8s-plus-22'

const awsElasticBlockStorePersistentVolumeProps: AwsElasticBlockStorePersistentVolumeProps = { ... }
```

##### `metadata`<sup>Optional</sup> <a name="cdk8s-plus-22.AwsElasticBlockStorePersistentVolumeProps.property.metadata"></a>

```typescript
public readonly metadata: ApiObjectMetadata;
```

- *Type:* [`cdk8s.ApiObjectMetadata`](#cdk8s.ApiObjectMetadata)

Metadata that all persisted resources must have, which includes all objects users must create.

---

##### `accessModes`<sup>Optional</sup> <a name="cdk8s-plus-22.AwsElasticBlockStorePersistentVolumeProps.property.accessModes"></a>

```typescript
public readonly accessModes: PersistentVolumeAccessMode[];
```

- *Type:* [`cdk8s-plus-22.PersistentVolumeAccessMode`](#cdk8s-plus-22.PersistentVolumeAccessMode)[]
- *Default:* No access modes.

Contains all ways the volume can be mounted.

> https://kubernetes.io/docs/concepts/storage/persistent-volumes#access-modes

---

##### `claim`<sup>Optional</sup> <a name="cdk8s-plus-22.AwsElasticBlockStorePersistentVolumeProps.property.claim"></a>

```typescript
public readonly claim: IPersistentVolumeClaim;
```

- *Type:* [`cdk8s-plus-22.IPersistentVolumeClaim`](#cdk8s-plus-22.IPersistentVolumeClaim)
- *Default:* Not bound to a specific claim.

Part of a bi-directional binding between PersistentVolume and PersistentVolumeClaim.

Expected to be non-nil when bound.

> https://kubernetes.io/docs/concepts/storage/persistent-volumes#binding

---

##### `mountOptions`<sup>Optional</sup> <a name="cdk8s-plus-22.AwsElasticBlockStorePersistentVolumeProps.property.mountOptions"></a>

```typescript
public readonly mountOptions: string[];
```

- *Type:* `string`[]
- *Default:* No options.

A list of mount options, e.g. ["ro", "soft"]. Not validated - mount will simply fail if one is invalid.

> https://kubernetes.io/docs/concepts/storage/persistent-volumes/#mount-options

---

##### `reclaimPolicy`<sup>Optional</sup> <a name="cdk8s-plus-22.AwsElasticBlockStorePersistentVolumeProps.property.reclaimPolicy"></a>

```typescript
public readonly reclaimPolicy: PersistentVolumeReclaimPolicy;
```

- *Type:* [`cdk8s-plus-22.PersistentVolumeReclaimPolicy`](#cdk8s-plus-22.PersistentVolumeReclaimPolicy)
- *Default:* PersistentVolumeReclaimPolicy.RETAIN

When a user is done with their volume, they can delete the PVC objects from the API that allows reclamation of the resource.

The reclaim policy tells the cluster what to do with
the volume after it has been released of its claim.

> https://kubernetes.io/docs/concepts/storage/persistent-volumes#reclaiming

---

##### `storage`<sup>Optional</sup> <a name="cdk8s-plus-22.AwsElasticBlockStorePersistentVolumeProps.property.storage"></a>

```typescript
public readonly storage: Size;
```

- *Type:* [`cdk8s.Size`](#cdk8s.Size)
- *Default:* No specified.

What is the storage capacity of this volume.

> https://kubernetes.io/docs/concepts/storage/persistent-volumes#resources

---

##### `storageClassName`<sup>Optional</sup> <a name="cdk8s-plus-22.AwsElasticBlockStorePersistentVolumeProps.property.storageClassName"></a>

```typescript
public readonly storageClassName: string;
```

- *Type:* `string`
- *Default:* Volume does not belong to any storage class.

Name of StorageClass to which this persistent volume belongs.

---

##### `volumeMode`<sup>Optional</sup> <a name="cdk8s-plus-22.AwsElasticBlockStorePersistentVolumeProps.property.volumeMode"></a>

```typescript
public readonly volumeMode: PersistentVolumeMode;
```

- *Type:* [`cdk8s-plus-22.PersistentVolumeMode`](#cdk8s-plus-22.PersistentVolumeMode)
- *Default:* VolumeMode.FILE_SYSTEM

Defines what type of volume is required by the claim.

---

##### `volumeId`<sup>Required</sup> <a name="cdk8s-plus-22.AwsElasticBlockStorePersistentVolumeProps.property.volumeId"></a>

```typescript
public readonly volumeId: string;
```

- *Type:* `string`

Unique ID of the persistent disk resource in AWS (Amazon EBS volume).

More info: https://kubernetes.io/docs/concepts/storage/volumes#awselasticblockstore

> https://kubernetes.io/docs/concepts/storage/volumes#awselasticblockstore

---

##### `fsType`<sup>Optional</sup> <a name="cdk8s-plus-22.AwsElasticBlockStorePersistentVolumeProps.property.fsType"></a>

```typescript
public readonly fsType: string;
```

- *Type:* `string`
- *Default:* 'ext4'

Filesystem type of the volume that you want to mount.

Tip: Ensure that the filesystem type is supported by the host operating system.

> https://kubernetes.io/docs/concepts/storage/volumes#awselasticblockstore

---

##### `partition`<sup>Optional</sup> <a name="cdk8s-plus-22.AwsElasticBlockStorePersistentVolumeProps.property.partition"></a>

```typescript
public readonly partition: number;
```

- *Type:* `number`
- *Default:* No partition.

The partition in the volume that you want to mount.

If omitted, the default is to mount by volume name.
Examples: For volume /dev/sda1, you specify the partition as "1".
Similarly, the volume partition for /dev/sda is "0" (or you can leave the property empty).

---

##### `readOnly`<sup>Optional</sup> <a name="cdk8s-plus-22.AwsElasticBlockStorePersistentVolumeProps.property.readOnly"></a>

```typescript
public readonly readOnly: boolean;
```

- *Type:* `boolean`
- *Default:* false

Specify "true" to force and set the ReadOnly property in VolumeMounts to "true".

> https://kubernetes.io/docs/concepts/storage/volumes#awselasticblockstore

---

### AzureDiskPersistentVolumeProps <a name="cdk8s-plus-22.AzureDiskPersistentVolumeProps"></a>

Properties for `AzureDiskPersistentVolume`.

#### Initializer <a name="[object Object].Initializer"></a>

```typescript
import { AzureDiskPersistentVolumeProps } from 'cdk8s-plus-22'

const azureDiskPersistentVolumeProps: AzureDiskPersistentVolumeProps = { ... }
```

##### `metadata`<sup>Optional</sup> <a name="cdk8s-plus-22.AzureDiskPersistentVolumeProps.property.metadata"></a>

```typescript
public readonly metadata: ApiObjectMetadata;
```

- *Type:* [`cdk8s.ApiObjectMetadata`](#cdk8s.ApiObjectMetadata)

Metadata that all persisted resources must have, which includes all objects users must create.

---

##### `accessModes`<sup>Optional</sup> <a name="cdk8s-plus-22.AzureDiskPersistentVolumeProps.property.accessModes"></a>

```typescript
public readonly accessModes: PersistentVolumeAccessMode[];
```

- *Type:* [`cdk8s-plus-22.PersistentVolumeAccessMode`](#cdk8s-plus-22.PersistentVolumeAccessMode)[]
- *Default:* No access modes.

Contains all ways the volume can be mounted.

> https://kubernetes.io/docs/concepts/storage/persistent-volumes#access-modes

---

##### `claim`<sup>Optional</sup> <a name="cdk8s-plus-22.AzureDiskPersistentVolumeProps.property.claim"></a>

```typescript
public readonly claim: IPersistentVolumeClaim;
```

- *Type:* [`cdk8s-plus-22.IPersistentVolumeClaim`](#cdk8s-plus-22.IPersistentVolumeClaim)
- *Default:* Not bound to a specific claim.

Part of a bi-directional binding between PersistentVolume and PersistentVolumeClaim.

Expected to be non-nil when bound.

> https://kubernetes.io/docs/concepts/storage/persistent-volumes#binding

---

##### `mountOptions`<sup>Optional</sup> <a name="cdk8s-plus-22.AzureDiskPersistentVolumeProps.property.mountOptions"></a>

```typescript
public readonly mountOptions: string[];
```

- *Type:* `string`[]
- *Default:* No options.

A list of mount options, e.g. ["ro", "soft"]. Not validated - mount will simply fail if one is invalid.

> https://kubernetes.io/docs/concepts/storage/persistent-volumes/#mount-options

---

##### `reclaimPolicy`<sup>Optional</sup> <a name="cdk8s-plus-22.AzureDiskPersistentVolumeProps.property.reclaimPolicy"></a>

```typescript
public readonly reclaimPolicy: PersistentVolumeReclaimPolicy;
```

- *Type:* [`cdk8s-plus-22.PersistentVolumeReclaimPolicy`](#cdk8s-plus-22.PersistentVolumeReclaimPolicy)
- *Default:* PersistentVolumeReclaimPolicy.RETAIN

When a user is done with their volume, they can delete the PVC objects from the API that allows reclamation of the resource.

The reclaim policy tells the cluster what to do with
the volume after it has been released of its claim.

> https://kubernetes.io/docs/concepts/storage/persistent-volumes#reclaiming

---

##### `storage`<sup>Optional</sup> <a name="cdk8s-plus-22.AzureDiskPersistentVolumeProps.property.storage"></a>

```typescript
public readonly storage: Size;
```

- *Type:* [`cdk8s.Size`](#cdk8s.Size)
- *Default:* No specified.

What is the storage capacity of this volume.

> https://kubernetes.io/docs/concepts/storage/persistent-volumes#resources

---

##### `storageClassName`<sup>Optional</sup> <a name="cdk8s-plus-22.AzureDiskPersistentVolumeProps.property.storageClassName"></a>

```typescript
public readonly storageClassName: string;
```

- *Type:* `string`
- *Default:* Volume does not belong to any storage class.

Name of StorageClass to which this persistent volume belongs.

---

##### `volumeMode`<sup>Optional</sup> <a name="cdk8s-plus-22.AzureDiskPersistentVolumeProps.property.volumeMode"></a>

```typescript
public readonly volumeMode: PersistentVolumeMode;
```

- *Type:* [`cdk8s-plus-22.PersistentVolumeMode`](#cdk8s-plus-22.PersistentVolumeMode)
- *Default:* VolumeMode.FILE_SYSTEM

Defines what type of volume is required by the claim.

---

##### `diskName`<sup>Required</sup> <a name="cdk8s-plus-22.AzureDiskPersistentVolumeProps.property.diskName"></a>

```typescript
public readonly diskName: string;
```

- *Type:* `string`

The Name of the data disk in the blob storage.

---

##### `diskUri`<sup>Required</sup> <a name="cdk8s-plus-22.AzureDiskPersistentVolumeProps.property.diskUri"></a>

```typescript
public readonly diskUri: string;
```

- *Type:* `string`

The URI the data disk in the blob storage.

---

##### `cachingMode`<sup>Optional</sup> <a name="cdk8s-plus-22.AzureDiskPersistentVolumeProps.property.cachingMode"></a>

```typescript
public readonly cachingMode: AzureDiskPersistentVolumeCachingMode;
```

- *Type:* [`cdk8s-plus-22.AzureDiskPersistentVolumeCachingMode`](#cdk8s-plus-22.AzureDiskPersistentVolumeCachingMode)
- *Default:* AzureDiskPersistentVolumeCachingMode.NONE.

Host Caching mode.

---

##### `fsType`<sup>Optional</sup> <a name="cdk8s-plus-22.AzureDiskPersistentVolumeProps.property.fsType"></a>

```typescript
public readonly fsType: string;
```

- *Type:* `string`
- *Default:* 'ext4'

Filesystem type to mount.

Must be a filesystem type supported by the host operating system.

---

##### `kind`<sup>Optional</sup> <a name="cdk8s-plus-22.AzureDiskPersistentVolumeProps.property.kind"></a>

```typescript
public readonly kind: AzureDiskPersistentVolumeKind;
```

- *Type:* [`cdk8s-plus-22.AzureDiskPersistentVolumeKind`](#cdk8s-plus-22.AzureDiskPersistentVolumeKind)
- *Default:* AzureDiskPersistentVolumeKind.SHARED

Kind of disk.

---

##### `readOnly`<sup>Optional</sup> <a name="cdk8s-plus-22.AzureDiskPersistentVolumeProps.property.readOnly"></a>

```typescript
public readonly readOnly: boolean;
```

- *Type:* `boolean`
- *Default:* false

Force the ReadOnly setting in VolumeMounts.

---

### BasicAuthSecretProps <a name="cdk8s-plus-22.BasicAuthSecretProps"></a>

Options for `BasicAuthSecret`.

#### Initializer <a name="[object Object].Initializer"></a>

```typescript
import { BasicAuthSecretProps } from 'cdk8s-plus-22'

const basicAuthSecretProps: BasicAuthSecretProps = { ... }
```

##### `metadata`<sup>Optional</sup> <a name="cdk8s-plus-22.BasicAuthSecretProps.property.metadata"></a>

```typescript
public readonly metadata: ApiObjectMetadata;
```

- *Type:* [`cdk8s.ApiObjectMetadata`](#cdk8s.ApiObjectMetadata)

Metadata that all persisted resources must have, which includes all objects users must create.

---

##### `password`<sup>Required</sup> <a name="cdk8s-plus-22.BasicAuthSecretProps.property.password"></a>

```typescript
public readonly password: string;
```

- *Type:* `string`

The password or token for authentication.

---

##### `username`<sup>Required</sup> <a name="cdk8s-plus-22.BasicAuthSecretProps.property.username"></a>

```typescript
public readonly username: string;
```

- *Type:* `string`

The user name for authentication.

---

### CommandProbeOptions <a name="cdk8s-plus-22.CommandProbeOptions"></a>

Options for `Probe.fromCommand()`.

#### Initializer <a name="[object Object].Initializer"></a>

```typescript
import { CommandProbeOptions } from 'cdk8s-plus-22'

const commandProbeOptions: CommandProbeOptions = { ... }
```

##### `failureThreshold`<sup>Optional</sup> <a name="cdk8s-plus-22.CommandProbeOptions.property.failureThreshold"></a>

```typescript
public readonly failureThreshold: number;
```

- *Type:* `number`
- *Default:* 3

Minimum consecutive failures for the probe to be considered failed after having succeeded.

Defaults to 3. Minimum value is 1.

---

##### `initialDelaySeconds`<sup>Optional</sup> <a name="cdk8s-plus-22.CommandProbeOptions.property.initialDelaySeconds"></a>

```typescript
public readonly initialDelaySeconds: Duration;
```

- *Type:* [`cdk8s.Duration`](#cdk8s.Duration)
- *Default:* immediate

Number of seconds after the container has started before liveness probes are initiated.

> https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle#container-probes

---

##### `periodSeconds`<sup>Optional</sup> <a name="cdk8s-plus-22.CommandProbeOptions.property.periodSeconds"></a>

```typescript
public readonly periodSeconds: Duration;
```

- *Type:* [`cdk8s.Duration`](#cdk8s.Duration)
- *Default:* Duration.seconds(10) Minimum value is 1.

How often (in seconds) to perform the probe.

Default to 10 seconds. Minimum value is 1.

---

##### `successThreshold`<sup>Optional</sup> <a name="cdk8s-plus-22.CommandProbeOptions.property.successThreshold"></a>

```typescript
public readonly successThreshold: number;
```

- *Type:* `number`
- *Default:* 1 Must be 1 for liveness and startup. Minimum value is 1.

Minimum consecutive successes for the probe to be considered successful after having failed. Defaults to 1.

Must be 1 for liveness and startup. Minimum value is 1.

---

##### `timeoutSeconds`<sup>Optional</sup> <a name="cdk8s-plus-22.CommandProbeOptions.property.timeoutSeconds"></a>

```typescript
public readonly timeoutSeconds: Duration;
```

- *Type:* [`cdk8s.Duration`](#cdk8s.Duration)
- *Default:* Duration.seconds(1)

Number of seconds after which the probe times out.

Defaults to 1 second. Minimum value is 1.

> https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle#container-probes

---

### ConfigMapProps <a name="cdk8s-plus-22.ConfigMapProps"></a>

Properties for initialization of `ConfigMap`.

#### Initializer <a name="[object Object].Initializer"></a>

```typescript
import { ConfigMapProps } from 'cdk8s-plus-22'

const configMapProps: ConfigMapProps = { ... }
```

##### `metadata`<sup>Optional</sup> <a name="cdk8s-plus-22.ConfigMapProps.property.metadata"></a>

```typescript
public readonly metadata: ApiObjectMetadata;
```

- *Type:* [`cdk8s.ApiObjectMetadata`](#cdk8s.ApiObjectMetadata)

Metadata that all persisted resources must have, which includes all objects users must create.

---

##### `binaryData`<sup>Optional</sup> <a name="cdk8s-plus-22.ConfigMapProps.property.binaryData"></a>

```typescript
public readonly binaryData: {[ key: string ]: string};
```

- *Type:* {[ key: string ]: `string`}

BinaryData contains the binary data.

Each key must consist of alphanumeric characters, '-', '_' or '.'.
BinaryData can contain byte sequences that are not in the UTF-8 range. The
keys stored in BinaryData must not overlap with the ones in the Data field,
this is enforced during validation process.

You can also add binary data using `configMap.addBinaryData()`.

---

##### `data`<sup>Optional</sup> <a name="cdk8s-plus-22.ConfigMapProps.property.data"></a>

```typescript
public readonly data: {[ key: string ]: string};
```

- *Type:* {[ key: string ]: `string`}

Data contains the configuration data.

Each key must consist of alphanumeric characters, '-', '_' or '.'. Values
with non-UTF-8 byte sequences must use the BinaryData field. The keys
stored in Data must not overlap with the keys in the BinaryData field, this
is enforced during validation process.

You can also add data using `configMap.addData()`.

---

### ConfigMapVolumeOptions <a name="cdk8s-plus-22.ConfigMapVolumeOptions"></a>

Options for the ConfigMap-based volume.

#### Initializer <a name="[object Object].Initializer"></a>

```typescript
import { ConfigMapVolumeOptions } from 'cdk8s-plus-22'

const configMapVolumeOptions: ConfigMapVolumeOptions = { ... }
```

##### `defaultMode`<sup>Optional</sup> <a name="cdk8s-plus-22.ConfigMapVolumeOptions.property.defaultMode"></a>

```typescript
public readonly defaultMode: number;
```

- *Type:* `number`
- *Default:* 0644. Directories within the path are not affected by this
setting. This might be in conflict with other options that affect the file
mode, like fsGroup, and the result can be other mode bits set.

Mode bits to use on created files by default.

Must be a value between 0 and
0777. Defaults to 0644. Directories within the path are not affected by
this setting. This might be in conflict with other options that affect the
file mode, like fsGroup, and the result can be other mode bits set.

---

##### `items`<sup>Optional</sup> <a name="cdk8s-plus-22.ConfigMapVolumeOptions.property.items"></a>

```typescript
public readonly items: {[ key: string ]: PathMapping};
```

- *Type:* {[ key: string ]: [`cdk8s-plus-22.PathMapping`](#cdk8s-plus-22.PathMapping)}
- *Default:* no mapping

If unspecified, each key-value pair in the Data field of the referenced ConfigMap will be projected into the volume as a file whose name is the key and content is the value.

If specified, the listed keys will be projected
into the specified paths, and unlisted keys will not be present. If a key
is specified which is not present in the ConfigMap, the volume setup will
error unless it is marked optional. Paths must be relative and may not
contain the '..' path or start with '..'.

---

##### `name`<sup>Optional</sup> <a name="cdk8s-plus-22.ConfigMapVolumeOptions.property.name"></a>

```typescript
public readonly name: string;
```

- *Type:* `string`
- *Default:* auto-generated

The volume name.

---

##### `optional`<sup>Optional</sup> <a name="cdk8s-plus-22.ConfigMapVolumeOptions.property.optional"></a>

```typescript
public readonly optional: boolean;
```

- *Type:* `boolean`
- *Default:* undocumented

Specify whether the ConfigMap or its keys must be defined.

---

### ContainerLifecycle <a name="cdk8s-plus-22.ContainerLifecycle"></a>

Container lifecycle properties.

#### Initializer <a name="[object Object].Initializer"></a>

```typescript
import { ContainerLifecycle } from 'cdk8s-plus-22'

const containerLifecycle: ContainerLifecycle = { ... }
```

##### `postStart`<sup>Optional</sup> <a name="cdk8s-plus-22.ContainerLifecycle.property.postStart"></a>

```typescript
public readonly postStart: Handler;
```

- *Type:* [`cdk8s-plus-22.Handler`](#cdk8s-plus-22.Handler)
- *Default:* No post start handler.

This hook is executed immediately after a container is created.

However,
there is no guarantee that the hook will execute before the container ENTRYPOINT.

---

##### `preStop`<sup>Optional</sup> <a name="cdk8s-plus-22.ContainerLifecycle.property.preStop"></a>

```typescript
public readonly preStop: Handler;
```

- *Type:* [`cdk8s-plus-22.Handler`](#cdk8s-plus-22.Handler)
- *Default:* No pre stop handler.

This hook is called immediately before a container is terminated due to an API request or management event such as a liveness/startup probe failure, preemption, resource contention and others.

A call to the PreStop hook fails if the container is already in a terminated or completed state
and the hook must complete before the TERM signal to stop the container can be sent.
The Pod's termination grace period countdown begins before the PreStop hook is executed,
so regardless of the outcome of the handler, the container will eventually terminate
within the Pod's termination grace period. No parameters are passed to the handler.

> https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle/#pod-termination

---

### ContainerProps <a name="cdk8s-plus-22.ContainerProps"></a>

Properties for creating a container.

#### Initializer <a name="[object Object].Initializer"></a>

```typescript
import { ContainerProps } from 'cdk8s-plus-22'

const containerProps: ContainerProps = { ... }
```

##### `image`<sup>Required</sup> <a name="cdk8s-plus-22.ContainerProps.property.image"></a>

```typescript
public readonly image: string;
```

- *Type:* `string`

Docker image name.

---

##### `args`<sup>Optional</sup> <a name="cdk8s-plus-22.ContainerProps.property.args"></a>

```typescript
public readonly args: string[];
```

- *Type:* `string`[]
- *Default:* []

Arguments to the entrypoint. The docker image's CMD is used if `command` is not provided.

Variable references $(VAR_NAME) are expanded using the container's
environment. If a variable cannot be resolved, the reference in the input
string will be unchanged. The $(VAR_NAME) syntax can be escaped with a
double $$, ie: $$(VAR_NAME). Escaped references will never be expanded,
regardless of whether the variable exists or not.

Cannot be updated.

> https://kubernetes.io/docs/tasks/inject-data-application/define-command-argument-container/#running-a-command-in-a-shell

---

##### `command`<sup>Optional</sup> <a name="cdk8s-plus-22.ContainerProps.property.command"></a>

```typescript
public readonly command: string[];
```

- *Type:* `string`[]
- *Default:* The docker image's ENTRYPOINT.

Entrypoint array.

Not executed within a shell. The docker image's ENTRYPOINT is used if this is not provided. Variable references $(VAR_NAME) are expanded using the container's environment.
If a variable cannot be resolved, the reference in the input string will be unchanged. The $(VAR_NAME) syntax can be escaped with a double $$, ie: $$(VAR_NAME).
Escaped references will never be expanded, regardless of whether the variable exists or not. Cannot be updated.
More info: https://kubernetes.io/docs/tasks/inject-data-application/define-command-argument-container/#running-a-command-in-a-shell

---

##### `env`<sup>Optional</sup> <a name="cdk8s-plus-22.ContainerProps.property.env"></a>

```typescript
public readonly env: {[ key: string ]: EnvValue};
```

- *Type:* {[ key: string ]: [`cdk8s-plus-22.EnvValue`](#cdk8s-plus-22.EnvValue)}
- *Default:* No environment variables.

List of environment variables to set in the container.

Cannot be updated.

---

##### `imagePullPolicy`<sup>Optional</sup> <a name="cdk8s-plus-22.ContainerProps.property.imagePullPolicy"></a>

```typescript
public readonly imagePullPolicy: ImagePullPolicy;
```

- *Type:* [`cdk8s-plus-22.ImagePullPolicy`](#cdk8s-plus-22.ImagePullPolicy)
- *Default:* ImagePullPolicy.ALWAYS

Image pull policy for this container.

---

##### `lifecycle`<sup>Optional</sup> <a name="cdk8s-plus-22.ContainerProps.property.lifecycle"></a>

```typescript
public readonly lifecycle: ContainerLifecycle;
```

- *Type:* [`cdk8s-plus-22.ContainerLifecycle`](#cdk8s-plus-22.ContainerLifecycle)

Describes actions that the management system should take in response to container lifecycle events.

---

##### `liveness`<sup>Optional</sup> <a name="cdk8s-plus-22.ContainerProps.property.liveness"></a>

```typescript
public readonly liveness: Probe;
```

- *Type:* [`cdk8s-plus-22.Probe`](#cdk8s-plus-22.Probe)
- *Default:* no liveness probe is defined

Periodic probe of container liveness.

Container will be restarted if the probe fails.

---

##### `name`<sup>Optional</sup> <a name="cdk8s-plus-22.ContainerProps.property.name"></a>

```typescript
public readonly name: string;
```

- *Type:* `string`
- *Default:* 'main'

Name of the container specified as a DNS_LABEL.

Each container in a pod must have a unique name (DNS_LABEL). Cannot be updated.

---

##### `port`<sup>Optional</sup> <a name="cdk8s-plus-22.ContainerProps.property.port"></a>

```typescript
public readonly port: number;
```

- *Type:* `number`
- *Default:* No port is exposed.

Number of port to expose on the pod's IP address.

This must be a valid port number, 0 < x < 65536.

---

##### `readiness`<sup>Optional</sup> <a name="cdk8s-plus-22.ContainerProps.property.readiness"></a>

```typescript
public readonly readiness: Probe;
```

- *Type:* [`cdk8s-plus-22.Probe`](#cdk8s-plus-22.Probe)
- *Default:* no readiness probe is defined

Determines when the container is ready to serve traffic.

---

##### `resources`<sup>Optional</sup> <a name="cdk8s-plus-22.ContainerProps.property.resources"></a>

```typescript
public readonly resources: Resources;
```

- *Type:* [`cdk8s-plus-22.Resources`](#cdk8s-plus-22.Resources)

Compute resources (CPU and memory requests and limits) required by the container.

> https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/

---

##### `securityContext`<sup>Optional</sup> <a name="cdk8s-plus-22.ContainerProps.property.securityContext"></a>

```typescript
public readonly securityContext: ContainerSecurityContextProps;
```

- *Type:* [`cdk8s-plus-22.ContainerSecurityContextProps`](#cdk8s-plus-22.ContainerSecurityContextProps)
- *Default:* ensureNonRoot: false
  privileged: false
  readOnlyRootFilesystem: false

SecurityContext defines the security options the container should be run with.

If set, the fields override equivalent fields of the pod's security context.

> https://kubernetes.io/docs/tasks/configure-pod-container/security-context/

---

##### `startup`<sup>Optional</sup> <a name="cdk8s-plus-22.ContainerProps.property.startup"></a>

```typescript
public readonly startup: Probe;
```

- *Type:* [`cdk8s-plus-22.Probe`](#cdk8s-plus-22.Probe)
- *Default:* no startup probe is defined.

StartupProbe indicates that the Pod has successfully initialized.

If specified, no other probes are executed until this completes successfully

---

##### `volumeMounts`<sup>Optional</sup> <a name="cdk8s-plus-22.ContainerProps.property.volumeMounts"></a>

```typescript
public readonly volumeMounts: VolumeMount[];
```

- *Type:* [`cdk8s-plus-22.VolumeMount`](#cdk8s-plus-22.VolumeMount)[]

Pod volumes to mount into the container's filesystem.

Cannot be updated.

---

##### `workingDir`<sup>Optional</sup> <a name="cdk8s-plus-22.ContainerProps.property.workingDir"></a>

```typescript
public readonly workingDir: string;
```

- *Type:* `string`
- *Default:* The container runtime's default.

Container's working directory.

If not specified, the container runtime's default will be used, which might be configured in the container image. Cannot be updated.

---

### ContainerSecurityContextProps <a name="cdk8s-plus-22.ContainerSecurityContextProps"></a>

Properties for `ContainerSecurityContext`.

#### Initializer <a name="[object Object].Initializer"></a>

```typescript
import { ContainerSecurityContextProps } from 'cdk8s-plus-22'

const containerSecurityContextProps: ContainerSecurityContextProps = { ... }
```

##### `ensureNonRoot`<sup>Optional</sup> <a name="cdk8s-plus-22.ContainerSecurityContextProps.property.ensureNonRoot"></a>

```typescript
public readonly ensureNonRoot: boolean;
```

- *Type:* `boolean`
- *Default:* false

Indicates that the container must run as a non-root user.

If true, the Kubelet will validate the image at runtime to ensure that it does
not run as UID 0 (root) and fail to start the container if it does.

---

##### `group`<sup>Optional</sup> <a name="cdk8s-plus-22.ContainerSecurityContextProps.property.group"></a>

```typescript
public readonly group: number;
```

- *Type:* `number`
- *Default:* Group configured by container runtime

The GID to run the entrypoint of the container process.

---

##### `privileged`<sup>Optional</sup> <a name="cdk8s-plus-22.ContainerSecurityContextProps.property.privileged"></a>

```typescript
public readonly privileged: boolean;
```

- *Type:* `boolean`
- *Default:* false

Run container in privileged mode.

Processes in privileged containers are essentially equivalent to root on the host.

---

##### `readOnlyRootFilesystem`<sup>Optional</sup> <a name="cdk8s-plus-22.ContainerSecurityContextProps.property.readOnlyRootFilesystem"></a>

```typescript
public readonly readOnlyRootFilesystem: boolean;
```

- *Type:* `boolean`
- *Default:* false

Whether this container has a read-only root filesystem.

---

##### `user`<sup>Optional</sup> <a name="cdk8s-plus-22.ContainerSecurityContextProps.property.user"></a>

```typescript
public readonly user: number;
```

- *Type:* `number`
- *Default:* User specified in image metadata

The UID to run the entrypoint of the container process.

---

### CpuResources <a name="cdk8s-plus-22.CpuResources"></a>

CPU request and limit.

#### Initializer <a name="[object Object].Initializer"></a>

```typescript
import { CpuResources } from 'cdk8s-plus-22'

const cpuResources: CpuResources = { ... }
```

##### `limit`<sup>Required</sup> <a name="cdk8s-plus-22.CpuResources.property.limit"></a>

```typescript
public readonly limit: Cpu;
```

- *Type:* [`cdk8s-plus-22.Cpu`](#cdk8s-plus-22.Cpu)

---

##### `request`<sup>Required</sup> <a name="cdk8s-plus-22.CpuResources.property.request"></a>

```typescript
public readonly request: Cpu;
```

- *Type:* [`cdk8s-plus-22.Cpu`](#cdk8s-plus-22.Cpu)

---

### DeploymentProps <a name="cdk8s-plus-22.DeploymentProps"></a>

Properties for initialization of `Deployment`.

#### Initializer <a name="[object Object].Initializer"></a>

```typescript
import { DeploymentProps } from 'cdk8s-plus-22'

const deploymentProps: DeploymentProps = { ... }
```

##### `metadata`<sup>Optional</sup> <a name="cdk8s-plus-22.DeploymentProps.property.metadata"></a>

```typescript
public readonly metadata: ApiObjectMetadata;
```

- *Type:* [`cdk8s.ApiObjectMetadata`](#cdk8s.ApiObjectMetadata)

Metadata that all persisted resources must have, which includes all objects users must create.

---

##### `containers`<sup>Optional</sup> <a name="cdk8s-plus-22.DeploymentProps.property.containers"></a>

```typescript
public readonly containers: ContainerProps[];
```

- *Type:* [`cdk8s-plus-22.ContainerProps`](#cdk8s-plus-22.ContainerProps)[]
- *Default:* No containers. Note that a pod spec must include at least one container.

List of containers belonging to the pod.

Containers cannot currently be
added or removed. There must be at least one container in a Pod.

You can add additionnal containers using `podSpec.addContainer()`

---

##### `hostAliases`<sup>Optional</sup> <a name="cdk8s-plus-22.DeploymentProps.property.hostAliases"></a>

```typescript
public readonly hostAliases: HostAlias[];
```

- *Type:* [`cdk8s-plus-22.HostAlias`](#cdk8s-plus-22.HostAlias)[]

HostAlias holds the mapping between IP and hostnames that will be injected as an entry in the pod's hosts file.

---

##### `initContainers`<sup>Optional</sup> <a name="cdk8s-plus-22.DeploymentProps.property.initContainers"></a>

```typescript
public readonly initContainers: ContainerProps[];
```

- *Type:* [`cdk8s-plus-22.ContainerProps`](#cdk8s-plus-22.ContainerProps)[]
- *Default:* No init containers.

List of initialization containers belonging to the pod.

Init containers are executed in order prior to containers being started.
If any init container fails, the pod is considered to have failed and is handled according to its restartPolicy.
The name for an init container or normal container must be unique among all containers.
Init containers may not have Lifecycle actions, Readiness probes, Liveness probes, or Startup probes.
The resourceRequirements of an init container are taken into account during scheduling by finding the highest request/limit
for each resource type, and then using the max of of that value or the sum of the normal containers.
Limits are applied to init containers in a similar fashion.

Init containers cannot currently be added ,removed or updated.

> https://kubernetes.io/docs/concepts/workloads/pods/init-containers/

---

##### `restartPolicy`<sup>Optional</sup> <a name="cdk8s-plus-22.DeploymentProps.property.restartPolicy"></a>

```typescript
public readonly restartPolicy: RestartPolicy;
```

- *Type:* [`cdk8s-plus-22.RestartPolicy`](#cdk8s-plus-22.RestartPolicy)
- *Default:* RestartPolicy.ALWAYS

Restart policy for all containers within the pod.

> https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle/#restart-policy

---

##### `securityContext`<sup>Optional</sup> <a name="cdk8s-plus-22.DeploymentProps.property.securityContext"></a>

```typescript
public readonly securityContext: PodSecurityContextProps;
```

- *Type:* [`cdk8s-plus-22.PodSecurityContextProps`](#cdk8s-plus-22.PodSecurityContextProps)
- *Default:* fsGroupChangePolicy: FsGroupChangePolicy.FsGroupChangePolicy.ALWAYS
  ensureNonRoot: false

SecurityContext holds pod-level security attributes and common container settings.

---

##### `serviceAccount`<sup>Optional</sup> <a name="cdk8s-plus-22.DeploymentProps.property.serviceAccount"></a>

```typescript
public readonly serviceAccount: IServiceAccount;
```

- *Type:* [`cdk8s-plus-22.IServiceAccount`](#cdk8s-plus-22.IServiceAccount)
- *Default:* No service account.

A service account provides an identity for processes that run in a Pod.

When you (a human) access the cluster (for example, using kubectl), you are
authenticated by the apiserver as a particular User Account (currently this
is usually admin, unless your cluster administrator has customized your
cluster). Processes in containers inside pods can also contact the
apiserver. When they do, they are authenticated as a particular Service
Account (for example, default).

> https://kubernetes.io/docs/tasks/configure-pod-container/configure-service-account/

---

##### `volumes`<sup>Optional</sup> <a name="cdk8s-plus-22.DeploymentProps.property.volumes"></a>

```typescript
public readonly volumes: Volume[];
```

- *Type:* [`cdk8s-plus-22.Volume`](#cdk8s-plus-22.Volume)[]
- *Default:* No volumes.

List of volumes that can be mounted by containers belonging to the pod.

You can also add volumes later using `podSpec.addVolume()`

> https://kubernetes.io/docs/concepts/storage/volumes

---

##### `podMetadata`<sup>Optional</sup> <a name="cdk8s-plus-22.DeploymentProps.property.podMetadata"></a>

```typescript
public readonly podMetadata: ApiObjectMetadata;
```

- *Type:* [`cdk8s.ApiObjectMetadata`](#cdk8s.ApiObjectMetadata)

The pod metadata.

---

##### `defaultSelector`<sup>Optional</sup> <a name="cdk8s-plus-22.DeploymentProps.property.defaultSelector"></a>

```typescript
public readonly defaultSelector: boolean;
```

- *Type:* `boolean`
- *Default:* true

Automatically allocates a pod selector for this deployment.

If this is set to `false` you must define your selector through
`deployment.podMetadata.addLabel()` and `deployment.selectByLabel()`.

---

##### `replicas`<sup>Optional</sup> <a name="cdk8s-plus-22.DeploymentProps.property.replicas"></a>

```typescript
public readonly replicas: number;
```

- *Type:* `number`
- *Default:* 1

Number of desired pods.

---

### DockerConfigSecretProps <a name="cdk8s-plus-22.DockerConfigSecretProps"></a>

Options for `DockerConfigSecret`.

#### Initializer <a name="[object Object].Initializer"></a>

```typescript
import { DockerConfigSecretProps } from 'cdk8s-plus-22'

const dockerConfigSecretProps: DockerConfigSecretProps = { ... }
```

##### `metadata`<sup>Optional</sup> <a name="cdk8s-plus-22.DockerConfigSecretProps.property.metadata"></a>

```typescript
public readonly metadata: ApiObjectMetadata;
```

- *Type:* [`cdk8s.ApiObjectMetadata`](#cdk8s.ApiObjectMetadata)

Metadata that all persisted resources must have, which includes all objects users must create.

---

##### `data`<sup>Required</sup> <a name="cdk8s-plus-22.DockerConfigSecretProps.property.data"></a>

```typescript
public readonly data: {[ key: string ]: any};
```

- *Type:* {[ key: string ]: `any`}

JSON content to provide for the `~/.docker/config.json` file. This will be stringified and inserted as stringData.

> https://docs.docker.com/engine/reference/commandline/cli/#sample-configuration-file

---

### EmptyDirVolumeOptions <a name="cdk8s-plus-22.EmptyDirVolumeOptions"></a>

Options for volumes populated with an empty directory.

#### Initializer <a name="[object Object].Initializer"></a>

```typescript
import { EmptyDirVolumeOptions } from 'cdk8s-plus-22'

const emptyDirVolumeOptions: EmptyDirVolumeOptions = { ... }
```

##### `medium`<sup>Optional</sup> <a name="cdk8s-plus-22.EmptyDirVolumeOptions.property.medium"></a>

```typescript
public readonly medium: EmptyDirMedium;
```

- *Type:* [`cdk8s-plus-22.EmptyDirMedium`](#cdk8s-plus-22.EmptyDirMedium)
- *Default:* EmptyDirMedium.DEFAULT

By default, emptyDir volumes are stored on whatever medium is backing the node - that might be disk or SSD or network storage, depending on your environment.

However, you can set the emptyDir.medium field to
`EmptyDirMedium.MEMORY` to tell Kubernetes to mount a tmpfs (RAM-backed
filesystem) for you instead. While tmpfs is very fast, be aware that unlike
disks, tmpfs is cleared on node reboot and any files you write will count
against your Container's memory limit.

---

##### `sizeLimit`<sup>Optional</sup> <a name="cdk8s-plus-22.EmptyDirVolumeOptions.property.sizeLimit"></a>

```typescript
public readonly sizeLimit: Size;
```

- *Type:* [`cdk8s.Size`](#cdk8s.Size)
- *Default:* limit is undefined

Total amount of local storage required for this EmptyDir volume.

The size
limit is also applicable for memory medium. The maximum usage on memory
medium EmptyDir would be the minimum value between the SizeLimit specified
here and the sum of memory limits of all containers in a pod.

---

### EnvValueFromConfigMapOptions <a name="cdk8s-plus-22.EnvValueFromConfigMapOptions"></a>

Options to specify an envionment variable value from a ConfigMap key.

#### Initializer <a name="[object Object].Initializer"></a>

```typescript
import { EnvValueFromConfigMapOptions } from 'cdk8s-plus-22'

const envValueFromConfigMapOptions: EnvValueFromConfigMapOptions = { ... }
```

##### `optional`<sup>Optional</sup> <a name="cdk8s-plus-22.EnvValueFromConfigMapOptions.property.optional"></a>

```typescript
public readonly optional: boolean;
```

- *Type:* `boolean`
- *Default:* false

Specify whether the ConfigMap or its key must be defined.

---

### EnvValueFromFieldRefOptions <a name="cdk8s-plus-22.EnvValueFromFieldRefOptions"></a>

Options to specify an environment variable value from a field reference.

#### Initializer <a name="[object Object].Initializer"></a>

```typescript
import { EnvValueFromFieldRefOptions } from 'cdk8s-plus-22'

const envValueFromFieldRefOptions: EnvValueFromFieldRefOptions = { ... }
```

##### `apiVersion`<sup>Optional</sup> <a name="cdk8s-plus-22.EnvValueFromFieldRefOptions.property.apiVersion"></a>

```typescript
public readonly apiVersion: string;
```

- *Type:* `string`

Version of the schema the FieldPath is written in terms of.

---

##### `key`<sup>Optional</sup> <a name="cdk8s-plus-22.EnvValueFromFieldRefOptions.property.key"></a>

```typescript
public readonly key: string;
```

- *Type:* `string`

The key to select the pod label or annotation.

---

### EnvValueFromProcessOptions <a name="cdk8s-plus-22.EnvValueFromProcessOptions"></a>

Options to specify an environment variable value from the process environment.

#### Initializer <a name="[object Object].Initializer"></a>

```typescript
import { EnvValueFromProcessOptions } from 'cdk8s-plus-22'

const envValueFromProcessOptions: EnvValueFromProcessOptions = { ... }
```

##### `required`<sup>Optional</sup> <a name="cdk8s-plus-22.EnvValueFromProcessOptions.property.required"></a>

```typescript
public readonly required: boolean;
```

- *Type:* `boolean`
- *Default:* false

Specify whether the key must exist in the environment.

If this is set to true, and the key does not exist, an error will thrown.

---

### EnvValueFromResourceOptions <a name="cdk8s-plus-22.EnvValueFromResourceOptions"></a>

Options to specify an environment variable value from a resource.

#### Initializer <a name="[object Object].Initializer"></a>

```typescript
import { EnvValueFromResourceOptions } from 'cdk8s-plus-22'

const envValueFromResourceOptions: EnvValueFromResourceOptions = { ... }
```

##### `container`<sup>Optional</sup> <a name="cdk8s-plus-22.EnvValueFromResourceOptions.property.container"></a>

```typescript
public readonly container: Container;
```

- *Type:* [`cdk8s-plus-22.Container`](#cdk8s-plus-22.Container)

The container to select the value from.

---

##### `divisor`<sup>Optional</sup> <a name="cdk8s-plus-22.EnvValueFromResourceOptions.property.divisor"></a>

```typescript
public readonly divisor: string;
```

- *Type:* `string`

The output format of the exposed resource.

---

### EnvValueFromSecretOptions <a name="cdk8s-plus-22.EnvValueFromSecretOptions"></a>

Options to specify an environment variable value from a Secret.

#### Initializer <a name="[object Object].Initializer"></a>

```typescript
import { EnvValueFromSecretOptions } from 'cdk8s-plus-22'

const envValueFromSecretOptions: EnvValueFromSecretOptions = { ... }
```

##### `optional`<sup>Optional</sup> <a name="cdk8s-plus-22.EnvValueFromSecretOptions.property.optional"></a>

```typescript
public readonly optional: boolean;
```

- *Type:* `boolean`
- *Default:* false

Specify whether the Secret or its key must be defined.

---

### ExposeDeploymentViaIngressOptions <a name="cdk8s-plus-22.ExposeDeploymentViaIngressOptions"></a>

Options for exposing a deployment via an ingress.

#### Initializer <a name="[object Object].Initializer"></a>

```typescript
import { ExposeDeploymentViaIngressOptions } from 'cdk8s-plus-22'

const exposeDeploymentViaIngressOptions: ExposeDeploymentViaIngressOptions = { ... }
```

##### `name`<sup>Optional</sup> <a name="cdk8s-plus-22.ExposeDeploymentViaIngressOptions.property.name"></a>

```typescript
public readonly name: string;
```

- *Type:* `string`
- *Default:* undefined Uses the system generated name.

The name of the service to expose.

This will be set on the Service.metadata and must be a DNS_LABEL

---

##### `port`<sup>Optional</sup> <a name="cdk8s-plus-22.ExposeDeploymentViaIngressOptions.property.port"></a>

```typescript
public readonly port: number;
```

- *Type:* `number`
- *Default:* Copied from the container of the deployment. If a port could not be determined, throws an error.

The port that the service should serve on.

---

##### `protocol`<sup>Optional</sup> <a name="cdk8s-plus-22.ExposeDeploymentViaIngressOptions.property.protocol"></a>

```typescript
public readonly protocol: Protocol;
```

- *Type:* [`cdk8s-plus-22.Protocol`](#cdk8s-plus-22.Protocol)
- *Default:* Protocol.TCP

The IP protocol for this port.

Supports "TCP", "UDP", and "SCTP". Default is TCP.

---

##### `serviceType`<sup>Optional</sup> <a name="cdk8s-plus-22.ExposeDeploymentViaIngressOptions.property.serviceType"></a>

```typescript
public readonly serviceType: ServiceType;
```

- *Type:* [`cdk8s-plus-22.ServiceType`](#cdk8s-plus-22.ServiceType)
- *Default:* ClusterIP.

The type of the exposed service.

---

##### `targetPort`<sup>Optional</sup> <a name="cdk8s-plus-22.ExposeDeploymentViaIngressOptions.property.targetPort"></a>

```typescript
public readonly targetPort: number;
```

- *Type:* `number`
- *Default:* The port of the first container in the deployment (ie. containers[0].port)

The port number the service will redirect to.

---

##### `ingress`<sup>Optional</sup> <a name="cdk8s-plus-22.ExposeDeploymentViaIngressOptions.property.ingress"></a>

```typescript
public readonly ingress: Ingress;
```

- *Type:* [`cdk8s-plus-22.Ingress`](#cdk8s-plus-22.Ingress)
- *Default:* An ingress will be automatically created.

The ingress to add rules to.

---

##### `pathType`<sup>Optional</sup> <a name="cdk8s-plus-22.ExposeDeploymentViaIngressOptions.property.pathType"></a>

```typescript
public readonly pathType: HttpIngressPathType;
```

- *Type:* [`cdk8s-plus-22.HttpIngressPathType`](#cdk8s-plus-22.HttpIngressPathType)
- *Default:* HttpIngressPathType.PREFIX

The type of the path.

---

### ExposeDeploymentViaServiceOptions <a name="cdk8s-plus-22.ExposeDeploymentViaServiceOptions"></a>

Options for exposing a deployment via a service.

#### Initializer <a name="[object Object].Initializer"></a>

```typescript
import { ExposeDeploymentViaServiceOptions } from 'cdk8s-plus-22'

const exposeDeploymentViaServiceOptions: ExposeDeploymentViaServiceOptions = { ... }
```

##### `name`<sup>Optional</sup> <a name="cdk8s-plus-22.ExposeDeploymentViaServiceOptions.property.name"></a>

```typescript
public readonly name: string;
```

- *Type:* `string`
- *Default:* undefined Uses the system generated name.

The name of the service to expose.

This will be set on the Service.metadata and must be a DNS_LABEL

---

##### `port`<sup>Optional</sup> <a name="cdk8s-plus-22.ExposeDeploymentViaServiceOptions.property.port"></a>

```typescript
public readonly port: number;
```

- *Type:* `number`
- *Default:* Copied from the container of the deployment. If a port could not be determined, throws an error.

The port that the service should serve on.

---

##### `protocol`<sup>Optional</sup> <a name="cdk8s-plus-22.ExposeDeploymentViaServiceOptions.property.protocol"></a>

```typescript
public readonly protocol: Protocol;
```

- *Type:* [`cdk8s-plus-22.Protocol`](#cdk8s-plus-22.Protocol)
- *Default:* Protocol.TCP

The IP protocol for this port.

Supports "TCP", "UDP", and "SCTP". Default is TCP.

---

##### `serviceType`<sup>Optional</sup> <a name="cdk8s-plus-22.ExposeDeploymentViaServiceOptions.property.serviceType"></a>

```typescript
public readonly serviceType: ServiceType;
```

- *Type:* [`cdk8s-plus-22.ServiceType`](#cdk8s-plus-22.ServiceType)
- *Default:* ClusterIP.

The type of the exposed service.

---

##### `targetPort`<sup>Optional</sup> <a name="cdk8s-plus-22.ExposeDeploymentViaServiceOptions.property.targetPort"></a>

```typescript
public readonly targetPort: number;
```

- *Type:* `number`
- *Default:* The port of the first container in the deployment (ie. containers[0].port)

The port number the service will redirect to.

---

### ExposeServiceViaIngressOptions <a name="cdk8s-plus-22.ExposeServiceViaIngressOptions"></a>

Options for exposing a service using an ingress.

#### Initializer <a name="[object Object].Initializer"></a>

```typescript
import { ExposeServiceViaIngressOptions } from 'cdk8s-plus-22'

const exposeServiceViaIngressOptions: ExposeServiceViaIngressOptions = { ... }
```

##### `ingress`<sup>Optional</sup> <a name="cdk8s-plus-22.ExposeServiceViaIngressOptions.property.ingress"></a>

```typescript
public readonly ingress: Ingress;
```

- *Type:* [`cdk8s-plus-22.Ingress`](#cdk8s-plus-22.Ingress)
- *Default:* An ingress will be automatically created.

The ingress to add rules to.

---

##### `pathType`<sup>Optional</sup> <a name="cdk8s-plus-22.ExposeServiceViaIngressOptions.property.pathType"></a>

```typescript
public readonly pathType: HttpIngressPathType;
```

- *Type:* [`cdk8s-plus-22.HttpIngressPathType`](#cdk8s-plus-22.HttpIngressPathType)
- *Default:* HttpIngressPathType.PREFIX

The type of the path.

---

### GCEPersistentDiskPersistentVolumeProps <a name="cdk8s-plus-22.GCEPersistentDiskPersistentVolumeProps"></a>

Properties for `GCEPersistentDiskPersistentVolume`.

#### Initializer <a name="[object Object].Initializer"></a>

```typescript
import { GCEPersistentDiskPersistentVolumeProps } from 'cdk8s-plus-22'

const gCEPersistentDiskPersistentVolumeProps: GCEPersistentDiskPersistentVolumeProps = { ... }
```

##### `metadata`<sup>Optional</sup> <a name="cdk8s-plus-22.GCEPersistentDiskPersistentVolumeProps.property.metadata"></a>

```typescript
public readonly metadata: ApiObjectMetadata;
```

- *Type:* [`cdk8s.ApiObjectMetadata`](#cdk8s.ApiObjectMetadata)

Metadata that all persisted resources must have, which includes all objects users must create.

---

##### `accessModes`<sup>Optional</sup> <a name="cdk8s-plus-22.GCEPersistentDiskPersistentVolumeProps.property.accessModes"></a>

```typescript
public readonly accessModes: PersistentVolumeAccessMode[];
```

- *Type:* [`cdk8s-plus-22.PersistentVolumeAccessMode`](#cdk8s-plus-22.PersistentVolumeAccessMode)[]
- *Default:* No access modes.

Contains all ways the volume can be mounted.

> https://kubernetes.io/docs/concepts/storage/persistent-volumes#access-modes

---

##### `claim`<sup>Optional</sup> <a name="cdk8s-plus-22.GCEPersistentDiskPersistentVolumeProps.property.claim"></a>

```typescript
public readonly claim: IPersistentVolumeClaim;
```

- *Type:* [`cdk8s-plus-22.IPersistentVolumeClaim`](#cdk8s-plus-22.IPersistentVolumeClaim)
- *Default:* Not bound to a specific claim.

Part of a bi-directional binding between PersistentVolume and PersistentVolumeClaim.

Expected to be non-nil when bound.

> https://kubernetes.io/docs/concepts/storage/persistent-volumes#binding

---

##### `mountOptions`<sup>Optional</sup> <a name="cdk8s-plus-22.GCEPersistentDiskPersistentVolumeProps.property.mountOptions"></a>

```typescript
public readonly mountOptions: string[];
```

- *Type:* `string`[]
- *Default:* No options.

A list of mount options, e.g. ["ro", "soft"]. Not validated - mount will simply fail if one is invalid.

> https://kubernetes.io/docs/concepts/storage/persistent-volumes/#mount-options

---

##### `reclaimPolicy`<sup>Optional</sup> <a name="cdk8s-plus-22.GCEPersistentDiskPersistentVolumeProps.property.reclaimPolicy"></a>

```typescript
public readonly reclaimPolicy: PersistentVolumeReclaimPolicy;
```

- *Type:* [`cdk8s-plus-22.PersistentVolumeReclaimPolicy`](#cdk8s-plus-22.PersistentVolumeReclaimPolicy)
- *Default:* PersistentVolumeReclaimPolicy.RETAIN

When a user is done with their volume, they can delete the PVC objects from the API that allows reclamation of the resource.

The reclaim policy tells the cluster what to do with
the volume after it has been released of its claim.

> https://kubernetes.io/docs/concepts/storage/persistent-volumes#reclaiming

---

##### `storage`<sup>Optional</sup> <a name="cdk8s-plus-22.GCEPersistentDiskPersistentVolumeProps.property.storage"></a>

```typescript
public readonly storage: Size;
```

- *Type:* [`cdk8s.Size`](#cdk8s.Size)
- *Default:* No specified.

What is the storage capacity of this volume.

> https://kubernetes.io/docs/concepts/storage/persistent-volumes#resources

---

##### `storageClassName`<sup>Optional</sup> <a name="cdk8s-plus-22.GCEPersistentDiskPersistentVolumeProps.property.storageClassName"></a>

```typescript
public readonly storageClassName: string;
```

- *Type:* `string`
- *Default:* Volume does not belong to any storage class.

Name of StorageClass to which this persistent volume belongs.

---

##### `volumeMode`<sup>Optional</sup> <a name="cdk8s-plus-22.GCEPersistentDiskPersistentVolumeProps.property.volumeMode"></a>

```typescript
public readonly volumeMode: PersistentVolumeMode;
```

- *Type:* [`cdk8s-plus-22.PersistentVolumeMode`](#cdk8s-plus-22.PersistentVolumeMode)
- *Default:* VolumeMode.FILE_SYSTEM

Defines what type of volume is required by the claim.

---

##### `pdName`<sup>Required</sup> <a name="cdk8s-plus-22.GCEPersistentDiskPersistentVolumeProps.property.pdName"></a>

```typescript
public readonly pdName: string;
```

- *Type:* `string`

Unique name of the PD resource in GCE.

Used to identify the disk in GCE.

> https://kubernetes.io/docs/concepts/storage/volumes#gcepersistentdisk

---

##### `fsType`<sup>Optional</sup> <a name="cdk8s-plus-22.GCEPersistentDiskPersistentVolumeProps.property.fsType"></a>

```typescript
public readonly fsType: string;
```

- *Type:* `string`
- *Default:* 'ext4'

Filesystem type of the volume that you want to mount.

Tip: Ensure that the filesystem type is supported by the host operating system.

> https://kubernetes.io/docs/concepts/storage/volumes#awselasticblockstore

---

##### `partition`<sup>Optional</sup> <a name="cdk8s-plus-22.GCEPersistentDiskPersistentVolumeProps.property.partition"></a>

```typescript
public readonly partition: number;
```

- *Type:* `number`
- *Default:* No partition.

The partition in the volume that you want to mount.

If omitted, the default is to mount by volume name.
Examples: For volume /dev/sda1, you specify the partition as "1".
Similarly, the volume partition for /dev/sda is "0" (or you can leave the property empty).

---

##### `readOnly`<sup>Optional</sup> <a name="cdk8s-plus-22.GCEPersistentDiskPersistentVolumeProps.property.readOnly"></a>

```typescript
public readonly readOnly: boolean;
```

- *Type:* `boolean`
- *Default:* false

Specify "true" to force and set the ReadOnly property in VolumeMounts to "true".

> https://kubernetes.io/docs/concepts/storage/volumes#awselasticblockstore

---

### HandlerFromHttpGetOptions <a name="cdk8s-plus-22.HandlerFromHttpGetOptions"></a>

Options for `Handler.fromHttpGet`.

#### Initializer <a name="[object Object].Initializer"></a>

```typescript
import { HandlerFromHttpGetOptions } from 'cdk8s-plus-22'

const handlerFromHttpGetOptions: HandlerFromHttpGetOptions = { ... }
```

##### `port`<sup>Optional</sup> <a name="cdk8s-plus-22.HandlerFromHttpGetOptions.property.port"></a>

```typescript
public readonly port: number;
```

- *Type:* `number`
- *Default:* defaults to `container.port`.

The TCP port to use when sending the GET request.

---

### HandlerFromTcpSocketOptions <a name="cdk8s-plus-22.HandlerFromTcpSocketOptions"></a>

Options for `Handler.fromTcpSocket`.

#### Initializer <a name="[object Object].Initializer"></a>

```typescript
import { HandlerFromTcpSocketOptions } from 'cdk8s-plus-22'

const handlerFromTcpSocketOptions: HandlerFromTcpSocketOptions = { ... }
```

##### `host`<sup>Optional</sup> <a name="cdk8s-plus-22.HandlerFromTcpSocketOptions.property.host"></a>

```typescript
public readonly host: string;
```

- *Type:* `string`
- *Default:* defaults to the pod IP

The host name to connect to on the container.

---

##### `port`<sup>Optional</sup> <a name="cdk8s-plus-22.HandlerFromTcpSocketOptions.property.port"></a>

```typescript
public readonly port: number;
```

- *Type:* `number`
- *Default:* defaults to `container.port`.

The TCP port to connect to on the container.

---

### HostAlias <a name="cdk8s-plus-22.HostAlias"></a>

HostAlias holds the mapping between IP and hostnames that will be injected as an entry in the pod's /etc/hosts file.

#### Initializer <a name="[object Object].Initializer"></a>

```typescript
import { HostAlias } from 'cdk8s-plus-22'

const hostAlias: HostAlias = { ... }
```

##### `hostnames`<sup>Required</sup> <a name="cdk8s-plus-22.HostAlias.property.hostnames"></a>

```typescript
public readonly hostnames: string[];
```

- *Type:* `string`[]

Hostnames for the chosen IP address.

---

##### `ip`<sup>Required</sup> <a name="cdk8s-plus-22.HostAlias.property.ip"></a>

```typescript
public readonly ip: string;
```

- *Type:* `string`

IP address of the host file entry.

---

### HttpGetProbeOptions <a name="cdk8s-plus-22.HttpGetProbeOptions"></a>

Options for `Probe.fromHttpGet()`.

#### Initializer <a name="[object Object].Initializer"></a>

```typescript
import { HttpGetProbeOptions } from 'cdk8s-plus-22'

const httpGetProbeOptions: HttpGetProbeOptions = { ... }
```

##### `failureThreshold`<sup>Optional</sup> <a name="cdk8s-plus-22.HttpGetProbeOptions.property.failureThreshold"></a>

```typescript
public readonly failureThreshold: number;
```

- *Type:* `number`
- *Default:* 3

Minimum consecutive failures for the probe to be considered failed after having succeeded.

Defaults to 3. Minimum value is 1.

---

##### `initialDelaySeconds`<sup>Optional</sup> <a name="cdk8s-plus-22.HttpGetProbeOptions.property.initialDelaySeconds"></a>

```typescript
public readonly initialDelaySeconds: Duration;
```

- *Type:* [`cdk8s.Duration`](#cdk8s.Duration)
- *Default:* immediate

Number of seconds after the container has started before liveness probes are initiated.

> https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle#container-probes

---

##### `periodSeconds`<sup>Optional</sup> <a name="cdk8s-plus-22.HttpGetProbeOptions.property.periodSeconds"></a>

```typescript
public readonly periodSeconds: Duration;
```

- *Type:* [`cdk8s.Duration`](#cdk8s.Duration)
- *Default:* Duration.seconds(10) Minimum value is 1.

How often (in seconds) to perform the probe.

Default to 10 seconds. Minimum value is 1.

---

##### `successThreshold`<sup>Optional</sup> <a name="cdk8s-plus-22.HttpGetProbeOptions.property.successThreshold"></a>

```typescript
public readonly successThreshold: number;
```

- *Type:* `number`
- *Default:* 1 Must be 1 for liveness and startup. Minimum value is 1.

Minimum consecutive successes for the probe to be considered successful after having failed. Defaults to 1.

Must be 1 for liveness and startup. Minimum value is 1.

---

##### `timeoutSeconds`<sup>Optional</sup> <a name="cdk8s-plus-22.HttpGetProbeOptions.property.timeoutSeconds"></a>

```typescript
public readonly timeoutSeconds: Duration;
```

- *Type:* [`cdk8s.Duration`](#cdk8s.Duration)
- *Default:* Duration.seconds(1)

Number of seconds after which the probe times out.

Defaults to 1 second. Minimum value is 1.

> https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle#container-probes

---

##### `port`<sup>Optional</sup> <a name="cdk8s-plus-22.HttpGetProbeOptions.property.port"></a>

```typescript
public readonly port: number;
```

- *Type:* `number`
- *Default:* defaults to `container.port`.

The TCP port to use when sending the GET request.

---

### IngressProps <a name="cdk8s-plus-22.IngressProps"></a>

Properties for `Ingress`.

#### Initializer <a name="[object Object].Initializer"></a>

```typescript
import { IngressProps } from 'cdk8s-plus-22'

const ingressProps: IngressProps = { ... }
```

##### `metadata`<sup>Optional</sup> <a name="cdk8s-plus-22.IngressProps.property.metadata"></a>

```typescript
public readonly metadata: ApiObjectMetadata;
```

- *Type:* [`cdk8s.ApiObjectMetadata`](#cdk8s.ApiObjectMetadata)

Metadata that all persisted resources must have, which includes all objects users must create.

---

##### `defaultBackend`<sup>Optional</sup> <a name="cdk8s-plus-22.IngressProps.property.defaultBackend"></a>

```typescript
public readonly defaultBackend: IngressBackend;
```

- *Type:* [`cdk8s-plus-22.IngressBackend`](#cdk8s-plus-22.IngressBackend)

The default backend services requests that do not match any rule.

Using this option or the `addDefaultBackend()` method is equivalent to
adding a rule with both `path` and `host` undefined.

---

##### `rules`<sup>Optional</sup> <a name="cdk8s-plus-22.IngressProps.property.rules"></a>

```typescript
public readonly rules: IngressRule[];
```

- *Type:* [`cdk8s-plus-22.IngressRule`](#cdk8s-plus-22.IngressRule)[]

Routing rules for this ingress.

Each rule must define an `IngressBackend` that will receive the requests
that match this rule. If both `host` and `path` are not specifiec, this
backend will be used as the default backend of the ingress.

You can also add rules later using `addRule()`, `addHostRule()`,
`addDefaultBackend()` and `addHostDefaultBackend()`.

---

##### `tls`<sup>Optional</sup> <a name="cdk8s-plus-22.IngressProps.property.tls"></a>

```typescript
public readonly tls: IngressTls[];
```

- *Type:* [`cdk8s-plus-22.IngressTls`](#cdk8s-plus-22.IngressTls)[]

TLS settings for this ingress.

Using this option tells the ingress controller to expose a TLS endpoint.
Currently the Ingress only supports a single TLS port, 443. If multiple
members of this list specify different hosts, they will be multiplexed on
the same port according to the hostname specified through the SNI TLS
extension, if the ingress controller fulfilling the ingress supports SNI.

---

### IngressRule <a name="cdk8s-plus-22.IngressRule"></a>

Represents the rules mapping the paths under a specified host to the related backend services.

Incoming requests are first evaluated for a host match,
then routed to the backend associated with the matching path.

#### Initializer <a name="[object Object].Initializer"></a>

```typescript
import { IngressRule } from 'cdk8s-plus-22'

const ingressRule: IngressRule = { ... }
```

##### `backend`<sup>Required</sup> <a name="cdk8s-plus-22.IngressRule.property.backend"></a>

```typescript
public readonly backend: IngressBackend;
```

- *Type:* [`cdk8s-plus-22.IngressBackend`](#cdk8s-plus-22.IngressBackend)

Backend defines the referenced service endpoint to which the traffic will be forwarded to.

---

##### `host`<sup>Optional</sup> <a name="cdk8s-plus-22.IngressRule.property.host"></a>

```typescript
public readonly host: string;
```

- *Type:* `string`
- *Default:* If the host is unspecified, the Ingress routes all traffic based
on the specified IngressRuleValue.

Host is the fully qualified domain name of a network host, as defined by RFC 3986.

Note the following deviations from the "host" part of the URI as
defined in the RFC: 1. IPs are not allowed. Currently an IngressRuleValue
can only apply to the IP in the Spec of the parent Ingress. 2. The `:`
delimiter is not respected because ports are not allowed. Currently the
port of an Ingress is implicitly :80 for http and :443 for https. Both
these may change in the future. Incoming requests are matched against the
host before the IngressRuleValue.

---

##### `path`<sup>Optional</sup> <a name="cdk8s-plus-22.IngressRule.property.path"></a>

```typescript
public readonly path: string;
```

- *Type:* `string`
- *Default:* If unspecified, the path defaults to a catch all sending traffic
to the backend.

Path is an extended POSIX regex as defined by IEEE Std 1003.1, (i.e this follows the egrep/unix syntax, not the perl syntax) matched against the path of an incoming request. Currently it can contain characters disallowed from the conventional "path" part of a URL as defined by RFC 3986. Paths must begin with a '/'.

---

##### `pathType`<sup>Optional</sup> <a name="cdk8s-plus-22.IngressRule.property.pathType"></a>

```typescript
public readonly pathType: HttpIngressPathType;
```

- *Type:* [`cdk8s-plus-22.HttpIngressPathType`](#cdk8s-plus-22.HttpIngressPathType)

Specify how the path is matched against request paths.

By default, path
types will be matched by prefix.

> https://kubernetes.io/docs/concepts/services-networking/ingress/#path-types

---

### IngressTls <a name="cdk8s-plus-22.IngressTls"></a>

Represents the TLS configuration mapping that is passed to the ingress controller for SSL termination.

#### Initializer <a name="[object Object].Initializer"></a>

```typescript
import { IngressTls } from 'cdk8s-plus-22'

const ingressTls: IngressTls = { ... }
```

##### `hosts`<sup>Optional</sup> <a name="cdk8s-plus-22.IngressTls.property.hosts"></a>

```typescript
public readonly hosts: string[];
```

- *Type:* `string`[]
- *Default:* If unspecified, it defaults to the wildcard host setting for
the loadbalancer controller fulfilling this Ingress.

Hosts are a list of hosts included in the TLS certificate.

The values in
this list must match the name/s used in the TLS Secret.

---

##### `secret`<sup>Optional</sup> <a name="cdk8s-plus-22.IngressTls.property.secret"></a>

```typescript
public readonly secret: ISecret;
```

- *Type:* [`cdk8s-plus-22.ISecret`](#cdk8s-plus-22.ISecret)
- *Default:* If unspecified, it allows SSL routing based on SNI hostname.

Secret is the secret that contains the certificate and key used to terminate SSL traffic on 443.

If the SNI host in a listener conflicts with
the "Host" header field used by an IngressRule, the SNI host is used for
termination and value of the Host header is used for routing.

---

### JobProps <a name="cdk8s-plus-22.JobProps"></a>

Properties for initialization of `Job`.

#### Initializer <a name="[object Object].Initializer"></a>

```typescript
import { JobProps } from 'cdk8s-plus-22'

const jobProps: JobProps = { ... }
```

##### `metadata`<sup>Optional</sup> <a name="cdk8s-plus-22.JobProps.property.metadata"></a>

```typescript
public readonly metadata: ApiObjectMetadata;
```

- *Type:* [`cdk8s.ApiObjectMetadata`](#cdk8s.ApiObjectMetadata)

Metadata that all persisted resources must have, which includes all objects users must create.

---

##### `containers`<sup>Optional</sup> <a name="cdk8s-plus-22.JobProps.property.containers"></a>

```typescript
public readonly containers: ContainerProps[];
```

- *Type:* [`cdk8s-plus-22.ContainerProps`](#cdk8s-plus-22.ContainerProps)[]
- *Default:* No containers. Note that a pod spec must include at least one container.

List of containers belonging to the pod.

Containers cannot currently be
added or removed. There must be at least one container in a Pod.

You can add additionnal containers using `podSpec.addContainer()`

---

##### `hostAliases`<sup>Optional</sup> <a name="cdk8s-plus-22.JobProps.property.hostAliases"></a>

```typescript
public readonly hostAliases: HostAlias[];
```

- *Type:* [`cdk8s-plus-22.HostAlias`](#cdk8s-plus-22.HostAlias)[]

HostAlias holds the mapping between IP and hostnames that will be injected as an entry in the pod's hosts file.

---

##### `initContainers`<sup>Optional</sup> <a name="cdk8s-plus-22.JobProps.property.initContainers"></a>

```typescript
public readonly initContainers: ContainerProps[];
```

- *Type:* [`cdk8s-plus-22.ContainerProps`](#cdk8s-plus-22.ContainerProps)[]
- *Default:* No init containers.

List of initialization containers belonging to the pod.

Init containers are executed in order prior to containers being started.
If any init container fails, the pod is considered to have failed and is handled according to its restartPolicy.
The name for an init container or normal container must be unique among all containers.
Init containers may not have Lifecycle actions, Readiness probes, Liveness probes, or Startup probes.
The resourceRequirements of an init container are taken into account during scheduling by finding the highest request/limit
for each resource type, and then using the max of of that value or the sum of the normal containers.
Limits are applied to init containers in a similar fashion.

Init containers cannot currently be added ,removed or updated.

> https://kubernetes.io/docs/concepts/workloads/pods/init-containers/

---

##### `restartPolicy`<sup>Optional</sup> <a name="cdk8s-plus-22.JobProps.property.restartPolicy"></a>

```typescript
public readonly restartPolicy: RestartPolicy;
```

- *Type:* [`cdk8s-plus-22.RestartPolicy`](#cdk8s-plus-22.RestartPolicy)
- *Default:* RestartPolicy.ALWAYS

Restart policy for all containers within the pod.

> https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle/#restart-policy

---

##### `securityContext`<sup>Optional</sup> <a name="cdk8s-plus-22.JobProps.property.securityContext"></a>

```typescript
public readonly securityContext: PodSecurityContextProps;
```

- *Type:* [`cdk8s-plus-22.PodSecurityContextProps`](#cdk8s-plus-22.PodSecurityContextProps)
- *Default:* fsGroupChangePolicy: FsGroupChangePolicy.FsGroupChangePolicy.ALWAYS
  ensureNonRoot: false

SecurityContext holds pod-level security attributes and common container settings.

---

##### `serviceAccount`<sup>Optional</sup> <a name="cdk8s-plus-22.JobProps.property.serviceAccount"></a>

```typescript
public readonly serviceAccount: IServiceAccount;
```

- *Type:* [`cdk8s-plus-22.IServiceAccount`](#cdk8s-plus-22.IServiceAccount)
- *Default:* No service account.

A service account provides an identity for processes that run in a Pod.

When you (a human) access the cluster (for example, using kubectl), you are
authenticated by the apiserver as a particular User Account (currently this
is usually admin, unless your cluster administrator has customized your
cluster). Processes in containers inside pods can also contact the
apiserver. When they do, they are authenticated as a particular Service
Account (for example, default).

> https://kubernetes.io/docs/tasks/configure-pod-container/configure-service-account/

---

##### `volumes`<sup>Optional</sup> <a name="cdk8s-plus-22.JobProps.property.volumes"></a>

```typescript
public readonly volumes: Volume[];
```

- *Type:* [`cdk8s-plus-22.Volume`](#cdk8s-plus-22.Volume)[]
- *Default:* No volumes.

List of volumes that can be mounted by containers belonging to the pod.

You can also add volumes later using `podSpec.addVolume()`

> https://kubernetes.io/docs/concepts/storage/volumes

---

##### `podMetadata`<sup>Optional</sup> <a name="cdk8s-plus-22.JobProps.property.podMetadata"></a>

```typescript
public readonly podMetadata: ApiObjectMetadata;
```

- *Type:* [`cdk8s.ApiObjectMetadata`](#cdk8s.ApiObjectMetadata)

The pod metadata.

---

##### `activeDeadline`<sup>Optional</sup> <a name="cdk8s-plus-22.JobProps.property.activeDeadline"></a>

```typescript
public readonly activeDeadline: Duration;
```

- *Type:* [`cdk8s.Duration`](#cdk8s.Duration)
- *Default:* If unset, then there is no deadline.

Specifies the duration the job may be active before the system tries to terminate it.

---

##### `backoffLimit`<sup>Optional</sup> <a name="cdk8s-plus-22.JobProps.property.backoffLimit"></a>

```typescript
public readonly backoffLimit: number;
```

- *Type:* `number`
- *Default:* If not set, system defaults to 6.

Specifies the number of retries before marking this job failed.

---

##### `ttlAfterFinished`<sup>Optional</sup> <a name="cdk8s-plus-22.JobProps.property.ttlAfterFinished"></a>

```typescript
public readonly ttlAfterFinished: Duration;
```

- *Type:* [`cdk8s.Duration`](#cdk8s.Duration)
- *Default:* If this field is unset, the Job won't be automatically deleted.

Limits the lifetime of a Job that has finished execution (either Complete or Failed).

If this field is set, after the Job finishes, it is eligible to
be automatically deleted. When the Job is being deleted, its lifecycle
guarantees (e.g. finalizers) will be honored. If this field is set to zero,
the Job becomes eligible to be deleted immediately after it finishes. This
field is alpha-level and is only honored by servers that enable the
`TTLAfterFinished` feature.

---

### MemoryResources <a name="cdk8s-plus-22.MemoryResources"></a>

Memory request and limit.

#### Initializer <a name="[object Object].Initializer"></a>

```typescript
import { MemoryResources } from 'cdk8s-plus-22'

const memoryResources: MemoryResources = { ... }
```

##### `limit`<sup>Required</sup> <a name="cdk8s-plus-22.MemoryResources.property.limit"></a>

```typescript
public readonly limit: Size;
```

- *Type:* [`cdk8s.Size`](#cdk8s.Size)

---

##### `request`<sup>Required</sup> <a name="cdk8s-plus-22.MemoryResources.property.request"></a>

```typescript
public readonly request: Size;
```

- *Type:* [`cdk8s.Size`](#cdk8s.Size)

---

### MountOptions <a name="cdk8s-plus-22.MountOptions"></a>

Options for mounts.

#### Initializer <a name="[object Object].Initializer"></a>

```typescript
import { MountOptions } from 'cdk8s-plus-22'

const mountOptions: MountOptions = { ... }
```

##### `propagation`<sup>Optional</sup> <a name="cdk8s-plus-22.MountOptions.property.propagation"></a>

```typescript
public readonly propagation: MountPropagation;
```

- *Type:* [`cdk8s-plus-22.MountPropagation`](#cdk8s-plus-22.MountPropagation)
- *Default:* MountPropagation.NONE

Determines how mounts are propagated from the host to container and the other way around.

When not set, MountPropagationNone is used.

Mount propagation allows for sharing volumes mounted by a Container to
other Containers in the same Pod, or even to other Pods on the same node.

---

##### `readOnly`<sup>Optional</sup> <a name="cdk8s-plus-22.MountOptions.property.readOnly"></a>

```typescript
public readonly readOnly: boolean;
```

- *Type:* `boolean`
- *Default:* false

Mounted read-only if true, read-write otherwise (false or unspecified).

Defaults to false.

---

##### `subPath`<sup>Optional</sup> <a name="cdk8s-plus-22.MountOptions.property.subPath"></a>

```typescript
public readonly subPath: string;
```

- *Type:* `string`
- *Default:* "" the volume's root

Path within the volume from which the container's volume should be mounted.).

---

##### `subPathExpr`<sup>Optional</sup> <a name="cdk8s-plus-22.MountOptions.property.subPathExpr"></a>

```typescript
public readonly subPathExpr: string;
```

- *Type:* `string`
- *Default:* "" volume's root.

Expanded path within the volume from which the container's volume should be mounted.

Behaves similarly to SubPath but environment variable references
$(VAR_NAME) are expanded using the container's environment. Defaults to ""
(volume's root).

`subPathExpr` and `subPath` are mutually exclusive.

---

### PathMapping <a name="cdk8s-plus-22.PathMapping"></a>

Maps a string key to a path within a volume.

#### Initializer <a name="[object Object].Initializer"></a>

```typescript
import { PathMapping } from 'cdk8s-plus-22'

const pathMapping: PathMapping = { ... }
```

##### `path`<sup>Required</sup> <a name="cdk8s-plus-22.PathMapping.property.path"></a>

```typescript
public readonly path: string;
```

- *Type:* `string`

The relative path of the file to map the key to.

May not be an absolute
path. May not contain the path element '..'. May not start with the string
'..'.

---

##### `mode`<sup>Optional</sup> <a name="cdk8s-plus-22.PathMapping.property.mode"></a>

```typescript
public readonly mode: number;
```

- *Type:* `number`

Optional: mode bits to use on this file, must be a value between 0 and 0777.

If not specified, the volume defaultMode will be used. This might be
in conflict with other options that affect the file mode, like fsGroup, and
the result can be other mode bits set.

---

### PersistentVolumeClaimProps <a name="cdk8s-plus-22.PersistentVolumeClaimProps"></a>

Properties for `PersistentVolumeClaim`.

#### Initializer <a name="[object Object].Initializer"></a>

```typescript
import { PersistentVolumeClaimProps } from 'cdk8s-plus-22'

const persistentVolumeClaimProps: PersistentVolumeClaimProps = { ... }
```

##### `metadata`<sup>Optional</sup> <a name="cdk8s-plus-22.PersistentVolumeClaimProps.property.metadata"></a>

```typescript
public readonly metadata: ApiObjectMetadata;
```

- *Type:* [`cdk8s.ApiObjectMetadata`](#cdk8s.ApiObjectMetadata)

Metadata that all persisted resources must have, which includes all objects users must create.

---

##### `accessModes`<sup>Optional</sup> <a name="cdk8s-plus-22.PersistentVolumeClaimProps.property.accessModes"></a>

```typescript
public readonly accessModes: PersistentVolumeAccessMode[];
```

- *Type:* [`cdk8s-plus-22.PersistentVolumeAccessMode`](#cdk8s-plus-22.PersistentVolumeAccessMode)[]
- *Default:* No access modes requirement.

Contains the access modes the volume should support.

> https://kubernetes.io/docs/concepts/storage/persistent-volumes#access-modes-1

---

##### `storage`<sup>Optional</sup> <a name="cdk8s-plus-22.PersistentVolumeClaimProps.property.storage"></a>

```typescript
public readonly storage: Size;
```

- *Type:* [`cdk8s.Size`](#cdk8s.Size)
- *Default:* No storage requirement.

Minimum storage size the volume should have.

> https://kubernetes.io/docs/concepts/storage/persistent-volumes#resources

---

##### `storageClassName`<sup>Optional</sup> <a name="cdk8s-plus-22.PersistentVolumeClaimProps.property.storageClassName"></a>

```typescript
public readonly storageClassName: string;
```

- *Type:* `string`
- *Default:* Not set.

Name of the StorageClass required by the claim. When this property is not set, the behavior is as follows:.

If the admission plugin is turned on, the storage class marked as default will be used.
- If the admission plugin is turned off, the pvc can only be bound to volumes without a storage class.

> https://kubernetes.io/docs/concepts/storage/persistent-volumes#class-1

---

##### `volume`<sup>Optional</sup> <a name="cdk8s-plus-22.PersistentVolumeClaimProps.property.volume"></a>

```typescript
public readonly volume: IPersistentVolume;
```

- *Type:* [`cdk8s-plus-22.IPersistentVolume`](#cdk8s-plus-22.IPersistentVolume)
- *Default:* No specific volume binding.

The PersistentVolume backing this claim.

The control plane still checks that storage class, access modes,
and requested storage size on the volume are valid.

Note that in order to guarantee a proper binding, the volume should
also define a `claimRef` referring to this claim. Otherwise, the volume may be
claimed be other pvc's before it gets a chance to bind to this one.

If the volume is managed (i.e not imported), you can use `pv.claim()` to easily
create a bi-directional bounded claim.

> https://kubernetes.io/docs/concepts/storage/persistent-volumes/#binding.

---

##### `volumeMode`<sup>Optional</sup> <a name="cdk8s-plus-22.PersistentVolumeClaimProps.property.volumeMode"></a>

```typescript
public readonly volumeMode: PersistentVolumeMode;
```

- *Type:* [`cdk8s-plus-22.PersistentVolumeMode`](#cdk8s-plus-22.PersistentVolumeMode)
- *Default:* VolumeMode.FILE_SYSTEM

Defines what type of volume is required by the claim.

---

### PersistentVolumeClaimVolumeOptions <a name="cdk8s-plus-22.PersistentVolumeClaimVolumeOptions"></a>

Options for a PersistentVolumeClaim-based volume.

#### Initializer <a name="[object Object].Initializer"></a>

```typescript
import { PersistentVolumeClaimVolumeOptions } from 'cdk8s-plus-22'

const persistentVolumeClaimVolumeOptions: PersistentVolumeClaimVolumeOptions = { ... }
```

##### `name`<sup>Optional</sup> <a name="cdk8s-plus-22.PersistentVolumeClaimVolumeOptions.property.name"></a>

```typescript
public readonly name: string;
```

- *Type:* `string`
- *Default:* Derived from the PVC name.

The volume name.

---

##### `readOnly`<sup>Optional</sup> <a name="cdk8s-plus-22.PersistentVolumeClaimVolumeOptions.property.readOnly"></a>

```typescript
public readonly readOnly: boolean;
```

- *Type:* `boolean`
- *Default:* false

Will force the ReadOnly setting in VolumeMounts.

---

### PersistentVolumeProps <a name="cdk8s-plus-22.PersistentVolumeProps"></a>

Properties for `PersistentVolume`.

#### Initializer <a name="[object Object].Initializer"></a>

```typescript
import { PersistentVolumeProps } from 'cdk8s-plus-22'

const persistentVolumeProps: PersistentVolumeProps = { ... }
```

##### `metadata`<sup>Optional</sup> <a name="cdk8s-plus-22.PersistentVolumeProps.property.metadata"></a>

```typescript
public readonly metadata: ApiObjectMetadata;
```

- *Type:* [`cdk8s.ApiObjectMetadata`](#cdk8s.ApiObjectMetadata)

Metadata that all persisted resources must have, which includes all objects users must create.

---

##### `accessModes`<sup>Optional</sup> <a name="cdk8s-plus-22.PersistentVolumeProps.property.accessModes"></a>

```typescript
public readonly accessModes: PersistentVolumeAccessMode[];
```

- *Type:* [`cdk8s-plus-22.PersistentVolumeAccessMode`](#cdk8s-plus-22.PersistentVolumeAccessMode)[]
- *Default:* No access modes.

Contains all ways the volume can be mounted.

> https://kubernetes.io/docs/concepts/storage/persistent-volumes#access-modes

---

##### `claim`<sup>Optional</sup> <a name="cdk8s-plus-22.PersistentVolumeProps.property.claim"></a>

```typescript
public readonly claim: IPersistentVolumeClaim;
```

- *Type:* [`cdk8s-plus-22.IPersistentVolumeClaim`](#cdk8s-plus-22.IPersistentVolumeClaim)
- *Default:* Not bound to a specific claim.

Part of a bi-directional binding between PersistentVolume and PersistentVolumeClaim.

Expected to be non-nil when bound.

> https://kubernetes.io/docs/concepts/storage/persistent-volumes#binding

---

##### `mountOptions`<sup>Optional</sup> <a name="cdk8s-plus-22.PersistentVolumeProps.property.mountOptions"></a>

```typescript
public readonly mountOptions: string[];
```

- *Type:* `string`[]
- *Default:* No options.

A list of mount options, e.g. ["ro", "soft"]. Not validated - mount will simply fail if one is invalid.

> https://kubernetes.io/docs/concepts/storage/persistent-volumes/#mount-options

---

##### `reclaimPolicy`<sup>Optional</sup> <a name="cdk8s-plus-22.PersistentVolumeProps.property.reclaimPolicy"></a>

```typescript
public readonly reclaimPolicy: PersistentVolumeReclaimPolicy;
```

- *Type:* [`cdk8s-plus-22.PersistentVolumeReclaimPolicy`](#cdk8s-plus-22.PersistentVolumeReclaimPolicy)
- *Default:* PersistentVolumeReclaimPolicy.RETAIN

When a user is done with their volume, they can delete the PVC objects from the API that allows reclamation of the resource.

The reclaim policy tells the cluster what to do with
the volume after it has been released of its claim.

> https://kubernetes.io/docs/concepts/storage/persistent-volumes#reclaiming

---

##### `storage`<sup>Optional</sup> <a name="cdk8s-plus-22.PersistentVolumeProps.property.storage"></a>

```typescript
public readonly storage: Size;
```

- *Type:* [`cdk8s.Size`](#cdk8s.Size)
- *Default:* No specified.

What is the storage capacity of this volume.

> https://kubernetes.io/docs/concepts/storage/persistent-volumes#resources

---

##### `storageClassName`<sup>Optional</sup> <a name="cdk8s-plus-22.PersistentVolumeProps.property.storageClassName"></a>

```typescript
public readonly storageClassName: string;
```

- *Type:* `string`
- *Default:* Volume does not belong to any storage class.

Name of StorageClass to which this persistent volume belongs.

---

##### `volumeMode`<sup>Optional</sup> <a name="cdk8s-plus-22.PersistentVolumeProps.property.volumeMode"></a>

```typescript
public readonly volumeMode: PersistentVolumeMode;
```

- *Type:* [`cdk8s-plus-22.PersistentVolumeMode`](#cdk8s-plus-22.PersistentVolumeMode)
- *Default:* VolumeMode.FILE_SYSTEM

Defines what type of volume is required by the claim.

---

### PodProps <a name="cdk8s-plus-22.PodProps"></a>

Properties for initialization of `Pod`.

#### Initializer <a name="[object Object].Initializer"></a>

```typescript
import { PodProps } from 'cdk8s-plus-22'

const podProps: PodProps = { ... }
```

##### `metadata`<sup>Optional</sup> <a name="cdk8s-plus-22.PodProps.property.metadata"></a>

```typescript
public readonly metadata: ApiObjectMetadata;
```

- *Type:* [`cdk8s.ApiObjectMetadata`](#cdk8s.ApiObjectMetadata)

Metadata that all persisted resources must have, which includes all objects users must create.

---

##### `containers`<sup>Optional</sup> <a name="cdk8s-plus-22.PodProps.property.containers"></a>

```typescript
public readonly containers: ContainerProps[];
```

- *Type:* [`cdk8s-plus-22.ContainerProps`](#cdk8s-plus-22.ContainerProps)[]
- *Default:* No containers. Note that a pod spec must include at least one container.

List of containers belonging to the pod.

Containers cannot currently be
added or removed. There must be at least one container in a Pod.

You can add additionnal containers using `podSpec.addContainer()`

---

##### `hostAliases`<sup>Optional</sup> <a name="cdk8s-plus-22.PodProps.property.hostAliases"></a>

```typescript
public readonly hostAliases: HostAlias[];
```

- *Type:* [`cdk8s-plus-22.HostAlias`](#cdk8s-plus-22.HostAlias)[]

HostAlias holds the mapping between IP and hostnames that will be injected as an entry in the pod's hosts file.

---

##### `initContainers`<sup>Optional</sup> <a name="cdk8s-plus-22.PodProps.property.initContainers"></a>

```typescript
public readonly initContainers: ContainerProps[];
```

- *Type:* [`cdk8s-plus-22.ContainerProps`](#cdk8s-plus-22.ContainerProps)[]
- *Default:* No init containers.

List of initialization containers belonging to the pod.

Init containers are executed in order prior to containers being started.
If any init container fails, the pod is considered to have failed and is handled according to its restartPolicy.
The name for an init container or normal container must be unique among all containers.
Init containers may not have Lifecycle actions, Readiness probes, Liveness probes, or Startup probes.
The resourceRequirements of an init container are taken into account during scheduling by finding the highest request/limit
for each resource type, and then using the max of of that value or the sum of the normal containers.
Limits are applied to init containers in a similar fashion.

Init containers cannot currently be added ,removed or updated.

> https://kubernetes.io/docs/concepts/workloads/pods/init-containers/

---

##### `restartPolicy`<sup>Optional</sup> <a name="cdk8s-plus-22.PodProps.property.restartPolicy"></a>

```typescript
public readonly restartPolicy: RestartPolicy;
```

- *Type:* [`cdk8s-plus-22.RestartPolicy`](#cdk8s-plus-22.RestartPolicy)
- *Default:* RestartPolicy.ALWAYS

Restart policy for all containers within the pod.

> https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle/#restart-policy

---

##### `securityContext`<sup>Optional</sup> <a name="cdk8s-plus-22.PodProps.property.securityContext"></a>

```typescript
public readonly securityContext: PodSecurityContextProps;
```

- *Type:* [`cdk8s-plus-22.PodSecurityContextProps`](#cdk8s-plus-22.PodSecurityContextProps)
- *Default:* fsGroupChangePolicy: FsGroupChangePolicy.FsGroupChangePolicy.ALWAYS
  ensureNonRoot: false

SecurityContext holds pod-level security attributes and common container settings.

---

##### `serviceAccount`<sup>Optional</sup> <a name="cdk8s-plus-22.PodProps.property.serviceAccount"></a>

```typescript
public readonly serviceAccount: IServiceAccount;
```

- *Type:* [`cdk8s-plus-22.IServiceAccount`](#cdk8s-plus-22.IServiceAccount)
- *Default:* No service account.

A service account provides an identity for processes that run in a Pod.

When you (a human) access the cluster (for example, using kubectl), you are
authenticated by the apiserver as a particular User Account (currently this
is usually admin, unless your cluster administrator has customized your
cluster). Processes in containers inside pods can also contact the
apiserver. When they do, they are authenticated as a particular Service
Account (for example, default).

> https://kubernetes.io/docs/tasks/configure-pod-container/configure-service-account/

---

##### `volumes`<sup>Optional</sup> <a name="cdk8s-plus-22.PodProps.property.volumes"></a>

```typescript
public readonly volumes: Volume[];
```

- *Type:* [`cdk8s-plus-22.Volume`](#cdk8s-plus-22.Volume)[]
- *Default:* No volumes.

List of volumes that can be mounted by containers belonging to the pod.

You can also add volumes later using `podSpec.addVolume()`

> https://kubernetes.io/docs/concepts/storage/volumes

---

### PodSecurityContextProps <a name="cdk8s-plus-22.PodSecurityContextProps"></a>

Properties for `PodSecurityContext`.

#### Initializer <a name="[object Object].Initializer"></a>

```typescript
import { PodSecurityContextProps } from 'cdk8s-plus-22'

const podSecurityContextProps: PodSecurityContextProps = { ... }
```

##### `ensureNonRoot`<sup>Optional</sup> <a name="cdk8s-plus-22.PodSecurityContextProps.property.ensureNonRoot"></a>

```typescript
public readonly ensureNonRoot: boolean;
```

- *Type:* `boolean`
- *Default:* false

Indicates that the container must run as a non-root user.

If true, the Kubelet will validate the image at runtime to ensure that it does
not run as UID 0 (root) and fail to start the container if it does.

---

##### `fsGroup`<sup>Optional</sup> <a name="cdk8s-plus-22.PodSecurityContextProps.property.fsGroup"></a>

```typescript
public readonly fsGroup: number;
```

- *Type:* `number`
- *Default:* Volume ownership is not changed.

Modify the ownership and permissions of pod volumes to this GID.

---

##### `fsGroupChangePolicy`<sup>Optional</sup> <a name="cdk8s-plus-22.PodSecurityContextProps.property.fsGroupChangePolicy"></a>

```typescript
public readonly fsGroupChangePolicy: FsGroupChangePolicy;
```

- *Type:* [`cdk8s-plus-22.FsGroupChangePolicy`](#cdk8s-plus-22.FsGroupChangePolicy)
- *Default:* FsGroupChangePolicy.ALWAYS

Defines behavior of changing ownership and permission of the volume before being exposed inside Pod.

This field will only apply to volume types which support fsGroup based ownership(and permissions).
It will have no effect on ephemeral volume types such as: secret, configmaps and emptydir.

---

##### `group`<sup>Optional</sup> <a name="cdk8s-plus-22.PodSecurityContextProps.property.group"></a>

```typescript
public readonly group: number;
```

- *Type:* `number`
- *Default:* Group configured by container runtime

The GID to run the entrypoint of the container process.

---

##### `sysctls`<sup>Optional</sup> <a name="cdk8s-plus-22.PodSecurityContextProps.property.sysctls"></a>

```typescript
public readonly sysctls: Sysctl[];
```

- *Type:* [`cdk8s-plus-22.Sysctl`](#cdk8s-plus-22.Sysctl)[]
- *Default:* No sysctls

Sysctls hold a list of namespaced sysctls used for the pod.

Pods with unsupported sysctls (by the container runtime) might fail to launch.

---

##### `user`<sup>Optional</sup> <a name="cdk8s-plus-22.PodSecurityContextProps.property.user"></a>

```typescript
public readonly user: number;
```

- *Type:* `number`
- *Default:* User specified in image metadata

The UID to run the entrypoint of the container process.

---

### PodSpecProps <a name="cdk8s-plus-22.PodSpecProps"></a>

Properties of a `PodSpec`.

#### Initializer <a name="[object Object].Initializer"></a>

```typescript
import { PodSpecProps } from 'cdk8s-plus-22'

const podSpecProps: PodSpecProps = { ... }
```

##### `containers`<sup>Optional</sup> <a name="cdk8s-plus-22.PodSpecProps.property.containers"></a>

```typescript
public readonly containers: ContainerProps[];
```

- *Type:* [`cdk8s-plus-22.ContainerProps`](#cdk8s-plus-22.ContainerProps)[]
- *Default:* No containers. Note that a pod spec must include at least one container.

List of containers belonging to the pod.

Containers cannot currently be
added or removed. There must be at least one container in a Pod.

You can add additionnal containers using `podSpec.addContainer()`

---

##### `hostAliases`<sup>Optional</sup> <a name="cdk8s-plus-22.PodSpecProps.property.hostAliases"></a>

```typescript
public readonly hostAliases: HostAlias[];
```

- *Type:* [`cdk8s-plus-22.HostAlias`](#cdk8s-plus-22.HostAlias)[]

HostAlias holds the mapping between IP and hostnames that will be injected as an entry in the pod's hosts file.

---

##### `initContainers`<sup>Optional</sup> <a name="cdk8s-plus-22.PodSpecProps.property.initContainers"></a>

```typescript
public readonly initContainers: ContainerProps[];
```

- *Type:* [`cdk8s-plus-22.ContainerProps`](#cdk8s-plus-22.ContainerProps)[]
- *Default:* No init containers.

List of initialization containers belonging to the pod.

Init containers are executed in order prior to containers being started.
If any init container fails, the pod is considered to have failed and is handled according to its restartPolicy.
The name for an init container or normal container must be unique among all containers.
Init containers may not have Lifecycle actions, Readiness probes, Liveness probes, or Startup probes.
The resourceRequirements of an init container are taken into account during scheduling by finding the highest request/limit
for each resource type, and then using the max of of that value or the sum of the normal containers.
Limits are applied to init containers in a similar fashion.

Init containers cannot currently be added ,removed or updated.

> https://kubernetes.io/docs/concepts/workloads/pods/init-containers/

---

##### `restartPolicy`<sup>Optional</sup> <a name="cdk8s-plus-22.PodSpecProps.property.restartPolicy"></a>

```typescript
public readonly restartPolicy: RestartPolicy;
```

- *Type:* [`cdk8s-plus-22.RestartPolicy`](#cdk8s-plus-22.RestartPolicy)
- *Default:* RestartPolicy.ALWAYS

Restart policy for all containers within the pod.

> https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle/#restart-policy

---

##### `securityContext`<sup>Optional</sup> <a name="cdk8s-plus-22.PodSpecProps.property.securityContext"></a>

```typescript
public readonly securityContext: PodSecurityContextProps;
```

- *Type:* [`cdk8s-plus-22.PodSecurityContextProps`](#cdk8s-plus-22.PodSecurityContextProps)
- *Default:* fsGroupChangePolicy: FsGroupChangePolicy.FsGroupChangePolicy.ALWAYS
  ensureNonRoot: false

SecurityContext holds pod-level security attributes and common container settings.

---

##### `serviceAccount`<sup>Optional</sup> <a name="cdk8s-plus-22.PodSpecProps.property.serviceAccount"></a>

```typescript
public readonly serviceAccount: IServiceAccount;
```

- *Type:* [`cdk8s-plus-22.IServiceAccount`](#cdk8s-plus-22.IServiceAccount)
- *Default:* No service account.

A service account provides an identity for processes that run in a Pod.

When you (a human) access the cluster (for example, using kubectl), you are
authenticated by the apiserver as a particular User Account (currently this
is usually admin, unless your cluster administrator has customized your
cluster). Processes in containers inside pods can also contact the
apiserver. When they do, they are authenticated as a particular Service
Account (for example, default).

> https://kubernetes.io/docs/tasks/configure-pod-container/configure-service-account/

---

##### `volumes`<sup>Optional</sup> <a name="cdk8s-plus-22.PodSpecProps.property.volumes"></a>

```typescript
public readonly volumes: Volume[];
```

- *Type:* [`cdk8s-plus-22.Volume`](#cdk8s-plus-22.Volume)[]
- *Default:* No volumes.

List of volumes that can be mounted by containers belonging to the pod.

You can also add volumes later using `podSpec.addVolume()`

> https://kubernetes.io/docs/concepts/storage/volumes

---

### PodTemplateProps <a name="cdk8s-plus-22.PodTemplateProps"></a>

Properties of a `PodTemplate`.

Adds metadata information on top of the spec.

#### Initializer <a name="[object Object].Initializer"></a>

```typescript
import { PodTemplateProps } from 'cdk8s-plus-22'

const podTemplateProps: PodTemplateProps = { ... }
```

##### `containers`<sup>Optional</sup> <a name="cdk8s-plus-22.PodTemplateProps.property.containers"></a>

```typescript
public readonly containers: ContainerProps[];
```

- *Type:* [`cdk8s-plus-22.ContainerProps`](#cdk8s-plus-22.ContainerProps)[]
- *Default:* No containers. Note that a pod spec must include at least one container.

List of containers belonging to the pod.

Containers cannot currently be
added or removed. There must be at least one container in a Pod.

You can add additionnal containers using `podSpec.addContainer()`

---

##### `hostAliases`<sup>Optional</sup> <a name="cdk8s-plus-22.PodTemplateProps.property.hostAliases"></a>

```typescript
public readonly hostAliases: HostAlias[];
```

- *Type:* [`cdk8s-plus-22.HostAlias`](#cdk8s-plus-22.HostAlias)[]

HostAlias holds the mapping between IP and hostnames that will be injected as an entry in the pod's hosts file.

---

##### `initContainers`<sup>Optional</sup> <a name="cdk8s-plus-22.PodTemplateProps.property.initContainers"></a>

```typescript
public readonly initContainers: ContainerProps[];
```

- *Type:* [`cdk8s-plus-22.ContainerProps`](#cdk8s-plus-22.ContainerProps)[]
- *Default:* No init containers.

List of initialization containers belonging to the pod.

Init containers are executed in order prior to containers being started.
If any init container fails, the pod is considered to have failed and is handled according to its restartPolicy.
The name for an init container or normal container must be unique among all containers.
Init containers may not have Lifecycle actions, Readiness probes, Liveness probes, or Startup probes.
The resourceRequirements of an init container are taken into account during scheduling by finding the highest request/limit
for each resource type, and then using the max of of that value or the sum of the normal containers.
Limits are applied to init containers in a similar fashion.

Init containers cannot currently be added ,removed or updated.

> https://kubernetes.io/docs/concepts/workloads/pods/init-containers/

---

##### `restartPolicy`<sup>Optional</sup> <a name="cdk8s-plus-22.PodTemplateProps.property.restartPolicy"></a>

```typescript
public readonly restartPolicy: RestartPolicy;
```

- *Type:* [`cdk8s-plus-22.RestartPolicy`](#cdk8s-plus-22.RestartPolicy)
- *Default:* RestartPolicy.ALWAYS

Restart policy for all containers within the pod.

> https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle/#restart-policy

---

##### `securityContext`<sup>Optional</sup> <a name="cdk8s-plus-22.PodTemplateProps.property.securityContext"></a>

```typescript
public readonly securityContext: PodSecurityContextProps;
```

- *Type:* [`cdk8s-plus-22.PodSecurityContextProps`](#cdk8s-plus-22.PodSecurityContextProps)
- *Default:* fsGroupChangePolicy: FsGroupChangePolicy.FsGroupChangePolicy.ALWAYS
  ensureNonRoot: false

SecurityContext holds pod-level security attributes and common container settings.

---

##### `serviceAccount`<sup>Optional</sup> <a name="cdk8s-plus-22.PodTemplateProps.property.serviceAccount"></a>

```typescript
public readonly serviceAccount: IServiceAccount;
```

- *Type:* [`cdk8s-plus-22.IServiceAccount`](#cdk8s-plus-22.IServiceAccount)
- *Default:* No service account.

A service account provides an identity for processes that run in a Pod.

When you (a human) access the cluster (for example, using kubectl), you are
authenticated by the apiserver as a particular User Account (currently this
is usually admin, unless your cluster administrator has customized your
cluster). Processes in containers inside pods can also contact the
apiserver. When they do, they are authenticated as a particular Service
Account (for example, default).

> https://kubernetes.io/docs/tasks/configure-pod-container/configure-service-account/

---

##### `volumes`<sup>Optional</sup> <a name="cdk8s-plus-22.PodTemplateProps.property.volumes"></a>

```typescript
public readonly volumes: Volume[];
```

- *Type:* [`cdk8s-plus-22.Volume`](#cdk8s-plus-22.Volume)[]
- *Default:* No volumes.

List of volumes that can be mounted by containers belonging to the pod.

You can also add volumes later using `podSpec.addVolume()`

> https://kubernetes.io/docs/concepts/storage/volumes

---

##### `podMetadata`<sup>Optional</sup> <a name="cdk8s-plus-22.PodTemplateProps.property.podMetadata"></a>

```typescript
public readonly podMetadata: ApiObjectMetadata;
```

- *Type:* [`cdk8s.ApiObjectMetadata`](#cdk8s.ApiObjectMetadata)

The pod metadata.

---

### ProbeOptions <a name="cdk8s-plus-22.ProbeOptions"></a>

Probe options.

#### Initializer <a name="[object Object].Initializer"></a>

```typescript
import { ProbeOptions } from 'cdk8s-plus-22'

const probeOptions: ProbeOptions = { ... }
```

##### `failureThreshold`<sup>Optional</sup> <a name="cdk8s-plus-22.ProbeOptions.property.failureThreshold"></a>

```typescript
public readonly failureThreshold: number;
```

- *Type:* `number`
- *Default:* 3

Minimum consecutive failures for the probe to be considered failed after having succeeded.

Defaults to 3. Minimum value is 1.

---

##### `initialDelaySeconds`<sup>Optional</sup> <a name="cdk8s-plus-22.ProbeOptions.property.initialDelaySeconds"></a>

```typescript
public readonly initialDelaySeconds: Duration;
```

- *Type:* [`cdk8s.Duration`](#cdk8s.Duration)
- *Default:* immediate

Number of seconds after the container has started before liveness probes are initiated.

> https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle#container-probes

---

##### `periodSeconds`<sup>Optional</sup> <a name="cdk8s-plus-22.ProbeOptions.property.periodSeconds"></a>

```typescript
public readonly periodSeconds: Duration;
```

- *Type:* [`cdk8s.Duration`](#cdk8s.Duration)
- *Default:* Duration.seconds(10) Minimum value is 1.

How often (in seconds) to perform the probe.

Default to 10 seconds. Minimum value is 1.

---

##### `successThreshold`<sup>Optional</sup> <a name="cdk8s-plus-22.ProbeOptions.property.successThreshold"></a>

```typescript
public readonly successThreshold: number;
```

- *Type:* `number`
- *Default:* 1 Must be 1 for liveness and startup. Minimum value is 1.

Minimum consecutive successes for the probe to be considered successful after having failed. Defaults to 1.

Must be 1 for liveness and startup. Minimum value is 1.

---

##### `timeoutSeconds`<sup>Optional</sup> <a name="cdk8s-plus-22.ProbeOptions.property.timeoutSeconds"></a>

```typescript
public readonly timeoutSeconds: Duration;
```

- *Type:* [`cdk8s.Duration`](#cdk8s.Duration)
- *Default:* Duration.seconds(1)

Number of seconds after which the probe times out.

Defaults to 1 second. Minimum value is 1.

> https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle#container-probes

---

### ResourceProps <a name="cdk8s-plus-22.ResourceProps"></a>

Initialization properties for resources.

#### Initializer <a name="[object Object].Initializer"></a>

```typescript
import { ResourceProps } from 'cdk8s-plus-22'

const resourceProps: ResourceProps = { ... }
```

##### `metadata`<sup>Optional</sup> <a name="cdk8s-plus-22.ResourceProps.property.metadata"></a>

```typescript
public readonly metadata: ApiObjectMetadata;
```

- *Type:* [`cdk8s.ApiObjectMetadata`](#cdk8s.ApiObjectMetadata)

Metadata that all persisted resources must have, which includes all objects users must create.

---

### Resources <a name="cdk8s-plus-22.Resources"></a>

CPU and memory compute resources.

#### Initializer <a name="[object Object].Initializer"></a>

```typescript
import { Resources } from 'cdk8s-plus-22'

const resources: Resources = { ... }
```

##### `cpu`<sup>Required</sup> <a name="cdk8s-plus-22.Resources.property.cpu"></a>

```typescript
public readonly cpu: CpuResources;
```

- *Type:* [`cdk8s-plus-22.CpuResources`](#cdk8s-plus-22.CpuResources)

---

##### `memory`<sup>Required</sup> <a name="cdk8s-plus-22.Resources.property.memory"></a>

```typescript
public readonly memory: MemoryResources;
```

- *Type:* [`cdk8s-plus-22.MemoryResources`](#cdk8s-plus-22.MemoryResources)

---

### SecretProps <a name="cdk8s-plus-22.SecretProps"></a>

Options for `Secret`.

#### Initializer <a name="[object Object].Initializer"></a>

```typescript
import { SecretProps } from 'cdk8s-plus-22'

const secretProps: SecretProps = { ... }
```

##### `metadata`<sup>Optional</sup> <a name="cdk8s-plus-22.SecretProps.property.metadata"></a>

```typescript
public readonly metadata: ApiObjectMetadata;
```

- *Type:* [`cdk8s.ApiObjectMetadata`](#cdk8s.ApiObjectMetadata)

Metadata that all persisted resources must have, which includes all objects users must create.

---

##### `stringData`<sup>Optional</sup> <a name="cdk8s-plus-22.SecretProps.property.stringData"></a>

```typescript
public readonly stringData: {[ key: string ]: string};
```

- *Type:* {[ key: string ]: `string`}

stringData allows specifying non-binary secret data in string form.

It is
provided as a write-only convenience method. All keys and values are merged
into the data field on write, overwriting any existing values. It is never
output when reading from the API.

---

##### `type`<sup>Optional</sup> <a name="cdk8s-plus-22.SecretProps.property.type"></a>

```typescript
public readonly type: string;
```

- *Type:* `string`
- *Default:* undefined - Don't set a type.

Optional type associated with the secret.

Used to facilitate programmatic
handling of secret data by various controllers.

---

### SecretValue <a name="cdk8s-plus-22.SecretValue"></a>

Represents a specific value in JSON secret.

#### Initializer <a name="[object Object].Initializer"></a>

```typescript
import { SecretValue } from 'cdk8s-plus-22'

const secretValue: SecretValue = { ... }
```

##### `key`<sup>Required</sup> <a name="cdk8s-plus-22.SecretValue.property.key"></a>

```typescript
public readonly key: string;
```

- *Type:* `string`

The JSON key.

---

##### `secret`<sup>Required</sup> <a name="cdk8s-plus-22.SecretValue.property.secret"></a>

```typescript
public readonly secret: ISecret;
```

- *Type:* [`cdk8s-plus-22.ISecret`](#cdk8s-plus-22.ISecret)

The secret.

---

### SecretVolumeOptions <a name="cdk8s-plus-22.SecretVolumeOptions"></a>

Options for the Secret-based volume.

#### Initializer <a name="[object Object].Initializer"></a>

```typescript
import { SecretVolumeOptions } from 'cdk8s-plus-22'

const secretVolumeOptions: SecretVolumeOptions = { ... }
```

##### `defaultMode`<sup>Optional</sup> <a name="cdk8s-plus-22.SecretVolumeOptions.property.defaultMode"></a>

```typescript
public readonly defaultMode: number;
```

- *Type:* `number`
- *Default:* 0644. Directories within the path are not affected by this
setting. This might be in conflict with other options that affect the file
mode, like fsGroup, and the result can be other mode bits set.

Mode bits to use on created files by default.

Must be a value between 0 and
0777. Defaults to 0644. Directories within the path are not affected by
this setting. This might be in conflict with other options that affect the
file mode, like fsGroup, and the result can be other mode bits set.

---

##### `items`<sup>Optional</sup> <a name="cdk8s-plus-22.SecretVolumeOptions.property.items"></a>

```typescript
public readonly items: {[ key: string ]: PathMapping};
```

- *Type:* {[ key: string ]: [`cdk8s-plus-22.PathMapping`](#cdk8s-plus-22.PathMapping)}
- *Default:* no mapping

If unspecified, each key-value pair in the Data field of the referenced secret will be projected into the volume as a file whose name is the key and content is the value.

If specified, the listed keys will be projected
into the specified paths, and unlisted keys will not be present. If a key
is specified which is not present in the secret, the volume setup will
error unless it is marked optional. Paths must be relative and may not
contain the '..' path or start with '..'.

---

##### `name`<sup>Optional</sup> <a name="cdk8s-plus-22.SecretVolumeOptions.property.name"></a>

```typescript
public readonly name: string;
```

- *Type:* `string`
- *Default:* auto-generated

The volume name.

---

##### `optional`<sup>Optional</sup> <a name="cdk8s-plus-22.SecretVolumeOptions.property.optional"></a>

```typescript
public readonly optional: boolean;
```

- *Type:* `boolean`
- *Default:* undocumented

Specify whether the secret or its keys must be defined.

---

### ServiceAccountProps <a name="cdk8s-plus-22.ServiceAccountProps"></a>

Properties for initialization of `ServiceAccount`.

Properties for initialization of `ServiceAccount`.

#### Initializer <a name="[object Object].Initializer"></a>

```typescript
import { ServiceAccountProps } from 'cdk8s-plus-22'

const serviceAccountProps: ServiceAccountProps = { ... }
```

##### `metadata`<sup>Optional</sup> <a name="cdk8s-plus-22.ServiceAccountProps.property.metadata"></a>

```typescript
public readonly metadata: ApiObjectMetadata;
```

- *Type:* [`cdk8s.ApiObjectMetadata`](#cdk8s.ApiObjectMetadata)

Metadata that all persisted resources must have, which includes all objects users must create.

---

##### `secrets`<sup>Optional</sup> <a name="cdk8s-plus-22.ServiceAccountProps.property.secrets"></a>

```typescript
public readonly secrets: ISecret[];
```

- *Type:* [`cdk8s-plus-22.ISecret`](#cdk8s-plus-22.ISecret)[]

List of secrets allowed to be used by pods running using this ServiceAccount.

> https://kubernetes.io/docs/concepts/configuration/secret

---

### ServiceAccountTokenSecretProps <a name="cdk8s-plus-22.ServiceAccountTokenSecretProps"></a>

Options for `ServiceAccountTokenSecret`.

#### Initializer <a name="[object Object].Initializer"></a>

```typescript
import { ServiceAccountTokenSecretProps } from 'cdk8s-plus-22'

const serviceAccountTokenSecretProps: ServiceAccountTokenSecretProps = { ... }
```

##### `metadata`<sup>Optional</sup> <a name="cdk8s-plus-22.ServiceAccountTokenSecretProps.property.metadata"></a>

```typescript
public readonly metadata: ApiObjectMetadata;
```

- *Type:* [`cdk8s.ApiObjectMetadata`](#cdk8s.ApiObjectMetadata)

Metadata that all persisted resources must have, which includes all objects users must create.

---

##### `serviceAccount`<sup>Required</sup> <a name="cdk8s-plus-22.ServiceAccountTokenSecretProps.property.serviceAccount"></a>

```typescript
public readonly serviceAccount: IServiceAccount;
```

- *Type:* [`cdk8s-plus-22.IServiceAccount`](#cdk8s-plus-22.IServiceAccount)

The service account to store a secret for.

---

### ServiceIngressBackendOptions <a name="cdk8s-plus-22.ServiceIngressBackendOptions"></a>

Options for setting up backends for ingress rules.

#### Initializer <a name="[object Object].Initializer"></a>

```typescript
import { ServiceIngressBackendOptions } from 'cdk8s-plus-22'

const serviceIngressBackendOptions: ServiceIngressBackendOptions = { ... }
```

##### `port`<sup>Optional</sup> <a name="cdk8s-plus-22.ServiceIngressBackendOptions.property.port"></a>

```typescript
public readonly port: number;
```

- *Type:* `number`
- *Default:* if the service exposes a single port, this port will be used.

The port to use to access the service.

This option will fail if the service does not expose any ports.
- If the service exposes multiple ports, this option must be specified.
- If the service exposes a single port, this option is optional and if
   specified, it must be the same port exposed by the service.

---

### ServicePort <a name="cdk8s-plus-22.ServicePort"></a>

Definition of a service port.

#### Initializer <a name="[object Object].Initializer"></a>

```typescript
import { ServicePort } from 'cdk8s-plus-22'

const servicePort: ServicePort = { ... }
```

##### `name`<sup>Optional</sup> <a name="cdk8s-plus-22.ServicePort.property.name"></a>

```typescript
public readonly name: string;
```

- *Type:* `string`

The name of this port within the service.

This must be a DNS_LABEL. All
ports within a ServiceSpec must have unique names. This maps to the 'Name'
field in EndpointPort objects. Optional if only one ServicePort is defined
on this service.

---

##### `nodePort`<sup>Optional</sup> <a name="cdk8s-plus-22.ServicePort.property.nodePort"></a>

```typescript
public readonly nodePort: number;
```

- *Type:* `number`
- *Default:* auto-allocate a port if the ServiceType of this Service requires one.

The port on each node on which this service is exposed when type=NodePort or LoadBalancer.

Usually assigned by the system. If specified, it will be
allocated to the service if unused or else creation of the service will
fail. Default is to auto-allocate a port if the ServiceType of this Service
requires one.

> https://kubernetes.io/docs/concepts/services-networking/service/#type-nodeport

---

##### `protocol`<sup>Optional</sup> <a name="cdk8s-plus-22.ServicePort.property.protocol"></a>

```typescript
public readonly protocol: Protocol;
```

- *Type:* [`cdk8s-plus-22.Protocol`](#cdk8s-plus-22.Protocol)
- *Default:* Protocol.TCP

The IP protocol for this port.

Supports "TCP", "UDP", and "SCTP". Default is TCP.

---

##### `targetPort`<sup>Optional</sup> <a name="cdk8s-plus-22.ServicePort.property.targetPort"></a>

```typescript
public readonly targetPort: number;
```

- *Type:* `number`
- *Default:* The value of `port` will be used.

The port number the service will redirect to.

---

##### `port`<sup>Required</sup> <a name="cdk8s-plus-22.ServicePort.property.port"></a>

```typescript
public readonly port: number;
```

- *Type:* `number`

The port number the service will bind to.

---

### ServicePortOptions <a name="cdk8s-plus-22.ServicePortOptions"></a>

#### Initializer <a name="[object Object].Initializer"></a>

```typescript
import { ServicePortOptions } from 'cdk8s-plus-22'

const servicePortOptions: ServicePortOptions = { ... }
```

##### `name`<sup>Optional</sup> <a name="cdk8s-plus-22.ServicePortOptions.property.name"></a>

```typescript
public readonly name: string;
```

- *Type:* `string`

The name of this port within the service.

This must be a DNS_LABEL. All
ports within a ServiceSpec must have unique names. This maps to the 'Name'
field in EndpointPort objects. Optional if only one ServicePort is defined
on this service.

---

##### `nodePort`<sup>Optional</sup> <a name="cdk8s-plus-22.ServicePortOptions.property.nodePort"></a>

```typescript
public readonly nodePort: number;
```

- *Type:* `number`
- *Default:* auto-allocate a port if the ServiceType of this Service requires one.

The port on each node on which this service is exposed when type=NodePort or LoadBalancer.

Usually assigned by the system. If specified, it will be
allocated to the service if unused or else creation of the service will
fail. Default is to auto-allocate a port if the ServiceType of this Service
requires one.

> https://kubernetes.io/docs/concepts/services-networking/service/#type-nodeport

---

##### `protocol`<sup>Optional</sup> <a name="cdk8s-plus-22.ServicePortOptions.property.protocol"></a>

```typescript
public readonly protocol: Protocol;
```

- *Type:* [`cdk8s-plus-22.Protocol`](#cdk8s-plus-22.Protocol)
- *Default:* Protocol.TCP

The IP protocol for this port.

Supports "TCP", "UDP", and "SCTP". Default is TCP.

---

##### `targetPort`<sup>Optional</sup> <a name="cdk8s-plus-22.ServicePortOptions.property.targetPort"></a>

```typescript
public readonly targetPort: number;
```

- *Type:* `number`
- *Default:* The value of `port` will be used.

The port number the service will redirect to.

---

### ServiceProps <a name="cdk8s-plus-22.ServiceProps"></a>

Properties for initialization of `Service`.

#### Initializer <a name="[object Object].Initializer"></a>

```typescript
import { ServiceProps } from 'cdk8s-plus-22'

const serviceProps: ServiceProps = { ... }
```

##### `metadata`<sup>Optional</sup> <a name="cdk8s-plus-22.ServiceProps.property.metadata"></a>

```typescript
public readonly metadata: ApiObjectMetadata;
```

- *Type:* [`cdk8s.ApiObjectMetadata`](#cdk8s.ApiObjectMetadata)

Metadata that all persisted resources must have, which includes all objects users must create.

---

##### `clusterIP`<sup>Optional</sup> <a name="cdk8s-plus-22.ServiceProps.property.clusterIP"></a>

```typescript
public readonly clusterIP: string;
```

- *Type:* `string`
- *Default:* Automatically assigned.

The IP address of the service and is usually assigned randomly by the master.

If an address is specified manually and is not in use by others, it
will be allocated to the service; otherwise, creation of the service will
fail. This field can not be changed through updates. Valid values are
"None", empty string (""), or a valid IP address. "None" can be specified
for headless services when proxying is not required. Only applies to types
ClusterIP, NodePort, and LoadBalancer. Ignored if type is ExternalName.

> https://kubernetes.io/docs/concepts/services-networking/service/#virtual-ips-and-service-proxies

---

##### `externalIPs`<sup>Optional</sup> <a name="cdk8s-plus-22.ServiceProps.property.externalIPs"></a>

```typescript
public readonly externalIPs: string[];
```

- *Type:* `string`[]
- *Default:* No external IPs.

A list of IP addresses for which nodes in the cluster will also accept traffic for this service.

These IPs are not managed by Kubernetes. The user
is responsible for ensuring that traffic arrives at a node with this IP. A
common example is external load-balancers that are not part of the
Kubernetes system.

---

##### `externalName`<sup>Optional</sup> <a name="cdk8s-plus-22.ServiceProps.property.externalName"></a>

```typescript
public readonly externalName: string;
```

- *Type:* `string`
- *Default:* No external name.

The externalName to be used when ServiceType.EXTERNAL_NAME is set.

---

##### `loadBalancerSourceRanges`<sup>Optional</sup> <a name="cdk8s-plus-22.ServiceProps.property.loadBalancerSourceRanges"></a>

```typescript
public readonly loadBalancerSourceRanges: string[];
```

- *Type:* `string`[]

A list of CIDR IP addresses, if specified and supported by the platform, will restrict traffic through the cloud-provider load-balancer to the specified client IPs.

More info: https://kubernetes.io/docs/tasks/access-application-cluster/configure-cloud-provider-firewall/

---

##### `ports`<sup>Optional</sup> <a name="cdk8s-plus-22.ServiceProps.property.ports"></a>

```typescript
public readonly ports: ServicePort[];
```

- *Type:* [`cdk8s-plus-22.ServicePort`](#cdk8s-plus-22.ServicePort)[]

The port exposed by this service.

More info: https://kubernetes.io/docs/concepts/services-networking/service/#virtual-ips-and-service-proxies

---

##### `type`<sup>Optional</sup> <a name="cdk8s-plus-22.ServiceProps.property.type"></a>

```typescript
public readonly type: ServiceType;
```

- *Type:* [`cdk8s-plus-22.ServiceType`](#cdk8s-plus-22.ServiceType)
- *Default:* ServiceType.ClusterIP

Determines how the Service is exposed.

More info: https://kubernetes.io/docs/concepts/services-networking/service/#publishing-services-service-types

---

### SshAuthSecretProps <a name="cdk8s-plus-22.SshAuthSecretProps"></a>

Options for `SshAuthSecret`.

#### Initializer <a name="[object Object].Initializer"></a>

```typescript
import { SshAuthSecretProps } from 'cdk8s-plus-22'

const sshAuthSecretProps: SshAuthSecretProps = { ... }
```

##### `metadata`<sup>Optional</sup> <a name="cdk8s-plus-22.SshAuthSecretProps.property.metadata"></a>

```typescript
public readonly metadata: ApiObjectMetadata;
```

- *Type:* [`cdk8s.ApiObjectMetadata`](#cdk8s.ApiObjectMetadata)

Metadata that all persisted resources must have, which includes all objects users must create.

---

##### `sshPrivateKey`<sup>Required</sup> <a name="cdk8s-plus-22.SshAuthSecretProps.property.sshPrivateKey"></a>

```typescript
public readonly sshPrivateKey: string;
```

- *Type:* `string`

The SSH private key to use.

---

### StatefulSetProps <a name="cdk8s-plus-22.StatefulSetProps"></a>

Properties for initialization of `StatefulSet`.

#### Initializer <a name="[object Object].Initializer"></a>

```typescript
import { StatefulSetProps } from 'cdk8s-plus-22'

const statefulSetProps: StatefulSetProps = { ... }
```

##### `metadata`<sup>Optional</sup> <a name="cdk8s-plus-22.StatefulSetProps.property.metadata"></a>

```typescript
public readonly metadata: ApiObjectMetadata;
```

- *Type:* [`cdk8s.ApiObjectMetadata`](#cdk8s.ApiObjectMetadata)

Metadata that all persisted resources must have, which includes all objects users must create.

---

##### `containers`<sup>Optional</sup> <a name="cdk8s-plus-22.StatefulSetProps.property.containers"></a>

```typescript
public readonly containers: ContainerProps[];
```

- *Type:* [`cdk8s-plus-22.ContainerProps`](#cdk8s-plus-22.ContainerProps)[]
- *Default:* No containers. Note that a pod spec must include at least one container.

List of containers belonging to the pod.

Containers cannot currently be
added or removed. There must be at least one container in a Pod.

You can add additionnal containers using `podSpec.addContainer()`

---

##### `hostAliases`<sup>Optional</sup> <a name="cdk8s-plus-22.StatefulSetProps.property.hostAliases"></a>

```typescript
public readonly hostAliases: HostAlias[];
```

- *Type:* [`cdk8s-plus-22.HostAlias`](#cdk8s-plus-22.HostAlias)[]

HostAlias holds the mapping between IP and hostnames that will be injected as an entry in the pod's hosts file.

---

##### `initContainers`<sup>Optional</sup> <a name="cdk8s-plus-22.StatefulSetProps.property.initContainers"></a>

```typescript
public readonly initContainers: ContainerProps[];
```

- *Type:* [`cdk8s-plus-22.ContainerProps`](#cdk8s-plus-22.ContainerProps)[]
- *Default:* No init containers.

List of initialization containers belonging to the pod.

Init containers are executed in order prior to containers being started.
If any init container fails, the pod is considered to have failed and is handled according to its restartPolicy.
The name for an init container or normal container must be unique among all containers.
Init containers may not have Lifecycle actions, Readiness probes, Liveness probes, or Startup probes.
The resourceRequirements of an init container are taken into account during scheduling by finding the highest request/limit
for each resource type, and then using the max of of that value or the sum of the normal containers.
Limits are applied to init containers in a similar fashion.

Init containers cannot currently be added ,removed or updated.

> https://kubernetes.io/docs/concepts/workloads/pods/init-containers/

---

##### `restartPolicy`<sup>Optional</sup> <a name="cdk8s-plus-22.StatefulSetProps.property.restartPolicy"></a>

```typescript
public readonly restartPolicy: RestartPolicy;
```

- *Type:* [`cdk8s-plus-22.RestartPolicy`](#cdk8s-plus-22.RestartPolicy)
- *Default:* RestartPolicy.ALWAYS

Restart policy for all containers within the pod.

> https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle/#restart-policy

---

##### `securityContext`<sup>Optional</sup> <a name="cdk8s-plus-22.StatefulSetProps.property.securityContext"></a>

```typescript
public readonly securityContext: PodSecurityContextProps;
```

- *Type:* [`cdk8s-plus-22.PodSecurityContextProps`](#cdk8s-plus-22.PodSecurityContextProps)
- *Default:* fsGroupChangePolicy: FsGroupChangePolicy.FsGroupChangePolicy.ALWAYS
  ensureNonRoot: false

SecurityContext holds pod-level security attributes and common container settings.

---

##### `serviceAccount`<sup>Optional</sup> <a name="cdk8s-plus-22.StatefulSetProps.property.serviceAccount"></a>

```typescript
public readonly serviceAccount: IServiceAccount;
```

- *Type:* [`cdk8s-plus-22.IServiceAccount`](#cdk8s-plus-22.IServiceAccount)
- *Default:* No service account.

A service account provides an identity for processes that run in a Pod.

When you (a human) access the cluster (for example, using kubectl), you are
authenticated by the apiserver as a particular User Account (currently this
is usually admin, unless your cluster administrator has customized your
cluster). Processes in containers inside pods can also contact the
apiserver. When they do, they are authenticated as a particular Service
Account (for example, default).

> https://kubernetes.io/docs/tasks/configure-pod-container/configure-service-account/

---

##### `volumes`<sup>Optional</sup> <a name="cdk8s-plus-22.StatefulSetProps.property.volumes"></a>

```typescript
public readonly volumes: Volume[];
```

- *Type:* [`cdk8s-plus-22.Volume`](#cdk8s-plus-22.Volume)[]
- *Default:* No volumes.

List of volumes that can be mounted by containers belonging to the pod.

You can also add volumes later using `podSpec.addVolume()`

> https://kubernetes.io/docs/concepts/storage/volumes

---

##### `podMetadata`<sup>Optional</sup> <a name="cdk8s-plus-22.StatefulSetProps.property.podMetadata"></a>

```typescript
public readonly podMetadata: ApiObjectMetadata;
```

- *Type:* [`cdk8s.ApiObjectMetadata`](#cdk8s.ApiObjectMetadata)

The pod metadata.

---

##### `service`<sup>Required</sup> <a name="cdk8s-plus-22.StatefulSetProps.property.service"></a>

```typescript
public readonly service: Service;
```

- *Type:* [`cdk8s-plus-22.Service`](#cdk8s-plus-22.Service)

Service to associate with the statefulset.

---

##### `defaultSelector`<sup>Optional</sup> <a name="cdk8s-plus-22.StatefulSetProps.property.defaultSelector"></a>

```typescript
public readonly defaultSelector: boolean;
```

- *Type:* `boolean`
- *Default:* true

Automatically allocates a pod selector for this statefulset.

If this is set to `false` you must define your selector through
`statefulset.podMetadata.addLabel()` and `statefulset.selectByLabel()`.

---

##### `podManagementPolicy`<sup>Optional</sup> <a name="cdk8s-plus-22.StatefulSetProps.property.podManagementPolicy"></a>

```typescript
public readonly podManagementPolicy: PodManagementPolicy;
```

- *Type:* [`cdk8s-plus-22.PodManagementPolicy`](#cdk8s-plus-22.PodManagementPolicy)
- *Default:* PodManagementPolicy.ORDERED_READY

Pod management policy to use for this statefulset.

---

##### `replicas`<sup>Optional</sup> <a name="cdk8s-plus-22.StatefulSetProps.property.replicas"></a>

```typescript
public readonly replicas: number;
```

- *Type:* `number`
- *Default:* 1

Number of desired pods.

---

### Sysctl <a name="cdk8s-plus-22.Sysctl"></a>

Sysctl defines a kernel parameter to be set.

#### Initializer <a name="[object Object].Initializer"></a>

```typescript
import { Sysctl } from 'cdk8s-plus-22'

const sysctl: Sysctl = { ... }
```

##### `name`<sup>Required</sup> <a name="cdk8s-plus-22.Sysctl.property.name"></a>

```typescript
public readonly name: string;
```

- *Type:* `string`

Name of a property to set.

---

##### `value`<sup>Required</sup> <a name="cdk8s-plus-22.Sysctl.property.value"></a>

```typescript
public readonly value: string;
```

- *Type:* `string`

Value of a property to set.

---

### TcpSocketProbeOptions <a name="cdk8s-plus-22.TcpSocketProbeOptions"></a>

Options for `Probe.fromTcpSocket()`.

#### Initializer <a name="[object Object].Initializer"></a>

```typescript
import { TcpSocketProbeOptions } from 'cdk8s-plus-22'

const tcpSocketProbeOptions: TcpSocketProbeOptions = { ... }
```

##### `failureThreshold`<sup>Optional</sup> <a name="cdk8s-plus-22.TcpSocketProbeOptions.property.failureThreshold"></a>

```typescript
public readonly failureThreshold: number;
```

- *Type:* `number`
- *Default:* 3

Minimum consecutive failures for the probe to be considered failed after having succeeded.

Defaults to 3. Minimum value is 1.

---

##### `initialDelaySeconds`<sup>Optional</sup> <a name="cdk8s-plus-22.TcpSocketProbeOptions.property.initialDelaySeconds"></a>

```typescript
public readonly initialDelaySeconds: Duration;
```

- *Type:* [`cdk8s.Duration`](#cdk8s.Duration)
- *Default:* immediate

Number of seconds after the container has started before liveness probes are initiated.

> https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle#container-probes

---

##### `periodSeconds`<sup>Optional</sup> <a name="cdk8s-plus-22.TcpSocketProbeOptions.property.periodSeconds"></a>

```typescript
public readonly periodSeconds: Duration;
```

- *Type:* [`cdk8s.Duration`](#cdk8s.Duration)
- *Default:* Duration.seconds(10) Minimum value is 1.

How often (in seconds) to perform the probe.

Default to 10 seconds. Minimum value is 1.

---

##### `successThreshold`<sup>Optional</sup> <a name="cdk8s-plus-22.TcpSocketProbeOptions.property.successThreshold"></a>

```typescript
public readonly successThreshold: number;
```

- *Type:* `number`
- *Default:* 1 Must be 1 for liveness and startup. Minimum value is 1.

Minimum consecutive successes for the probe to be considered successful after having failed. Defaults to 1.

Must be 1 for liveness and startup. Minimum value is 1.

---

##### `timeoutSeconds`<sup>Optional</sup> <a name="cdk8s-plus-22.TcpSocketProbeOptions.property.timeoutSeconds"></a>

```typescript
public readonly timeoutSeconds: Duration;
```

- *Type:* [`cdk8s.Duration`](#cdk8s.Duration)
- *Default:* Duration.seconds(1)

Number of seconds after which the probe times out.

Defaults to 1 second. Minimum value is 1.

> https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle#container-probes

---

##### `host`<sup>Optional</sup> <a name="cdk8s-plus-22.TcpSocketProbeOptions.property.host"></a>

```typescript
public readonly host: string;
```

- *Type:* `string`
- *Default:* defaults to the pod IP

The host name to connect to on the container.

---

##### `port`<sup>Optional</sup> <a name="cdk8s-plus-22.TcpSocketProbeOptions.property.port"></a>

```typescript
public readonly port: number;
```

- *Type:* `number`
- *Default:* defaults to `container.port`.

The TCP port to connect to on the container.

---

### TlsSecretProps <a name="cdk8s-plus-22.TlsSecretProps"></a>

Options for `TlsSecret`.

#### Initializer <a name="[object Object].Initializer"></a>

```typescript
import { TlsSecretProps } from 'cdk8s-plus-22'

const tlsSecretProps: TlsSecretProps = { ... }
```

##### `metadata`<sup>Optional</sup> <a name="cdk8s-plus-22.TlsSecretProps.property.metadata"></a>

```typescript
public readonly metadata: ApiObjectMetadata;
```

- *Type:* [`cdk8s.ApiObjectMetadata`](#cdk8s.ApiObjectMetadata)

Metadata that all persisted resources must have, which includes all objects users must create.

---

##### `tlsCert`<sup>Required</sup> <a name="cdk8s-plus-22.TlsSecretProps.property.tlsCert"></a>

```typescript
public readonly tlsCert: string;
```

- *Type:* `string`

The TLS cert.

---

##### `tlsKey`<sup>Required</sup> <a name="cdk8s-plus-22.TlsSecretProps.property.tlsKey"></a>

```typescript
public readonly tlsKey: string;
```

- *Type:* `string`

The TLS key.

---

### VolumeMount <a name="cdk8s-plus-22.VolumeMount"></a>

Mount a volume from the pod to the container.

#### Initializer <a name="[object Object].Initializer"></a>

```typescript
import { VolumeMount } from 'cdk8s-plus-22'

const volumeMount: VolumeMount = { ... }
```

##### `propagation`<sup>Optional</sup> <a name="cdk8s-plus-22.VolumeMount.property.propagation"></a>

```typescript
public readonly propagation: MountPropagation;
```

- *Type:* [`cdk8s-plus-22.MountPropagation`](#cdk8s-plus-22.MountPropagation)
- *Default:* MountPropagation.NONE

Determines how mounts are propagated from the host to container and the other way around.

When not set, MountPropagationNone is used.

Mount propagation allows for sharing volumes mounted by a Container to
other Containers in the same Pod, or even to other Pods on the same node.

---

##### `readOnly`<sup>Optional</sup> <a name="cdk8s-plus-22.VolumeMount.property.readOnly"></a>

```typescript
public readonly readOnly: boolean;
```

- *Type:* `boolean`
- *Default:* false

Mounted read-only if true, read-write otherwise (false or unspecified).

Defaults to false.

---

##### `subPath`<sup>Optional</sup> <a name="cdk8s-plus-22.VolumeMount.property.subPath"></a>

```typescript
public readonly subPath: string;
```

- *Type:* `string`
- *Default:* "" the volume's root

Path within the volume from which the container's volume should be mounted.).

---

##### `subPathExpr`<sup>Optional</sup> <a name="cdk8s-plus-22.VolumeMount.property.subPathExpr"></a>

```typescript
public readonly subPathExpr: string;
```

- *Type:* `string`
- *Default:* "" volume's root.

Expanded path within the volume from which the container's volume should be mounted.

Behaves similarly to SubPath but environment variable references
$(VAR_NAME) are expanded using the container's environment. Defaults to ""
(volume's root).

`subPathExpr` and `subPath` are mutually exclusive.

---

##### `path`<sup>Required</sup> <a name="cdk8s-plus-22.VolumeMount.property.path"></a>

```typescript
public readonly path: string;
```

- *Type:* `string`

Path within the container at which the volume should be mounted.

Must not
contain ':'.

---

##### `volume`<sup>Required</sup> <a name="cdk8s-plus-22.VolumeMount.property.volume"></a>

```typescript
public readonly volume: Volume;
```

- *Type:* [`cdk8s-plus-22.Volume`](#cdk8s-plus-22.Volume)

The volume to mount.

---

## Classes <a name="Classes"></a>

### Container <a name="cdk8s-plus-22.Container"></a>

A single application container that you want to run within a pod.

#### Initializers <a name="cdk8s-plus-22.Container.Initializer"></a>

```typescript
import { Container } from 'cdk8s-plus-22'

new Container(props: ContainerProps)
```

##### `props`<sup>Required</sup> <a name="cdk8s-plus-22.Container.parameter.props"></a>

- *Type:* [`cdk8s-plus-22.ContainerProps`](#cdk8s-plus-22.ContainerProps)

---

#### Methods <a name="Methods"></a>

##### `addEnv` <a name="cdk8s-plus-22.Container.addEnv"></a>

```typescript
public addEnv(name: string, value: EnvValue)
```

###### `name`<sup>Required</sup> <a name="cdk8s-plus-22.Container.parameter.name"></a>

- *Type:* `string`

The variable name.

---

###### `value`<sup>Required</sup> <a name="cdk8s-plus-22.Container.parameter.value"></a>

- *Type:* [`cdk8s-plus-22.EnvValue`](#cdk8s-plus-22.EnvValue)

The variable value.

---

##### `mount` <a name="cdk8s-plus-22.Container.mount"></a>

```typescript
public mount(path: string, volume: Volume, options?: MountOptions)
```

###### `path`<sup>Required</sup> <a name="cdk8s-plus-22.Container.parameter.path"></a>

- *Type:* `string`

The desired path in the container.

---

###### `volume`<sup>Required</sup> <a name="cdk8s-plus-22.Container.parameter.volume"></a>

- *Type:* [`cdk8s-plus-22.Volume`](#cdk8s-plus-22.Volume)

The volume to mount.

---

###### `options`<sup>Optional</sup> <a name="cdk8s-plus-22.Container.parameter.options"></a>

- *Type:* [`cdk8s-plus-22.MountOptions`](#cdk8s-plus-22.MountOptions)

---


#### Properties <a name="Properties"></a>

##### `env`<sup>Required</sup> <a name="cdk8s-plus-22.Container.property.env"></a>

```typescript
public readonly env: {[ key: string ]: EnvValue};
```

- *Type:* {[ key: string ]: [`cdk8s-plus-22.EnvValue`](#cdk8s-plus-22.EnvValue)}

The environment variables for this container.

Returns a copy. To add environment variables use `addEnv()`.

---

##### `image`<sup>Required</sup> <a name="cdk8s-plus-22.Container.property.image"></a>

```typescript
public readonly image: string;
```

- *Type:* `string`

The container image.

---

##### `imagePullPolicy`<sup>Required</sup> <a name="cdk8s-plus-22.Container.property.imagePullPolicy"></a>

```typescript
public readonly imagePullPolicy: ImagePullPolicy;
```

- *Type:* [`cdk8s-plus-22.ImagePullPolicy`](#cdk8s-plus-22.ImagePullPolicy)

Image pull policy for this container.

---

##### `mounts`<sup>Required</sup> <a name="cdk8s-plus-22.Container.property.mounts"></a>

```typescript
public readonly mounts: VolumeMount[];
```

- *Type:* [`cdk8s-plus-22.VolumeMount`](#cdk8s-plus-22.VolumeMount)[]

Volume mounts configured for this container.

---

##### `name`<sup>Required</sup> <a name="cdk8s-plus-22.Container.property.name"></a>

```typescript
public readonly name: string;
```

- *Type:* `string`

The name of the container.

---

##### `securityContext`<sup>Required</sup> <a name="cdk8s-plus-22.Container.property.securityContext"></a>

```typescript
public readonly securityContext: ContainerSecurityContext;
```

- *Type:* [`cdk8s-plus-22.ContainerSecurityContext`](#cdk8s-plus-22.ContainerSecurityContext)

The security context of the container.

---

##### `args`<sup>Optional</sup> <a name="cdk8s-plus-22.Container.property.args"></a>

```typescript
public readonly args: string[];
```

- *Type:* `string`[]

Arguments to the entrypoint.

---

##### `command`<sup>Optional</sup> <a name="cdk8s-plus-22.Container.property.command"></a>

```typescript
public readonly command: string[];
```

- *Type:* `string`[]

Entrypoint array (the command to execute when the container starts).

---

##### `port`<sup>Optional</sup> <a name="cdk8s-plus-22.Container.property.port"></a>

```typescript
public readonly port: number;
```

- *Type:* `number`

The port this container exposes.

---

##### `resources`<sup>Optional</sup> <a name="cdk8s-plus-22.Container.property.resources"></a>

```typescript
public readonly resources: Resources;
```

- *Type:* [`cdk8s-plus-22.Resources`](#cdk8s-plus-22.Resources)

Compute resources (CPU and memory requests and limits) required by the container.

> https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/

---

##### `workingDir`<sup>Optional</sup> <a name="cdk8s-plus-22.Container.property.workingDir"></a>

```typescript
public readonly workingDir: string;
```

- *Type:* `string`

The working directory inside the container.

---


### ContainerSecurityContext <a name="cdk8s-plus-22.ContainerSecurityContext"></a>

Container security attributes and settings.

#### Initializers <a name="cdk8s-plus-22.ContainerSecurityContext.Initializer"></a>

```typescript
import { ContainerSecurityContext } from 'cdk8s-plus-22'

new ContainerSecurityContext(props?: ContainerSecurityContextProps)
```

##### `props`<sup>Optional</sup> <a name="cdk8s-plus-22.ContainerSecurityContext.parameter.props"></a>

- *Type:* [`cdk8s-plus-22.ContainerSecurityContextProps`](#cdk8s-plus-22.ContainerSecurityContextProps)

---



#### Properties <a name="Properties"></a>

##### `ensureNonRoot`<sup>Required</sup> <a name="cdk8s-plus-22.ContainerSecurityContext.property.ensureNonRoot"></a>

```typescript
public readonly ensureNonRoot: boolean;
```

- *Type:* `boolean`

---

##### `privileged`<sup>Required</sup> <a name="cdk8s-plus-22.ContainerSecurityContext.property.privileged"></a>

```typescript
public readonly privileged: boolean;
```

- *Type:* `boolean`

---

##### `readOnlyRootFilesystem`<sup>Required</sup> <a name="cdk8s-plus-22.ContainerSecurityContext.property.readOnlyRootFilesystem"></a>

```typescript
public readonly readOnlyRootFilesystem: boolean;
```

- *Type:* `boolean`

---

##### `group`<sup>Optional</sup> <a name="cdk8s-plus-22.ContainerSecurityContext.property.group"></a>

```typescript
public readonly group: number;
```

- *Type:* `number`

---

##### `user`<sup>Optional</sup> <a name="cdk8s-plus-22.ContainerSecurityContext.property.user"></a>

```typescript
public readonly user: number;
```

- *Type:* `number`

---


### Cpu <a name="cdk8s-plus-22.Cpu"></a>

Represents the amount of CPU.

The amount can be passed as millis or units.


#### Static Functions <a name="Static Functions"></a>

##### `millis` <a name="cdk8s-plus-22.Cpu.millis"></a>

```typescript
import { Cpu } from 'cdk8s-plus-22'

Cpu.millis(amount: number)
```

###### `amount`<sup>Required</sup> <a name="cdk8s-plus-22.Cpu.parameter.amount"></a>

- *Type:* `number`

---

##### `units` <a name="cdk8s-plus-22.Cpu.units"></a>

```typescript
import { Cpu } from 'cdk8s-plus-22'

Cpu.units(amount: number)
```

###### `amount`<sup>Required</sup> <a name="cdk8s-plus-22.Cpu.parameter.amount"></a>

- *Type:* `number`

---

#### Properties <a name="Properties"></a>

##### `amount`<sup>Required</sup> <a name="cdk8s-plus-22.Cpu.property.amount"></a>

```typescript
public readonly amount: string;
```

- *Type:* `string`

---


### EnvValue <a name="cdk8s-plus-22.EnvValue"></a>

Utility class for creating reading env values from various sources.


#### Static Functions <a name="Static Functions"></a>

##### `fromConfigMap` <a name="cdk8s-plus-22.EnvValue.fromConfigMap"></a>

```typescript
import { EnvValue } from 'cdk8s-plus-22'

EnvValue.fromConfigMap(configMap: IConfigMap, key: string, options?: EnvValueFromConfigMapOptions)
```

###### `configMap`<sup>Required</sup> <a name="cdk8s-plus-22.EnvValue.parameter.configMap"></a>

- *Type:* [`cdk8s-plus-22.IConfigMap`](#cdk8s-plus-22.IConfigMap)

The config map.

---

###### `key`<sup>Required</sup> <a name="cdk8s-plus-22.EnvValue.parameter.key"></a>

- *Type:* `string`

The key to extract the value from.

---

###### `options`<sup>Optional</sup> <a name="cdk8s-plus-22.EnvValue.parameter.options"></a>

- *Type:* [`cdk8s-plus-22.EnvValueFromConfigMapOptions`](#cdk8s-plus-22.EnvValueFromConfigMapOptions)

Additional options.

---

##### `fromFieldRef` <a name="cdk8s-plus-22.EnvValue.fromFieldRef"></a>

```typescript
import { EnvValue } from 'cdk8s-plus-22'

EnvValue.fromFieldRef(fieldPath: EnvFieldPaths, options?: EnvValueFromFieldRefOptions)
```

###### `fieldPath`<sup>Required</sup> <a name="cdk8s-plus-22.EnvValue.parameter.fieldPath"></a>

- *Type:* [`cdk8s-plus-22.EnvFieldPaths`](#cdk8s-plus-22.EnvFieldPaths)

: The field reference.

---

###### `options`<sup>Optional</sup> <a name="cdk8s-plus-22.EnvValue.parameter.options"></a>

- *Type:* [`cdk8s-plus-22.EnvValueFromFieldRefOptions`](#cdk8s-plus-22.EnvValueFromFieldRefOptions)

: Additional options.

---

##### `fromProcess` <a name="cdk8s-plus-22.EnvValue.fromProcess"></a>

```typescript
import { EnvValue } from 'cdk8s-plus-22'

EnvValue.fromProcess(key: string, options?: EnvValueFromProcessOptions)
```

###### `key`<sup>Required</sup> <a name="cdk8s-plus-22.EnvValue.parameter.key"></a>

- *Type:* `string`

The key to read.

---

###### `options`<sup>Optional</sup> <a name="cdk8s-plus-22.EnvValue.parameter.options"></a>

- *Type:* [`cdk8s-plus-22.EnvValueFromProcessOptions`](#cdk8s-plus-22.EnvValueFromProcessOptions)

Additional options.

---

##### `fromResource` <a name="cdk8s-plus-22.EnvValue.fromResource"></a>

```typescript
import { EnvValue } from 'cdk8s-plus-22'

EnvValue.fromResource(resource: ResourceFieldPaths, options?: EnvValueFromResourceOptions)
```

###### `resource`<sup>Required</sup> <a name="cdk8s-plus-22.EnvValue.parameter.resource"></a>

- *Type:* [`cdk8s-plus-22.ResourceFieldPaths`](#cdk8s-plus-22.ResourceFieldPaths)

: Resource to select the value from.

---

###### `options`<sup>Optional</sup> <a name="cdk8s-plus-22.EnvValue.parameter.options"></a>

- *Type:* [`cdk8s-plus-22.EnvValueFromResourceOptions`](#cdk8s-plus-22.EnvValueFromResourceOptions)

: Additional options.

---

##### `fromSecretValue` <a name="cdk8s-plus-22.EnvValue.fromSecretValue"></a>

```typescript
import { EnvValue } from 'cdk8s-plus-22'

EnvValue.fromSecretValue(secretValue: SecretValue, options?: EnvValueFromSecretOptions)
```

###### `secretValue`<sup>Required</sup> <a name="cdk8s-plus-22.EnvValue.parameter.secretValue"></a>

- *Type:* [`cdk8s-plus-22.SecretValue`](#cdk8s-plus-22.SecretValue)

The secret value (secrent + key).

---

###### `options`<sup>Optional</sup> <a name="cdk8s-plus-22.EnvValue.parameter.options"></a>

- *Type:* [`cdk8s-plus-22.EnvValueFromSecretOptions`](#cdk8s-plus-22.EnvValueFromSecretOptions)

Additional options.

---

##### `fromValue` <a name="cdk8s-plus-22.EnvValue.fromValue"></a>

```typescript
import { EnvValue } from 'cdk8s-plus-22'

EnvValue.fromValue(value: string)
```

###### `value`<sup>Required</sup> <a name="cdk8s-plus-22.EnvValue.parameter.value"></a>

- *Type:* `string`

The value.

---

#### Properties <a name="Properties"></a>

##### `value`<sup>Optional</sup> <a name="cdk8s-plus-22.EnvValue.property.value"></a>

```typescript
public readonly value: any;
```

- *Type:* `any`

---

##### `valueFrom`<sup>Optional</sup> <a name="cdk8s-plus-22.EnvValue.property.valueFrom"></a>

```typescript
public readonly valueFrom: any;
```

- *Type:* `any`

---


### Handler <a name="cdk8s-plus-22.Handler"></a>

Defines a specific action that should be taken.


#### Static Functions <a name="Static Functions"></a>

##### `fromCommand` <a name="cdk8s-plus-22.Handler.fromCommand"></a>

```typescript
import { Handler } from 'cdk8s-plus-22'

Handler.fromCommand(command: string[])
```

###### `command`<sup>Required</sup> <a name="cdk8s-plus-22.Handler.parameter.command"></a>

- *Type:* `string`[]

The command to execute.

---

##### `fromHttpGet` <a name="cdk8s-plus-22.Handler.fromHttpGet"></a>

```typescript
import { Handler } from 'cdk8s-plus-22'

Handler.fromHttpGet(path: string, options?: HandlerFromHttpGetOptions)
```

###### `path`<sup>Required</sup> <a name="cdk8s-plus-22.Handler.parameter.path"></a>

- *Type:* `string`

The URL path to hit.

---

###### `options`<sup>Optional</sup> <a name="cdk8s-plus-22.Handler.parameter.options"></a>

- *Type:* [`cdk8s-plus-22.HandlerFromHttpGetOptions`](#cdk8s-plus-22.HandlerFromHttpGetOptions)

Options.

---

##### `fromTcpSocket` <a name="cdk8s-plus-22.Handler.fromTcpSocket"></a>

```typescript
import { Handler } from 'cdk8s-plus-22'

Handler.fromTcpSocket(options?: HandlerFromTcpSocketOptions)
```

###### `options`<sup>Optional</sup> <a name="cdk8s-plus-22.Handler.parameter.options"></a>

- *Type:* [`cdk8s-plus-22.HandlerFromTcpSocketOptions`](#cdk8s-plus-22.HandlerFromTcpSocketOptions)

Options.

---



### IngressBackend <a name="cdk8s-plus-22.IngressBackend"></a>

The backend for an ingress path.


#### Static Functions <a name="Static Functions"></a>

##### `fromService` <a name="cdk8s-plus-22.IngressBackend.fromService"></a>

```typescript
import { IngressBackend } from 'cdk8s-plus-22'

IngressBackend.fromService(service: Service, options?: ServiceIngressBackendOptions)
```

###### `service`<sup>Required</sup> <a name="cdk8s-plus-22.IngressBackend.parameter.service"></a>

- *Type:* [`cdk8s-plus-22.Service`](#cdk8s-plus-22.Service)

The service object.

---

###### `options`<sup>Optional</sup> <a name="cdk8s-plus-22.IngressBackend.parameter.options"></a>

- *Type:* [`cdk8s-plus-22.ServiceIngressBackendOptions`](#cdk8s-plus-22.ServiceIngressBackendOptions)

---



### PodSecurityContext <a name="cdk8s-plus-22.PodSecurityContext"></a>

Holds pod-level security attributes and common container settings.

#### Initializers <a name="cdk8s-plus-22.PodSecurityContext.Initializer"></a>

```typescript
import { PodSecurityContext } from 'cdk8s-plus-22'

new PodSecurityContext(props?: PodSecurityContextProps)
```

##### `props`<sup>Optional</sup> <a name="cdk8s-plus-22.PodSecurityContext.parameter.props"></a>

- *Type:* [`cdk8s-plus-22.PodSecurityContextProps`](#cdk8s-plus-22.PodSecurityContextProps)

---



#### Properties <a name="Properties"></a>

##### `ensureNonRoot`<sup>Required</sup> <a name="cdk8s-plus-22.PodSecurityContext.property.ensureNonRoot"></a>

```typescript
public readonly ensureNonRoot: boolean;
```

- *Type:* `boolean`

---

##### `fsGroupChangePolicy`<sup>Required</sup> <a name="cdk8s-plus-22.PodSecurityContext.property.fsGroupChangePolicy"></a>

```typescript
public readonly fsGroupChangePolicy: FsGroupChangePolicy;
```

- *Type:* [`cdk8s-plus-22.FsGroupChangePolicy`](#cdk8s-plus-22.FsGroupChangePolicy)

---

##### `sysctls`<sup>Required</sup> <a name="cdk8s-plus-22.PodSecurityContext.property.sysctls"></a>

```typescript
public readonly sysctls: Sysctl[];
```

- *Type:* [`cdk8s-plus-22.Sysctl`](#cdk8s-plus-22.Sysctl)[]

---

##### `fsGroup`<sup>Optional</sup> <a name="cdk8s-plus-22.PodSecurityContext.property.fsGroup"></a>

```typescript
public readonly fsGroup: number;
```

- *Type:* `number`

---

##### `group`<sup>Optional</sup> <a name="cdk8s-plus-22.PodSecurityContext.property.group"></a>

```typescript
public readonly group: number;
```

- *Type:* `number`

---

##### `user`<sup>Optional</sup> <a name="cdk8s-plus-22.PodSecurityContext.property.user"></a>

```typescript
public readonly user: number;
```

- *Type:* `number`

---


### PodSpec <a name="cdk8s-plus-22.PodSpec"></a>

- *Implements:* [`cdk8s-plus-22.IPodSpec`](#cdk8s-plus-22.IPodSpec)

Provides read/write capabilities ontop of a `PodSpecProps`.

#### Initializers <a name="cdk8s-plus-22.PodSpec.Initializer"></a>

```typescript
import { PodSpec } from 'cdk8s-plus-22'

new PodSpec(props?: PodSpecProps)
```

##### `props`<sup>Optional</sup> <a name="cdk8s-plus-22.PodSpec.parameter.props"></a>

- *Type:* [`cdk8s-plus-22.PodSpecProps`](#cdk8s-plus-22.PodSpecProps)

---

#### Methods <a name="Methods"></a>

##### `addContainer` <a name="cdk8s-plus-22.PodSpec.addContainer"></a>

```typescript
public addContainer(container: ContainerProps)
```

###### `container`<sup>Required</sup> <a name="cdk8s-plus-22.PodSpec.parameter.container"></a>

- *Type:* [`cdk8s-plus-22.ContainerProps`](#cdk8s-plus-22.ContainerProps)

---

##### `addHostAlias` <a name="cdk8s-plus-22.PodSpec.addHostAlias"></a>

```typescript
public addHostAlias(hostAlias: HostAlias)
```

###### `hostAlias`<sup>Required</sup> <a name="cdk8s-plus-22.PodSpec.parameter.hostAlias"></a>

- *Type:* [`cdk8s-plus-22.HostAlias`](#cdk8s-plus-22.HostAlias)

---

##### `addInitContainer` <a name="cdk8s-plus-22.PodSpec.addInitContainer"></a>

```typescript
public addInitContainer(container: ContainerProps)
```

###### `container`<sup>Required</sup> <a name="cdk8s-plus-22.PodSpec.parameter.container"></a>

- *Type:* [`cdk8s-plus-22.ContainerProps`](#cdk8s-plus-22.ContainerProps)

---

##### `addVolume` <a name="cdk8s-plus-22.PodSpec.addVolume"></a>

```typescript
public addVolume(volume: Volume)
```

###### `volume`<sup>Required</sup> <a name="cdk8s-plus-22.PodSpec.parameter.volume"></a>

- *Type:* [`cdk8s-plus-22.Volume`](#cdk8s-plus-22.Volume)

---


#### Properties <a name="Properties"></a>

##### `containers`<sup>Required</sup> <a name="cdk8s-plus-22.PodSpec.property.containers"></a>

```typescript
public readonly containers: Container[];
```

- *Type:* [`cdk8s-plus-22.Container`](#cdk8s-plus-22.Container)[]

The containers belonging to the pod.

Use `addContainer` to add containers.

---

##### `hostAliases`<sup>Required</sup> <a name="cdk8s-plus-22.PodSpec.property.hostAliases"></a>

```typescript
public readonly hostAliases: HostAlias[];
```

- *Type:* [`cdk8s-plus-22.HostAlias`](#cdk8s-plus-22.HostAlias)[]

An optional list of hosts and IPs that will be injected into the pod's hosts file if specified.

This is only valid for non-hostNetwork pods.

---

##### `initContainers`<sup>Required</sup> <a name="cdk8s-plus-22.PodSpec.property.initContainers"></a>

```typescript
public readonly initContainers: Container[];
```

- *Type:* [`cdk8s-plus-22.Container`](#cdk8s-plus-22.Container)[]

The init containers belonging to the pod.

Use `addInitContainer` to add init containers.

---

##### `securityContext`<sup>Required</sup> <a name="cdk8s-plus-22.PodSpec.property.securityContext"></a>

```typescript
public readonly securityContext: PodSecurityContext;
```

- *Type:* [`cdk8s-plus-22.PodSecurityContext`](#cdk8s-plus-22.PodSecurityContext)

---

##### `volumes`<sup>Required</sup> <a name="cdk8s-plus-22.PodSpec.property.volumes"></a>

```typescript
public readonly volumes: Volume[];
```

- *Type:* [`cdk8s-plus-22.Volume`](#cdk8s-plus-22.Volume)[]

The volumes associated with this pod.

Use `addVolume` to add volumes.

---

##### `restartPolicy`<sup>Optional</sup> <a name="cdk8s-plus-22.PodSpec.property.restartPolicy"></a>

```typescript
public readonly restartPolicy: RestartPolicy;
```

- *Type:* [`cdk8s-plus-22.RestartPolicy`](#cdk8s-plus-22.RestartPolicy)

Restart policy for all containers within the pod.

---

##### `serviceAccount`<sup>Optional</sup> <a name="cdk8s-plus-22.PodSpec.property.serviceAccount"></a>

```typescript
public readonly serviceAccount: IServiceAccount;
```

- *Type:* [`cdk8s-plus-22.IServiceAccount`](#cdk8s-plus-22.IServiceAccount)

The service account used to run this pod.

---


### PodTemplate <a name="cdk8s-plus-22.PodTemplate"></a>

- *Implements:* [`cdk8s-plus-22.IPodTemplate`](#cdk8s-plus-22.IPodTemplate)

Provides read/write capabilities ontop of a `PodTemplateProps`.

#### Initializers <a name="cdk8s-plus-22.PodTemplate.Initializer"></a>

```typescript
import { PodTemplate } from 'cdk8s-plus-22'

new PodTemplate(props?: PodTemplateProps)
```

##### `props`<sup>Optional</sup> <a name="cdk8s-plus-22.PodTemplate.parameter.props"></a>

- *Type:* [`cdk8s-plus-22.PodTemplateProps`](#cdk8s-plus-22.PodTemplateProps)

---



#### Properties <a name="Properties"></a>

##### `podMetadata`<sup>Required</sup> <a name="cdk8s-plus-22.PodTemplate.property.podMetadata"></a>

```typescript
public readonly podMetadata: ApiObjectMetadataDefinition;
```

- *Type:* [`cdk8s.ApiObjectMetadataDefinition`](#cdk8s.ApiObjectMetadataDefinition)

Provides read/write access to the underlying pod metadata of the resource.

---


### Probe <a name="cdk8s-plus-22.Probe"></a>

Probe describes a health check to be performed against a container to determine whether it is alive or ready to receive traffic.


#### Static Functions <a name="Static Functions"></a>

##### `fromCommand` <a name="cdk8s-plus-22.Probe.fromCommand"></a>

```typescript
import { Probe } from 'cdk8s-plus-22'

Probe.fromCommand(command: string[], options?: CommandProbeOptions)
```

###### `command`<sup>Required</sup> <a name="cdk8s-plus-22.Probe.parameter.command"></a>

- *Type:* `string`[]

The command to execute.

---

###### `options`<sup>Optional</sup> <a name="cdk8s-plus-22.Probe.parameter.options"></a>

- *Type:* [`cdk8s-plus-22.CommandProbeOptions`](#cdk8s-plus-22.CommandProbeOptions)

Options.

---

##### `fromHttpGet` <a name="cdk8s-plus-22.Probe.fromHttpGet"></a>

```typescript
import { Probe } from 'cdk8s-plus-22'

Probe.fromHttpGet(path: string, options?: HttpGetProbeOptions)
```

###### `path`<sup>Required</sup> <a name="cdk8s-plus-22.Probe.parameter.path"></a>

- *Type:* `string`

The URL path to hit.

---

###### `options`<sup>Optional</sup> <a name="cdk8s-plus-22.Probe.parameter.options"></a>

- *Type:* [`cdk8s-plus-22.HttpGetProbeOptions`](#cdk8s-plus-22.HttpGetProbeOptions)

Options.

---

##### `fromTcpSocket` <a name="cdk8s-plus-22.Probe.fromTcpSocket"></a>

```typescript
import { Probe } from 'cdk8s-plus-22'

Probe.fromTcpSocket(options?: TcpSocketProbeOptions)
```

###### `options`<sup>Optional</sup> <a name="cdk8s-plus-22.Probe.parameter.options"></a>

- *Type:* [`cdk8s-plus-22.TcpSocketProbeOptions`](#cdk8s-plus-22.TcpSocketProbeOptions)

Options.

---



### Volume <a name="cdk8s-plus-22.Volume"></a>

Volume represents a named volume in a pod that may be accessed by any container in the pod.

Docker also has a concept of volumes, though it is somewhat looser and less
managed. In Docker, a volume is simply a directory on disk or in another
Container. Lifetimes are not managed and until very recently there were only
local-disk-backed volumes. Docker now provides volume drivers, but the
functionality is very limited for now (e.g. as of Docker 1.7 only one volume
driver is allowed per Container and there is no way to pass parameters to
volumes).

A Kubernetes volume, on the other hand, has an explicit lifetime - the same
as the Pod that encloses it. Consequently, a volume outlives any Containers
that run within the Pod, and data is preserved across Container restarts. Of
course, when a Pod ceases to exist, the volume will cease to exist, too.
Perhaps more importantly than this, Kubernetes supports many types of
volumes, and a Pod can use any number of them simultaneously.

At its core, a volume is just a directory, possibly with some data in it,
which is accessible to the Containers in a Pod. How that directory comes to
be, the medium that backs it, and the contents of it are determined by the
particular volume type used.

To use a volume, a Pod specifies what volumes to provide for the Pod (the
.spec.volumes field) and where to mount those into Containers (the
.spec.containers[*].volumeMounts field).

A process in a container sees a filesystem view composed from their Docker
image and volumes. The Docker image is at the root of the filesystem
hierarchy, and any volumes are mounted at the specified paths within the
image. Volumes can not mount onto other volumes


#### Static Functions <a name="Static Functions"></a>

##### `fromConfigMap` <a name="cdk8s-plus-22.Volume.fromConfigMap"></a>

```typescript
import { Volume } from 'cdk8s-plus-22'

Volume.fromConfigMap(configMap: IConfigMap, options?: ConfigMapVolumeOptions)
```

###### `configMap`<sup>Required</sup> <a name="cdk8s-plus-22.Volume.parameter.configMap"></a>

- *Type:* [`cdk8s-plus-22.IConfigMap`](#cdk8s-plus-22.IConfigMap)

The config map to use to populate the volume.

---

###### `options`<sup>Optional</sup> <a name="cdk8s-plus-22.Volume.parameter.options"></a>

- *Type:* [`cdk8s-plus-22.ConfigMapVolumeOptions`](#cdk8s-plus-22.ConfigMapVolumeOptions)

Options.

---

##### `fromEmptyDir` <a name="cdk8s-plus-22.Volume.fromEmptyDir"></a>

```typescript
import { Volume } from 'cdk8s-plus-22'

Volume.fromEmptyDir(name: string, options?: EmptyDirVolumeOptions)
```

###### `name`<sup>Required</sup> <a name="cdk8s-plus-22.Volume.parameter.name"></a>

- *Type:* `string`

---

###### `options`<sup>Optional</sup> <a name="cdk8s-plus-22.Volume.parameter.options"></a>

- *Type:* [`cdk8s-plus-22.EmptyDirVolumeOptions`](#cdk8s-plus-22.EmptyDirVolumeOptions)

Additional options.

---

##### `fromPersistentVolume` <a name="cdk8s-plus-22.Volume.fromPersistentVolume"></a>

```typescript
import { Volume } from 'cdk8s-plus-22'

Volume.fromPersistentVolume(pv: PersistentVolume, options?: PersistentVolumeClaimVolumeOptions)
```

###### `pv`<sup>Required</sup> <a name="cdk8s-plus-22.Volume.parameter.pv"></a>

- *Type:* [`cdk8s-plus-22.PersistentVolume`](#cdk8s-plus-22.PersistentVolume)

---

###### `options`<sup>Optional</sup> <a name="cdk8s-plus-22.Volume.parameter.options"></a>

- *Type:* [`cdk8s-plus-22.PersistentVolumeClaimVolumeOptions`](#cdk8s-plus-22.PersistentVolumeClaimVolumeOptions)

---

##### `fromPersistentVolumeClaim` <a name="cdk8s-plus-22.Volume.fromPersistentVolumeClaim"></a>

```typescript
import { Volume } from 'cdk8s-plus-22'

Volume.fromPersistentVolumeClaim(pvc: IPersistentVolumeClaim, options?: PersistentVolumeClaimVolumeOptions)
```

###### `pvc`<sup>Required</sup> <a name="cdk8s-plus-22.Volume.parameter.pvc"></a>

- *Type:* [`cdk8s-plus-22.IPersistentVolumeClaim`](#cdk8s-plus-22.IPersistentVolumeClaim)

---

###### `options`<sup>Optional</sup> <a name="cdk8s-plus-22.Volume.parameter.options"></a>

- *Type:* [`cdk8s-plus-22.PersistentVolumeClaimVolumeOptions`](#cdk8s-plus-22.PersistentVolumeClaimVolumeOptions)

---

##### `fromSecret` <a name="cdk8s-plus-22.Volume.fromSecret"></a>

```typescript
import { Volume } from 'cdk8s-plus-22'

Volume.fromSecret(secret: ISecret, options?: SecretVolumeOptions)
```

###### `secret`<sup>Required</sup> <a name="cdk8s-plus-22.Volume.parameter.secret"></a>

- *Type:* [`cdk8s-plus-22.ISecret`](#cdk8s-plus-22.ISecret)

The secret to use to populate the volume.

---

###### `options`<sup>Optional</sup> <a name="cdk8s-plus-22.Volume.parameter.options"></a>

- *Type:* [`cdk8s-plus-22.SecretVolumeOptions`](#cdk8s-plus-22.SecretVolumeOptions)

Options.

---

#### Properties <a name="Properties"></a>

##### `name`<sup>Required</sup> <a name="cdk8s-plus-22.Volume.property.name"></a>

```typescript
public readonly name: string;
```

- *Type:* `string`

---


## Protocols <a name="Protocols"></a>

### IConfigMap <a name="cdk8s-plus-22.IConfigMap"></a>

- *Extends:* [`cdk8s-plus-22.IResource`](#cdk8s-plus-22.IResource)

- *Implemented By:* [`cdk8s-plus-22.ConfigMap`](#cdk8s-plus-22.ConfigMap), [`cdk8s-plus-22.IConfigMap`](#cdk8s-plus-22.IConfigMap)

Represents a config map.


#### Properties <a name="Properties"></a>

##### `name`<sup>Required</sup> <a name="cdk8s-plus-22.IConfigMap.property.name"></a>

```typescript
public readonly name: string;
```

- *Type:* `string`

The Kubernetes name of this resource.

---

### IPersistentVolume <a name="cdk8s-plus-22.IPersistentVolume"></a>

- *Extends:* [`cdk8s-plus-22.IResource`](#cdk8s-plus-22.IResource)

- *Implemented By:* [`cdk8s-plus-22.AwsElasticBlockStorePersistentVolume`](#cdk8s-plus-22.AwsElasticBlockStorePersistentVolume), [`cdk8s-plus-22.AzureDiskPersistentVolume`](#cdk8s-plus-22.AzureDiskPersistentVolume), [`cdk8s-plus-22.GCEPersistentDiskPersistentVolume`](#cdk8s-plus-22.GCEPersistentDiskPersistentVolume), [`cdk8s-plus-22.PersistentVolume`](#cdk8s-plus-22.PersistentVolume), [`cdk8s-plus-22.IPersistentVolume`](#cdk8s-plus-22.IPersistentVolume)

Contract of a `PersistentVolumeClaim`.


#### Properties <a name="Properties"></a>

##### `name`<sup>Required</sup> <a name="cdk8s-plus-22.IPersistentVolume.property.name"></a>

```typescript
public readonly name: string;
```

- *Type:* `string`

The Kubernetes name of this resource.

---

### IPersistentVolumeClaim <a name="cdk8s-plus-22.IPersistentVolumeClaim"></a>

- *Extends:* [`cdk8s-plus-22.IResource`](#cdk8s-plus-22.IResource)

- *Implemented By:* [`cdk8s-plus-22.PersistentVolumeClaim`](#cdk8s-plus-22.PersistentVolumeClaim), [`cdk8s-plus-22.IPersistentVolumeClaim`](#cdk8s-plus-22.IPersistentVolumeClaim)

Contract of a `PersistentVolumeClaim`.


#### Properties <a name="Properties"></a>

##### `name`<sup>Required</sup> <a name="cdk8s-plus-22.IPersistentVolumeClaim.property.name"></a>

```typescript
public readonly name: string;
```

- *Type:* `string`

The Kubernetes name of this resource.

---

### IPodSpec <a name="cdk8s-plus-22.IPodSpec"></a>

- *Implemented By:* [`cdk8s-plus-22.Deployment`](#cdk8s-plus-22.Deployment), [`cdk8s-plus-22.Job`](#cdk8s-plus-22.Job), [`cdk8s-plus-22.Pod`](#cdk8s-plus-22.Pod), [`cdk8s-plus-22.PodSpec`](#cdk8s-plus-22.PodSpec), [`cdk8s-plus-22.PodTemplate`](#cdk8s-plus-22.PodTemplate), [`cdk8s-plus-22.StatefulSet`](#cdk8s-plus-22.StatefulSet), [`cdk8s-plus-22.IPodSpec`](#cdk8s-plus-22.IPodSpec), [`cdk8s-plus-22.IPodTemplate`](#cdk8s-plus-22.IPodTemplate)

Represents a resource that can be configured with a kuberenets pod spec. (e.g `Deployment`, `Job`, `Pod`, ...).

Use the `PodSpec` class as an implementation helper.

#### Methods <a name="Methods"></a>

##### `addContainer` <a name="cdk8s-plus-22.IPodSpec.addContainer"></a>

```typescript
public addContainer(container: ContainerProps)
```

###### `container`<sup>Required</sup> <a name="cdk8s-plus-22.IPodSpec.parameter.container"></a>

- *Type:* [`cdk8s-plus-22.ContainerProps`](#cdk8s-plus-22.ContainerProps)

The container.

---

##### `addInitContainer` <a name="cdk8s-plus-22.IPodSpec.addInitContainer"></a>

```typescript
public addInitContainer(container: ContainerProps)
```

###### `container`<sup>Required</sup> <a name="cdk8s-plus-22.IPodSpec.parameter.container"></a>

- *Type:* [`cdk8s-plus-22.ContainerProps`](#cdk8s-plus-22.ContainerProps)

The container.

---

##### `addVolume` <a name="cdk8s-plus-22.IPodSpec.addVolume"></a>

```typescript
public addVolume(volume: Volume)
```

###### `volume`<sup>Required</sup> <a name="cdk8s-plus-22.IPodSpec.parameter.volume"></a>

- *Type:* [`cdk8s-plus-22.Volume`](#cdk8s-plus-22.Volume)

The volume.

---

#### Properties <a name="Properties"></a>

##### `containers`<sup>Required</sup> <a name="cdk8s-plus-22.IPodSpec.property.containers"></a>

```typescript
public readonly containers: Container[];
```

- *Type:* [`cdk8s-plus-22.Container`](#cdk8s-plus-22.Container)[]

The containers belonging to the pod.

Use `addContainer` to add containers.

---

##### `hostAliases`<sup>Required</sup> <a name="cdk8s-plus-22.IPodSpec.property.hostAliases"></a>

```typescript
public readonly hostAliases: HostAlias[];
```

- *Type:* [`cdk8s-plus-22.HostAlias`](#cdk8s-plus-22.HostAlias)[]

An optional list of hosts and IPs that will be injected into the pod's hosts file if specified.

This is only valid for non-hostNetwork pods.

---

##### `initContainers`<sup>Required</sup> <a name="cdk8s-plus-22.IPodSpec.property.initContainers"></a>

```typescript
public readonly initContainers: Container[];
```

- *Type:* [`cdk8s-plus-22.Container`](#cdk8s-plus-22.Container)[]

The init containers belonging to the pod.

Use `addInitContainer` to add init containers.

---

##### `volumes`<sup>Required</sup> <a name="cdk8s-plus-22.IPodSpec.property.volumes"></a>

```typescript
public readonly volumes: Volume[];
```

- *Type:* [`cdk8s-plus-22.Volume`](#cdk8s-plus-22.Volume)[]

The volumes associated with this pod.

Use `addVolume` to add volumes.

---

##### `restartPolicy`<sup>Optional</sup> <a name="cdk8s-plus-22.IPodSpec.property.restartPolicy"></a>

```typescript
public readonly restartPolicy: RestartPolicy;
```

- *Type:* [`cdk8s-plus-22.RestartPolicy`](#cdk8s-plus-22.RestartPolicy)

Restart policy for all containers within the pod.

---

##### `serviceAccount`<sup>Optional</sup> <a name="cdk8s-plus-22.IPodSpec.property.serviceAccount"></a>

```typescript
public readonly serviceAccount: IServiceAccount;
```

- *Type:* [`cdk8s-plus-22.IServiceAccount`](#cdk8s-plus-22.IServiceAccount)

The service account used to run this pod.

---

### IPodTemplate <a name="cdk8s-plus-22.IPodTemplate"></a>

- *Extends:* [`cdk8s-plus-22.IPodSpec`](#cdk8s-plus-22.IPodSpec)

- *Implemented By:* [`cdk8s-plus-22.Deployment`](#cdk8s-plus-22.Deployment), [`cdk8s-plus-22.Job`](#cdk8s-plus-22.Job), [`cdk8s-plus-22.PodTemplate`](#cdk8s-plus-22.PodTemplate), [`cdk8s-plus-22.StatefulSet`](#cdk8s-plus-22.StatefulSet), [`cdk8s-plus-22.IPodTemplate`](#cdk8s-plus-22.IPodTemplate)

Represents a resource that can be configured with a kuberenets pod template. (e.g `Deployment`, `Job`, ...).

Use the `PodTemplate` class as an implementation helper.


#### Properties <a name="Properties"></a>

##### `containers`<sup>Required</sup> <a name="cdk8s-plus-22.IPodTemplate.property.containers"></a>

```typescript
public readonly containers: Container[];
```

- *Type:* [`cdk8s-plus-22.Container`](#cdk8s-plus-22.Container)[]

The containers belonging to the pod.

Use `addContainer` to add containers.

---

##### `hostAliases`<sup>Required</sup> <a name="cdk8s-plus-22.IPodTemplate.property.hostAliases"></a>

```typescript
public readonly hostAliases: HostAlias[];
```

- *Type:* [`cdk8s-plus-22.HostAlias`](#cdk8s-plus-22.HostAlias)[]

An optional list of hosts and IPs that will be injected into the pod's hosts file if specified.

This is only valid for non-hostNetwork pods.

---

##### `initContainers`<sup>Required</sup> <a name="cdk8s-plus-22.IPodTemplate.property.initContainers"></a>

```typescript
public readonly initContainers: Container[];
```

- *Type:* [`cdk8s-plus-22.Container`](#cdk8s-plus-22.Container)[]

The init containers belonging to the pod.

Use `addInitContainer` to add init containers.

---

##### `volumes`<sup>Required</sup> <a name="cdk8s-plus-22.IPodTemplate.property.volumes"></a>

```typescript
public readonly volumes: Volume[];
```

- *Type:* [`cdk8s-plus-22.Volume`](#cdk8s-plus-22.Volume)[]

The volumes associated with this pod.

Use `addVolume` to add volumes.

---

##### `restartPolicy`<sup>Optional</sup> <a name="cdk8s-plus-22.IPodTemplate.property.restartPolicy"></a>

```typescript
public readonly restartPolicy: RestartPolicy;
```

- *Type:* [`cdk8s-plus-22.RestartPolicy`](#cdk8s-plus-22.RestartPolicy)

Restart policy for all containers within the pod.

---

##### `serviceAccount`<sup>Optional</sup> <a name="cdk8s-plus-22.IPodTemplate.property.serviceAccount"></a>

```typescript
public readonly serviceAccount: IServiceAccount;
```

- *Type:* [`cdk8s-plus-22.IServiceAccount`](#cdk8s-plus-22.IServiceAccount)

The service account used to run this pod.

---

##### `podMetadata`<sup>Required</sup> <a name="cdk8s-plus-22.IPodTemplate.property.podMetadata"></a>

```typescript
public readonly podMetadata: ApiObjectMetadataDefinition;
```

- *Type:* [`cdk8s.ApiObjectMetadataDefinition`](#cdk8s.ApiObjectMetadataDefinition)

Provides read/write access to the underlying pod metadata of the resource.

---

### IResource <a name="cdk8s-plus-22.IResource"></a>

- *Implemented By:* [`cdk8s-plus-22.AwsElasticBlockStorePersistentVolume`](#cdk8s-plus-22.AwsElasticBlockStorePersistentVolume), [`cdk8s-plus-22.AzureDiskPersistentVolume`](#cdk8s-plus-22.AzureDiskPersistentVolume), [`cdk8s-plus-22.BasicAuthSecret`](#cdk8s-plus-22.BasicAuthSecret), [`cdk8s-plus-22.ConfigMap`](#cdk8s-plus-22.ConfigMap), [`cdk8s-plus-22.Deployment`](#cdk8s-plus-22.Deployment), [`cdk8s-plus-22.DockerConfigSecret`](#cdk8s-plus-22.DockerConfigSecret), [`cdk8s-plus-22.GCEPersistentDiskPersistentVolume`](#cdk8s-plus-22.GCEPersistentDiskPersistentVolume), [`cdk8s-plus-22.Ingress`](#cdk8s-plus-22.Ingress), [`cdk8s-plus-22.Job`](#cdk8s-plus-22.Job), [`cdk8s-plus-22.PersistentVolume`](#cdk8s-plus-22.PersistentVolume), [`cdk8s-plus-22.PersistentVolumeClaim`](#cdk8s-plus-22.PersistentVolumeClaim), [`cdk8s-plus-22.Pod`](#cdk8s-plus-22.Pod), [`cdk8s-plus-22.Resource`](#cdk8s-plus-22.Resource), [`cdk8s-plus-22.Secret`](#cdk8s-plus-22.Secret), [`cdk8s-plus-22.Service`](#cdk8s-plus-22.Service), [`cdk8s-plus-22.ServiceAccount`](#cdk8s-plus-22.ServiceAccount), [`cdk8s-plus-22.ServiceAccountTokenSecret`](#cdk8s-plus-22.ServiceAccountTokenSecret), [`cdk8s-plus-22.SshAuthSecret`](#cdk8s-plus-22.SshAuthSecret), [`cdk8s-plus-22.StatefulSet`](#cdk8s-plus-22.StatefulSet), [`cdk8s-plus-22.TlsSecret`](#cdk8s-plus-22.TlsSecret), [`cdk8s-plus-22.IConfigMap`](#cdk8s-plus-22.IConfigMap), [`cdk8s-plus-22.IPersistentVolume`](#cdk8s-plus-22.IPersistentVolume), [`cdk8s-plus-22.IPersistentVolumeClaim`](#cdk8s-plus-22.IPersistentVolumeClaim), [`cdk8s-plus-22.IResource`](#cdk8s-plus-22.IResource), [`cdk8s-plus-22.ISecret`](#cdk8s-plus-22.ISecret), [`cdk8s-plus-22.IServiceAccount`](#cdk8s-plus-22.IServiceAccount)

Represents a resource.


#### Properties <a name="Properties"></a>

##### `name`<sup>Required</sup> <a name="cdk8s-plus-22.IResource.property.name"></a>

```typescript
public readonly name: string;
```

- *Type:* `string`

The Kubernetes name of this resource.

---

### ISecret <a name="cdk8s-plus-22.ISecret"></a>

- *Extends:* [`cdk8s-plus-22.IResource`](#cdk8s-plus-22.IResource)

- *Implemented By:* [`cdk8s-plus-22.BasicAuthSecret`](#cdk8s-plus-22.BasicAuthSecret), [`cdk8s-plus-22.DockerConfigSecret`](#cdk8s-plus-22.DockerConfigSecret), [`cdk8s-plus-22.Secret`](#cdk8s-plus-22.Secret), [`cdk8s-plus-22.ServiceAccountTokenSecret`](#cdk8s-plus-22.ServiceAccountTokenSecret), [`cdk8s-plus-22.SshAuthSecret`](#cdk8s-plus-22.SshAuthSecret), [`cdk8s-plus-22.TlsSecret`](#cdk8s-plus-22.TlsSecret), [`cdk8s-plus-22.ISecret`](#cdk8s-plus-22.ISecret)


#### Properties <a name="Properties"></a>

##### `name`<sup>Required</sup> <a name="cdk8s-plus-22.ISecret.property.name"></a>

```typescript
public readonly name: string;
```

- *Type:* `string`

The Kubernetes name of this resource.

---

### IServiceAccount <a name="cdk8s-plus-22.IServiceAccount"></a>

- *Extends:* [`cdk8s-plus-22.IResource`](#cdk8s-plus-22.IResource)

- *Implemented By:* [`cdk8s-plus-22.ServiceAccount`](#cdk8s-plus-22.ServiceAccount), [`cdk8s-plus-22.IServiceAccount`](#cdk8s-plus-22.IServiceAccount)


#### Properties <a name="Properties"></a>

##### `name`<sup>Required</sup> <a name="cdk8s-plus-22.IServiceAccount.property.name"></a>

```typescript
public readonly name: string;
```

- *Type:* `string`

The Kubernetes name of this resource.

---

## Enums <a name="Enums"></a>

### AzureDiskPersistentVolumeCachingMode <a name="AzureDiskPersistentVolumeCachingMode"></a>

Azure disk caching modes.

#### `NONE` <a name="cdk8s-plus-22.AzureDiskPersistentVolumeCachingMode.NONE"></a>

None.

---


#### `READ_ONLY` <a name="cdk8s-plus-22.AzureDiskPersistentVolumeCachingMode.READ_ONLY"></a>

ReadOnly.

---


#### `READ_WRITE` <a name="cdk8s-plus-22.AzureDiskPersistentVolumeCachingMode.READ_WRITE"></a>

ReadWrite.

---


### AzureDiskPersistentVolumeKind <a name="AzureDiskPersistentVolumeKind"></a>

Azure Disk kinds.

#### `SHARED` <a name="cdk8s-plus-22.AzureDiskPersistentVolumeKind.SHARED"></a>

Multiple blob disks per storage account.

---


#### `DEDICATED` <a name="cdk8s-plus-22.AzureDiskPersistentVolumeKind.DEDICATED"></a>

Single blob disk per storage account.

---


#### `MANAGED` <a name="cdk8s-plus-22.AzureDiskPersistentVolumeKind.MANAGED"></a>

Azure managed data disk.

---


### EmptyDirMedium <a name="EmptyDirMedium"></a>

The medium on which to store the volume.

#### `DEFAULT` <a name="cdk8s-plus-22.EmptyDirMedium.DEFAULT"></a>

The default volume of the backing node.

---


#### `MEMORY` <a name="cdk8s-plus-22.EmptyDirMedium.MEMORY"></a>

Mount a tmpfs (RAM-backed filesystem) for you instead.

While tmpfs is very
fast, be aware that unlike disks, tmpfs is cleared on node reboot and any
files you write will count against your Container's memory limit.

---


### EnvFieldPaths <a name="EnvFieldPaths"></a>

#### `POD_NAME` <a name="cdk8s-plus-22.EnvFieldPaths.POD_NAME"></a>

The name of the pod.

---


#### `POD_NAMESPACE` <a name="cdk8s-plus-22.EnvFieldPaths.POD_NAMESPACE"></a>

The namespace of the pod.

---


#### `POD_UID` <a name="cdk8s-plus-22.EnvFieldPaths.POD_UID"></a>

The uid of the pod.

---


#### `POD_LABEL` <a name="cdk8s-plus-22.EnvFieldPaths.POD_LABEL"></a>

The labels of the pod.

---


#### `POD_ANNOTATION` <a name="cdk8s-plus-22.EnvFieldPaths.POD_ANNOTATION"></a>

The annotations of the pod.

---


#### `POD_IP` <a name="cdk8s-plus-22.EnvFieldPaths.POD_IP"></a>

The ipAddress of the pod.

---


#### `SERVICE_ACCOUNT_NAME` <a name="cdk8s-plus-22.EnvFieldPaths.SERVICE_ACCOUNT_NAME"></a>

The service account name of the pod.

---


#### `NODE_NAME` <a name="cdk8s-plus-22.EnvFieldPaths.NODE_NAME"></a>

The name of the node.

---


#### `NODE_IP` <a name="cdk8s-plus-22.EnvFieldPaths.NODE_IP"></a>

The ipAddress of the node.

---


#### `POD_IPS` <a name="cdk8s-plus-22.EnvFieldPaths.POD_IPS"></a>

The ipAddresess of the pod.

---


### FsGroupChangePolicy <a name="FsGroupChangePolicy"></a>

#### `ON_ROOT_MISMATCH` <a name="cdk8s-plus-22.FsGroupChangePolicy.ON_ROOT_MISMATCH"></a>

Only change permissions and ownership if permission and ownership of root directory does not match with expected permissions of the volume.

This could help shorten the time it takes to change ownership and permission of a volume

---


#### `ALWAYS` <a name="cdk8s-plus-22.FsGroupChangePolicy.ALWAYS"></a>

Always change permission and ownership of the volume when volume is mounted.

---


### HttpIngressPathType <a name="HttpIngressPathType"></a>

Specify how the path is matched against request paths.

> https://kubernetes.io/docs/concepts/services-networking/ingress/#path-types

#### `PREFIX` <a name="cdk8s-plus-22.HttpIngressPathType.PREFIX"></a>

Matches the URL path exactly.

---


#### `EXACT` <a name="cdk8s-plus-22.HttpIngressPathType.EXACT"></a>

Matches based on a URL path prefix split by '/'.

---


#### `IMPLEMENTATION_SPECIFIC` <a name="cdk8s-plus-22.HttpIngressPathType.IMPLEMENTATION_SPECIFIC"></a>

Matching is specified by the underlying IngressClass.

---


### ImagePullPolicy <a name="ImagePullPolicy"></a>

#### `ALWAYS` <a name="cdk8s-plus-22.ImagePullPolicy.ALWAYS"></a>

Every time the kubelet launches a container, the kubelet queries the container image registry to resolve the name to an image digest.

If the kubelet has a container image with that exact
digest cached locally, the kubelet uses its cached image; otherwise, the kubelet downloads
(pulls) the image with the resolved digest, and uses that image to launch the container.

Default is Always if ImagePullPolicy is omitted and either the image tag is :latest or
the image tag is omitted.

---


#### `IF_NOT_PRESENT` <a name="cdk8s-plus-22.ImagePullPolicy.IF_NOT_PRESENT"></a>

The image is pulled only if it is not already present locally.

Default is IfNotPresent if ImagePullPolicy is omitted and the image tag is present but
not :latest

---


#### `NEVER` <a name="cdk8s-plus-22.ImagePullPolicy.NEVER"></a>

The image is assumed to exist locally.

No attempt is made to pull the image.

---


### MountPropagation <a name="MountPropagation"></a>

#### `NONE` <a name="cdk8s-plus-22.MountPropagation.NONE"></a>

This volume mount will not receive any subsequent mounts that are mounted to this volume or any of its subdirectories by the host.

In similar
fashion, no mounts created by the Container will be visible on the host.

This is the default mode.

This mode is equal to `private` mount propagation as described in the Linux
kernel documentation

---


#### `HOST_TO_CONTAINER` <a name="cdk8s-plus-22.MountPropagation.HOST_TO_CONTAINER"></a>

This volume mount will receive all subsequent mounts that are mounted to this volume or any of its subdirectories.

In other words, if the host mounts anything inside the volume mount, the
Container will see it mounted there.

Similarly, if any Pod with Bidirectional mount propagation to the same
volume mounts anything there, the Container with HostToContainer mount
propagation will see it.

This mode is equal to `rslave` mount propagation as described in the Linux
kernel documentation

---


#### `BIDIRECTIONAL` <a name="cdk8s-plus-22.MountPropagation.BIDIRECTIONAL"></a>

This volume mount behaves the same the HostToContainer mount.

In addition,
all volume mounts created by the Container will be propagated back to the
host and to all Containers of all Pods that use the same volume

A typical use case for this mode is a Pod with a FlexVolume or CSI driver
or a Pod that needs to mount something on the host using a hostPath volume.

This mode is equal to `rshared` mount propagation as described in the Linux
kernel documentation

Caution: Bidirectional mount propagation can be dangerous. It can damage
the host operating system and therefore it is allowed only in privileged
Containers. Familiarity with Linux kernel behavior is strongly recommended.
In addition, any volume mounts created by Containers in Pods must be
destroyed (unmounted) by the Containers on termination.

---


### PersistentVolumeAccessMode <a name="PersistentVolumeAccessMode"></a>

Access Modes.

#### `READ_WRITE_ONCE` <a name="cdk8s-plus-22.PersistentVolumeAccessMode.READ_WRITE_ONCE"></a>

The volume can be mounted as read-write by a single node.

ReadWriteOnce access mode still can allow multiple pods to access
the volume when the pods are running on the same node.

---


#### `READ_ONLY_MANY` <a name="cdk8s-plus-22.PersistentVolumeAccessMode.READ_ONLY_MANY"></a>

The volume can be mounted as read-only by many nodes.

---


#### `READ_WRITE_MANY` <a name="cdk8s-plus-22.PersistentVolumeAccessMode.READ_WRITE_MANY"></a>

The volume can be mounted as read-write by many nodes.

---


#### `READ_WRITE_ONCE_POD` <a name="cdk8s-plus-22.PersistentVolumeAccessMode.READ_WRITE_ONCE_POD"></a>

The volume can be mounted as read-write by a single Pod.

Use ReadWriteOncePod access mode if you want to ensure that
only one pod across whole cluster can read that PVC or write to it.
This is only supported for CSI volumes and Kubernetes version 1.22+.

---


### PersistentVolumeMode <a name="PersistentVolumeMode"></a>

Volume Modes.

#### `FILE_SYSTEM` <a name="cdk8s-plus-22.PersistentVolumeMode.FILE_SYSTEM"></a>

Volume is ounted into Pods into a directory.

If the volume is backed by a block device and the device is empty,
Kubernetes creates a filesystem on the device before mounting it
for the first time.

---


#### `BLOCK` <a name="cdk8s-plus-22.PersistentVolumeMode.BLOCK"></a>

Use a volume as a raw block device.

Such volume is presented into a Pod as a block device,
without any filesystem on it. This mode is useful to provide a Pod the fastest possible way
to access a volume, without any filesystem layer between the Pod
and the volume. On the other hand, the application running in
the Pod must know how to handle a raw block device

---


### PersistentVolumeReclaimPolicy <a name="PersistentVolumeReclaimPolicy"></a>

Reclaim Policies.

#### `RETAIN` <a name="cdk8s-plus-22.PersistentVolumeReclaimPolicy.RETAIN"></a>

The Retain reclaim policy allows for manual reclamation of the resource.

When the PersistentVolumeClaim is deleted, the PersistentVolume still exists and the
volume is considered "released". But it is not yet available for another claim
because the previous claimant's data remains on the volume.
An administrator can manually reclaim the volume with the following steps:

1. Delete the PersistentVolume. The associated storage asset in external
    infrastructure (such as an AWS EBS, GCE PD, Azure Disk, or Cinder volume) still exists after the PV is deleted.
2. Manually clean up the data on the associated storage asset accordingly.
3. Manually delete the associated storage asset.

If you want to reuse the same storage asset, create a new PersistentVolume
with the same storage asset definition.

---


#### `DELETE` <a name="cdk8s-plus-22.PersistentVolumeReclaimPolicy.DELETE"></a>

For volume plugins that support the Delete reclaim policy, deletion removes both the PersistentVolume object from Kubernetes, as well as the associated storage asset in the external infrastructure, such as an AWS EBS, GCE PD, Azure Disk, or Cinder volume.

Volumes that were dynamically provisioned inherit the reclaim policy of their StorageClass, which defaults to Delete.
The administrator should configure the StorageClass according to users' expectations; otherwise,
the PV must be edited or patched after it is created

---


### PodManagementPolicy <a name="PodManagementPolicy"></a>

Controls how pods are created during initial scale up, when replacing pods on nodes, or when scaling down.

The default policy is `OrderedReady`, where pods are created in increasing order
(pod-0, then pod-1, etc) and the controller will wait until each pod is ready before
continuing. When scaling down, the pods are removed in the opposite order.

The alternative policy is `Parallel` which will create pods in parallel to match the
desired scale without waiting, and on scale down will delete all pods at once.

#### `ORDERED_READY` <a name="cdk8s-plus-22.PodManagementPolicy.ORDERED_READY"></a>

---


#### `PARALLEL` <a name="cdk8s-plus-22.PodManagementPolicy.PARALLEL"></a>

---


### Protocol <a name="Protocol"></a>

#### `TCP` <a name="cdk8s-plus-22.Protocol.TCP"></a>

---


#### `UDP` <a name="cdk8s-plus-22.Protocol.UDP"></a>

---


#### `SCTP` <a name="cdk8s-plus-22.Protocol.SCTP"></a>

---


### ResourceFieldPaths <a name="ResourceFieldPaths"></a>

#### `CPU_LIMIT` <a name="cdk8s-plus-22.ResourceFieldPaths.CPU_LIMIT"></a>

CPU limit of the container.

---


#### `MEMORY_LIMIT` <a name="cdk8s-plus-22.ResourceFieldPaths.MEMORY_LIMIT"></a>

Memory limit of the container.

---


#### `CPU_REQUEST` <a name="cdk8s-plus-22.ResourceFieldPaths.CPU_REQUEST"></a>

CPU request of the container.

---


#### `MEMORY_REQUEST` <a name="cdk8s-plus-22.ResourceFieldPaths.MEMORY_REQUEST"></a>

Memory request of the container.

---


#### `STORAGE_LIMIT` <a name="cdk8s-plus-22.ResourceFieldPaths.STORAGE_LIMIT"></a>

Ephemeral storage limit of the container.

---


#### `STORAGE_REQUEST` <a name="cdk8s-plus-22.ResourceFieldPaths.STORAGE_REQUEST"></a>

Ephemeral storage request of the container.

---


### RestartPolicy <a name="RestartPolicy"></a>

Restart policy for all containers within the pod.

#### `ALWAYS` <a name="cdk8s-plus-22.RestartPolicy.ALWAYS"></a>

Always restart the pod after it exits.

---


#### `ON_FAILURE` <a name="cdk8s-plus-22.RestartPolicy.ON_FAILURE"></a>

Only restart if the pod exits with a non-zero exit code.

---


#### `NEVER` <a name="cdk8s-plus-22.RestartPolicy.NEVER"></a>

Never restart the pod.

---


### ServiceType <a name="ServiceType"></a>

For some parts of your application (for example, frontends) you may want to expose a Service onto an external IP address, that's outside of your cluster.

Kubernetes ServiceTypes allow you to specify what kind of Service you want.
The default is ClusterIP.

#### `CLUSTER_IP` <a name="cdk8s-plus-22.ServiceType.CLUSTER_IP"></a>

Exposes the Service on a cluster-internal IP.

Choosing this value makes the Service only reachable from within the cluster.
This is the default ServiceType

---


#### `NODE_PORT` <a name="cdk8s-plus-22.ServiceType.NODE_PORT"></a>

Exposes the Service on each Node's IP at a static port (the NodePort).

A ClusterIP Service, to which the NodePort Service routes, is automatically created.
You'll be able to contact the NodePort Service, from outside the cluster,
by requesting <NodeIP>:<NodePort>.

---


#### `LOAD_BALANCER` <a name="cdk8s-plus-22.ServiceType.LOAD_BALANCER"></a>

Exposes the Service externally using a cloud provider's load balancer.

NodePort and ClusterIP Services, to which the external load balancer routes,
are automatically created.

---


#### `EXTERNAL_NAME` <a name="cdk8s-plus-22.ServiceType.EXTERNAL_NAME"></a>

Maps the Service to the contents of the externalName field (e.g. foo.bar.example.com), by returning a CNAME record with its value. No proxying of any kind is set up.

> Note: You need either kube-dns version 1.7 or CoreDNS version 0.0.8 or higher to use the ExternalName type.

---

