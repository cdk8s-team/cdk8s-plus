import { Size, Testing } from 'cdk8s';
import { PersistentVolumeAccessMode, PersistentVolumeClaim, PersistentVolumeMode } from '../src';
import { AwsElasticBlockStorePersistentVolume, AzureDiskPersistentVolume, AzureDiskPersistentVolumeCachingMode, AzureDiskPersistentVolumeKind, PersistentVolumeReclaimPolicy, GCEPersistentDiskPersistentVolume } from '../src/pv';

describe('PersistentVolume', () => {

  test('defaults', () => {

    const chart = Testing.chart();
    const vol = new AwsElasticBlockStorePersistentVolume(chart, 'Volume', {
      volumeId: 'vol1',
    });

    expect(vol.accessModes).toBeUndefined();
    expect(vol.reclaimPolicy).toEqual(PersistentVolumeReclaimPolicy.RETAIN);
    expect(vol.storage).toBeUndefined();
    expect(vol.storageClassName).toBeUndefined();
    expect(vol.mode).toEqual(PersistentVolumeMode.FILE_SYSTEM);
    expect(vol.mountOptions).toBeUndefined();

    const spec = Testing.synth(chart)[0].spec;
    expect(spec).toMatchSnapshot();

  });

  test('custom', () => {

    const chart = Testing.chart();
    const vol = new AwsElasticBlockStorePersistentVolume(chart, 'Volume', {
      accessModes: [PersistentVolumeAccessMode.READ_ONLY_MANY, PersistentVolumeAccessMode.READ_WRITE_MANY],
      mountOptions: ['opt1'],
      reclaimPolicy: PersistentVolumeReclaimPolicy.DELETE,
      volumeMode: PersistentVolumeMode.BLOCK,
      storageClassName: 'storage-class',
      storage: Size.gibibytes(50),
      volumeId: 'vol1',
    });

    // base props
    expect(vol.accessModes).toEqual([PersistentVolumeAccessMode.READ_ONLY_MANY, PersistentVolumeAccessMode.READ_WRITE_MANY]);
    expect(vol.reclaimPolicy).toEqual(PersistentVolumeReclaimPolicy.DELETE);
    expect(vol.storage).toEqual(Size.gibibytes(50));
    expect(vol.storageClassName).toEqual('storage-class');
    expect(vol.mode).toEqual(PersistentVolumeMode.BLOCK);
    expect(vol.mountOptions).toEqual(['opt1']);

    const spec = Testing.synth(chart)[0].spec;
    expect(spec).toMatchSnapshot();

  });

  test('can be reserved', () => {

    const chart = Testing.chart();
    const vol = new AwsElasticBlockStorePersistentVolume(chart, 'Volume', {
      volumeId: 'vol1',
    });

    const claim = vol.reserve();

    expect(claim.accessModes).toEqual(vol.accessModes);
    expect(claim.storage).toEqual(vol.storage);
    expect(claim.storageClassName).toEqual(vol.storageClassName);
    expect(claim.volumeMode).toEqual(vol.mode);

    // validate bi-directional binding
    expect(claim.volume!.name).toEqual(vol.name);
    expect(vol.claim!.name).toEqual(claim.name);

    const resources = Testing.synth(chart);
    expect(resources).toMatchSnapshot();

  });

  test('throws if reserved twice', () => {

    const chart = Testing.chart();
    const vol = new AwsElasticBlockStorePersistentVolume(chart, 'Volume', {
      volumeId: 'vol1',
    });

    vol.reserve();

    expect(() => vol.reserve()).toThrowError(/There is already a Construct with name 'test-volume-c8db061ePVC'/);

  });

  test('can bind to a claim at instantiation', () => {

    const chart = Testing.chart();
    const pvc = PersistentVolumeClaim.fromClaimName('claim');
    const vol = new AwsElasticBlockStorePersistentVolume(chart, 'Volume', {
      volumeId: 'vol1',
      claim: pvc,
    });

    expect(vol.claim!.name).toEqual(pvc.name);

    const spec = Testing.synth(chart)[0].spec;
    expect(spec).toMatchSnapshot();

  });

  test('can bind to a claim post instantiation', () => {

    const chart = Testing.chart();
    const pvc = PersistentVolumeClaim.fromClaimName('claim');
    const vol = new AwsElasticBlockStorePersistentVolume(chart, 'Volume', {
      volumeId: 'vol1',
    });

    vol.bind(pvc);

    expect(vol.claim!.name).toEqual(pvc.name);

    const spec = Testing.synth(chart)[0].spec;
    expect(spec).toMatchSnapshot();

  });

  test('nops if bound twice to the same claim', () => {

    const chart = Testing.chart();
    const pvc = PersistentVolumeClaim.fromClaimName('claim');
    const vol = new AwsElasticBlockStorePersistentVolume(chart, 'Volume', {
      volumeId: 'vol1',
    });

    vol.bind(pvc);
    vol.bind(pvc);

    expect(vol.claim!.name).toEqual(pvc.name);

  });

  test('throws if bound twice to different claims', () => {

    const chart = Testing.chart();
    const pvc1 = PersistentVolumeClaim.fromClaimName('claim1');
    const pvc2 = PersistentVolumeClaim.fromClaimName('claim2');
    const vol = new AwsElasticBlockStorePersistentVolume(chart, 'Volume', {
      volumeId: 'vol1',
    });

    vol.bind(pvc1);

    expect(() => vol.bind(pvc2)).toThrowError('Cannot bind volume \'test-volume-c8db061e\' to claim \'claim2\' since it is already bound to claim \'claim1\'');

  });

});

describe('AwsElasticBlockStorePersistentVolume', () => {

  test('defaults', () => {

    const chart = Testing.chart();
    const vol = new AwsElasticBlockStorePersistentVolume(chart, 'Volume', {
      volumeId: 'vol1',
    });

    expect(vol.volumeId).toEqual('vol1');
    expect(vol.fsType).toEqual('ext4');
    expect(vol.partition).toBeUndefined();
    expect(vol.readOnly).toBeFalsy();

    const spec = Testing.synth(chart)[0].spec;
    expect(spec).toMatchSnapshot();

  });

  test('custom', () => {

    const chart = Testing.chart();
    const vol = new AwsElasticBlockStorePersistentVolume(chart, 'Volume', {
      volumeId: 'vol1',
      partition: 1,
      readOnly: true,
      fsType: 'ntfs',
    });

    expect(vol.volumeId).toEqual('vol1');
    expect(vol.fsType).toEqual('ntfs');
    expect(vol.partition).toEqual(1);
    expect(vol.readOnly).toBeTruthy();

    const spec = Testing.synth(chart)[0].spec;
    expect(spec).toMatchSnapshot();

  });

});

describe('AzureDiskPersistentVolume', () => {

  test('defaults', () => {

    const chart = Testing.chart();
    const vol = new AzureDiskPersistentVolume(chart, 'Volume', {
      diskName: 'name',
      diskUri: 'uri',
    });

    expect(vol.diskName).toEqual('name');
    expect(vol.diskUri).toEqual('uri');
    expect(vol.cachingMode).toEqual(AzureDiskPersistentVolumeCachingMode.NONE);
    expect(vol.readOnly).toBeFalsy();
    expect(vol.fsType).toEqual('ext4');
    expect(vol.kind).toEqual(AzureDiskPersistentVolumeKind.SHARED);

    const spec = Testing.synth(chart)[0].spec;
    expect(spec).toMatchSnapshot();

  });

  test('custom', () => {

    const chart = Testing.chart();
    const vol = new AzureDiskPersistentVolume(chart, 'Volume', {
      diskName: 'name',
      diskUri: 'uri',
      cachingMode: AzureDiskPersistentVolumeCachingMode.READ_ONLY,
      readOnly: true,
      fsType: 'ntfs',
      kind: AzureDiskPersistentVolumeKind.DEDICATED,
    });

    expect(vol.diskName).toEqual('name');
    expect(vol.diskUri).toEqual('uri');
    expect(vol.cachingMode).toEqual(AzureDiskPersistentVolumeCachingMode.READ_ONLY);
    expect(vol.readOnly).toBeTruthy();
    expect(vol.fsType).toEqual('ntfs');
    expect(vol.kind).toEqual(AzureDiskPersistentVolumeKind.DEDICATED);

    const spec = Testing.synth(chart)[0].spec;
    expect(spec).toMatchSnapshot();

  });

});

describe('GCEPersistentDiskPersistentVolume', () => {

  test('defaults', () => {

    const chart = Testing.chart();
    const vol = new GCEPersistentDiskPersistentVolume(chart, 'Volume', {
      pdName: 'name',
    });

    expect(vol.pdName).toEqual('name');
    expect(vol.partition).toBeUndefined();
    expect(vol.readOnly).toBeFalsy();
    expect(vol.fsType).toEqual('ext4');

    const spec = Testing.synth(chart)[0].spec;
    expect(spec).toMatchSnapshot();

  });

  test('custom', () => {

    const chart = Testing.chart();
    const vol = new GCEPersistentDiskPersistentVolume(chart, 'Volume', {
      pdName: 'name',
      partition: 1,
      readOnly: true,
      fsType: 'ntfs',
    });

    expect(vol.pdName).toEqual('name');
    expect(vol.partition).toEqual(1);
    expect(vol.readOnly).toBeTruthy();
    expect(vol.fsType).toEqual('ntfs');

    const spec = Testing.synth(chart)[0].spec;
    expect(spec).toMatchSnapshot();

  });

});
