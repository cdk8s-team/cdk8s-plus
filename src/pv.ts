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
    const claim = new PersistentVolumeClaim(this, `${this.name}PVC`, {
      metadata: {
        name: `pvc-${this.name}`,
      },
    });

    this.bind(claim);
    claim.bind(this);

    return claim;

  }

  /**
   * Bind a volume to a specific claim.
   * Note that you must also bind the claim to the volume.
   *
   * @see https://kubernetes.io/docs/concepts/storage/persistent-volumes/#binding
   *
   * @param pvc The PVC to bind to.
   */
  public bind(pvc: PersistentVolumeClaim) {
    if (this._claim) {
      throw new Error(`Cannot bind volume '${this.name}' to claim '${pvc.name}' since it is already bound to claim '${this._claim.name}'`);
    }
    this._claim = pvc;
  }

}