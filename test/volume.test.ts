import { Testing, Size } from 'cdk8s';
import { Volume, ConfigMap, EmptyDirMedium, Secret, PersistentVolumeClaim, AzureDiskPersistentVolumeCachingMode, AzureDiskPersistentVolumeKind } from '../src';

describe('fromSecret', () => {
  test('minimal definition', () => {
    // GIVEN
    const chart = Testing.chart();
    const secret = new Secret(chart, 'my-secret');

    // WHEN
    const vol = Volume.fromSecret(secret);

    // THEN
    expect(vol._toKube()).toMatchInlineSnapshot(`
      Object {
        "name": "secret-test-my-secret-c8a71744",
        "secret": Object {
          "defaultMode": undefined,
          "items": undefined,
          "optional": undefined,
          "secretName": "test-my-secret-c8a71744",
        },
      }
    `);
  });

  test('custom volume name', () => {
    // GIVEN
    const chart = Testing.chart();
    const secret = new Secret(chart, 'my-secret');

    // WHEN
    const vol = Volume.fromSecret(secret, {
      name: 'filesystem',
    });

    // THEN
    expect(vol._toKube().name).toBe('filesystem');
    expect(vol._toKube().secret?.secretName).toBe('test-my-secret-c8a71744');
  });

  test('default mode', () => {
    // GIVEN
    const chart = Testing.chart();
    const secret = new Secret(chart, 'my-secret');

    // WHEN
    const vol = Volume.fromSecret(secret, {
      defaultMode: 0o777,
    });

    // THEN
    expect(vol._toKube().secret?.defaultMode).toBe(0o777);
  });

  test('optional', () => {
    // GIVEN
    const chart = Testing.chart();
    const secret = new Secret(chart, 'my-secret');

    // WHEN
    const vol0 = Volume.fromSecret(secret);
    const vol1 = Volume.fromSecret(secret, { optional: true });
    const vol2 = Volume.fromSecret(secret, { optional: false });

    // THEN
    expect(vol0._toKube().secret?.optional).toBe(undefined);
    expect(vol1._toKube().secret?.optional).toBe(true);
    expect(vol2._toKube().secret?.optional).toBe(false);
  });

  test('items', () => {
    // GIVEN
    const chart = Testing.chart();
    const secret = new Secret(chart, 'my-secret');

    // WHEN
    const vol = Volume.fromSecret(secret, {
      items: {
        key1: { path: 'path/to/key1' },
        key2: { path: 'path/key2', mode: 0o100 },
      },
    });

    // THEN
    expect(vol._toKube().secret?.items?.[0]).toStrictEqual({
      key: 'key1',
      mode: undefined,
      path: 'path/to/key1',
    });
    expect(vol._toKube().secret?.items?.[1]).toStrictEqual({
      key: 'key2',
      mode: 0o100,
      path: 'path/key2',
    });
  });

  test('items are sorted by key for deterministic synthesis', () => {
    // GIVEN
    const chart = Testing.chart();
    const secret = new Secret(chart, 'my-secret');

    // WHEN
    const vol = Volume.fromSecret(secret, {
      items: {
        key2: { path: 'path2' },
        key1: { path: 'path1' },
      },
    });

    // THEN
    expect(vol._toKube().secret?.items?.[0]).toStrictEqual({
      key: 'key1',
      mode: undefined,
      path: 'path1',
    });
    expect(vol._toKube().secret?.items?.[1]).toStrictEqual({
      key: 'key2',
      mode: undefined,
      path: 'path2',
    });
  });
});

describe('fromConfigMap', () => {
  test('minimal definition', () => {
    // GIVEN
    const chart = Testing.chart();
    const configMap = new ConfigMap(chart, 'my-config-map');

    // WHEN
    const vol = Volume.fromConfigMap(configMap);

    // THEN
    expect(vol._toKube()).toMatchInlineSnapshot(`
      Object {
        "configMap": Object {
          "defaultMode": undefined,
          "items": undefined,
          "name": "test-my-config-map-c8eaefa4",
          "optional": undefined,
        },
        "name": "configmap-test-my-config-map-c8eaefa4",
      }
    `);
  });

  test('custom volume name', () => {
    // GIVEN
    const chart = Testing.chart();
    const configMap = new ConfigMap(chart, 'my-config-map');

    // WHEN
    const vol = Volume.fromConfigMap(configMap, {
      name: 'filesystem',
    });

    // THEN
    expect(vol._toKube().name).toBe('filesystem');
    expect(vol._toKube().configMap?.name).toBe('test-my-config-map-c8eaefa4');
  });

  test('default mode', () => {
    // GIVEN
    const chart = Testing.chart();
    const configMap = new ConfigMap(chart, 'my-config-map');

    // WHEN
    const vol = Volume.fromConfigMap(configMap, {
      defaultMode: 0o777,
    });

    // THEN
    expect(vol._toKube().configMap?.defaultMode).toBe(0o777);
  });

  test('optional', () => {
    // GIVEN
    const chart = Testing.chart();
    const configMap = new ConfigMap(chart, 'my-config-map');

    // WHEN
    const vol0 = Volume.fromConfigMap(configMap);
    const vol1 = Volume.fromConfigMap(configMap, { optional: true });
    const vol2 = Volume.fromConfigMap(configMap, { optional: false });

    // THEN
    expect(vol0._toKube().configMap?.optional).toBe(undefined);
    expect(vol1._toKube().configMap?.optional).toBe(true);
    expect(vol2._toKube().configMap?.optional).toBe(false);
  });

  test('items', () => {
    // GIVEN
    const chart = Testing.chart();
    const configMap = new ConfigMap(chart, 'my-config-map');

    // WHEN
    const vol = Volume.fromConfigMap(configMap, {
      items: {
        key1: { path: 'path/to/key1' },
        key2: { path: 'path/key2', mode: 0o100 },
      },
    });

    // THEN
    expect(vol._toKube().configMap?.items?.[0]).toStrictEqual({
      key: 'key1',
      mode: undefined,
      path: 'path/to/key1',
    });
    expect(vol._toKube().configMap?.items?.[1]).toStrictEqual({
      key: 'key2',
      mode: 0o100,
      path: 'path/key2',
    });
  });

  test('items are sorted by key for determinstic synthesis', () => {
    // GIVEN
    const chart = Testing.chart();
    const configMap = new ConfigMap(chart, 'my-config-map');

    // WHEN
    const vol = Volume.fromConfigMap(configMap, {
      items: {
        key2: { path: 'path2' },
        key1: { path: 'path1' },
      },
    });

    // THEN
    expect(vol._toKube().configMap?.items?.[0]).toStrictEqual({
      key: 'key1',
      mode: undefined,
      path: 'path1',
    });
    expect(vol._toKube().configMap?.items?.[1]).toStrictEqual({
      key: 'key2',
      mode: undefined,
      path: 'path2',
    });
  });
});

describe('fromEmptyDir', () => {
  test('minimal definition', () => {
    // GIVEN
    const vol = Volume.fromEmptyDir('main');

    // THEN
    expect(vol._toKube()).toStrictEqual({
      name: 'main',
      emptyDir: {
        medium: undefined,
        sizeLimit: undefined,
      },
    });
  });

  test('default medium', () => {
    const vol = Volume.fromEmptyDir('main', { medium: EmptyDirMedium.DEFAULT });
    expect(vol._toKube().emptyDir?.medium).toEqual('');
  });

  test('memory medium', () => {
    const vol = Volume.fromEmptyDir('main', { medium: EmptyDirMedium.MEMORY });
    expect(vol._toKube().emptyDir?.medium).toEqual('Memory');
  });

  test('size limit', () => {
    const vol = Volume.fromEmptyDir('main', { sizeLimit: Size.gibibytes(20) });
    expect(vol._toKube().emptyDir!.sizeLimit!.value).toEqual('20480Mi');
  });
});

describe('fromPersistentVolumeClaim', () => {

  test('defaults', () => {

    const pvc = PersistentVolumeClaim.fromClaimName('claim');
    const volume = Volume.fromPersistentVolumeClaim(pvc);

    expect(volume.name).toEqual('pvc-claim');
    expect(volume._toKube()).toEqual({
      name: volume.name,
      persistentVolumeClaim: {
        claimName: pvc.name,
        readOnly: false,
      },
    });
  });

  test('custom', () => {

    const pvc = PersistentVolumeClaim.fromClaimName('claim');
    const volume = Volume.fromPersistentVolumeClaim(pvc, {
      name: 'custom',
      readOnly: true,
    });

    expect(volume.name).toEqual('custom');
    expect(volume._toKube()).toEqual({
      name: volume.name,
      persistentVolumeClaim: {
        claimName: pvc.name,
        readOnly: true,
      },
    });
  });

});

describe('fromAwsElasticBlockStore', () => {

  test('defaults', () => {

    const volume = Volume.fromAwsElasticBlockStore('vol');
    const spec = volume._toKube();
    expect(spec).toEqual({
      name: 'ebs-vol',
      awsElasticBlockStore: {
        fsType: 'ext4',
        readOnly: false,
        volumeId: 'vol',
      },
    });

  });

  test('custom', () => {

    const volume = Volume.fromAwsElasticBlockStore('vol', {
      fsType: 'fs',
      name: 'name',
      partition: 1,
      readOnly: true,
    });
    const spec = volume._toKube();
    expect(spec).toEqual({
      name: 'name',
      awsElasticBlockStore: {
        fsType: 'fs',
        readOnly: true,
        volumeId: 'vol',
        partition: 1,
      },
    });

  });

});

describe('fromGcePersistentDisk', () => {

  test('defaults', () => {

    const volume = Volume.fromGcePersistentDisk('pd');
    const spec = volume._toKube();
    expect(spec).toEqual({
      name: 'gcedisk-pd',
      gcePersistentDisk: {
        fsType: 'ext4',
        pdName: 'pd',
        readOnly: false,
      },
    });

  });

  test('custom', () => {

    const volume = Volume.fromGcePersistentDisk('pd', {
      fsType: 'fs',
      name: 'name',
      partition: 1,
      readOnly: true,
    });
    const spec = volume._toKube();
    expect(spec).toEqual({
      name: 'name',
      gcePersistentDisk: {
        fsType: 'fs',
        pdName: 'pd',
        readOnly: true,
        partition: 1,
      },
    });

  });

});

describe('fromAzureDisk', () => {

  test('defaults', () => {

    const volume = Volume.fromAzureDisk('disk', 'uri');
    const spec = volume._toKube();
    expect(spec).toEqual({
      name: 'azuredisk-disk',
      azureDisk: {
        cachingMode: 'None',
        diskName: 'disk',
        diskUri: 'uri',
        fsType: 'ext4',
        readOnly: false,
        kind: 'Shared',
      },
    });

  });

  test('custom', () => {

    const volume = Volume.fromAzureDisk('disk', 'uri', {
      cachingMode: AzureDiskPersistentVolumeCachingMode.READ_ONLY,
      fsType: 'fs',
      kind: AzureDiskPersistentVolumeKind.DEDICATED,
      name: 'name',
      readOnly: true,
    });
    const spec = volume._toKube();
    expect(spec).toEqual({
      name: 'name',
      azureDisk: {
        cachingMode: 'ReadOnly',
        diskName: 'disk',
        diskUri: 'uri',
        fsType: 'fs',
        readOnly: true,
        kind: 'Dedicated',
      },
    });

  });

});