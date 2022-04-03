import { ApiObject, Lazy } from 'cdk8s';
import { Construct } from 'constructs';
import { Workload, WorkloadProps } from './_workload';
import * as k8s from './imports/k8s';

/**
 * Properties for `Pod`.
 */
export interface PodProps extends WorkloadProps {}

/**
 * Pod is a collection of containers that can run on a host. This resource is
 * created by clients and scheduled onto hosts.
 */
export class Pod extends Workload {

  /**
   * @see base.Resource.apiObject
   */
  protected readonly apiObject: ApiObject;

  constructor(scope: Construct, id: string, props: PodProps = {}) {
    super(scope, id, props);

    this.apiObject = new k8s.KubePod(this, 'Resource', {
      metadata: props.metadata,
      spec: Lazy.any({ produce: () => this.podSpec }),
    });

  }

}
