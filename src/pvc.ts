import { Size, ApiObject, Lazy } from 'cdk8s';
import { Construct } from 'constructs';
import * as base from './base';
import * as k8s from './imports/k8s';
import * as pv from './pv';

/**
 * Contract of a `PersistentVolumeClaim`.
 */
export interface IPersistentVolumeClaim extends base.IResource {

  readonly namespace?: string;

}

/**
 * Properties for `PersistentVolumeClaim`.
 */
export interface PersistentVolumeClaimProps extends base.ResourceProps {

  /**
   * Contains the access modes the volume should support.
   *
   * @see https://kubernetes.io/docs/concepts/storage/persistent-volumes#access-modes-1
   * @default - No access modes requirement.
   */
  readonly accessModes?: PersistentVolumeAccessMode[];

  /**
   * Minimum storage size the volume should have.
   *
   * @see https://kubernetes.io/docs/concepts/storage/persistent-volumes#resources
   * @default - No storage requirement.
   */
  readonly storage?: Size;

  /**
   * Name of the StorageClass required by the claim.
   * When this property is not set, the behavior is as follows:
   *
   * - If the admission plugin is turned on, the storage class marked as default will be used.
   * - If the admission plugin is turned off, the pvc can only be bound to volumes without a storage class.
   *
   * @see https://kubernetes.io/docs/concepts/storage/persistent-volumes#class-1
   * @default - Not set.
   */
  readonly storageClassName?: string;

  /**
   * Defines what type of volume is required by the claim.
   *
   * @default VolumeMode.FILE_SYSTEM
   */
  readonly volumeMode?: PersistentVolumeMode;

  /**
   * The PersistentVolume backing this claim.
   *
   * The control plane still checks that storage class, access modes,
   * and requested storage size on the volume are valid.
   *
   * Note that in order to guarantee a proper binding, the volume should
   * also define a `claimRef` referring to this claim. Otherwise, the volume may be
   * claimed be other pvc's before it gets a chance to bind to this one.
   *
   * If the volume is managed (i.e not imported), you can use `pv.claim()` to easily
   * create a bi-directional bounded claim.
   *
   * @see https://kubernetes.io/docs/concepts/storage/persistent-volumes/#binding.
   * @default - No specific volume binding.
   */
  readonly volume?: pv.IPersistentVolume;

  readonly namespace?: string;
}

class ImportedPersistentVolumeClaim extends Construct implements IPersistentVolumeClaim {

  private readonly _name: string;

  public readonly resourceType = 'persistentvolumeclaims';

  constructor(scope: Construct, id: string, name: string) {
    super(scope, id);
    this._name = name;
  }

  public get name(): string {
    return this._name;
  }

  public get apiVersion(): string {
    return k8s.KubePersistentVolumeClaim.GVK.apiVersion;
  }

  public get apiGroup(): string {
    return '';
  }

  public get kind(): string {
    return k8s.KubePersistentVolumeClaim.GVK.kind;
  }

  public get resourceName(): string {
    return this.name;
  }

}

/**
 * A PersistentVolumeClaim (PVC) is a request for storage by a user.
 * It is similar to a Pod. Pods consume node resources and PVCs consume PV resources.
 * Pods can request specific levels of resources (CPU and Memory).
 * Claims can request specific size and access modes
 */
export class PersistentVolumeClaim extends base.Resource implements IPersistentVolumeClaim {

  /**
   * Imports a pvc from the cluster as a reference.
   */
  public static fromClaimName(scope: Construct, id: string, claimName: string): IPersistentVolumeClaim {
    return new ImportedPersistentVolumeClaim(scope, id, claimName);
  }

  /**
   * @see base.Resource.apiObject
   */
  protected readonly apiObject: ApiObject;

  public readonly resourceType = 'persistentvolumeclaims';

  /**
   * Storage requirement of this claim.
   */
  public readonly storage?: Size;

  /**
   * Volume mode requirement of this claim.
   */
  public readonly volumeMode: PersistentVolumeMode;

  /**
   * Storage class requirment of this claim.
   */
  public readonly storageClassName?: string;

  private readonly _accessModes?: PersistentVolumeAccessMode[];

  private _volume?: pv.IPersistentVolume;

  public readonly namespace?: string;

  public constructor(scope: Construct, id: string, props: PersistentVolumeClaimProps = { }) {
    super(scope, id);

    this.namespace = props.namespace;
    this.storage = props.storage;
    this.volumeMode = props.volumeMode ?? PersistentVolumeMode.FILE_SYSTEM;
    this.storageClassName = props.storageClassName;
    this._accessModes = props.accessModes;

    if (props.volume) {
      this.bind(props.volume);
    }

    this.apiObject = new k8s.KubePersistentVolumeClaim(this, 'Resource', {
      metadata: {
        ...props.metadata,
        namespace: this.namespace ? this.namespace : undefined,
      },
      spec: Lazy.any({ produce: () => this._toKube() }),
    });
  }

  /**
   * Access modes requirement of this claim.
   */
  public get accessModes(): PersistentVolumeAccessMode[] | undefined {
    return this._accessModes ? [...this._accessModes] : undefined;
  }

  /**
   * PV this claim is bound to. Undefined means the claim is not bound
   * to any specific volume.
   */
  public get volume(): pv.IPersistentVolume | undefined {
    return this._volume;
  }

  /**
   * Bind a claim to a specific volume.
   * Note that you must also bind the volume to the claim.
   *
   * @see https://kubernetes.io/docs/concepts/storage/persistent-volumes/#binding
   *
   * @param vol The PV to bind to.
   */
  public bind(vol: pv.IPersistentVolume) {
    if (this._volume && this._volume.name !== vol.name) {
      throw new Error(`Cannot bind claim '${this.name}' to volume '${vol.name}' since it is already bound to volume '${this._volume.name}'`);
    }
    this._volume = vol;
  }

  /**
   * @internal
   */
  public _toKube(): k8s.PersistentVolumeClaimSpec {
    const storage = this.storage ? k8s.Quantity.fromString(this.storage.toGibibytes() + 'Gi') : undefined;
    return {
      volumeName: this.volume ? this.volume.name : undefined,
      accessModes: this.accessModes?.map(a => a.toString()),
      resources: storage ? { requests: { storage } } : undefined,
      volumeMode: this.volumeMode,
      storageClassName: this.storageClassName,
    };
  }

}

/**
 * Access Modes.
 */
export enum PersistentVolumeAccessMode {

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
export enum PersistentVolumeMode {

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
