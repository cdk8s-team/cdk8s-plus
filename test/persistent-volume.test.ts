import { Size, Testing } from 'cdk8s';
import * as kplus from '../src';

test('PersistentVolumeClaim', () => {
  const chart = Testing.chart();

  // WHEN
  new kplus.PersistentVolumeClaim(chart, 'MyPvc', {
    accessModes: [kplus.PersistentVolumeAccessMode.READ_WRITE_ONCE],
    size: Size.gibibytes(2),
    volumeMode: kplus.PersistentVolumeMode.FILESYSTEM,
  });

  // THEN
  const pvc = Testing.synth(chart)[0];
  expect(pvc).toEqual({
    apiVersion: 'v1',
    kind: 'PersistentVolumeClaim',
    metadata: {
      name: 'test-mypvc-c848a881',
    },
    spec: {
      accessModes: ['ReadWriteOnce'],
      resources: {
        requests: {
          storage: '2048Mi',
        },
      },
      volumeMode: 'Filesystem',
    },
  });
});

test('errors when access modes are empty', () => {
  const chart = Testing.chart();
  expect(() =>
    new kplus.PersistentVolumeClaim(chart, 'MyPvc', {
      accessModes: [],
      size: Size.mebibytes(512),
    }),
  ).toThrowError(/access modes.*required/i);
});

test('referencing a volume by name', () => {
  const chart = Testing.chart();

  // WHEN
  new kplus.PersistentVolumeClaim(chart, 'MyPvc', {
    accessModes: [kplus.PersistentVolumeAccessMode.READ_WRITE_ONCE],
    location: kplus.PersistentVolumeLocation.fromVolumeName('my-pet-pv'),
    size: Size.mebibytes(512),
  });

  // THEN
  const pvc = Testing.synth(chart)[0];
  expect(pvc.spec.volumeName).toEqual('my-pet-pv');
});

