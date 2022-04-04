# API Reference <a name="API Reference"></a>

## Constructs <a name="Constructs"></a>

### AwsElasticBlockStorePersistentVolume <a name="org.cdk8s.plus22.AwsElasticBlockStorePersistentVolume"></a>

Represents an AWS Disk resource that is attached to a kubelet's host machine and then exposed to the pod.

> https://kubernetes.io/docs/concepts/storage/volumes#awselasticblockstore

#### Initializers <a name="org.cdk8s.plus22.AwsElasticBlockStorePersistentVolume.Initializer"></a>

```java
import org.cdk8s.plus22.AwsElasticBlockStorePersistentVolume;

AwsElasticBlockStorePersistentVolume.Builder.create(Construct scope, java.lang.String id)
//  .metadata(ApiObjectMetadata)
//  .accessModes(java.util.List<PersistentVolumeAccessMode>)
//  .claim(IPersistentVolumeClaim)
//  .mountOptions(java.util.List<java.lang.String>)
//  .reclaimPolicy(PersistentVolumeReclaimPolicy)
//  .storage(Size)
//  .storageClassName(java.lang.String)
//  .volumeMode(PersistentVolumeMode)
    .volumeId(java.lang.String)
//  .fsType(java.lang.String)
//  .partition(java.lang.Number)
//  .readOnly(java.lang.Boolean)
    .build();
```

##### `scope`<sup>Required</sup> <a name="org.cdk8s.plus22.AwsElasticBlockStorePersistentVolume.parameter.scope"></a>

- *Type:* [`software.constructs.Construct`](#software.constructs.Construct)

---

##### `id`<sup>Required</sup> <a name="org.cdk8s.plus22.AwsElasticBlockStorePersistentVolume.parameter.id"></a>

- *Type:* `java.lang.String`

---

##### `metadata`<sup>Optional</sup> <a name="org.cdk8s.plus22.AwsElasticBlockStorePersistentVolumeProps.parameter.metadata"></a>

- *Type:* [`org.cdk8s.ApiObjectMetadata`](#org.cdk8s.ApiObjectMetadata)

Metadata that all persisted resources must have, which includes all objects users must create.

---

##### `accessModes`<sup>Optional</sup> <a name="org.cdk8s.plus22.AwsElasticBlockStorePersistentVolumeProps.parameter.accessModes"></a>

- *Type:* java.util.List<[`org.cdk8s.plus22.PersistentVolumeAccessMode`](#org.cdk8s.plus22.PersistentVolumeAccessMode)>
- *Default:* No access modes.

Contains all ways the volume can be mounted.

> https://kubernetes.io/docs/concepts/storage/persistent-volumes#access-modes

---

##### `claim`<sup>Optional</sup> <a name="org.cdk8s.plus22.AwsElasticBlockStorePersistentVolumeProps.parameter.claim"></a>

- *Type:* [`org.cdk8s.plus22.IPersistentVolumeClaim`](#org.cdk8s.plus22.IPersistentVolumeClaim)
- *Default:* Not bound to a specific claim.

Part of a bi-directional binding between PersistentVolume and PersistentVolumeClaim.

Expected to be non-nil when bound.

> https://kubernetes.io/docs/concepts/storage/persistent-volumes#binding

---

##### `mountOptions`<sup>Optional</sup> <a name="org.cdk8s.plus22.AwsElasticBlockStorePersistentVolumeProps.parameter.mountOptions"></a>

- *Type:* java.util.List<`java.lang.String`>
- *Default:* No options.

A list of mount options, e.g. ["ro", "soft"]. Not validated - mount will simply fail if one is invalid.

> https://kubernetes.io/docs/concepts/storage/persistent-volumes/#mount-options

---

##### `reclaimPolicy`<sup>Optional</sup> <a name="org.cdk8s.plus22.AwsElasticBlockStorePersistentVolumeProps.parameter.reclaimPolicy"></a>

- *Type:* [`org.cdk8s.plus22.PersistentVolumeReclaimPolicy`](#org.cdk8s.plus22.PersistentVolumeReclaimPolicy)
- *Default:* PersistentVolumeReclaimPolicy.RETAIN

When a user is done with their volume, they can delete the PVC objects from the API that allows reclamation of the resource.

The reclaim policy tells the cluster what to do with
the volume after it has been released of its claim.

> https://kubernetes.io/docs/concepts/storage/persistent-volumes#reclaiming

---

##### `storage`<sup>Optional</sup> <a name="org.cdk8s.plus22.AwsElasticBlockStorePersistentVolumeProps.parameter.storage"></a>

- *Type:* [`org.cdk8s.Size`](#org.cdk8s.Size)
- *Default:* No specified.

What is the storage capacity of this volume.

> https://kubernetes.io/docs/concepts/storage/persistent-volumes#resources

---

##### `storageClassName`<sup>Optional</sup> <a name="org.cdk8s.plus22.AwsElasticBlockStorePersistentVolumeProps.parameter.storageClassName"></a>

- *Type:* `java.lang.String`
- *Default:* Volume does not belong to any storage class.

Name of StorageClass to which this persistent volume belongs.

---

##### `volumeMode`<sup>Optional</sup> <a name="org.cdk8s.plus22.AwsElasticBlockStorePersistentVolumeProps.parameter.volumeMode"></a>

- *Type:* [`org.cdk8s.plus22.PersistentVolumeMode`](#org.cdk8s.plus22.PersistentVolumeMode)
- *Default:* VolumeMode.FILE_SYSTEM

Defines what type of volume is required by the claim.

---

##### `volumeId`<sup>Required</sup> <a name="org.cdk8s.plus22.AwsElasticBlockStorePersistentVolumeProps.parameter.volumeId"></a>

- *Type:* `java.lang.String`

Unique ID of the persistent disk resource in AWS (Amazon EBS volume).

More info: https://kubernetes.io/docs/concepts/storage/volumes#awselasticblockstore

> https://kubernetes.io/docs/concepts/storage/volumes#awselasticblockstore

---

##### `fsType`<sup>Optional</sup> <a name="org.cdk8s.plus22.AwsElasticBlockStorePersistentVolumeProps.parameter.fsType"></a>

- *Type:* `java.lang.String`
- *Default:* 'ext4'

Filesystem type of the volume that you want to mount.

Tip: Ensure that the filesystem type is supported by the host operating system.

> https://kubernetes.io/docs/concepts/storage/volumes#awselasticblockstore

---

##### `partition`<sup>Optional</sup> <a name="org.cdk8s.plus22.AwsElasticBlockStorePersistentVolumeProps.parameter.partition"></a>

- *Type:* `java.lang.Number`
- *Default:* No partition.

The partition in the volume that you want to mount.

If omitted, the default is to mount by volume name.
Examples: For volume /dev/sda1, you specify the partition as "1".
Similarly, the volume partition for /dev/sda is "0" (or you can leave the property empty).

---

##### `readOnly`<sup>Optional</sup> <a name="org.cdk8s.plus22.AwsElasticBlockStorePersistentVolumeProps.parameter.readOnly"></a>

- *Type:* `java.lang.Boolean`
- *Default:* false

Specify "true" to force and set the ReadOnly property in VolumeMounts to "true".

> https://kubernetes.io/docs/concepts/storage/volumes#awselasticblockstore

---



#### Properties <a name="Properties"></a>

##### `fsType`<sup>Required</sup> <a name="org.cdk8s.plus22.AwsElasticBlockStorePersistentVolume.property.fsType"></a>

```java
public java.lang.String getFsType();
```

- *Type:* `java.lang.String`

File system type of this volume.

---

##### `readOnly`<sup>Required</sup> <a name="org.cdk8s.plus22.AwsElasticBlockStorePersistentVolume.property.readOnly"></a>

```java
public java.lang.Boolean getReadOnly();
```

- *Type:* `java.lang.Boolean`

Whether or not it is mounted as a read-only volume.

---

##### `volumeId`<sup>Required</sup> <a name="org.cdk8s.plus22.AwsElasticBlockStorePersistentVolume.property.volumeId"></a>

```java
public java.lang.String getVolumeId();
```

- *Type:* `java.lang.String`

Volume id of this volume.

---

##### `partition`<sup>Optional</sup> <a name="org.cdk8s.plus22.AwsElasticBlockStorePersistentVolume.property.partition"></a>

```java
public java.lang.Number getPartition();
```

- *Type:* `java.lang.Number`

Partition of this volume.

---


### AzureDiskPersistentVolume <a name="org.cdk8s.plus22.AzureDiskPersistentVolume"></a>

AzureDisk represents an Azure Data Disk mount on the host and bind mount to the pod.

#### Initializers <a name="org.cdk8s.plus22.AzureDiskPersistentVolume.Initializer"></a>

```java
import org.cdk8s.plus22.AzureDiskPersistentVolume;

AzureDiskPersistentVolume.Builder.create(Construct scope, java.lang.String id)
//  .metadata(ApiObjectMetadata)
//  .accessModes(java.util.List<PersistentVolumeAccessMode>)
//  .claim(IPersistentVolumeClaim)
//  .mountOptions(java.util.List<java.lang.String>)
//  .reclaimPolicy(PersistentVolumeReclaimPolicy)
//  .storage(Size)
//  .storageClassName(java.lang.String)
//  .volumeMode(PersistentVolumeMode)
    .diskName(java.lang.String)
    .diskUri(java.lang.String)
//  .cachingMode(AzureDiskPersistentVolumeCachingMode)
//  .fsType(java.lang.String)
//  .kind(AzureDiskPersistentVolumeKind)
//  .readOnly(java.lang.Boolean)
    .build();
```

##### `scope`<sup>Required</sup> <a name="org.cdk8s.plus22.AzureDiskPersistentVolume.parameter.scope"></a>

- *Type:* [`software.constructs.Construct`](#software.constructs.Construct)

---

##### `id`<sup>Required</sup> <a name="org.cdk8s.plus22.AzureDiskPersistentVolume.parameter.id"></a>

- *Type:* `java.lang.String`

---

##### `metadata`<sup>Optional</sup> <a name="org.cdk8s.plus22.AzureDiskPersistentVolumeProps.parameter.metadata"></a>

- *Type:* [`org.cdk8s.ApiObjectMetadata`](#org.cdk8s.ApiObjectMetadata)

Metadata that all persisted resources must have, which includes all objects users must create.

---

##### `accessModes`<sup>Optional</sup> <a name="org.cdk8s.plus22.AzureDiskPersistentVolumeProps.parameter.accessModes"></a>

- *Type:* java.util.List<[`org.cdk8s.plus22.PersistentVolumeAccessMode`](#org.cdk8s.plus22.PersistentVolumeAccessMode)>
- *Default:* No access modes.

Contains all ways the volume can be mounted.

> https://kubernetes.io/docs/concepts/storage/persistent-volumes#access-modes

---

##### `claim`<sup>Optional</sup> <a name="org.cdk8s.plus22.AzureDiskPersistentVolumeProps.parameter.claim"></a>

- *Type:* [`org.cdk8s.plus22.IPersistentVolumeClaim`](#org.cdk8s.plus22.IPersistentVolumeClaim)
- *Default:* Not bound to a specific claim.

Part of a bi-directional binding between PersistentVolume and PersistentVolumeClaim.

Expected to be non-nil when bound.

> https://kubernetes.io/docs/concepts/storage/persistent-volumes#binding

---

##### `mountOptions`<sup>Optional</sup> <a name="org.cdk8s.plus22.AzureDiskPersistentVolumeProps.parameter.mountOptions"></a>

- *Type:* java.util.List<`java.lang.String`>
- *Default:* No options.

A list of mount options, e.g. ["ro", "soft"]. Not validated - mount will simply fail if one is invalid.

> https://kubernetes.io/docs/concepts/storage/persistent-volumes/#mount-options

---

##### `reclaimPolicy`<sup>Optional</sup> <a name="org.cdk8s.plus22.AzureDiskPersistentVolumeProps.parameter.reclaimPolicy"></a>

- *Type:* [`org.cdk8s.plus22.PersistentVolumeReclaimPolicy`](#org.cdk8s.plus22.PersistentVolumeReclaimPolicy)
- *Default:* PersistentVolumeReclaimPolicy.RETAIN

When a user is done with their volume, they can delete the PVC objects from the API that allows reclamation of the resource.

The reclaim policy tells the cluster what to do with
the volume after it has been released of its claim.

> https://kubernetes.io/docs/concepts/storage/persistent-volumes#reclaiming

---

##### `storage`<sup>Optional</sup> <a name="org.cdk8s.plus22.AzureDiskPersistentVolumeProps.parameter.storage"></a>

- *Type:* [`org.cdk8s.Size`](#org.cdk8s.Size)
- *Default:* No specified.

What is the storage capacity of this volume.

> https://kubernetes.io/docs/concepts/storage/persistent-volumes#resources

---

##### `storageClassName`<sup>Optional</sup> <a name="org.cdk8s.plus22.AzureDiskPersistentVolumeProps.parameter.storageClassName"></a>

- *Type:* `java.lang.String`
- *Default:* Volume does not belong to any storage class.

Name of StorageClass to which this persistent volume belongs.

---

##### `volumeMode`<sup>Optional</sup> <a name="org.cdk8s.plus22.AzureDiskPersistentVolumeProps.parameter.volumeMode"></a>

- *Type:* [`org.cdk8s.plus22.PersistentVolumeMode`](#org.cdk8s.plus22.PersistentVolumeMode)
- *Default:* VolumeMode.FILE_SYSTEM

Defines what type of volume is required by the claim.

---

##### `diskName`<sup>Required</sup> <a name="org.cdk8s.plus22.AzureDiskPersistentVolumeProps.parameter.diskName"></a>

- *Type:* `java.lang.String`

The Name of the data disk in the blob storage.

---

##### `diskUri`<sup>Required</sup> <a name="org.cdk8s.plus22.AzureDiskPersistentVolumeProps.parameter.diskUri"></a>

- *Type:* `java.lang.String`

The URI the data disk in the blob storage.

---

##### `cachingMode`<sup>Optional</sup> <a name="org.cdk8s.plus22.AzureDiskPersistentVolumeProps.parameter.cachingMode"></a>

- *Type:* [`org.cdk8s.plus22.AzureDiskPersistentVolumeCachingMode`](#org.cdk8s.plus22.AzureDiskPersistentVolumeCachingMode)
- *Default:* AzureDiskPersistentVolumeCachingMode.NONE.

Host Caching mode.

---

##### `fsType`<sup>Optional</sup> <a name="org.cdk8s.plus22.AzureDiskPersistentVolumeProps.parameter.fsType"></a>

- *Type:* `java.lang.String`
- *Default:* 'ext4'

Filesystem type to mount.

Must be a filesystem type supported by the host operating system.

---

##### `kind`<sup>Optional</sup> <a name="org.cdk8s.plus22.AzureDiskPersistentVolumeProps.parameter.kind"></a>

- *Type:* [`org.cdk8s.plus22.AzureDiskPersistentVolumeKind`](#org.cdk8s.plus22.AzureDiskPersistentVolumeKind)
- *Default:* AzureDiskPersistentVolumeKind.SHARED

Kind of disk.

---

##### `readOnly`<sup>Optional</sup> <a name="org.cdk8s.plus22.AzureDiskPersistentVolumeProps.parameter.readOnly"></a>

- *Type:* `java.lang.Boolean`
- *Default:* false

Force the ReadOnly setting in VolumeMounts.

---



#### Properties <a name="Properties"></a>

##### `cachingMode`<sup>Required</sup> <a name="org.cdk8s.plus22.AzureDiskPersistentVolume.property.cachingMode"></a>

```java
public AzureDiskPersistentVolumeCachingMode getCachingMode();
```

- *Type:* [`org.cdk8s.plus22.AzureDiskPersistentVolumeCachingMode`](#org.cdk8s.plus22.AzureDiskPersistentVolumeCachingMode)

Caching mode of this volume.

---

##### `diskName`<sup>Required</sup> <a name="org.cdk8s.plus22.AzureDiskPersistentVolume.property.diskName"></a>

```java
public java.lang.String getDiskName();
```

- *Type:* `java.lang.String`

Disk name of this volume.

---

##### `diskUri`<sup>Required</sup> <a name="org.cdk8s.plus22.AzureDiskPersistentVolume.property.diskUri"></a>

```java
public java.lang.String getDiskUri();
```

- *Type:* `java.lang.String`

Disk URI of this volume.

---

##### `fsType`<sup>Required</sup> <a name="org.cdk8s.plus22.AzureDiskPersistentVolume.property.fsType"></a>

```java
public java.lang.String getFsType();
```

- *Type:* `java.lang.String`

File system type of this volume.

---

##### `kind`<sup>Required</sup> <a name="org.cdk8s.plus22.AzureDiskPersistentVolume.property.kind"></a>

```java
public AzureDiskPersistentVolumeKind getKind();
```

- *Type:* [`org.cdk8s.plus22.AzureDiskPersistentVolumeKind`](#org.cdk8s.plus22.AzureDiskPersistentVolumeKind)

Azure kind of this volume.

---

##### `readOnly`<sup>Required</sup> <a name="org.cdk8s.plus22.AzureDiskPersistentVolume.property.readOnly"></a>

```java
public java.lang.Boolean getReadOnly();
```

- *Type:* `java.lang.Boolean`

Whether or not it is mounted as a read-only volume.

---


### BasicAuthSecret <a name="org.cdk8s.plus22.BasicAuthSecret"></a>

Create a secret for basic authentication.

> https://kubernetes.io/docs/concepts/configuration/secret/#basic-authentication-secret

#### Initializers <a name="org.cdk8s.plus22.BasicAuthSecret.Initializer"></a>

```java
import org.cdk8s.plus22.BasicAuthSecret;

BasicAuthSecret.Builder.create(Construct scope, java.lang.String id)
//  .metadata(ApiObjectMetadata)
//  .immutable(java.lang.Boolean)
    .password(java.lang.String)
    .username(java.lang.String)
    .build();
```

##### `scope`<sup>Required</sup> <a name="org.cdk8s.plus22.BasicAuthSecret.parameter.scope"></a>

- *Type:* [`software.constructs.Construct`](#software.constructs.Construct)

---

##### `id`<sup>Required</sup> <a name="org.cdk8s.plus22.BasicAuthSecret.parameter.id"></a>

- *Type:* `java.lang.String`

---

##### `metadata`<sup>Optional</sup> <a name="org.cdk8s.plus22.BasicAuthSecretProps.parameter.metadata"></a>

- *Type:* [`org.cdk8s.ApiObjectMetadata`](#org.cdk8s.ApiObjectMetadata)

Metadata that all persisted resources must have, which includes all objects users must create.

---

##### `immutable`<sup>Optional</sup> <a name="org.cdk8s.plus22.BasicAuthSecretProps.parameter.immutable"></a>

- *Type:* `java.lang.Boolean`
- *Default:* false

If set to true, ensures that data stored in the Secret cannot be updated (only object metadata can be modified).

If not set to true, the field can be modified at any time.

---

##### `password`<sup>Required</sup> <a name="org.cdk8s.plus22.BasicAuthSecretProps.parameter.password"></a>

- *Type:* `java.lang.String`

The password or token for authentication.

---

##### `username`<sup>Required</sup> <a name="org.cdk8s.plus22.BasicAuthSecretProps.parameter.username"></a>

- *Type:* `java.lang.String`

The user name for authentication.

---





### ConfigMap <a name="org.cdk8s.plus22.ConfigMap"></a>

- *Implements:* [`org.cdk8s.plus22.IConfigMap`](#org.cdk8s.plus22.IConfigMap)

ConfigMap holds configuration data for pods to consume.

#### Initializers <a name="org.cdk8s.plus22.ConfigMap.Initializer"></a>

```java
import org.cdk8s.plus22.ConfigMap;

ConfigMap.Builder.create(Construct scope, java.lang.String id)
//  .metadata(ApiObjectMetadata)
//  .binaryData(java.util.Map<java.lang.String, java.lang.String>)
//  .data(java.util.Map<java.lang.String, java.lang.String>)
    .build();
```

##### `scope`<sup>Required</sup> <a name="org.cdk8s.plus22.ConfigMap.parameter.scope"></a>

- *Type:* [`software.constructs.Construct`](#software.constructs.Construct)

---

##### `id`<sup>Required</sup> <a name="org.cdk8s.plus22.ConfigMap.parameter.id"></a>

- *Type:* `java.lang.String`

---

##### `metadata`<sup>Optional</sup> <a name="org.cdk8s.plus22.ConfigMapProps.parameter.metadata"></a>

- *Type:* [`org.cdk8s.ApiObjectMetadata`](#org.cdk8s.ApiObjectMetadata)

Metadata that all persisted resources must have, which includes all objects users must create.

---

##### `binaryData`<sup>Optional</sup> <a name="org.cdk8s.plus22.ConfigMapProps.parameter.binaryData"></a>

- *Type:* java.util.Map<java.lang.String, `java.lang.String`>

BinaryData contains the binary data.

Each key must consist of alphanumeric characters, '-', '_' or '.'.
BinaryData can contain byte sequences that are not in the UTF-8 range. The
keys stored in BinaryData must not overlap with the ones in the Data field,
this is enforced during validation process.

You can also add binary data using `configMap.addBinaryData()`.

---

##### `data`<sup>Optional</sup> <a name="org.cdk8s.plus22.ConfigMapProps.parameter.data"></a>

- *Type:* java.util.Map<java.lang.String, `java.lang.String`>

Data contains the configuration data.

Each key must consist of alphanumeric characters, '-', '_' or '.'. Values
with non-UTF-8 byte sequences must use the BinaryData field. The keys
stored in Data must not overlap with the keys in the BinaryData field, this
is enforced during validation process.

You can also add data using `configMap.addData()`.

---

#### Methods <a name="Methods"></a>

##### `addBinaryData` <a name="org.cdk8s.plus22.ConfigMap.addBinaryData"></a>

```java
public addBinaryData(java.lang.String key, java.lang.String value)
```

###### `key`<sup>Required</sup> <a name="org.cdk8s.plus22.ConfigMap.parameter.key"></a>

- *Type:* `java.lang.String`

The key.

---

###### `value`<sup>Required</sup> <a name="org.cdk8s.plus22.ConfigMap.parameter.value"></a>

- *Type:* `java.lang.String`

The value.

---

##### `addData` <a name="org.cdk8s.plus22.ConfigMap.addData"></a>

```java
public addData(java.lang.String key, java.lang.String value)
```

###### `key`<sup>Required</sup> <a name="org.cdk8s.plus22.ConfigMap.parameter.key"></a>

- *Type:* `java.lang.String`

The key.

---

###### `value`<sup>Required</sup> <a name="org.cdk8s.plus22.ConfigMap.parameter.value"></a>

- *Type:* `java.lang.String`

The value.

---

##### `addDirectory` <a name="org.cdk8s.plus22.ConfigMap.addDirectory"></a>

```java
public addDirectory(java.lang.String localDir)
public addDirectory(java.lang.String localDir, AddDirectoryOptions options)
```

###### `localDir`<sup>Required</sup> <a name="org.cdk8s.plus22.ConfigMap.parameter.localDir"></a>

- *Type:* `java.lang.String`

A path to a local directory.

---

###### `options`<sup>Optional</sup> <a name="org.cdk8s.plus22.ConfigMap.parameter.options"></a>

- *Type:* [`org.cdk8s.plus22.AddDirectoryOptions`](#org.cdk8s.plus22.AddDirectoryOptions)

Options.

---

##### `addFile` <a name="org.cdk8s.plus22.ConfigMap.addFile"></a>

```java
public addFile(java.lang.String localFile)
public addFile(java.lang.String localFile, java.lang.String key)
```

###### `localFile`<sup>Required</sup> <a name="org.cdk8s.plus22.ConfigMap.parameter.localFile"></a>

- *Type:* `java.lang.String`

The path to the local file.

---

###### `key`<sup>Optional</sup> <a name="org.cdk8s.plus22.ConfigMap.parameter.key"></a>

- *Type:* `java.lang.String`

The ConfigMap key (default to the file name).

---

#### Static Functions <a name="Static Functions"></a>

##### `fromConfigMapName` <a name="org.cdk8s.plus22.ConfigMap.fromConfigMapName"></a>

```java
import org.cdk8s.plus22.ConfigMap;

ConfigMap.fromConfigMapName(java.lang.String name)
```

###### `name`<sup>Required</sup> <a name="org.cdk8s.plus22.ConfigMap.parameter.name"></a>

- *Type:* `java.lang.String`

The name of the config map to import.

---

#### Properties <a name="Properties"></a>

##### `binaryData`<sup>Required</sup> <a name="org.cdk8s.plus22.ConfigMap.property.binaryData"></a>

```java
public java.util.Map<java.lang.String, java.lang.String> getBinaryData();
```

- *Type:* java.util.Map<java.lang.String, `java.lang.String`>

The binary data associated with this config map.

Returns a copy. To add data records, use `addBinaryData()` or `addData()`.

---

##### `data`<sup>Required</sup> <a name="org.cdk8s.plus22.ConfigMap.property.data"></a>

```java
public java.util.Map<java.lang.String, java.lang.String> getData();
```

- *Type:* java.util.Map<java.lang.String, `java.lang.String`>

The data associated with this config map.

Returns an copy. To add data records, use `addData()` or `addBinaryData()`.

---


### Deployment <a name="org.cdk8s.plus22.Deployment"></a>

- *Implements:* [`org.cdk8s.plus22.IPodTemplate`](#org.cdk8s.plus22.IPodTemplate)

A Deployment provides declarative updates for Pods and ReplicaSets.

You describe a desired state in a Deployment, and the Deployment Controller changes the actual
state to the desired state at a controlled rate. You can define Deployments to create new ReplicaSets, or to remove
existing Deployments and adopt all their resources with new Deployments.

> Note: Do not manage ReplicaSets owned by a Deployment. Consider opening an issue in the main Kubernetes repository if your use case is not covered below.

## Use Case

The following are typical use cases for Deployments:

* Create a Deployment to rollout a ReplicaSet. The ReplicaSet creates Pods in the background.
  Check the status of the rollout to see if it succeeds or not.
* Declare the new state of the Pods by updating the PodTemplateSpec of the Deployment.
  A new ReplicaSet is created and the Deployment manages moving the Pods from the old ReplicaSet to the new one at a controlled rate.
  Each new ReplicaSet updates the revision of the Deployment.
* Rollback to an earlier Deployment revision if the current state of the Deployment is not stable.
  Each rollback updates the revision of the Deployment.
* Scale up the Deployment to facilitate more load.
* Pause the Deployment to apply multiple fixes to its PodTemplateSpec and then resume it to start a new rollout.
* Use the status of the Deployment as an indicator that a rollout has stuck.
* Clean up older ReplicaSets that you don't need anymore.

#### Initializers <a name="org.cdk8s.plus22.Deployment.Initializer"></a>

```java
import org.cdk8s.plus22.Deployment;

Deployment.Builder.create(Construct scope, java.lang.String id)
//  .metadata(ApiObjectMetadata)
//  .containers(java.util.List<ContainerProps>)
//  .hostAliases(java.util.List<HostAlias>)
//  .initContainers(java.util.List<ContainerProps>)
//  .restartPolicy(RestartPolicy)
//  .securityContext(PodSecurityContextProps)
//  .serviceAccount(IServiceAccount)
//  .volumes(java.util.List<Volume>)
//  .podMetadata(ApiObjectMetadata)
//  .defaultSelector(java.lang.Boolean)
//  .replicas(java.lang.Number)
    .build();
```

##### `scope`<sup>Required</sup> <a name="org.cdk8s.plus22.Deployment.parameter.scope"></a>

- *Type:* [`software.constructs.Construct`](#software.constructs.Construct)

---

##### `id`<sup>Required</sup> <a name="org.cdk8s.plus22.Deployment.parameter.id"></a>

- *Type:* `java.lang.String`

---

##### `metadata`<sup>Optional</sup> <a name="org.cdk8s.plus22.DeploymentProps.parameter.metadata"></a>

- *Type:* [`org.cdk8s.ApiObjectMetadata`](#org.cdk8s.ApiObjectMetadata)

Metadata that all persisted resources must have, which includes all objects users must create.

---

##### `containers`<sup>Optional</sup> <a name="org.cdk8s.plus22.DeploymentProps.parameter.containers"></a>

- *Type:* java.util.List<[`org.cdk8s.plus22.ContainerProps`](#org.cdk8s.plus22.ContainerProps)>
- *Default:* No containers. Note that a pod spec must include at least one container.

List of containers belonging to the pod.

Containers cannot currently be
added or removed. There must be at least one container in a Pod.

You can add additionnal containers using `podSpec.addContainer()`

---

##### `hostAliases`<sup>Optional</sup> <a name="org.cdk8s.plus22.DeploymentProps.parameter.hostAliases"></a>

- *Type:* java.util.List<[`org.cdk8s.plus22.HostAlias`](#org.cdk8s.plus22.HostAlias)>

HostAlias holds the mapping between IP and hostnames that will be injected as an entry in the pod's hosts file.

---

##### `initContainers`<sup>Optional</sup> <a name="org.cdk8s.plus22.DeploymentProps.parameter.initContainers"></a>

- *Type:* java.util.List<[`org.cdk8s.plus22.ContainerProps`](#org.cdk8s.plus22.ContainerProps)>
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

##### `restartPolicy`<sup>Optional</sup> <a name="org.cdk8s.plus22.DeploymentProps.parameter.restartPolicy"></a>

- *Type:* [`org.cdk8s.plus22.RestartPolicy`](#org.cdk8s.plus22.RestartPolicy)
- *Default:* RestartPolicy.ALWAYS

Restart policy for all containers within the pod.

> https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle/#restart-policy

---

##### `securityContext`<sup>Optional</sup> <a name="org.cdk8s.plus22.DeploymentProps.parameter.securityContext"></a>

- *Type:* [`org.cdk8s.plus22.PodSecurityContextProps`](#org.cdk8s.plus22.PodSecurityContextProps)
- *Default:* fsGroupChangePolicy: FsGroupChangePolicy.FsGroupChangePolicy.ALWAYS
  ensureNonRoot: false

SecurityContext holds pod-level security attributes and common container settings.

---

##### `serviceAccount`<sup>Optional</sup> <a name="org.cdk8s.plus22.DeploymentProps.parameter.serviceAccount"></a>

- *Type:* [`org.cdk8s.plus22.IServiceAccount`](#org.cdk8s.plus22.IServiceAccount)
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

##### `volumes`<sup>Optional</sup> <a name="org.cdk8s.plus22.DeploymentProps.parameter.volumes"></a>

- *Type:* java.util.List<[`org.cdk8s.plus22.Volume`](#org.cdk8s.plus22.Volume)>
- *Default:* No volumes.

List of volumes that can be mounted by containers belonging to the pod.

You can also add volumes later using `podSpec.addVolume()`

> https://kubernetes.io/docs/concepts/storage/volumes

---

##### `podMetadata`<sup>Optional</sup> <a name="org.cdk8s.plus22.DeploymentProps.parameter.podMetadata"></a>

- *Type:* [`org.cdk8s.ApiObjectMetadata`](#org.cdk8s.ApiObjectMetadata)

The pod metadata.

---

##### `defaultSelector`<sup>Optional</sup> <a name="org.cdk8s.plus22.DeploymentProps.parameter.defaultSelector"></a>

- *Type:* `java.lang.Boolean`
- *Default:* true

Automatically allocates a pod selector for this deployment.

If this is set to `false` you must define your selector through
`deployment.podMetadata.addLabel()` and `deployment.selectByLabel()`.

---

##### `replicas`<sup>Optional</sup> <a name="org.cdk8s.plus22.DeploymentProps.parameter.replicas"></a>

- *Type:* `java.lang.Number`
- *Default:* 1

Number of desired pods.

---

#### Methods <a name="Methods"></a>

##### `addContainer` <a name="org.cdk8s.plus22.Deployment.addContainer"></a>

```java
public addContainer(ContainerProps container)
```

###### `container`<sup>Required</sup> <a name="org.cdk8s.plus22.Deployment.parameter.container"></a>

- *Type:* [`org.cdk8s.plus22.ContainerProps`](#org.cdk8s.plus22.ContainerProps)

---

##### `addHostAlias` <a name="org.cdk8s.plus22.Deployment.addHostAlias"></a>

```java
public addHostAlias(HostAlias hostAlias)
```

###### `hostAlias`<sup>Required</sup> <a name="org.cdk8s.plus22.Deployment.parameter.hostAlias"></a>

- *Type:* [`org.cdk8s.plus22.HostAlias`](#org.cdk8s.plus22.HostAlias)

---

##### `addInitContainer` <a name="org.cdk8s.plus22.Deployment.addInitContainer"></a>

```java
public addInitContainer(ContainerProps container)
```

###### `container`<sup>Required</sup> <a name="org.cdk8s.plus22.Deployment.parameter.container"></a>

- *Type:* [`org.cdk8s.plus22.ContainerProps`](#org.cdk8s.plus22.ContainerProps)

---

##### `addVolume` <a name="org.cdk8s.plus22.Deployment.addVolume"></a>

```java
public addVolume(Volume volume)
```

###### `volume`<sup>Required</sup> <a name="org.cdk8s.plus22.Deployment.parameter.volume"></a>

- *Type:* [`org.cdk8s.plus22.Volume`](#org.cdk8s.plus22.Volume)

---

##### `exposeViaIngress` <a name="org.cdk8s.plus22.Deployment.exposeViaIngress"></a>

```java
public exposeViaIngress(java.lang.String path)
public exposeViaIngress(java.lang.String path, ExposeDeploymentViaIngressOptions options)
```

###### `path`<sup>Required</sup> <a name="org.cdk8s.plus22.Deployment.parameter.path"></a>

- *Type:* `java.lang.String`

The ingress path to register under.

---

###### `options`<sup>Optional</sup> <a name="org.cdk8s.plus22.Deployment.parameter.options"></a>

- *Type:* [`org.cdk8s.plus22.ExposeDeploymentViaIngressOptions`](#org.cdk8s.plus22.ExposeDeploymentViaIngressOptions)

Additional options.

---

##### `exposeViaService` <a name="org.cdk8s.plus22.Deployment.exposeViaService"></a>

```java
public exposeViaService()
public exposeViaService(ExposeDeploymentViaServiceOptions options)
```

###### `options`<sup>Optional</sup> <a name="org.cdk8s.plus22.Deployment.parameter.options"></a>

- *Type:* [`org.cdk8s.plus22.ExposeDeploymentViaServiceOptions`](#org.cdk8s.plus22.ExposeDeploymentViaServiceOptions)

Options to determine details of the service and port exposed.

---

##### `selectByLabel` <a name="org.cdk8s.plus22.Deployment.selectByLabel"></a>

```java
public selectByLabel(java.lang.String key, java.lang.String value)
```

###### `key`<sup>Required</sup> <a name="org.cdk8s.plus22.Deployment.parameter.key"></a>

- *Type:* `java.lang.String`

The label key.

---

###### `value`<sup>Required</sup> <a name="org.cdk8s.plus22.Deployment.parameter.value"></a>

- *Type:* `java.lang.String`

The label value.

---


#### Properties <a name="Properties"></a>

##### `containers`<sup>Required</sup> <a name="org.cdk8s.plus22.Deployment.property.containers"></a>

```java
public java.util.List<Container> getContainers();
```

- *Type:* java.util.List<[`org.cdk8s.plus22.Container`](#org.cdk8s.plus22.Container)>

The containers belonging to the pod.

Use `addContainer` to add containers.

---

##### `hostAliases`<sup>Required</sup> <a name="org.cdk8s.plus22.Deployment.property.hostAliases"></a>

```java
public java.util.List<HostAlias> getHostAliases();
```

- *Type:* java.util.List<[`org.cdk8s.plus22.HostAlias`](#org.cdk8s.plus22.HostAlias)>

An optional list of hosts and IPs that will be injected into the pod's hosts file if specified.

This is only valid for non-hostNetwork pods.

---

##### `initContainers`<sup>Required</sup> <a name="org.cdk8s.plus22.Deployment.property.initContainers"></a>

```java
public java.util.List<Container> getInitContainers();
```

- *Type:* java.util.List<[`org.cdk8s.plus22.Container`](#org.cdk8s.plus22.Container)>

The init containers belonging to the pod.

Use `addInitContainer` to add init containers.

---

##### `labelSelector`<sup>Required</sup> <a name="org.cdk8s.plus22.Deployment.property.labelSelector"></a>

```java
public java.util.Map<java.lang.String, java.lang.String> getLabelSelector();
```

- *Type:* java.util.Map<java.lang.String, `java.lang.String`>

The labels this deployment will match against in order to select pods.

Returns a a copy. Use `selectByLabel()` to add labels.

---

##### `podMetadata`<sup>Required</sup> <a name="org.cdk8s.plus22.Deployment.property.podMetadata"></a>

```java
public ApiObjectMetadataDefinition getPodMetadata();
```

- *Type:* [`org.cdk8s.ApiObjectMetadataDefinition`](#org.cdk8s.ApiObjectMetadataDefinition)

Provides read/write access to the underlying pod metadata of the resource.

---

##### `replicas`<sup>Required</sup> <a name="org.cdk8s.plus22.Deployment.property.replicas"></a>

```java
public java.lang.Number getReplicas();
```

- *Type:* `java.lang.Number`

Number of desired pods.

---

##### `securityContext`<sup>Required</sup> <a name="org.cdk8s.plus22.Deployment.property.securityContext"></a>

```java
public PodSecurityContext getSecurityContext();
```

- *Type:* [`org.cdk8s.plus22.PodSecurityContext`](#org.cdk8s.plus22.PodSecurityContext)

---

##### `volumes`<sup>Required</sup> <a name="org.cdk8s.plus22.Deployment.property.volumes"></a>

```java
public java.util.List<Volume> getVolumes();
```

- *Type:* java.util.List<[`org.cdk8s.plus22.Volume`](#org.cdk8s.plus22.Volume)>

The volumes associated with this pod.

Use `addVolume` to add volumes.

---

##### `restartPolicy`<sup>Optional</sup> <a name="org.cdk8s.plus22.Deployment.property.restartPolicy"></a>

```java
public RestartPolicy getRestartPolicy();
```

- *Type:* [`org.cdk8s.plus22.RestartPolicy`](#org.cdk8s.plus22.RestartPolicy)

Restart policy for all containers within the pod.

---

##### `serviceAccount`<sup>Optional</sup> <a name="org.cdk8s.plus22.Deployment.property.serviceAccount"></a>

```java
public IServiceAccount getServiceAccount();
```

- *Type:* [`org.cdk8s.plus22.IServiceAccount`](#org.cdk8s.plus22.IServiceAccount)

The service account used to run this pod.

---


### DockerConfigSecret <a name="org.cdk8s.plus22.DockerConfigSecret"></a>

Create a secret for storing credentials for accessing a container image registry.

> https://kubernetes.io/docs/concepts/configuration/secret/#docker-config-secrets

#### Initializers <a name="org.cdk8s.plus22.DockerConfigSecret.Initializer"></a>

```java
import org.cdk8s.plus22.DockerConfigSecret;

DockerConfigSecret.Builder.create(Construct scope, java.lang.String id)
//  .metadata(ApiObjectMetadata)
//  .immutable(java.lang.Boolean)
    .data(java.util.Map<java.lang.String, java.lang.Object>)
    .build();
```

##### `scope`<sup>Required</sup> <a name="org.cdk8s.plus22.DockerConfigSecret.parameter.scope"></a>

- *Type:* [`software.constructs.Construct`](#software.constructs.Construct)

---

##### `id`<sup>Required</sup> <a name="org.cdk8s.plus22.DockerConfigSecret.parameter.id"></a>

- *Type:* `java.lang.String`

---

##### `metadata`<sup>Optional</sup> <a name="org.cdk8s.plus22.DockerConfigSecretProps.parameter.metadata"></a>

- *Type:* [`org.cdk8s.ApiObjectMetadata`](#org.cdk8s.ApiObjectMetadata)

Metadata that all persisted resources must have, which includes all objects users must create.

---

##### `immutable`<sup>Optional</sup> <a name="org.cdk8s.plus22.DockerConfigSecretProps.parameter.immutable"></a>

- *Type:* `java.lang.Boolean`
- *Default:* false

If set to true, ensures that data stored in the Secret cannot be updated (only object metadata can be modified).

If not set to true, the field can be modified at any time.

---

##### `data`<sup>Required</sup> <a name="org.cdk8s.plus22.DockerConfigSecretProps.parameter.data"></a>

- *Type:* java.util.Map<java.lang.String, `java.lang.Object`>

JSON content to provide for the `~/.docker/config.json` file. This will be stringified and inserted as stringData.

> https://docs.docker.com/engine/reference/commandline/cli/#sample-configuration-file

---





### GCEPersistentDiskPersistentVolume <a name="org.cdk8s.plus22.GCEPersistentDiskPersistentVolume"></a>

GCEPersistentDisk represents a GCE Disk resource that is attached to a kubelet's host machine and then exposed to the pod.

Provisioned by an admin.

> https://kubernetes.io/docs/concepts/storage/volumes#gcepersistentdisk

#### Initializers <a name="org.cdk8s.plus22.GCEPersistentDiskPersistentVolume.Initializer"></a>

```java
import org.cdk8s.plus22.GCEPersistentDiskPersistentVolume;

GCEPersistentDiskPersistentVolume.Builder.create(Construct scope, java.lang.String id)
//  .metadata(ApiObjectMetadata)
//  .accessModes(java.util.List<PersistentVolumeAccessMode>)
//  .claim(IPersistentVolumeClaim)
//  .mountOptions(java.util.List<java.lang.String>)
//  .reclaimPolicy(PersistentVolumeReclaimPolicy)
//  .storage(Size)
//  .storageClassName(java.lang.String)
//  .volumeMode(PersistentVolumeMode)
    .pdName(java.lang.String)
//  .fsType(java.lang.String)
//  .partition(java.lang.Number)
//  .readOnly(java.lang.Boolean)
    .build();
```

##### `scope`<sup>Required</sup> <a name="org.cdk8s.plus22.GCEPersistentDiskPersistentVolume.parameter.scope"></a>

- *Type:* [`software.constructs.Construct`](#software.constructs.Construct)

---

##### `id`<sup>Required</sup> <a name="org.cdk8s.plus22.GCEPersistentDiskPersistentVolume.parameter.id"></a>

- *Type:* `java.lang.String`

---

##### `metadata`<sup>Optional</sup> <a name="org.cdk8s.plus22.GCEPersistentDiskPersistentVolumeProps.parameter.metadata"></a>

- *Type:* [`org.cdk8s.ApiObjectMetadata`](#org.cdk8s.ApiObjectMetadata)

Metadata that all persisted resources must have, which includes all objects users must create.

---

##### `accessModes`<sup>Optional</sup> <a name="org.cdk8s.plus22.GCEPersistentDiskPersistentVolumeProps.parameter.accessModes"></a>

- *Type:* java.util.List<[`org.cdk8s.plus22.PersistentVolumeAccessMode`](#org.cdk8s.plus22.PersistentVolumeAccessMode)>
- *Default:* No access modes.

Contains all ways the volume can be mounted.

> https://kubernetes.io/docs/concepts/storage/persistent-volumes#access-modes

---

##### `claim`<sup>Optional</sup> <a name="org.cdk8s.plus22.GCEPersistentDiskPersistentVolumeProps.parameter.claim"></a>

- *Type:* [`org.cdk8s.plus22.IPersistentVolumeClaim`](#org.cdk8s.plus22.IPersistentVolumeClaim)
- *Default:* Not bound to a specific claim.

Part of a bi-directional binding between PersistentVolume and PersistentVolumeClaim.

Expected to be non-nil when bound.

> https://kubernetes.io/docs/concepts/storage/persistent-volumes#binding

---

##### `mountOptions`<sup>Optional</sup> <a name="org.cdk8s.plus22.GCEPersistentDiskPersistentVolumeProps.parameter.mountOptions"></a>

- *Type:* java.util.List<`java.lang.String`>
- *Default:* No options.

A list of mount options, e.g. ["ro", "soft"]. Not validated - mount will simply fail if one is invalid.

> https://kubernetes.io/docs/concepts/storage/persistent-volumes/#mount-options

---

##### `reclaimPolicy`<sup>Optional</sup> <a name="org.cdk8s.plus22.GCEPersistentDiskPersistentVolumeProps.parameter.reclaimPolicy"></a>

- *Type:* [`org.cdk8s.plus22.PersistentVolumeReclaimPolicy`](#org.cdk8s.plus22.PersistentVolumeReclaimPolicy)
- *Default:* PersistentVolumeReclaimPolicy.RETAIN

When a user is done with their volume, they can delete the PVC objects from the API that allows reclamation of the resource.

The reclaim policy tells the cluster what to do with
the volume after it has been released of its claim.

> https://kubernetes.io/docs/concepts/storage/persistent-volumes#reclaiming

---

##### `storage`<sup>Optional</sup> <a name="org.cdk8s.plus22.GCEPersistentDiskPersistentVolumeProps.parameter.storage"></a>

- *Type:* [`org.cdk8s.Size`](#org.cdk8s.Size)
- *Default:* No specified.

What is the storage capacity of this volume.

> https://kubernetes.io/docs/concepts/storage/persistent-volumes#resources

---

##### `storageClassName`<sup>Optional</sup> <a name="org.cdk8s.plus22.GCEPersistentDiskPersistentVolumeProps.parameter.storageClassName"></a>

- *Type:* `java.lang.String`
- *Default:* Volume does not belong to any storage class.

Name of StorageClass to which this persistent volume belongs.

---

##### `volumeMode`<sup>Optional</sup> <a name="org.cdk8s.plus22.GCEPersistentDiskPersistentVolumeProps.parameter.volumeMode"></a>

- *Type:* [`org.cdk8s.plus22.PersistentVolumeMode`](#org.cdk8s.plus22.PersistentVolumeMode)
- *Default:* VolumeMode.FILE_SYSTEM

Defines what type of volume is required by the claim.

---

##### `pdName`<sup>Required</sup> <a name="org.cdk8s.plus22.GCEPersistentDiskPersistentVolumeProps.parameter.pdName"></a>

- *Type:* `java.lang.String`

Unique name of the PD resource in GCE.

Used to identify the disk in GCE.

> https://kubernetes.io/docs/concepts/storage/volumes#gcepersistentdisk

---

##### `fsType`<sup>Optional</sup> <a name="org.cdk8s.plus22.GCEPersistentDiskPersistentVolumeProps.parameter.fsType"></a>

- *Type:* `java.lang.String`
- *Default:* 'ext4'

Filesystem type of the volume that you want to mount.

Tip: Ensure that the filesystem type is supported by the host operating system.

> https://kubernetes.io/docs/concepts/storage/volumes#awselasticblockstore

---

##### `partition`<sup>Optional</sup> <a name="org.cdk8s.plus22.GCEPersistentDiskPersistentVolumeProps.parameter.partition"></a>

- *Type:* `java.lang.Number`
- *Default:* No partition.

The partition in the volume that you want to mount.

If omitted, the default is to mount by volume name.
Examples: For volume /dev/sda1, you specify the partition as "1".
Similarly, the volume partition for /dev/sda is "0" (or you can leave the property empty).

---

##### `readOnly`<sup>Optional</sup> <a name="org.cdk8s.plus22.GCEPersistentDiskPersistentVolumeProps.parameter.readOnly"></a>

- *Type:* `java.lang.Boolean`
- *Default:* false

Specify "true" to force and set the ReadOnly property in VolumeMounts to "true".

> https://kubernetes.io/docs/concepts/storage/volumes#awselasticblockstore

---



#### Properties <a name="Properties"></a>

##### `fsType`<sup>Required</sup> <a name="org.cdk8s.plus22.GCEPersistentDiskPersistentVolume.property.fsType"></a>

```java
public java.lang.String getFsType();
```

- *Type:* `java.lang.String`

File system type of this volume.

---

##### `pdName`<sup>Required</sup> <a name="org.cdk8s.plus22.GCEPersistentDiskPersistentVolume.property.pdName"></a>

```java
public java.lang.String getPdName();
```

- *Type:* `java.lang.String`

PD resource in GCE of this volume.

---

##### `readOnly`<sup>Required</sup> <a name="org.cdk8s.plus22.GCEPersistentDiskPersistentVolume.property.readOnly"></a>

```java
public java.lang.Boolean getReadOnly();
```

- *Type:* `java.lang.Boolean`

Whether or not it is mounted as a read-only volume.

---

##### `partition`<sup>Optional</sup> <a name="org.cdk8s.plus22.GCEPersistentDiskPersistentVolume.property.partition"></a>

```java
public java.lang.Number getPartition();
```

- *Type:* `java.lang.Number`

Partition of this volume.

---


### Ingress <a name="org.cdk8s.plus22.Ingress"></a>

Ingress is a collection of rules that allow inbound connections to reach the endpoints defined by a backend.

An Ingress can be configured to give services
externally-reachable urls, load balance traffic, terminate SSL, offer name
based virtual hosting etc.

#### Initializers <a name="org.cdk8s.plus22.Ingress.Initializer"></a>

```java
import org.cdk8s.plus22.Ingress;

Ingress.Builder.create(Construct scope, java.lang.String id)
//  .metadata(ApiObjectMetadata)
//  .defaultBackend(IngressBackend)
//  .rules(java.util.List<IngressRule>)
//  .tls(java.util.List<IngressTls>)
    .build();
```

##### `scope`<sup>Required</sup> <a name="org.cdk8s.plus22.Ingress.parameter.scope"></a>

- *Type:* [`software.constructs.Construct`](#software.constructs.Construct)

---

##### `id`<sup>Required</sup> <a name="org.cdk8s.plus22.Ingress.parameter.id"></a>

- *Type:* `java.lang.String`

---

##### `metadata`<sup>Optional</sup> <a name="org.cdk8s.plus22.IngressProps.parameter.metadata"></a>

- *Type:* [`org.cdk8s.ApiObjectMetadata`](#org.cdk8s.ApiObjectMetadata)

Metadata that all persisted resources must have, which includes all objects users must create.

---

##### `defaultBackend`<sup>Optional</sup> <a name="org.cdk8s.plus22.IngressProps.parameter.defaultBackend"></a>

- *Type:* [`org.cdk8s.plus22.IngressBackend`](#org.cdk8s.plus22.IngressBackend)

The default backend services requests that do not match any rule.

Using this option or the `addDefaultBackend()` method is equivalent to
adding a rule with both `path` and `host` undefined.

---

##### `rules`<sup>Optional</sup> <a name="org.cdk8s.plus22.IngressProps.parameter.rules"></a>

- *Type:* java.util.List<[`org.cdk8s.plus22.IngressRule`](#org.cdk8s.plus22.IngressRule)>

Routing rules for this ingress.

Each rule must define an `IngressBackend` that will receive the requests
that match this rule. If both `host` and `path` are not specifiec, this
backend will be used as the default backend of the ingress.

You can also add rules later using `addRule()`, `addHostRule()`,
`addDefaultBackend()` and `addHostDefaultBackend()`.

---

##### `tls`<sup>Optional</sup> <a name="org.cdk8s.plus22.IngressProps.parameter.tls"></a>

- *Type:* java.util.List<[`org.cdk8s.plus22.IngressTls`](#org.cdk8s.plus22.IngressTls)>

TLS settings for this ingress.

Using this option tells the ingress controller to expose a TLS endpoint.
Currently the Ingress only supports a single TLS port, 443. If multiple
members of this list specify different hosts, they will be multiplexed on
the same port according to the hostname specified through the SNI TLS
extension, if the ingress controller fulfilling the ingress supports SNI.

---

#### Methods <a name="Methods"></a>

##### `addDefaultBackend` <a name="org.cdk8s.plus22.Ingress.addDefaultBackend"></a>

```java
public addDefaultBackend(IngressBackend backend)
```

###### `backend`<sup>Required</sup> <a name="org.cdk8s.plus22.Ingress.parameter.backend"></a>

- *Type:* [`org.cdk8s.plus22.IngressBackend`](#org.cdk8s.plus22.IngressBackend)

The backend to use for requests that do not match any rule.

---

##### `addHostDefaultBackend` <a name="org.cdk8s.plus22.Ingress.addHostDefaultBackend"></a>

```java
public addHostDefaultBackend(java.lang.String host, IngressBackend backend)
```

###### `host`<sup>Required</sup> <a name="org.cdk8s.plus22.Ingress.parameter.host"></a>

- *Type:* `java.lang.String`

The host name to match.

---

###### `backend`<sup>Required</sup> <a name="org.cdk8s.plus22.Ingress.parameter.backend"></a>

- *Type:* [`org.cdk8s.plus22.IngressBackend`](#org.cdk8s.plus22.IngressBackend)

The backend to route to.

---

##### `addHostRule` <a name="org.cdk8s.plus22.Ingress.addHostRule"></a>

```java
public addHostRule(java.lang.String host, java.lang.String path, IngressBackend backend)
public addHostRule(java.lang.String host, java.lang.String path, IngressBackend backend, HttpIngressPathType pathType)
```

###### `host`<sup>Required</sup> <a name="org.cdk8s.plus22.Ingress.parameter.host"></a>

- *Type:* `java.lang.String`

The host name.

---

###### `path`<sup>Required</sup> <a name="org.cdk8s.plus22.Ingress.parameter.path"></a>

- *Type:* `java.lang.String`

The HTTP path.

---

###### `backend`<sup>Required</sup> <a name="org.cdk8s.plus22.Ingress.parameter.backend"></a>

- *Type:* [`org.cdk8s.plus22.IngressBackend`](#org.cdk8s.plus22.IngressBackend)

The backend to route requests to.

---

###### `pathType`<sup>Optional</sup> <a name="org.cdk8s.plus22.Ingress.parameter.pathType"></a>

- *Type:* [`org.cdk8s.plus22.HttpIngressPathType`](#org.cdk8s.plus22.HttpIngressPathType)

How the path is matched against request paths.

---

##### `addRule` <a name="org.cdk8s.plus22.Ingress.addRule"></a>

```java
public addRule(java.lang.String path, IngressBackend backend)
public addRule(java.lang.String path, IngressBackend backend, HttpIngressPathType pathType)
```

###### `path`<sup>Required</sup> <a name="org.cdk8s.plus22.Ingress.parameter.path"></a>

- *Type:* `java.lang.String`

The HTTP path.

---

###### `backend`<sup>Required</sup> <a name="org.cdk8s.plus22.Ingress.parameter.backend"></a>

- *Type:* [`org.cdk8s.plus22.IngressBackend`](#org.cdk8s.plus22.IngressBackend)

The backend to route requests to.

---

###### `pathType`<sup>Optional</sup> <a name="org.cdk8s.plus22.Ingress.parameter.pathType"></a>

- *Type:* [`org.cdk8s.plus22.HttpIngressPathType`](#org.cdk8s.plus22.HttpIngressPathType)

How the path is matched against request paths.

---

##### `addRules` <a name="org.cdk8s.plus22.Ingress.addRules"></a>

```java
public addRules(IngressRule rules)
```

###### `rules`<sup>Required</sup> <a name="org.cdk8s.plus22.Ingress.parameter.rules"></a>

- *Type:* [`org.cdk8s.plus22.IngressRule`](#org.cdk8s.plus22.IngressRule)

The rules to add.

---

##### `addTls` <a name="org.cdk8s.plus22.Ingress.addTls"></a>

```java
public addTls(java.util.List<IngressTls> tls)
```

###### `tls`<sup>Required</sup> <a name="org.cdk8s.plus22.Ingress.parameter.tls"></a>

- *Type:* java.util.List<[`org.cdk8s.plus22.IngressTls`](#org.cdk8s.plus22.IngressTls)>

---




### Job <a name="org.cdk8s.plus22.Job"></a>

- *Implements:* [`org.cdk8s.plus22.IPodTemplate`](#org.cdk8s.plus22.IPodTemplate)

A Job creates one or more Pods and ensures that a specified number of them successfully terminate.

As pods successfully complete,
the Job tracks the successful completions. When a specified number of successful completions is reached, the task (ie, Job) is complete.
Deleting a Job will clean up the Pods it created. A simple case is to create one Job object in order to reliably run one Pod to completion.
The Job object will start a new Pod if the first Pod fails or is deleted (for example due to a node hardware failure or a node reboot).
You can also use a Job to run multiple Pods in parallel.

#### Initializers <a name="org.cdk8s.plus22.Job.Initializer"></a>

```java
import org.cdk8s.plus22.Job;

Job.Builder.create(Construct scope, java.lang.String id)
//  .metadata(ApiObjectMetadata)
//  .containers(java.util.List<ContainerProps>)
//  .hostAliases(java.util.List<HostAlias>)
//  .initContainers(java.util.List<ContainerProps>)
//  .restartPolicy(RestartPolicy)
//  .securityContext(PodSecurityContextProps)
//  .serviceAccount(IServiceAccount)
//  .volumes(java.util.List<Volume>)
//  .podMetadata(ApiObjectMetadata)
//  .activeDeadline(Duration)
//  .backoffLimit(java.lang.Number)
//  .ttlAfterFinished(Duration)
    .build();
```

##### `scope`<sup>Required</sup> <a name="org.cdk8s.plus22.Job.parameter.scope"></a>

- *Type:* [`software.constructs.Construct`](#software.constructs.Construct)

---

##### `id`<sup>Required</sup> <a name="org.cdk8s.plus22.Job.parameter.id"></a>

- *Type:* `java.lang.String`

---

##### `metadata`<sup>Optional</sup> <a name="org.cdk8s.plus22.JobProps.parameter.metadata"></a>

- *Type:* [`org.cdk8s.ApiObjectMetadata`](#org.cdk8s.ApiObjectMetadata)

Metadata that all persisted resources must have, which includes all objects users must create.

---

##### `containers`<sup>Optional</sup> <a name="org.cdk8s.plus22.JobProps.parameter.containers"></a>

- *Type:* java.util.List<[`org.cdk8s.plus22.ContainerProps`](#org.cdk8s.plus22.ContainerProps)>
- *Default:* No containers. Note that a pod spec must include at least one container.

List of containers belonging to the pod.

Containers cannot currently be
added or removed. There must be at least one container in a Pod.

You can add additionnal containers using `podSpec.addContainer()`

---

##### `hostAliases`<sup>Optional</sup> <a name="org.cdk8s.plus22.JobProps.parameter.hostAliases"></a>

- *Type:* java.util.List<[`org.cdk8s.plus22.HostAlias`](#org.cdk8s.plus22.HostAlias)>

HostAlias holds the mapping between IP and hostnames that will be injected as an entry in the pod's hosts file.

---

##### `initContainers`<sup>Optional</sup> <a name="org.cdk8s.plus22.JobProps.parameter.initContainers"></a>

- *Type:* java.util.List<[`org.cdk8s.plus22.ContainerProps`](#org.cdk8s.plus22.ContainerProps)>
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

##### `restartPolicy`<sup>Optional</sup> <a name="org.cdk8s.plus22.JobProps.parameter.restartPolicy"></a>

- *Type:* [`org.cdk8s.plus22.RestartPolicy`](#org.cdk8s.plus22.RestartPolicy)
- *Default:* RestartPolicy.ALWAYS

Restart policy for all containers within the pod.

> https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle/#restart-policy

---

##### `securityContext`<sup>Optional</sup> <a name="org.cdk8s.plus22.JobProps.parameter.securityContext"></a>

- *Type:* [`org.cdk8s.plus22.PodSecurityContextProps`](#org.cdk8s.plus22.PodSecurityContextProps)
- *Default:* fsGroupChangePolicy: FsGroupChangePolicy.FsGroupChangePolicy.ALWAYS
  ensureNonRoot: false

SecurityContext holds pod-level security attributes and common container settings.

---

##### `serviceAccount`<sup>Optional</sup> <a name="org.cdk8s.plus22.JobProps.parameter.serviceAccount"></a>

- *Type:* [`org.cdk8s.plus22.IServiceAccount`](#org.cdk8s.plus22.IServiceAccount)
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

##### `volumes`<sup>Optional</sup> <a name="org.cdk8s.plus22.JobProps.parameter.volumes"></a>

- *Type:* java.util.List<[`org.cdk8s.plus22.Volume`](#org.cdk8s.plus22.Volume)>
- *Default:* No volumes.

List of volumes that can be mounted by containers belonging to the pod.

You can also add volumes later using `podSpec.addVolume()`

> https://kubernetes.io/docs/concepts/storage/volumes

---

##### `podMetadata`<sup>Optional</sup> <a name="org.cdk8s.plus22.JobProps.parameter.podMetadata"></a>

- *Type:* [`org.cdk8s.ApiObjectMetadata`](#org.cdk8s.ApiObjectMetadata)

The pod metadata.

---

##### `activeDeadline`<sup>Optional</sup> <a name="org.cdk8s.plus22.JobProps.parameter.activeDeadline"></a>

- *Type:* [`org.cdk8s.Duration`](#org.cdk8s.Duration)
- *Default:* If unset, then there is no deadline.

Specifies the duration the job may be active before the system tries to terminate it.

---

##### `backoffLimit`<sup>Optional</sup> <a name="org.cdk8s.plus22.JobProps.parameter.backoffLimit"></a>

- *Type:* `java.lang.Number`
- *Default:* If not set, system defaults to 6.

Specifies the number of retries before marking this job failed.

---

##### `ttlAfterFinished`<sup>Optional</sup> <a name="org.cdk8s.plus22.JobProps.parameter.ttlAfterFinished"></a>

- *Type:* [`org.cdk8s.Duration`](#org.cdk8s.Duration)
- *Default:* If this field is unset, the Job won't be automatically deleted.

Limits the lifetime of a Job that has finished execution (either Complete or Failed).

If this field is set, after the Job finishes, it is eligible to
be automatically deleted. When the Job is being deleted, its lifecycle
guarantees (e.g. finalizers) will be honored. If this field is set to zero,
the Job becomes eligible to be deleted immediately after it finishes. This
field is alpha-level and is only honored by servers that enable the
`TTLAfterFinished` feature.

---

#### Methods <a name="Methods"></a>

##### `addContainer` <a name="org.cdk8s.plus22.Job.addContainer"></a>

```java
public addContainer(ContainerProps container)
```

###### `container`<sup>Required</sup> <a name="org.cdk8s.plus22.Job.parameter.container"></a>

- *Type:* [`org.cdk8s.plus22.ContainerProps`](#org.cdk8s.plus22.ContainerProps)

---

##### `addHostAlias` <a name="org.cdk8s.plus22.Job.addHostAlias"></a>

```java
public addHostAlias(HostAlias hostAlias)
```

###### `hostAlias`<sup>Required</sup> <a name="org.cdk8s.plus22.Job.parameter.hostAlias"></a>

- *Type:* [`org.cdk8s.plus22.HostAlias`](#org.cdk8s.plus22.HostAlias)

---

##### `addInitContainer` <a name="org.cdk8s.plus22.Job.addInitContainer"></a>

```java
public addInitContainer(ContainerProps container)
```

###### `container`<sup>Required</sup> <a name="org.cdk8s.plus22.Job.parameter.container"></a>

- *Type:* [`org.cdk8s.plus22.ContainerProps`](#org.cdk8s.plus22.ContainerProps)

---

##### `addVolume` <a name="org.cdk8s.plus22.Job.addVolume"></a>

```java
public addVolume(Volume volume)
```

###### `volume`<sup>Required</sup> <a name="org.cdk8s.plus22.Job.parameter.volume"></a>

- *Type:* [`org.cdk8s.plus22.Volume`](#org.cdk8s.plus22.Volume)

---


#### Properties <a name="Properties"></a>

##### `containers`<sup>Required</sup> <a name="org.cdk8s.plus22.Job.property.containers"></a>

```java
public java.util.List<Container> getContainers();
```

- *Type:* java.util.List<[`org.cdk8s.plus22.Container`](#org.cdk8s.plus22.Container)>

The containers belonging to the pod.

Use `addContainer` to add containers.

---

##### `hostAliases`<sup>Required</sup> <a name="org.cdk8s.plus22.Job.property.hostAliases"></a>

```java
public java.util.List<HostAlias> getHostAliases();
```

- *Type:* java.util.List<[`org.cdk8s.plus22.HostAlias`](#org.cdk8s.plus22.HostAlias)>

An optional list of hosts and IPs that will be injected into the pod's hosts file if specified.

This is only valid for non-hostNetwork pods.

---

##### `initContainers`<sup>Required</sup> <a name="org.cdk8s.plus22.Job.property.initContainers"></a>

```java
public java.util.List<Container> getInitContainers();
```

- *Type:* java.util.List<[`org.cdk8s.plus22.Container`](#org.cdk8s.plus22.Container)>

The init containers belonging to the pod.

Use `addInitContainer` to add init containers.

---

##### `podMetadata`<sup>Required</sup> <a name="org.cdk8s.plus22.Job.property.podMetadata"></a>

```java
public ApiObjectMetadataDefinition getPodMetadata();
```

- *Type:* [`org.cdk8s.ApiObjectMetadataDefinition`](#org.cdk8s.ApiObjectMetadataDefinition)

Provides read/write access to the underlying pod metadata of the resource.

---

##### `securityContext`<sup>Required</sup> <a name="org.cdk8s.plus22.Job.property.securityContext"></a>

```java
public PodSecurityContext getSecurityContext();
```

- *Type:* [`org.cdk8s.plus22.PodSecurityContext`](#org.cdk8s.plus22.PodSecurityContext)

---

##### `volumes`<sup>Required</sup> <a name="org.cdk8s.plus22.Job.property.volumes"></a>

```java
public java.util.List<Volume> getVolumes();
```

- *Type:* java.util.List<[`org.cdk8s.plus22.Volume`](#org.cdk8s.plus22.Volume)>

The volumes associated with this pod.

Use `addVolume` to add volumes.

---

##### `activeDeadline`<sup>Optional</sup> <a name="org.cdk8s.plus22.Job.property.activeDeadline"></a>

```java
public Duration getActiveDeadline();
```

- *Type:* [`org.cdk8s.Duration`](#org.cdk8s.Duration)

Duration before job is terminated.

If undefined, there is no deadline.

---

##### `backoffLimit`<sup>Optional</sup> <a name="org.cdk8s.plus22.Job.property.backoffLimit"></a>

```java
public java.lang.Number getBackoffLimit();
```

- *Type:* `java.lang.Number`

Number of retries before marking failed.

---

##### `restartPolicy`<sup>Optional</sup> <a name="org.cdk8s.plus22.Job.property.restartPolicy"></a>

```java
public RestartPolicy getRestartPolicy();
```

- *Type:* [`org.cdk8s.plus22.RestartPolicy`](#org.cdk8s.plus22.RestartPolicy)

Restart policy for all containers within the pod.

---

##### `serviceAccount`<sup>Optional</sup> <a name="org.cdk8s.plus22.Job.property.serviceAccount"></a>

```java
public IServiceAccount getServiceAccount();
```

- *Type:* [`org.cdk8s.plus22.IServiceAccount`](#org.cdk8s.plus22.IServiceAccount)

The service account used to run this pod.

---

##### `ttlAfterFinished`<sup>Optional</sup> <a name="org.cdk8s.plus22.Job.property.ttlAfterFinished"></a>

```java
public Duration getTtlAfterFinished();
```

- *Type:* [`org.cdk8s.Duration`](#org.cdk8s.Duration)

TTL before the job is deleted after it is finished.

---


### PersistentVolume <a name="org.cdk8s.plus22.PersistentVolume"></a>

- *Implements:* [`org.cdk8s.plus22.IPersistentVolume`](#org.cdk8s.plus22.IPersistentVolume), [`org.cdk8s.plus22.IStorage`](#org.cdk8s.plus22.IStorage)

A PersistentVolume (PV) is a piece of storage in the cluster that has been provisioned by an administrator or dynamically provisioned using Storage Classes.

It is a resource in the cluster just like a node is a cluster resource.
PVs are volume plugins like Volumes, but have a lifecycle independent of any
individual Pod that uses the PV. This API object captures the details of the
implementation of the storage, be that NFS, iSCSI, or a
cloud-provider-specific storage system.

#### Initializers <a name="org.cdk8s.plus22.PersistentVolume.Initializer"></a>

```java
import org.cdk8s.plus22.PersistentVolume;

PersistentVolume.Builder.create(Construct scope, java.lang.String id)
//  .metadata(ApiObjectMetadata)
//  .accessModes(java.util.List<PersistentVolumeAccessMode>)
//  .claim(IPersistentVolumeClaim)
//  .mountOptions(java.util.List<java.lang.String>)
//  .reclaimPolicy(PersistentVolumeReclaimPolicy)
//  .storage(Size)
//  .storageClassName(java.lang.String)
//  .volumeMode(PersistentVolumeMode)
    .build();
```

##### `scope`<sup>Required</sup> <a name="org.cdk8s.plus22.PersistentVolume.parameter.scope"></a>

- *Type:* [`software.constructs.Construct`](#software.constructs.Construct)

---

##### `id`<sup>Required</sup> <a name="org.cdk8s.plus22.PersistentVolume.parameter.id"></a>

- *Type:* `java.lang.String`

---

##### `metadata`<sup>Optional</sup> <a name="org.cdk8s.plus22.PersistentVolumeProps.parameter.metadata"></a>

- *Type:* [`org.cdk8s.ApiObjectMetadata`](#org.cdk8s.ApiObjectMetadata)

Metadata that all persisted resources must have, which includes all objects users must create.

---

##### `accessModes`<sup>Optional</sup> <a name="org.cdk8s.plus22.PersistentVolumeProps.parameter.accessModes"></a>

- *Type:* java.util.List<[`org.cdk8s.plus22.PersistentVolumeAccessMode`](#org.cdk8s.plus22.PersistentVolumeAccessMode)>
- *Default:* No access modes.

Contains all ways the volume can be mounted.

> https://kubernetes.io/docs/concepts/storage/persistent-volumes#access-modes

---

##### `claim`<sup>Optional</sup> <a name="org.cdk8s.plus22.PersistentVolumeProps.parameter.claim"></a>

- *Type:* [`org.cdk8s.plus22.IPersistentVolumeClaim`](#org.cdk8s.plus22.IPersistentVolumeClaim)
- *Default:* Not bound to a specific claim.

Part of a bi-directional binding between PersistentVolume and PersistentVolumeClaim.

Expected to be non-nil when bound.

> https://kubernetes.io/docs/concepts/storage/persistent-volumes#binding

---

##### `mountOptions`<sup>Optional</sup> <a name="org.cdk8s.plus22.PersistentVolumeProps.parameter.mountOptions"></a>

- *Type:* java.util.List<`java.lang.String`>
- *Default:* No options.

A list of mount options, e.g. ["ro", "soft"]. Not validated - mount will simply fail if one is invalid.

> https://kubernetes.io/docs/concepts/storage/persistent-volumes/#mount-options

---

##### `reclaimPolicy`<sup>Optional</sup> <a name="org.cdk8s.plus22.PersistentVolumeProps.parameter.reclaimPolicy"></a>

- *Type:* [`org.cdk8s.plus22.PersistentVolumeReclaimPolicy`](#org.cdk8s.plus22.PersistentVolumeReclaimPolicy)
- *Default:* PersistentVolumeReclaimPolicy.RETAIN

When a user is done with their volume, they can delete the PVC objects from the API that allows reclamation of the resource.

The reclaim policy tells the cluster what to do with
the volume after it has been released of its claim.

> https://kubernetes.io/docs/concepts/storage/persistent-volumes#reclaiming

---

##### `storage`<sup>Optional</sup> <a name="org.cdk8s.plus22.PersistentVolumeProps.parameter.storage"></a>

- *Type:* [`org.cdk8s.Size`](#org.cdk8s.Size)
- *Default:* No specified.

What is the storage capacity of this volume.

> https://kubernetes.io/docs/concepts/storage/persistent-volumes#resources

---

##### `storageClassName`<sup>Optional</sup> <a name="org.cdk8s.plus22.PersistentVolumeProps.parameter.storageClassName"></a>

- *Type:* `java.lang.String`
- *Default:* Volume does not belong to any storage class.

Name of StorageClass to which this persistent volume belongs.

---

##### `volumeMode`<sup>Optional</sup> <a name="org.cdk8s.plus22.PersistentVolumeProps.parameter.volumeMode"></a>

- *Type:* [`org.cdk8s.plus22.PersistentVolumeMode`](#org.cdk8s.plus22.PersistentVolumeMode)
- *Default:* VolumeMode.FILE_SYSTEM

Defines what type of volume is required by the claim.

---

#### Methods <a name="Methods"></a>

##### `asVolume` <a name="org.cdk8s.plus22.PersistentVolume.asVolume"></a>

```java
public asVolume()
```

##### `bind` <a name="org.cdk8s.plus22.PersistentVolume.bind"></a>

```java
public bind(IPersistentVolumeClaim pvc)
```

###### `pvc`<sup>Required</sup> <a name="org.cdk8s.plus22.PersistentVolume.parameter.pvc"></a>

- *Type:* [`org.cdk8s.plus22.IPersistentVolumeClaim`](#org.cdk8s.plus22.IPersistentVolumeClaim)

The PVC to bind to.

---

##### `reserve` <a name="org.cdk8s.plus22.PersistentVolume.reserve"></a>

```java
public reserve()
```

#### Static Functions <a name="Static Functions"></a>

##### `fromPersistentVolumeName` <a name="org.cdk8s.plus22.PersistentVolume.fromPersistentVolumeName"></a>

```java
import org.cdk8s.plus22.PersistentVolume;

PersistentVolume.fromPersistentVolumeName(java.lang.String volumeName)
```

###### `volumeName`<sup>Required</sup> <a name="org.cdk8s.plus22.PersistentVolume.parameter.volumeName"></a>

- *Type:* `java.lang.String`

The name of the pv to reference.

---

#### Properties <a name="Properties"></a>

##### `mode`<sup>Required</sup> <a name="org.cdk8s.plus22.PersistentVolume.property.mode"></a>

```java
public PersistentVolumeMode getMode();
```

- *Type:* [`org.cdk8s.plus22.PersistentVolumeMode`](#org.cdk8s.plus22.PersistentVolumeMode)

Volume mode of this volume.

---

##### `reclaimPolicy`<sup>Required</sup> <a name="org.cdk8s.plus22.PersistentVolume.property.reclaimPolicy"></a>

```java
public PersistentVolumeReclaimPolicy getReclaimPolicy();
```

- *Type:* [`org.cdk8s.plus22.PersistentVolumeReclaimPolicy`](#org.cdk8s.plus22.PersistentVolumeReclaimPolicy)

Reclaim policy of this volume.

---

##### `accessModes`<sup>Optional</sup> <a name="org.cdk8s.plus22.PersistentVolume.property.accessModes"></a>

```java
public java.util.List<PersistentVolumeAccessMode> getAccessModes();
```

- *Type:* java.util.List<[`org.cdk8s.plus22.PersistentVolumeAccessMode`](#org.cdk8s.plus22.PersistentVolumeAccessMode)>

Access modes requirement of this claim.

---

##### `claim`<sup>Optional</sup> <a name="org.cdk8s.plus22.PersistentVolume.property.claim"></a>

```java
public IPersistentVolumeClaim getClaim();
```

- *Type:* [`org.cdk8s.plus22.IPersistentVolumeClaim`](#org.cdk8s.plus22.IPersistentVolumeClaim)

PVC this volume is bound to.

Undefined means this volume is not yet
claimed by any PVC.

---

##### `mountOptions`<sup>Optional</sup> <a name="org.cdk8s.plus22.PersistentVolume.property.mountOptions"></a>

```java
public java.util.List<java.lang.String> getMountOptions();
```

- *Type:* java.util.List<`java.lang.String`>

Mount options of this volume.

---

##### `storage`<sup>Optional</sup> <a name="org.cdk8s.plus22.PersistentVolume.property.storage"></a>

```java
public Size getStorage();
```

- *Type:* [`org.cdk8s.Size`](#org.cdk8s.Size)

Storage size of this volume.

---

##### `storageClassName`<sup>Optional</sup> <a name="org.cdk8s.plus22.PersistentVolume.property.storageClassName"></a>

```java
public java.lang.String getStorageClassName();
```

- *Type:* `java.lang.String`

Storage class this volume belongs to.

---


### PersistentVolumeClaim <a name="org.cdk8s.plus22.PersistentVolumeClaim"></a>

- *Implements:* [`org.cdk8s.plus22.IPersistentVolumeClaim`](#org.cdk8s.plus22.IPersistentVolumeClaim)

A PersistentVolumeClaim (PVC) is a request for storage by a user.

It is similar to a Pod. Pods consume node resources and PVCs consume PV resources.
Pods can request specific levels of resources (CPU and Memory).
Claims can request specific size and access modes

#### Initializers <a name="org.cdk8s.plus22.PersistentVolumeClaim.Initializer"></a>

```java
import org.cdk8s.plus22.PersistentVolumeClaim;

PersistentVolumeClaim.Builder.create(Construct scope, java.lang.String id)
//  .metadata(ApiObjectMetadata)
//  .accessModes(java.util.List<PersistentVolumeAccessMode>)
//  .storage(Size)
//  .storageClassName(java.lang.String)
//  .volume(IPersistentVolume)
//  .volumeMode(PersistentVolumeMode)
    .build();
```

##### `scope`<sup>Required</sup> <a name="org.cdk8s.plus22.PersistentVolumeClaim.parameter.scope"></a>

- *Type:* [`software.constructs.Construct`](#software.constructs.Construct)

---

##### `id`<sup>Required</sup> <a name="org.cdk8s.plus22.PersistentVolumeClaim.parameter.id"></a>

- *Type:* `java.lang.String`

---

##### `metadata`<sup>Optional</sup> <a name="org.cdk8s.plus22.PersistentVolumeClaimProps.parameter.metadata"></a>

- *Type:* [`org.cdk8s.ApiObjectMetadata`](#org.cdk8s.ApiObjectMetadata)

Metadata that all persisted resources must have, which includes all objects users must create.

---

##### `accessModes`<sup>Optional</sup> <a name="org.cdk8s.plus22.PersistentVolumeClaimProps.parameter.accessModes"></a>

- *Type:* java.util.List<[`org.cdk8s.plus22.PersistentVolumeAccessMode`](#org.cdk8s.plus22.PersistentVolumeAccessMode)>
- *Default:* No access modes requirement.

Contains the access modes the volume should support.

> https://kubernetes.io/docs/concepts/storage/persistent-volumes#access-modes-1

---

##### `storage`<sup>Optional</sup> <a name="org.cdk8s.plus22.PersistentVolumeClaimProps.parameter.storage"></a>

- *Type:* [`org.cdk8s.Size`](#org.cdk8s.Size)
- *Default:* No storage requirement.

Minimum storage size the volume should have.

> https://kubernetes.io/docs/concepts/storage/persistent-volumes#resources

---

##### `storageClassName`<sup>Optional</sup> <a name="org.cdk8s.plus22.PersistentVolumeClaimProps.parameter.storageClassName"></a>

- *Type:* `java.lang.String`
- *Default:* Not set.

Name of the StorageClass required by the claim. When this property is not set, the behavior is as follows:.

* If the admission plugin is turned on, the storage class marked as default will be used.
* If the admission plugin is turned off, the pvc can only be bound to volumes without a storage class.

> https://kubernetes.io/docs/concepts/storage/persistent-volumes#class-1

---

##### `volume`<sup>Optional</sup> <a name="org.cdk8s.plus22.PersistentVolumeClaimProps.parameter.volume"></a>

- *Type:* [`org.cdk8s.plus22.IPersistentVolume`](#org.cdk8s.plus22.IPersistentVolume)
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

##### `volumeMode`<sup>Optional</sup> <a name="org.cdk8s.plus22.PersistentVolumeClaimProps.parameter.volumeMode"></a>

- *Type:* [`org.cdk8s.plus22.PersistentVolumeMode`](#org.cdk8s.plus22.PersistentVolumeMode)
- *Default:* VolumeMode.FILE_SYSTEM

Defines what type of volume is required by the claim.

---

#### Methods <a name="Methods"></a>

##### `bind` <a name="org.cdk8s.plus22.PersistentVolumeClaim.bind"></a>

```java
public bind(IPersistentVolume pv)
```

###### `pv`<sup>Required</sup> <a name="org.cdk8s.plus22.PersistentVolumeClaim.parameter.pv"></a>

- *Type:* [`org.cdk8s.plus22.IPersistentVolume`](#org.cdk8s.plus22.IPersistentVolume)

The PV to bind to.

---

#### Static Functions <a name="Static Functions"></a>

##### `fromClaimName` <a name="org.cdk8s.plus22.PersistentVolumeClaim.fromClaimName"></a>

```java
import org.cdk8s.plus22.PersistentVolumeClaim;

PersistentVolumeClaim.fromClaimName(java.lang.String claimName)
```

###### `claimName`<sup>Required</sup> <a name="org.cdk8s.plus22.PersistentVolumeClaim.parameter.claimName"></a>

- *Type:* `java.lang.String`

The name of the pvc to reference.

---

#### Properties <a name="Properties"></a>

##### `volumeMode`<sup>Required</sup> <a name="org.cdk8s.plus22.PersistentVolumeClaim.property.volumeMode"></a>

```java
public PersistentVolumeMode getVolumeMode();
```

- *Type:* [`org.cdk8s.plus22.PersistentVolumeMode`](#org.cdk8s.plus22.PersistentVolumeMode)

Volume mode requirement of this claim.

---

##### `accessModes`<sup>Optional</sup> <a name="org.cdk8s.plus22.PersistentVolumeClaim.property.accessModes"></a>

```java
public java.util.List<PersistentVolumeAccessMode> getAccessModes();
```

- *Type:* java.util.List<[`org.cdk8s.plus22.PersistentVolumeAccessMode`](#org.cdk8s.plus22.PersistentVolumeAccessMode)>

Access modes requirement of this claim.

---

##### `storage`<sup>Optional</sup> <a name="org.cdk8s.plus22.PersistentVolumeClaim.property.storage"></a>

```java
public Size getStorage();
```

- *Type:* [`org.cdk8s.Size`](#org.cdk8s.Size)

Storage requirement of this claim.

---

##### `storageClassName`<sup>Optional</sup> <a name="org.cdk8s.plus22.PersistentVolumeClaim.property.storageClassName"></a>

```java
public java.lang.String getStorageClassName();
```

- *Type:* `java.lang.String`

Storage class requirment of this claim.

---

##### `volume`<sup>Optional</sup> <a name="org.cdk8s.plus22.PersistentVolumeClaim.property.volume"></a>

```java
public IPersistentVolume getVolume();
```

- *Type:* [`org.cdk8s.plus22.IPersistentVolume`](#org.cdk8s.plus22.IPersistentVolume)

PV this claim is bound to.

Undefined means the claim is not bound
to any specific volume.

---


### Pod <a name="org.cdk8s.plus22.Pod"></a>

- *Implements:* [`org.cdk8s.plus22.IPodSpec`](#org.cdk8s.plus22.IPodSpec)

Pod is a collection of containers that can run on a host.

This resource is
created by clients and scheduled onto hosts.

#### Initializers <a name="org.cdk8s.plus22.Pod.Initializer"></a>

```java
import org.cdk8s.plus22.Pod;

Pod.Builder.create(Construct scope, java.lang.String id)
//  .metadata(ApiObjectMetadata)
//  .containers(java.util.List<ContainerProps>)
//  .hostAliases(java.util.List<HostAlias>)
//  .initContainers(java.util.List<ContainerProps>)
//  .restartPolicy(RestartPolicy)
//  .securityContext(PodSecurityContextProps)
//  .serviceAccount(IServiceAccount)
//  .volumes(java.util.List<Volume>)
    .build();
```

##### `scope`<sup>Required</sup> <a name="org.cdk8s.plus22.Pod.parameter.scope"></a>

- *Type:* [`software.constructs.Construct`](#software.constructs.Construct)

---

##### `id`<sup>Required</sup> <a name="org.cdk8s.plus22.Pod.parameter.id"></a>

- *Type:* `java.lang.String`

---

##### `metadata`<sup>Optional</sup> <a name="org.cdk8s.plus22.PodProps.parameter.metadata"></a>

- *Type:* [`org.cdk8s.ApiObjectMetadata`](#org.cdk8s.ApiObjectMetadata)

Metadata that all persisted resources must have, which includes all objects users must create.

---

##### `containers`<sup>Optional</sup> <a name="org.cdk8s.plus22.PodProps.parameter.containers"></a>

- *Type:* java.util.List<[`org.cdk8s.plus22.ContainerProps`](#org.cdk8s.plus22.ContainerProps)>
- *Default:* No containers. Note that a pod spec must include at least one container.

List of containers belonging to the pod.

Containers cannot currently be
added or removed. There must be at least one container in a Pod.

You can add additionnal containers using `podSpec.addContainer()`

---

##### `hostAliases`<sup>Optional</sup> <a name="org.cdk8s.plus22.PodProps.parameter.hostAliases"></a>

- *Type:* java.util.List<[`org.cdk8s.plus22.HostAlias`](#org.cdk8s.plus22.HostAlias)>

HostAlias holds the mapping between IP and hostnames that will be injected as an entry in the pod's hosts file.

---

##### `initContainers`<sup>Optional</sup> <a name="org.cdk8s.plus22.PodProps.parameter.initContainers"></a>

- *Type:* java.util.List<[`org.cdk8s.plus22.ContainerProps`](#org.cdk8s.plus22.ContainerProps)>
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

##### `restartPolicy`<sup>Optional</sup> <a name="org.cdk8s.plus22.PodProps.parameter.restartPolicy"></a>

- *Type:* [`org.cdk8s.plus22.RestartPolicy`](#org.cdk8s.plus22.RestartPolicy)
- *Default:* RestartPolicy.ALWAYS

Restart policy for all containers within the pod.

> https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle/#restart-policy

---

##### `securityContext`<sup>Optional</sup> <a name="org.cdk8s.plus22.PodProps.parameter.securityContext"></a>

- *Type:* [`org.cdk8s.plus22.PodSecurityContextProps`](#org.cdk8s.plus22.PodSecurityContextProps)
- *Default:* fsGroupChangePolicy: FsGroupChangePolicy.FsGroupChangePolicy.ALWAYS
  ensureNonRoot: false

SecurityContext holds pod-level security attributes and common container settings.

---

##### `serviceAccount`<sup>Optional</sup> <a name="org.cdk8s.plus22.PodProps.parameter.serviceAccount"></a>

- *Type:* [`org.cdk8s.plus22.IServiceAccount`](#org.cdk8s.plus22.IServiceAccount)
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

##### `volumes`<sup>Optional</sup> <a name="org.cdk8s.plus22.PodProps.parameter.volumes"></a>

- *Type:* java.util.List<[`org.cdk8s.plus22.Volume`](#org.cdk8s.plus22.Volume)>
- *Default:* No volumes.

List of volumes that can be mounted by containers belonging to the pod.

You can also add volumes later using `podSpec.addVolume()`

> https://kubernetes.io/docs/concepts/storage/volumes

---

#### Methods <a name="Methods"></a>

##### `addContainer` <a name="org.cdk8s.plus22.Pod.addContainer"></a>

```java
public addContainer(ContainerProps container)
```

###### `container`<sup>Required</sup> <a name="org.cdk8s.plus22.Pod.parameter.container"></a>

- *Type:* [`org.cdk8s.plus22.ContainerProps`](#org.cdk8s.plus22.ContainerProps)

---

##### `addHostAlias` <a name="org.cdk8s.plus22.Pod.addHostAlias"></a>

```java
public addHostAlias(HostAlias hostAlias)
```

###### `hostAlias`<sup>Required</sup> <a name="org.cdk8s.plus22.Pod.parameter.hostAlias"></a>

- *Type:* [`org.cdk8s.plus22.HostAlias`](#org.cdk8s.plus22.HostAlias)

---

##### `addInitContainer` <a name="org.cdk8s.plus22.Pod.addInitContainer"></a>

```java
public addInitContainer(ContainerProps container)
```

###### `container`<sup>Required</sup> <a name="org.cdk8s.plus22.Pod.parameter.container"></a>

- *Type:* [`org.cdk8s.plus22.ContainerProps`](#org.cdk8s.plus22.ContainerProps)

---

##### `addVolume` <a name="org.cdk8s.plus22.Pod.addVolume"></a>

```java
public addVolume(Volume volume)
```

###### `volume`<sup>Required</sup> <a name="org.cdk8s.plus22.Pod.parameter.volume"></a>

- *Type:* [`org.cdk8s.plus22.Volume`](#org.cdk8s.plus22.Volume)

---


#### Properties <a name="Properties"></a>

##### `containers`<sup>Required</sup> <a name="org.cdk8s.plus22.Pod.property.containers"></a>

```java
public java.util.List<Container> getContainers();
```

- *Type:* java.util.List<[`org.cdk8s.plus22.Container`](#org.cdk8s.plus22.Container)>

The containers belonging to the pod.

Use `addContainer` to add containers.

---

##### `hostAliases`<sup>Required</sup> <a name="org.cdk8s.plus22.Pod.property.hostAliases"></a>

```java
public java.util.List<HostAlias> getHostAliases();
```

- *Type:* java.util.List<[`org.cdk8s.plus22.HostAlias`](#org.cdk8s.plus22.HostAlias)>

An optional list of hosts and IPs that will be injected into the pod's hosts file if specified.

This is only valid for non-hostNetwork pods.

---

##### `initContainers`<sup>Required</sup> <a name="org.cdk8s.plus22.Pod.property.initContainers"></a>

```java
public java.util.List<Container> getInitContainers();
```

- *Type:* java.util.List<[`org.cdk8s.plus22.Container`](#org.cdk8s.plus22.Container)>

The init containers belonging to the pod.

Use `addInitContainer` to add init containers.

---

##### `securityContext`<sup>Required</sup> <a name="org.cdk8s.plus22.Pod.property.securityContext"></a>

```java
public PodSecurityContext getSecurityContext();
```

- *Type:* [`org.cdk8s.plus22.PodSecurityContext`](#org.cdk8s.plus22.PodSecurityContext)

---

##### `volumes`<sup>Required</sup> <a name="org.cdk8s.plus22.Pod.property.volumes"></a>

```java
public java.util.List<Volume> getVolumes();
```

- *Type:* java.util.List<[`org.cdk8s.plus22.Volume`](#org.cdk8s.plus22.Volume)>

The volumes associated with this pod.

Use `addVolume` to add volumes.

---

##### `restartPolicy`<sup>Optional</sup> <a name="org.cdk8s.plus22.Pod.property.restartPolicy"></a>

```java
public RestartPolicy getRestartPolicy();
```

- *Type:* [`org.cdk8s.plus22.RestartPolicy`](#org.cdk8s.plus22.RestartPolicy)

Restart policy for all containers within the pod.

---

##### `serviceAccount`<sup>Optional</sup> <a name="org.cdk8s.plus22.Pod.property.serviceAccount"></a>

```java
public IServiceAccount getServiceAccount();
```

- *Type:* [`org.cdk8s.plus22.IServiceAccount`](#org.cdk8s.plus22.IServiceAccount)

The service account used to run this pod.

---


### Resource <a name="org.cdk8s.plus22.Resource"></a>

- *Implements:* [`org.cdk8s.plus22.IResource`](#org.cdk8s.plus22.IResource)

Base class for all Kubernetes objects in stdk8s.

Represents a single
resource.

#### Initializers <a name="org.cdk8s.plus22.Resource.Initializer"></a>

```java
import org.cdk8s.plus22.Resource;

Resource.Builder.create(Construct scope, java.lang.String id)
//  .nodeFactory(INodeFactory)
    .build();
```

##### `scope`<sup>Required</sup> <a name="org.cdk8s.plus22.Resource.parameter.scope"></a>

- *Type:* [`software.constructs.Construct`](#software.constructs.Construct)

The scope in which to define this construct.

---

##### `id`<sup>Required</sup> <a name="org.cdk8s.plus22.Resource.parameter.id"></a>

- *Type:* `java.lang.String`

The scoped construct ID.

Must be unique amongst siblings. If
the ID includes a path separator (`/`), then it will be replaced by double
dash `--`.

---

##### `nodeFactory`<sup>Optional</sup> <a name="software.constructs.ConstructOptions.parameter.nodeFactory"></a>

- *Type:* [`software.constructs.INodeFactory`](#software.constructs.INodeFactory)
- *Default:* the default `Node` is associated

A factory for attaching `Node`s to the construct.

---



#### Properties <a name="Properties"></a>

##### `metadata`<sup>Required</sup> <a name="org.cdk8s.plus22.Resource.property.metadata"></a>

```java
public ApiObjectMetadataDefinition getMetadata();
```

- *Type:* [`org.cdk8s.ApiObjectMetadataDefinition`](#org.cdk8s.ApiObjectMetadataDefinition)

---

##### `name`<sup>Required</sup> <a name="org.cdk8s.plus22.Resource.property.name"></a>

```java
public java.lang.String getName();
```

- *Type:* `java.lang.String`

The name of this API object.

---


### Secret <a name="org.cdk8s.plus22.Secret"></a>

- *Implements:* [`org.cdk8s.plus22.ISecret`](#org.cdk8s.plus22.ISecret)

Kubernetes Secrets let you store and manage sensitive information, such as passwords, OAuth tokens, and ssh keys.

Storing confidential information in a
Secret is safer and more flexible than putting it verbatim in a Pod
definition or in a container image.

> https://kubernetes.io/docs/concepts/configuration/secret

#### Initializers <a name="org.cdk8s.plus22.Secret.Initializer"></a>

```java
import org.cdk8s.plus22.Secret;

Secret.Builder.create(Construct scope, java.lang.String id)
//  .metadata(ApiObjectMetadata)
//  .immutable(java.lang.Boolean)
//  .stringData(java.util.Map<java.lang.String, java.lang.String>)
//  .type(java.lang.String)
    .build();
```

##### `scope`<sup>Required</sup> <a name="org.cdk8s.plus22.Secret.parameter.scope"></a>

- *Type:* [`software.constructs.Construct`](#software.constructs.Construct)

---

##### `id`<sup>Required</sup> <a name="org.cdk8s.plus22.Secret.parameter.id"></a>

- *Type:* `java.lang.String`

---

##### `metadata`<sup>Optional</sup> <a name="org.cdk8s.plus22.SecretProps.parameter.metadata"></a>

- *Type:* [`org.cdk8s.ApiObjectMetadata`](#org.cdk8s.ApiObjectMetadata)

Metadata that all persisted resources must have, which includes all objects users must create.

---

##### `immutable`<sup>Optional</sup> <a name="org.cdk8s.plus22.SecretProps.parameter.immutable"></a>

- *Type:* `java.lang.Boolean`
- *Default:* false

If set to true, ensures that data stored in the Secret cannot be updated (only object metadata can be modified).

If not set to true, the field can be modified at any time.

---

##### `stringData`<sup>Optional</sup> <a name="org.cdk8s.plus22.SecretProps.parameter.stringData"></a>

- *Type:* java.util.Map<java.lang.String, `java.lang.String`>

stringData allows specifying non-binary secret data in string form.

It is
provided as a write-only convenience method. All keys and values are merged
into the data field on write, overwriting any existing values. It is never
output when reading from the API.

---

##### `type`<sup>Optional</sup> <a name="org.cdk8s.plus22.SecretProps.parameter.type"></a>

- *Type:* `java.lang.String`
- *Default:* undefined - Don't set a type.

Optional type associated with the secret.

Used to facilitate programmatic
handling of secret data by various controllers.

---

#### Methods <a name="Methods"></a>

##### `addStringData` <a name="org.cdk8s.plus22.Secret.addStringData"></a>

```java
public addStringData(java.lang.String key, java.lang.String value)
```

###### `key`<sup>Required</sup> <a name="org.cdk8s.plus22.Secret.parameter.key"></a>

- *Type:* `java.lang.String`

Key.

---

###### `value`<sup>Required</sup> <a name="org.cdk8s.plus22.Secret.parameter.value"></a>

- *Type:* `java.lang.String`

Value.

---

##### `getStringData` <a name="org.cdk8s.plus22.Secret.getStringData"></a>

```java
public getStringData(java.lang.String key)
```

###### `key`<sup>Required</sup> <a name="org.cdk8s.plus22.Secret.parameter.key"></a>

- *Type:* `java.lang.String`

Key.

---

#### Static Functions <a name="Static Functions"></a>

##### `fromSecretName` <a name="org.cdk8s.plus22.Secret.fromSecretName"></a>

```java
import org.cdk8s.plus22.Secret;

Secret.fromSecretName(java.lang.String name)
```

###### `name`<sup>Required</sup> <a name="org.cdk8s.plus22.Secret.parameter.name"></a>

- *Type:* `java.lang.String`

The name of the secret to reference.

---

#### Properties <a name="Properties"></a>

##### `immutable`<sup>Required</sup> <a name="org.cdk8s.plus22.Secret.property.immutable"></a>

```java
public java.lang.Boolean getImmutable();
```

- *Type:* `java.lang.Boolean`

Whether or not the secret is immutable.

---


### Service <a name="org.cdk8s.plus22.Service"></a>

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

#### Initializers <a name="org.cdk8s.plus22.Service.Initializer"></a>

```java
import org.cdk8s.plus22.Service;

Service.Builder.create(Construct scope, java.lang.String id)
//  .metadata(ApiObjectMetadata)
//  .clusterIP(java.lang.String)
//  .externalIPs(java.util.List<java.lang.String>)
//  .externalName(java.lang.String)
//  .loadBalancerSourceRanges(java.util.List<java.lang.String>)
//  .ports(java.util.List<ServicePort>)
//  .type(ServiceType)
    .build();
```

##### `scope`<sup>Required</sup> <a name="org.cdk8s.plus22.Service.parameter.scope"></a>

- *Type:* [`software.constructs.Construct`](#software.constructs.Construct)

---

##### `id`<sup>Required</sup> <a name="org.cdk8s.plus22.Service.parameter.id"></a>

- *Type:* `java.lang.String`

---

##### `metadata`<sup>Optional</sup> <a name="org.cdk8s.plus22.ServiceProps.parameter.metadata"></a>

- *Type:* [`org.cdk8s.ApiObjectMetadata`](#org.cdk8s.ApiObjectMetadata)

Metadata that all persisted resources must have, which includes all objects users must create.

---

##### `clusterIP`<sup>Optional</sup> <a name="org.cdk8s.plus22.ServiceProps.parameter.clusterIP"></a>

- *Type:* `java.lang.String`
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

##### `externalIPs`<sup>Optional</sup> <a name="org.cdk8s.plus22.ServiceProps.parameter.externalIPs"></a>

- *Type:* java.util.List<`java.lang.String`>
- *Default:* No external IPs.

A list of IP addresses for which nodes in the cluster will also accept traffic for this service.

These IPs are not managed by Kubernetes. The user
is responsible for ensuring that traffic arrives at a node with this IP. A
common example is external load-balancers that are not part of the
Kubernetes system.

---

##### `externalName`<sup>Optional</sup> <a name="org.cdk8s.plus22.ServiceProps.parameter.externalName"></a>

- *Type:* `java.lang.String`
- *Default:* No external name.

The externalName to be used when ServiceType.EXTERNAL_NAME is set.

---

##### `loadBalancerSourceRanges`<sup>Optional</sup> <a name="org.cdk8s.plus22.ServiceProps.parameter.loadBalancerSourceRanges"></a>

- *Type:* java.util.List<`java.lang.String`>

A list of CIDR IP addresses, if specified and supported by the platform, will restrict traffic through the cloud-provider load-balancer to the specified client IPs.

More info: https://kubernetes.io/docs/tasks/access-application-cluster/configure-cloud-provider-firewall/

---

##### `ports`<sup>Optional</sup> <a name="org.cdk8s.plus22.ServiceProps.parameter.ports"></a>

- *Type:* java.util.List<[`org.cdk8s.plus22.ServicePort`](#org.cdk8s.plus22.ServicePort)>

The port exposed by this service.

More info: https://kubernetes.io/docs/concepts/services-networking/service/#virtual-ips-and-service-proxies

---

##### `type`<sup>Optional</sup> <a name="org.cdk8s.plus22.ServiceProps.parameter.type"></a>

- *Type:* [`org.cdk8s.plus22.ServiceType`](#org.cdk8s.plus22.ServiceType)
- *Default:* ServiceType.ClusterIP

Determines how the Service is exposed.

More info: https://kubernetes.io/docs/concepts/services-networking/service/#publishing-services-service-types

---

#### Methods <a name="Methods"></a>

##### `addDeployment` <a name="org.cdk8s.plus22.Service.addDeployment"></a>

```java
public addDeployment(Deployment deployment)
public addDeployment(Deployment deployment, AddDeploymentOptions options)
```

###### `deployment`<sup>Required</sup> <a name="org.cdk8s.plus22.Service.parameter.deployment"></a>

- *Type:* [`org.cdk8s.plus22.Deployment`](#org.cdk8s.plus22.Deployment)

The deployment to expose.

---

###### `options`<sup>Optional</sup> <a name="org.cdk8s.plus22.Service.parameter.options"></a>

- *Type:* [`org.cdk8s.plus22.AddDeploymentOptions`](#org.cdk8s.plus22.AddDeploymentOptions)

Optional settings for the port.

---

##### `addSelector` <a name="org.cdk8s.plus22.Service.addSelector"></a>

```java
public addSelector(java.lang.String label, java.lang.String value)
```

###### `label`<sup>Required</sup> <a name="org.cdk8s.plus22.Service.parameter.label"></a>

- *Type:* `java.lang.String`

The label key.

---

###### `value`<sup>Required</sup> <a name="org.cdk8s.plus22.Service.parameter.value"></a>

- *Type:* `java.lang.String`

The label value.

---

##### `exposeViaIngress` <a name="org.cdk8s.plus22.Service.exposeViaIngress"></a>

```java
public exposeViaIngress(java.lang.String path)
public exposeViaIngress(java.lang.String path, ExposeServiceViaIngressOptions options)
```

###### `path`<sup>Required</sup> <a name="org.cdk8s.plus22.Service.parameter.path"></a>

- *Type:* `java.lang.String`

The path to expose the service under.

---

###### `options`<sup>Optional</sup> <a name="org.cdk8s.plus22.Service.parameter.options"></a>

- *Type:* [`org.cdk8s.plus22.ExposeServiceViaIngressOptions`](#org.cdk8s.plus22.ExposeServiceViaIngressOptions)

Additional options.

---

##### `serve` <a name="org.cdk8s.plus22.Service.serve"></a>

```java
public serve(java.lang.Number port)
public serve(java.lang.Number port, ServicePortOptions options)
```

###### `port`<sup>Required</sup> <a name="org.cdk8s.plus22.Service.parameter.port"></a>

- *Type:* `java.lang.Number`

The port definition.

---

###### `options`<sup>Optional</sup> <a name="org.cdk8s.plus22.Service.parameter.options"></a>

- *Type:* [`org.cdk8s.plus22.ServicePortOptions`](#org.cdk8s.plus22.ServicePortOptions)

---


#### Properties <a name="Properties"></a>

##### `ports`<sup>Required</sup> <a name="org.cdk8s.plus22.Service.property.ports"></a>

```java
public java.util.List<ServicePort> getPorts();
```

- *Type:* java.util.List<[`org.cdk8s.plus22.ServicePort`](#org.cdk8s.plus22.ServicePort)>

Ports for this service.

Use `serve()` to expose additional service ports.

---

##### `selector`<sup>Required</sup> <a name="org.cdk8s.plus22.Service.property.selector"></a>

```java
public java.util.Map<java.lang.String, java.lang.String> getSelector();
```

- *Type:* java.util.Map<java.lang.String, `java.lang.String`>

Returns the labels which are used to select pods for this service.

---

##### `type`<sup>Required</sup> <a name="org.cdk8s.plus22.Service.property.type"></a>

```java
public ServiceType getType();
```

- *Type:* [`org.cdk8s.plus22.ServiceType`](#org.cdk8s.plus22.ServiceType)

Determines how the Service is exposed.

---

##### `clusterIP`<sup>Optional</sup> <a name="org.cdk8s.plus22.Service.property.clusterIP"></a>

```java
public java.lang.String getClusterIP();
```

- *Type:* `java.lang.String`

The IP address of the service and is usually assigned randomly by the master.

---

##### `externalName`<sup>Optional</sup> <a name="org.cdk8s.plus22.Service.property.externalName"></a>

```java
public java.lang.String getExternalName();
```

- *Type:* `java.lang.String`

The externalName to be used for EXTERNAL_NAME types.

---


### ServiceAccount <a name="org.cdk8s.plus22.ServiceAccount"></a>

- *Implements:* [`org.cdk8s.plus22.IServiceAccount`](#org.cdk8s.plus22.IServiceAccount)

A service account provides an identity for processes that run in a Pod.

When you (a human) access the cluster (for example, using kubectl), you are
authenticated by the apiserver as a particular User Account (currently this
is usually admin, unless your cluster administrator has customized your
cluster). Processes in containers inside pods can also contact the apiserver.
When they do, they are authenticated as a particular Service Account (for
example, default).

> https://kubernetes.io/docs/tasks/configure-pod-container/configure-service-account

#### Initializers <a name="org.cdk8s.plus22.ServiceAccount.Initializer"></a>

```java
import org.cdk8s.plus22.ServiceAccount;

ServiceAccount.Builder.create(Construct scope, java.lang.String id)
//  .metadata(ApiObjectMetadata)
//  .secrets(java.util.List<ISecret>)
    .build();
```

##### `scope`<sup>Required</sup> <a name="org.cdk8s.plus22.ServiceAccount.parameter.scope"></a>

- *Type:* [`software.constructs.Construct`](#software.constructs.Construct)

---

##### `id`<sup>Required</sup> <a name="org.cdk8s.plus22.ServiceAccount.parameter.id"></a>

- *Type:* `java.lang.String`

---

##### `metadata`<sup>Optional</sup> <a name="org.cdk8s.plus22.ServiceAccountProps.parameter.metadata"></a>

- *Type:* [`org.cdk8s.ApiObjectMetadata`](#org.cdk8s.ApiObjectMetadata)

Metadata that all persisted resources must have, which includes all objects users must create.

---

##### `secrets`<sup>Optional</sup> <a name="org.cdk8s.plus22.ServiceAccountProps.parameter.secrets"></a>

- *Type:* java.util.List<[`org.cdk8s.plus22.ISecret`](#org.cdk8s.plus22.ISecret)>

List of secrets allowed to be used by pods running using this ServiceAccount.

> https://kubernetes.io/docs/concepts/configuration/secret

---

#### Methods <a name="Methods"></a>

##### `addSecret` <a name="org.cdk8s.plus22.ServiceAccount.addSecret"></a>

```java
public addSecret(ISecret secret)
```

###### `secret`<sup>Required</sup> <a name="org.cdk8s.plus22.ServiceAccount.parameter.secret"></a>

- *Type:* [`org.cdk8s.plus22.ISecret`](#org.cdk8s.plus22.ISecret)

The secret.

---

#### Static Functions <a name="Static Functions"></a>

##### `fromServiceAccountName` <a name="org.cdk8s.plus22.ServiceAccount.fromServiceAccountName"></a>

```java
import org.cdk8s.plus22.ServiceAccount;

ServiceAccount.fromServiceAccountName(java.lang.String name)
```

###### `name`<sup>Required</sup> <a name="org.cdk8s.plus22.ServiceAccount.parameter.name"></a>

- *Type:* `java.lang.String`

The name of the service account resource.

---

#### Properties <a name="Properties"></a>

##### `secrets`<sup>Required</sup> <a name="org.cdk8s.plus22.ServiceAccount.property.secrets"></a>

```java
public java.util.List<ISecret> getSecrets();
```

- *Type:* java.util.List<[`org.cdk8s.plus22.ISecret`](#org.cdk8s.plus22.ISecret)>

List of secrets allowed to be used by pods running using this service account.

Returns a copy. To add a secret, use `addSecret()`.

---


### ServiceAccountTokenSecret <a name="org.cdk8s.plus22.ServiceAccountTokenSecret"></a>

Create a secret for a service account token.

> https://kubernetes.io/docs/concepts/configuration/secret/#service-account-token-secrets

#### Initializers <a name="org.cdk8s.plus22.ServiceAccountTokenSecret.Initializer"></a>

```java
import org.cdk8s.plus22.ServiceAccountTokenSecret;

ServiceAccountTokenSecret.Builder.create(Construct scope, java.lang.String id)
//  .metadata(ApiObjectMetadata)
//  .immutable(java.lang.Boolean)
    .serviceAccount(IServiceAccount)
    .build();
```

##### `scope`<sup>Required</sup> <a name="org.cdk8s.plus22.ServiceAccountTokenSecret.parameter.scope"></a>

- *Type:* [`software.constructs.Construct`](#software.constructs.Construct)

---

##### `id`<sup>Required</sup> <a name="org.cdk8s.plus22.ServiceAccountTokenSecret.parameter.id"></a>

- *Type:* `java.lang.String`

---

##### `metadata`<sup>Optional</sup> <a name="org.cdk8s.plus22.ServiceAccountTokenSecretProps.parameter.metadata"></a>

- *Type:* [`org.cdk8s.ApiObjectMetadata`](#org.cdk8s.ApiObjectMetadata)

Metadata that all persisted resources must have, which includes all objects users must create.

---

##### `immutable`<sup>Optional</sup> <a name="org.cdk8s.plus22.ServiceAccountTokenSecretProps.parameter.immutable"></a>

- *Type:* `java.lang.Boolean`
- *Default:* false

If set to true, ensures that data stored in the Secret cannot be updated (only object metadata can be modified).

If not set to true, the field can be modified at any time.

---

##### `serviceAccount`<sup>Required</sup> <a name="org.cdk8s.plus22.ServiceAccountTokenSecretProps.parameter.serviceAccount"></a>

- *Type:* [`org.cdk8s.plus22.IServiceAccount`](#org.cdk8s.plus22.IServiceAccount)

The service account to store a secret for.

---





### SshAuthSecret <a name="org.cdk8s.plus22.SshAuthSecret"></a>

Create a secret for ssh authentication.

> https://kubernetes.io/docs/concepts/configuration/secret/#ssh-authentication-secrets

#### Initializers <a name="org.cdk8s.plus22.SshAuthSecret.Initializer"></a>

```java
import org.cdk8s.plus22.SshAuthSecret;

SshAuthSecret.Builder.create(Construct scope, java.lang.String id)
//  .metadata(ApiObjectMetadata)
//  .immutable(java.lang.Boolean)
    .sshPrivateKey(java.lang.String)
    .build();
```

##### `scope`<sup>Required</sup> <a name="org.cdk8s.plus22.SshAuthSecret.parameter.scope"></a>

- *Type:* [`software.constructs.Construct`](#software.constructs.Construct)

---

##### `id`<sup>Required</sup> <a name="org.cdk8s.plus22.SshAuthSecret.parameter.id"></a>

- *Type:* `java.lang.String`

---

##### `metadata`<sup>Optional</sup> <a name="org.cdk8s.plus22.SshAuthSecretProps.parameter.metadata"></a>

- *Type:* [`org.cdk8s.ApiObjectMetadata`](#org.cdk8s.ApiObjectMetadata)

Metadata that all persisted resources must have, which includes all objects users must create.

---

##### `immutable`<sup>Optional</sup> <a name="org.cdk8s.plus22.SshAuthSecretProps.parameter.immutable"></a>

- *Type:* `java.lang.Boolean`
- *Default:* false

If set to true, ensures that data stored in the Secret cannot be updated (only object metadata can be modified).

If not set to true, the field can be modified at any time.

---

##### `sshPrivateKey`<sup>Required</sup> <a name="org.cdk8s.plus22.SshAuthSecretProps.parameter.sshPrivateKey"></a>

- *Type:* `java.lang.String`

The SSH private key to use.

---





### StatefulSet <a name="org.cdk8s.plus22.StatefulSet"></a>

- *Implements:* [`org.cdk8s.plus22.IPodTemplate`](#org.cdk8s.plus22.IPodTemplate)

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

## Using StatefulSets

StatefulSets are valuable for applications that require one or more of the following.

* Stable, unique network identifiers.
* Stable, persistent storage.
* Ordered, graceful deployment and scaling.
* Ordered, automated rolling updates.

#### Initializers <a name="org.cdk8s.plus22.StatefulSet.Initializer"></a>

```java
import org.cdk8s.plus22.StatefulSet;

StatefulSet.Builder.create(Construct scope, java.lang.String id)
//  .metadata(ApiObjectMetadata)
//  .containers(java.util.List<ContainerProps>)
//  .hostAliases(java.util.List<HostAlias>)
//  .initContainers(java.util.List<ContainerProps>)
//  .restartPolicy(RestartPolicy)
//  .securityContext(PodSecurityContextProps)
//  .serviceAccount(IServiceAccount)
//  .volumes(java.util.List<Volume>)
//  .podMetadata(ApiObjectMetadata)
    .service(Service)
//  .defaultSelector(java.lang.Boolean)
//  .podManagementPolicy(PodManagementPolicy)
//  .replicas(java.lang.Number)
    .build();
```

##### `scope`<sup>Required</sup> <a name="org.cdk8s.plus22.StatefulSet.parameter.scope"></a>

- *Type:* [`software.constructs.Construct`](#software.constructs.Construct)

---

##### `id`<sup>Required</sup> <a name="org.cdk8s.plus22.StatefulSet.parameter.id"></a>

- *Type:* `java.lang.String`

---

##### `metadata`<sup>Optional</sup> <a name="org.cdk8s.plus22.StatefulSetProps.parameter.metadata"></a>

- *Type:* [`org.cdk8s.ApiObjectMetadata`](#org.cdk8s.ApiObjectMetadata)

Metadata that all persisted resources must have, which includes all objects users must create.

---

##### `containers`<sup>Optional</sup> <a name="org.cdk8s.plus22.StatefulSetProps.parameter.containers"></a>

- *Type:* java.util.List<[`org.cdk8s.plus22.ContainerProps`](#org.cdk8s.plus22.ContainerProps)>
- *Default:* No containers. Note that a pod spec must include at least one container.

List of containers belonging to the pod.

Containers cannot currently be
added or removed. There must be at least one container in a Pod.

You can add additionnal containers using `podSpec.addContainer()`

---

##### `hostAliases`<sup>Optional</sup> <a name="org.cdk8s.plus22.StatefulSetProps.parameter.hostAliases"></a>

- *Type:* java.util.List<[`org.cdk8s.plus22.HostAlias`](#org.cdk8s.plus22.HostAlias)>

HostAlias holds the mapping between IP and hostnames that will be injected as an entry in the pod's hosts file.

---

##### `initContainers`<sup>Optional</sup> <a name="org.cdk8s.plus22.StatefulSetProps.parameter.initContainers"></a>

- *Type:* java.util.List<[`org.cdk8s.plus22.ContainerProps`](#org.cdk8s.plus22.ContainerProps)>
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

##### `restartPolicy`<sup>Optional</sup> <a name="org.cdk8s.plus22.StatefulSetProps.parameter.restartPolicy"></a>

- *Type:* [`org.cdk8s.plus22.RestartPolicy`](#org.cdk8s.plus22.RestartPolicy)
- *Default:* RestartPolicy.ALWAYS

Restart policy for all containers within the pod.

> https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle/#restart-policy

---

##### `securityContext`<sup>Optional</sup> <a name="org.cdk8s.plus22.StatefulSetProps.parameter.securityContext"></a>

- *Type:* [`org.cdk8s.plus22.PodSecurityContextProps`](#org.cdk8s.plus22.PodSecurityContextProps)
- *Default:* fsGroupChangePolicy: FsGroupChangePolicy.FsGroupChangePolicy.ALWAYS
  ensureNonRoot: false

SecurityContext holds pod-level security attributes and common container settings.

---

##### `serviceAccount`<sup>Optional</sup> <a name="org.cdk8s.plus22.StatefulSetProps.parameter.serviceAccount"></a>

- *Type:* [`org.cdk8s.plus22.IServiceAccount`](#org.cdk8s.plus22.IServiceAccount)
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

##### `volumes`<sup>Optional</sup> <a name="org.cdk8s.plus22.StatefulSetProps.parameter.volumes"></a>

- *Type:* java.util.List<[`org.cdk8s.plus22.Volume`](#org.cdk8s.plus22.Volume)>
- *Default:* No volumes.

List of volumes that can be mounted by containers belonging to the pod.

You can also add volumes later using `podSpec.addVolume()`

> https://kubernetes.io/docs/concepts/storage/volumes

---

##### `podMetadata`<sup>Optional</sup> <a name="org.cdk8s.plus22.StatefulSetProps.parameter.podMetadata"></a>

- *Type:* [`org.cdk8s.ApiObjectMetadata`](#org.cdk8s.ApiObjectMetadata)

The pod metadata.

---

##### `service`<sup>Required</sup> <a name="org.cdk8s.plus22.StatefulSetProps.parameter.service"></a>

- *Type:* [`org.cdk8s.plus22.Service`](#org.cdk8s.plus22.Service)

Service to associate with the statefulset.

---

##### `defaultSelector`<sup>Optional</sup> <a name="org.cdk8s.plus22.StatefulSetProps.parameter.defaultSelector"></a>

- *Type:* `java.lang.Boolean`
- *Default:* true

Automatically allocates a pod selector for this statefulset.

If this is set to `false` you must define your selector through
`statefulset.podMetadata.addLabel()` and `statefulset.selectByLabel()`.

---

##### `podManagementPolicy`<sup>Optional</sup> <a name="org.cdk8s.plus22.StatefulSetProps.parameter.podManagementPolicy"></a>

- *Type:* [`org.cdk8s.plus22.PodManagementPolicy`](#org.cdk8s.plus22.PodManagementPolicy)
- *Default:* PodManagementPolicy.ORDERED_READY

Pod management policy to use for this statefulset.

---

##### `replicas`<sup>Optional</sup> <a name="org.cdk8s.plus22.StatefulSetProps.parameter.replicas"></a>

- *Type:* `java.lang.Number`
- *Default:* 1

Number of desired pods.

---

#### Methods <a name="Methods"></a>

##### `addContainer` <a name="org.cdk8s.plus22.StatefulSet.addContainer"></a>

```java
public addContainer(ContainerProps container)
```

###### `container`<sup>Required</sup> <a name="org.cdk8s.plus22.StatefulSet.parameter.container"></a>

- *Type:* [`org.cdk8s.plus22.ContainerProps`](#org.cdk8s.plus22.ContainerProps)

---

##### `addHostAlias` <a name="org.cdk8s.plus22.StatefulSet.addHostAlias"></a>

```java
public addHostAlias(HostAlias hostAlias)
```

###### `hostAlias`<sup>Required</sup> <a name="org.cdk8s.plus22.StatefulSet.parameter.hostAlias"></a>

- *Type:* [`org.cdk8s.plus22.HostAlias`](#org.cdk8s.plus22.HostAlias)

---

##### `addInitContainer` <a name="org.cdk8s.plus22.StatefulSet.addInitContainer"></a>

```java
public addInitContainer(ContainerProps container)
```

###### `container`<sup>Required</sup> <a name="org.cdk8s.plus22.StatefulSet.parameter.container"></a>

- *Type:* [`org.cdk8s.plus22.ContainerProps`](#org.cdk8s.plus22.ContainerProps)

---

##### `addVolume` <a name="org.cdk8s.plus22.StatefulSet.addVolume"></a>

```java
public addVolume(Volume volume)
```

###### `volume`<sup>Required</sup> <a name="org.cdk8s.plus22.StatefulSet.parameter.volume"></a>

- *Type:* [`org.cdk8s.plus22.Volume`](#org.cdk8s.plus22.Volume)

---

##### `selectByLabel` <a name="org.cdk8s.plus22.StatefulSet.selectByLabel"></a>

```java
public selectByLabel(java.lang.String key, java.lang.String value)
```

###### `key`<sup>Required</sup> <a name="org.cdk8s.plus22.StatefulSet.parameter.key"></a>

- *Type:* `java.lang.String`

The label key.

---

###### `value`<sup>Required</sup> <a name="org.cdk8s.plus22.StatefulSet.parameter.value"></a>

- *Type:* `java.lang.String`

The label value.

---


#### Properties <a name="Properties"></a>

##### `containers`<sup>Required</sup> <a name="org.cdk8s.plus22.StatefulSet.property.containers"></a>

```java
public java.util.List<Container> getContainers();
```

- *Type:* java.util.List<[`org.cdk8s.plus22.Container`](#org.cdk8s.plus22.Container)>

The containers belonging to the pod.

Use `addContainer` to add containers.

---

##### `hostAliases`<sup>Required</sup> <a name="org.cdk8s.plus22.StatefulSet.property.hostAliases"></a>

```java
public java.util.List<HostAlias> getHostAliases();
```

- *Type:* java.util.List<[`org.cdk8s.plus22.HostAlias`](#org.cdk8s.plus22.HostAlias)>

An optional list of hosts and IPs that will be injected into the pod's hosts file if specified.

This is only valid for non-hostNetwork pods.

---

##### `initContainers`<sup>Required</sup> <a name="org.cdk8s.plus22.StatefulSet.property.initContainers"></a>

```java
public java.util.List<Container> getInitContainers();
```

- *Type:* java.util.List<[`org.cdk8s.plus22.Container`](#org.cdk8s.plus22.Container)>

The init containers belonging to the pod.

Use `addInitContainer` to add init containers.

---

##### `labelSelector`<sup>Required</sup> <a name="org.cdk8s.plus22.StatefulSet.property.labelSelector"></a>

```java
public java.util.Map<java.lang.String, java.lang.String> getLabelSelector();
```

- *Type:* java.util.Map<java.lang.String, `java.lang.String`>

The labels this statefulset will match against in order to select pods.

Returns a a copy. Use `selectByLabel()` to add labels.

---

##### `podManagementPolicy`<sup>Required</sup> <a name="org.cdk8s.plus22.StatefulSet.property.podManagementPolicy"></a>

```java
public PodManagementPolicy getPodManagementPolicy();
```

- *Type:* [`org.cdk8s.plus22.PodManagementPolicy`](#org.cdk8s.plus22.PodManagementPolicy)

Management policy to use for the set.

---

##### `podMetadata`<sup>Required</sup> <a name="org.cdk8s.plus22.StatefulSet.property.podMetadata"></a>

```java
public ApiObjectMetadataDefinition getPodMetadata();
```

- *Type:* [`org.cdk8s.ApiObjectMetadataDefinition`](#org.cdk8s.ApiObjectMetadataDefinition)

Provides read/write access to the underlying pod metadata of the resource.

---

##### `replicas`<sup>Required</sup> <a name="org.cdk8s.plus22.StatefulSet.property.replicas"></a>

```java
public java.lang.Number getReplicas();
```

- *Type:* `java.lang.Number`

Number of desired pods.

---

##### `securityContext`<sup>Required</sup> <a name="org.cdk8s.plus22.StatefulSet.property.securityContext"></a>

```java
public PodSecurityContext getSecurityContext();
```

- *Type:* [`org.cdk8s.plus22.PodSecurityContext`](#org.cdk8s.plus22.PodSecurityContext)

---

##### `volumes`<sup>Required</sup> <a name="org.cdk8s.plus22.StatefulSet.property.volumes"></a>

```java
public java.util.List<Volume> getVolumes();
```

- *Type:* java.util.List<[`org.cdk8s.plus22.Volume`](#org.cdk8s.plus22.Volume)>

The volumes associated with this pod.

Use `addVolume` to add volumes.

---

##### `restartPolicy`<sup>Optional</sup> <a name="org.cdk8s.plus22.StatefulSet.property.restartPolicy"></a>

```java
public RestartPolicy getRestartPolicy();
```

- *Type:* [`org.cdk8s.plus22.RestartPolicy`](#org.cdk8s.plus22.RestartPolicy)

Restart policy for all containers within the pod.

---

##### `serviceAccount`<sup>Optional</sup> <a name="org.cdk8s.plus22.StatefulSet.property.serviceAccount"></a>

```java
public IServiceAccount getServiceAccount();
```

- *Type:* [`org.cdk8s.plus22.IServiceAccount`](#org.cdk8s.plus22.IServiceAccount)

The service account used to run this pod.

---


### TlsSecret <a name="org.cdk8s.plus22.TlsSecret"></a>

Create a secret for storing a TLS certificate and its associated key.

> https://kubernetes.io/docs/concepts/configuration/secret/#tls-secrets

#### Initializers <a name="org.cdk8s.plus22.TlsSecret.Initializer"></a>

```java
import org.cdk8s.plus22.TlsSecret;

TlsSecret.Builder.create(Construct scope, java.lang.String id)
//  .metadata(ApiObjectMetadata)
//  .immutable(java.lang.Boolean)
    .tlsCert(java.lang.String)
    .tlsKey(java.lang.String)
    .build();
```

##### `scope`<sup>Required</sup> <a name="org.cdk8s.plus22.TlsSecret.parameter.scope"></a>

- *Type:* [`software.constructs.Construct`](#software.constructs.Construct)

---

##### `id`<sup>Required</sup> <a name="org.cdk8s.plus22.TlsSecret.parameter.id"></a>

- *Type:* `java.lang.String`

---

##### `metadata`<sup>Optional</sup> <a name="org.cdk8s.plus22.TlsSecretProps.parameter.metadata"></a>

- *Type:* [`org.cdk8s.ApiObjectMetadata`](#org.cdk8s.ApiObjectMetadata)

Metadata that all persisted resources must have, which includes all objects users must create.

---

##### `immutable`<sup>Optional</sup> <a name="org.cdk8s.plus22.TlsSecretProps.parameter.immutable"></a>

- *Type:* `java.lang.Boolean`
- *Default:* false

If set to true, ensures that data stored in the Secret cannot be updated (only object metadata can be modified).

If not set to true, the field can be modified at any time.

---

##### `tlsCert`<sup>Required</sup> <a name="org.cdk8s.plus22.TlsSecretProps.parameter.tlsCert"></a>

- *Type:* `java.lang.String`

The TLS cert.

---

##### `tlsKey`<sup>Required</sup> <a name="org.cdk8s.plus22.TlsSecretProps.parameter.tlsKey"></a>

- *Type:* `java.lang.String`

The TLS key.

---





## Structs <a name="Structs"></a>

### AddDeploymentOptions <a name="org.cdk8s.plus22.AddDeploymentOptions"></a>

Options to add a deployment to a service.

#### Initializer <a name="[object Object].Initializer"></a>

```java
import org.cdk8s.plus22.AddDeploymentOptions;

AddDeploymentOptions.builder()
//  .name(java.lang.String)
//  .nodePort(java.lang.Number)
//  .protocol(Protocol)
//  .targetPort(java.lang.Number)
//  .port(java.lang.Number)
    .build();
```

##### `name`<sup>Optional</sup> <a name="org.cdk8s.plus22.AddDeploymentOptions.property.name"></a>

```java
public java.lang.String getName();
```

- *Type:* `java.lang.String`

The name of this port within the service.

This must be a DNS_LABEL. All
ports within a ServiceSpec must have unique names. This maps to the 'Name'
field in EndpointPort objects. Optional if only one ServicePort is defined
on this service.

---

##### `nodePort`<sup>Optional</sup> <a name="org.cdk8s.plus22.AddDeploymentOptions.property.nodePort"></a>

```java
public java.lang.Number getNodePort();
```

- *Type:* `java.lang.Number`
- *Default:* auto-allocate a port if the ServiceType of this Service requires one.

The port on each node on which this service is exposed when type=NodePort or LoadBalancer.

Usually assigned by the system. If specified, it will be
allocated to the service if unused or else creation of the service will
fail. Default is to auto-allocate a port if the ServiceType of this Service
requires one.

> https://kubernetes.io/docs/concepts/services-networking/service/#type-nodeport

---

##### `protocol`<sup>Optional</sup> <a name="org.cdk8s.plus22.AddDeploymentOptions.property.protocol"></a>

```java
public Protocol getProtocol();
```

- *Type:* [`org.cdk8s.plus22.Protocol`](#org.cdk8s.plus22.Protocol)
- *Default:* Protocol.TCP

The IP protocol for this port.

Supports "TCP", "UDP", and "SCTP". Default is TCP.

---

##### `targetPort`<sup>Optional</sup> <a name="org.cdk8s.plus22.AddDeploymentOptions.property.targetPort"></a>

```java
public java.lang.Number getTargetPort();
```

- *Type:* `java.lang.Number`
- *Default:* The value of `port` will be used.

The port number the service will redirect to.

---

##### `port`<sup>Optional</sup> <a name="org.cdk8s.plus22.AddDeploymentOptions.property.port"></a>

```java
public java.lang.Number getPort();
```

- *Type:* `java.lang.Number`
- *Default:* Copied from the first container of the deployment.

The port number the service will bind to.

---

### AddDirectoryOptions <a name="org.cdk8s.plus22.AddDirectoryOptions"></a>

Options for `configmap.addDirectory()`.

#### Initializer <a name="[object Object].Initializer"></a>

```java
import org.cdk8s.plus22.AddDirectoryOptions;

AddDirectoryOptions.builder()
//  .exclude(java.util.List<java.lang.String>)
//  .keyPrefix(java.lang.String)
    .build();
```

##### `exclude`<sup>Optional</sup> <a name="org.cdk8s.plus22.AddDirectoryOptions.property.exclude"></a>

```java
public java.util.List<java.lang.String> getExclude();
```

- *Type:* java.util.List<`java.lang.String`>
- *Default:* include all files

Glob patterns to exclude when adding files.

---

##### `keyPrefix`<sup>Optional</sup> <a name="org.cdk8s.plus22.AddDirectoryOptions.property.keyPrefix"></a>

```java
public java.lang.String getKeyPrefix();
```

- *Type:* `java.lang.String`
- *Default:* ""

A prefix to add to all keys in the config map.

---

### AwsElasticBlockStorePersistentVolumeProps <a name="org.cdk8s.plus22.AwsElasticBlockStorePersistentVolumeProps"></a>

Properties for `AwsElasticBlockStorePersistentVolume`.

#### Initializer <a name="[object Object].Initializer"></a>

```java
import org.cdk8s.plus22.AwsElasticBlockStorePersistentVolumeProps;

AwsElasticBlockStorePersistentVolumeProps.builder()
//  .metadata(ApiObjectMetadata)
//  .accessModes(java.util.List<PersistentVolumeAccessMode>)
//  .claim(IPersistentVolumeClaim)
//  .mountOptions(java.util.List<java.lang.String>)
//  .reclaimPolicy(PersistentVolumeReclaimPolicy)
//  .storage(Size)
//  .storageClassName(java.lang.String)
//  .volumeMode(PersistentVolumeMode)
    .volumeId(java.lang.String)
//  .fsType(java.lang.String)
//  .partition(java.lang.Number)
//  .readOnly(java.lang.Boolean)
    .build();
```

##### `metadata`<sup>Optional</sup> <a name="org.cdk8s.plus22.AwsElasticBlockStorePersistentVolumeProps.property.metadata"></a>

```java
public ApiObjectMetadata getMetadata();
```

- *Type:* [`org.cdk8s.ApiObjectMetadata`](#org.cdk8s.ApiObjectMetadata)

Metadata that all persisted resources must have, which includes all objects users must create.

---

##### `accessModes`<sup>Optional</sup> <a name="org.cdk8s.plus22.AwsElasticBlockStorePersistentVolumeProps.property.accessModes"></a>

```java
public java.util.List<PersistentVolumeAccessMode> getAccessModes();
```

- *Type:* java.util.List<[`org.cdk8s.plus22.PersistentVolumeAccessMode`](#org.cdk8s.plus22.PersistentVolumeAccessMode)>
- *Default:* No access modes.

Contains all ways the volume can be mounted.

> https://kubernetes.io/docs/concepts/storage/persistent-volumes#access-modes

---

##### `claim`<sup>Optional</sup> <a name="org.cdk8s.plus22.AwsElasticBlockStorePersistentVolumeProps.property.claim"></a>

```java
public IPersistentVolumeClaim getClaim();
```

- *Type:* [`org.cdk8s.plus22.IPersistentVolumeClaim`](#org.cdk8s.plus22.IPersistentVolumeClaim)
- *Default:* Not bound to a specific claim.

Part of a bi-directional binding between PersistentVolume and PersistentVolumeClaim.

Expected to be non-nil when bound.

> https://kubernetes.io/docs/concepts/storage/persistent-volumes#binding

---

##### `mountOptions`<sup>Optional</sup> <a name="org.cdk8s.plus22.AwsElasticBlockStorePersistentVolumeProps.property.mountOptions"></a>

```java
public java.util.List<java.lang.String> getMountOptions();
```

- *Type:* java.util.List<`java.lang.String`>
- *Default:* No options.

A list of mount options, e.g. ["ro", "soft"]. Not validated - mount will simply fail if one is invalid.

> https://kubernetes.io/docs/concepts/storage/persistent-volumes/#mount-options

---

##### `reclaimPolicy`<sup>Optional</sup> <a name="org.cdk8s.plus22.AwsElasticBlockStorePersistentVolumeProps.property.reclaimPolicy"></a>

```java
public PersistentVolumeReclaimPolicy getReclaimPolicy();
```

- *Type:* [`org.cdk8s.plus22.PersistentVolumeReclaimPolicy`](#org.cdk8s.plus22.PersistentVolumeReclaimPolicy)
- *Default:* PersistentVolumeReclaimPolicy.RETAIN

When a user is done with their volume, they can delete the PVC objects from the API that allows reclamation of the resource.

The reclaim policy tells the cluster what to do with
the volume after it has been released of its claim.

> https://kubernetes.io/docs/concepts/storage/persistent-volumes#reclaiming

---

##### `storage`<sup>Optional</sup> <a name="org.cdk8s.plus22.AwsElasticBlockStorePersistentVolumeProps.property.storage"></a>

```java
public Size getStorage();
```

- *Type:* [`org.cdk8s.Size`](#org.cdk8s.Size)
- *Default:* No specified.

What is the storage capacity of this volume.

> https://kubernetes.io/docs/concepts/storage/persistent-volumes#resources

---

##### `storageClassName`<sup>Optional</sup> <a name="org.cdk8s.plus22.AwsElasticBlockStorePersistentVolumeProps.property.storageClassName"></a>

```java
public java.lang.String getStorageClassName();
```

- *Type:* `java.lang.String`
- *Default:* Volume does not belong to any storage class.

Name of StorageClass to which this persistent volume belongs.

---

##### `volumeMode`<sup>Optional</sup> <a name="org.cdk8s.plus22.AwsElasticBlockStorePersistentVolumeProps.property.volumeMode"></a>

```java
public PersistentVolumeMode getVolumeMode();
```

- *Type:* [`org.cdk8s.plus22.PersistentVolumeMode`](#org.cdk8s.plus22.PersistentVolumeMode)
- *Default:* VolumeMode.FILE_SYSTEM

Defines what type of volume is required by the claim.

---

##### `volumeId`<sup>Required</sup> <a name="org.cdk8s.plus22.AwsElasticBlockStorePersistentVolumeProps.property.volumeId"></a>

```java
public java.lang.String getVolumeId();
```

- *Type:* `java.lang.String`

Unique ID of the persistent disk resource in AWS (Amazon EBS volume).

More info: https://kubernetes.io/docs/concepts/storage/volumes#awselasticblockstore

> https://kubernetes.io/docs/concepts/storage/volumes#awselasticblockstore

---

##### `fsType`<sup>Optional</sup> <a name="org.cdk8s.plus22.AwsElasticBlockStorePersistentVolumeProps.property.fsType"></a>

```java
public java.lang.String getFsType();
```

- *Type:* `java.lang.String`
- *Default:* 'ext4'

Filesystem type of the volume that you want to mount.

Tip: Ensure that the filesystem type is supported by the host operating system.

> https://kubernetes.io/docs/concepts/storage/volumes#awselasticblockstore

---

##### `partition`<sup>Optional</sup> <a name="org.cdk8s.plus22.AwsElasticBlockStorePersistentVolumeProps.property.partition"></a>

```java
public java.lang.Number getPartition();
```

- *Type:* `java.lang.Number`
- *Default:* No partition.

The partition in the volume that you want to mount.

If omitted, the default is to mount by volume name.
Examples: For volume /dev/sda1, you specify the partition as "1".
Similarly, the volume partition for /dev/sda is "0" (or you can leave the property empty).

---

##### `readOnly`<sup>Optional</sup> <a name="org.cdk8s.plus22.AwsElasticBlockStorePersistentVolumeProps.property.readOnly"></a>

```java
public java.lang.Boolean getReadOnly();
```

- *Type:* `java.lang.Boolean`
- *Default:* false

Specify "true" to force and set the ReadOnly property in VolumeMounts to "true".

> https://kubernetes.io/docs/concepts/storage/volumes#awselasticblockstore

---

### AzureDiskPersistentVolumeProps <a name="org.cdk8s.plus22.AzureDiskPersistentVolumeProps"></a>

Properties for `AzureDiskPersistentVolume`.

#### Initializer <a name="[object Object].Initializer"></a>

```java
import org.cdk8s.plus22.AzureDiskPersistentVolumeProps;

AzureDiskPersistentVolumeProps.builder()
//  .metadata(ApiObjectMetadata)
//  .accessModes(java.util.List<PersistentVolumeAccessMode>)
//  .claim(IPersistentVolumeClaim)
//  .mountOptions(java.util.List<java.lang.String>)
//  .reclaimPolicy(PersistentVolumeReclaimPolicy)
//  .storage(Size)
//  .storageClassName(java.lang.String)
//  .volumeMode(PersistentVolumeMode)
    .diskName(java.lang.String)
    .diskUri(java.lang.String)
//  .cachingMode(AzureDiskPersistentVolumeCachingMode)
//  .fsType(java.lang.String)
//  .kind(AzureDiskPersistentVolumeKind)
//  .readOnly(java.lang.Boolean)
    .build();
```

##### `metadata`<sup>Optional</sup> <a name="org.cdk8s.plus22.AzureDiskPersistentVolumeProps.property.metadata"></a>

```java
public ApiObjectMetadata getMetadata();
```

- *Type:* [`org.cdk8s.ApiObjectMetadata`](#org.cdk8s.ApiObjectMetadata)

Metadata that all persisted resources must have, which includes all objects users must create.

---

##### `accessModes`<sup>Optional</sup> <a name="org.cdk8s.plus22.AzureDiskPersistentVolumeProps.property.accessModes"></a>

```java
public java.util.List<PersistentVolumeAccessMode> getAccessModes();
```

- *Type:* java.util.List<[`org.cdk8s.plus22.PersistentVolumeAccessMode`](#org.cdk8s.plus22.PersistentVolumeAccessMode)>
- *Default:* No access modes.

Contains all ways the volume can be mounted.

> https://kubernetes.io/docs/concepts/storage/persistent-volumes#access-modes

---

##### `claim`<sup>Optional</sup> <a name="org.cdk8s.plus22.AzureDiskPersistentVolumeProps.property.claim"></a>

```java
public IPersistentVolumeClaim getClaim();
```

- *Type:* [`org.cdk8s.plus22.IPersistentVolumeClaim`](#org.cdk8s.plus22.IPersistentVolumeClaim)
- *Default:* Not bound to a specific claim.

Part of a bi-directional binding between PersistentVolume and PersistentVolumeClaim.

Expected to be non-nil when bound.

> https://kubernetes.io/docs/concepts/storage/persistent-volumes#binding

---

##### `mountOptions`<sup>Optional</sup> <a name="org.cdk8s.plus22.AzureDiskPersistentVolumeProps.property.mountOptions"></a>

```java
public java.util.List<java.lang.String> getMountOptions();
```

- *Type:* java.util.List<`java.lang.String`>
- *Default:* No options.

A list of mount options, e.g. ["ro", "soft"]. Not validated - mount will simply fail if one is invalid.

> https://kubernetes.io/docs/concepts/storage/persistent-volumes/#mount-options

---

##### `reclaimPolicy`<sup>Optional</sup> <a name="org.cdk8s.plus22.AzureDiskPersistentVolumeProps.property.reclaimPolicy"></a>

```java
public PersistentVolumeReclaimPolicy getReclaimPolicy();
```

- *Type:* [`org.cdk8s.plus22.PersistentVolumeReclaimPolicy`](#org.cdk8s.plus22.PersistentVolumeReclaimPolicy)
- *Default:* PersistentVolumeReclaimPolicy.RETAIN

When a user is done with their volume, they can delete the PVC objects from the API that allows reclamation of the resource.

The reclaim policy tells the cluster what to do with
the volume after it has been released of its claim.

> https://kubernetes.io/docs/concepts/storage/persistent-volumes#reclaiming

---

##### `storage`<sup>Optional</sup> <a name="org.cdk8s.plus22.AzureDiskPersistentVolumeProps.property.storage"></a>

```java
public Size getStorage();
```

- *Type:* [`org.cdk8s.Size`](#org.cdk8s.Size)
- *Default:* No specified.

What is the storage capacity of this volume.

> https://kubernetes.io/docs/concepts/storage/persistent-volumes#resources

---

##### `storageClassName`<sup>Optional</sup> <a name="org.cdk8s.plus22.AzureDiskPersistentVolumeProps.property.storageClassName"></a>

```java
public java.lang.String getStorageClassName();
```

- *Type:* `java.lang.String`
- *Default:* Volume does not belong to any storage class.

Name of StorageClass to which this persistent volume belongs.

---

##### `volumeMode`<sup>Optional</sup> <a name="org.cdk8s.plus22.AzureDiskPersistentVolumeProps.property.volumeMode"></a>

```java
public PersistentVolumeMode getVolumeMode();
```

- *Type:* [`org.cdk8s.plus22.PersistentVolumeMode`](#org.cdk8s.plus22.PersistentVolumeMode)
- *Default:* VolumeMode.FILE_SYSTEM

Defines what type of volume is required by the claim.

---

##### `diskName`<sup>Required</sup> <a name="org.cdk8s.plus22.AzureDiskPersistentVolumeProps.property.diskName"></a>

```java
public java.lang.String getDiskName();
```

- *Type:* `java.lang.String`

The Name of the data disk in the blob storage.

---

##### `diskUri`<sup>Required</sup> <a name="org.cdk8s.plus22.AzureDiskPersistentVolumeProps.property.diskUri"></a>

```java
public java.lang.String getDiskUri();
```

- *Type:* `java.lang.String`

The URI the data disk in the blob storage.

---

##### `cachingMode`<sup>Optional</sup> <a name="org.cdk8s.plus22.AzureDiskPersistentVolumeProps.property.cachingMode"></a>

```java
public AzureDiskPersistentVolumeCachingMode getCachingMode();
```

- *Type:* [`org.cdk8s.plus22.AzureDiskPersistentVolumeCachingMode`](#org.cdk8s.plus22.AzureDiskPersistentVolumeCachingMode)
- *Default:* AzureDiskPersistentVolumeCachingMode.NONE.

Host Caching mode.

---

##### `fsType`<sup>Optional</sup> <a name="org.cdk8s.plus22.AzureDiskPersistentVolumeProps.property.fsType"></a>

```java
public java.lang.String getFsType();
```

- *Type:* `java.lang.String`
- *Default:* 'ext4'

Filesystem type to mount.

Must be a filesystem type supported by the host operating system.

---

##### `kind`<sup>Optional</sup> <a name="org.cdk8s.plus22.AzureDiskPersistentVolumeProps.property.kind"></a>

```java
public AzureDiskPersistentVolumeKind getKind();
```

- *Type:* [`org.cdk8s.plus22.AzureDiskPersistentVolumeKind`](#org.cdk8s.plus22.AzureDiskPersistentVolumeKind)
- *Default:* AzureDiskPersistentVolumeKind.SHARED

Kind of disk.

---

##### `readOnly`<sup>Optional</sup> <a name="org.cdk8s.plus22.AzureDiskPersistentVolumeProps.property.readOnly"></a>

```java
public java.lang.Boolean getReadOnly();
```

- *Type:* `java.lang.Boolean`
- *Default:* false

Force the ReadOnly setting in VolumeMounts.

---

### BasicAuthSecretProps <a name="org.cdk8s.plus22.BasicAuthSecretProps"></a>

Options for `BasicAuthSecret`.

#### Initializer <a name="[object Object].Initializer"></a>

```java
import org.cdk8s.plus22.BasicAuthSecretProps;

BasicAuthSecretProps.builder()
//  .metadata(ApiObjectMetadata)
//  .immutable(java.lang.Boolean)
    .password(java.lang.String)
    .username(java.lang.String)
    .build();
```

##### `metadata`<sup>Optional</sup> <a name="org.cdk8s.plus22.BasicAuthSecretProps.property.metadata"></a>

```java
public ApiObjectMetadata getMetadata();
```

- *Type:* [`org.cdk8s.ApiObjectMetadata`](#org.cdk8s.ApiObjectMetadata)

Metadata that all persisted resources must have, which includes all objects users must create.

---

##### `immutable`<sup>Optional</sup> <a name="org.cdk8s.plus22.BasicAuthSecretProps.property.immutable"></a>

```java
public java.lang.Boolean getImmutable();
```

- *Type:* `java.lang.Boolean`
- *Default:* false

If set to true, ensures that data stored in the Secret cannot be updated (only object metadata can be modified).

If not set to true, the field can be modified at any time.

---

##### `password`<sup>Required</sup> <a name="org.cdk8s.plus22.BasicAuthSecretProps.property.password"></a>

```java
public java.lang.String getPassword();
```

- *Type:* `java.lang.String`

The password or token for authentication.

---

##### `username`<sup>Required</sup> <a name="org.cdk8s.plus22.BasicAuthSecretProps.property.username"></a>

```java
public java.lang.String getUsername();
```

- *Type:* `java.lang.String`

The user name for authentication.

---

### CommandProbeOptions <a name="org.cdk8s.plus22.CommandProbeOptions"></a>

Options for `Probe.fromCommand()`.

#### Initializer <a name="[object Object].Initializer"></a>

```java
import org.cdk8s.plus22.CommandProbeOptions;

CommandProbeOptions.builder()
//  .failureThreshold(java.lang.Number)
//  .initialDelaySeconds(Duration)
//  .periodSeconds(Duration)
//  .successThreshold(java.lang.Number)
//  .timeoutSeconds(Duration)
    .build();
```

##### `failureThreshold`<sup>Optional</sup> <a name="org.cdk8s.plus22.CommandProbeOptions.property.failureThreshold"></a>

```java
public java.lang.Number getFailureThreshold();
```

- *Type:* `java.lang.Number`
- *Default:* 3

Minimum consecutive failures for the probe to be considered failed after having succeeded.

Defaults to 3. Minimum value is 1.

---

##### `initialDelaySeconds`<sup>Optional</sup> <a name="org.cdk8s.plus22.CommandProbeOptions.property.initialDelaySeconds"></a>

```java
public Duration getInitialDelaySeconds();
```

- *Type:* [`org.cdk8s.Duration`](#org.cdk8s.Duration)
- *Default:* immediate

Number of seconds after the container has started before liveness probes are initiated.

> https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle#container-probes

---

##### `periodSeconds`<sup>Optional</sup> <a name="org.cdk8s.plus22.CommandProbeOptions.property.periodSeconds"></a>

```java
public Duration getPeriodSeconds();
```

- *Type:* [`org.cdk8s.Duration`](#org.cdk8s.Duration)
- *Default:* Duration.seconds(10) Minimum value is 1.

How often (in seconds) to perform the probe.

Default to 10 seconds. Minimum value is 1.

---

##### `successThreshold`<sup>Optional</sup> <a name="org.cdk8s.plus22.CommandProbeOptions.property.successThreshold"></a>

```java
public java.lang.Number getSuccessThreshold();
```

- *Type:* `java.lang.Number`
- *Default:* 1 Must be 1 for liveness and startup. Minimum value is 1.

Minimum consecutive successes for the probe to be considered successful after having failed. Defaults to 1.

Must be 1 for liveness and startup. Minimum value is 1.

---

##### `timeoutSeconds`<sup>Optional</sup> <a name="org.cdk8s.plus22.CommandProbeOptions.property.timeoutSeconds"></a>

```java
public Duration getTimeoutSeconds();
```

- *Type:* [`org.cdk8s.Duration`](#org.cdk8s.Duration)
- *Default:* Duration.seconds(1)

Number of seconds after which the probe times out.

Defaults to 1 second. Minimum value is 1.

> https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle#container-probes

---

### CommonSecretProps <a name="org.cdk8s.plus22.CommonSecretProps"></a>

Common properties for `Secret`.

#### Initializer <a name="[object Object].Initializer"></a>

```java
import org.cdk8s.plus22.CommonSecretProps;

CommonSecretProps.builder()
//  .metadata(ApiObjectMetadata)
//  .immutable(java.lang.Boolean)
    .build();
```

##### `metadata`<sup>Optional</sup> <a name="org.cdk8s.plus22.CommonSecretProps.property.metadata"></a>

```java
public ApiObjectMetadata getMetadata();
```

- *Type:* [`org.cdk8s.ApiObjectMetadata`](#org.cdk8s.ApiObjectMetadata)

Metadata that all persisted resources must have, which includes all objects users must create.

---

##### `immutable`<sup>Optional</sup> <a name="org.cdk8s.plus22.CommonSecretProps.property.immutable"></a>

```java
public java.lang.Boolean getImmutable();
```

- *Type:* `java.lang.Boolean`
- *Default:* false

If set to true, ensures that data stored in the Secret cannot be updated (only object metadata can be modified).

If not set to true, the field can be modified at any time.

---

### ConfigMapProps <a name="org.cdk8s.plus22.ConfigMapProps"></a>

Properties for initialization of `ConfigMap`.

#### Initializer <a name="[object Object].Initializer"></a>

```java
import org.cdk8s.plus22.ConfigMapProps;

ConfigMapProps.builder()
//  .metadata(ApiObjectMetadata)
//  .binaryData(java.util.Map<java.lang.String, java.lang.String>)
//  .data(java.util.Map<java.lang.String, java.lang.String>)
    .build();
```

##### `metadata`<sup>Optional</sup> <a name="org.cdk8s.plus22.ConfigMapProps.property.metadata"></a>

```java
public ApiObjectMetadata getMetadata();
```

- *Type:* [`org.cdk8s.ApiObjectMetadata`](#org.cdk8s.ApiObjectMetadata)

Metadata that all persisted resources must have, which includes all objects users must create.

---

##### `binaryData`<sup>Optional</sup> <a name="org.cdk8s.plus22.ConfigMapProps.property.binaryData"></a>

```java
public java.util.Map<java.lang.String, java.lang.String> getBinaryData();
```

- *Type:* java.util.Map<java.lang.String, `java.lang.String`>

BinaryData contains the binary data.

Each key must consist of alphanumeric characters, '-', '_' or '.'.
BinaryData can contain byte sequences that are not in the UTF-8 range. The
keys stored in BinaryData must not overlap with the ones in the Data field,
this is enforced during validation process.

You can also add binary data using `configMap.addBinaryData()`.

---

##### `data`<sup>Optional</sup> <a name="org.cdk8s.plus22.ConfigMapProps.property.data"></a>

```java
public java.util.Map<java.lang.String, java.lang.String> getData();
```

- *Type:* java.util.Map<java.lang.String, `java.lang.String`>

Data contains the configuration data.

Each key must consist of alphanumeric characters, '-', '_' or '.'. Values
with non-UTF-8 byte sequences must use the BinaryData field. The keys
stored in Data must not overlap with the keys in the BinaryData field, this
is enforced during validation process.

You can also add data using `configMap.addData()`.

---

### ConfigMapVolumeOptions <a name="org.cdk8s.plus22.ConfigMapVolumeOptions"></a>

Options for the ConfigMap-based volume.

#### Initializer <a name="[object Object].Initializer"></a>

```java
import org.cdk8s.plus22.ConfigMapVolumeOptions;

ConfigMapVolumeOptions.builder()
//  .defaultMode(java.lang.Number)
//  .items(java.util.Map<java.lang.String, PathMapping>)
//  .name(java.lang.String)
//  .optional(java.lang.Boolean)
    .build();
```

##### `defaultMode`<sup>Optional</sup> <a name="org.cdk8s.plus22.ConfigMapVolumeOptions.property.defaultMode"></a>

```java
public java.lang.Number getDefaultMode();
```

- *Type:* `java.lang.Number`
- *Default:* 0644. Directories within the path are not affected by this
setting. This might be in conflict with other options that affect the file
mode, like fsGroup, and the result can be other mode bits set.

Mode bits to use on created files by default.

Must be a value between 0 and
0777. Defaults to 0644. Directories within the path are not affected by
this setting. This might be in conflict with other options that affect the
file mode, like fsGroup, and the result can be other mode bits set.

---

##### `items`<sup>Optional</sup> <a name="org.cdk8s.plus22.ConfigMapVolumeOptions.property.items"></a>

```java
public java.util.Map<java.lang.String, PathMapping> getItems();
```

- *Type:* java.util.Map<java.lang.String, [`org.cdk8s.plus22.PathMapping`](#org.cdk8s.plus22.PathMapping)>
- *Default:* no mapping

If unspecified, each key-value pair in the Data field of the referenced ConfigMap will be projected into the volume as a file whose name is the key and content is the value.

If specified, the listed keys will be projected
into the specified paths, and unlisted keys will not be present. If a key
is specified which is not present in the ConfigMap, the volume setup will
error unless it is marked optional. Paths must be relative and may not
contain the '..' path or start with '..'.

---

##### `name`<sup>Optional</sup> <a name="org.cdk8s.plus22.ConfigMapVolumeOptions.property.name"></a>

```java
public java.lang.String getName();
```

- *Type:* `java.lang.String`
- *Default:* auto-generated

The volume name.

---

##### `optional`<sup>Optional</sup> <a name="org.cdk8s.plus22.ConfigMapVolumeOptions.property.optional"></a>

```java
public java.lang.Boolean getOptional();
```

- *Type:* `java.lang.Boolean`
- *Default:* undocumented

Specify whether the ConfigMap or its keys must be defined.

---

### ContainerLifecycle <a name="org.cdk8s.plus22.ContainerLifecycle"></a>

Container lifecycle properties.

#### Initializer <a name="[object Object].Initializer"></a>

```java
import org.cdk8s.plus22.ContainerLifecycle;

ContainerLifecycle.builder()
//  .postStart(Handler)
//  .preStop(Handler)
    .build();
```

##### `postStart`<sup>Optional</sup> <a name="org.cdk8s.plus22.ContainerLifecycle.property.postStart"></a>

```java
public Handler getPostStart();
```

- *Type:* [`org.cdk8s.plus22.Handler`](#org.cdk8s.plus22.Handler)
- *Default:* No post start handler.

This hook is executed immediately after a container is created.

However,
there is no guarantee that the hook will execute before the container ENTRYPOINT.

---

##### `preStop`<sup>Optional</sup> <a name="org.cdk8s.plus22.ContainerLifecycle.property.preStop"></a>

```java
public Handler getPreStop();
```

- *Type:* [`org.cdk8s.plus22.Handler`](#org.cdk8s.plus22.Handler)
- *Default:* No pre stop handler.

This hook is called immediately before a container is terminated due to an API request or management event such as a liveness/startup probe failure, preemption, resource contention and others.

A call to the PreStop hook fails if the container is already in a terminated or completed state
and the hook must complete before the TERM signal to stop the container can be sent.
The Pod's termination grace period countdown begins before the PreStop hook is executed,
so regardless of the outcome of the handler, the container will eventually terminate
within the Pod's termination grace period. No parameters are passed to the handler.

> https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle/#pod-termination

---

### ContainerProps <a name="org.cdk8s.plus22.ContainerProps"></a>

Properties for creating a container.

#### Initializer <a name="[object Object].Initializer"></a>

```java
import org.cdk8s.plus22.ContainerProps;

ContainerProps.builder()
    .image(java.lang.String)
//  .args(java.util.List<java.lang.String>)
//  .command(java.util.List<java.lang.String>)
//  .env(java.util.Map<java.lang.String, EnvValue>)
//  .imagePullPolicy(ImagePullPolicy)
//  .lifecycle(ContainerLifecycle)
//  .liveness(Probe)
//  .name(java.lang.String)
//  .port(java.lang.Number)
//  .readiness(Probe)
//  .resources(Resources)
//  .securityContext(ContainerSecurityContextProps)
//  .startup(Probe)
//  .volumeMounts(java.util.List<VolumeMount>)
//  .workingDir(java.lang.String)
    .build();
```

##### `image`<sup>Required</sup> <a name="org.cdk8s.plus22.ContainerProps.property.image"></a>

```java
public java.lang.String getImage();
```

- *Type:* `java.lang.String`

Docker image name.

---

##### `args`<sup>Optional</sup> <a name="org.cdk8s.plus22.ContainerProps.property.args"></a>

```java
public java.util.List<java.lang.String> getArgs();
```

- *Type:* java.util.List<`java.lang.String`>
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

##### `command`<sup>Optional</sup> <a name="org.cdk8s.plus22.ContainerProps.property.command"></a>

```java
public java.util.List<java.lang.String> getCommand();
```

- *Type:* java.util.List<`java.lang.String`>
- *Default:* The docker image's ENTRYPOINT.

Entrypoint array.

Not executed within a shell. The docker image's ENTRYPOINT is used if this is not provided. Variable references $(VAR_NAME) are expanded using the container's environment.
If a variable cannot be resolved, the reference in the input string will be unchanged. The $(VAR_NAME) syntax can be escaped with a double $$, ie: $$(VAR_NAME).
Escaped references will never be expanded, regardless of whether the variable exists or not. Cannot be updated.
More info: https://kubernetes.io/docs/tasks/inject-data-application/define-command-argument-container/#running-a-command-in-a-shell

---

##### `env`<sup>Optional</sup> <a name="org.cdk8s.plus22.ContainerProps.property.env"></a>

```java
public java.util.Map<java.lang.String, EnvValue> getEnv();
```

- *Type:* java.util.Map<java.lang.String, [`org.cdk8s.plus22.EnvValue`](#org.cdk8s.plus22.EnvValue)>
- *Default:* No environment variables.

List of environment variables to set in the container.

Cannot be updated.

---

##### `imagePullPolicy`<sup>Optional</sup> <a name="org.cdk8s.plus22.ContainerProps.property.imagePullPolicy"></a>

```java
public ImagePullPolicy getImagePullPolicy();
```

- *Type:* [`org.cdk8s.plus22.ImagePullPolicy`](#org.cdk8s.plus22.ImagePullPolicy)
- *Default:* ImagePullPolicy.ALWAYS

Image pull policy for this container.

---

##### `lifecycle`<sup>Optional</sup> <a name="org.cdk8s.plus22.ContainerProps.property.lifecycle"></a>

```java
public ContainerLifecycle getLifecycle();
```

- *Type:* [`org.cdk8s.plus22.ContainerLifecycle`](#org.cdk8s.plus22.ContainerLifecycle)

Describes actions that the management system should take in response to container lifecycle events.

---

##### `liveness`<sup>Optional</sup> <a name="org.cdk8s.plus22.ContainerProps.property.liveness"></a>

```java
public Probe getLiveness();
```

- *Type:* [`org.cdk8s.plus22.Probe`](#org.cdk8s.plus22.Probe)
- *Default:* no liveness probe is defined

Periodic probe of container liveness.

Container will be restarted if the probe fails.

---

##### `name`<sup>Optional</sup> <a name="org.cdk8s.plus22.ContainerProps.property.name"></a>

```java
public java.lang.String getName();
```

- *Type:* `java.lang.String`
- *Default:* 'main'

Name of the container specified as a DNS_LABEL.

Each container in a pod must have a unique name (DNS_LABEL). Cannot be updated.

---

##### `port`<sup>Optional</sup> <a name="org.cdk8s.plus22.ContainerProps.property.port"></a>

```java
public java.lang.Number getPort();
```

- *Type:* `java.lang.Number`
- *Default:* No port is exposed.

Number of port to expose on the pod's IP address.

This must be a valid port number, 0 < x < 65536.

---

##### `readiness`<sup>Optional</sup> <a name="org.cdk8s.plus22.ContainerProps.property.readiness"></a>

```java
public Probe getReadiness();
```

- *Type:* [`org.cdk8s.plus22.Probe`](#org.cdk8s.plus22.Probe)
- *Default:* no readiness probe is defined

Determines when the container is ready to serve traffic.

---

##### `resources`<sup>Optional</sup> <a name="org.cdk8s.plus22.ContainerProps.property.resources"></a>

```java
public Resources getResources();
```

- *Type:* [`org.cdk8s.plus22.Resources`](#org.cdk8s.plus22.Resources)

Compute resources (CPU and memory requests and limits) required by the container.

> https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/

---

##### `securityContext`<sup>Optional</sup> <a name="org.cdk8s.plus22.ContainerProps.property.securityContext"></a>

```java
public ContainerSecurityContextProps getSecurityContext();
```

- *Type:* [`org.cdk8s.plus22.ContainerSecurityContextProps`](#org.cdk8s.plus22.ContainerSecurityContextProps)
- *Default:* ensureNonRoot: false
  privileged: false
  readOnlyRootFilesystem: false

SecurityContext defines the security options the container should be run with.

If set, the fields override equivalent fields of the pod's security context.

> https://kubernetes.io/docs/tasks/configure-pod-container/security-context/

---

##### `startup`<sup>Optional</sup> <a name="org.cdk8s.plus22.ContainerProps.property.startup"></a>

```java
public Probe getStartup();
```

- *Type:* [`org.cdk8s.plus22.Probe`](#org.cdk8s.plus22.Probe)
- *Default:* no startup probe is defined.

StartupProbe indicates that the Pod has successfully initialized.

If specified, no other probes are executed until this completes successfully

---

##### `volumeMounts`<sup>Optional</sup> <a name="org.cdk8s.plus22.ContainerProps.property.volumeMounts"></a>

```java
public java.util.List<VolumeMount> getVolumeMounts();
```

- *Type:* java.util.List<[`org.cdk8s.plus22.VolumeMount`](#org.cdk8s.plus22.VolumeMount)>

Pod volumes to mount into the container's filesystem.

Cannot be updated.

---

##### `workingDir`<sup>Optional</sup> <a name="org.cdk8s.plus22.ContainerProps.property.workingDir"></a>

```java
public java.lang.String getWorkingDir();
```

- *Type:* `java.lang.String`
- *Default:* The container runtime's default.

Container's working directory.

If not specified, the container runtime's default will be used, which might be configured in the container image. Cannot be updated.

---

### ContainerSecurityContextProps <a name="org.cdk8s.plus22.ContainerSecurityContextProps"></a>

Properties for `ContainerSecurityContext`.

#### Initializer <a name="[object Object].Initializer"></a>

```java
import org.cdk8s.plus22.ContainerSecurityContextProps;

ContainerSecurityContextProps.builder()
//  .ensureNonRoot(java.lang.Boolean)
//  .group(java.lang.Number)
//  .privileged(java.lang.Boolean)
//  .readOnlyRootFilesystem(java.lang.Boolean)
//  .user(java.lang.Number)
    .build();
```

##### `ensureNonRoot`<sup>Optional</sup> <a name="org.cdk8s.plus22.ContainerSecurityContextProps.property.ensureNonRoot"></a>

```java
public java.lang.Boolean getEnsureNonRoot();
```

- *Type:* `java.lang.Boolean`
- *Default:* false

Indicates that the container must run as a non-root user.

If true, the Kubelet will validate the image at runtime to ensure that it does
not run as UID 0 (root) and fail to start the container if it does.

---

##### `group`<sup>Optional</sup> <a name="org.cdk8s.plus22.ContainerSecurityContextProps.property.group"></a>

```java
public java.lang.Number getGroup();
```

- *Type:* `java.lang.Number`
- *Default:* Group configured by container runtime

The GID to run the entrypoint of the container process.

---

##### `privileged`<sup>Optional</sup> <a name="org.cdk8s.plus22.ContainerSecurityContextProps.property.privileged"></a>

```java
public java.lang.Boolean getPrivileged();
```

- *Type:* `java.lang.Boolean`
- *Default:* false

Run container in privileged mode.

Processes in privileged containers are essentially equivalent to root on the host.

---

##### `readOnlyRootFilesystem`<sup>Optional</sup> <a name="org.cdk8s.plus22.ContainerSecurityContextProps.property.readOnlyRootFilesystem"></a>

```java
public java.lang.Boolean getReadOnlyRootFilesystem();
```

- *Type:* `java.lang.Boolean`
- *Default:* false

Whether this container has a read-only root filesystem.

---

##### `user`<sup>Optional</sup> <a name="org.cdk8s.plus22.ContainerSecurityContextProps.property.user"></a>

```java
public java.lang.Number getUser();
```

- *Type:* `java.lang.Number`
- *Default:* User specified in image metadata

The UID to run the entrypoint of the container process.

---

### CpuResources <a name="org.cdk8s.plus22.CpuResources"></a>

CPU request and limit.

#### Initializer <a name="[object Object].Initializer"></a>

```java
import org.cdk8s.plus22.CpuResources;

CpuResources.builder()
    .limit(Cpu)
    .request(Cpu)
    .build();
```

##### `limit`<sup>Required</sup> <a name="org.cdk8s.plus22.CpuResources.property.limit"></a>

```java
public Cpu getLimit();
```

- *Type:* [`org.cdk8s.plus22.Cpu`](#org.cdk8s.plus22.Cpu)

---

##### `request`<sup>Required</sup> <a name="org.cdk8s.plus22.CpuResources.property.request"></a>

```java
public Cpu getRequest();
```

- *Type:* [`org.cdk8s.plus22.Cpu`](#org.cdk8s.plus22.Cpu)

---

### DeploymentProps <a name="org.cdk8s.plus22.DeploymentProps"></a>

Properties for initialization of `Deployment`.

#### Initializer <a name="[object Object].Initializer"></a>

```java
import org.cdk8s.plus22.DeploymentProps;

DeploymentProps.builder()
//  .metadata(ApiObjectMetadata)
//  .containers(java.util.List<ContainerProps>)
//  .hostAliases(java.util.List<HostAlias>)
//  .initContainers(java.util.List<ContainerProps>)
//  .restartPolicy(RestartPolicy)
//  .securityContext(PodSecurityContextProps)
//  .serviceAccount(IServiceAccount)
//  .volumes(java.util.List<Volume>)
//  .podMetadata(ApiObjectMetadata)
//  .defaultSelector(java.lang.Boolean)
//  .replicas(java.lang.Number)
    .build();
```

##### `metadata`<sup>Optional</sup> <a name="org.cdk8s.plus22.DeploymentProps.property.metadata"></a>

```java
public ApiObjectMetadata getMetadata();
```

- *Type:* [`org.cdk8s.ApiObjectMetadata`](#org.cdk8s.ApiObjectMetadata)

Metadata that all persisted resources must have, which includes all objects users must create.

---

##### `containers`<sup>Optional</sup> <a name="org.cdk8s.plus22.DeploymentProps.property.containers"></a>

```java
public java.util.List<ContainerProps> getContainers();
```

- *Type:* java.util.List<[`org.cdk8s.plus22.ContainerProps`](#org.cdk8s.plus22.ContainerProps)>
- *Default:* No containers. Note that a pod spec must include at least one container.

List of containers belonging to the pod.

Containers cannot currently be
added or removed. There must be at least one container in a Pod.

You can add additionnal containers using `podSpec.addContainer()`

---

##### `hostAliases`<sup>Optional</sup> <a name="org.cdk8s.plus22.DeploymentProps.property.hostAliases"></a>

```java
public java.util.List<HostAlias> getHostAliases();
```

- *Type:* java.util.List<[`org.cdk8s.plus22.HostAlias`](#org.cdk8s.plus22.HostAlias)>

HostAlias holds the mapping between IP and hostnames that will be injected as an entry in the pod's hosts file.

---

##### `initContainers`<sup>Optional</sup> <a name="org.cdk8s.plus22.DeploymentProps.property.initContainers"></a>

```java
public java.util.List<ContainerProps> getInitContainers();
```

- *Type:* java.util.List<[`org.cdk8s.plus22.ContainerProps`](#org.cdk8s.plus22.ContainerProps)>
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

##### `restartPolicy`<sup>Optional</sup> <a name="org.cdk8s.plus22.DeploymentProps.property.restartPolicy"></a>

```java
public RestartPolicy getRestartPolicy();
```

- *Type:* [`org.cdk8s.plus22.RestartPolicy`](#org.cdk8s.plus22.RestartPolicy)
- *Default:* RestartPolicy.ALWAYS

Restart policy for all containers within the pod.

> https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle/#restart-policy

---

##### `securityContext`<sup>Optional</sup> <a name="org.cdk8s.plus22.DeploymentProps.property.securityContext"></a>

```java
public PodSecurityContextProps getSecurityContext();
```

- *Type:* [`org.cdk8s.plus22.PodSecurityContextProps`](#org.cdk8s.plus22.PodSecurityContextProps)
- *Default:* fsGroupChangePolicy: FsGroupChangePolicy.FsGroupChangePolicy.ALWAYS
  ensureNonRoot: false

SecurityContext holds pod-level security attributes and common container settings.

---

##### `serviceAccount`<sup>Optional</sup> <a name="org.cdk8s.plus22.DeploymentProps.property.serviceAccount"></a>

```java
public IServiceAccount getServiceAccount();
```

- *Type:* [`org.cdk8s.plus22.IServiceAccount`](#org.cdk8s.plus22.IServiceAccount)
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

##### `volumes`<sup>Optional</sup> <a name="org.cdk8s.plus22.DeploymentProps.property.volumes"></a>

```java
public java.util.List<Volume> getVolumes();
```

- *Type:* java.util.List<[`org.cdk8s.plus22.Volume`](#org.cdk8s.plus22.Volume)>
- *Default:* No volumes.

List of volumes that can be mounted by containers belonging to the pod.

You can also add volumes later using `podSpec.addVolume()`

> https://kubernetes.io/docs/concepts/storage/volumes

---

##### `podMetadata`<sup>Optional</sup> <a name="org.cdk8s.plus22.DeploymentProps.property.podMetadata"></a>

```java
public ApiObjectMetadata getPodMetadata();
```

- *Type:* [`org.cdk8s.ApiObjectMetadata`](#org.cdk8s.ApiObjectMetadata)

The pod metadata.

---

##### `defaultSelector`<sup>Optional</sup> <a name="org.cdk8s.plus22.DeploymentProps.property.defaultSelector"></a>

```java
public java.lang.Boolean getDefaultSelector();
```

- *Type:* `java.lang.Boolean`
- *Default:* true

Automatically allocates a pod selector for this deployment.

If this is set to `false` you must define your selector through
`deployment.podMetadata.addLabel()` and `deployment.selectByLabel()`.

---

##### `replicas`<sup>Optional</sup> <a name="org.cdk8s.plus22.DeploymentProps.property.replicas"></a>

```java
public java.lang.Number getReplicas();
```

- *Type:* `java.lang.Number`
- *Default:* 1

Number of desired pods.

---

### DockerConfigSecretProps <a name="org.cdk8s.plus22.DockerConfigSecretProps"></a>

Options for `DockerConfigSecret`.

#### Initializer <a name="[object Object].Initializer"></a>

```java
import org.cdk8s.plus22.DockerConfigSecretProps;

DockerConfigSecretProps.builder()
//  .metadata(ApiObjectMetadata)
//  .immutable(java.lang.Boolean)
    .data(java.util.Map<java.lang.String, java.lang.Object>)
    .build();
```

##### `metadata`<sup>Optional</sup> <a name="org.cdk8s.plus22.DockerConfigSecretProps.property.metadata"></a>

```java
public ApiObjectMetadata getMetadata();
```

- *Type:* [`org.cdk8s.ApiObjectMetadata`](#org.cdk8s.ApiObjectMetadata)

Metadata that all persisted resources must have, which includes all objects users must create.

---

##### `immutable`<sup>Optional</sup> <a name="org.cdk8s.plus22.DockerConfigSecretProps.property.immutable"></a>

```java
public java.lang.Boolean getImmutable();
```

- *Type:* `java.lang.Boolean`
- *Default:* false

If set to true, ensures that data stored in the Secret cannot be updated (only object metadata can be modified).

If not set to true, the field can be modified at any time.

---

##### `data`<sup>Required</sup> <a name="org.cdk8s.plus22.DockerConfigSecretProps.property.data"></a>

```java
public java.util.Map<java.lang.String, java.lang.Object> getData();
```

- *Type:* java.util.Map<java.lang.String, `java.lang.Object`>

JSON content to provide for the `~/.docker/config.json` file. This will be stringified and inserted as stringData.

> https://docs.docker.com/engine/reference/commandline/cli/#sample-configuration-file

---

### EmptyDirVolumeOptions <a name="org.cdk8s.plus22.EmptyDirVolumeOptions"></a>

Options for volumes populated with an empty directory.

#### Initializer <a name="[object Object].Initializer"></a>

```java
import org.cdk8s.plus22.EmptyDirVolumeOptions;

EmptyDirVolumeOptions.builder()
//  .medium(EmptyDirMedium)
//  .sizeLimit(Size)
    .build();
```

##### `medium`<sup>Optional</sup> <a name="org.cdk8s.plus22.EmptyDirVolumeOptions.property.medium"></a>

```java
public EmptyDirMedium getMedium();
```

- *Type:* [`org.cdk8s.plus22.EmptyDirMedium`](#org.cdk8s.plus22.EmptyDirMedium)
- *Default:* EmptyDirMedium.DEFAULT

By default, emptyDir volumes are stored on whatever medium is backing the node - that might be disk or SSD or network storage, depending on your environment.

However, you can set the emptyDir.medium field to
`EmptyDirMedium.MEMORY` to tell Kubernetes to mount a tmpfs (RAM-backed
filesystem) for you instead. While tmpfs is very fast, be aware that unlike
disks, tmpfs is cleared on node reboot and any files you write will count
against your Container's memory limit.

---

##### `sizeLimit`<sup>Optional</sup> <a name="org.cdk8s.plus22.EmptyDirVolumeOptions.property.sizeLimit"></a>

```java
public Size getSizeLimit();
```

- *Type:* [`org.cdk8s.Size`](#org.cdk8s.Size)
- *Default:* limit is undefined

Total amount of local storage required for this EmptyDir volume.

The size
limit is also applicable for memory medium. The maximum usage on memory
medium EmptyDir would be the minimum value between the SizeLimit specified
here and the sum of memory limits of all containers in a pod.

---

### EnvValueFromConfigMapOptions <a name="org.cdk8s.plus22.EnvValueFromConfigMapOptions"></a>

Options to specify an envionment variable value from a ConfigMap key.

#### Initializer <a name="[object Object].Initializer"></a>

```java
import org.cdk8s.plus22.EnvValueFromConfigMapOptions;

EnvValueFromConfigMapOptions.builder()
//  .optional(java.lang.Boolean)
    .build();
```

##### `optional`<sup>Optional</sup> <a name="org.cdk8s.plus22.EnvValueFromConfigMapOptions.property.optional"></a>

```java
public java.lang.Boolean getOptional();
```

- *Type:* `java.lang.Boolean`
- *Default:* false

Specify whether the ConfigMap or its key must be defined.

---

### EnvValueFromFieldRefOptions <a name="org.cdk8s.plus22.EnvValueFromFieldRefOptions"></a>

Options to specify an environment variable value from a field reference.

#### Initializer <a name="[object Object].Initializer"></a>

```java
import org.cdk8s.plus22.EnvValueFromFieldRefOptions;

EnvValueFromFieldRefOptions.builder()
//  .apiVersion(java.lang.String)
//  .key(java.lang.String)
    .build();
```

##### `apiVersion`<sup>Optional</sup> <a name="org.cdk8s.plus22.EnvValueFromFieldRefOptions.property.apiVersion"></a>

```java
public java.lang.String getApiVersion();
```

- *Type:* `java.lang.String`

Version of the schema the FieldPath is written in terms of.

---

##### `key`<sup>Optional</sup> <a name="org.cdk8s.plus22.EnvValueFromFieldRefOptions.property.key"></a>

```java
public java.lang.String getKey();
```

- *Type:* `java.lang.String`

The key to select the pod label or annotation.

---

### EnvValueFromProcessOptions <a name="org.cdk8s.plus22.EnvValueFromProcessOptions"></a>

Options to specify an environment variable value from the process environment.

#### Initializer <a name="[object Object].Initializer"></a>

```java
import org.cdk8s.plus22.EnvValueFromProcessOptions;

EnvValueFromProcessOptions.builder()
//  .required(java.lang.Boolean)
    .build();
```

##### `required`<sup>Optional</sup> <a name="org.cdk8s.plus22.EnvValueFromProcessOptions.property.required"></a>

```java
public java.lang.Boolean getRequired();
```

- *Type:* `java.lang.Boolean`
- *Default:* false

Specify whether the key must exist in the environment.

If this is set to true, and the key does not exist, an error will thrown.

---

### EnvValueFromResourceOptions <a name="org.cdk8s.plus22.EnvValueFromResourceOptions"></a>

Options to specify an environment variable value from a resource.

#### Initializer <a name="[object Object].Initializer"></a>

```java
import org.cdk8s.plus22.EnvValueFromResourceOptions;

EnvValueFromResourceOptions.builder()
//  .container(Container)
//  .divisor(java.lang.String)
    .build();
```

##### `container`<sup>Optional</sup> <a name="org.cdk8s.plus22.EnvValueFromResourceOptions.property.container"></a>

```java
public Container getContainer();
```

- *Type:* [`org.cdk8s.plus22.Container`](#org.cdk8s.plus22.Container)

The container to select the value from.

---

##### `divisor`<sup>Optional</sup> <a name="org.cdk8s.plus22.EnvValueFromResourceOptions.property.divisor"></a>

```java
public java.lang.String getDivisor();
```

- *Type:* `java.lang.String`

The output format of the exposed resource.

---

### EnvValueFromSecretOptions <a name="org.cdk8s.plus22.EnvValueFromSecretOptions"></a>

Options to specify an environment variable value from a Secret.

#### Initializer <a name="[object Object].Initializer"></a>

```java
import org.cdk8s.plus22.EnvValueFromSecretOptions;

EnvValueFromSecretOptions.builder()
//  .optional(java.lang.Boolean)
    .build();
```

##### `optional`<sup>Optional</sup> <a name="org.cdk8s.plus22.EnvValueFromSecretOptions.property.optional"></a>

```java
public java.lang.Boolean getOptional();
```

- *Type:* `java.lang.Boolean`
- *Default:* false

Specify whether the Secret or its key must be defined.

---

### ExposeDeploymentViaIngressOptions <a name="org.cdk8s.plus22.ExposeDeploymentViaIngressOptions"></a>

Options for exposing a deployment via an ingress.

#### Initializer <a name="[object Object].Initializer"></a>

```java
import org.cdk8s.plus22.ExposeDeploymentViaIngressOptions;

ExposeDeploymentViaIngressOptions.builder()
//  .name(java.lang.String)
//  .port(java.lang.Number)
//  .protocol(Protocol)
//  .serviceType(ServiceType)
//  .targetPort(java.lang.Number)
//  .ingress(Ingress)
//  .pathType(HttpIngressPathType)
    .build();
```

##### `name`<sup>Optional</sup> <a name="org.cdk8s.plus22.ExposeDeploymentViaIngressOptions.property.name"></a>

```java
public java.lang.String getName();
```

- *Type:* `java.lang.String`
- *Default:* undefined Uses the system generated name.

The name of the service to expose.

This will be set on the Service.metadata and must be a DNS_LABEL

---

##### `port`<sup>Optional</sup> <a name="org.cdk8s.plus22.ExposeDeploymentViaIngressOptions.property.port"></a>

```java
public java.lang.Number getPort();
```

- *Type:* `java.lang.Number`
- *Default:* Copied from the container of the deployment. If a port could not be determined, throws an error.

The port that the service should serve on.

---

##### `protocol`<sup>Optional</sup> <a name="org.cdk8s.plus22.ExposeDeploymentViaIngressOptions.property.protocol"></a>

```java
public Protocol getProtocol();
```

- *Type:* [`org.cdk8s.plus22.Protocol`](#org.cdk8s.plus22.Protocol)
- *Default:* Protocol.TCP

The IP protocol for this port.

Supports "TCP", "UDP", and "SCTP". Default is TCP.

---

##### `serviceType`<sup>Optional</sup> <a name="org.cdk8s.plus22.ExposeDeploymentViaIngressOptions.property.serviceType"></a>

```java
public ServiceType getServiceType();
```

- *Type:* [`org.cdk8s.plus22.ServiceType`](#org.cdk8s.plus22.ServiceType)
- *Default:* ClusterIP.

The type of the exposed service.

---

##### `targetPort`<sup>Optional</sup> <a name="org.cdk8s.plus22.ExposeDeploymentViaIngressOptions.property.targetPort"></a>

```java
public java.lang.Number getTargetPort();
```

- *Type:* `java.lang.Number`
- *Default:* The port of the first container in the deployment (ie. containers[0].port)

The port number the service will redirect to.

---

##### `ingress`<sup>Optional</sup> <a name="org.cdk8s.plus22.ExposeDeploymentViaIngressOptions.property.ingress"></a>

```java
public Ingress getIngress();
```

- *Type:* [`org.cdk8s.plus22.Ingress`](#org.cdk8s.plus22.Ingress)
- *Default:* An ingress will be automatically created.

The ingress to add rules to.

---

##### `pathType`<sup>Optional</sup> <a name="org.cdk8s.plus22.ExposeDeploymentViaIngressOptions.property.pathType"></a>

```java
public HttpIngressPathType getPathType();
```

- *Type:* [`org.cdk8s.plus22.HttpIngressPathType`](#org.cdk8s.plus22.HttpIngressPathType)
- *Default:* HttpIngressPathType.PREFIX

The type of the path.

---

### ExposeDeploymentViaServiceOptions <a name="org.cdk8s.plus22.ExposeDeploymentViaServiceOptions"></a>

Options for exposing a deployment via a service.

#### Initializer <a name="[object Object].Initializer"></a>

```java
import org.cdk8s.plus22.ExposeDeploymentViaServiceOptions;

ExposeDeploymentViaServiceOptions.builder()
//  .name(java.lang.String)
//  .port(java.lang.Number)
//  .protocol(Protocol)
//  .serviceType(ServiceType)
//  .targetPort(java.lang.Number)
    .build();
```

##### `name`<sup>Optional</sup> <a name="org.cdk8s.plus22.ExposeDeploymentViaServiceOptions.property.name"></a>

```java
public java.lang.String getName();
```

- *Type:* `java.lang.String`
- *Default:* undefined Uses the system generated name.

The name of the service to expose.

This will be set on the Service.metadata and must be a DNS_LABEL

---

##### `port`<sup>Optional</sup> <a name="org.cdk8s.plus22.ExposeDeploymentViaServiceOptions.property.port"></a>

```java
public java.lang.Number getPort();
```

- *Type:* `java.lang.Number`
- *Default:* Copied from the container of the deployment. If a port could not be determined, throws an error.

The port that the service should serve on.

---

##### `protocol`<sup>Optional</sup> <a name="org.cdk8s.plus22.ExposeDeploymentViaServiceOptions.property.protocol"></a>

```java
public Protocol getProtocol();
```

- *Type:* [`org.cdk8s.plus22.Protocol`](#org.cdk8s.plus22.Protocol)
- *Default:* Protocol.TCP

The IP protocol for this port.

Supports "TCP", "UDP", and "SCTP". Default is TCP.

---

##### `serviceType`<sup>Optional</sup> <a name="org.cdk8s.plus22.ExposeDeploymentViaServiceOptions.property.serviceType"></a>

```java
public ServiceType getServiceType();
```

- *Type:* [`org.cdk8s.plus22.ServiceType`](#org.cdk8s.plus22.ServiceType)
- *Default:* ClusterIP.

The type of the exposed service.

---

##### `targetPort`<sup>Optional</sup> <a name="org.cdk8s.plus22.ExposeDeploymentViaServiceOptions.property.targetPort"></a>

```java
public java.lang.Number getTargetPort();
```

- *Type:* `java.lang.Number`
- *Default:* The port of the first container in the deployment (ie. containers[0].port)

The port number the service will redirect to.

---

### ExposeServiceViaIngressOptions <a name="org.cdk8s.plus22.ExposeServiceViaIngressOptions"></a>

Options for exposing a service using an ingress.

#### Initializer <a name="[object Object].Initializer"></a>

```java
import org.cdk8s.plus22.ExposeServiceViaIngressOptions;

ExposeServiceViaIngressOptions.builder()
//  .ingress(Ingress)
//  .pathType(HttpIngressPathType)
    .build();
```

##### `ingress`<sup>Optional</sup> <a name="org.cdk8s.plus22.ExposeServiceViaIngressOptions.property.ingress"></a>

```java
public Ingress getIngress();
```

- *Type:* [`org.cdk8s.plus22.Ingress`](#org.cdk8s.plus22.Ingress)
- *Default:* An ingress will be automatically created.

The ingress to add rules to.

---

##### `pathType`<sup>Optional</sup> <a name="org.cdk8s.plus22.ExposeServiceViaIngressOptions.property.pathType"></a>

```java
public HttpIngressPathType getPathType();
```

- *Type:* [`org.cdk8s.plus22.HttpIngressPathType`](#org.cdk8s.plus22.HttpIngressPathType)
- *Default:* HttpIngressPathType.PREFIX

The type of the path.

---

### GCEPersistentDiskPersistentVolumeProps <a name="org.cdk8s.plus22.GCEPersistentDiskPersistentVolumeProps"></a>

Properties for `GCEPersistentDiskPersistentVolume`.

#### Initializer <a name="[object Object].Initializer"></a>

```java
import org.cdk8s.plus22.GCEPersistentDiskPersistentVolumeProps;

GCEPersistentDiskPersistentVolumeProps.builder()
//  .metadata(ApiObjectMetadata)
//  .accessModes(java.util.List<PersistentVolumeAccessMode>)
//  .claim(IPersistentVolumeClaim)
//  .mountOptions(java.util.List<java.lang.String>)
//  .reclaimPolicy(PersistentVolumeReclaimPolicy)
//  .storage(Size)
//  .storageClassName(java.lang.String)
//  .volumeMode(PersistentVolumeMode)
    .pdName(java.lang.String)
//  .fsType(java.lang.String)
//  .partition(java.lang.Number)
//  .readOnly(java.lang.Boolean)
    .build();
```

##### `metadata`<sup>Optional</sup> <a name="org.cdk8s.plus22.GCEPersistentDiskPersistentVolumeProps.property.metadata"></a>

```java
public ApiObjectMetadata getMetadata();
```

- *Type:* [`org.cdk8s.ApiObjectMetadata`](#org.cdk8s.ApiObjectMetadata)

Metadata that all persisted resources must have, which includes all objects users must create.

---

##### `accessModes`<sup>Optional</sup> <a name="org.cdk8s.plus22.GCEPersistentDiskPersistentVolumeProps.property.accessModes"></a>

```java
public java.util.List<PersistentVolumeAccessMode> getAccessModes();
```

- *Type:* java.util.List<[`org.cdk8s.plus22.PersistentVolumeAccessMode`](#org.cdk8s.plus22.PersistentVolumeAccessMode)>
- *Default:* No access modes.

Contains all ways the volume can be mounted.

> https://kubernetes.io/docs/concepts/storage/persistent-volumes#access-modes

---

##### `claim`<sup>Optional</sup> <a name="org.cdk8s.plus22.GCEPersistentDiskPersistentVolumeProps.property.claim"></a>

```java
public IPersistentVolumeClaim getClaim();
```

- *Type:* [`org.cdk8s.plus22.IPersistentVolumeClaim`](#org.cdk8s.plus22.IPersistentVolumeClaim)
- *Default:* Not bound to a specific claim.

Part of a bi-directional binding between PersistentVolume and PersistentVolumeClaim.

Expected to be non-nil when bound.

> https://kubernetes.io/docs/concepts/storage/persistent-volumes#binding

---

##### `mountOptions`<sup>Optional</sup> <a name="org.cdk8s.plus22.GCEPersistentDiskPersistentVolumeProps.property.mountOptions"></a>

```java
public java.util.List<java.lang.String> getMountOptions();
```

- *Type:* java.util.List<`java.lang.String`>
- *Default:* No options.

A list of mount options, e.g. ["ro", "soft"]. Not validated - mount will simply fail if one is invalid.

> https://kubernetes.io/docs/concepts/storage/persistent-volumes/#mount-options

---

##### `reclaimPolicy`<sup>Optional</sup> <a name="org.cdk8s.plus22.GCEPersistentDiskPersistentVolumeProps.property.reclaimPolicy"></a>

```java
public PersistentVolumeReclaimPolicy getReclaimPolicy();
```

- *Type:* [`org.cdk8s.plus22.PersistentVolumeReclaimPolicy`](#org.cdk8s.plus22.PersistentVolumeReclaimPolicy)
- *Default:* PersistentVolumeReclaimPolicy.RETAIN

When a user is done with their volume, they can delete the PVC objects from the API that allows reclamation of the resource.

The reclaim policy tells the cluster what to do with
the volume after it has been released of its claim.

> https://kubernetes.io/docs/concepts/storage/persistent-volumes#reclaiming

---

##### `storage`<sup>Optional</sup> <a name="org.cdk8s.plus22.GCEPersistentDiskPersistentVolumeProps.property.storage"></a>

```java
public Size getStorage();
```

- *Type:* [`org.cdk8s.Size`](#org.cdk8s.Size)
- *Default:* No specified.

What is the storage capacity of this volume.

> https://kubernetes.io/docs/concepts/storage/persistent-volumes#resources

---

##### `storageClassName`<sup>Optional</sup> <a name="org.cdk8s.plus22.GCEPersistentDiskPersistentVolumeProps.property.storageClassName"></a>

```java
public java.lang.String getStorageClassName();
```

- *Type:* `java.lang.String`
- *Default:* Volume does not belong to any storage class.

Name of StorageClass to which this persistent volume belongs.

---

##### `volumeMode`<sup>Optional</sup> <a name="org.cdk8s.plus22.GCEPersistentDiskPersistentVolumeProps.property.volumeMode"></a>

```java
public PersistentVolumeMode getVolumeMode();
```

- *Type:* [`org.cdk8s.plus22.PersistentVolumeMode`](#org.cdk8s.plus22.PersistentVolumeMode)
- *Default:* VolumeMode.FILE_SYSTEM

Defines what type of volume is required by the claim.

---

##### `pdName`<sup>Required</sup> <a name="org.cdk8s.plus22.GCEPersistentDiskPersistentVolumeProps.property.pdName"></a>

```java
public java.lang.String getPdName();
```

- *Type:* `java.lang.String`

Unique name of the PD resource in GCE.

Used to identify the disk in GCE.

> https://kubernetes.io/docs/concepts/storage/volumes#gcepersistentdisk

---

##### `fsType`<sup>Optional</sup> <a name="org.cdk8s.plus22.GCEPersistentDiskPersistentVolumeProps.property.fsType"></a>

```java
public java.lang.String getFsType();
```

- *Type:* `java.lang.String`
- *Default:* 'ext4'

Filesystem type of the volume that you want to mount.

Tip: Ensure that the filesystem type is supported by the host operating system.

> https://kubernetes.io/docs/concepts/storage/volumes#awselasticblockstore

---

##### `partition`<sup>Optional</sup> <a name="org.cdk8s.plus22.GCEPersistentDiskPersistentVolumeProps.property.partition"></a>

```java
public java.lang.Number getPartition();
```

- *Type:* `java.lang.Number`
- *Default:* No partition.

The partition in the volume that you want to mount.

If omitted, the default is to mount by volume name.
Examples: For volume /dev/sda1, you specify the partition as "1".
Similarly, the volume partition for /dev/sda is "0" (or you can leave the property empty).

---

##### `readOnly`<sup>Optional</sup> <a name="org.cdk8s.plus22.GCEPersistentDiskPersistentVolumeProps.property.readOnly"></a>

```java
public java.lang.Boolean getReadOnly();
```

- *Type:* `java.lang.Boolean`
- *Default:* false

Specify "true" to force and set the ReadOnly property in VolumeMounts to "true".

> https://kubernetes.io/docs/concepts/storage/volumes#awselasticblockstore

---

### HandlerFromHttpGetOptions <a name="org.cdk8s.plus22.HandlerFromHttpGetOptions"></a>

Options for `Handler.fromHttpGet`.

#### Initializer <a name="[object Object].Initializer"></a>

```java
import org.cdk8s.plus22.HandlerFromHttpGetOptions;

HandlerFromHttpGetOptions.builder()
//  .port(java.lang.Number)
    .build();
```

##### `port`<sup>Optional</sup> <a name="org.cdk8s.plus22.HandlerFromHttpGetOptions.property.port"></a>

```java
public java.lang.Number getPort();
```

- *Type:* `java.lang.Number`
- *Default:* defaults to `container.port`.

The TCP port to use when sending the GET request.

---

### HandlerFromTcpSocketOptions <a name="org.cdk8s.plus22.HandlerFromTcpSocketOptions"></a>

Options for `Handler.fromTcpSocket`.

#### Initializer <a name="[object Object].Initializer"></a>

```java
import org.cdk8s.plus22.HandlerFromTcpSocketOptions;

HandlerFromTcpSocketOptions.builder()
//  .host(java.lang.String)
//  .port(java.lang.Number)
    .build();
```

##### `host`<sup>Optional</sup> <a name="org.cdk8s.plus22.HandlerFromTcpSocketOptions.property.host"></a>

```java
public java.lang.String getHost();
```

- *Type:* `java.lang.String`
- *Default:* defaults to the pod IP

The host name to connect to on the container.

---

##### `port`<sup>Optional</sup> <a name="org.cdk8s.plus22.HandlerFromTcpSocketOptions.property.port"></a>

```java
public java.lang.Number getPort();
```

- *Type:* `java.lang.Number`
- *Default:* defaults to `container.port`.

The TCP port to connect to on the container.

---

### HostAlias <a name="org.cdk8s.plus22.HostAlias"></a>

HostAlias holds the mapping between IP and hostnames that will be injected as an entry in the pod's /etc/hosts file.

#### Initializer <a name="[object Object].Initializer"></a>

```java
import org.cdk8s.plus22.HostAlias;

HostAlias.builder()
    .hostnames(java.util.List<java.lang.String>)
    .ip(java.lang.String)
    .build();
```

##### `hostnames`<sup>Required</sup> <a name="org.cdk8s.plus22.HostAlias.property.hostnames"></a>

```java
public java.util.List<java.lang.String> getHostnames();
```

- *Type:* java.util.List<`java.lang.String`>

Hostnames for the chosen IP address.

---

##### `ip`<sup>Required</sup> <a name="org.cdk8s.plus22.HostAlias.property.ip"></a>

```java
public java.lang.String getIp();
```

- *Type:* `java.lang.String`

IP address of the host file entry.

---

### HttpGetProbeOptions <a name="org.cdk8s.plus22.HttpGetProbeOptions"></a>

Options for `Probe.fromHttpGet()`.

#### Initializer <a name="[object Object].Initializer"></a>

```java
import org.cdk8s.plus22.HttpGetProbeOptions;

HttpGetProbeOptions.builder()
//  .failureThreshold(java.lang.Number)
//  .initialDelaySeconds(Duration)
//  .periodSeconds(Duration)
//  .successThreshold(java.lang.Number)
//  .timeoutSeconds(Duration)
//  .port(java.lang.Number)
    .build();
```

##### `failureThreshold`<sup>Optional</sup> <a name="org.cdk8s.plus22.HttpGetProbeOptions.property.failureThreshold"></a>

```java
public java.lang.Number getFailureThreshold();
```

- *Type:* `java.lang.Number`
- *Default:* 3

Minimum consecutive failures for the probe to be considered failed after having succeeded.

Defaults to 3. Minimum value is 1.

---

##### `initialDelaySeconds`<sup>Optional</sup> <a name="org.cdk8s.plus22.HttpGetProbeOptions.property.initialDelaySeconds"></a>

```java
public Duration getInitialDelaySeconds();
```

- *Type:* [`org.cdk8s.Duration`](#org.cdk8s.Duration)
- *Default:* immediate

Number of seconds after the container has started before liveness probes are initiated.

> https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle#container-probes

---

##### `periodSeconds`<sup>Optional</sup> <a name="org.cdk8s.plus22.HttpGetProbeOptions.property.periodSeconds"></a>

```java
public Duration getPeriodSeconds();
```

- *Type:* [`org.cdk8s.Duration`](#org.cdk8s.Duration)
- *Default:* Duration.seconds(10) Minimum value is 1.

How often (in seconds) to perform the probe.

Default to 10 seconds. Minimum value is 1.

---

##### `successThreshold`<sup>Optional</sup> <a name="org.cdk8s.plus22.HttpGetProbeOptions.property.successThreshold"></a>

```java
public java.lang.Number getSuccessThreshold();
```

- *Type:* `java.lang.Number`
- *Default:* 1 Must be 1 for liveness and startup. Minimum value is 1.

Minimum consecutive successes for the probe to be considered successful after having failed. Defaults to 1.

Must be 1 for liveness and startup. Minimum value is 1.

---

##### `timeoutSeconds`<sup>Optional</sup> <a name="org.cdk8s.plus22.HttpGetProbeOptions.property.timeoutSeconds"></a>

```java
public Duration getTimeoutSeconds();
```

- *Type:* [`org.cdk8s.Duration`](#org.cdk8s.Duration)
- *Default:* Duration.seconds(1)

Number of seconds after which the probe times out.

Defaults to 1 second. Minimum value is 1.

> https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle#container-probes

---

##### `port`<sup>Optional</sup> <a name="org.cdk8s.plus22.HttpGetProbeOptions.property.port"></a>

```java
public java.lang.Number getPort();
```

- *Type:* `java.lang.Number`
- *Default:* defaults to `container.port`.

The TCP port to use when sending the GET request.

---

### IngressProps <a name="org.cdk8s.plus22.IngressProps"></a>

Properties for `Ingress`.

#### Initializer <a name="[object Object].Initializer"></a>

```java
import org.cdk8s.plus22.IngressProps;

IngressProps.builder()
//  .metadata(ApiObjectMetadata)
//  .defaultBackend(IngressBackend)
//  .rules(java.util.List<IngressRule>)
//  .tls(java.util.List<IngressTls>)
    .build();
```

##### `metadata`<sup>Optional</sup> <a name="org.cdk8s.plus22.IngressProps.property.metadata"></a>

```java
public ApiObjectMetadata getMetadata();
```

- *Type:* [`org.cdk8s.ApiObjectMetadata`](#org.cdk8s.ApiObjectMetadata)

Metadata that all persisted resources must have, which includes all objects users must create.

---

##### `defaultBackend`<sup>Optional</sup> <a name="org.cdk8s.plus22.IngressProps.property.defaultBackend"></a>

```java
public IngressBackend getDefaultBackend();
```

- *Type:* [`org.cdk8s.plus22.IngressBackend`](#org.cdk8s.plus22.IngressBackend)

The default backend services requests that do not match any rule.

Using this option or the `addDefaultBackend()` method is equivalent to
adding a rule with both `path` and `host` undefined.

---

##### `rules`<sup>Optional</sup> <a name="org.cdk8s.plus22.IngressProps.property.rules"></a>

```java
public java.util.List<IngressRule> getRules();
```

- *Type:* java.util.List<[`org.cdk8s.plus22.IngressRule`](#org.cdk8s.plus22.IngressRule)>

Routing rules for this ingress.

Each rule must define an `IngressBackend` that will receive the requests
that match this rule. If both `host` and `path` are not specifiec, this
backend will be used as the default backend of the ingress.

You can also add rules later using `addRule()`, `addHostRule()`,
`addDefaultBackend()` and `addHostDefaultBackend()`.

---

##### `tls`<sup>Optional</sup> <a name="org.cdk8s.plus22.IngressProps.property.tls"></a>

```java
public java.util.List<IngressTls> getTls();
```

- *Type:* java.util.List<[`org.cdk8s.plus22.IngressTls`](#org.cdk8s.plus22.IngressTls)>

TLS settings for this ingress.

Using this option tells the ingress controller to expose a TLS endpoint.
Currently the Ingress only supports a single TLS port, 443. If multiple
members of this list specify different hosts, they will be multiplexed on
the same port according to the hostname specified through the SNI TLS
extension, if the ingress controller fulfilling the ingress supports SNI.

---

### IngressRule <a name="org.cdk8s.plus22.IngressRule"></a>

Represents the rules mapping the paths under a specified host to the related backend services.

Incoming requests are first evaluated for a host match,
then routed to the backend associated with the matching path.

#### Initializer <a name="[object Object].Initializer"></a>

```java
import org.cdk8s.plus22.IngressRule;

IngressRule.builder()
    .backend(IngressBackend)
//  .host(java.lang.String)
//  .path(java.lang.String)
//  .pathType(HttpIngressPathType)
    .build();
```

##### `backend`<sup>Required</sup> <a name="org.cdk8s.plus22.IngressRule.property.backend"></a>

```java
public IngressBackend getBackend();
```

- *Type:* [`org.cdk8s.plus22.IngressBackend`](#org.cdk8s.plus22.IngressBackend)

Backend defines the referenced service endpoint to which the traffic will be forwarded to.

---

##### `host`<sup>Optional</sup> <a name="org.cdk8s.plus22.IngressRule.property.host"></a>

```java
public java.lang.String getHost();
```

- *Type:* `java.lang.String`
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

##### `path`<sup>Optional</sup> <a name="org.cdk8s.plus22.IngressRule.property.path"></a>

```java
public java.lang.String getPath();
```

- *Type:* `java.lang.String`
- *Default:* If unspecified, the path defaults to a catch all sending traffic
to the backend.

Path is an extended POSIX regex as defined by IEEE Std 1003.1, (i.e this follows the egrep/unix syntax, not the perl syntax) matched against the path of an incoming request. Currently it can contain characters disallowed from the conventional "path" part of a URL as defined by RFC 3986. Paths must begin with a '/'.

---

##### `pathType`<sup>Optional</sup> <a name="org.cdk8s.plus22.IngressRule.property.pathType"></a>

```java
public HttpIngressPathType getPathType();
```

- *Type:* [`org.cdk8s.plus22.HttpIngressPathType`](#org.cdk8s.plus22.HttpIngressPathType)

Specify how the path is matched against request paths.

By default, path
types will be matched by prefix.

> https://kubernetes.io/docs/concepts/services-networking/ingress/#path-types

---

### IngressTls <a name="org.cdk8s.plus22.IngressTls"></a>

Represents the TLS configuration mapping that is passed to the ingress controller for SSL termination.

#### Initializer <a name="[object Object].Initializer"></a>

```java
import org.cdk8s.plus22.IngressTls;

IngressTls.builder()
//  .hosts(java.util.List<java.lang.String>)
//  .secret(ISecret)
    .build();
```

##### `hosts`<sup>Optional</sup> <a name="org.cdk8s.plus22.IngressTls.property.hosts"></a>

```java
public java.util.List<java.lang.String> getHosts();
```

- *Type:* java.util.List<`java.lang.String`>
- *Default:* If unspecified, it defaults to the wildcard host setting for
the loadbalancer controller fulfilling this Ingress.

Hosts are a list of hosts included in the TLS certificate.

The values in
this list must match the name/s used in the TLS Secret.

---

##### `secret`<sup>Optional</sup> <a name="org.cdk8s.plus22.IngressTls.property.secret"></a>

```java
public ISecret getSecret();
```

- *Type:* [`org.cdk8s.plus22.ISecret`](#org.cdk8s.plus22.ISecret)
- *Default:* If unspecified, it allows SSL routing based on SNI hostname.

Secret is the secret that contains the certificate and key used to terminate SSL traffic on 443.

If the SNI host in a listener conflicts with
the "Host" header field used by an IngressRule, the SNI host is used for
termination and value of the Host header is used for routing.

---

### JobProps <a name="org.cdk8s.plus22.JobProps"></a>

Properties for initialization of `Job`.

#### Initializer <a name="[object Object].Initializer"></a>

```java
import org.cdk8s.plus22.JobProps;

JobProps.builder()
//  .metadata(ApiObjectMetadata)
//  .containers(java.util.List<ContainerProps>)
//  .hostAliases(java.util.List<HostAlias>)
//  .initContainers(java.util.List<ContainerProps>)
//  .restartPolicy(RestartPolicy)
//  .securityContext(PodSecurityContextProps)
//  .serviceAccount(IServiceAccount)
//  .volumes(java.util.List<Volume>)
//  .podMetadata(ApiObjectMetadata)
//  .activeDeadline(Duration)
//  .backoffLimit(java.lang.Number)
//  .ttlAfterFinished(Duration)
    .build();
```

##### `metadata`<sup>Optional</sup> <a name="org.cdk8s.plus22.JobProps.property.metadata"></a>

```java
public ApiObjectMetadata getMetadata();
```

- *Type:* [`org.cdk8s.ApiObjectMetadata`](#org.cdk8s.ApiObjectMetadata)

Metadata that all persisted resources must have, which includes all objects users must create.

---

##### `containers`<sup>Optional</sup> <a name="org.cdk8s.plus22.JobProps.property.containers"></a>

```java
public java.util.List<ContainerProps> getContainers();
```

- *Type:* java.util.List<[`org.cdk8s.plus22.ContainerProps`](#org.cdk8s.plus22.ContainerProps)>
- *Default:* No containers. Note that a pod spec must include at least one container.

List of containers belonging to the pod.

Containers cannot currently be
added or removed. There must be at least one container in a Pod.

You can add additionnal containers using `podSpec.addContainer()`

---

##### `hostAliases`<sup>Optional</sup> <a name="org.cdk8s.plus22.JobProps.property.hostAliases"></a>

```java
public java.util.List<HostAlias> getHostAliases();
```

- *Type:* java.util.List<[`org.cdk8s.plus22.HostAlias`](#org.cdk8s.plus22.HostAlias)>

HostAlias holds the mapping between IP and hostnames that will be injected as an entry in the pod's hosts file.

---

##### `initContainers`<sup>Optional</sup> <a name="org.cdk8s.plus22.JobProps.property.initContainers"></a>

```java
public java.util.List<ContainerProps> getInitContainers();
```

- *Type:* java.util.List<[`org.cdk8s.plus22.ContainerProps`](#org.cdk8s.plus22.ContainerProps)>
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

##### `restartPolicy`<sup>Optional</sup> <a name="org.cdk8s.plus22.JobProps.property.restartPolicy"></a>

```java
public RestartPolicy getRestartPolicy();
```

- *Type:* [`org.cdk8s.plus22.RestartPolicy`](#org.cdk8s.plus22.RestartPolicy)
- *Default:* RestartPolicy.ALWAYS

Restart policy for all containers within the pod.

> https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle/#restart-policy

---

##### `securityContext`<sup>Optional</sup> <a name="org.cdk8s.plus22.JobProps.property.securityContext"></a>

```java
public PodSecurityContextProps getSecurityContext();
```

- *Type:* [`org.cdk8s.plus22.PodSecurityContextProps`](#org.cdk8s.plus22.PodSecurityContextProps)
- *Default:* fsGroupChangePolicy: FsGroupChangePolicy.FsGroupChangePolicy.ALWAYS
  ensureNonRoot: false

SecurityContext holds pod-level security attributes and common container settings.

---

##### `serviceAccount`<sup>Optional</sup> <a name="org.cdk8s.plus22.JobProps.property.serviceAccount"></a>

```java
public IServiceAccount getServiceAccount();
```

- *Type:* [`org.cdk8s.plus22.IServiceAccount`](#org.cdk8s.plus22.IServiceAccount)
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

##### `volumes`<sup>Optional</sup> <a name="org.cdk8s.plus22.JobProps.property.volumes"></a>

```java
public java.util.List<Volume> getVolumes();
```

- *Type:* java.util.List<[`org.cdk8s.plus22.Volume`](#org.cdk8s.plus22.Volume)>
- *Default:* No volumes.

List of volumes that can be mounted by containers belonging to the pod.

You can also add volumes later using `podSpec.addVolume()`

> https://kubernetes.io/docs/concepts/storage/volumes

---

##### `podMetadata`<sup>Optional</sup> <a name="org.cdk8s.plus22.JobProps.property.podMetadata"></a>

```java
public ApiObjectMetadata getPodMetadata();
```

- *Type:* [`org.cdk8s.ApiObjectMetadata`](#org.cdk8s.ApiObjectMetadata)

The pod metadata.

---

##### `activeDeadline`<sup>Optional</sup> <a name="org.cdk8s.plus22.JobProps.property.activeDeadline"></a>

```java
public Duration getActiveDeadline();
```

- *Type:* [`org.cdk8s.Duration`](#org.cdk8s.Duration)
- *Default:* If unset, then there is no deadline.

Specifies the duration the job may be active before the system tries to terminate it.

---

##### `backoffLimit`<sup>Optional</sup> <a name="org.cdk8s.plus22.JobProps.property.backoffLimit"></a>

```java
public java.lang.Number getBackoffLimit();
```

- *Type:* `java.lang.Number`
- *Default:* If not set, system defaults to 6.

Specifies the number of retries before marking this job failed.

---

##### `ttlAfterFinished`<sup>Optional</sup> <a name="org.cdk8s.plus22.JobProps.property.ttlAfterFinished"></a>

```java
public Duration getTtlAfterFinished();
```

- *Type:* [`org.cdk8s.Duration`](#org.cdk8s.Duration)
- *Default:* If this field is unset, the Job won't be automatically deleted.

Limits the lifetime of a Job that has finished execution (either Complete or Failed).

If this field is set, after the Job finishes, it is eligible to
be automatically deleted. When the Job is being deleted, its lifecycle
guarantees (e.g. finalizers) will be honored. If this field is set to zero,
the Job becomes eligible to be deleted immediately after it finishes. This
field is alpha-level and is only honored by servers that enable the
`TTLAfterFinished` feature.

---

### MemoryResources <a name="org.cdk8s.plus22.MemoryResources"></a>

Memory request and limit.

#### Initializer <a name="[object Object].Initializer"></a>

```java
import org.cdk8s.plus22.MemoryResources;

MemoryResources.builder()
    .limit(Size)
    .request(Size)
    .build();
```

##### `limit`<sup>Required</sup> <a name="org.cdk8s.plus22.MemoryResources.property.limit"></a>

```java
public Size getLimit();
```

- *Type:* [`org.cdk8s.Size`](#org.cdk8s.Size)

---

##### `request`<sup>Required</sup> <a name="org.cdk8s.plus22.MemoryResources.property.request"></a>

```java
public Size getRequest();
```

- *Type:* [`org.cdk8s.Size`](#org.cdk8s.Size)

---

### MountOptions <a name="org.cdk8s.plus22.MountOptions"></a>

Options for mounts.

#### Initializer <a name="[object Object].Initializer"></a>

```java
import org.cdk8s.plus22.MountOptions;

MountOptions.builder()
//  .propagation(MountPropagation)
//  .readOnly(java.lang.Boolean)
//  .subPath(java.lang.String)
//  .subPathExpr(java.lang.String)
    .build();
```

##### `propagation`<sup>Optional</sup> <a name="org.cdk8s.plus22.MountOptions.property.propagation"></a>

```java
public MountPropagation getPropagation();
```

- *Type:* [`org.cdk8s.plus22.MountPropagation`](#org.cdk8s.plus22.MountPropagation)
- *Default:* MountPropagation.NONE

Determines how mounts are propagated from the host to container and the other way around.

When not set, MountPropagationNone is used.

Mount propagation allows for sharing volumes mounted by a Container to
other Containers in the same Pod, or even to other Pods on the same node.

---

##### `readOnly`<sup>Optional</sup> <a name="org.cdk8s.plus22.MountOptions.property.readOnly"></a>

```java
public java.lang.Boolean getReadOnly();
```

- *Type:* `java.lang.Boolean`
- *Default:* false

Mounted read-only if true, read-write otherwise (false or unspecified).

Defaults to false.

---

##### `subPath`<sup>Optional</sup> <a name="org.cdk8s.plus22.MountOptions.property.subPath"></a>

```java
public java.lang.String getSubPath();
```

- *Type:* `java.lang.String`
- *Default:* "" the volume's root

Path within the volume from which the container's volume should be mounted.).

---

##### `subPathExpr`<sup>Optional</sup> <a name="org.cdk8s.plus22.MountOptions.property.subPathExpr"></a>

```java
public java.lang.String getSubPathExpr();
```

- *Type:* `java.lang.String`
- *Default:* "" volume's root.

Expanded path within the volume from which the container's volume should be mounted.

Behaves similarly to SubPath but environment variable references
$(VAR_NAME) are expanded using the container's environment. Defaults to ""
(volume's root).

`subPathExpr` and `subPath` are mutually exclusive.

---

### PathMapping <a name="org.cdk8s.plus22.PathMapping"></a>

Maps a string key to a path within a volume.

#### Initializer <a name="[object Object].Initializer"></a>

```java
import org.cdk8s.plus22.PathMapping;

PathMapping.builder()
    .path(java.lang.String)
//  .mode(java.lang.Number)
    .build();
```

##### `path`<sup>Required</sup> <a name="org.cdk8s.plus22.PathMapping.property.path"></a>

```java
public java.lang.String getPath();
```

- *Type:* `java.lang.String`

The relative path of the file to map the key to.

May not be an absolute
path. May not contain the path element '..'. May not start with the string
'..'.

---

##### `mode`<sup>Optional</sup> <a name="org.cdk8s.plus22.PathMapping.property.mode"></a>

```java
public java.lang.Number getMode();
```

- *Type:* `java.lang.Number`

Optional: mode bits to use on this file, must be a value between 0 and 0777.

If not specified, the volume defaultMode will be used. This might be
in conflict with other options that affect the file mode, like fsGroup, and
the result can be other mode bits set.

---

### PersistentVolumeClaimProps <a name="org.cdk8s.plus22.PersistentVolumeClaimProps"></a>

Properties for `PersistentVolumeClaim`.

#### Initializer <a name="[object Object].Initializer"></a>

```java
import org.cdk8s.plus22.PersistentVolumeClaimProps;

PersistentVolumeClaimProps.builder()
//  .metadata(ApiObjectMetadata)
//  .accessModes(java.util.List<PersistentVolumeAccessMode>)
//  .storage(Size)
//  .storageClassName(java.lang.String)
//  .volume(IPersistentVolume)
//  .volumeMode(PersistentVolumeMode)
    .build();
```

##### `metadata`<sup>Optional</sup> <a name="org.cdk8s.plus22.PersistentVolumeClaimProps.property.metadata"></a>

```java
public ApiObjectMetadata getMetadata();
```

- *Type:* [`org.cdk8s.ApiObjectMetadata`](#org.cdk8s.ApiObjectMetadata)

Metadata that all persisted resources must have, which includes all objects users must create.

---

##### `accessModes`<sup>Optional</sup> <a name="org.cdk8s.plus22.PersistentVolumeClaimProps.property.accessModes"></a>

```java
public java.util.List<PersistentVolumeAccessMode> getAccessModes();
```

- *Type:* java.util.List<[`org.cdk8s.plus22.PersistentVolumeAccessMode`](#org.cdk8s.plus22.PersistentVolumeAccessMode)>
- *Default:* No access modes requirement.

Contains the access modes the volume should support.

> https://kubernetes.io/docs/concepts/storage/persistent-volumes#access-modes-1

---

##### `storage`<sup>Optional</sup> <a name="org.cdk8s.plus22.PersistentVolumeClaimProps.property.storage"></a>

```java
public Size getStorage();
```

- *Type:* [`org.cdk8s.Size`](#org.cdk8s.Size)
- *Default:* No storage requirement.

Minimum storage size the volume should have.

> https://kubernetes.io/docs/concepts/storage/persistent-volumes#resources

---

##### `storageClassName`<sup>Optional</sup> <a name="org.cdk8s.plus22.PersistentVolumeClaimProps.property.storageClassName"></a>

```java
public java.lang.String getStorageClassName();
```

- *Type:* `java.lang.String`
- *Default:* Not set.

Name of the StorageClass required by the claim. When this property is not set, the behavior is as follows:.

* If the admission plugin is turned on, the storage class marked as default will be used.
* If the admission plugin is turned off, the pvc can only be bound to volumes without a storage class.

> https://kubernetes.io/docs/concepts/storage/persistent-volumes#class-1

---

##### `volume`<sup>Optional</sup> <a name="org.cdk8s.plus22.PersistentVolumeClaimProps.property.volume"></a>

```java
public IPersistentVolume getVolume();
```

- *Type:* [`org.cdk8s.plus22.IPersistentVolume`](#org.cdk8s.plus22.IPersistentVolume)
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

##### `volumeMode`<sup>Optional</sup> <a name="org.cdk8s.plus22.PersistentVolumeClaimProps.property.volumeMode"></a>

```java
public PersistentVolumeMode getVolumeMode();
```

- *Type:* [`org.cdk8s.plus22.PersistentVolumeMode`](#org.cdk8s.plus22.PersistentVolumeMode)
- *Default:* VolumeMode.FILE_SYSTEM

Defines what type of volume is required by the claim.

---

### PersistentVolumeClaimVolumeOptions <a name="org.cdk8s.plus22.PersistentVolumeClaimVolumeOptions"></a>

Options for a PersistentVolumeClaim-based volume.

#### Initializer <a name="[object Object].Initializer"></a>

```java
import org.cdk8s.plus22.PersistentVolumeClaimVolumeOptions;

PersistentVolumeClaimVolumeOptions.builder()
//  .name(java.lang.String)
//  .readOnly(java.lang.Boolean)
    .build();
```

##### `name`<sup>Optional</sup> <a name="org.cdk8s.plus22.PersistentVolumeClaimVolumeOptions.property.name"></a>

```java
public java.lang.String getName();
```

- *Type:* `java.lang.String`
- *Default:* Derived from the PVC name.

The volume name.

---

##### `readOnly`<sup>Optional</sup> <a name="org.cdk8s.plus22.PersistentVolumeClaimVolumeOptions.property.readOnly"></a>

```java
public java.lang.Boolean getReadOnly();
```

- *Type:* `java.lang.Boolean`
- *Default:* false

Will force the ReadOnly setting in VolumeMounts.

---

### PersistentVolumeProps <a name="org.cdk8s.plus22.PersistentVolumeProps"></a>

Properties for `PersistentVolume`.

#### Initializer <a name="[object Object].Initializer"></a>

```java
import org.cdk8s.plus22.PersistentVolumeProps;

PersistentVolumeProps.builder()
//  .metadata(ApiObjectMetadata)
//  .accessModes(java.util.List<PersistentVolumeAccessMode>)
//  .claim(IPersistentVolumeClaim)
//  .mountOptions(java.util.List<java.lang.String>)
//  .reclaimPolicy(PersistentVolumeReclaimPolicy)
//  .storage(Size)
//  .storageClassName(java.lang.String)
//  .volumeMode(PersistentVolumeMode)
    .build();
```

##### `metadata`<sup>Optional</sup> <a name="org.cdk8s.plus22.PersistentVolumeProps.property.metadata"></a>

```java
public ApiObjectMetadata getMetadata();
```

- *Type:* [`org.cdk8s.ApiObjectMetadata`](#org.cdk8s.ApiObjectMetadata)

Metadata that all persisted resources must have, which includes all objects users must create.

---

##### `accessModes`<sup>Optional</sup> <a name="org.cdk8s.plus22.PersistentVolumeProps.property.accessModes"></a>

```java
public java.util.List<PersistentVolumeAccessMode> getAccessModes();
```

- *Type:* java.util.List<[`org.cdk8s.plus22.PersistentVolumeAccessMode`](#org.cdk8s.plus22.PersistentVolumeAccessMode)>
- *Default:* No access modes.

Contains all ways the volume can be mounted.

> https://kubernetes.io/docs/concepts/storage/persistent-volumes#access-modes

---

##### `claim`<sup>Optional</sup> <a name="org.cdk8s.plus22.PersistentVolumeProps.property.claim"></a>

```java
public IPersistentVolumeClaim getClaim();
```

- *Type:* [`org.cdk8s.plus22.IPersistentVolumeClaim`](#org.cdk8s.plus22.IPersistentVolumeClaim)
- *Default:* Not bound to a specific claim.

Part of a bi-directional binding between PersistentVolume and PersistentVolumeClaim.

Expected to be non-nil when bound.

> https://kubernetes.io/docs/concepts/storage/persistent-volumes#binding

---

##### `mountOptions`<sup>Optional</sup> <a name="org.cdk8s.plus22.PersistentVolumeProps.property.mountOptions"></a>

```java
public java.util.List<java.lang.String> getMountOptions();
```

- *Type:* java.util.List<`java.lang.String`>
- *Default:* No options.

A list of mount options, e.g. ["ro", "soft"]. Not validated - mount will simply fail if one is invalid.

> https://kubernetes.io/docs/concepts/storage/persistent-volumes/#mount-options

---

##### `reclaimPolicy`<sup>Optional</sup> <a name="org.cdk8s.plus22.PersistentVolumeProps.property.reclaimPolicy"></a>

```java
public PersistentVolumeReclaimPolicy getReclaimPolicy();
```

- *Type:* [`org.cdk8s.plus22.PersistentVolumeReclaimPolicy`](#org.cdk8s.plus22.PersistentVolumeReclaimPolicy)
- *Default:* PersistentVolumeReclaimPolicy.RETAIN

When a user is done with their volume, they can delete the PVC objects from the API that allows reclamation of the resource.

The reclaim policy tells the cluster what to do with
the volume after it has been released of its claim.

> https://kubernetes.io/docs/concepts/storage/persistent-volumes#reclaiming

---

##### `storage`<sup>Optional</sup> <a name="org.cdk8s.plus22.PersistentVolumeProps.property.storage"></a>

```java
public Size getStorage();
```

- *Type:* [`org.cdk8s.Size`](#org.cdk8s.Size)
- *Default:* No specified.

What is the storage capacity of this volume.

> https://kubernetes.io/docs/concepts/storage/persistent-volumes#resources

---

##### `storageClassName`<sup>Optional</sup> <a name="org.cdk8s.plus22.PersistentVolumeProps.property.storageClassName"></a>

```java
public java.lang.String getStorageClassName();
```

- *Type:* `java.lang.String`
- *Default:* Volume does not belong to any storage class.

Name of StorageClass to which this persistent volume belongs.

---

##### `volumeMode`<sup>Optional</sup> <a name="org.cdk8s.plus22.PersistentVolumeProps.property.volumeMode"></a>

```java
public PersistentVolumeMode getVolumeMode();
```

- *Type:* [`org.cdk8s.plus22.PersistentVolumeMode`](#org.cdk8s.plus22.PersistentVolumeMode)
- *Default:* VolumeMode.FILE_SYSTEM

Defines what type of volume is required by the claim.

---

### PodProps <a name="org.cdk8s.plus22.PodProps"></a>

Properties for initialization of `Pod`.

#### Initializer <a name="[object Object].Initializer"></a>

```java
import org.cdk8s.plus22.PodProps;

PodProps.builder()
//  .metadata(ApiObjectMetadata)
//  .containers(java.util.List<ContainerProps>)
//  .hostAliases(java.util.List<HostAlias>)
//  .initContainers(java.util.List<ContainerProps>)
//  .restartPolicy(RestartPolicy)
//  .securityContext(PodSecurityContextProps)
//  .serviceAccount(IServiceAccount)
//  .volumes(java.util.List<Volume>)
    .build();
```

##### `metadata`<sup>Optional</sup> <a name="org.cdk8s.plus22.PodProps.property.metadata"></a>

```java
public ApiObjectMetadata getMetadata();
```

- *Type:* [`org.cdk8s.ApiObjectMetadata`](#org.cdk8s.ApiObjectMetadata)

Metadata that all persisted resources must have, which includes all objects users must create.

---

##### `containers`<sup>Optional</sup> <a name="org.cdk8s.plus22.PodProps.property.containers"></a>

```java
public java.util.List<ContainerProps> getContainers();
```

- *Type:* java.util.List<[`org.cdk8s.plus22.ContainerProps`](#org.cdk8s.plus22.ContainerProps)>
- *Default:* No containers. Note that a pod spec must include at least one container.

List of containers belonging to the pod.

Containers cannot currently be
added or removed. There must be at least one container in a Pod.

You can add additionnal containers using `podSpec.addContainer()`

---

##### `hostAliases`<sup>Optional</sup> <a name="org.cdk8s.plus22.PodProps.property.hostAliases"></a>

```java
public java.util.List<HostAlias> getHostAliases();
```

- *Type:* java.util.List<[`org.cdk8s.plus22.HostAlias`](#org.cdk8s.plus22.HostAlias)>

HostAlias holds the mapping between IP and hostnames that will be injected as an entry in the pod's hosts file.

---

##### `initContainers`<sup>Optional</sup> <a name="org.cdk8s.plus22.PodProps.property.initContainers"></a>

```java
public java.util.List<ContainerProps> getInitContainers();
```

- *Type:* java.util.List<[`org.cdk8s.plus22.ContainerProps`](#org.cdk8s.plus22.ContainerProps)>
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

##### `restartPolicy`<sup>Optional</sup> <a name="org.cdk8s.plus22.PodProps.property.restartPolicy"></a>

```java
public RestartPolicy getRestartPolicy();
```

- *Type:* [`org.cdk8s.plus22.RestartPolicy`](#org.cdk8s.plus22.RestartPolicy)
- *Default:* RestartPolicy.ALWAYS

Restart policy for all containers within the pod.

> https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle/#restart-policy

---

##### `securityContext`<sup>Optional</sup> <a name="org.cdk8s.plus22.PodProps.property.securityContext"></a>

```java
public PodSecurityContextProps getSecurityContext();
```

- *Type:* [`org.cdk8s.plus22.PodSecurityContextProps`](#org.cdk8s.plus22.PodSecurityContextProps)
- *Default:* fsGroupChangePolicy: FsGroupChangePolicy.FsGroupChangePolicy.ALWAYS
  ensureNonRoot: false

SecurityContext holds pod-level security attributes and common container settings.

---

##### `serviceAccount`<sup>Optional</sup> <a name="org.cdk8s.plus22.PodProps.property.serviceAccount"></a>

```java
public IServiceAccount getServiceAccount();
```

- *Type:* [`org.cdk8s.plus22.IServiceAccount`](#org.cdk8s.plus22.IServiceAccount)
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

##### `volumes`<sup>Optional</sup> <a name="org.cdk8s.plus22.PodProps.property.volumes"></a>

```java
public java.util.List<Volume> getVolumes();
```

- *Type:* java.util.List<[`org.cdk8s.plus22.Volume`](#org.cdk8s.plus22.Volume)>
- *Default:* No volumes.

List of volumes that can be mounted by containers belonging to the pod.

You can also add volumes later using `podSpec.addVolume()`

> https://kubernetes.io/docs/concepts/storage/volumes

---

### PodSecurityContextProps <a name="org.cdk8s.plus22.PodSecurityContextProps"></a>

Properties for `PodSecurityContext`.

#### Initializer <a name="[object Object].Initializer"></a>

```java
import org.cdk8s.plus22.PodSecurityContextProps;

PodSecurityContextProps.builder()
//  .ensureNonRoot(java.lang.Boolean)
//  .fsGroup(java.lang.Number)
//  .fsGroupChangePolicy(FsGroupChangePolicy)
//  .group(java.lang.Number)
//  .sysctls(java.util.List<Sysctl>)
//  .user(java.lang.Number)
    .build();
```

##### `ensureNonRoot`<sup>Optional</sup> <a name="org.cdk8s.plus22.PodSecurityContextProps.property.ensureNonRoot"></a>

```java
public java.lang.Boolean getEnsureNonRoot();
```

- *Type:* `java.lang.Boolean`
- *Default:* false

Indicates that the container must run as a non-root user.

If true, the Kubelet will validate the image at runtime to ensure that it does
not run as UID 0 (root) and fail to start the container if it does.

---

##### `fsGroup`<sup>Optional</sup> <a name="org.cdk8s.plus22.PodSecurityContextProps.property.fsGroup"></a>

```java
public java.lang.Number getFsGroup();
```

- *Type:* `java.lang.Number`
- *Default:* Volume ownership is not changed.

Modify the ownership and permissions of pod volumes to this GID.

---

##### `fsGroupChangePolicy`<sup>Optional</sup> <a name="org.cdk8s.plus22.PodSecurityContextProps.property.fsGroupChangePolicy"></a>

```java
public FsGroupChangePolicy getFsGroupChangePolicy();
```

- *Type:* [`org.cdk8s.plus22.FsGroupChangePolicy`](#org.cdk8s.plus22.FsGroupChangePolicy)
- *Default:* FsGroupChangePolicy.ALWAYS

Defines behavior of changing ownership and permission of the volume before being exposed inside Pod.

This field will only apply to volume types which support fsGroup based ownership(and permissions).
It will have no effect on ephemeral volume types such as: secret, configmaps and emptydir.

---

##### `group`<sup>Optional</sup> <a name="org.cdk8s.plus22.PodSecurityContextProps.property.group"></a>

```java
public java.lang.Number getGroup();
```

- *Type:* `java.lang.Number`
- *Default:* Group configured by container runtime

The GID to run the entrypoint of the container process.

---

##### `sysctls`<sup>Optional</sup> <a name="org.cdk8s.plus22.PodSecurityContextProps.property.sysctls"></a>

```java
public java.util.List<Sysctl> getSysctls();
```

- *Type:* java.util.List<[`org.cdk8s.plus22.Sysctl`](#org.cdk8s.plus22.Sysctl)>
- *Default:* No sysctls

Sysctls hold a list of namespaced sysctls used for the pod.

Pods with unsupported sysctls (by the container runtime) might fail to launch.

---

##### `user`<sup>Optional</sup> <a name="org.cdk8s.plus22.PodSecurityContextProps.property.user"></a>

```java
public java.lang.Number getUser();
```

- *Type:* `java.lang.Number`
- *Default:* User specified in image metadata

The UID to run the entrypoint of the container process.

---

### PodSpecProps <a name="org.cdk8s.plus22.PodSpecProps"></a>

Properties of a `PodSpec`.

#### Initializer <a name="[object Object].Initializer"></a>

```java
import org.cdk8s.plus22.PodSpecProps;

PodSpecProps.builder()
//  .containers(java.util.List<ContainerProps>)
//  .hostAliases(java.util.List<HostAlias>)
//  .initContainers(java.util.List<ContainerProps>)
//  .restartPolicy(RestartPolicy)
//  .securityContext(PodSecurityContextProps)
//  .serviceAccount(IServiceAccount)
//  .volumes(java.util.List<Volume>)
    .build();
```

##### `containers`<sup>Optional</sup> <a name="org.cdk8s.plus22.PodSpecProps.property.containers"></a>

```java
public java.util.List<ContainerProps> getContainers();
```

- *Type:* java.util.List<[`org.cdk8s.plus22.ContainerProps`](#org.cdk8s.plus22.ContainerProps)>
- *Default:* No containers. Note that a pod spec must include at least one container.

List of containers belonging to the pod.

Containers cannot currently be
added or removed. There must be at least one container in a Pod.

You can add additionnal containers using `podSpec.addContainer()`

---

##### `hostAliases`<sup>Optional</sup> <a name="org.cdk8s.plus22.PodSpecProps.property.hostAliases"></a>

```java
public java.util.List<HostAlias> getHostAliases();
```

- *Type:* java.util.List<[`org.cdk8s.plus22.HostAlias`](#org.cdk8s.plus22.HostAlias)>

HostAlias holds the mapping between IP and hostnames that will be injected as an entry in the pod's hosts file.

---

##### `initContainers`<sup>Optional</sup> <a name="org.cdk8s.plus22.PodSpecProps.property.initContainers"></a>

```java
public java.util.List<ContainerProps> getInitContainers();
```

- *Type:* java.util.List<[`org.cdk8s.plus22.ContainerProps`](#org.cdk8s.plus22.ContainerProps)>
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

##### `restartPolicy`<sup>Optional</sup> <a name="org.cdk8s.plus22.PodSpecProps.property.restartPolicy"></a>

```java
public RestartPolicy getRestartPolicy();
```

- *Type:* [`org.cdk8s.plus22.RestartPolicy`](#org.cdk8s.plus22.RestartPolicy)
- *Default:* RestartPolicy.ALWAYS

Restart policy for all containers within the pod.

> https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle/#restart-policy

---

##### `securityContext`<sup>Optional</sup> <a name="org.cdk8s.plus22.PodSpecProps.property.securityContext"></a>

```java
public PodSecurityContextProps getSecurityContext();
```

- *Type:* [`org.cdk8s.plus22.PodSecurityContextProps`](#org.cdk8s.plus22.PodSecurityContextProps)
- *Default:* fsGroupChangePolicy: FsGroupChangePolicy.FsGroupChangePolicy.ALWAYS
  ensureNonRoot: false

SecurityContext holds pod-level security attributes and common container settings.

---

##### `serviceAccount`<sup>Optional</sup> <a name="org.cdk8s.plus22.PodSpecProps.property.serviceAccount"></a>

```java
public IServiceAccount getServiceAccount();
```

- *Type:* [`org.cdk8s.plus22.IServiceAccount`](#org.cdk8s.plus22.IServiceAccount)
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

##### `volumes`<sup>Optional</sup> <a name="org.cdk8s.plus22.PodSpecProps.property.volumes"></a>

```java
public java.util.List<Volume> getVolumes();
```

- *Type:* java.util.List<[`org.cdk8s.plus22.Volume`](#org.cdk8s.plus22.Volume)>
- *Default:* No volumes.

List of volumes that can be mounted by containers belonging to the pod.

You can also add volumes later using `podSpec.addVolume()`

> https://kubernetes.io/docs/concepts/storage/volumes

---

### PodTemplateProps <a name="org.cdk8s.plus22.PodTemplateProps"></a>

Properties of a `PodTemplate`.

Adds metadata information on top of the spec.

#### Initializer <a name="[object Object].Initializer"></a>

```java
import org.cdk8s.plus22.PodTemplateProps;

PodTemplateProps.builder()
//  .containers(java.util.List<ContainerProps>)
//  .hostAliases(java.util.List<HostAlias>)
//  .initContainers(java.util.List<ContainerProps>)
//  .restartPolicy(RestartPolicy)
//  .securityContext(PodSecurityContextProps)
//  .serviceAccount(IServiceAccount)
//  .volumes(java.util.List<Volume>)
//  .podMetadata(ApiObjectMetadata)
    .build();
```

##### `containers`<sup>Optional</sup> <a name="org.cdk8s.plus22.PodTemplateProps.property.containers"></a>

```java
public java.util.List<ContainerProps> getContainers();
```

- *Type:* java.util.List<[`org.cdk8s.plus22.ContainerProps`](#org.cdk8s.plus22.ContainerProps)>
- *Default:* No containers. Note that a pod spec must include at least one container.

List of containers belonging to the pod.

Containers cannot currently be
added or removed. There must be at least one container in a Pod.

You can add additionnal containers using `podSpec.addContainer()`

---

##### `hostAliases`<sup>Optional</sup> <a name="org.cdk8s.plus22.PodTemplateProps.property.hostAliases"></a>

```java
public java.util.List<HostAlias> getHostAliases();
```

- *Type:* java.util.List<[`org.cdk8s.plus22.HostAlias`](#org.cdk8s.plus22.HostAlias)>

HostAlias holds the mapping between IP and hostnames that will be injected as an entry in the pod's hosts file.

---

##### `initContainers`<sup>Optional</sup> <a name="org.cdk8s.plus22.PodTemplateProps.property.initContainers"></a>

```java
public java.util.List<ContainerProps> getInitContainers();
```

- *Type:* java.util.List<[`org.cdk8s.plus22.ContainerProps`](#org.cdk8s.plus22.ContainerProps)>
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

##### `restartPolicy`<sup>Optional</sup> <a name="org.cdk8s.plus22.PodTemplateProps.property.restartPolicy"></a>

```java
public RestartPolicy getRestartPolicy();
```

- *Type:* [`org.cdk8s.plus22.RestartPolicy`](#org.cdk8s.plus22.RestartPolicy)
- *Default:* RestartPolicy.ALWAYS

Restart policy for all containers within the pod.

> https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle/#restart-policy

---

##### `securityContext`<sup>Optional</sup> <a name="org.cdk8s.plus22.PodTemplateProps.property.securityContext"></a>

```java
public PodSecurityContextProps getSecurityContext();
```

- *Type:* [`org.cdk8s.plus22.PodSecurityContextProps`](#org.cdk8s.plus22.PodSecurityContextProps)
- *Default:* fsGroupChangePolicy: FsGroupChangePolicy.FsGroupChangePolicy.ALWAYS
  ensureNonRoot: false

SecurityContext holds pod-level security attributes and common container settings.

---

##### `serviceAccount`<sup>Optional</sup> <a name="org.cdk8s.plus22.PodTemplateProps.property.serviceAccount"></a>

```java
public IServiceAccount getServiceAccount();
```

- *Type:* [`org.cdk8s.plus22.IServiceAccount`](#org.cdk8s.plus22.IServiceAccount)
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

##### `volumes`<sup>Optional</sup> <a name="org.cdk8s.plus22.PodTemplateProps.property.volumes"></a>

```java
public java.util.List<Volume> getVolumes();
```

- *Type:* java.util.List<[`org.cdk8s.plus22.Volume`](#org.cdk8s.plus22.Volume)>
- *Default:* No volumes.

List of volumes that can be mounted by containers belonging to the pod.

You can also add volumes later using `podSpec.addVolume()`

> https://kubernetes.io/docs/concepts/storage/volumes

---

##### `podMetadata`<sup>Optional</sup> <a name="org.cdk8s.plus22.PodTemplateProps.property.podMetadata"></a>

```java
public ApiObjectMetadata getPodMetadata();
```

- *Type:* [`org.cdk8s.ApiObjectMetadata`](#org.cdk8s.ApiObjectMetadata)

The pod metadata.

---

### ProbeOptions <a name="org.cdk8s.plus22.ProbeOptions"></a>

Probe options.

#### Initializer <a name="[object Object].Initializer"></a>

```java
import org.cdk8s.plus22.ProbeOptions;

ProbeOptions.builder()
//  .failureThreshold(java.lang.Number)
//  .initialDelaySeconds(Duration)
//  .periodSeconds(Duration)
//  .successThreshold(java.lang.Number)
//  .timeoutSeconds(Duration)
    .build();
```

##### `failureThreshold`<sup>Optional</sup> <a name="org.cdk8s.plus22.ProbeOptions.property.failureThreshold"></a>

```java
public java.lang.Number getFailureThreshold();
```

- *Type:* `java.lang.Number`
- *Default:* 3

Minimum consecutive failures for the probe to be considered failed after having succeeded.

Defaults to 3. Minimum value is 1.

---

##### `initialDelaySeconds`<sup>Optional</sup> <a name="org.cdk8s.plus22.ProbeOptions.property.initialDelaySeconds"></a>

```java
public Duration getInitialDelaySeconds();
```

- *Type:* [`org.cdk8s.Duration`](#org.cdk8s.Duration)
- *Default:* immediate

Number of seconds after the container has started before liveness probes are initiated.

> https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle#container-probes

---

##### `periodSeconds`<sup>Optional</sup> <a name="org.cdk8s.plus22.ProbeOptions.property.periodSeconds"></a>

```java
public Duration getPeriodSeconds();
```

- *Type:* [`org.cdk8s.Duration`](#org.cdk8s.Duration)
- *Default:* Duration.seconds(10) Minimum value is 1.

How often (in seconds) to perform the probe.

Default to 10 seconds. Minimum value is 1.

---

##### `successThreshold`<sup>Optional</sup> <a name="org.cdk8s.plus22.ProbeOptions.property.successThreshold"></a>

```java
public java.lang.Number getSuccessThreshold();
```

- *Type:* `java.lang.Number`
- *Default:* 1 Must be 1 for liveness and startup. Minimum value is 1.

Minimum consecutive successes for the probe to be considered successful after having failed. Defaults to 1.

Must be 1 for liveness and startup. Minimum value is 1.

---

##### `timeoutSeconds`<sup>Optional</sup> <a name="org.cdk8s.plus22.ProbeOptions.property.timeoutSeconds"></a>

```java
public Duration getTimeoutSeconds();
```

- *Type:* [`org.cdk8s.Duration`](#org.cdk8s.Duration)
- *Default:* Duration.seconds(1)

Number of seconds after which the probe times out.

Defaults to 1 second. Minimum value is 1.

> https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle#container-probes

---

### ResourceProps <a name="org.cdk8s.plus22.ResourceProps"></a>

Initialization properties for resources.

#### Initializer <a name="[object Object].Initializer"></a>

```java
import org.cdk8s.plus22.ResourceProps;

ResourceProps.builder()
//  .metadata(ApiObjectMetadata)
    .build();
```

##### `metadata`<sup>Optional</sup> <a name="org.cdk8s.plus22.ResourceProps.property.metadata"></a>

```java
public ApiObjectMetadata getMetadata();
```

- *Type:* [`org.cdk8s.ApiObjectMetadata`](#org.cdk8s.ApiObjectMetadata)

Metadata that all persisted resources must have, which includes all objects users must create.

---

### Resources <a name="org.cdk8s.plus22.Resources"></a>

CPU and memory compute resources.

#### Initializer <a name="[object Object].Initializer"></a>

```java
import org.cdk8s.plus22.Resources;

Resources.builder()
    .cpu(CpuResources)
    .memory(MemoryResources)
    .build();
```

##### `cpu`<sup>Required</sup> <a name="org.cdk8s.plus22.Resources.property.cpu"></a>

```java
public CpuResources getCpu();
```

- *Type:* [`org.cdk8s.plus22.CpuResources`](#org.cdk8s.plus22.CpuResources)

---

##### `memory`<sup>Required</sup> <a name="org.cdk8s.plus22.Resources.property.memory"></a>

```java
public MemoryResources getMemory();
```

- *Type:* [`org.cdk8s.plus22.MemoryResources`](#org.cdk8s.plus22.MemoryResources)

---

### SecretProps <a name="org.cdk8s.plus22.SecretProps"></a>

Options for `Secret`.

#### Initializer <a name="[object Object].Initializer"></a>

```java
import org.cdk8s.plus22.SecretProps;

SecretProps.builder()
//  .metadata(ApiObjectMetadata)
//  .immutable(java.lang.Boolean)
//  .stringData(java.util.Map<java.lang.String, java.lang.String>)
//  .type(java.lang.String)
    .build();
```

##### `metadata`<sup>Optional</sup> <a name="org.cdk8s.plus22.SecretProps.property.metadata"></a>

```java
public ApiObjectMetadata getMetadata();
```

- *Type:* [`org.cdk8s.ApiObjectMetadata`](#org.cdk8s.ApiObjectMetadata)

Metadata that all persisted resources must have, which includes all objects users must create.

---

##### `immutable`<sup>Optional</sup> <a name="org.cdk8s.plus22.SecretProps.property.immutable"></a>

```java
public java.lang.Boolean getImmutable();
```

- *Type:* `java.lang.Boolean`
- *Default:* false

If set to true, ensures that data stored in the Secret cannot be updated (only object metadata can be modified).

If not set to true, the field can be modified at any time.

---

##### `stringData`<sup>Optional</sup> <a name="org.cdk8s.plus22.SecretProps.property.stringData"></a>

```java
public java.util.Map<java.lang.String, java.lang.String> getStringData();
```

- *Type:* java.util.Map<java.lang.String, `java.lang.String`>

stringData allows specifying non-binary secret data in string form.

It is
provided as a write-only convenience method. All keys and values are merged
into the data field on write, overwriting any existing values. It is never
output when reading from the API.

---

##### `type`<sup>Optional</sup> <a name="org.cdk8s.plus22.SecretProps.property.type"></a>

```java
public java.lang.String getType();
```

- *Type:* `java.lang.String`
- *Default:* undefined - Don't set a type.

Optional type associated with the secret.

Used to facilitate programmatic
handling of secret data by various controllers.

---

### SecretValue <a name="org.cdk8s.plus22.SecretValue"></a>

Represents a specific value in JSON secret.

#### Initializer <a name="[object Object].Initializer"></a>

```java
import org.cdk8s.plus22.SecretValue;

SecretValue.builder()
    .key(java.lang.String)
    .secret(ISecret)
    .build();
```

##### `key`<sup>Required</sup> <a name="org.cdk8s.plus22.SecretValue.property.key"></a>

```java
public java.lang.String getKey();
```

- *Type:* `java.lang.String`

The JSON key.

---

##### `secret`<sup>Required</sup> <a name="org.cdk8s.plus22.SecretValue.property.secret"></a>

```java
public ISecret getSecret();
```

- *Type:* [`org.cdk8s.plus22.ISecret`](#org.cdk8s.plus22.ISecret)

The secret.

---

### SecretVolumeOptions <a name="org.cdk8s.plus22.SecretVolumeOptions"></a>

Options for the Secret-based volume.

#### Initializer <a name="[object Object].Initializer"></a>

```java
import org.cdk8s.plus22.SecretVolumeOptions;

SecretVolumeOptions.builder()
//  .defaultMode(java.lang.Number)
//  .items(java.util.Map<java.lang.String, PathMapping>)
//  .name(java.lang.String)
//  .optional(java.lang.Boolean)
    .build();
```

##### `defaultMode`<sup>Optional</sup> <a name="org.cdk8s.plus22.SecretVolumeOptions.property.defaultMode"></a>

```java
public java.lang.Number getDefaultMode();
```

- *Type:* `java.lang.Number`
- *Default:* 0644. Directories within the path are not affected by this
setting. This might be in conflict with other options that affect the file
mode, like fsGroup, and the result can be other mode bits set.

Mode bits to use on created files by default.

Must be a value between 0 and
0777. Defaults to 0644. Directories within the path are not affected by
this setting. This might be in conflict with other options that affect the
file mode, like fsGroup, and the result can be other mode bits set.

---

##### `items`<sup>Optional</sup> <a name="org.cdk8s.plus22.SecretVolumeOptions.property.items"></a>

```java
public java.util.Map<java.lang.String, PathMapping> getItems();
```

- *Type:* java.util.Map<java.lang.String, [`org.cdk8s.plus22.PathMapping`](#org.cdk8s.plus22.PathMapping)>
- *Default:* no mapping

If unspecified, each key-value pair in the Data field of the referenced secret will be projected into the volume as a file whose name is the key and content is the value.

If specified, the listed keys will be projected
into the specified paths, and unlisted keys will not be present. If a key
is specified which is not present in the secret, the volume setup will
error unless it is marked optional. Paths must be relative and may not
contain the '..' path or start with '..'.

---

##### `name`<sup>Optional</sup> <a name="org.cdk8s.plus22.SecretVolumeOptions.property.name"></a>

```java
public java.lang.String getName();
```

- *Type:* `java.lang.String`
- *Default:* auto-generated

The volume name.

---

##### `optional`<sup>Optional</sup> <a name="org.cdk8s.plus22.SecretVolumeOptions.property.optional"></a>

```java
public java.lang.Boolean getOptional();
```

- *Type:* `java.lang.Boolean`
- *Default:* undocumented

Specify whether the secret or its keys must be defined.

---

### ServiceAccountProps <a name="org.cdk8s.plus22.ServiceAccountProps"></a>

Properties for initialization of `ServiceAccount`.

Properties for initialization of `ServiceAccount`.

#### Initializer <a name="[object Object].Initializer"></a>

```java
import org.cdk8s.plus22.ServiceAccountProps;

ServiceAccountProps.builder()
//  .metadata(ApiObjectMetadata)
//  .secrets(java.util.List<ISecret>)
    .build();
```

##### `metadata`<sup>Optional</sup> <a name="org.cdk8s.plus22.ServiceAccountProps.property.metadata"></a>

```java
public ApiObjectMetadata getMetadata();
```

- *Type:* [`org.cdk8s.ApiObjectMetadata`](#org.cdk8s.ApiObjectMetadata)

Metadata that all persisted resources must have, which includes all objects users must create.

---

##### `secrets`<sup>Optional</sup> <a name="org.cdk8s.plus22.ServiceAccountProps.property.secrets"></a>

```java
public java.util.List<ISecret> getSecrets();
```

- *Type:* java.util.List<[`org.cdk8s.plus22.ISecret`](#org.cdk8s.plus22.ISecret)>

List of secrets allowed to be used by pods running using this ServiceAccount.

> https://kubernetes.io/docs/concepts/configuration/secret

---

### ServiceAccountTokenSecretProps <a name="org.cdk8s.plus22.ServiceAccountTokenSecretProps"></a>

Options for `ServiceAccountTokenSecret`.

#### Initializer <a name="[object Object].Initializer"></a>

```java
import org.cdk8s.plus22.ServiceAccountTokenSecretProps;

ServiceAccountTokenSecretProps.builder()
//  .metadata(ApiObjectMetadata)
//  .immutable(java.lang.Boolean)
    .serviceAccount(IServiceAccount)
    .build();
```

##### `metadata`<sup>Optional</sup> <a name="org.cdk8s.plus22.ServiceAccountTokenSecretProps.property.metadata"></a>

```java
public ApiObjectMetadata getMetadata();
```

- *Type:* [`org.cdk8s.ApiObjectMetadata`](#org.cdk8s.ApiObjectMetadata)

Metadata that all persisted resources must have, which includes all objects users must create.

---

##### `immutable`<sup>Optional</sup> <a name="org.cdk8s.plus22.ServiceAccountTokenSecretProps.property.immutable"></a>

```java
public java.lang.Boolean getImmutable();
```

- *Type:* `java.lang.Boolean`
- *Default:* false

If set to true, ensures that data stored in the Secret cannot be updated (only object metadata can be modified).

If not set to true, the field can be modified at any time.

---

##### `serviceAccount`<sup>Required</sup> <a name="org.cdk8s.plus22.ServiceAccountTokenSecretProps.property.serviceAccount"></a>

```java
public IServiceAccount getServiceAccount();
```

- *Type:* [`org.cdk8s.plus22.IServiceAccount`](#org.cdk8s.plus22.IServiceAccount)

The service account to store a secret for.

---

### ServiceIngressBackendOptions <a name="org.cdk8s.plus22.ServiceIngressBackendOptions"></a>

Options for setting up backends for ingress rules.

#### Initializer <a name="[object Object].Initializer"></a>

```java
import org.cdk8s.plus22.ServiceIngressBackendOptions;

ServiceIngressBackendOptions.builder()
//  .port(java.lang.Number)
    .build();
```

##### `port`<sup>Optional</sup> <a name="org.cdk8s.plus22.ServiceIngressBackendOptions.property.port"></a>

```java
public java.lang.Number getPort();
```

- *Type:* `java.lang.Number`
- *Default:* if the service exposes a single port, this port will be used.

The port to use to access the service.

* This option will fail if the service does not expose any ports.
* If the service exposes multiple ports, this option must be specified.
* If the service exposes a single port, this option is optional and if
  specified, it must be the same port exposed by the service.

---

### ServicePort <a name="org.cdk8s.plus22.ServicePort"></a>

Definition of a service port.

#### Initializer <a name="[object Object].Initializer"></a>

```java
import org.cdk8s.plus22.ServicePort;

ServicePort.builder()
//  .name(java.lang.String)
//  .nodePort(java.lang.Number)
//  .protocol(Protocol)
//  .targetPort(java.lang.Number)
    .port(java.lang.Number)
    .build();
```

##### `name`<sup>Optional</sup> <a name="org.cdk8s.plus22.ServicePort.property.name"></a>

```java
public java.lang.String getName();
```

- *Type:* `java.lang.String`

The name of this port within the service.

This must be a DNS_LABEL. All
ports within a ServiceSpec must have unique names. This maps to the 'Name'
field in EndpointPort objects. Optional if only one ServicePort is defined
on this service.

---

##### `nodePort`<sup>Optional</sup> <a name="org.cdk8s.plus22.ServicePort.property.nodePort"></a>

```java
public java.lang.Number getNodePort();
```

- *Type:* `java.lang.Number`
- *Default:* auto-allocate a port if the ServiceType of this Service requires one.

The port on each node on which this service is exposed when type=NodePort or LoadBalancer.

Usually assigned by the system. If specified, it will be
allocated to the service if unused or else creation of the service will
fail. Default is to auto-allocate a port if the ServiceType of this Service
requires one.

> https://kubernetes.io/docs/concepts/services-networking/service/#type-nodeport

---

##### `protocol`<sup>Optional</sup> <a name="org.cdk8s.plus22.ServicePort.property.protocol"></a>

```java
public Protocol getProtocol();
```

- *Type:* [`org.cdk8s.plus22.Protocol`](#org.cdk8s.plus22.Protocol)
- *Default:* Protocol.TCP

The IP protocol for this port.

Supports "TCP", "UDP", and "SCTP". Default is TCP.

---

##### `targetPort`<sup>Optional</sup> <a name="org.cdk8s.plus22.ServicePort.property.targetPort"></a>

```java
public java.lang.Number getTargetPort();
```

- *Type:* `java.lang.Number`
- *Default:* The value of `port` will be used.

The port number the service will redirect to.

---

##### `port`<sup>Required</sup> <a name="org.cdk8s.plus22.ServicePort.property.port"></a>

```java
public java.lang.Number getPort();
```

- *Type:* `java.lang.Number`

The port number the service will bind to.

---

### ServicePortOptions <a name="org.cdk8s.plus22.ServicePortOptions"></a>

#### Initializer <a name="[object Object].Initializer"></a>

```java
import org.cdk8s.plus22.ServicePortOptions;

ServicePortOptions.builder()
//  .name(java.lang.String)
//  .nodePort(java.lang.Number)
//  .protocol(Protocol)
//  .targetPort(java.lang.Number)
    .build();
```

##### `name`<sup>Optional</sup> <a name="org.cdk8s.plus22.ServicePortOptions.property.name"></a>

```java
public java.lang.String getName();
```

- *Type:* `java.lang.String`

The name of this port within the service.

This must be a DNS_LABEL. All
ports within a ServiceSpec must have unique names. This maps to the 'Name'
field in EndpointPort objects. Optional if only one ServicePort is defined
on this service.

---

##### `nodePort`<sup>Optional</sup> <a name="org.cdk8s.plus22.ServicePortOptions.property.nodePort"></a>

```java
public java.lang.Number getNodePort();
```

- *Type:* `java.lang.Number`
- *Default:* auto-allocate a port if the ServiceType of this Service requires one.

The port on each node on which this service is exposed when type=NodePort or LoadBalancer.

Usually assigned by the system. If specified, it will be
allocated to the service if unused or else creation of the service will
fail. Default is to auto-allocate a port if the ServiceType of this Service
requires one.

> https://kubernetes.io/docs/concepts/services-networking/service/#type-nodeport

---

##### `protocol`<sup>Optional</sup> <a name="org.cdk8s.plus22.ServicePortOptions.property.protocol"></a>

```java
public Protocol getProtocol();
```

- *Type:* [`org.cdk8s.plus22.Protocol`](#org.cdk8s.plus22.Protocol)
- *Default:* Protocol.TCP

The IP protocol for this port.

Supports "TCP", "UDP", and "SCTP". Default is TCP.

---

##### `targetPort`<sup>Optional</sup> <a name="org.cdk8s.plus22.ServicePortOptions.property.targetPort"></a>

```java
public java.lang.Number getTargetPort();
```

- *Type:* `java.lang.Number`
- *Default:* The value of `port` will be used.

The port number the service will redirect to.

---

### ServiceProps <a name="org.cdk8s.plus22.ServiceProps"></a>

Properties for initialization of `Service`.

#### Initializer <a name="[object Object].Initializer"></a>

```java
import org.cdk8s.plus22.ServiceProps;

ServiceProps.builder()
//  .metadata(ApiObjectMetadata)
//  .clusterIP(java.lang.String)
//  .externalIPs(java.util.List<java.lang.String>)
//  .externalName(java.lang.String)
//  .loadBalancerSourceRanges(java.util.List<java.lang.String>)
//  .ports(java.util.List<ServicePort>)
//  .type(ServiceType)
    .build();
```

##### `metadata`<sup>Optional</sup> <a name="org.cdk8s.plus22.ServiceProps.property.metadata"></a>

```java
public ApiObjectMetadata getMetadata();
```

- *Type:* [`org.cdk8s.ApiObjectMetadata`](#org.cdk8s.ApiObjectMetadata)

Metadata that all persisted resources must have, which includes all objects users must create.

---

##### `clusterIP`<sup>Optional</sup> <a name="org.cdk8s.plus22.ServiceProps.property.clusterIP"></a>

```java
public java.lang.String getClusterIP();
```

- *Type:* `java.lang.String`
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

##### `externalIPs`<sup>Optional</sup> <a name="org.cdk8s.plus22.ServiceProps.property.externalIPs"></a>

```java
public java.util.List<java.lang.String> getExternalIPs();
```

- *Type:* java.util.List<`java.lang.String`>
- *Default:* No external IPs.

A list of IP addresses for which nodes in the cluster will also accept traffic for this service.

These IPs are not managed by Kubernetes. The user
is responsible for ensuring that traffic arrives at a node with this IP. A
common example is external load-balancers that are not part of the
Kubernetes system.

---

##### `externalName`<sup>Optional</sup> <a name="org.cdk8s.plus22.ServiceProps.property.externalName"></a>

```java
public java.lang.String getExternalName();
```

- *Type:* `java.lang.String`
- *Default:* No external name.

The externalName to be used when ServiceType.EXTERNAL_NAME is set.

---

##### `loadBalancerSourceRanges`<sup>Optional</sup> <a name="org.cdk8s.plus22.ServiceProps.property.loadBalancerSourceRanges"></a>

```java
public java.util.List<java.lang.String> getLoadBalancerSourceRanges();
```

- *Type:* java.util.List<`java.lang.String`>

A list of CIDR IP addresses, if specified and supported by the platform, will restrict traffic through the cloud-provider load-balancer to the specified client IPs.

More info: https://kubernetes.io/docs/tasks/access-application-cluster/configure-cloud-provider-firewall/

---

##### `ports`<sup>Optional</sup> <a name="org.cdk8s.plus22.ServiceProps.property.ports"></a>

```java
public java.util.List<ServicePort> getPorts();
```

- *Type:* java.util.List<[`org.cdk8s.plus22.ServicePort`](#org.cdk8s.plus22.ServicePort)>

The port exposed by this service.

More info: https://kubernetes.io/docs/concepts/services-networking/service/#virtual-ips-and-service-proxies

---

##### `type`<sup>Optional</sup> <a name="org.cdk8s.plus22.ServiceProps.property.type"></a>

```java
public ServiceType getType();
```

- *Type:* [`org.cdk8s.plus22.ServiceType`](#org.cdk8s.plus22.ServiceType)
- *Default:* ServiceType.ClusterIP

Determines how the Service is exposed.

More info: https://kubernetes.io/docs/concepts/services-networking/service/#publishing-services-service-types

---

### SshAuthSecretProps <a name="org.cdk8s.plus22.SshAuthSecretProps"></a>

Options for `SshAuthSecret`.

#### Initializer <a name="[object Object].Initializer"></a>

```java
import org.cdk8s.plus22.SshAuthSecretProps;

SshAuthSecretProps.builder()
//  .metadata(ApiObjectMetadata)
//  .immutable(java.lang.Boolean)
    .sshPrivateKey(java.lang.String)
    .build();
```

##### `metadata`<sup>Optional</sup> <a name="org.cdk8s.plus22.SshAuthSecretProps.property.metadata"></a>

```java
public ApiObjectMetadata getMetadata();
```

- *Type:* [`org.cdk8s.ApiObjectMetadata`](#org.cdk8s.ApiObjectMetadata)

Metadata that all persisted resources must have, which includes all objects users must create.

---

##### `immutable`<sup>Optional</sup> <a name="org.cdk8s.plus22.SshAuthSecretProps.property.immutable"></a>

```java
public java.lang.Boolean getImmutable();
```

- *Type:* `java.lang.Boolean`
- *Default:* false

If set to true, ensures that data stored in the Secret cannot be updated (only object metadata can be modified).

If not set to true, the field can be modified at any time.

---

##### `sshPrivateKey`<sup>Required</sup> <a name="org.cdk8s.plus22.SshAuthSecretProps.property.sshPrivateKey"></a>

```java
public java.lang.String getSshPrivateKey();
```

- *Type:* `java.lang.String`

The SSH private key to use.

---

### StatefulSetProps <a name="org.cdk8s.plus22.StatefulSetProps"></a>

Properties for initialization of `StatefulSet`.

#### Initializer <a name="[object Object].Initializer"></a>

```java
import org.cdk8s.plus22.StatefulSetProps;

StatefulSetProps.builder()
//  .metadata(ApiObjectMetadata)
//  .containers(java.util.List<ContainerProps>)
//  .hostAliases(java.util.List<HostAlias>)
//  .initContainers(java.util.List<ContainerProps>)
//  .restartPolicy(RestartPolicy)
//  .securityContext(PodSecurityContextProps)
//  .serviceAccount(IServiceAccount)
//  .volumes(java.util.List<Volume>)
//  .podMetadata(ApiObjectMetadata)
    .service(Service)
//  .defaultSelector(java.lang.Boolean)
//  .podManagementPolicy(PodManagementPolicy)
//  .replicas(java.lang.Number)
    .build();
```

##### `metadata`<sup>Optional</sup> <a name="org.cdk8s.plus22.StatefulSetProps.property.metadata"></a>

```java
public ApiObjectMetadata getMetadata();
```

- *Type:* [`org.cdk8s.ApiObjectMetadata`](#org.cdk8s.ApiObjectMetadata)

Metadata that all persisted resources must have, which includes all objects users must create.

---

##### `containers`<sup>Optional</sup> <a name="org.cdk8s.plus22.StatefulSetProps.property.containers"></a>

```java
public java.util.List<ContainerProps> getContainers();
```

- *Type:* java.util.List<[`org.cdk8s.plus22.ContainerProps`](#org.cdk8s.plus22.ContainerProps)>
- *Default:* No containers. Note that a pod spec must include at least one container.

List of containers belonging to the pod.

Containers cannot currently be
added or removed. There must be at least one container in a Pod.

You can add additionnal containers using `podSpec.addContainer()`

---

##### `hostAliases`<sup>Optional</sup> <a name="org.cdk8s.plus22.StatefulSetProps.property.hostAliases"></a>

```java
public java.util.List<HostAlias> getHostAliases();
```

- *Type:* java.util.List<[`org.cdk8s.plus22.HostAlias`](#org.cdk8s.plus22.HostAlias)>

HostAlias holds the mapping between IP and hostnames that will be injected as an entry in the pod's hosts file.

---

##### `initContainers`<sup>Optional</sup> <a name="org.cdk8s.plus22.StatefulSetProps.property.initContainers"></a>

```java
public java.util.List<ContainerProps> getInitContainers();
```

- *Type:* java.util.List<[`org.cdk8s.plus22.ContainerProps`](#org.cdk8s.plus22.ContainerProps)>
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

##### `restartPolicy`<sup>Optional</sup> <a name="org.cdk8s.plus22.StatefulSetProps.property.restartPolicy"></a>

```java
public RestartPolicy getRestartPolicy();
```

- *Type:* [`org.cdk8s.plus22.RestartPolicy`](#org.cdk8s.plus22.RestartPolicy)
- *Default:* RestartPolicy.ALWAYS

Restart policy for all containers within the pod.

> https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle/#restart-policy

---

##### `securityContext`<sup>Optional</sup> <a name="org.cdk8s.plus22.StatefulSetProps.property.securityContext"></a>

```java
public PodSecurityContextProps getSecurityContext();
```

- *Type:* [`org.cdk8s.plus22.PodSecurityContextProps`](#org.cdk8s.plus22.PodSecurityContextProps)
- *Default:* fsGroupChangePolicy: FsGroupChangePolicy.FsGroupChangePolicy.ALWAYS
  ensureNonRoot: false

SecurityContext holds pod-level security attributes and common container settings.

---

##### `serviceAccount`<sup>Optional</sup> <a name="org.cdk8s.plus22.StatefulSetProps.property.serviceAccount"></a>

```java
public IServiceAccount getServiceAccount();
```

- *Type:* [`org.cdk8s.plus22.IServiceAccount`](#org.cdk8s.plus22.IServiceAccount)
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

##### `volumes`<sup>Optional</sup> <a name="org.cdk8s.plus22.StatefulSetProps.property.volumes"></a>

```java
public java.util.List<Volume> getVolumes();
```

- *Type:* java.util.List<[`org.cdk8s.plus22.Volume`](#org.cdk8s.plus22.Volume)>
- *Default:* No volumes.

List of volumes that can be mounted by containers belonging to the pod.

You can also add volumes later using `podSpec.addVolume()`

> https://kubernetes.io/docs/concepts/storage/volumes

---

##### `podMetadata`<sup>Optional</sup> <a name="org.cdk8s.plus22.StatefulSetProps.property.podMetadata"></a>

```java
public ApiObjectMetadata getPodMetadata();
```

- *Type:* [`org.cdk8s.ApiObjectMetadata`](#org.cdk8s.ApiObjectMetadata)

The pod metadata.

---

##### `service`<sup>Required</sup> <a name="org.cdk8s.plus22.StatefulSetProps.property.service"></a>

```java
public Service getService();
```

- *Type:* [`org.cdk8s.plus22.Service`](#org.cdk8s.plus22.Service)

Service to associate with the statefulset.

---

##### `defaultSelector`<sup>Optional</sup> <a name="org.cdk8s.plus22.StatefulSetProps.property.defaultSelector"></a>

```java
public java.lang.Boolean getDefaultSelector();
```

- *Type:* `java.lang.Boolean`
- *Default:* true

Automatically allocates a pod selector for this statefulset.

If this is set to `false` you must define your selector through
`statefulset.podMetadata.addLabel()` and `statefulset.selectByLabel()`.

---

##### `podManagementPolicy`<sup>Optional</sup> <a name="org.cdk8s.plus22.StatefulSetProps.property.podManagementPolicy"></a>

```java
public PodManagementPolicy getPodManagementPolicy();
```

- *Type:* [`org.cdk8s.plus22.PodManagementPolicy`](#org.cdk8s.plus22.PodManagementPolicy)
- *Default:* PodManagementPolicy.ORDERED_READY

Pod management policy to use for this statefulset.

---

##### `replicas`<sup>Optional</sup> <a name="org.cdk8s.plus22.StatefulSetProps.property.replicas"></a>

```java
public java.lang.Number getReplicas();
```

- *Type:* `java.lang.Number`
- *Default:* 1

Number of desired pods.

---

### Sysctl <a name="org.cdk8s.plus22.Sysctl"></a>

Sysctl defines a kernel parameter to be set.

#### Initializer <a name="[object Object].Initializer"></a>

```java
import org.cdk8s.plus22.Sysctl;

Sysctl.builder()
    .name(java.lang.String)
    .value(java.lang.String)
    .build();
```

##### `name`<sup>Required</sup> <a name="org.cdk8s.plus22.Sysctl.property.name"></a>

```java
public java.lang.String getName();
```

- *Type:* `java.lang.String`

Name of a property to set.

---

##### `value`<sup>Required</sup> <a name="org.cdk8s.plus22.Sysctl.property.value"></a>

```java
public java.lang.String getValue();
```

- *Type:* `java.lang.String`

Value of a property to set.

---

### TcpSocketProbeOptions <a name="org.cdk8s.plus22.TcpSocketProbeOptions"></a>

Options for `Probe.fromTcpSocket()`.

#### Initializer <a name="[object Object].Initializer"></a>

```java
import org.cdk8s.plus22.TcpSocketProbeOptions;

TcpSocketProbeOptions.builder()
//  .failureThreshold(java.lang.Number)
//  .initialDelaySeconds(Duration)
//  .periodSeconds(Duration)
//  .successThreshold(java.lang.Number)
//  .timeoutSeconds(Duration)
//  .host(java.lang.String)
//  .port(java.lang.Number)
    .build();
```

##### `failureThreshold`<sup>Optional</sup> <a name="org.cdk8s.plus22.TcpSocketProbeOptions.property.failureThreshold"></a>

```java
public java.lang.Number getFailureThreshold();
```

- *Type:* `java.lang.Number`
- *Default:* 3

Minimum consecutive failures for the probe to be considered failed after having succeeded.

Defaults to 3. Minimum value is 1.

---

##### `initialDelaySeconds`<sup>Optional</sup> <a name="org.cdk8s.plus22.TcpSocketProbeOptions.property.initialDelaySeconds"></a>

```java
public Duration getInitialDelaySeconds();
```

- *Type:* [`org.cdk8s.Duration`](#org.cdk8s.Duration)
- *Default:* immediate

Number of seconds after the container has started before liveness probes are initiated.

> https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle#container-probes

---

##### `periodSeconds`<sup>Optional</sup> <a name="org.cdk8s.plus22.TcpSocketProbeOptions.property.periodSeconds"></a>

```java
public Duration getPeriodSeconds();
```

- *Type:* [`org.cdk8s.Duration`](#org.cdk8s.Duration)
- *Default:* Duration.seconds(10) Minimum value is 1.

How often (in seconds) to perform the probe.

Default to 10 seconds. Minimum value is 1.

---

##### `successThreshold`<sup>Optional</sup> <a name="org.cdk8s.plus22.TcpSocketProbeOptions.property.successThreshold"></a>

```java
public java.lang.Number getSuccessThreshold();
```

- *Type:* `java.lang.Number`
- *Default:* 1 Must be 1 for liveness and startup. Minimum value is 1.

Minimum consecutive successes for the probe to be considered successful after having failed. Defaults to 1.

Must be 1 for liveness and startup. Minimum value is 1.

---

##### `timeoutSeconds`<sup>Optional</sup> <a name="org.cdk8s.plus22.TcpSocketProbeOptions.property.timeoutSeconds"></a>

```java
public Duration getTimeoutSeconds();
```

- *Type:* [`org.cdk8s.Duration`](#org.cdk8s.Duration)
- *Default:* Duration.seconds(1)

Number of seconds after which the probe times out.

Defaults to 1 second. Minimum value is 1.

> https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle#container-probes

---

##### `host`<sup>Optional</sup> <a name="org.cdk8s.plus22.TcpSocketProbeOptions.property.host"></a>

```java
public java.lang.String getHost();
```

- *Type:* `java.lang.String`
- *Default:* defaults to the pod IP

The host name to connect to on the container.

---

##### `port`<sup>Optional</sup> <a name="org.cdk8s.plus22.TcpSocketProbeOptions.property.port"></a>

```java
public java.lang.Number getPort();
```

- *Type:* `java.lang.Number`
- *Default:* defaults to `container.port`.

The TCP port to connect to on the container.

---

### TlsSecretProps <a name="org.cdk8s.plus22.TlsSecretProps"></a>

Options for `TlsSecret`.

#### Initializer <a name="[object Object].Initializer"></a>

```java
import org.cdk8s.plus22.TlsSecretProps;

TlsSecretProps.builder()
//  .metadata(ApiObjectMetadata)
//  .immutable(java.lang.Boolean)
    .tlsCert(java.lang.String)
    .tlsKey(java.lang.String)
    .build();
```

##### `metadata`<sup>Optional</sup> <a name="org.cdk8s.plus22.TlsSecretProps.property.metadata"></a>

```java
public ApiObjectMetadata getMetadata();
```

- *Type:* [`org.cdk8s.ApiObjectMetadata`](#org.cdk8s.ApiObjectMetadata)

Metadata that all persisted resources must have, which includes all objects users must create.

---

##### `immutable`<sup>Optional</sup> <a name="org.cdk8s.plus22.TlsSecretProps.property.immutable"></a>

```java
public java.lang.Boolean getImmutable();
```

- *Type:* `java.lang.Boolean`
- *Default:* false

If set to true, ensures that data stored in the Secret cannot be updated (only object metadata can be modified).

If not set to true, the field can be modified at any time.

---

##### `tlsCert`<sup>Required</sup> <a name="org.cdk8s.plus22.TlsSecretProps.property.tlsCert"></a>

```java
public java.lang.String getTlsCert();
```

- *Type:* `java.lang.String`

The TLS cert.

---

##### `tlsKey`<sup>Required</sup> <a name="org.cdk8s.plus22.TlsSecretProps.property.tlsKey"></a>

```java
public java.lang.String getTlsKey();
```

- *Type:* `java.lang.String`

The TLS key.

---

### VolumeMount <a name="org.cdk8s.plus22.VolumeMount"></a>

Mount a volume from the pod to the container.

#### Initializer <a name="[object Object].Initializer"></a>

```java
import org.cdk8s.plus22.VolumeMount;

VolumeMount.builder()
//  .propagation(MountPropagation)
//  .readOnly(java.lang.Boolean)
//  .subPath(java.lang.String)
//  .subPathExpr(java.lang.String)
    .path(java.lang.String)
    .volume(Volume)
    .build();
```

##### `propagation`<sup>Optional</sup> <a name="org.cdk8s.plus22.VolumeMount.property.propagation"></a>

```java
public MountPropagation getPropagation();
```

- *Type:* [`org.cdk8s.plus22.MountPropagation`](#org.cdk8s.plus22.MountPropagation)
- *Default:* MountPropagation.NONE

Determines how mounts are propagated from the host to container and the other way around.

When not set, MountPropagationNone is used.

Mount propagation allows for sharing volumes mounted by a Container to
other Containers in the same Pod, or even to other Pods on the same node.

---

##### `readOnly`<sup>Optional</sup> <a name="org.cdk8s.plus22.VolumeMount.property.readOnly"></a>

```java
public java.lang.Boolean getReadOnly();
```

- *Type:* `java.lang.Boolean`
- *Default:* false

Mounted read-only if true, read-write otherwise (false or unspecified).

Defaults to false.

---

##### `subPath`<sup>Optional</sup> <a name="org.cdk8s.plus22.VolumeMount.property.subPath"></a>

```java
public java.lang.String getSubPath();
```

- *Type:* `java.lang.String`
- *Default:* "" the volume's root

Path within the volume from which the container's volume should be mounted.).

---

##### `subPathExpr`<sup>Optional</sup> <a name="org.cdk8s.plus22.VolumeMount.property.subPathExpr"></a>

```java
public java.lang.String getSubPathExpr();
```

- *Type:* `java.lang.String`
- *Default:* "" volume's root.

Expanded path within the volume from which the container's volume should be mounted.

Behaves similarly to SubPath but environment variable references
$(VAR_NAME) are expanded using the container's environment. Defaults to ""
(volume's root).

`subPathExpr` and `subPath` are mutually exclusive.

---

##### `path`<sup>Required</sup> <a name="org.cdk8s.plus22.VolumeMount.property.path"></a>

```java
public java.lang.String getPath();
```

- *Type:* `java.lang.String`

Path within the container at which the volume should be mounted.

Must not
contain ':'.

---

##### `volume`<sup>Required</sup> <a name="org.cdk8s.plus22.VolumeMount.property.volume"></a>

```java
public Volume getVolume();
```

- *Type:* [`org.cdk8s.plus22.Volume`](#org.cdk8s.plus22.Volume)

The volume to mount.

---

## Classes <a name="Classes"></a>

### Container <a name="org.cdk8s.plus22.Container"></a>

A single application container that you want to run within a pod.

#### Initializers <a name="org.cdk8s.plus22.Container.Initializer"></a>

```java
import org.cdk8s.plus22.Container;

Container.Builder.create()
    .image(java.lang.String)
//  .args(java.util.List<java.lang.String>)
//  .command(java.util.List<java.lang.String>)
//  .env(java.util.Map<java.lang.String, EnvValue>)
//  .imagePullPolicy(ImagePullPolicy)
//  .lifecycle(ContainerLifecycle)
//  .liveness(Probe)
//  .name(java.lang.String)
//  .port(java.lang.Number)
//  .readiness(Probe)
//  .resources(Resources)
//  .securityContext(ContainerSecurityContextProps)
//  .startup(Probe)
//  .volumeMounts(java.util.List<VolumeMount>)
//  .workingDir(java.lang.String)
    .build();
```

##### `image`<sup>Required</sup> <a name="org.cdk8s.plus22.ContainerProps.parameter.image"></a>

- *Type:* `java.lang.String`

Docker image name.

---

##### `args`<sup>Optional</sup> <a name="org.cdk8s.plus22.ContainerProps.parameter.args"></a>

- *Type:* java.util.List<`java.lang.String`>
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

##### `command`<sup>Optional</sup> <a name="org.cdk8s.plus22.ContainerProps.parameter.command"></a>

- *Type:* java.util.List<`java.lang.String`>
- *Default:* The docker image's ENTRYPOINT.

Entrypoint array.

Not executed within a shell. The docker image's ENTRYPOINT is used if this is not provided. Variable references $(VAR_NAME) are expanded using the container's environment.
If a variable cannot be resolved, the reference in the input string will be unchanged. The $(VAR_NAME) syntax can be escaped with a double $$, ie: $$(VAR_NAME).
Escaped references will never be expanded, regardless of whether the variable exists or not. Cannot be updated.
More info: https://kubernetes.io/docs/tasks/inject-data-application/define-command-argument-container/#running-a-command-in-a-shell

---

##### `env`<sup>Optional</sup> <a name="org.cdk8s.plus22.ContainerProps.parameter.env"></a>

- *Type:* java.util.Map<java.lang.String, [`org.cdk8s.plus22.EnvValue`](#org.cdk8s.plus22.EnvValue)>
- *Default:* No environment variables.

List of environment variables to set in the container.

Cannot be updated.

---

##### `imagePullPolicy`<sup>Optional</sup> <a name="org.cdk8s.plus22.ContainerProps.parameter.imagePullPolicy"></a>

- *Type:* [`org.cdk8s.plus22.ImagePullPolicy`](#org.cdk8s.plus22.ImagePullPolicy)
- *Default:* ImagePullPolicy.ALWAYS

Image pull policy for this container.

---

##### `lifecycle`<sup>Optional</sup> <a name="org.cdk8s.plus22.ContainerProps.parameter.lifecycle"></a>

- *Type:* [`org.cdk8s.plus22.ContainerLifecycle`](#org.cdk8s.plus22.ContainerLifecycle)

Describes actions that the management system should take in response to container lifecycle events.

---

##### `liveness`<sup>Optional</sup> <a name="org.cdk8s.plus22.ContainerProps.parameter.liveness"></a>

- *Type:* [`org.cdk8s.plus22.Probe`](#org.cdk8s.plus22.Probe)
- *Default:* no liveness probe is defined

Periodic probe of container liveness.

Container will be restarted if the probe fails.

---

##### `name`<sup>Optional</sup> <a name="org.cdk8s.plus22.ContainerProps.parameter.name"></a>

- *Type:* `java.lang.String`
- *Default:* 'main'

Name of the container specified as a DNS_LABEL.

Each container in a pod must have a unique name (DNS_LABEL). Cannot be updated.

---

##### `port`<sup>Optional</sup> <a name="org.cdk8s.plus22.ContainerProps.parameter.port"></a>

- *Type:* `java.lang.Number`
- *Default:* No port is exposed.

Number of port to expose on the pod's IP address.

This must be a valid port number, 0 < x < 65536.

---

##### `readiness`<sup>Optional</sup> <a name="org.cdk8s.plus22.ContainerProps.parameter.readiness"></a>

- *Type:* [`org.cdk8s.plus22.Probe`](#org.cdk8s.plus22.Probe)
- *Default:* no readiness probe is defined

Determines when the container is ready to serve traffic.

---

##### `resources`<sup>Optional</sup> <a name="org.cdk8s.plus22.ContainerProps.parameter.resources"></a>

- *Type:* [`org.cdk8s.plus22.Resources`](#org.cdk8s.plus22.Resources)

Compute resources (CPU and memory requests and limits) required by the container.

> https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/

---

##### `securityContext`<sup>Optional</sup> <a name="org.cdk8s.plus22.ContainerProps.parameter.securityContext"></a>

- *Type:* [`org.cdk8s.plus22.ContainerSecurityContextProps`](#org.cdk8s.plus22.ContainerSecurityContextProps)
- *Default:* ensureNonRoot: false
  privileged: false
  readOnlyRootFilesystem: false

SecurityContext defines the security options the container should be run with.

If set, the fields override equivalent fields of the pod's security context.

> https://kubernetes.io/docs/tasks/configure-pod-container/security-context/

---

##### `startup`<sup>Optional</sup> <a name="org.cdk8s.plus22.ContainerProps.parameter.startup"></a>

- *Type:* [`org.cdk8s.plus22.Probe`](#org.cdk8s.plus22.Probe)
- *Default:* no startup probe is defined.

StartupProbe indicates that the Pod has successfully initialized.

If specified, no other probes are executed until this completes successfully

---

##### `volumeMounts`<sup>Optional</sup> <a name="org.cdk8s.plus22.ContainerProps.parameter.volumeMounts"></a>

- *Type:* java.util.List<[`org.cdk8s.plus22.VolumeMount`](#org.cdk8s.plus22.VolumeMount)>

Pod volumes to mount into the container's filesystem.

Cannot be updated.

---

##### `workingDir`<sup>Optional</sup> <a name="org.cdk8s.plus22.ContainerProps.parameter.workingDir"></a>

- *Type:* `java.lang.String`
- *Default:* The container runtime's default.

Container's working directory.

If not specified, the container runtime's default will be used, which might be configured in the container image. Cannot be updated.

---

#### Methods <a name="Methods"></a>

##### `addEnv` <a name="org.cdk8s.plus22.Container.addEnv"></a>

```java
public addEnv(java.lang.String name, EnvValue value)
```

###### `name`<sup>Required</sup> <a name="org.cdk8s.plus22.Container.parameter.name"></a>

- *Type:* `java.lang.String`

The variable name.

---

###### `value`<sup>Required</sup> <a name="org.cdk8s.plus22.Container.parameter.value"></a>

- *Type:* [`org.cdk8s.plus22.EnvValue`](#org.cdk8s.plus22.EnvValue)

The variable value.

---

##### `mount` <a name="org.cdk8s.plus22.Container.mount"></a>

```java
public mount(java.lang.String path, IStorage storage)
public mount(java.lang.String path, IStorage storage, MountOptions options)
```

###### `path`<sup>Required</sup> <a name="org.cdk8s.plus22.Container.parameter.path"></a>

- *Type:* `java.lang.String`

The desired path in the container.

---

###### `storage`<sup>Required</sup> <a name="org.cdk8s.plus22.Container.parameter.storage"></a>

- *Type:* [`org.cdk8s.plus22.IStorage`](#org.cdk8s.plus22.IStorage)

The storage to mount.

---

###### `options`<sup>Optional</sup> <a name="org.cdk8s.plus22.Container.parameter.options"></a>

- *Type:* [`org.cdk8s.plus22.MountOptions`](#org.cdk8s.plus22.MountOptions)

---


#### Properties <a name="Properties"></a>

##### `env`<sup>Required</sup> <a name="org.cdk8s.plus22.Container.property.env"></a>

```java
public java.util.Map<java.lang.String, EnvValue> getEnv();
```

- *Type:* java.util.Map<java.lang.String, [`org.cdk8s.plus22.EnvValue`](#org.cdk8s.plus22.EnvValue)>

The environment variables for this container.

Returns a copy. To add environment variables use `addEnv()`.

---

##### `image`<sup>Required</sup> <a name="org.cdk8s.plus22.Container.property.image"></a>

```java
public java.lang.String getImage();
```

- *Type:* `java.lang.String`

The container image.

---

##### `imagePullPolicy`<sup>Required</sup> <a name="org.cdk8s.plus22.Container.property.imagePullPolicy"></a>

```java
public ImagePullPolicy getImagePullPolicy();
```

- *Type:* [`org.cdk8s.plus22.ImagePullPolicy`](#org.cdk8s.plus22.ImagePullPolicy)

Image pull policy for this container.

---

##### `mounts`<sup>Required</sup> <a name="org.cdk8s.plus22.Container.property.mounts"></a>

```java
public java.util.List<VolumeMount> getMounts();
```

- *Type:* java.util.List<[`org.cdk8s.plus22.VolumeMount`](#org.cdk8s.plus22.VolumeMount)>

Volume mounts configured for this container.

---

##### `name`<sup>Required</sup> <a name="org.cdk8s.plus22.Container.property.name"></a>

```java
public java.lang.String getName();
```

- *Type:* `java.lang.String`

The name of the container.

---

##### `securityContext`<sup>Required</sup> <a name="org.cdk8s.plus22.Container.property.securityContext"></a>

```java
public ContainerSecurityContext getSecurityContext();
```

- *Type:* [`org.cdk8s.plus22.ContainerSecurityContext`](#org.cdk8s.plus22.ContainerSecurityContext)

The security context of the container.

---

##### `args`<sup>Optional</sup> <a name="org.cdk8s.plus22.Container.property.args"></a>

```java
public java.util.List<java.lang.String> getArgs();
```

- *Type:* java.util.List<`java.lang.String`>

Arguments to the entrypoint.

---

##### `command`<sup>Optional</sup> <a name="org.cdk8s.plus22.Container.property.command"></a>

```java
public java.util.List<java.lang.String> getCommand();
```

- *Type:* java.util.List<`java.lang.String`>

Entrypoint array (the command to execute when the container starts).

---

##### `port`<sup>Optional</sup> <a name="org.cdk8s.plus22.Container.property.port"></a>

```java
public java.lang.Number getPort();
```

- *Type:* `java.lang.Number`

The port this container exposes.

---

##### `resources`<sup>Optional</sup> <a name="org.cdk8s.plus22.Container.property.resources"></a>

```java
public Resources getResources();
```

- *Type:* [`org.cdk8s.plus22.Resources`](#org.cdk8s.plus22.Resources)

Compute resources (CPU and memory requests and limits) required by the container.

> https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/

---

##### `workingDir`<sup>Optional</sup> <a name="org.cdk8s.plus22.Container.property.workingDir"></a>

```java
public java.lang.String getWorkingDir();
```

- *Type:* `java.lang.String`

The working directory inside the container.

---


### ContainerSecurityContext <a name="org.cdk8s.plus22.ContainerSecurityContext"></a>

Container security attributes and settings.

#### Initializers <a name="org.cdk8s.plus22.ContainerSecurityContext.Initializer"></a>

```java
import org.cdk8s.plus22.ContainerSecurityContext;

ContainerSecurityContext.Builder.create()
//  .ensureNonRoot(java.lang.Boolean)
//  .group(java.lang.Number)
//  .privileged(java.lang.Boolean)
//  .readOnlyRootFilesystem(java.lang.Boolean)
//  .user(java.lang.Number)
    .build();
```

##### `ensureNonRoot`<sup>Optional</sup> <a name="org.cdk8s.plus22.ContainerSecurityContextProps.parameter.ensureNonRoot"></a>

- *Type:* `java.lang.Boolean`
- *Default:* false

Indicates that the container must run as a non-root user.

If true, the Kubelet will validate the image at runtime to ensure that it does
not run as UID 0 (root) and fail to start the container if it does.

---

##### `group`<sup>Optional</sup> <a name="org.cdk8s.plus22.ContainerSecurityContextProps.parameter.group"></a>

- *Type:* `java.lang.Number`
- *Default:* Group configured by container runtime

The GID to run the entrypoint of the container process.

---

##### `privileged`<sup>Optional</sup> <a name="org.cdk8s.plus22.ContainerSecurityContextProps.parameter.privileged"></a>

- *Type:* `java.lang.Boolean`
- *Default:* false

Run container in privileged mode.

Processes in privileged containers are essentially equivalent to root on the host.

---

##### `readOnlyRootFilesystem`<sup>Optional</sup> <a name="org.cdk8s.plus22.ContainerSecurityContextProps.parameter.readOnlyRootFilesystem"></a>

- *Type:* `java.lang.Boolean`
- *Default:* false

Whether this container has a read-only root filesystem.

---

##### `user`<sup>Optional</sup> <a name="org.cdk8s.plus22.ContainerSecurityContextProps.parameter.user"></a>

- *Type:* `java.lang.Number`
- *Default:* User specified in image metadata

The UID to run the entrypoint of the container process.

---



#### Properties <a name="Properties"></a>

##### `ensureNonRoot`<sup>Required</sup> <a name="org.cdk8s.plus22.ContainerSecurityContext.property.ensureNonRoot"></a>

```java
public java.lang.Boolean getEnsureNonRoot();
```

- *Type:* `java.lang.Boolean`

---

##### `privileged`<sup>Required</sup> <a name="org.cdk8s.plus22.ContainerSecurityContext.property.privileged"></a>

```java
public java.lang.Boolean getPrivileged();
```

- *Type:* `java.lang.Boolean`

---

##### `readOnlyRootFilesystem`<sup>Required</sup> <a name="org.cdk8s.plus22.ContainerSecurityContext.property.readOnlyRootFilesystem"></a>

```java
public java.lang.Boolean getReadOnlyRootFilesystem();
```

- *Type:* `java.lang.Boolean`

---

##### `group`<sup>Optional</sup> <a name="org.cdk8s.plus22.ContainerSecurityContext.property.group"></a>

```java
public java.lang.Number getGroup();
```

- *Type:* `java.lang.Number`

---

##### `user`<sup>Optional</sup> <a name="org.cdk8s.plus22.ContainerSecurityContext.property.user"></a>

```java
public java.lang.Number getUser();
```

- *Type:* `java.lang.Number`

---


### Cpu <a name="org.cdk8s.plus22.Cpu"></a>

Represents the amount of CPU.

The amount can be passed as millis or units.


#### Static Functions <a name="Static Functions"></a>

##### `millis` <a name="org.cdk8s.plus22.Cpu.millis"></a>

```java
import org.cdk8s.plus22.Cpu;

Cpu.millis(java.lang.Number amount)
```

###### `amount`<sup>Required</sup> <a name="org.cdk8s.plus22.Cpu.parameter.amount"></a>

- *Type:* `java.lang.Number`

---

##### `units` <a name="org.cdk8s.plus22.Cpu.units"></a>

```java
import org.cdk8s.plus22.Cpu;

Cpu.units(java.lang.Number amount)
```

###### `amount`<sup>Required</sup> <a name="org.cdk8s.plus22.Cpu.parameter.amount"></a>

- *Type:* `java.lang.Number`

---

#### Properties <a name="Properties"></a>

##### `amount`<sup>Required</sup> <a name="org.cdk8s.plus22.Cpu.property.amount"></a>

```java
public java.lang.String getAmount();
```

- *Type:* `java.lang.String`

---


### EnvValue <a name="org.cdk8s.plus22.EnvValue"></a>

Utility class for creating reading env values from various sources.


#### Static Functions <a name="Static Functions"></a>

##### `fromConfigMap` <a name="org.cdk8s.plus22.EnvValue.fromConfigMap"></a>

```java
import org.cdk8s.plus22.EnvValue;

EnvValue.fromConfigMap(IConfigMap configMap, java.lang.String key)
EnvValue.fromConfigMap(IConfigMap configMap, java.lang.String key, EnvValueFromConfigMapOptions options)
```

###### `configMap`<sup>Required</sup> <a name="org.cdk8s.plus22.EnvValue.parameter.configMap"></a>

- *Type:* [`org.cdk8s.plus22.IConfigMap`](#org.cdk8s.plus22.IConfigMap)

The config map.

---

###### `key`<sup>Required</sup> <a name="org.cdk8s.plus22.EnvValue.parameter.key"></a>

- *Type:* `java.lang.String`

The key to extract the value from.

---

###### `options`<sup>Optional</sup> <a name="org.cdk8s.plus22.EnvValue.parameter.options"></a>

- *Type:* [`org.cdk8s.plus22.EnvValueFromConfigMapOptions`](#org.cdk8s.plus22.EnvValueFromConfigMapOptions)

Additional options.

---

##### `fromFieldRef` <a name="org.cdk8s.plus22.EnvValue.fromFieldRef"></a>

```java
import org.cdk8s.plus22.EnvValue;

EnvValue.fromFieldRef(EnvFieldPaths fieldPath)
EnvValue.fromFieldRef(EnvFieldPaths fieldPath, EnvValueFromFieldRefOptions options)
```

###### `fieldPath`<sup>Required</sup> <a name="org.cdk8s.plus22.EnvValue.parameter.fieldPath"></a>

- *Type:* [`org.cdk8s.plus22.EnvFieldPaths`](#org.cdk8s.plus22.EnvFieldPaths)

: The field reference.

---

###### `options`<sup>Optional</sup> <a name="org.cdk8s.plus22.EnvValue.parameter.options"></a>

- *Type:* [`org.cdk8s.plus22.EnvValueFromFieldRefOptions`](#org.cdk8s.plus22.EnvValueFromFieldRefOptions)

: Additional options.

---

##### `fromProcess` <a name="org.cdk8s.plus22.EnvValue.fromProcess"></a>

```java
import org.cdk8s.plus22.EnvValue;

EnvValue.fromProcess(java.lang.String key)
EnvValue.fromProcess(java.lang.String key, EnvValueFromProcessOptions options)
```

###### `key`<sup>Required</sup> <a name="org.cdk8s.plus22.EnvValue.parameter.key"></a>

- *Type:* `java.lang.String`

The key to read.

---

###### `options`<sup>Optional</sup> <a name="org.cdk8s.plus22.EnvValue.parameter.options"></a>

- *Type:* [`org.cdk8s.plus22.EnvValueFromProcessOptions`](#org.cdk8s.plus22.EnvValueFromProcessOptions)

Additional options.

---

##### `fromResource` <a name="org.cdk8s.plus22.EnvValue.fromResource"></a>

```java
import org.cdk8s.plus22.EnvValue;

EnvValue.fromResource(ResourceFieldPaths resource)
EnvValue.fromResource(ResourceFieldPaths resource, EnvValueFromResourceOptions options)
```

###### `resource`<sup>Required</sup> <a name="org.cdk8s.plus22.EnvValue.parameter.resource"></a>

- *Type:* [`org.cdk8s.plus22.ResourceFieldPaths`](#org.cdk8s.plus22.ResourceFieldPaths)

: Resource to select the value from.

---

###### `options`<sup>Optional</sup> <a name="org.cdk8s.plus22.EnvValue.parameter.options"></a>

- *Type:* [`org.cdk8s.plus22.EnvValueFromResourceOptions`](#org.cdk8s.plus22.EnvValueFromResourceOptions)

: Additional options.

---

##### `fromSecretValue` <a name="org.cdk8s.plus22.EnvValue.fromSecretValue"></a>

```java
import org.cdk8s.plus22.EnvValue;

EnvValue.fromSecretValue(SecretValue secretValue)
EnvValue.fromSecretValue(SecretValue secretValue, EnvValueFromSecretOptions options)
```

###### `secretValue`<sup>Required</sup> <a name="org.cdk8s.plus22.EnvValue.parameter.secretValue"></a>

- *Type:* [`org.cdk8s.plus22.SecretValue`](#org.cdk8s.plus22.SecretValue)

The secret value (secrent + key).

---

###### `options`<sup>Optional</sup> <a name="org.cdk8s.plus22.EnvValue.parameter.options"></a>

- *Type:* [`org.cdk8s.plus22.EnvValueFromSecretOptions`](#org.cdk8s.plus22.EnvValueFromSecretOptions)

Additional options.

---

##### `fromValue` <a name="org.cdk8s.plus22.EnvValue.fromValue"></a>

```java
import org.cdk8s.plus22.EnvValue;

EnvValue.fromValue(java.lang.String value)
```

###### `value`<sup>Required</sup> <a name="org.cdk8s.plus22.EnvValue.parameter.value"></a>

- *Type:* `java.lang.String`

The value.

---

#### Properties <a name="Properties"></a>

##### `value`<sup>Optional</sup> <a name="org.cdk8s.plus22.EnvValue.property.value"></a>

```java
public java.lang.Object getValue();
```

- *Type:* `java.lang.Object`

---

##### `valueFrom`<sup>Optional</sup> <a name="org.cdk8s.plus22.EnvValue.property.valueFrom"></a>

```java
public java.lang.Object getValueFrom();
```

- *Type:* `java.lang.Object`

---


### Handler <a name="org.cdk8s.plus22.Handler"></a>

Defines a specific action that should be taken.


#### Static Functions <a name="Static Functions"></a>

##### `fromCommand` <a name="org.cdk8s.plus22.Handler.fromCommand"></a>

```java
import org.cdk8s.plus22.Handler;

Handler.fromCommand(java.util.List<java.lang.String> command)
```

###### `command`<sup>Required</sup> <a name="org.cdk8s.plus22.Handler.parameter.command"></a>

- *Type:* java.util.List<`java.lang.String`>

The command to execute.

---

##### `fromHttpGet` <a name="org.cdk8s.plus22.Handler.fromHttpGet"></a>

```java
import org.cdk8s.plus22.Handler;

Handler.fromHttpGet(java.lang.String path)
Handler.fromHttpGet(java.lang.String path, HandlerFromHttpGetOptions options)
```

###### `path`<sup>Required</sup> <a name="org.cdk8s.plus22.Handler.parameter.path"></a>

- *Type:* `java.lang.String`

The URL path to hit.

---

###### `options`<sup>Optional</sup> <a name="org.cdk8s.plus22.Handler.parameter.options"></a>

- *Type:* [`org.cdk8s.plus22.HandlerFromHttpGetOptions`](#org.cdk8s.plus22.HandlerFromHttpGetOptions)

Options.

---

##### `fromTcpSocket` <a name="org.cdk8s.plus22.Handler.fromTcpSocket"></a>

```java
import org.cdk8s.plus22.Handler;

Handler.fromTcpSocket()
Handler.fromTcpSocket(HandlerFromTcpSocketOptions options)
```

###### `options`<sup>Optional</sup> <a name="org.cdk8s.plus22.Handler.parameter.options"></a>

- *Type:* [`org.cdk8s.plus22.HandlerFromTcpSocketOptions`](#org.cdk8s.plus22.HandlerFromTcpSocketOptions)

Options.

---



### IngressBackend <a name="org.cdk8s.plus22.IngressBackend"></a>

The backend for an ingress path.


#### Static Functions <a name="Static Functions"></a>

##### `fromService` <a name="org.cdk8s.plus22.IngressBackend.fromService"></a>

```java
import org.cdk8s.plus22.IngressBackend;

IngressBackend.fromService(Service service)
IngressBackend.fromService(Service service, ServiceIngressBackendOptions options)
```

###### `service`<sup>Required</sup> <a name="org.cdk8s.plus22.IngressBackend.parameter.service"></a>

- *Type:* [`org.cdk8s.plus22.Service`](#org.cdk8s.plus22.Service)

The service object.

---

###### `options`<sup>Optional</sup> <a name="org.cdk8s.plus22.IngressBackend.parameter.options"></a>

- *Type:* [`org.cdk8s.plus22.ServiceIngressBackendOptions`](#org.cdk8s.plus22.ServiceIngressBackendOptions)

---



### PodSecurityContext <a name="org.cdk8s.plus22.PodSecurityContext"></a>

Holds pod-level security attributes and common container settings.

#### Initializers <a name="org.cdk8s.plus22.PodSecurityContext.Initializer"></a>

```java
import org.cdk8s.plus22.PodSecurityContext;

PodSecurityContext.Builder.create()
//  .ensureNonRoot(java.lang.Boolean)
//  .fsGroup(java.lang.Number)
//  .fsGroupChangePolicy(FsGroupChangePolicy)
//  .group(java.lang.Number)
//  .sysctls(java.util.List<Sysctl>)
//  .user(java.lang.Number)
    .build();
```

##### `ensureNonRoot`<sup>Optional</sup> <a name="org.cdk8s.plus22.PodSecurityContextProps.parameter.ensureNonRoot"></a>

- *Type:* `java.lang.Boolean`
- *Default:* false

Indicates that the container must run as a non-root user.

If true, the Kubelet will validate the image at runtime to ensure that it does
not run as UID 0 (root) and fail to start the container if it does.

---

##### `fsGroup`<sup>Optional</sup> <a name="org.cdk8s.plus22.PodSecurityContextProps.parameter.fsGroup"></a>

- *Type:* `java.lang.Number`
- *Default:* Volume ownership is not changed.

Modify the ownership and permissions of pod volumes to this GID.

---

##### `fsGroupChangePolicy`<sup>Optional</sup> <a name="org.cdk8s.plus22.PodSecurityContextProps.parameter.fsGroupChangePolicy"></a>

- *Type:* [`org.cdk8s.plus22.FsGroupChangePolicy`](#org.cdk8s.plus22.FsGroupChangePolicy)
- *Default:* FsGroupChangePolicy.ALWAYS

Defines behavior of changing ownership and permission of the volume before being exposed inside Pod.

This field will only apply to volume types which support fsGroup based ownership(and permissions).
It will have no effect on ephemeral volume types such as: secret, configmaps and emptydir.

---

##### `group`<sup>Optional</sup> <a name="org.cdk8s.plus22.PodSecurityContextProps.parameter.group"></a>

- *Type:* `java.lang.Number`
- *Default:* Group configured by container runtime

The GID to run the entrypoint of the container process.

---

##### `sysctls`<sup>Optional</sup> <a name="org.cdk8s.plus22.PodSecurityContextProps.parameter.sysctls"></a>

- *Type:* java.util.List<[`org.cdk8s.plus22.Sysctl`](#org.cdk8s.plus22.Sysctl)>
- *Default:* No sysctls

Sysctls hold a list of namespaced sysctls used for the pod.

Pods with unsupported sysctls (by the container runtime) might fail to launch.

---

##### `user`<sup>Optional</sup> <a name="org.cdk8s.plus22.PodSecurityContextProps.parameter.user"></a>

- *Type:* `java.lang.Number`
- *Default:* User specified in image metadata

The UID to run the entrypoint of the container process.

---



#### Properties <a name="Properties"></a>

##### `ensureNonRoot`<sup>Required</sup> <a name="org.cdk8s.plus22.PodSecurityContext.property.ensureNonRoot"></a>

```java
public java.lang.Boolean getEnsureNonRoot();
```

- *Type:* `java.lang.Boolean`

---

##### `fsGroupChangePolicy`<sup>Required</sup> <a name="org.cdk8s.plus22.PodSecurityContext.property.fsGroupChangePolicy"></a>

```java
public FsGroupChangePolicy getFsGroupChangePolicy();
```

- *Type:* [`org.cdk8s.plus22.FsGroupChangePolicy`](#org.cdk8s.plus22.FsGroupChangePolicy)

---

##### `sysctls`<sup>Required</sup> <a name="org.cdk8s.plus22.PodSecurityContext.property.sysctls"></a>

```java
public java.util.List<Sysctl> getSysctls();
```

- *Type:* java.util.List<[`org.cdk8s.plus22.Sysctl`](#org.cdk8s.plus22.Sysctl)>

---

##### `fsGroup`<sup>Optional</sup> <a name="org.cdk8s.plus22.PodSecurityContext.property.fsGroup"></a>

```java
public java.lang.Number getFsGroup();
```

- *Type:* `java.lang.Number`

---

##### `group`<sup>Optional</sup> <a name="org.cdk8s.plus22.PodSecurityContext.property.group"></a>

```java
public java.lang.Number getGroup();
```

- *Type:* `java.lang.Number`

---

##### `user`<sup>Optional</sup> <a name="org.cdk8s.plus22.PodSecurityContext.property.user"></a>

```java
public java.lang.Number getUser();
```

- *Type:* `java.lang.Number`

---


### PodSpec <a name="org.cdk8s.plus22.PodSpec"></a>

- *Implements:* [`org.cdk8s.plus22.IPodSpec`](#org.cdk8s.plus22.IPodSpec)

Provides read/write capabilities ontop of a `PodSpecProps`.

#### Initializers <a name="org.cdk8s.plus22.PodSpec.Initializer"></a>

```java
import org.cdk8s.plus22.PodSpec;

PodSpec.Builder.create()
//  .containers(java.util.List<ContainerProps>)
//  .hostAliases(java.util.List<HostAlias>)
//  .initContainers(java.util.List<ContainerProps>)
//  .restartPolicy(RestartPolicy)
//  .securityContext(PodSecurityContextProps)
//  .serviceAccount(IServiceAccount)
//  .volumes(java.util.List<Volume>)
    .build();
```

##### `containers`<sup>Optional</sup> <a name="org.cdk8s.plus22.PodSpecProps.parameter.containers"></a>

- *Type:* java.util.List<[`org.cdk8s.plus22.ContainerProps`](#org.cdk8s.plus22.ContainerProps)>
- *Default:* No containers. Note that a pod spec must include at least one container.

List of containers belonging to the pod.

Containers cannot currently be
added or removed. There must be at least one container in a Pod.

You can add additionnal containers using `podSpec.addContainer()`

---

##### `hostAliases`<sup>Optional</sup> <a name="org.cdk8s.plus22.PodSpecProps.parameter.hostAliases"></a>

- *Type:* java.util.List<[`org.cdk8s.plus22.HostAlias`](#org.cdk8s.plus22.HostAlias)>

HostAlias holds the mapping between IP and hostnames that will be injected as an entry in the pod's hosts file.

---

##### `initContainers`<sup>Optional</sup> <a name="org.cdk8s.plus22.PodSpecProps.parameter.initContainers"></a>

- *Type:* java.util.List<[`org.cdk8s.plus22.ContainerProps`](#org.cdk8s.plus22.ContainerProps)>
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

##### `restartPolicy`<sup>Optional</sup> <a name="org.cdk8s.plus22.PodSpecProps.parameter.restartPolicy"></a>

- *Type:* [`org.cdk8s.plus22.RestartPolicy`](#org.cdk8s.plus22.RestartPolicy)
- *Default:* RestartPolicy.ALWAYS

Restart policy for all containers within the pod.

> https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle/#restart-policy

---

##### `securityContext`<sup>Optional</sup> <a name="org.cdk8s.plus22.PodSpecProps.parameter.securityContext"></a>

- *Type:* [`org.cdk8s.plus22.PodSecurityContextProps`](#org.cdk8s.plus22.PodSecurityContextProps)
- *Default:* fsGroupChangePolicy: FsGroupChangePolicy.FsGroupChangePolicy.ALWAYS
  ensureNonRoot: false

SecurityContext holds pod-level security attributes and common container settings.

---

##### `serviceAccount`<sup>Optional</sup> <a name="org.cdk8s.plus22.PodSpecProps.parameter.serviceAccount"></a>

- *Type:* [`org.cdk8s.plus22.IServiceAccount`](#org.cdk8s.plus22.IServiceAccount)
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

##### `volumes`<sup>Optional</sup> <a name="org.cdk8s.plus22.PodSpecProps.parameter.volumes"></a>

- *Type:* java.util.List<[`org.cdk8s.plus22.Volume`](#org.cdk8s.plus22.Volume)>
- *Default:* No volumes.

List of volumes that can be mounted by containers belonging to the pod.

You can also add volumes later using `podSpec.addVolume()`

> https://kubernetes.io/docs/concepts/storage/volumes

---

#### Methods <a name="Methods"></a>

##### `addContainer` <a name="org.cdk8s.plus22.PodSpec.addContainer"></a>

```java
public addContainer(ContainerProps container)
```

###### `container`<sup>Required</sup> <a name="org.cdk8s.plus22.PodSpec.parameter.container"></a>

- *Type:* [`org.cdk8s.plus22.ContainerProps`](#org.cdk8s.plus22.ContainerProps)

---

##### `addHostAlias` <a name="org.cdk8s.plus22.PodSpec.addHostAlias"></a>

```java
public addHostAlias(HostAlias hostAlias)
```

###### `hostAlias`<sup>Required</sup> <a name="org.cdk8s.plus22.PodSpec.parameter.hostAlias"></a>

- *Type:* [`org.cdk8s.plus22.HostAlias`](#org.cdk8s.plus22.HostAlias)

---

##### `addInitContainer` <a name="org.cdk8s.plus22.PodSpec.addInitContainer"></a>

```java
public addInitContainer(ContainerProps container)
```

###### `container`<sup>Required</sup> <a name="org.cdk8s.plus22.PodSpec.parameter.container"></a>

- *Type:* [`org.cdk8s.plus22.ContainerProps`](#org.cdk8s.plus22.ContainerProps)

---

##### `addVolume` <a name="org.cdk8s.plus22.PodSpec.addVolume"></a>

```java
public addVolume(Volume volume)
```

###### `volume`<sup>Required</sup> <a name="org.cdk8s.plus22.PodSpec.parameter.volume"></a>

- *Type:* [`org.cdk8s.plus22.Volume`](#org.cdk8s.plus22.Volume)

---


#### Properties <a name="Properties"></a>

##### `containers`<sup>Required</sup> <a name="org.cdk8s.plus22.PodSpec.property.containers"></a>

```java
public java.util.List<Container> getContainers();
```

- *Type:* java.util.List<[`org.cdk8s.plus22.Container`](#org.cdk8s.plus22.Container)>

The containers belonging to the pod.

Use `addContainer` to add containers.

---

##### `hostAliases`<sup>Required</sup> <a name="org.cdk8s.plus22.PodSpec.property.hostAliases"></a>

```java
public java.util.List<HostAlias> getHostAliases();
```

- *Type:* java.util.List<[`org.cdk8s.plus22.HostAlias`](#org.cdk8s.plus22.HostAlias)>

An optional list of hosts and IPs that will be injected into the pod's hosts file if specified.

This is only valid for non-hostNetwork pods.

---

##### `initContainers`<sup>Required</sup> <a name="org.cdk8s.plus22.PodSpec.property.initContainers"></a>

```java
public java.util.List<Container> getInitContainers();
```

- *Type:* java.util.List<[`org.cdk8s.plus22.Container`](#org.cdk8s.plus22.Container)>

The init containers belonging to the pod.

Use `addInitContainer` to add init containers.

---

##### `securityContext`<sup>Required</sup> <a name="org.cdk8s.plus22.PodSpec.property.securityContext"></a>

```java
public PodSecurityContext getSecurityContext();
```

- *Type:* [`org.cdk8s.plus22.PodSecurityContext`](#org.cdk8s.plus22.PodSecurityContext)

---

##### `volumes`<sup>Required</sup> <a name="org.cdk8s.plus22.PodSpec.property.volumes"></a>

```java
public java.util.List<Volume> getVolumes();
```

- *Type:* java.util.List<[`org.cdk8s.plus22.Volume`](#org.cdk8s.plus22.Volume)>

The volumes associated with this pod.

Use `addVolume` to add volumes.

---

##### `restartPolicy`<sup>Optional</sup> <a name="org.cdk8s.plus22.PodSpec.property.restartPolicy"></a>

```java
public RestartPolicy getRestartPolicy();
```

- *Type:* [`org.cdk8s.plus22.RestartPolicy`](#org.cdk8s.plus22.RestartPolicy)

Restart policy for all containers within the pod.

---

##### `serviceAccount`<sup>Optional</sup> <a name="org.cdk8s.plus22.PodSpec.property.serviceAccount"></a>

```java
public IServiceAccount getServiceAccount();
```

- *Type:* [`org.cdk8s.plus22.IServiceAccount`](#org.cdk8s.plus22.IServiceAccount)

The service account used to run this pod.

---


### PodTemplate <a name="org.cdk8s.plus22.PodTemplate"></a>

- *Implements:* [`org.cdk8s.plus22.IPodTemplate`](#org.cdk8s.plus22.IPodTemplate)

Provides read/write capabilities ontop of a `PodTemplateProps`.

#### Initializers <a name="org.cdk8s.plus22.PodTemplate.Initializer"></a>

```java
import org.cdk8s.plus22.PodTemplate;

PodTemplate.Builder.create()
//  .containers(java.util.List<ContainerProps>)
//  .hostAliases(java.util.List<HostAlias>)
//  .initContainers(java.util.List<ContainerProps>)
//  .restartPolicy(RestartPolicy)
//  .securityContext(PodSecurityContextProps)
//  .serviceAccount(IServiceAccount)
//  .volumes(java.util.List<Volume>)
//  .podMetadata(ApiObjectMetadata)
    .build();
```

##### `containers`<sup>Optional</sup> <a name="org.cdk8s.plus22.PodTemplateProps.parameter.containers"></a>

- *Type:* java.util.List<[`org.cdk8s.plus22.ContainerProps`](#org.cdk8s.plus22.ContainerProps)>
- *Default:* No containers. Note that a pod spec must include at least one container.

List of containers belonging to the pod.

Containers cannot currently be
added or removed. There must be at least one container in a Pod.

You can add additionnal containers using `podSpec.addContainer()`

---

##### `hostAliases`<sup>Optional</sup> <a name="org.cdk8s.plus22.PodTemplateProps.parameter.hostAliases"></a>

- *Type:* java.util.List<[`org.cdk8s.plus22.HostAlias`](#org.cdk8s.plus22.HostAlias)>

HostAlias holds the mapping between IP and hostnames that will be injected as an entry in the pod's hosts file.

---

##### `initContainers`<sup>Optional</sup> <a name="org.cdk8s.plus22.PodTemplateProps.parameter.initContainers"></a>

- *Type:* java.util.List<[`org.cdk8s.plus22.ContainerProps`](#org.cdk8s.plus22.ContainerProps)>
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

##### `restartPolicy`<sup>Optional</sup> <a name="org.cdk8s.plus22.PodTemplateProps.parameter.restartPolicy"></a>

- *Type:* [`org.cdk8s.plus22.RestartPolicy`](#org.cdk8s.plus22.RestartPolicy)
- *Default:* RestartPolicy.ALWAYS

Restart policy for all containers within the pod.

> https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle/#restart-policy

---

##### `securityContext`<sup>Optional</sup> <a name="org.cdk8s.plus22.PodTemplateProps.parameter.securityContext"></a>

- *Type:* [`org.cdk8s.plus22.PodSecurityContextProps`](#org.cdk8s.plus22.PodSecurityContextProps)
- *Default:* fsGroupChangePolicy: FsGroupChangePolicy.FsGroupChangePolicy.ALWAYS
  ensureNonRoot: false

SecurityContext holds pod-level security attributes and common container settings.

---

##### `serviceAccount`<sup>Optional</sup> <a name="org.cdk8s.plus22.PodTemplateProps.parameter.serviceAccount"></a>

- *Type:* [`org.cdk8s.plus22.IServiceAccount`](#org.cdk8s.plus22.IServiceAccount)
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

##### `volumes`<sup>Optional</sup> <a name="org.cdk8s.plus22.PodTemplateProps.parameter.volumes"></a>

- *Type:* java.util.List<[`org.cdk8s.plus22.Volume`](#org.cdk8s.plus22.Volume)>
- *Default:* No volumes.

List of volumes that can be mounted by containers belonging to the pod.

You can also add volumes later using `podSpec.addVolume()`

> https://kubernetes.io/docs/concepts/storage/volumes

---

##### `podMetadata`<sup>Optional</sup> <a name="org.cdk8s.plus22.PodTemplateProps.parameter.podMetadata"></a>

- *Type:* [`org.cdk8s.ApiObjectMetadata`](#org.cdk8s.ApiObjectMetadata)

The pod metadata.

---



#### Properties <a name="Properties"></a>

##### `podMetadata`<sup>Required</sup> <a name="org.cdk8s.plus22.PodTemplate.property.podMetadata"></a>

```java
public ApiObjectMetadataDefinition getPodMetadata();
```

- *Type:* [`org.cdk8s.ApiObjectMetadataDefinition`](#org.cdk8s.ApiObjectMetadataDefinition)

Provides read/write access to the underlying pod metadata of the resource.

---


### Probe <a name="org.cdk8s.plus22.Probe"></a>

Probe describes a health check to be performed against a container to determine whether it is alive or ready to receive traffic.


#### Static Functions <a name="Static Functions"></a>

##### `fromCommand` <a name="org.cdk8s.plus22.Probe.fromCommand"></a>

```java
import org.cdk8s.plus22.Probe;

Probe.fromCommand(java.util.List<java.lang.String> command)
Probe.fromCommand(java.util.List<java.lang.String> command, CommandProbeOptions options)
```

###### `command`<sup>Required</sup> <a name="org.cdk8s.plus22.Probe.parameter.command"></a>

- *Type:* java.util.List<`java.lang.String`>

The command to execute.

---

###### `options`<sup>Optional</sup> <a name="org.cdk8s.plus22.Probe.parameter.options"></a>

- *Type:* [`org.cdk8s.plus22.CommandProbeOptions`](#org.cdk8s.plus22.CommandProbeOptions)

Options.

---

##### `fromHttpGet` <a name="org.cdk8s.plus22.Probe.fromHttpGet"></a>

```java
import org.cdk8s.plus22.Probe;

Probe.fromHttpGet(java.lang.String path)
Probe.fromHttpGet(java.lang.String path, HttpGetProbeOptions options)
```

###### `path`<sup>Required</sup> <a name="org.cdk8s.plus22.Probe.parameter.path"></a>

- *Type:* `java.lang.String`

The URL path to hit.

---

###### `options`<sup>Optional</sup> <a name="org.cdk8s.plus22.Probe.parameter.options"></a>

- *Type:* [`org.cdk8s.plus22.HttpGetProbeOptions`](#org.cdk8s.plus22.HttpGetProbeOptions)

Options.

---

##### `fromTcpSocket` <a name="org.cdk8s.plus22.Probe.fromTcpSocket"></a>

```java
import org.cdk8s.plus22.Probe;

Probe.fromTcpSocket()
Probe.fromTcpSocket(TcpSocketProbeOptions options)
```

###### `options`<sup>Optional</sup> <a name="org.cdk8s.plus22.Probe.parameter.options"></a>

- *Type:* [`org.cdk8s.plus22.TcpSocketProbeOptions`](#org.cdk8s.plus22.TcpSocketProbeOptions)

Options.

---



### Volume <a name="org.cdk8s.plus22.Volume"></a>

- *Implements:* [`org.cdk8s.plus22.IStorage`](#org.cdk8s.plus22.IStorage)

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

#### Methods <a name="Methods"></a>

##### `asVolume` <a name="org.cdk8s.plus22.Volume.asVolume"></a>

```java
public asVolume()
```

#### Static Functions <a name="Static Functions"></a>

##### `fromConfigMap` <a name="org.cdk8s.plus22.Volume.fromConfigMap"></a>

```java
import org.cdk8s.plus22.Volume;

Volume.fromConfigMap(IConfigMap configMap)
Volume.fromConfigMap(IConfigMap configMap, ConfigMapVolumeOptions options)
```

###### `configMap`<sup>Required</sup> <a name="org.cdk8s.plus22.Volume.parameter.configMap"></a>

- *Type:* [`org.cdk8s.plus22.IConfigMap`](#org.cdk8s.plus22.IConfigMap)

The config map to use to populate the volume.

---

###### `options`<sup>Optional</sup> <a name="org.cdk8s.plus22.Volume.parameter.options"></a>

- *Type:* [`org.cdk8s.plus22.ConfigMapVolumeOptions`](#org.cdk8s.plus22.ConfigMapVolumeOptions)

Options.

---

##### `fromEmptyDir` <a name="org.cdk8s.plus22.Volume.fromEmptyDir"></a>

```java
import org.cdk8s.plus22.Volume;

Volume.fromEmptyDir(java.lang.String name)
Volume.fromEmptyDir(java.lang.String name, EmptyDirVolumeOptions options)
```

###### `name`<sup>Required</sup> <a name="org.cdk8s.plus22.Volume.parameter.name"></a>

- *Type:* `java.lang.String`

---

###### `options`<sup>Optional</sup> <a name="org.cdk8s.plus22.Volume.parameter.options"></a>

- *Type:* [`org.cdk8s.plus22.EmptyDirVolumeOptions`](#org.cdk8s.plus22.EmptyDirVolumeOptions)

Additional options.

---

##### `fromPersistentVolumeClaim` <a name="org.cdk8s.plus22.Volume.fromPersistentVolumeClaim"></a>

```java
import org.cdk8s.plus22.Volume;

Volume.fromPersistentVolumeClaim(IPersistentVolumeClaim pvc)
Volume.fromPersistentVolumeClaim(IPersistentVolumeClaim pvc, PersistentVolumeClaimVolumeOptions options)
```

###### `pvc`<sup>Required</sup> <a name="org.cdk8s.plus22.Volume.parameter.pvc"></a>

- *Type:* [`org.cdk8s.plus22.IPersistentVolumeClaim`](#org.cdk8s.plus22.IPersistentVolumeClaim)

---

###### `options`<sup>Optional</sup> <a name="org.cdk8s.plus22.Volume.parameter.options"></a>

- *Type:* [`org.cdk8s.plus22.PersistentVolumeClaimVolumeOptions`](#org.cdk8s.plus22.PersistentVolumeClaimVolumeOptions)

---

##### `fromSecret` <a name="org.cdk8s.plus22.Volume.fromSecret"></a>

```java
import org.cdk8s.plus22.Volume;

Volume.fromSecret(ISecret secret)
Volume.fromSecret(ISecret secret, SecretVolumeOptions options)
```

###### `secret`<sup>Required</sup> <a name="org.cdk8s.plus22.Volume.parameter.secret"></a>

- *Type:* [`org.cdk8s.plus22.ISecret`](#org.cdk8s.plus22.ISecret)

The secret to use to populate the volume.

---

###### `options`<sup>Optional</sup> <a name="org.cdk8s.plus22.Volume.parameter.options"></a>

- *Type:* [`org.cdk8s.plus22.SecretVolumeOptions`](#org.cdk8s.plus22.SecretVolumeOptions)

Options.

---

#### Properties <a name="Properties"></a>

##### `name`<sup>Required</sup> <a name="org.cdk8s.plus22.Volume.property.name"></a>

```java
public java.lang.String getName();
```

- *Type:* `java.lang.String`

---


## Protocols <a name="Protocols"></a>

### IConfigMap <a name="org.cdk8s.plus22.IConfigMap"></a>

- *Extends:* [`org.cdk8s.plus22.IResource`](#org.cdk8s.plus22.IResource)

- *Implemented By:* [`org.cdk8s.plus22.ConfigMap`](#org.cdk8s.plus22.ConfigMap), [`org.cdk8s.plus22.IConfigMap`](#org.cdk8s.plus22.IConfigMap)

Represents a config map.


#### Properties <a name="Properties"></a>

##### `name`<sup>Required</sup> <a name="org.cdk8s.plus22.IConfigMap.property.name"></a>

```java
public java.lang.String getName();
```

- *Type:* `java.lang.String`

The Kubernetes name of this resource.

---

### IPersistentVolume <a name="org.cdk8s.plus22.IPersistentVolume"></a>

- *Extends:* [`org.cdk8s.plus22.IResource`](#org.cdk8s.plus22.IResource)

- *Implemented By:* [`org.cdk8s.plus22.AwsElasticBlockStorePersistentVolume`](#org.cdk8s.plus22.AwsElasticBlockStorePersistentVolume), [`org.cdk8s.plus22.AzureDiskPersistentVolume`](#org.cdk8s.plus22.AzureDiskPersistentVolume), [`org.cdk8s.plus22.GCEPersistentDiskPersistentVolume`](#org.cdk8s.plus22.GCEPersistentDiskPersistentVolume), [`org.cdk8s.plus22.PersistentVolume`](#org.cdk8s.plus22.PersistentVolume), [`org.cdk8s.plus22.IPersistentVolume`](#org.cdk8s.plus22.IPersistentVolume)

Contract of a `PersistentVolumeClaim`.


#### Properties <a name="Properties"></a>

##### `name`<sup>Required</sup> <a name="org.cdk8s.plus22.IPersistentVolume.property.name"></a>

```java
public java.lang.String getName();
```

- *Type:* `java.lang.String`

The Kubernetes name of this resource.

---

### IPersistentVolumeClaim <a name="org.cdk8s.plus22.IPersistentVolumeClaim"></a>

- *Extends:* [`org.cdk8s.plus22.IResource`](#org.cdk8s.plus22.IResource)

- *Implemented By:* [`org.cdk8s.plus22.PersistentVolumeClaim`](#org.cdk8s.plus22.PersistentVolumeClaim), [`org.cdk8s.plus22.IPersistentVolumeClaim`](#org.cdk8s.plus22.IPersistentVolumeClaim)

Contract of a `PersistentVolumeClaim`.


#### Properties <a name="Properties"></a>

##### `name`<sup>Required</sup> <a name="org.cdk8s.plus22.IPersistentVolumeClaim.property.name"></a>

```java
public java.lang.String getName();
```

- *Type:* `java.lang.String`

The Kubernetes name of this resource.

---

### IPodSpec <a name="org.cdk8s.plus22.IPodSpec"></a>

- *Implemented By:* [`org.cdk8s.plus22.Deployment`](#org.cdk8s.plus22.Deployment), [`org.cdk8s.plus22.Job`](#org.cdk8s.plus22.Job), [`org.cdk8s.plus22.Pod`](#org.cdk8s.plus22.Pod), [`org.cdk8s.plus22.PodSpec`](#org.cdk8s.plus22.PodSpec), [`org.cdk8s.plus22.PodTemplate`](#org.cdk8s.plus22.PodTemplate), [`org.cdk8s.plus22.StatefulSet`](#org.cdk8s.plus22.StatefulSet), [`org.cdk8s.plus22.IPodSpec`](#org.cdk8s.plus22.IPodSpec), [`org.cdk8s.plus22.IPodTemplate`](#org.cdk8s.plus22.IPodTemplate)

Represents a resource that can be configured with a kuberenets pod spec. (e.g `Deployment`, `Job`, `Pod`, ...).

Use the `PodSpec` class as an implementation helper.

#### Methods <a name="Methods"></a>

##### `addContainer` <a name="org.cdk8s.plus22.IPodSpec.addContainer"></a>

```java
public addContainer(ContainerProps container)
```

###### `container`<sup>Required</sup> <a name="org.cdk8s.plus22.IPodSpec.parameter.container"></a>

- *Type:* [`org.cdk8s.plus22.ContainerProps`](#org.cdk8s.plus22.ContainerProps)

The container.

---

##### `addInitContainer` <a name="org.cdk8s.plus22.IPodSpec.addInitContainer"></a>

```java
public addInitContainer(ContainerProps container)
```

###### `container`<sup>Required</sup> <a name="org.cdk8s.plus22.IPodSpec.parameter.container"></a>

- *Type:* [`org.cdk8s.plus22.ContainerProps`](#org.cdk8s.plus22.ContainerProps)

The container.

---

##### `addVolume` <a name="org.cdk8s.plus22.IPodSpec.addVolume"></a>

```java
public addVolume(Volume volume)
```

###### `volume`<sup>Required</sup> <a name="org.cdk8s.plus22.IPodSpec.parameter.volume"></a>

- *Type:* [`org.cdk8s.plus22.Volume`](#org.cdk8s.plus22.Volume)

The volume.

---

#### Properties <a name="Properties"></a>

##### `containers`<sup>Required</sup> <a name="org.cdk8s.plus22.IPodSpec.property.containers"></a>

```java
public java.util.List<Container> getContainers();
```

- *Type:* java.util.List<[`org.cdk8s.plus22.Container`](#org.cdk8s.plus22.Container)>

The containers belonging to the pod.

Use `addContainer` to add containers.

---

##### `hostAliases`<sup>Required</sup> <a name="org.cdk8s.plus22.IPodSpec.property.hostAliases"></a>

```java
public java.util.List<HostAlias> getHostAliases();
```

- *Type:* java.util.List<[`org.cdk8s.plus22.HostAlias`](#org.cdk8s.plus22.HostAlias)>

An optional list of hosts and IPs that will be injected into the pod's hosts file if specified.

This is only valid for non-hostNetwork pods.

---

##### `initContainers`<sup>Required</sup> <a name="org.cdk8s.plus22.IPodSpec.property.initContainers"></a>

```java
public java.util.List<Container> getInitContainers();
```

- *Type:* java.util.List<[`org.cdk8s.plus22.Container`](#org.cdk8s.plus22.Container)>

The init containers belonging to the pod.

Use `addInitContainer` to add init containers.

---

##### `volumes`<sup>Required</sup> <a name="org.cdk8s.plus22.IPodSpec.property.volumes"></a>

```java
public java.util.List<Volume> getVolumes();
```

- *Type:* java.util.List<[`org.cdk8s.plus22.Volume`](#org.cdk8s.plus22.Volume)>

The volumes associated with this pod.

Use `addVolume` to add volumes.

---

##### `restartPolicy`<sup>Optional</sup> <a name="org.cdk8s.plus22.IPodSpec.property.restartPolicy"></a>

```java
public RestartPolicy getRestartPolicy();
```

- *Type:* [`org.cdk8s.plus22.RestartPolicy`](#org.cdk8s.plus22.RestartPolicy)

Restart policy for all containers within the pod.

---

##### `serviceAccount`<sup>Optional</sup> <a name="org.cdk8s.plus22.IPodSpec.property.serviceAccount"></a>

```java
public IServiceAccount getServiceAccount();
```

- *Type:* [`org.cdk8s.plus22.IServiceAccount`](#org.cdk8s.plus22.IServiceAccount)

The service account used to run this pod.

---

### IPodTemplate <a name="org.cdk8s.plus22.IPodTemplate"></a>

- *Extends:* [`org.cdk8s.plus22.IPodSpec`](#org.cdk8s.plus22.IPodSpec)

- *Implemented By:* [`org.cdk8s.plus22.Deployment`](#org.cdk8s.plus22.Deployment), [`org.cdk8s.plus22.Job`](#org.cdk8s.plus22.Job), [`org.cdk8s.plus22.PodTemplate`](#org.cdk8s.plus22.PodTemplate), [`org.cdk8s.plus22.StatefulSet`](#org.cdk8s.plus22.StatefulSet), [`org.cdk8s.plus22.IPodTemplate`](#org.cdk8s.plus22.IPodTemplate)

Represents a resource that can be configured with a kuberenets pod template. (e.g `Deployment`, `Job`, ...).

Use the `PodTemplate` class as an implementation helper.


#### Properties <a name="Properties"></a>

##### `containers`<sup>Required</sup> <a name="org.cdk8s.plus22.IPodTemplate.property.containers"></a>

```java
public java.util.List<Container> getContainers();
```

- *Type:* java.util.List<[`org.cdk8s.plus22.Container`](#org.cdk8s.plus22.Container)>

The containers belonging to the pod.

Use `addContainer` to add containers.

---

##### `hostAliases`<sup>Required</sup> <a name="org.cdk8s.plus22.IPodTemplate.property.hostAliases"></a>

```java
public java.util.List<HostAlias> getHostAliases();
```

- *Type:* java.util.List<[`org.cdk8s.plus22.HostAlias`](#org.cdk8s.plus22.HostAlias)>

An optional list of hosts and IPs that will be injected into the pod's hosts file if specified.

This is only valid for non-hostNetwork pods.

---

##### `initContainers`<sup>Required</sup> <a name="org.cdk8s.plus22.IPodTemplate.property.initContainers"></a>

```java
public java.util.List<Container> getInitContainers();
```

- *Type:* java.util.List<[`org.cdk8s.plus22.Container`](#org.cdk8s.plus22.Container)>

The init containers belonging to the pod.

Use `addInitContainer` to add init containers.

---

##### `volumes`<sup>Required</sup> <a name="org.cdk8s.plus22.IPodTemplate.property.volumes"></a>

```java
public java.util.List<Volume> getVolumes();
```

- *Type:* java.util.List<[`org.cdk8s.plus22.Volume`](#org.cdk8s.plus22.Volume)>

The volumes associated with this pod.

Use `addVolume` to add volumes.

---

##### `restartPolicy`<sup>Optional</sup> <a name="org.cdk8s.plus22.IPodTemplate.property.restartPolicy"></a>

```java
public RestartPolicy getRestartPolicy();
```

- *Type:* [`org.cdk8s.plus22.RestartPolicy`](#org.cdk8s.plus22.RestartPolicy)

Restart policy for all containers within the pod.

---

##### `serviceAccount`<sup>Optional</sup> <a name="org.cdk8s.plus22.IPodTemplate.property.serviceAccount"></a>

```java
public IServiceAccount getServiceAccount();
```

- *Type:* [`org.cdk8s.plus22.IServiceAccount`](#org.cdk8s.plus22.IServiceAccount)

The service account used to run this pod.

---

##### `podMetadata`<sup>Required</sup> <a name="org.cdk8s.plus22.IPodTemplate.property.podMetadata"></a>

```java
public ApiObjectMetadataDefinition getPodMetadata();
```

- *Type:* [`org.cdk8s.ApiObjectMetadataDefinition`](#org.cdk8s.ApiObjectMetadataDefinition)

Provides read/write access to the underlying pod metadata of the resource.

---

### IResource <a name="org.cdk8s.plus22.IResource"></a>

- *Implemented By:* [`org.cdk8s.plus22.AwsElasticBlockStorePersistentVolume`](#org.cdk8s.plus22.AwsElasticBlockStorePersistentVolume), [`org.cdk8s.plus22.AzureDiskPersistentVolume`](#org.cdk8s.plus22.AzureDiskPersistentVolume), [`org.cdk8s.plus22.BasicAuthSecret`](#org.cdk8s.plus22.BasicAuthSecret), [`org.cdk8s.plus22.ConfigMap`](#org.cdk8s.plus22.ConfigMap), [`org.cdk8s.plus22.Deployment`](#org.cdk8s.plus22.Deployment), [`org.cdk8s.plus22.DockerConfigSecret`](#org.cdk8s.plus22.DockerConfigSecret), [`org.cdk8s.plus22.GCEPersistentDiskPersistentVolume`](#org.cdk8s.plus22.GCEPersistentDiskPersistentVolume), [`org.cdk8s.plus22.Ingress`](#org.cdk8s.plus22.Ingress), [`org.cdk8s.plus22.Job`](#org.cdk8s.plus22.Job), [`org.cdk8s.plus22.PersistentVolume`](#org.cdk8s.plus22.PersistentVolume), [`org.cdk8s.plus22.PersistentVolumeClaim`](#org.cdk8s.plus22.PersistentVolumeClaim), [`org.cdk8s.plus22.Pod`](#org.cdk8s.plus22.Pod), [`org.cdk8s.plus22.Resource`](#org.cdk8s.plus22.Resource), [`org.cdk8s.plus22.Secret`](#org.cdk8s.plus22.Secret), [`org.cdk8s.plus22.Service`](#org.cdk8s.plus22.Service), [`org.cdk8s.plus22.ServiceAccount`](#org.cdk8s.plus22.ServiceAccount), [`org.cdk8s.plus22.ServiceAccountTokenSecret`](#org.cdk8s.plus22.ServiceAccountTokenSecret), [`org.cdk8s.plus22.SshAuthSecret`](#org.cdk8s.plus22.SshAuthSecret), [`org.cdk8s.plus22.StatefulSet`](#org.cdk8s.plus22.StatefulSet), [`org.cdk8s.plus22.TlsSecret`](#org.cdk8s.plus22.TlsSecret), [`org.cdk8s.plus22.IConfigMap`](#org.cdk8s.plus22.IConfigMap), [`org.cdk8s.plus22.IPersistentVolume`](#org.cdk8s.plus22.IPersistentVolume), [`org.cdk8s.plus22.IPersistentVolumeClaim`](#org.cdk8s.plus22.IPersistentVolumeClaim), [`org.cdk8s.plus22.IResource`](#org.cdk8s.plus22.IResource), [`org.cdk8s.plus22.ISecret`](#org.cdk8s.plus22.ISecret), [`org.cdk8s.plus22.IServiceAccount`](#org.cdk8s.plus22.IServiceAccount)

Represents a resource.


#### Properties <a name="Properties"></a>

##### `name`<sup>Required</sup> <a name="org.cdk8s.plus22.IResource.property.name"></a>

```java
public java.lang.String getName();
```

- *Type:* `java.lang.String`

The Kubernetes name of this resource.

---

### ISecret <a name="org.cdk8s.plus22.ISecret"></a>

- *Extends:* [`org.cdk8s.plus22.IResource`](#org.cdk8s.plus22.IResource)

- *Implemented By:* [`org.cdk8s.plus22.BasicAuthSecret`](#org.cdk8s.plus22.BasicAuthSecret), [`org.cdk8s.plus22.DockerConfigSecret`](#org.cdk8s.plus22.DockerConfigSecret), [`org.cdk8s.plus22.Secret`](#org.cdk8s.plus22.Secret), [`org.cdk8s.plus22.ServiceAccountTokenSecret`](#org.cdk8s.plus22.ServiceAccountTokenSecret), [`org.cdk8s.plus22.SshAuthSecret`](#org.cdk8s.plus22.SshAuthSecret), [`org.cdk8s.plus22.TlsSecret`](#org.cdk8s.plus22.TlsSecret), [`org.cdk8s.plus22.ISecret`](#org.cdk8s.plus22.ISecret)


#### Properties <a name="Properties"></a>

##### `name`<sup>Required</sup> <a name="org.cdk8s.plus22.ISecret.property.name"></a>

```java
public java.lang.String getName();
```

- *Type:* `java.lang.String`

The Kubernetes name of this resource.

---

### IServiceAccount <a name="org.cdk8s.plus22.IServiceAccount"></a>

- *Extends:* [`org.cdk8s.plus22.IResource`](#org.cdk8s.plus22.IResource)

- *Implemented By:* [`org.cdk8s.plus22.ServiceAccount`](#org.cdk8s.plus22.ServiceAccount), [`org.cdk8s.plus22.IServiceAccount`](#org.cdk8s.plus22.IServiceAccount)


#### Properties <a name="Properties"></a>

##### `name`<sup>Required</sup> <a name="org.cdk8s.plus22.IServiceAccount.property.name"></a>

```java
public java.lang.String getName();
```

- *Type:* `java.lang.String`

The Kubernetes name of this resource.

---

### IStorage <a name="org.cdk8s.plus22.IStorage"></a>

- *Implemented By:* [`org.cdk8s.plus22.AwsElasticBlockStorePersistentVolume`](#org.cdk8s.plus22.AwsElasticBlockStorePersistentVolume), [`org.cdk8s.plus22.AzureDiskPersistentVolume`](#org.cdk8s.plus22.AzureDiskPersistentVolume), [`org.cdk8s.plus22.GCEPersistentDiskPersistentVolume`](#org.cdk8s.plus22.GCEPersistentDiskPersistentVolume), [`org.cdk8s.plus22.PersistentVolume`](#org.cdk8s.plus22.PersistentVolume), [`org.cdk8s.plus22.Volume`](#org.cdk8s.plus22.Volume), [`org.cdk8s.plus22.IStorage`](#org.cdk8s.plus22.IStorage)

Represents a piece of storage in the cluster.

#### Methods <a name="Methods"></a>

##### `asVolume` <a name="org.cdk8s.plus22.IStorage.asVolume"></a>

```java
public asVolume()
```


## Enums <a name="Enums"></a>

### AzureDiskPersistentVolumeCachingMode <a name="AzureDiskPersistentVolumeCachingMode"></a>

Azure disk caching modes.

#### `NONE` <a name="org.cdk8s.plus22.AzureDiskPersistentVolumeCachingMode.NONE"></a>

None.

---


#### `READ_ONLY` <a name="org.cdk8s.plus22.AzureDiskPersistentVolumeCachingMode.READ_ONLY"></a>

ReadOnly.

---


#### `READ_WRITE` <a name="org.cdk8s.plus22.AzureDiskPersistentVolumeCachingMode.READ_WRITE"></a>

ReadWrite.

---


### AzureDiskPersistentVolumeKind <a name="AzureDiskPersistentVolumeKind"></a>

Azure Disk kinds.

#### `SHARED` <a name="org.cdk8s.plus22.AzureDiskPersistentVolumeKind.SHARED"></a>

Multiple blob disks per storage account.

---


#### `DEDICATED` <a name="org.cdk8s.plus22.AzureDiskPersistentVolumeKind.DEDICATED"></a>

Single blob disk per storage account.

---


#### `MANAGED` <a name="org.cdk8s.plus22.AzureDiskPersistentVolumeKind.MANAGED"></a>

Azure managed data disk.

---


### EmptyDirMedium <a name="EmptyDirMedium"></a>

The medium on which to store the volume.

#### `DEFAULT` <a name="org.cdk8s.plus22.EmptyDirMedium.DEFAULT"></a>

The default volume of the backing node.

---


#### `MEMORY` <a name="org.cdk8s.plus22.EmptyDirMedium.MEMORY"></a>

Mount a tmpfs (RAM-backed filesystem) for you instead.

While tmpfs is very
fast, be aware that unlike disks, tmpfs is cleared on node reboot and any
files you write will count against your Container's memory limit.

---


### EnvFieldPaths <a name="EnvFieldPaths"></a>

#### `POD_NAME` <a name="org.cdk8s.plus22.EnvFieldPaths.POD_NAME"></a>

The name of the pod.

---


#### `POD_NAMESPACE` <a name="org.cdk8s.plus22.EnvFieldPaths.POD_NAMESPACE"></a>

The namespace of the pod.

---


#### `POD_UID` <a name="org.cdk8s.plus22.EnvFieldPaths.POD_UID"></a>

The uid of the pod.

---


#### `POD_LABEL` <a name="org.cdk8s.plus22.EnvFieldPaths.POD_LABEL"></a>

The labels of the pod.

---


#### `POD_ANNOTATION` <a name="org.cdk8s.plus22.EnvFieldPaths.POD_ANNOTATION"></a>

The annotations of the pod.

---


#### `POD_IP` <a name="org.cdk8s.plus22.EnvFieldPaths.POD_IP"></a>

The ipAddress of the pod.

---


#### `SERVICE_ACCOUNT_NAME` <a name="org.cdk8s.plus22.EnvFieldPaths.SERVICE_ACCOUNT_NAME"></a>

The service account name of the pod.

---


#### `NODE_NAME` <a name="org.cdk8s.plus22.EnvFieldPaths.NODE_NAME"></a>

The name of the node.

---


#### `NODE_IP` <a name="org.cdk8s.plus22.EnvFieldPaths.NODE_IP"></a>

The ipAddress of the node.

---


#### `POD_IPS` <a name="org.cdk8s.plus22.EnvFieldPaths.POD_IPS"></a>

The ipAddresess of the pod.

---


### FsGroupChangePolicy <a name="FsGroupChangePolicy"></a>

#### `ON_ROOT_MISMATCH` <a name="org.cdk8s.plus22.FsGroupChangePolicy.ON_ROOT_MISMATCH"></a>

Only change permissions and ownership if permission and ownership of root directory does not match with expected permissions of the volume.

This could help shorten the time it takes to change ownership and permission of a volume

---


#### `ALWAYS` <a name="org.cdk8s.plus22.FsGroupChangePolicy.ALWAYS"></a>

Always change permission and ownership of the volume when volume is mounted.

---


### HttpIngressPathType <a name="HttpIngressPathType"></a>

Specify how the path is matched against request paths.

> https://kubernetes.io/docs/concepts/services-networking/ingress/#path-types

#### `PREFIX` <a name="org.cdk8s.plus22.HttpIngressPathType.PREFIX"></a>

Matches the URL path exactly.

---


#### `EXACT` <a name="org.cdk8s.plus22.HttpIngressPathType.EXACT"></a>

Matches based on a URL path prefix split by '/'.

---


#### `IMPLEMENTATION_SPECIFIC` <a name="org.cdk8s.plus22.HttpIngressPathType.IMPLEMENTATION_SPECIFIC"></a>

Matching is specified by the underlying IngressClass.

---


### ImagePullPolicy <a name="ImagePullPolicy"></a>

#### `ALWAYS` <a name="org.cdk8s.plus22.ImagePullPolicy.ALWAYS"></a>

Every time the kubelet launches a container, the kubelet queries the container image registry to resolve the name to an image digest.

If the kubelet has a container image with that exact
digest cached locally, the kubelet uses its cached image; otherwise, the kubelet downloads
(pulls) the image with the resolved digest, and uses that image to launch the container.

Default is Always if ImagePullPolicy is omitted and either the image tag is :latest or
the image tag is omitted.

---


#### `IF_NOT_PRESENT` <a name="org.cdk8s.plus22.ImagePullPolicy.IF_NOT_PRESENT"></a>

The image is pulled only if it is not already present locally.

Default is IfNotPresent if ImagePullPolicy is omitted and the image tag is present but
not :latest

---


#### `NEVER` <a name="org.cdk8s.plus22.ImagePullPolicy.NEVER"></a>

The image is assumed to exist locally.

No attempt is made to pull the image.

---


### MountPropagation <a name="MountPropagation"></a>

#### `NONE` <a name="org.cdk8s.plus22.MountPropagation.NONE"></a>

This volume mount will not receive any subsequent mounts that are mounted to this volume or any of its subdirectories by the host.

In similar
fashion, no mounts created by the Container will be visible on the host.

This is the default mode.

This mode is equal to `private` mount propagation as described in the Linux
kernel documentation

---


#### `HOST_TO_CONTAINER` <a name="org.cdk8s.plus22.MountPropagation.HOST_TO_CONTAINER"></a>

This volume mount will receive all subsequent mounts that are mounted to this volume or any of its subdirectories.

In other words, if the host mounts anything inside the volume mount, the
Container will see it mounted there.

Similarly, if any Pod with Bidirectional mount propagation to the same
volume mounts anything there, the Container with HostToContainer mount
propagation will see it.

This mode is equal to `rslave` mount propagation as described in the Linux
kernel documentation

---


#### `BIDIRECTIONAL` <a name="org.cdk8s.plus22.MountPropagation.BIDIRECTIONAL"></a>

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

#### `READ_WRITE_ONCE` <a name="org.cdk8s.plus22.PersistentVolumeAccessMode.READ_WRITE_ONCE"></a>

The volume can be mounted as read-write by a single node.

ReadWriteOnce access mode still can allow multiple pods to access
the volume when the pods are running on the same node.

---


#### `READ_ONLY_MANY` <a name="org.cdk8s.plus22.PersistentVolumeAccessMode.READ_ONLY_MANY"></a>

The volume can be mounted as read-only by many nodes.

---


#### `READ_WRITE_MANY` <a name="org.cdk8s.plus22.PersistentVolumeAccessMode.READ_WRITE_MANY"></a>

The volume can be mounted as read-write by many nodes.

---


#### `READ_WRITE_ONCE_POD` <a name="org.cdk8s.plus22.PersistentVolumeAccessMode.READ_WRITE_ONCE_POD"></a>

The volume can be mounted as read-write by a single Pod.

Use ReadWriteOncePod access mode if you want to ensure that
only one pod across whole cluster can read that PVC or write to it.
This is only supported for CSI volumes and Kubernetes version 1.22+.

---


### PersistentVolumeMode <a name="PersistentVolumeMode"></a>

Volume Modes.

#### `FILE_SYSTEM` <a name="org.cdk8s.plus22.PersistentVolumeMode.FILE_SYSTEM"></a>

Volume is ounted into Pods into a directory.

If the volume is backed by a block device and the device is empty,
Kubernetes creates a filesystem on the device before mounting it
for the first time.

---


#### `BLOCK` <a name="org.cdk8s.plus22.PersistentVolumeMode.BLOCK"></a>

Use a volume as a raw block device.

Such volume is presented into a Pod as a block device,
without any filesystem on it. This mode is useful to provide a Pod the fastest possible way
to access a volume, without any filesystem layer between the Pod
and the volume. On the other hand, the application running in
the Pod must know how to handle a raw block device

---


### PersistentVolumeReclaimPolicy <a name="PersistentVolumeReclaimPolicy"></a>

Reclaim Policies.

#### `RETAIN` <a name="org.cdk8s.plus22.PersistentVolumeReclaimPolicy.RETAIN"></a>

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


#### `DELETE` <a name="org.cdk8s.plus22.PersistentVolumeReclaimPolicy.DELETE"></a>

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

#### `ORDERED_READY` <a name="org.cdk8s.plus22.PodManagementPolicy.ORDERED_READY"></a>

---


#### `PARALLEL` <a name="org.cdk8s.plus22.PodManagementPolicy.PARALLEL"></a>

---


### Protocol <a name="Protocol"></a>

#### `TCP` <a name="org.cdk8s.plus22.Protocol.TCP"></a>

---


#### `UDP` <a name="org.cdk8s.plus22.Protocol.UDP"></a>

---


#### `SCTP` <a name="org.cdk8s.plus22.Protocol.SCTP"></a>

---


### ResourceFieldPaths <a name="ResourceFieldPaths"></a>

#### `CPU_LIMIT` <a name="org.cdk8s.plus22.ResourceFieldPaths.CPU_LIMIT"></a>

CPU limit of the container.

---


#### `MEMORY_LIMIT` <a name="org.cdk8s.plus22.ResourceFieldPaths.MEMORY_LIMIT"></a>

Memory limit of the container.

---


#### `CPU_REQUEST` <a name="org.cdk8s.plus22.ResourceFieldPaths.CPU_REQUEST"></a>

CPU request of the container.

---


#### `MEMORY_REQUEST` <a name="org.cdk8s.plus22.ResourceFieldPaths.MEMORY_REQUEST"></a>

Memory request of the container.

---


#### `STORAGE_LIMIT` <a name="org.cdk8s.plus22.ResourceFieldPaths.STORAGE_LIMIT"></a>

Ephemeral storage limit of the container.

---


#### `STORAGE_REQUEST` <a name="org.cdk8s.plus22.ResourceFieldPaths.STORAGE_REQUEST"></a>

Ephemeral storage request of the container.

---


### RestartPolicy <a name="RestartPolicy"></a>

Restart policy for all containers within the pod.

#### `ALWAYS` <a name="org.cdk8s.plus22.RestartPolicy.ALWAYS"></a>

Always restart the pod after it exits.

---


#### `ON_FAILURE` <a name="org.cdk8s.plus22.RestartPolicy.ON_FAILURE"></a>

Only restart if the pod exits with a non-zero exit code.

---


#### `NEVER` <a name="org.cdk8s.plus22.RestartPolicy.NEVER"></a>

Never restart the pod.

---


### ServiceType <a name="ServiceType"></a>

For some parts of your application (for example, frontends) you may want to expose a Service onto an external IP address, that's outside of your cluster.

Kubernetes ServiceTypes allow you to specify what kind of Service you want.
The default is ClusterIP.

#### `CLUSTER_IP` <a name="org.cdk8s.plus22.ServiceType.CLUSTER_IP"></a>

Exposes the Service on a cluster-internal IP.

Choosing this value makes the Service only reachable from within the cluster.
This is the default ServiceType

---


#### `NODE_PORT` <a name="org.cdk8s.plus22.ServiceType.NODE_PORT"></a>

Exposes the Service on each Node's IP at a static port (the NodePort).

A ClusterIP Service, to which the NodePort Service routes, is automatically created.
You'll be able to contact the NodePort Service, from outside the cluster,
by requesting <NodeIP>:<NodePort>.

---


#### `LOAD_BALANCER` <a name="org.cdk8s.plus22.ServiceType.LOAD_BALANCER"></a>

Exposes the Service externally using a cloud provider's load balancer.

NodePort and ClusterIP Services, to which the external load balancer routes,
are automatically created.

---


#### `EXTERNAL_NAME` <a name="org.cdk8s.plus22.ServiceType.EXTERNAL_NAME"></a>

Maps the Service to the contents of the externalName field (e.g. foo.bar.example.com), by returning a CNAME record with its value. No proxying of any kind is set up.

> Note: You need either kube-dns version 1.7 or CoreDNS version 0.0.8 or higher to use the ExternalName type.

---

