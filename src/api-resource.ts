/**
 * Represents a resource or collection of resources.
 */
export interface IApiResource {
  /**
   * The group portion of the API version (e.g. `authorization.k8s.io`).
   */
  readonly apiGroup: string;

  /**
   * The name of a resource type as it appears in the relevant API endpoint.
   * @example - "pods" or "pods/log"
   * @see https://kubernetes.io/docs/reference/access-authn-authz/rbac/#referring-to-resources
   */
  readonly resourceType: string;

  /**
   * The unique, namespace-global, name of an object inside the Kubernetes cluster.
   *
   * If this is omitted, the ApiResource should represent all objects of the given type.
   */
  readonly resourceName?: string;
}
/**
 * An API Endpoint can either be a resource descriptor (e.g /pods)
 * or a non resource url (e.g /healthz). It must be one or the other, and not both.
 */
export interface IApiEndpoint {

  /**
   * Return the IApiResource this object represents.
   */
  asApiResource(): IApiResource | undefined;

  /**
   * Return the non resource url this object represents.
   */
  asNonApiResource(): string | undefined;

}

/**
 * Options for `ApiResource`.
 */
export interface ApiResourceOptions {
  /**
   * The group portion of the API version (e.g. `authorization.k8s.io`).
   */
  readonly apiGroup: string;

  /**
   * The name of the resource type as it appears in the relevant API endpoint.
   * @example - "pods" or "pods/log"
   * @see https://kubernetes.io/docs/reference/access-authn-authz/rbac/#referring-to-resources
   */
  readonly resourceType: string;
}

/**
 * Represents information about an API resource type.
 */
export class ApiResource implements IApiResource, IApiEndpoint {
  /**
   * API resource information for Binding.
   */
  public static readonly BINDINGS = new ApiResource({
    apiGroup: '',
    resourceType: 'bindings',
  });

  /**
   * API resource information for ComponentStatus.
   */
  public static readonly COMPONENT_STATUSES = new ApiResource({
    apiGroup: '',
    resourceType: 'componentstatuses',
  });

  /**
   * API resource information for ConfigMap.
   */
  public static readonly CONFIG_MAPS = new ApiResource({
    apiGroup: '',
    resourceType: 'configmaps',
  });

  /**
   * API resource information for Endpoints.
   */
  public static readonly ENDPOINTS = new ApiResource({
    apiGroup: '',
    resourceType: 'endpoints',
  });

  /**
   * API resource information for Event.
   */
  public static readonly EVENTS = new ApiResource({
    apiGroup: '',
    resourceType: 'events',
  });

  /**
   * API resource information for LimitRange.
   */
  public static readonly LIMIT_RANGES = new ApiResource({
    apiGroup: '',
    resourceType: 'limitranges',
  });

  /**
   * API resource information for Namespace.
   */
  public static readonly NAMESPACES = new ApiResource({
    apiGroup: '',
    resourceType: 'namespaces',
  });

  /**
   * API resource information for Node.
   */
  public static readonly NODES = new ApiResource({
    apiGroup: '',
    resourceType: 'nodes',
  });

  /**
   * API resource information for PersistentVolumeClaim.
   */
  public static readonly PERSISTENT_VOLUME_CLAIMS = new ApiResource({
    apiGroup: '',
    resourceType: 'persistentvolumeclaims',
  });

  /**
   * API resource information for PersistentVolume.
   */
  public static readonly PERSISTENT_VOLUMES = new ApiResource({
    apiGroup: '',
    resourceType: 'persistentvolumes',
  });

  /**
   * API resource information for Pod.
   */
  public static readonly PODS = new ApiResource({
    apiGroup: '',
    resourceType: 'pods',
  });

  /**
   * API resource information for PodTemplate.
   */
  public static readonly POD_TEMPLATES = new ApiResource({
    apiGroup: '',
    resourceType: 'podtemplates',
  });

  /**
   * API resource information for ReplicationController.
   */
  public static readonly REPLICATION_CONTROLLERS = new ApiResource({
    apiGroup: '',
    resourceType: 'replicationcontrollers',
  });

  /**
   * API resource information for ResourceQuota.
   */
  public static readonly RESOURCE_QUOTAS = new ApiResource({
    apiGroup: '',
    resourceType: 'resourcequotas',
  });

  /**
   * API resource information for Secret.
   */
  public static readonly SECRETS = new ApiResource({
    apiGroup: '',
    resourceType: 'secrets',
  });

  /**
   * API resource information for ServiceAccount.
   */
  public static readonly SERVICE_ACCOUNTS = new ApiResource({
    apiGroup: '',
    resourceType: 'serviceaccounts',
  });

  /**
   * API resource information for Service.
   */
  public static readonly SERVICES = new ApiResource({
    apiGroup: '',
    resourceType: 'services',
  });

  /**
   * API resource information for MutatingWebhookConfiguration.
   */
  public static readonly MUTATING_WEBHOOK_CONFIGURATIONS = new ApiResource({
    apiGroup: 'admissionregistration.k8s.io',
    resourceType: 'mutatingwebhookconfigurations',
  });

  /**
   * API resource information for ValidatingWebhookConfiguration.
   */
  public static readonly VALIDATING_WEBHOOK_CONFIGURATIONS = new ApiResource({
    apiGroup: 'admissionregistration.k8s.io',
    resourceType: 'validatingwebhookconfigurations',
  });

  /**
   * API resource information for CustomResourceDefinition.
   */
  public static readonly CUSTOM_RESOURCE_DEFINITIONS = new ApiResource({
    apiGroup: 'apiextensions.k8s.io',
    resourceType: 'customresourcedefinitions',
  });

  /**
   * API resource information for APIService.
   */
  public static readonly API_SERVICES = new ApiResource({
    apiGroup: 'apiregistration.k8s.io',
    resourceType: 'apiservices',
  });

  /**
   * API resource information for ControllerRevision.
   */
  public static readonly CONTROLLER_REVISIONS = new ApiResource({
    apiGroup: 'apps',
    resourceType: 'controllerrevisions',
  });

  /**
   * API resource information for DaemonSet.
   */
  public static readonly DAEMON_SETS = new ApiResource({
    apiGroup: 'apps',
    resourceType: 'daemonsets',
  });

  /**
   * API resource information for Deployment.
   */
  public static readonly DEPLOYMENTS = new ApiResource({
    apiGroup: 'apps',
    resourceType: 'deployments',
  });

  /**
   * API resource information for ReplicaSet.
   */
  public static readonly REPLICA_SETS = new ApiResource({
    apiGroup: 'apps',
    resourceType: 'replicasets',
  });

  /**
   * API resource information for StatefulSet.
   */
  public static readonly STATEFUL_SETS = new ApiResource({
    apiGroup: 'apps',
    resourceType: 'statefulsets',
  });

  /**
   * API resource information for TokenReview.
   */
  public static readonly TOKEN_REVIEWS = new ApiResource({
    apiGroup: 'authentication.k8s.io',
    resourceType: 'tokenreviews',
  });

  /**
   * API resource information for LocalSubjectAccessReview.
   */
  public static readonly LOCAL_SUBJECT_ACCESS_REVIEWS = new ApiResource({
    apiGroup: 'authorization.k8s.io',
    resourceType: 'localsubjectaccessreviews',
  });

  /**
   * API resource information for SelfSubjectAccessReview.
   */
  public static readonly SELF_SUBJECT_ACCESS_REVIEWS = new ApiResource({
    apiGroup: 'authorization.k8s.io',
    resourceType: 'selfsubjectaccessreviews',
  });

  /**
   * API resource information for SelfSubjectRulesReview.
   */
  public static readonly SELF_SUBJECT_RULES_REVIEWS = new ApiResource({
    apiGroup: 'authorization.k8s.io',
    resourceType: 'selfsubjectrulesreviews',
  });

  /**
   * API resource information for SubjectAccessReview.
   */
  public static readonly SUBJECT_ACCESS_REVIEWS = new ApiResource({
    apiGroup: 'authorization.k8s.io',
    resourceType: 'subjectaccessreviews',
  });

  /**
   * API resource information for HorizontalPodAutoscaler.
   */
  public static readonly HORIZONTAL_POD_AUTOSCALERS = new ApiResource({
    apiGroup: 'autoscaling',
    resourceType: 'horizontalpodautoscalers',
  });

  /**
   * API resource information for CronJob.
   */
  public static readonly CRON_JOBS = new ApiResource({
    apiGroup: 'batch',
    resourceType: 'cronjobs',
  });

  /**
   * API resource information for Job.
   */
  public static readonly JOBS = new ApiResource({
    apiGroup: 'batch',
    resourceType: 'jobs',
  });

  /**
   * API resource information for CertificateSigningRequest.
   */
  public static readonly CERTIFICATE_SIGNING_REQUESTS = new ApiResource({
    apiGroup: 'certificates.k8s.io',
    resourceType: 'certificatesigningrequests',
  });

  /**
   * API resource information for Lease.
   */
  public static readonly LEASES = new ApiResource({
    apiGroup: 'coordination.k8s.io',
    resourceType: 'leases',
  });

  /**
   * API resource information for EndpointSlice.
   */
  public static readonly ENDPOINT_SLICES = new ApiResource({
    apiGroup: 'discovery.k8s.io',
    resourceType: 'endpointslices',
  });

  /**
   * API resource information for FlowSchema.
   */
  public static readonly FLOW_SCHEMAS = new ApiResource({
    apiGroup: 'flowcontrol.apiserver.k8s.io',
    resourceType: 'flowschemas',
  });

  /**
   * API resource information for PriorityLevelConfiguration.
   */
  public static readonly PRIORITY_LEVEL_CONFIGURATIONS = new ApiResource({
    apiGroup: 'flowcontrol.apiserver.k8s.io',
    resourceType: 'prioritylevelconfigurations',
  });

  /**
   * API resource information for IngressClass.
   */
  public static readonly INGRESS_CLASSES = new ApiResource({
    apiGroup: 'networking.k8s.io',
    resourceType: 'ingressclasses',
  });

  /**
   * API resource information for Ingress.
   */
  public static readonly INGRESSES = new ApiResource({
    apiGroup: 'networking.k8s.io',
    resourceType: 'ingresses',
  });

  /**
   * API resource information for NetworkPolicy.
   */
  public static readonly NETWORK_POLICIES = new ApiResource({
    apiGroup: 'networking.k8s.io',
    resourceType: 'networkpolicies',
  });

  /**
   * API resource information for RuntimeClass.
   */
  public static readonly RUNTIME_CLASSES = new ApiResource({
    apiGroup: 'node.k8s.io',
    resourceType: 'runtimeclasses',
  });

  /**
   * API resource information for PodDisruptionBudget.
   */
  public static readonly POD_DISRUPTION_BUDGETS = new ApiResource({
    apiGroup: 'policy',
    resourceType: 'poddisruptionbudgets',
  });

  /**
   * API resource information for ClusterRoleBinding.
   */
  public static readonly CLUSTER_ROLE_BINDINGS = new ApiResource({
    apiGroup: 'rbac.authorization.k8s.io',
    resourceType: 'clusterrolebindings',
  });

  /**
   * API resource information for ClusterRole.
   */
  public static readonly CLUSTER_ROLES = new ApiResource({
    apiGroup: 'rbac.authorization.k8s.io',
    resourceType: 'clusterroles',
  });

  /**
   * API resource information for RoleBinding.
   */
  public static readonly ROLE_BINDINGS = new ApiResource({
    apiGroup: 'rbac.authorization.k8s.io',
    resourceType: 'rolebindings',
  });

  /**
   * API resource information for Role.
   */
  public static readonly ROLES = new ApiResource({
    apiGroup: 'rbac.authorization.k8s.io',
    resourceType: 'roles',
  });

  /**
   * API resource information for PriorityClass.
   */
  public static readonly PRIORITY_CLASSES = new ApiResource({
    apiGroup: 'scheduling.k8s.io',
    resourceType: 'priorityclasses',
  });

  /**
   * API resource information for CSIDriver.
   */
  public static readonly CSI_DRIVERS = new ApiResource({
    apiGroup: 'storage.k8s.io',
    resourceType: 'csidrivers',
  });

  /**
   * API resource information for CSINode.
   */
  public static readonly CSI_NODES = new ApiResource({
    apiGroup: 'storage.k8s.io',
    resourceType: 'csinodes',
  });

  /**
   * API resource information for CSIStorageCapacity.
   */
  public static readonly CSI_STORAGE_CAPACITIES = new ApiResource({
    apiGroup: 'storage.k8s.io',
    resourceType: 'csistoragecapacities',
  });

  /**
   * API resource information for StorageClass.
   */
  public static readonly STORAGE_CLASSES = new ApiResource({
    apiGroup: 'storage.k8s.io',
    resourceType: 'storageclasses',
  });

  /**
   * API resource information for VolumeAttachment.
   */
  public static readonly VOLUME_ATTACHMENTS = new ApiResource({
    apiGroup: 'storage.k8s.io',
    resourceType: 'volumeattachments',
  });

  /**
   * API resource information for a custom resource type.
   */
  public static custom(options: ApiResourceOptions): ApiResource {
    return new ApiResource(options);
  };

  /**
   * The group portion of the API version (e.g. `authorization.k8s.io`).
   */
  public readonly apiGroup: string;

  /**
   * The name of the resource type as it appears in the relevant API endpoint.
   * @example - "pods" or "pods/log"
   * @see https://kubernetes.io/docs/reference/access-authn-authz/rbac/#referring-to-resources
   */
  public readonly resourceType: string;

  private constructor(options: ApiResourceOptions) {
    this.apiGroup = options.apiGroup;
    this.resourceType = options.resourceType;
  }

  public asApiResource(): IApiResource | undefined {
    return this;
  }

  public asNonApiResource(): string | undefined {
    return undefined;
  }
}

/**
 * Factory for creating non api resources.
 */
export class NonApiResource implements IApiEndpoint {

  public static of(url: string): NonApiResource {
    return new NonApiResource(url);
  }

  private constructor(private readonly nonResourceUrl: string) {};

  public asApiResource(): IApiResource | undefined {
    return undefined;
  }

  public asNonApiResource(): string | undefined {

    return this.nonResourceUrl;
  }
}