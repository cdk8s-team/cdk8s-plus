import * as cdk8s from 'cdk8s';
import * as kplus from '../src';

test('defaults', () => {

  const chart = cdk8s.Testing.chart();
  const pvc = new kplus.PersistentVolumeClaim(chart, 'PersistentVolumeClaim');

  expect(pvc.accessModes).toBeUndefined();
  expect(pvc.storage).toBeUndefined();
  expect(pvc.storageClassName).toBeUndefined();
  expect(pvc.volumeMode).toEqual(kplus.PersistentVolumeMode.FILE_SYSTEM);

  const resources = cdk8s.Testing.synth(chart);
  expect(resources).toMatchSnapshot();

});

test('custom', () => {

  const chart = cdk8s.Testing.chart();
  const pvc = new kplus.PersistentVolumeClaim(chart, 'PersistentVolumeClaim', {
    accessModes: [kplus.PersistentVolumeAccessMode.READ_WRITE_MANY],
    storage: cdk8s.Size.gibibytes(50),
    storageClassName: 'storage-class',
    volumeMode: kplus.PersistentVolumeMode.BLOCK,
  });

  expect(pvc.accessModes).toEqual([kplus.PersistentVolumeAccessMode.READ_WRITE_MANY]);
  expect(pvc.storage).toEqual(cdk8s.Size.gibibytes(50));
  expect(pvc.storageClassName).toEqual('storage-class');
  expect(pvc.volumeMode).toEqual(kplus.PersistentVolumeMode.BLOCK);

  const resources = cdk8s.Testing.synth(chart);
  expect(resources).toMatchSnapshot();

});

test('can be imported', () => {

  const claim = kplus.PersistentVolumeClaim.fromClaimName('claim');
  expect(claim.name).toEqual('claim');

});

test('can be bounded to a volume at instantiation', () => {

  const chart = cdk8s.Testing.chart();
  const vol = kplus.PersistentVolume.fromPersistentVolumeName('vol');
  const pvc = new kplus.PersistentVolumeClaim(chart, 'PersistentVolumeClaim', {
    volume: vol,
  });

  expect(pvc.volume!.name).toEqual(vol.name);

  const resources = cdk8s.Testing.synth(chart);
  expect(resources).toMatchSnapshot();

});

test('can be bounded to a volume post instantiation', () => {

  const chart = cdk8s.Testing.chart();
  const vol = kplus.PersistentVolume.fromPersistentVolumeName('vol');
  const pvc = new kplus.PersistentVolumeClaim(chart, 'PersistentVolumeClaim');

  pvc.bind(vol);

  expect(pvc.volume!.name).toEqual(vol.name);

  const resources = cdk8s.Testing.synth(chart);
  expect(resources).toMatchSnapshot();

});

test('no-ops if bounded twice to the same volume', () => {

  const chart = cdk8s.Testing.chart();
  const vol = kplus.PersistentVolume.fromPersistentVolumeName('vol');
  const pvc = new kplus.PersistentVolumeClaim(chart, 'PersistentVolumeClaim');

  pvc.bind(vol);
  pvc.bind(vol);

  expect(pvc.volume!.name).toEqual(vol.name);

});

test('throws if bounded twice to different volumes', () => {

  const chart = cdk8s.Testing.chart();
  const vol1 = kplus.PersistentVolume.fromPersistentVolumeName('vol1');
  const vol2 = kplus.PersistentVolume.fromPersistentVolumeName('vol2');
  const pvc = new kplus.PersistentVolumeClaim(chart, 'PersistentVolumeClaim');

  pvc.bind(vol1);

  expect(() => pvc.bind(vol2)).toThrowError('Cannot bind claim \'test-persistentvolumeclaim-c8af0974\' to volume \'vol2\' since it is already bound to volume \'vol1\'');

});