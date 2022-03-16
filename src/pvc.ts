import * as cdk8s from 'cdk8s';
import { Construct } from 'constructs';
import { IResource, Resource, ResourceProps } from './base';
import * as k8s from './imports/k8s';

export interface IPersistentVolumeClaim extends IResource {

}

export interface PersistentVolumeClaimProps extends ResourceProps {

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

  public constructor(scope: Construct, id: string, _: PersistentVolumeClaimProps = { }) {
    super(scope, id);

    this.apiObject = new k8s.KubePersistentVolumeClaim(this, 'Resource');
  }

}
