import { ApiObject, Size } from 'cdk8s';
import { Construct } from 'constructs';
import { IResource } from '.';
import { Resource, ResourceProps } from './base';
import * as k8s from './imports/k8s';

/**
 * Interface of a storage class.
 */
export interface IStorageClass extends IResource {
}

/**
 * Access modes for persistent volumes.
 */
export enum PersistentVolumeAccessMode {
  /**
   * The volume can be mounted as read/write on one node.
   */
  READ_WRITE_ONCE = 'ReadWriteOnce',

  /**
   * The volume can be mounted read-only on many nodes.
   */
  READ_ONLY_MANY = 'ReadOnlyMany',

  /**
   * The volume can be mounted read/write on many nodes.
   */
  READ_WRITE_MANY = 'ReadWriteMany',

  /**
   * The volume can be mounted read/write on only one pod.
   *
   * This only works for CSI volumes.
   */
  READ_WRITE_ONCE_POD = 'ReadWriteOncePod',
}

/**
 * Persistent volume modes.
 */
export enum PersistentVolumeMode {
  /**
   * The volume should be mounted into the pod.
   */
  FILESYSTEM = 'Filesystem',

  /**
   * The volume is presented to the pod as a block device.
   */
  BLOCK = 'Block',
}

/**
 * Props for `PersistentVolumeClaim`
 */
export interface PersistentVolumeClaimProps extends ResourceProps {
  /**
   * Access modes for the persistent volume claim.
   */
  readonly accessModes: PersistentVolumeAccessMode[];

  /**
   * Storage class of the persistent volume.
   */
  readonly storageClass?: IStorageClass;

  /**
   * Mode of the persistent volume.
   */
  readonly volumeMode?: PersistentVolumeMode;

  /**
   * How to find a persistent volume claim.
   */
  readonly location?: PersistentVolumeLocation;

  /**
   * Size of persistent volume to request.
   */
  readonly size: Size;
}

/**
 * Interface for locating a persistent volume.
 */
export interface IPersistentVolumeLocation {
  /**
   * Produce configuration for the given persistent volume claim.
   */
  bind(persistentVolumeClaim: PersistentVolumeClaim): PersistentVolumeLocationConfig;
}

/**
 * Locates a persistent volume.
 */
export abstract class PersistentVolumeLocation implements IPersistentVolumeLocation {
  /**
   * Locate a persistent volume by its name.
   */
  static fromVolumeName(volumeName: string): IPersistentVolumeLocation {
    return {
      bind: () => ({
        volumeName,
      }),
    };
  }

  abstract bind(persistentVolumeClaim: PersistentVolumeClaim): PersistentVolumeLocationConfig;
}

export interface PersistentVolumeLocationConfig {
  /**
   * Name of a persistent volume
   */
  readonly volumeName?: string;
}

/**
 * A persistent volume claim.
 */
export class PersistentVolumeClaim extends Resource {
  protected readonly apiObject: ApiObject;

  constructor(scope: Construct, id: string, props: PersistentVolumeClaimProps) {
    super(scope, id);

    if (props.accessModes.length === 0) {
      throw new Error('One or more access modes are required');
    }

    const locatorConfig = props.location?.bind(this) ?? {};

    this.apiObject = new k8s.KubePersistentVolumeClaim(this, 'Resource', {
      metadata: props.metadata,
      spec: {
        accessModes: props.accessModes,
        storageClassName: props.storageClass?.name,
        volumeMode: props.volumeMode,
        ...locatorConfig,
        resources: {
          requests: {
            storage: k8s.Quantity.fromString(`${props.size.toMebibytes()}Mi`),
          },
        },
      },
    });
  }
}
