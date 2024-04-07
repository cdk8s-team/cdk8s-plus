# ConfigMap

ConfigMap are used to store configuration data. They provide a dictionary based
data structure that can be consumed in various shapes and forms.

!!! tip ""
    [API Reference](../../reference/cdk8s-plus-28/typescript.md#configmap)

## Use an existing `ConfigMap`

You can reference to an existing `ConfigMap` like so. Note that this does not create a new object,
and will therefore not be included in the resulting manifest.

```typescript
import * as kplus from 'cdk8s-plus-28';
import { Construct } from 'constructs';
import { App, Chart, ChartProps } from 'cdk8s';

export class MyChart extends Chart {
  constructor(scope: Construct, id: string, props?: ChartProps) {
    super(scope, id, props);

    const config: kplus.IConfigMap = kplus.ConfigMap.fromConfigMapName(this, 'ConfigMap', 'config');

    // the 'config' constant can later be used by API's that require an IConfigMap.
    // for example when creating a volume.
    kplus.Volume.fromConfigMap(this, 'Volume', config);
  }
}

const app = new App();
new MyChart(app, 'VolumeFromConfigMap');
app.synth();
```

## Adding data

You can create config maps and add some data to them like so:

```typescript
import * as kplus from 'cdk8s-plus-28';
import { Construct } from 'constructs';
import { App, Chart, ChartProps } from 'cdk8s';

export class MyChart extends Chart {
  constructor(scope: Construct, id: string, props?: ChartProps) {
    super(scope, id, props);

    const config = new kplus.ConfigMap(this, 'Config');
    config.addData('url', 'https://my-endpoint:8080');
  }
}

const app = new App();
new MyChart(app, 'ConfigMap');
app.synth();
```

## Creating a volume from a directory

Here is a nifty little trick you can use to create a volume that contains a directory on the client machine (machine that runs `cdk8s synth`):

```typescript
import * as kplus from 'cdk8s-plus-28';
import * as path from 'path';
import { Construct } from 'constructs';
import { App, Chart, ChartProps } from 'cdk8s';

export class MyChart extends Chart {
  constructor(scope: Construct, id: string, props?: ChartProps) {
    super(scope, id, props);
    const appMap = new kplus.ConfigMap(this, 'Config');

    // add the files in the directory to the config map.
    // this will create a key for each file.
    // note: this directory needs to exist
    // note: that only top level files will be included, sub-directories are not yet supported.
    appMap.addDirectory(path.join(__dirname, 'app'));

    const appVolume = kplus.Volume.fromConfigMap(this, 'ConfigMap', appMap);

    const mountPath = '/var/app';
    const pod = new kplus.Pod(this, 'Pod');
    const container = pod.addContainer({
      image: 'node',
      command: [ 'node', 'app.js' ],
      workingDir: mountPath,
    });

    // from here, just mount the volume to a container, and run your app!
    container.mount(mountPath, appVolume);
  }
}

const app = new App();
new MyChart(app, 'AppWithDir');
app.synth();
```
