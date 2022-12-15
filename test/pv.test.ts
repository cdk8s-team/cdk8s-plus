import * as cdk8s from 'cdk8s';
import { Testing } from 'cdk8s';
import * as kplus from '../src';

describe('PersistentVolume', () => {

  test('can grant permissions on imported', () => {

    const chart = Testing.chart();
    const pv = kplus.PersistentVolume.fromPersistentVolumeName(chart, 'Vol', 'vol');

    const role = new kplus.Role(chart, 'Role');
    role.allowRead(pv);

    expect(Testing.synth(chart)).toMatchSnapshot();

  });

  test('defaults', () => {

    const chart = cdk8s.Testing.chart();
    const vol = new kplus.AwsElasticBlockStorePersistentVolume(chart, 'Volume', {
      volumeId: 'vol1',
    });

    expect(vol.accessModes).toBeUndefined();
    expect(vol.reclaimPolicy).toEqual(kplus.PersistentVolumeReclaimPolicy.RETAIN);
    expect(vol.storage).toBeUndefined();
    expect(vol.storageClassName).toBeUndefined();
    expect(vol.mode).toEqual(kplus.PersistentVolumeMode.FILE_SYSTEM);
    expect(vol.mountOptions).toBeUndefined();

    const resources = cdk8s.Testing.synth(chart);
    expect(resources).toMatchSnapshot();

  });

  test('custom', () => {

    const chart = cdk8s.Testing.chart();
    const vol = new kplus.AwsElasticBlockStorePersistentVolume(chart, 'Volume', {
      accessModes: [kplus.PersistentVolumeAccessMode.READ_ONLY_MANY, kplus.PersistentVolumeAccessMode.READ_WRITE_MANY],
      mountOptions: ['opt1'],
      reclaimPolicy: kplus.PersistentVolumeReclaimPolicy.DELETE,
      volumeMode: kplus.PersistentVolumeMode.BLOCK,
      storageClassName: 'storage-class',
      storage: cdk8s.Size.gibibytes(50),
      volumeId: 'vol1',
    });

    // base props
    expect(vol.accessModes).toEqual([kplus.PersistentVolumeAccessMode.READ_ONLY_MANY, kplus.PersistentVolumeAccessMode.READ_WRITE_MANY]);
    expect(vol.reclaimPolicy).toEqual(kplus.PersistentVolumeReclaimPolicy.DELETE);
    expect(vol.storage).toEqual(cdk8s.Size.gibibytes(50));
    expect(vol.storageClassName).toEqual('storage-class');
    expect(vol.mode).toEqual(kplus.PersistentVolumeMode.BLOCK);
    expect(vol.mountOptions).toEqual(['opt1']);

    const resources = cdk8s.Testing.synth(chart);
    expect(resources).toMatchSnapshot();

  });

  test('can be imported', () => {

    const chart = Testing.chart();
    const pv = kplus.PersistentVolume.fromPersistentVolumeName(chart, 'Vol', 'vol');
    expect(pv.name).toEqual('vol');

  });

  test('can be reserved with default storage class', () => {

    const chart = cdk8s.Testing.chart();
    const vol = new kplus.AwsElasticBlockStorePersistentVolume(chart, 'Volume', {
      volumeId: 'vol1',
    });

    const claim = vol.reserve();

    expect(claim.accessModes).toBeUndefined();
    expect(claim.storage).toBeUndefined();
    expect(claim.storageClassName).toEqual(vol.storageClassName);

    // validate bi-directional binding
    expect(claim.volume!.name).toEqual(vol.name);
    expect(vol.claim!.name).toEqual(claim.name);

    const resources = cdk8s.Testing.synth(chart);
    expect(resources).toMatchSnapshot();

  });

  test('can be reserved with a custom storage class', () => {

    const chart = cdk8s.Testing.chart();
    const vol = new kplus.AwsElasticBlockStorePersistentVolume(chart, 'Volume', {
      volumeId: 'vol1',
      storageClassName: 'storage-class',
    });

    const claim = vol.reserve();

    expect(claim.accessModes).toBeUndefined();
    expect(claim.storage).toBeUndefined();
    expect(claim.storageClassName).toEqual(vol.storageClassName);

    // validate bi-directional binding
    expect(claim.volume!.name).toEqual(vol.name);
    expect(vol.claim!.name).toEqual(claim.name);

    const resources = cdk8s.Testing.synth(chart);
    expect(resources).toMatchSnapshot();

  });

  test('reserved claim is created in the same namespace as the volume', () => {

    const chart = cdk8s.Testing.chart();
    const vol = new kplus.AwsElasticBlockStorePersistentVolume(chart, 'Volume', {
      metadata: { namespace: 'non-default' },
      volumeId: 'vol1',
    });

    const claim = vol.reserve();
    expect(claim.metadata.namespace).toEqual(vol.metadata.namespace);

  });

  test('throws if reserved twice', () => {

    const chart = cdk8s.Testing.chart();
    const vol = new kplus.AwsElasticBlockStorePersistentVolume(chart, 'Volume', {
      volumeId: 'vol1',
    });

    vol.reserve();

    expect(() => vol.reserve()).toThrowError(/There is already a Construct with name 'test-volume-c8db061ePVC'/);

  });

  test('can be bound to a claim at instantiation', () => {

    const chart = cdk8s.Testing.chart();
    const pvc = kplus.PersistentVolumeClaim.fromClaimName(chart, 'Claim', 'claim');
    const vol = new kplus.AwsElasticBlockStorePersistentVolume(chart, 'Volume', {
      volumeId: 'vol1',
      claim: pvc,
    });

    expect(vol.claim!.name).toEqual(pvc.name);

    const resources = cdk8s.Testing.synth(chart);
    expect(resources).toMatchSnapshot();

  });

  test('can be bound to a claim post instantiation', () => {

    const chart = cdk8s.Testing.chart();
    const pvc = kplus.PersistentVolumeClaim.fromClaimName(chart, 'Claim', 'claim');
    const vol = new kplus.AwsElasticBlockStorePersistentVolume(chart, 'Volume', {
      volumeId: 'vol1',
    });

    vol.bind(pvc);

    expect(vol.claim!.name).toEqual(pvc.name);

    const resources = cdk8s.Testing.synth(chart);
    expect(resources).toMatchSnapshot();

  });

  test('no-ops if bounded twice to the same claim', () => {

    const chart = cdk8s.Testing.chart();
    const pvc = kplus.PersistentVolumeClaim.fromClaimName(chart, 'Claim', 'claim');
    const vol = new kplus.AwsElasticBlockStorePersistentVolume(chart, 'Volume', {
      volumeId: 'vol1',
    });

    vol.bind(pvc);
    vol.bind(pvc);

    expect(vol.claim!.name).toEqual(pvc.name);

  });

  test('throws if bounded twice to different claims', () => {

    const chart = cdk8s.Testing.chart();
    const pvc1 = kplus.PersistentVolumeClaim.fromClaimName(chart, 'Claim1', 'claim1');
    const pvc2 = kplus.PersistentVolumeClaim.fromClaimName(chart, 'Claim2', 'claim2');
    const vol = new kplus.AwsElasticBlockStorePersistentVolume(chart, 'Volume', {
      volumeId: 'vol1',
    });

    vol.bind(pvc1);

    expect(() => vol.bind(pvc2)).toThrowError('Cannot bind volume \'test-volume-c8db061e\' to claim \'claim2\' since it is already bound to claim \'claim1\'');

  });

});

describe('AwsElasticBlockStorePersistentVolume', () => {

  test('defaults', () => {

    const chart = cdk8s.Testing.chart();
    const vol = new kplus.AwsElasticBlockStorePersistentVolume(chart, 'Volume', {
      volumeId: 'vol1',
    });

    expect(vol.volumeId).toEqual('vol1');
    expect(vol.fsType).toEqual('ext4');
    expect(vol.partition).toBeUndefined();
    expect(vol.readOnly).toBeFalsy();

    const resources = cdk8s.Testing.synth(chart);
    expect(resources).toMatchSnapshot();

  });

  test('custom', () => {

    const chart = cdk8s.Testing.chart();
    const vol = new kplus.AwsElasticBlockStorePersistentVolume(chart, 'Volume', {
      volumeId: 'vol1',
      partition: 1,
      readOnly: true,
      fsType: 'ntfs',
    });

    expect(vol.volumeId).toEqual('vol1');
    expect(vol.fsType).toEqual('ntfs');
    expect(vol.partition).toEqual(1);
    expect(vol.readOnly).toBeTruthy();

    const resources = cdk8s.Testing.synth(chart);
    expect(resources).toMatchSnapshot();

  });

});

describe('AzureDiskPersistentVolume', () => {

  test('defaults', () => {

    const chart = cdk8s.Testing.chart();
    const vol = new kplus.AzureDiskPersistentVolume(chart, 'Volume', {
      diskName: 'name',
      diskUri: 'uri',
    });

    expect(vol.diskName).toEqual('name');
    expect(vol.diskUri).toEqual('uri');
    expect(vol.cachingMode).toEqual(kplus.AzureDiskPersistentVolumeCachingMode.NONE);
    expect(vol.readOnly).toBeFalsy();
    expect(vol.fsType).toEqual('ext4');
    expect(vol.azureKind).toEqual(kplus.AzureDiskPersistentVolumeKind.SHARED);

    const resources = cdk8s.Testing.synth(chart);
    expect(resources).toMatchSnapshot();

  });

  test('custom', () => {

    const chart = cdk8s.Testing.chart();
    const vol = new kplus.AzureDiskPersistentVolume(chart, 'Volume', {
      diskName: 'name',
      diskUri: 'uri',
      cachingMode: kplus.AzureDiskPersistentVolumeCachingMode.READ_ONLY,
      readOnly: true,
      fsType: 'ntfs',
      kind: kplus.AzureDiskPersistentVolumeKind.DEDICATED,
    });

    expect(vol.diskName).toEqual('name');
    expect(vol.diskUri).toEqual('uri');
    expect(vol.cachingMode).toEqual(kplus.AzureDiskPersistentVolumeCachingMode.READ_ONLY);
    expect(vol.readOnly).toBeTruthy();
    expect(vol.fsType).toEqual('ntfs');
    expect(vol.azureKind).toEqual(kplus.AzureDiskPersistentVolumeKind.DEDICATED);

    const resources = cdk8s.Testing.synth(chart);
    expect(resources).toMatchSnapshot();

  });

});

describe('GCEPersistentDiskPersistentVolume', () => {

  test('defaults', () => {

    const chart = cdk8s.Testing.chart();
    const vol = new kplus.GCEPersistentDiskPersistentVolume(chart, 'Volume', {
      pdName: 'name',
    });

    expect(vol.pdName).toEqual('name');
    expect(vol.partition).toBeUndefined();
    expect(vol.readOnly).toBeFalsy();
    expect(vol.fsType).toEqual('ext4');

    const resources = cdk8s.Testing.synth(chart);
    expect(resources).toMatchSnapshot();

  });

  test('custom', () => {

    const chart = cdk8s.Testing.chart();
    const vol = new kplus.GCEPersistentDiskPersistentVolume(chart, 'Volume', {
      pdName: 'name',
      partition: 1,
      readOnly: true,
      fsType: 'ntfs',
    });

    expect(vol.pdName).toEqual('name');
    expect(vol.partition).toEqual(1);
    expect(vol.readOnly).toBeTruthy();
    expect(vol.fsType).toEqual('ntfs');

    const resources = cdk8s.Testing.synth(chart);
    expect(resources).toMatchSnapshot();

  });

});
