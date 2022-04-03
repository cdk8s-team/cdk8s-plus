import { ApiObject, Lazy } from 'cdk8s';
import { Construct } from 'constructs';
import * as k8s from './imports/k8s';
import { Ingress } from './ingress';
import { ExposeServiceViaIngressOptions, Protocol, Service, ServiceType } from './service';
import { Workload, WorkloadProps } from './workload';

/**
 * Properties for `Deployment`.
 */
export interface DeploymentProps extends WorkloadProps {

  /**
   * Number of desired pods.
   *
   * @default 1
   */
  readonly replicas?: number;

}

/**
 * Options for exposing a deployment via a service.
 */
export interface ExposeDeploymentViaServiceOptions {

  /**
   * The port that the service should serve on.
   *
   * @default - Copied from the container of the deployment. If a port could not be determined, throws an error.
   */
  readonly port?: number;

  /**
   * The type of the exposed service.
   *
   * @default - ClusterIP.
   */
  readonly serviceType?: ServiceType;

  /**
   * The name of the service to expose.
   * This will be set on the Service.metadata and must be a DNS_LABEL
   *
   * @default undefined Uses the system generated name.
   */
  readonly name?: string;

  /**
   * The IP protocol for this port. Supports "TCP", "UDP", and "SCTP". Default is TCP.
   *
   * @default Protocol.TCP
   */
  readonly protocol?: Protocol;

  /**
   * The port number the service will redirect to.
   *
   * @default - The port of the first container in the deployment (ie. containers[0].port)
   */
  readonly targetPort?: number;
}

/**
 * Options for exposing a deployment via an ingress.
 */
export interface ExposeDeploymentViaIngressOptions extends ExposeDeploymentViaServiceOptions, ExposeServiceViaIngressOptions {}

/**
*
* A Deployment provides declarative updates for Pods and ReplicaSets.
*
* You describe a desired state in a Deployment, and the Deployment Controller changes the actual
* state to the desired state at a controlled rate. You can define Deployments to create new ReplicaSets, or to remove
* existing Deployments and adopt all their resources with new Deployments.
*
* > Note: Do not manage ReplicaSets owned by a Deployment. Consider opening an issue in the main Kubernetes repository if your use case is not covered below.
*
* Use Case
* ---------
*
* The following are typical use cases for Deployments:
*
* - Create a Deployment to rollout a ReplicaSet. The ReplicaSet creates Pods in the background.
*   Check the status of the rollout to see if it succeeds or not.
* - Declare the new state of the Pods by updating the PodTemplateSpec of the Deployment.
*   A new ReplicaSet is created and the Deployment manages moving the Pods from the old ReplicaSet to the new one at a controlled rate.
*   Each new ReplicaSet updates the revision of the Deployment.
* - Rollback to an earlier Deployment revision if the current state of the Deployment is not stable.
*   Each rollback updates the revision of the Deployment.
* - Scale up the Deployment to facilitate more load.
* - Pause the Deployment to apply multiple fixes to its PodTemplateSpec and then resume it to start a new rollout.
* - Use the status of the Deployment as an indicator that a rollout has stuck.
* - Clean up older ReplicaSets that you don't need anymore.
*
**/
export class Deployment extends Workload {

  /**
   * Number of desired pods.
   */
  public readonly replicas: number;

  /**
   * @see base.Resource.apiObject
   */
  protected readonly apiObject: ApiObject;

  constructor(scope: Construct, id: string, props: DeploymentProps = {}) {
    super(scope, id, props);

    this.apiObject = new k8s.KubeDeployment(this, 'Resource', {
      metadata: props.metadata,
      spec: Lazy.any({ produce: () => this._toKube() }),
    });

    this.replicas = props.replicas ?? 1;
  }

  /**
   * Expose a deployment via a service.
   *
   * This is equivalent to running `kubectl expose deployment <deployment-name>`.
   *
   * @param options Options to determine details of the service and port exposed.
   */
  public exposeViaService(options: ExposeDeploymentViaServiceOptions = {}): Service {
    const service = new Service(this, 'Service', {
      metadata: options.name ? { name: options.name } : undefined,
      type: options.serviceType ?? ServiceType.CLUSTER_IP,
    });
    service.addDeployment(this, { protocol: options.protocol, targetPort: options.targetPort, port: options.port });
    return service;
  }

  /**
   * Expose a deployment via an ingress.
   *
   * This will first expose the deployment with a service, and then expose the service via an ingress.
   *
   * @param path The ingress path to register under.
   * @param options Additional options.
   */
  public exposeViaIngress(path: string, options: ExposeDeploymentViaIngressOptions = {}): Ingress {
    const service = this.exposeViaService(options);
    return service.exposeViaIngress(path, options);
  }

  /**
   * @internal
   */
  public _toKube(): k8s.DeploymentSpec {
    return {
      replicas: this.replicas,
      template: {
        metadata: this.podMetadata.toJson(),
        spec: this._toPodSpec(),
      },
      selector: {
        matchLabels: this.labelSelector,
      },
    };
  }

}