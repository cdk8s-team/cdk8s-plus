import { Size, Testing } from 'cdk8s';
import { PersistentVolumeAccessMode, PersistentVolumeClaim, PersistentVolumeMode } from '../src';
import { PersistentVolume } from '../src/pv';

test('defaults', () => {

  const chart = Testing.chart();
  const pvc = new PersistentVolumeClaim(chart, 'PersistentVolumeClaim');

  expect(pvc.accessModes).toBeUndefined();
  expect(pvc.storage).toBeUndefined();
  expect(pvc.storageClassName).toBeUndefined();
  expect(pvc.volumeMode).toEqual(PersistentVolumeMode.FILE_SYSTEM);

  const resources = Testing.synth(chart);
  expect(resources).toMatchSnapshot();

});

test('custom', () => {

  const chart = Testing.chart();
  const pvc = new PersistentVolumeClaim(chart, 'PersistentVolumeClaim', {
    accessModes: [PersistentVolumeAccessMode.READ_WRITE_MANY],
    storage: Size.gibibytes(50),
    storageClassName: 'storage-class',
    volumeMode: PersistentVolumeMode.BLOCK,
  });

  expect(pvc.accessModes).toEqual([PersistentVolumeAccessMode.READ_WRITE_MANY]);
  expect(pvc.storage).toEqual(Size.gibibytes(50));
  expect(pvc.storageClassName).toEqual('storage-class');
  expect(pvc.volumeMode).toEqual(PersistentVolumeMode.BLOCK);

  const resources = Testing.synth(chart);
  expect(resources).toMatchSnapshot();

});

test('can be imported', () => {

  const claim = PersistentVolumeClaim.fromClaimName('claim');
  expect(claim.name).toEqual('claim');

});

test('can be bounded to a volume at instantiation', () => {

  const chart = Testing.chart();
  const vol = PersistentVolume.fromPersistentVolumeName('vol');
  const pvc = new PersistentVolumeClaim(chart, 'PersistentVolumeClaim', {
    volume: vol,
  });

  expect(pvc.volume!.name).toEqual(vol.name);

  const resources = Testing.synth(chart);
  expect(resources).toMatchSnapshot();

});

test('can be bounded to a volume post instantiation', () => {

  const chart = Testing.chart();
  const vol = PersistentVolume.fromPersistentVolumeName('vol');
  const pvc = new PersistentVolumeClaim(chart, 'PersistentVolumeClaim');

  pvc.bind(vol);

  expect(pvc.volume!.name).toEqual(vol.name);

  const resources = Testing.synth(chart);
  expect(resources).toMatchSnapshot();

});

test('no-ops if bounded twice to the same volume', () => {

  const chart = Testing.chart();
  const vol = PersistentVolume.fromPersistentVolumeName('vol');
  const pvc = new PersistentVolumeClaim(chart, 'PersistentVolumeClaim');

  pvc.bind(vol);
  pvc.bind(vol);

  expect(pvc.volume!.name).toEqual(vol.name);

});

test('throws if bounded twice to different volumes', () => {

  const chart = Testing.chart();
  const vol1 = PersistentVolume.fromPersistentVolumeName('vol1');
  const vol2 = PersistentVolume.fromPersistentVolumeName('vol2');
  const pvc = new PersistentVolumeClaim(chart, 'PersistentVolumeClaim');

  pvc.bind(vol1);

  expect(() => pvc.bind(vol2)).toThrowError('Cannot bind claim \'test-persistentvolumeclaim-c8af0974\' to volume \'vol2\' since it is already bound to volume \'vol1\'');

});