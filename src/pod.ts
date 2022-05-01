import { ApiObject, Lazy } from 'cdk8s';
import { Construct } from 'constructs';
import * as base from './base';
import * as container from './container';
import * as k8s from './imports/k8s';
import * as secret from './secret';
import * as serviceaccount from './service-account';
import * as volume from './volume';

export abstract class AbstractPod extends base.Resource {

  public readonly restartPolicy?: RestartPolicy;
  public readonly serviceAccount?: serviceaccount.IServiceAccount;
  public readonly securityContext: PodSecurityContext;
  public readonly dns: PodDns;
  public readonly dockerRegistryAuth?: secret.DockerConfigSecret;
  public readonly automountServiceAccountToken: boolean;
  public readonly affinity: PodAffinity;

  private readonly _containers: container.Container[] = [];
  private readonly _initContainers: container.Container[] = [];
  private readonly _hostAliases: HostAlias[] = [];
  private readonly _volumes: Map<string, volume.Volume> = new Map();

  constructor(scope: Construct, id: string, props: AbstractPodProps = {}) {
    super(scope, id);

    this.restartPolicy = props.restartPolicy;
    this.serviceAccount = props.serviceAccount;
    this.securityContext = new PodSecurityContext(props.securityContext);
    this.affinity = new PodAffinity(props.affinity);
    this.dns = new PodDns(props.dns);
    this.dockerRegistryAuth = props.dockerRegistryAuth;
    this.automountServiceAccountToken = props.automountServiceAccountToken ?? true;

    if (props.containers) {
      props.containers.forEach(c => this.addContainer(c));
    }

    if (props.volumes) {
      props.volumes.forEach(v => this.addVolume(v));
    }

    if (props.initContainers) {
      props.initContainers.forEach(c => this.addInitContainer(c));
    }

    if (props.hostAliases) {
      props.hostAliases.forEach(c => this.addHostAlias(c));
    }

  }

  public get containers(): container.Container[] {
    return [...this._containers];
  }

  public get initContainers(): container.Container[] {
    return [...this._initContainers];
  }

  public get volumes(): volume.Volume[] {
    return Array.from(this._volumes.values());
  }

  public get hostAliases(): HostAlias[] {
    return [...this._hostAliases];
  }

  public addContainer(cont: container.ContainerProps): container.Container {
    const impl = new container.Container(cont);
    this._containers.push(impl);
    return impl;
  }

  public addInitContainer(cont: container.ContainerProps): container.Container {

    // https://kubernetes.io/docs/concepts/workloads/pods/init-containers/#differences-from-regular-containers
    if (cont.readiness) {
      throw new Error('Init containers must not have a readiness probe');
    }

    if (cont.liveness) {
      throw new Error('Init containers must not have a liveness probe');
    }

    if (cont.startup) {
      throw new Error('Init containers must not have a startup probe');
    }

    const impl = new container.Container({
      ...cont,
      name: cont.name ?? `init-${this._initContainers.length}`,
    });

    this._initContainers.push(impl);
    return impl;
  }

  public addHostAlias(hostAlias: HostAlias): void {
    this._hostAliases.push(hostAlias);
  }

  public addVolume(vol: volume.Volume): void {
    const existingVolume = this._volumes.get(vol.name);
    if (existingVolume) {
      throw new Error(`Volume with name ${vol.name} already exists`);
    }
    this._volumes.set(vol.name, vol);
  }

  /**
   * @internal
   */
  public _toPodSpec(): k8s.PodSpec {

    if (this.containers.length === 0) {
      throw new Error('PodSpec must have at least 1 container');
    }

    const volumes: Map<string, volume.Volume> = new Map();
    const containers: k8s.Container[] = [];
    const initContainers: k8s.Container[] = [];

    for (const cont of this.containers) {
      // automatically add volume from the container mount
      // to this pod so thats its available to the container.
      for (const mount of cont.mounts) {
        addVolume(mount.volume);
      }
      containers.push(cont._toKube());
    }

    for (const cont of this.initContainers) {
      // automatically add volume from the container mount
      // to this pod so thats its available to the container.
      for (const mount of cont.mounts) {
        addVolume(mount.volume);
      }
      initContainers.push(cont._toKube());
    }

    for (const vol of this.volumes) {
      addVolume(vol);
    }

    function addVolume(vol: volume.Volume) {
      const existingVolume = volumes.get(vol.name);
      // its ok to call this function twice on the same volume, but its not ok to
      // call it twice on a different volume with the same name.
      if (existingVolume && existingVolume !== vol) {
        throw new Error(`Invalid mount configuration. At least two different volumes have the same name: ${vol.name}`);
      }
      volumes.set(vol.name, vol);
    }

    const dns = this.dns._toKube();

    return {
      restartPolicy: this.restartPolicy,
      serviceAccountName: this.serviceAccount?.name,
      containers: containers,
      securityContext: this.securityContext._toKube(),
      initContainers: initContainers,
      hostAliases: this.hostAliases,
      volumes: Array.from(volumes.values()).map(v => v._toKube()),
      dnsPolicy: dns.policy,
      dnsConfig: dns.config,
      hostname: dns.hostname,
      subdomain: dns.subdomain,
      setHostnameAsFqdn: dns.hostnameAsFQDN,
      imagePullSecrets: this.dockerRegistryAuth ? [{ name: this.dockerRegistryAuth.name }] : undefined,
      automountServiceAccountToken: this.automountServiceAccountToken,
      affinity: this.affinity._toKube(),
    };

  }

}

/**
 * Sysctl defines a kernel parameter to be set
 */
export interface Sysctl {
  /**
   * Name of a property to set
   */
  readonly name: string;

  /**
   * Value of a property to set
   */
  readonly value: string;
}

/**
 * Properties for `PodSecurityContext`
 */
export interface PodSecurityContextProps {

  /**
   * Modify the ownership and permissions of pod volumes to this GID.
   *
   * @default - Volume ownership is not changed.
   */
  readonly fsGroup?: number;

  /**
   * Defines behavior of changing ownership and permission of the volume before being exposed inside Pod.
   * This field will only apply to volume types which support fsGroup based ownership(and permissions).
   * It will have no effect on ephemeral volume types such as: secret, configmaps and emptydir.
   *
   * @default FsGroupChangePolicy.ALWAYS
   */
  readonly fsGroupChangePolicy?: FsGroupChangePolicy;

  /**
   * The UID to run the entrypoint of the container process.
   *
   * @default - User specified in image metadata
   */
  readonly user?: number;

  /**
   * The GID to run the entrypoint of the container process.
   *
   * @default - Group configured by container runtime
   */
  readonly group?: number;

  /**
   * Indicates that the container must run as a non-root user.
   * If true, the Kubelet will validate the image at runtime to ensure that it does
   * not run as UID 0 (root) and fail to start the container if it does.
   *
   * @default false
   */
  readonly ensureNonRoot?: boolean;

  /**
   * Sysctls hold a list of namespaced sysctls used for the pod.
   * Pods with unsupported sysctls (by the container runtime) might fail to launch.
   *
   * @default - No sysctls
   */
  readonly sysctls?: Sysctl[];
}

/**
 * A key for the node label that the system uses to denote the topology domain.
 */
export class TopologyKey {

  /**
   * A hostname represents a single node in the cluster.
   *
   * @see https://kubernetes.io/docs/reference/labels-annotations-taints/#kubernetesiohostname
   */
  public static readonly HOSTNAME = new TopologyKey('kubernetes.io/hostname');

  /**
   * A zone represents a logical failure domain. It is common for Kubernetes clusters to
   * span multiple zones for increased availability. While the exact definition of a zone is
   * left to infrastructure implementations, common properties of a zone include very low
   * network latency within a zone, no-cost network traffic within a zone, and failure
   * independence from other zones. For example, nodes within a zone might share a network
   * switch, but nodes in different zones should not.
   *
   * @see https://kubernetes.io/docs/reference/labels-annotations-taints/#topologykubernetesiozone
   */
  public static readonly ZONE = new TopologyKey('topology.kubernetes.io/zone');

  /**
   * A region represents a larger domain, made up of one or more zones. It is uncommon
   * for Kubernetes clusters to span multiple regions. While the exact definition of a
   * zone or region is left to infrastructure implementations, common properties of a region
   * include higher network latency between them than within them, non-zero cost for network
   * traffic between them, and failure independence from other zones or regions.
   *
   * For example, nodes within a region might share power infrastructure (e.g. a UPS or generator), but
   * nodes in different regions typically would not.
   *
   * @see https://kubernetes.io/docs/reference/labels-annotations-taints/#topologykubernetesioregion
   */
  public static readonly REGION = new TopologyKey('topology.kubernetes.io/region');

  /**
   * Custom topology key.
   */
  public static custom(key: string): TopologyKey {
    return new TopologyKey(key);
  }

  private constructor(public readonly key: string) {};
}

/**
 * Describes a requirement for node selection.
 */
export interface NodeRequirement {
  /**
   * List of label queries that the node needs to satisfy.
   */
  readonly labelSelector: NodeLabelQuery[];
}

/**
 * Describes a prefernce for node selection.
 */
export interface NodePreference {

  /**
   * The preference to satisfy.
   */
  readonly preference: NodeRequirement;

  /**
   * Weight associated with matching the corresponding requirement, in the range 1-100.
   */
  readonly weight: number;

}

/**
 * Describes a requirement for pod selection.
 */
export interface PodRequirement {

  /**
   * Pod co-location is defined as running on a node whose value of the
   * this label matches that of any node on which any of
   * the selected pods is running.
   */
  readonly topologyKey: TopologyKey;

  /**
   * List of label queries that the node needs to satisfy.
   */
  readonly labelSelector?: PodLabelQuery[];

  /**
   * List of label queries that the namespace needs to satisfy.
   */
  readonly namespaceSelector?: PodLabelQuery[];

  /**
   * Static list of namespaces the pods can belong to.
   */
  readonly namespaces?: string[];

}

/**
 * Describes a prefernce for pod selection.
 */
export interface PodPreference {

  /**
   * The preference to satisfy.
   */
  readonly preference: PodRequirement;

  /**
   * Weight associated with matching the corresponding requirement, in the range 1-100.
   */
  readonly weight: number;

}

/**
 * Properties for `PodAffinity`.
 */
export interface PodAffinityProps {

  /**
   * The scheduler can't schedule the Pod unless a node matches one of these requirements.
   *
   * @default - no requirements.
   */
  readonly requireNodes?: NodeRequirement[];

  /**
   * The scheduler tries to find a node that matches one of these prefernces.
   * If a matching node is not available, the scheduler still schedules the Pod.
   *
   * @default - no preferences.
   */
  readonly preferNodes?: NodePreference[];

  /**
   * The scheduler can't schedule the Pod unless a node contains pods which match one of these requirements.
   *
   * @default - no requirements.
   */
  readonly requirePods?: PodRequirement[];

  /**
   * The scheduler tries to find a node that contains pods which match one of these preferences.
   * If a matching node is not available, the scheduler still schedules the Pod.
   *
   * @default - no preferences.
   */
  readonly preferPods?: PodPreference[];

  /**
   * The scheduler will not schedule the Pod on a node that has pods which match on these requirements.
   *
   * @default - no rejections.
   */
  readonly rejectPods?: PodRequirement[];

  /**
   * The scheduler will try not to schedule the Pod on a node that has pods which match one of these prefernces.
   * If all nodes meet these selectors, the scheduler still schedules the pod.
   *
   * @default - no preferences.
   */
  readonly avoidPods?: PodPreference[];

}

/**
 * Controls the pod affinity.
 */
export class PodAffinity {

  // node affinity
  private readonly _preferredNodes: NodePreference[] = [];
  private readonly _requiredNodes: NodeRequirement[] = [];

  // pod affinity
  private readonly _preferredPods: PodPreference[] = [];
  private readonly _requiredPods: PodRequirement[] = [];

  // pod anit-affinity
  private readonly _rejectedPods: PodRequirement[] = [];
  private readonly _avoidedPods: PodPreference[] = [];

  constructor(props: PodAffinityProps = {}) {

    if (props.preferNodes) {
      props.preferNodes.forEach(n => this.preferNode(n));
    }

    if (props.requireNodes) {
      props.requireNodes.forEach(n => this.requireNode(n));
    }

    if (props.preferPods) {
      props.preferPods.forEach(p => this.preferPod(p));
    }

    if (props.requirePods) {
      props.requirePods?.forEach(p => this.requirePod(p));
    }

    if (props.rejectPods) {
      props.rejectPods.forEach(p => this.rejectPod(p));
    }

    if (props.avoidPods) {
      props.avoidPods.forEach(p => this.avoidPod(p));
    }
  }

  /**
   * List of preferred nodes for this pod.
   *
   * Retruns a copy. Use `preferNode` to prefer nodes.
   */
  public get preferredNodes(): NodePreference[] {
    return [...this._preferredNodes];
  }

  /**
   * List of required nodes for this pod.
   *
   * Retruns a copy. Use `requireNode` to require nodes.
   */
  public get requiredNodes(): NodeRequirement[] {
    return [...this._requiredNodes];
  }

  /**
   * List of preferred pods for this pod.
   *
   * Retruns a copy. Use `preferPod` to prefer pods.
   */
  public get preferredPods(): PodPreference[] {
    return [...this._preferredPods];
  }

  /**
   * List of required pods for this pod.
   *
   * Retruns a copy. Use `requirePod` to require pods.
   */
  public get requiredPods(): PodRequirement[] {
    return [...this._requiredPods];
  }

  /**
   * List of rejected pods for this pod.
   *
   * Retruns a copy. Use `rejectPod` to reject pods.
   */
  public get rejectedPods(): PodRequirement[] {
    return [...this._rejectedPods];
  }

  /**
   * List of avoided pods for this pod.
   *
   * Retruns a copy. Use `avoidPod` to avoid pods.
   */
  public get avoidedPods(): PodPreference[] {
    return [...this._avoidedPods];
  }

  /**
   * Add a requirement for the nodes this pod can be scheduled on.
   *
   * Corresponds to the `requiredDuringSchedulingIgnoredDuringExecution` property of node affinity.
   */
  public requireNode(requirement: NodeRequirement) {
    this._requiredNodes.push(requirement);
  }

  /**
   * Add a preference for the nodes this pod can be scheduled on.
   *
   * Corresponds to the `preferredDuringSchedulingIgnoredDuringExecution` property of node affinity.
   */
  public preferNode(preference: NodePreference) {
    if (preference.weight < 1 || preference.weight > 100) {
      // https://kubernetes.io/docs/concepts/scheduling-eviction/assign-pod-node/#node-affinity-weight
      throw new Error(`Invalid affinity weight: ${preference.weight}. Must be in range 1-100`);
    }
    this._preferredNodes.push(preference);
  }

  /**
   * Add a requirement for the nodes this pod can be scheduled on.
   *
   * Corresponds to the `requiredDuringSchedulingIgnoredDuringExecution` property of pod affinity.
   */
  public requirePod(requirement: PodRequirement) {
    this._requiredPods.push(requirement);
  }

  /**
   * Add a preference for the nodes this pod can be scheduled on.
   *
   * Corresponds to the `preferredDuringSchedulingIgnoredDuringExecution` property of pod affinity.
   */
  public preferPod(preference: PodPreference) {
    this._preferredPods.push(preference);
  }

  /**
   * Add a requirement for the nodes this pod can be scheduled on.
   *
   * Corresponds to the `requiredDuringSchedulingIgnoredDuringExecution` property of pod anti-affinity.
   */
  public rejectPod(requirement: PodRequirement) {
    this._rejectedPods.push(requirement);
  }

  /**
   * Add a preference for the nodes this pod can be scheduled on.
   *
   * Corresponds to the `preferredDuringSchedulingIgnoredDuringExecution` property of pod anti-affinity.
   */
  public avoidPod(preference: PodPreference) {
    this._avoidedPods.push(preference);
  }

  /**
   * @internal
   */
  public _toKube(): k8s.Affinity {

    const requiredNodes: k8s.NodeSelectorTerm[] = [];
    const preferredNodes: k8s.PreferredSchedulingTerm[] = [];
    const requiredPods: k8s.PodAffinityTerm[] = [];
    const preferredPods: k8s.WeightedPodAffinityTerm[] = [];
    const rejectedPods: k8s.PodAffinityTerm[] = [];
    const avoidedPods: k8s.WeightedPodAffinityTerm[] = [];

    for (const rn of this._requiredNodes) {
      requiredNodes.push({ matchExpressions: rn.labelSelector.map(s => ({ key: s.key, operator: s.operator, values: s.values })) });
    }

    for (const pn of this._preferredNodes) {
      preferredNodes.push({
        weight: pn.weight,
        preference: { matchExpressions: pn.preference.labelSelector.map(s => ({ key: s.key, operator: s.operator, values: s.values })) },
      });
    }

    for (const rp of this._requiredPods) {
      requiredPods.push({
        topologyKey: rp.topologyKey.key,
        namespaces: rp.namespaces,
        labelSelector: rp.labelSelector ? {
          matchExpressions: rp.labelSelector.map(s => ({ key: s.key, operator: s.operator!, values: s.values })),
        } : undefined,
        namespaceSelector: rp.namespaceSelector ? {
          matchExpressions: rp.namespaceSelector.map(s => ({ key: s.key, operator: s.operator!, values: s.values })),
        } : undefined,
      });
    }

    for (const pp of this._preferredPods) {
      preferredPods.push({
        weight: pp.weight,
        podAffinityTerm: {
          topologyKey: pp.preference.topologyKey.key,
          namespaces: pp.preference.namespaces,
          labelSelector: pp.preference.labelSelector ? {
            matchExpressions: pp.preference.labelSelector.map(s => ({ key: s.key, operator: s.operator!, values: s.values })),
          } : undefined,
          namespaceSelector: pp.preference.namespaceSelector ? {
            matchExpressions: pp.preference.namespaceSelector.map(s => ({ key: s.key, operator: s.operator!, values: s.values })),
          } : undefined,
        },
      });
    }

    for (const rp of this._rejectedPods) {
      rejectedPods.push({
        topologyKey: rp.topologyKey.key,
        namespaces: rp.namespaces,
        labelSelector: rp.labelSelector ? {
          matchExpressions: rp.labelSelector.map(s => ({ key: s.key, operator: s.operator!, values: s.values })),
        } : undefined,
        namespaceSelector: rp.namespaceSelector ? {
          matchExpressions: rp.namespaceSelector.map(s => ({ key: s.key, operator: s.operator!, values: s.values })),
        } : undefined,
      });
    }

    for (const ap of this._avoidedPods) {
      avoidedPods.push({
        weight: ap.weight,
        podAffinityTerm: {
          topologyKey: ap.preference.topologyKey.key,
          namespaces: ap.preference.namespaces,
          labelSelector: ap.preference.labelSelector ? {
            matchExpressions: ap.preference.labelSelector.map(s => ({ key: s.key, operator: s.operator!, values: s.values })),
          } : undefined,
          namespaceSelector: ap.preference.namespaceSelector ? {
            matchExpressions: ap.preference.namespaceSelector.map(s => ({ key: s.key, operator: s.operator!, values: s.values })),
          } : undefined,
        },
      });
    }

    return {
      nodeAffinity: {
        preferredDuringSchedulingIgnoredDuringExecution: preferredNodes,
        requiredDuringSchedulingIgnoredDuringExecution: { nodeSelectorTerms: requiredNodes },
      },
      podAffinity: {
        preferredDuringSchedulingIgnoredDuringExecution: preferredPods,
        requiredDuringSchedulingIgnoredDuringExecution: requiredPods,
      },
      podAntiAffinity: {
        preferredDuringSchedulingIgnoredDuringExecution: avoidedPods,
        requiredDuringSchedulingIgnoredDuringExecution: rejectedPods,
      },
    };
  }
}

/**
 * Properties for `AbstractPod`.
 */
export interface AbstractPodProps extends base.ResourceProps {

  /**
   * List of containers belonging to the pod. Containers cannot currently be
   * added or removed. There must be at least one container in a Pod.
   *
   * You can add additionnal containers using `podSpec.addContainer()`
   *
   * @default - No containers. Note that a pod spec must include at least one container.
   */
  readonly containers?: container.ContainerProps[];

  /**
   * List of initialization containers belonging to the pod.
   * Init containers are executed in order prior to containers being started.
   * If any init container fails, the pod is considered to have failed and is handled according to its restartPolicy.
   * The name for an init container or normal container must be unique among all containers.
   * Init containers may not have Lifecycle actions, Readiness probes, Liveness probes, or Startup probes.
   * The resourceRequirements of an init container are taken into account during scheduling by finding the highest request/limit
   * for each resource type, and then using the max of of that value or the sum of the normal containers.
   * Limits are applied to init containers in a similar fashion.
   *
   * Init containers cannot currently be added ,removed or updated.
   *
   * @see https://kubernetes.io/docs/concepts/workloads/pods/init-containers/
   * @default - No init containers.
   */
  readonly initContainers?: container.ContainerProps[];

  /**
   * List of volumes that can be mounted by containers belonging to the pod.
   *
   * You can also add volumes later using `podSpec.addVolume()`
   *
   * @see https://kubernetes.io/docs/concepts/storage/volumes
   *
   * @default - No volumes.
   */
  readonly volumes?: volume.Volume[];

  /**
   * Restart policy for all containers within the pod.
   *
   * @see https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle/#restart-policy
   *
   * @default RestartPolicy.ALWAYS
   */
  readonly restartPolicy?: RestartPolicy;

  /**
   * A service account provides an identity for processes that run in a Pod.
   *
   * When you (a human) access the cluster (for example, using kubectl), you are
   * authenticated by the apiserver as a particular User Account (currently this
   * is usually admin, unless your cluster administrator has customized your
   * cluster). Processes in containers inside pods can also contact the
   * apiserver. When they do, they are authenticated as a particular Service
   * Account (for example, default).
   *
   * @see https://kubernetes.io/docs/tasks/configure-pod-container/configure-service-account/
   *
   * @default - No service account.
   */
  readonly serviceAccount?: serviceaccount.IServiceAccount;

  /**
   * SecurityContext holds pod-level security attributes and common container settings.
   *
   * @default
   *
   *   fsGroupChangePolicy: FsGroupChangePolicy.FsGroupChangePolicy.ALWAYS
   *   ensureNonRoot: false
   */
  readonly securityContext?: PodSecurityContextProps;

  /**
   * HostAlias holds the mapping between IP and hostnames that will be injected as an entry in the pod's hosts file.
   *
   * @schema io.k8s.api.core.v1.HostAlias
   */
  readonly hostAliases?: HostAlias[];

  /**
   * DNS settings for the pod.
   *
   * @see https://kubernetes.io/docs/concepts/services-networking/dns-pod-service/
   *
   * @default
   *
   *  policy: DnsPolicy.CLUSTER_FIRST
   *  hostnameAsFQDN: false
   */
  readonly dns?: PodDnsProps;

  /**
   * A secret containing docker credentials for authenticating to a registry.
   *
   * @default - No auth. Images are assumed to be publicly available.
   */
  readonly dockerRegistryAuth?: secret.DockerConfigSecret;

  /**
   * Indicates whether a service account token should be automatically mounted.
   *
   * @default true
   * @see https://kubernetes.io/docs/tasks/configure-pod-container/configure-service-account/#use-the-default-service-account-to-access-the-api-server
   */
  readonly automountServiceAccountToken?: boolean;

  /**
   * The pod's scheduling constraints
   *
   * @see https://kubernetes.io/docs/concepts/scheduling-eviction/assign-pod-node/
   * @default - pods are free to scheduled on any node.
   */
  readonly affinity?: PodAffinityProps;
}

/**
 * Properties for `Pod`.
 */
export interface PodProps extends AbstractPodProps {}

/**
 * Options for `workload.coloate`.
 */
export interface PodColocateOptions {
  /**
   * Which labels to use as the label selector.
   *
   * @default - all labels are selected.
   */
  readonly labels?: string[];

  /**
   * Which topology to coloate on.
   *
   * @default - TopologyKey.HOSTNAME
   */
  readonly topologyKey?: TopologyKey;

  /**
   * Indicates the co-location is optional, with this weight score.
   *
   * @default - no weight. co-location is assumed to be required.
   */
  readonly weight?: number;

}

export interface PodRepelOptions {
  /**
   * Which labels to use as the label selector.
   *
   * @default - all labels are selected.
   */
  readonly labels?: string[];

  /**
   * Which topology to coloate on.
   *
   * @default - TopologyKey.HOSTNAME
   */
  readonly topologyKey?: TopologyKey;

  /**
   * Indicates the repel is optional, with this weight score.
   *
   * @default - no weight. repel is assumed to be required.
   */
  readonly weight?: number;

}


/**
 * Pod is a collection of containers that can run on a host. This resource is
 * created by clients and scheduled onto hosts.
 */
export class Pod extends AbstractPod {

  /**
   * @see base.Resource.apiObject
   */
  protected readonly apiObject: ApiObject;

  constructor(scope: Construct, id: string, props: PodProps = {}) {
    super(scope, id, props);

    this.apiObject = new k8s.KubePod(this, 'Resource', {
      metadata: props.metadata,
      spec: Lazy.any({ produce: () => this._toKube() }),
    });

  }

  public colocate(pod: Pod, options: PodColocateOptions = {}) {

    const labels: string[] = options.labels ?? this._labels(pod);
    const topologyKey = options.topologyKey ?? TopologyKey.HOSTNAME;

    this.affinity.requirePod({
      topologyKey,
      labelSelector: labels.map(l => PodLabelQuery.is(l, pod.metadata.getLabel(l)!)),
    });
  }

  public repel(pod: Pod, options: PodRepelOptions = {}) {

    const labels: string[] = options.labels ?? this._labels(pod);
    const topologyKey = options.topologyKey ?? TopologyKey.HOSTNAME;

    this.affinity.rejectPod({
      topologyKey,
      labelSelector: labels.map(l => PodLabelQuery.is(l, pod.metadata.getLabel(l)!)),
    });

  }

  private _labels(pod: Pod) {
    // TODO: expose labels from metadata in cdk8s-core.
    return Object.keys(pod.metadata.toJson().labels);
  }


  /**
   * @internal
   */
  public _toKube(): k8s.PodSpec {
    return this._toPodSpec();
  }

}

/**
 * Properties for `PodDns`.
 */
export interface PodDnsProps {

  /**
   * Specifies the hostname of the Pod.
   *
   * @default - Set to a system-defined value.
   */
  readonly hostname?: string;

  /**
   * If specified, the fully qualified Pod hostname will be "<hostname>.<subdomain>.<pod namespace>.svc.<cluster domain>".
   *
   * @default - No subdomain.
   */
  readonly subdomain?: string;

  /**
   * If true the pod's hostname will be configured as the pod's FQDN, rather than the leaf name (the default).
   * In Linux containers, this means setting the FQDN in the hostname field of the kernel (the nodename field of struct utsname).
   * In Windows containers, this means setting the registry value of hostname for the registry
   * key HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\Tcpip\Parameters to FQDN.
   * If a pod does not have FQDN, this has no effect.
   *
   * @default false
   */
  readonly hostnameAsFQDN?: boolean;

  /**
   * Set DNS policy for the pod.
   *
   * If policy is set to `None`, other configuration must be supplied.
   *
   * @default DnsPolicy.CLUSTER_FIRST
   */
  readonly policy?: DnsPolicy;

  /**
   * A list of IP addresses that will be used as DNS servers for the Pod. There can be at most 3 IP addresses specified.
   * When the policy is set to "NONE", the list must contain at least one IP address,
   * otherwise this property is optional.
   * The servers listed will be combined to the base nameservers generated from
   * the specified DNS policy with duplicate addresses removed.
   */
  readonly nameservers?: string[];

  /**
   * A list of DNS search domains for hostname lookup in the Pod.
   * When specified, the provided list will be merged into the base
   * search domain names generated from the chosen DNS policy.
   * Duplicate domain names are removed.
   *
   * Kubernetes allows for at most 6 search domains.
   */
  readonly searches?: string[];

  /**
   * List of objects where each object may have a name property (required)
   * and a value property (optional). The contents in this property
   * will be merged to the options generated from the specified DNS policy.
   * Duplicate entries are removed.
   */
  readonly options?: DnsOption[];
}

/**
 * Holds dns settings of the pod.
 */
export class PodDns {

  /**
   * The DNS policy of this pod.
   */
  public readonly policy: DnsPolicy;

  /**
   * The configured hostname of the pod. Undefined means its set to a system-defined value.
   */
  public readonly hostname?: string;

  /**
   * The configured subdomain of the pod.
   */
  public readonly subdomain?: string;

  /**
   * Whether or not the pods hostname is set to its FQDN.
   */
  public readonly hostnameAsFQDN: boolean;

  private readonly _nameservers: string[];
  private readonly _searches: string[];
  private readonly _options: DnsOption[];

  constructor(props: PodDnsProps = {}) {
    this.hostname = props.hostname;
    this.subdomain = props.subdomain;
    this.policy = props.policy ?? DnsPolicy.CLUSTER_FIRST;
    this.hostnameAsFQDN = props.hostnameAsFQDN ?? false;
    this._nameservers = props.nameservers ?? [];
    this._searches = props.searches ?? [];
    this._options = props.options ?? [];
  }

  /**
   * Nameservers defined for this pod.
   */
  public get nameservers(): string[] {
    return [...this._nameservers];
  }

  /**
   * Search domains defined for this pod.
   */
  public get searches(): string[] {
    return [...this._searches];
  }

  /**
   * Custom dns options defined for this pod.
   */
  public get options(): DnsOption[] {
    return [...this._options];
  }

  /**
   * Add a nameserver.
   */
  public addNameserver(...nameservers: string[]) {
    this._nameservers.push(...nameservers);
  }

  /**
   * Add a search domain.
   */
  public addSearch(...searches: string[]) {
    this._searches.push(...searches);
  }

  /**
   * Add a custom option.
   */
  public addOption(...options: DnsOption[]) {
    this._options.push(...options);
  }

  /**
   * @internal
   */
  public _toKube(): { hostname?: string; subdomain?: string; hostnameAsFQDN: boolean; policy: string; config: k8s.PodDnsConfig } {

    if (this.policy === DnsPolicy.NONE && this.nameservers.length === 0) {
      throw new Error('When dns policy is set to NONE, at least one nameserver is required');
    }

    if (this.nameservers.length > 3) {
      throw new Error('There can be at most 3 nameservers specified');
    }

    if (this.searches.length > 6) {
      throw new Error('There can be at most 6 search domains specified');
    }

    return {
      hostname: this.hostname,
      subdomain: this.subdomain,
      hostnameAsFQDN: this.hostnameAsFQDN,
      policy: this.policy,
      config: {
        nameservers: this.nameservers,
        searches: this.searches,
        options: this.options,
      },
    };
  }

}

/**
 * Holds pod-level security attributes and common container settings.
 */
export class PodSecurityContext {

  public readonly ensureNonRoot: boolean;
  public readonly user?: number;
  public readonly group?: number;
  public readonly fsGroup?: number;
  public readonly fsGroupChangePolicy: FsGroupChangePolicy;

  private readonly _sysctls: Sysctl[] = [];

  constructor(props: PodSecurityContextProps = {}) {
    this.ensureNonRoot = props.ensureNonRoot ?? false;
    this.fsGroupChangePolicy = props.fsGroupChangePolicy ?? FsGroupChangePolicy.ALWAYS;
    this.user = props.user;
    this.group = props.group;
    this.fsGroup = props.fsGroup;

    for (const sysctl of props.sysctls ?? []) {
      this._sysctls.push(sysctl);
    }

  }

  public get sysctls(): Sysctl[] {
    return [...this._sysctls];
  }

  /**
   * @internal
   */
  public _toKube(): k8s.PodSecurityContext {
    return {
      runAsGroup: this.group,
      runAsUser: this.user,
      fsGroup: this.fsGroup,
      runAsNonRoot: this.ensureNonRoot,
      fsGroupChangePolicy: this.fsGroupChangePolicy,
      sysctls: this._sysctls,
    };
  }

}

/**
 * Restart policy for all containers within the pod.
 */
export enum RestartPolicy {
  /**
   * Always restart the pod after it exits.
   */
  ALWAYS = 'Always',

  /**
   * Only restart if the pod exits with a non-zero exit code.
   */
  ON_FAILURE = 'OnFailure',

  /**
   * Never restart the pod.
   */
  NEVER = 'Never'
}

export enum FsGroupChangePolicy {

  /**
   * Only change permissions and ownership if permission and ownership of root directory does
   * not match with expected permissions of the volume.
   * This could help shorten the time it takes to change ownership and permission of a volume
   */
  ON_ROOT_MISMATCH = 'OnRootMismatch',

  /**
   * Always change permission and ownership of the volume when volume is mounted.
   */
  ALWAYS = 'Always'
}

/**
 * Custom DNS option.
 */
export interface DnsOption {

  /**
   * Option name.
   */
  readonly name: string;

  /**
   * Option value.
   *
   * @default - No value.
   */
  readonly value?: string;
}

/**
 * Pod DNS policies.
 */
export enum DnsPolicy {

  /**
   * Any DNS query that does not match the configured cluster domain suffix,
   * such as "www.kubernetes.io", is forwarded to the
   * upstream nameserver inherited from the node.
   * Cluster administrators may have extra stub-domain and upstream DNS servers configured.
   */
  CLUSTER_FIRST = 'ClusterFirst',

  /**
   * For Pods running with hostNetwork, you should
   * explicitly set its DNS policy "ClusterFirstWithHostNet".
   */
  CLUSTER_FIRST_WITH_HOST_NET = 'ClusterFirstWithHostNet',

  /**
   * The Pod inherits the name resolution configuration
   * from the node that the pods run on.
   */
  DEFAULT = 'Default',

  /**
   * It allows a Pod to ignore DNS settings from the Kubernetes environment.
   * All DNS settings are supposed to be provided using the dnsConfig
   * field in the Pod Spec.
   */
  NONE = 'None',

}

/**
 * HostAlias holds the mapping between IP and hostnames that will be injected as
 * an entry in the pod's /etc/hosts file.
 */
export interface HostAlias {
  /**
   * Hostnames for the chosen IP address.
   */
  readonly hostnames: string[];

  /**
   * IP address of the host file entry.
   */
  readonly ip: string;
}

/**
 * Label queries that can be perofmed against nodes.
 */
export class NodeLabelQuery {

  /**
   * Requires value of label `key` to equal `value`.
   */
  public static is(key: string, value: string) {
    return NodeLabelQuery.in(key, [value]);
  }

  /**
   * Requires value of label `key` to be one of `values`.
   */
  public static in(key: string, values: string[]) {
    return new NodeLabelQuery(key, 'In', values);
  }

  /**
   * Requires value of label `key` to be none of `values`.
   */
  public static notIn(key: string, values: string[]) {
    return new NodeLabelQuery(key, 'NotIn', values);
  }

  /**
   * Requires label `key` to exist.
   */
  public static exists(key: string) {
    return new NodeLabelQuery(key, 'Exists', undefined);
  }

  /**
   * Requires label `key` to not exist.
   */
  public static doesNotExist(key: string) {
    return new NodeLabelQuery(key, 'DoesNotExist', undefined);
  }

  /**
   * Requires value of label `key` to greater than all elements in `values`.
   */
  public static gt(key: string, values: string[]) {
    return new NodeLabelQuery(key, 'Gt', values);
  }

  /**
   * Requires value of label `key` to less than all elements in `values`.
   */
  public static lt(key: string, values: string[]) {
    return new NodeLabelQuery(key, 'Lt', values);
  }

  private constructor(
    public readonly key: string,
    public readonly operator: string,
    public readonly values?: string[]) {
  }
}

/**
 * Label queries that can be perofmed against pods.
 */
export class PodLabelQuery {

  /**
   * Requires value of label `key` to equal `value`.
   */
  public static is(key: string, value: string) {
    return PodLabelQuery.in(key, [value]);
  }

  /**
   * Requires value of label `key` to be one of `values`.
   */
  public static in(key: string, values: string[]) {
    return new PodLabelQuery(key, 'In', values);
  }

  /**
   * Requires value of label `key` to be none of `values`.
   */
  public static notIn(key: string, values: string[]) {
    return new PodLabelQuery(key, 'NotIn', values);
  }

  /**
   * Requires label `key` to exist.
   */
  public static exists(key: string) {
    return new PodLabelQuery(key, 'Exists', undefined);
  }

  /**
   * Requires label `key` to not exist.
   */
  public static doesNotExist(key: string) {
    return new PodLabelQuery(key, 'DoesNotExist', undefined);
  }

  private constructor(
    public readonly key: string,
    public readonly operator: string,
    public readonly values?: string[]) {
  }
}