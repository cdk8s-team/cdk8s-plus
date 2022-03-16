import * as cdk8s from 'cdk8s';
import { Construct } from 'constructs';
import { Resource, ResourceProps } from './base';
import * as k8s from './imports/k8s';
import { PersistentVolumeClaim } from './pvc';

export interface PersistentVolumeProps extends ResourceProps {

}

export interface ClaimRef {
  readonly name: string;
  readonly namespace: string;
}

export class PersistentVolume extends Resource {

  /**
   * @see base.Resource.apiObject
   */
  protected readonly apiObject: cdk8s.ApiObject;

  private _claim?: PersistentVolumeClaim;

  public constructor(scope: Construct, id: string, _: PersistentVolumeProps = { }) {
    super(scope, id);

    this.apiObject = new k8s.KubePersistentVolume(this, 'Resource');
  }

  /**
   * Reserve a `PersistentVolume` by creating a `PersistentVolumeClaim`
   * that is wired to claim this volume.
   *
   * Note that this method will throw in case the volume is already claimed.
   *
   * @see https://kubernetes.io/docs/concepts/storage/persistent-volumes/#reserving-a-persistentvolume
   */
  public reserve(): PersistentVolumeClaim {

    if (this._claim) {
      throw new Error(`Cannot reserve volume '${this.name}' since it is already claimed by '${this._claim.name}'`);
    }

    this._claim = new PersistentVolumeClaim(this, `${this.name}PVC`, {
      volumeName: this.name,
      metadata: {
        name: `pvc-${this.name}`,
      },
    });

    return this._claim;

  }

}