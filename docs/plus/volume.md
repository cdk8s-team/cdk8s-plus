# Volume

Volume represents a named volume in a pod that may be accessed by any container in the pod.

!!! tip ""
    [API Reference](../../reference/cdk8s-plus-33/typescript.md#volume)

## Create from a ConfigMap

A very useful operation is to create a volume from a `ConfigMap`. Kubernetes will translate every key in the config map to a file,
who's content is the value of the key.

```typescript
import * as kplus from 'cdk8s-plus-33';

const configMap = kplus.ConfigMap.fromConfigMapName('redis-config');
const configVolume = kplus.Volume.fromConfigMap(configMap);
```

## Create from an EmptyDir

The easiest way to allocate some persistent storage to your container is to create a volume from an empty directory.
This volume, as the name suggests, is initially empty, and can be written to by containers who mount it.
The data in the volume is preserved throughout the lifecycle of the pod, but is deleted forever as soon as the pod itself is removed.

```typescript
import * as kplus from 'cdk8s-plus-33';

const data = kplus.Volume.fromEmptyDir(configMap);

const pod = new kplus.Pod(this, 'Pod');
const redis = pod.addContainer({
  image: 'redis'
})

// mount to the redis container.
redis.mount('/var/lib/redis', data);
```

## Using PersistentVolumeClaim Templates with StatefulSets

When working with StatefulSets, you can use PersistentVolumeClaim templates to create stable storage for each pod in the StatefulSet. This allows each pod to have its own storage that persists even if the pod is rescheduled to a different node.

```typescript
import * as kplus from 'cdk8s-plus-32';
import { Size } from 'cdk8s';

const dataVolume = Volume.fromName(chart, "pvc-template-data", "data-volume")

// Create a StatefulSet with a PVC template
const statefulSet = new kplus.StatefulSet(this, 'StatefulSet', {
  containers: [{
    image: 'nginx',
    volumeMounts: [{
      volume: dataVolume,
      path: '/data',
    }, {
      volume: Volume.fromName(chart, "pvc-template-temp", "temp-volume"),
      path: '/data',
    }],
  }],
  // Define PVC templates during initialization
  volumeClaimTemplates: [{
    name: dataVolume.name,
    storage: Size.gibibytes(10),
    accessModes: [kplus.PersistentVolumeAccessMode.READ_WRITE_ONCE],
    storageClassName: 'standard',  // Optional: Specify the storage class
  }, {
    name: 'temp-volume',  // Must match a volume mount name in a container
    storage: Size.gibibytes(10),
    accessModes: [kplus.PersistentVolumeAccessMode.READ_WRITE_ONCE],
    storageClassName: 'standard',  // Optional: Specify the storage class
  }],
});

// Or add PVC templates after creation
statefulSet.addVolumeClaimTemplate({
  name: 'logs-volume',
  storage: Size.gibibytes(5),
  accessModes: [kplus.PersistentVolumeAccessMode.READ_WRITE_ONCE],
});
```

Each pod in the StatefulSet will get its own PVC instance based on these templates, with names like `data-volume-my-statefulset-0`, `data-volume-my-statefulset-1`, etc.
