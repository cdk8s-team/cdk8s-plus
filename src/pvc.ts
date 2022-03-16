import * as cdk8s from 'cdk8s';
import { Size } from 'cdk8s';
import { Construct } from 'constructs';
import { IResource, Resource, ResourceProps } from './base';
import * as k8s from './imports/k8s';

/**
 * Contract for a `PersistentVolumeClaim`.
 */
export interface IPersistentVolumeClaim extends IResource {

}

/**
 * Properties for `PersistentVolumeClaim`.
 */
export interface PersistentVolumeClaimProps extends ResourceProps {

  /**
   * Contains the desired access modes the volume should have.
   *
   * @see https://kubernetes.io/docs/concepts/storage/persistent-volumes#access-modes-1
   */
  readonly accessModes?: AccessMode[];

  /**
    * Minimum resources the volume should have.
    *
    * @see https://kubernetes.io/docs/concepts/storage/persistent-volumes#resources
    */
  readonly storage?: Size;

  /**
    * Name of the StorageClass required by the claim.
    *
    * @see https://kubernetes.io/docs/concepts/storage/persistent-volumes#class-1
    */
  readonly storageClassName?: string;

  /**
    * Defines what type of volume is required by the claim.
    *
    * @default VolumeMode.FILE_SYSTEM
    */
  readonly volumeMode?: VolumeMode;

  /**
    * The binding reference to the PersistentVolume backing this claim.
    */
  readonly volumeName?: string;


}

export class PersistentVolumeClaim extends Resource implements IPersistentVolumeClaim {

  /**
   * Imports a pvc from the cluster as a reference.
   * @param claimName The name of the pvc to reference.
   */
  public static fromClaimName(claimName: string): IPersistentVolumeClaim {
    return { name: claimName };
  }

  /**
   * @see base.Resource.apiObject
   */
  protected readonly apiObject: cdk8s.ApiObject;

  public constructor(scope: Construct, id: string, props: PersistentVolumeClaimProps = { }) {
    super(scope, id);

    const storage = props.storage ? k8s.Quantity.fromString(props.storage.toGibibytes() + 'Gi') : undefined;

    this.apiObject = new k8s.KubePersistentVolumeClaim(this, 'Resource', {
      metadata: props.metadata,
      spec: {
        accessModes: props.accessModes,
        resources: storage ? { requests: { storage } } : undefined,
        volumeMode: props.volumeMode ?? VolumeMode.FILE_SYSTEM,
        storageClassName: props.storageClassName,
        volumeName: props.volumeName,
      },
    });
  }

}

/**
 * Access Modes.
 */
export enum AccessMode {

  /**
   * The volume can be mounted as read-write by a single node.
   * ReadWriteOnce access mode still can allow multiple pods to access
   * the volume when the pods are running on the same node.
   */
  READ_WRITE_ONCE = 'ReadWriteOnce',

  /**
   * The volume can be mounted as read-only by many nodes.
   */
  READ_ONLY_MANY = 'ReadOnlyMany',

  /**
   * The volume can be mounted as read-write by many nodes.
   */
  READ_WRITE_MANY = 'ReadWriteMany',

  /**
   * The volume can be mounted as read-write by a single Pod.
   * Use ReadWriteOncePod access mode if you want to ensure that
   * only one pod across whole cluster can read that PVC or write to it.
   * This is only supported for CSI volumes and Kubernetes version 1.22+.
   */
  READ_WRITE_ONCE_POD = 'ReadWriteOncePod'

}

/**
 * Volume Modes.
 */
export enum VolumeMode {

  /**
   * Volume is ounted into Pods into a directory.
   * If the volume is backed by a block device and the device is empty,
   * Kubernetes creates a filesystem on the device before mounting it
   * for the first time.
   */
  FILE_SYSTEM = 'Filesystem',

  /**
   * Use a volume as a raw block device. Such volume is presented into a Pod as a block device,
   * without any filesystem on it. This mode is useful to provide a Pod the fastest possible way
   * to access a volume, without any filesystem layer between the Pod
   * and the volume. On the other hand, the application running in
   * the Pod must know how to handle a raw block device
   */
  BLOCK = 'Block'
}
