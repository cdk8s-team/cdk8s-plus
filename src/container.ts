import { Size } from 'cdk8s';
import * as configmap from './config-map';
import * as handler from './handler';
import * as k8s from './imports/k8s';
import * as probe from './probe';
import * as secret from './secret';
import { undefinedIfEmpty } from './utils';
import * as volume from './volume';

/**
 * Capability - complete list of POSIX capabilities
 */
export enum Capability {
  /**
   * CAP_AUDIT_CONTROL
   */
  AUDIT_CONTROL = 'CAP_AUDIT_CONTROL',
  /**
   * CAP_AUDIT_READ
   */
  AUDIT_READ = 'CAP_AUDIT_READ',
  /**
   * CAP_AUDIT_WRITE
   */
  AUDIT_WRITE = 'CAP_AUDIT_WRITE',
  /**
   * CAP_BLOCK_SUSPEND
   */
  BLOCK_SUSPEND = 'CAP_BLOCK_SUSPEND',
  /**
   * CAP_BPF
   */
  BPF = 'CAP_BPF',
  /**
   * CAP_CHECKPOINT_RESTORE
   */
  CHECKPOINT_RESTORE = 'CAP_CHECKPOINT_RESTORE',
  /**
   * CAP_CHOWN
   */
  CHOWN = 'CAP_CHOWN',
  /**
   * CAP_DAC_OVERRIDE
   */
  DAC_OVERRIDE = 'CAP_DAC_OVERRIDE',
  /**
   * CAP_DAC_READ_SEARCH
   */
  DAC_READ_SEARCH = 'CAP_DAC_READ_SEARCH',
  /**
   * CAP_FOWNER
   */
  FOWNER = 'CAP_FOWNER',
  /**
   * CAP_FSETID
   */
  FSETID = 'CAP_FSETID',
  /**
   * CAP_IPC_LOCK
   */
  IPC_LOCK = 'CAP_IPC_LOCK',
  /**
   * CAP_IPC_OWNER
   */
  IPC_OWNER = 'CAP_IPC_OWNER',
  /**
   * CAP_KILL
   */
  KILL = 'CAP_KILL',
  /**
   * CAP_LEASE
   */
  LEASE = 'CAP_LEASE',
  /**
   * CAP_LINUX_IMMUTABLE
   */
  LINUX_IMMUTABLE = 'CAP_LINUX_IMMUTABLE',
  /**
   * CAP_MAC_ADMIN
   */
  MAC_ADMIN = 'CAP_MAC_ADMIN',
  /**
   * CAP_MAC_OVERRIDE
   */
  MAC_OVERRIDE = 'CAP_MAC_OVERRIDE',
  /**
   * CAP_MKNOD
   */
  MKNOD = 'CAP_MKNOD',
  /**
   * CAP_NET_ADMIN
   */
  NET_ADMIN = 'CAP_NET_ADMIN',
  /**
   * CAP_NET_BIND_SERVICE
   */
  NET_BIND_SERVICE = 'CAP_NET_BIND_SERVICE',
  /**
   * CAP_NET_BROADCAST
   */
  NET_BROADCAST = 'CAP_NET_BROADCAST',
  /**
   * CAP_NET_RAW
   */
  NET_RAW = 'CAP_NET_RAW',
  /**
   * CAP_PERFMON
   */
  PERFMON = 'CAP_PERFMON',
  /**
   * CAP_SETGID
   */
  SETGID = 'CAP_SETGID',
  /**
   * CAP_SETFCAP
   */
  SETFCAP = 'CAP_SETFCAP',
  /**
   * CAP_SETPCAP
   */
  SETPCAP = 'CAP_SETPCAP',
  /**
   * CAP_SETUID
   */
  SETUID = 'CAP_SETUID',
  /**
   * CAP_SYS_ADMIN
   */
  SYS_ADMIN = 'CAP_SYS_ADMIN',
  /**
   * CAP_SYS_BOOT
   */
  SYS_BOOT = 'CAP_SYS_BOOT',
  /**
   * CAP_SYS_CHROOT
   */
  SYS_CHROOT = 'CAP_SYS_CHROOT',
  /**
   * CAP_SYS_MODULE
   */
  SYS_MODULE = 'CAP_SYS_MODULE',
  /**
   * CAP_SYS_NICE
   */
  SYS_NICE = 'CAP_SYS_NICE',
  /**
   * CAP_SYS_PACCT
   */
  SYS_PACCT = 'CAP_SYS_PACCT',
  /**
   * CAP_SYS_PTRACE
   */
  SYS_PTRACE = 'CAP_SYS_PTRACE',
  /**
   * CAP_SYS_RAWIO
   */
  SYS_RAWIO = 'CAP_SYS_RAWIO',
  /**
   * CAP_SYS_RESOURCE
   */
  SYS_RESOURCE = 'CAP_SYS_RESOURCE',
  /**
   * CAP_SYS_TIME
   */
  SYS_TIME = 'CAP_SYS_TIME',
  /**
   * CAP_SYS_TTY_CONFIG
   */
  SYS_TTY_CONFIG = 'CAP_SYS_TTY_CONFIG',
  /**
   * CAP_SYSLOG
   */
  SYSLOG = 'CAP_SYSLOG',
  /**
   * CAP_WAKE_ALARM
   */
  WAKE_ALARM = 'CAP_WAKE_ALARM',
}

export interface ContainerSecutiryContextCapabilities {
  /**
   * Added capabilities
   */
  readonly add?: Capability[];

  /**
   * Removed capabilities
   */
  readonly drop?: Capability[];
}

/**
 * Properties for `ContainerSecurityContext`
 */
export interface ContainerSecurityContextProps {

  /**
    * The UID to run the entrypoint of the container process.
    *
    * @default - 25000. An arbitrary number bigger than 9999 is selected here.
    * This is so that the container is blocked to access host files even if
    * somehow it manages to get access to host file system.
    */
  readonly user?: number;

  /**
    * The GID to run the entrypoint of the container process.
    *
    * @default - 26000. An arbitrary number bigger than 9999 is selected here.
    * This is so that the container is blocked to access host files even if
    * somehow it manages to get access to host file system.
    */
  readonly group?: number;

  /**
    * Indicates that the container must run as a non-root user.
    * If true, the Kubelet will validate the image at runtime to ensure that it does
    * not run as UID 0 (root) and fail to start the container if it does.
    *
    * @default true
    */
  readonly ensureNonRoot?: boolean;

  /**
   * Run container in privileged mode. Processes in privileged containers are essentially equivalent to root on the host.
   *
   * @default false
   */
  readonly privileged?: boolean;

  /**
   * Whether this container has a read-only root filesystem.
   *
   * @default true
   */
  readonly readOnlyRootFilesystem?: boolean;

  /**
   * Whether a process can gain more privileges than its parent process.
   *
   * @default false
   */
  readonly allowPrivilegeEscalation?: boolean;

  /**
   * POSIX capabilities for running containers
   *
   * @default none
   */
  readonly capabilities?: ContainerSecutiryContextCapabilities;
}

/**
 * Represents a network port in a single container.
 */
export interface ContainerPort {

  /**
   * Number of port to expose on the pod's IP address. This must be a valid port number, 0 < x < 65536.
   */
  readonly number: number;

  /**
   * What host IP to bind the external port to.
   *
   * @default - 127.0.0.1.
   */
  readonly hostIp?: string;

  /**
   * Number of port to expose on the host. If specified, this must be a valid port number, 0 < x < 65536.
   * Most containers do not need this.
   *
   * @default - auto generated by kubernetes and might change on restarts.
   */
  readonly hostPort?: number;

  /**
   * If specified, this must be an IANA_SVC_NAME and unique within the pod.
   * Each named port in a pod must have a unique name.
   * Name for the port that can be referred to by services.
   *
   * @default - port is not named.
   */
  readonly name?: string;

  /**
   * Protocol for port. Must be UDP, TCP, or SCTP. Defaults to "TCP".
   *
   * @default Protocol.TCP
   */
  readonly protocol?: Protocol;

}

/**
 * Network protocols.
 */
export enum Protocol {

  /**
   * TCP.
   */
  TCP = 'TCP',

  /**
   * UDP.
   */
  UDP = 'UDP',

  /**
   * SCTP.
   */
  SCTP = 'SCTP'
}


/**
 * Container security attributes and settings.
 */
export class ContainerSecurityContext {

  public readonly ensureNonRoot: boolean;
  public readonly privileged: boolean;
  public readonly readOnlyRootFilesystem: boolean;
  public readonly user?: number;
  public readonly group?: number;
  public readonly allowPrivilegeEscalation?: boolean;
  public readonly capabilities?: ContainerSecutiryContextCapabilities;

  constructor(props: ContainerSecurityContextProps = {}) {
    this.ensureNonRoot = props.ensureNonRoot ?? true;
    this.privileged = props.privileged ?? false;
    this.readOnlyRootFilesystem = props.readOnlyRootFilesystem ?? true;
    this.user = props.user;
    this.group = props.group;
    this.allowPrivilegeEscalation = props.allowPrivilegeEscalation ?? false;
    this.capabilities = props.capabilities;
  }

  /**
   * @internal
   */
  public _toKube(): k8s.SecurityContext {
    return {
      runAsGroup: this.group,
      runAsUser: this.user,
      runAsNonRoot: this.ensureNonRoot,
      privileged: this.privileged,
      readOnlyRootFilesystem: this.readOnlyRootFilesystem,
      allowPrivilegeEscalation: this.allowPrivilegeEscalation,
      capabilities: this.capabilities,
    };
  }

}

export enum EnvFieldPaths {
  /**
   * The name of the pod.
   */
  POD_NAME = 'metadata.name',

  /**
   * The namespace of the pod.
   */
  POD_NAMESPACE = 'metadata.namespace',

  /**
   * The uid of the pod.
   */
  POD_UID = 'metadata.uid',

  /**
   * The labels of the pod.
   */
  POD_LABEL = 'metadata.labels',

  /**
   * The annotations of the pod.
   */
  POD_ANNOTATION = 'metadata.annotations',

  /**
   * The ipAddress of the pod.
   */
  POD_IP = 'status.podIP',

  /**
   * The service account name of the pod.
   */
  SERVICE_ACCOUNT_NAME = 'spec.serviceAccountName',

  /**
   * The name of the node.
   */
  NODE_NAME = 'spec.nodeName',

  /**
   * The ipAddress of the node.
   */
  NODE_IP = 'status.hostIP',

  /**
   * The ipAddresess of the pod.
   */
  POD_IPS = 'status.podIPs',
}

export enum ResourceFieldPaths {
  /**
   * CPU limit of the container.
   */
  CPU_LIMIT = 'limits.cpu',

  /**
   * Memory limit of the container.
   */
  MEMORY_LIMIT = 'limits.memory',

  /**
   * CPU request of the container.
   */
  CPU_REQUEST = 'requests.cpu',

  /**
   * Memory request of the container.
   */
  MEMORY_REQUEST = 'requests.memory',

  /**
   * Ephemeral storage limit of the container.
   */
  STORAGE_LIMIT = 'limits.ephemeral-storage',

  /**
   * Ephemeral storage request of the container.
   */
  STORAGE_REQUEST = 'requests.ephemeral-storage',
}

/**
 * Options to specify an envionment variable value from a ConfigMap key.
 */
export interface EnvValueFromConfigMapOptions {

  /**
   * Specify whether the ConfigMap or its key must be defined.
   *
   * @default false
   */
  readonly optional?: boolean;
}

/**
 * Options to specify an environment variable value from a Secret.
 */
export interface EnvValueFromSecretOptions {

  /**
   * Specify whether the Secret or its key must be defined.
   *
   * @default false
   */
  readonly optional?: boolean;

}

/**
 * Options to specify an environment variable value from the process environment.
 */
export interface EnvValueFromProcessOptions {

  /**
   * Specify whether the key must exist in the environment.
   * If this is set to true, and the key does not exist, an error will thrown.
   *
   * @default false
   */
  readonly required?: boolean;
}

/**
 * Options to specify an environment variable value from a field reference.
 */
export interface EnvValueFromFieldRefOptions {
  /**
   * Version of the schema the FieldPath is written in terms of.
   */
  readonly apiVersion?: string;

  /**
   * The key to select the pod label or annotation.
   */
  readonly key?: string;
}

/**
 * Options to specify an environment variable value from a resource.
 */
export interface EnvValueFromResourceOptions {
  /**
   * The container to select the value from.
   */
  readonly container?: Container;

  /**
   * The output format of the exposed resource.
   */
  readonly divisor?: string;
}

/**
 * Utility class for creating reading env values from various sources.
 */
export class EnvValue {

  /**
   * Create a value by reading a specific key inside a config map.
   *
   * @param configMap - The config map.
   * @param key - The key to extract the value from.
   * @param options - Additional options.
   */
  public static fromConfigMap(configMap: configmap.IConfigMap, key: string, options: EnvValueFromConfigMapOptions = {}): EnvValue {

    const source: k8s.EnvVarSource = {
      configMapKeyRef: {
        name: configMap.name,
        key,
        optional: options.optional,
      },
    };
    return new EnvValue(undefined, source);
  }

  /**
   * Defines an environment value from a secret JSON value.
   *
   * @param secretValue The secret value (secrent + key)
   * @param options Additional options
   */
  public static fromSecretValue(secretValue: secret.SecretValue, options: EnvValueFromSecretOptions = {}): EnvValue {
    const source: k8s.EnvVarSource = {
      secretKeyRef: {
        name: secretValue.secret.name,
        key: secretValue.key,
        optional: options.optional,
      },
    };

    return new EnvValue(undefined, source);
  }

  /**
   * Create a value from the given argument.
   *
   * @param value - The value.
   */
  public static fromValue(value: string): EnvValue {
    return new EnvValue(value);
  }

  /**
   *
   * Create a value from a field reference.
   *
   * @param fieldPath: The field reference.
   * @param options: Additional options.
   */
  public static fromFieldRef(fieldPath: EnvFieldPaths, options: EnvValueFromFieldRefOptions = {}): EnvValue {
    let needsKey: boolean = false;

    if (fieldPath === EnvFieldPaths.POD_LABEL || fieldPath === EnvFieldPaths.POD_ANNOTATION) {
      needsKey = true;
    }

    if (needsKey && options.key === undefined) {
      throw new Error(`${fieldPath} requires a key`);
    }

    const source: k8s.EnvVarSource = {
      fieldRef: {
        fieldPath: (`${fieldPath}` + (needsKey ? `['${options.key}']` : '')),
        ...(options.apiVersion ? { apiVersion: options.apiVersion } : {}),
      },
    };

    return new EnvValue(undefined, source);
  }

  /**
   * Create a value from a resource.
   *
   * @param resource: Resource to select the value from.
   * @param options: Additional options.
   */
  public static fromResource(resource: ResourceFieldPaths, options: EnvValueFromResourceOptions = {}): EnvValue {
    const source: k8s.EnvVarSource = {
      resourceFieldRef: {
        resource: `${resource}`,
        ... (options.divisor ? { divisor: k8s.IntOrString.fromString(options.divisor) } : {}),
        ... (options.container ? { containerName: options.container.name } : {}),
      },
    };

    return new EnvValue(undefined, source);
  }

  /**
   * Create a value from a key in the current process environment.
   *
   * @param key - The key to read.
   * @param options - Additional options.
   */
  public static fromProcess(key: string, options: EnvValueFromProcessOptions = {}): EnvValue {

    const value = process.env[key];

    if (options.required && !value) {
      throw new Error(`Missing ${key} env variable`);
    }

    return EnvValue.fromValue(value!);
  }

  private constructor(public readonly value?: any, public readonly valueFrom?: any) { }
}

export enum ImagePullPolicy {
  /**
   * Every time the kubelet launches a container, the kubelet queries the container image registry
   * to resolve the name to an image digest. If the kubelet has a container image with that exact
   * digest cached locally, the kubelet uses its cached image; otherwise, the kubelet downloads
   * (pulls) the image with the resolved digest, and uses that image to launch the container.
   *
   * Default is Always if ImagePullPolicy is omitted and either the image tag is :latest or
   * the image tag is omitted.
   */
  ALWAYS = 'Always',

  /**
   * The image is pulled only if it is not already present locally.
   *
   * Default is IfNotPresent if ImagePullPolicy is omitted and the image tag is present but
   * not :latest
   */
  IF_NOT_PRESENT = 'IfNotPresent',

  /**
   * The image is assumed to exist locally. No attempt is made to pull the image.
   */
  NEVER = 'Never',
}

/**
 * Container lifecycle properties.
 */
export interface ContainerLifecycle {

  /**
   * This hook is executed immediately after a container is created. However,
   * there is no guarantee that the hook will execute before the container ENTRYPOINT.
   *
   * @default - No post start handler.
   */
  readonly postStart?: handler.Handler;

  /**
   * This hook is called immediately before a container is terminated due to an API request or management
   * event such as a liveness/startup probe failure, preemption, resource contention and others.
   * A call to the PreStop hook fails if the container is already in a terminated or completed state
   * and the hook must complete before the TERM signal to stop the container can be sent.
   * The Pod's termination grace period countdown begins before the PreStop hook is executed,
   * so regardless of the outcome of the handler, the container will eventually terminate
   * within the Pod's termination grace period. No parameters are passed to the handler.
   *
   * @see https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle/#pod-termination
   *
   * @default - No pre stop handler.
   */
  readonly preStop?: handler.Handler;

}

/**
 * Properties for creating a container.
 */
export interface ContainerProps extends ContainerOpts {

  /**
   * Docker image name.
   */
  readonly image: string;
}

/**
 * Optional properties of a container.
 */
export interface ContainerOpts {
  /**
   * Name of the container specified as a DNS_LABEL. Each container in a pod must have a unique name (DNS_LABEL). Cannot be updated.
   *
   * @default 'main'
   */
  readonly name?: string;

  /**
   * @deprecated - use `portNumber`.
   */
  readonly port?: number;

  /**
   * Number of port to expose on the pod's IP address. This must be a valid port number, 0 < x < 65536.
   *
   * This is a convinience property if all you need a single TCP numbered port.
   * In case more advanced configuartion is required, use the `ports` property.
   *
   * This port is added to the list of ports mentioned in the `ports` property.
   *
   * @default - Only the ports mentiond in the `ports` property are exposed.
   */
  readonly portNumber?: number;

  /**
   * List of ports to expose from this container.
   *
   * @default - Only the port mentioned in the `portNumber` property is exposed.
   */
  readonly ports?: ContainerPort[];

  /**
   * Entrypoint array. Not executed within a shell. The docker image's ENTRYPOINT is used if this is not provided. Variable references $(VAR_NAME) are expanded using the container's environment.
   * If a variable cannot be resolved, the reference in the input string will be unchanged. The $(VAR_NAME) syntax can be escaped with a double $$, ie: $$(VAR_NAME).
   * Escaped references will never be expanded, regardless of whether the variable exists or not. Cannot be updated.
   * More info: https://kubernetes.io/docs/tasks/inject-data-application/define-command-argument-container/#running-a-command-in-a-shell
   *
   * @default - The docker image's ENTRYPOINT.
   */
  readonly command?: string[];

  /**
   * Arguments to the entrypoint. The docker image's CMD is used if `command` is
   * not provided.
   *
   * Variable references $(VAR_NAME) are expanded using the container's
   * environment. If a variable cannot be resolved, the reference in the input
   * string will be unchanged. The $(VAR_NAME) syntax can be escaped with a
   * double $$, ie: $$(VAR_NAME). Escaped references will never be expanded,
   * regardless of whether the variable exists or not.
   *
   * Cannot be updated.
   *
   * @see https://kubernetes.io/docs/tasks/inject-data-application/define-command-argument-container/#running-a-command-in-a-shell
   * @default []
   */
  readonly args?: string[];

  /**
   * Container's working directory. If not specified, the container runtime's default will be used, which might be configured in the container image. Cannot be updated.
   *
   * @default - The container runtime's default.
   */
  readonly workingDir?: string;

  /**
   * Environment variables to set in the container.
   *
   * @default - No environment variables.
   */
  readonly envVariables?: { [name: string]: EnvValue };

  /**
   * List of sources to populate environment variables in the container.
   * When a key exists in multiple sources, the value associated with
   * the last source will take precedence. Values defined by the `envVariables` property
   * with a duplicate key will take precedence.
   *
   * @default - No sources.
   */
  readonly envFrom?: EnvFrom[];

  /**
   * Pod volumes to mount into the container's filesystem. Cannot be updated.
   */
  readonly volumeMounts?: VolumeMount[];

  /**
   * Image pull policy for this container
   * @default ImagePullPolicy.ALWAYS
   */
  readonly imagePullPolicy?: ImagePullPolicy;

  /**
   * Determines when the container is ready to serve traffic.
   *
   * @default - no readiness probe is defined
   */
  readonly readiness?: probe.Probe;

  /**
   * Periodic probe of container liveness. Container will be restarted if the probe fails.
   *
   * @default - no liveness probe is defined
   */
  readonly liveness?: probe.Probe;

  /**
   * StartupProbe indicates that the Pod has successfully initialized.
   * If specified, no other probes are executed until this completes successfully
   *
   * @default - If a port is provided, then knocks on that port
   * to determine when the container is ready for readiness and
   * liveness probe checks.
   * Otherwise, no startup probe is defined.
   */
  readonly startup?: probe.Probe;

  /**
   * Describes actions that the management system should take in response to container lifecycle events.
   */
  readonly lifecycle?: ContainerLifecycle;

  /**
   * Compute resources (CPU and memory requests and limits) required by the container
   * @see https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/
   *
   * @default
   *    cpu:
   *      request: 1000 millis
   *      limit: 1500 millis
   *    memory:
   *      request: 512 mebibytes
   *      limit: 2048 mebibytes
   */
  readonly resources?: ContainerResources;

  /**
   * SecurityContext defines the security options the container should be run with.
   * If set, the fields override equivalent fields of the pod's security context.
   *
   * @see https://kubernetes.io/docs/tasks/configure-pod-container/security-context/
   * @default
   *
   *   ensureNonRoot: true
   *   privileged: false
   *   readOnlyRootFilesystem: true
   *   allowPrivilegeEscalation: false
   *   user: 25000
   *   group: 26000
   */
  readonly securityContext?: ContainerSecurityContextProps;
}

/**
 * A single application container that you want to run within a pod.
 */
export class Container {

  /**
   * The port number that was configured for this container.
   * If undefined, either the container doesn't expose a port, or its
   * port configuration is stored in the `ports` field.
   */
  public readonly portNumber?: number;

  /**
   * Volume mounts configured for this container.
   */
  public readonly mounts: VolumeMount[];

  /**
   * Image pull policy for this container
   */
  public readonly imagePullPolicy: ImagePullPolicy;

  /**
   * The container image.
   */
  public readonly image: string;

  /**
   * The name of the container.
   */
  public readonly name: string;

  /**
   * The working directory inside the container.
   */
  public readonly workingDir?: string;

  /**
   * Compute resources (CPU and memory requests and limits) required by the container
   * @see https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/
   */
  public readonly resources?: ContainerResources;

  /**
   * The security context of the container.
   */
  public readonly securityContext: ContainerSecurityContext;

  /**
   * The environment of the container.
   */
  public readonly env: Env;

  private readonly _command?: readonly string[];
  private readonly _args?: readonly string[];
  private readonly _ports: ContainerPort[] = [];
  private readonly _readiness?: probe.Probe;
  private readonly _liveness?: probe.Probe;
  private readonly _startup?: probe.Probe;
  private readonly _lifecycle?: ContainerLifecycle;

  constructor(props: ContainerProps) {
    if (props instanceof Container) {
      throw new Error('Attempted to construct a container from a Container object.');
    }

    const defaultResourceSpec: ContainerResources = {
      cpu: {
        request: Cpu.millis(1000),
        limit: Cpu.millis(1500),
      },
      memory: {
        request: Size.mebibytes(512),
        limit: Size.mebibytes(2048),
      },
    };

    if (props.port && props.portNumber) {
      throw new Error('Either \'port\' or \'portNumber\' is allowed. Use \'portNumber\' since \'port\' is deprecated');
    }

    const portNumber = props.portNumber ?? props.port;
    const defaultProbeConfiguration: probe.Probe = probe.Probe.fromTcpSocket({ port: portNumber });

    this.name = props.name ?? 'main';
    this.image = props.image;
    this.portNumber = portNumber;
    this._command = props.command;
    this._args = props.args;
    this._readiness = props.readiness;
    this._liveness = props.liveness;
    this._startup = props.startup ?? (this.portNumber ? defaultProbeConfiguration : undefined);
    this._lifecycle = props.lifecycle;
    this.resources = props.resources ?? defaultResourceSpec;
    this.workingDir = props.workingDir;
    this.mounts = props.volumeMounts ?? [];
    this.imagePullPolicy = props.imagePullPolicy ?? ImagePullPolicy.ALWAYS;
    this.securityContext = new ContainerSecurityContext(props.securityContext);
    this.env = new Env(props.envFrom ?? [], props.envVariables ?? {});

    if (this.portNumber) {
      this.addPort({
        number: this.portNumber,
      });
    }

    for (const port of props.ports ?? []) {
      this.addPort(port);
    }
  }

  /**
   * @deprecated - use `portNumber`.
   */
  public get port(): number | undefined {
    return this.portNumber;
  }

  /**
   * Ports exposed by this containers.
   * Returns a copy, use `addPort` to modify.
   */
  public get ports(): ContainerPort[] {
    return [...this._ports];
  }

  /**
   * Entrypoint array (the command to execute when the container starts).
   * @returns a copy of the entrypoint array, cannot be modified
   */
  public get command(): string[] | undefined {
    return this._command ? [...this._command] : undefined;
  }

  /**
   * Arguments to the entrypoint.
   *
   * @returns a copy of the arguments array, cannot be modified.
   */
  public get args(): string[] | undefined {
    return this._args ? [...this._args] : undefined;
  }

  /**
   * Mount a volume to a specific path so that it is accessible by the container.
   * Every pod that is configured to use this container will autmoatically have access to the volume.
   *
   * @param path - The desired path in the container.
   * @param storage - The storage to mount.
   */
  public mount(path: string, storage: volume.IStorage, options: MountOptions = {}) {
    this.mounts.push({ path, volume: storage.asVolume(), ...options });
  }

  /**
   * Add a port to expose from this container.
   */
  public addPort(port: ContainerPort) {

    const names = this._ports.map(p => p.name).filter(x => x);
    const numberProtocols = this._ports.map(p => `${p.number}/${p.protocol || Protocol.TCP}`);

    if (port.name && names.includes(port.name)) {
      throw new Error(`Port with name ${port.name} already exists`);
    }

    const protocol = `${port.number}/${port.protocol || Protocol.TCP}`;
    if (numberProtocols.includes(protocol)) {
      throw new Error(`Port with number ${port.number} and protocol ${port.protocol || Protocol.TCP} already exists`);
    }

    this._ports.push(port);
  }

  /**
   * @internal
   */
  public _toKube(): k8s.Container {
    const volumeMounts: k8s.VolumeMount[] = [];

    for (const mount of this.mounts) {
      volumeMounts.push({
        name: mount.volume.name,
        mountPath: mount.path,
        readOnly: mount.readOnly,
        mountPropagation: mount.propagation,
        subPath: mount.subPath,
        subPathExpr: mount.subPathExpr,
      });
    }

    const ports = new Array<k8s.ContainerPort>();

    for (const port of this.ports) {
      ports.push({
        containerPort: port.number,
        protocol: port.protocol?.toString(),
        name: port.name,
        hostPort: port.hostPort,
        hostIp: port.hostIp,
      });
    }

    // Resource requests and limits
    const cpuLimit = this.resources?.cpu?.limit?.amount;
    const cpuRequest = this.resources?.cpu?.request?.amount;
    const memoryLimit = this.resources?.memory?.limit;
    const memoryRequest = this.resources?.memory?.request;
    const ephemeralStorageLimit = this.resources?.ephemeralStorage?.limit;
    const ephemeralStorageRequest = this.resources?.ephemeralStorage?.request;

    const limits: { [key: string]: k8s.Quantity } = {};
    const requests: { [key: string]: k8s.Quantity } = {};

    if (cpuLimit) {
      limits.cpu = k8s.Quantity.fromString(cpuLimit);
    }
    if (memoryLimit) {
      limits.memory = k8s.Quantity.fromString(memoryLimit.toMebibytes().toString() + 'Mi');
    }
    if (ephemeralStorageLimit) {
      limits['ephemeral-storage'] = k8s.Quantity.fromString(ephemeralStorageLimit.toGibibytes().toString() + 'Gi');
    }
    if (cpuRequest) {
      requests.cpu = k8s.Quantity.fromString(cpuRequest);
    }
    if (memoryRequest) {
      requests.memory = k8s.Quantity.fromString(memoryRequest.toMebibytes().toString() + 'Mi');
    }
    if (ephemeralStorageRequest) {
      requests['ephemeral-storage'] = k8s.Quantity.fromString(ephemeralStorageRequest.toGibibytes().toString() + 'Gi');
    }

    let resourceRequirements: k8s.ResourceRequirements | undefined = undefined;
    if (Object.keys(limits).length > 0 || Object.keys(requests).length > 0) {
      resourceRequirements = {
        limits: undefinedIfEmpty(limits),
        requests: undefinedIfEmpty(requests),
      };
    }

    const env = this.env._toKube();

    return {
      name: this.name,
      image: this.image,
      imagePullPolicy: this.imagePullPolicy,
      ports: undefinedIfEmpty(ports),
      volumeMounts: undefinedIfEmpty(volumeMounts),
      command: this.command,
      args: this.args,
      workingDir: this.workingDir,
      env: env.variables,
      envFrom: env.from,
      readinessProbe: this._readiness?._toKube(this),
      livenessProbe: this._liveness?._toKube(this),
      startupProbe: this._startup?._toKube(this),
      lifecycle: this._lifecycle ? {
        postStart: this._lifecycle.postStart?._toKube(this),
        preStop: this._lifecycle.preStop?._toKube(this),
      } : undefined,
      resources: resourceRequirements,
      securityContext: this.securityContext._toKube(),
    };
  }
}

/**
 * Options for mounts.
 */
export interface MountOptions {
  /**
   * Determines how mounts are propagated from the host to container and the
   * other way around. When not set, MountPropagationNone is used.
   *
   * Mount propagation allows for sharing volumes mounted by a Container to
   * other Containers in the same Pod, or even to other Pods on the same node.
   *
   * @default MountPropagation.NONE
   */
  readonly propagation?: MountPropagation;

  /**
   * Mounted read-only if true, read-write otherwise (false or unspecified).
   * Defaults to false.
   *
   * @default false
   */
  readonly readOnly?: boolean;

  /**
   * Path within the volume from which the container's volume should be mounted.).
   *
   * @default "" the volume's root
   */
  readonly subPath?: string;

  /**
   * Expanded path within the volume from which the container's volume should be
   * mounted. Behaves similarly to SubPath but environment variable references
   * $(VAR_NAME) are expanded using the container's environment. Defaults to ""
   * (volume's root).
   *
   * `subPathExpr` and `subPath` are mutually exclusive.
   *
   * @default "" volume's root.
   */
  readonly subPathExpr?: string;
}

/**
 * Mount a volume from the pod to the container.
 */
export interface VolumeMount extends MountOptions {
  /**
   * The volume to mount.
   */
  readonly volume: volume.Volume;

  /**
   * Path within the container at which the volume should be mounted. Must not
   * contain ':'.
   */
  readonly path: string;
}

export enum MountPropagation {
  /**
   * This volume mount will not receive any subsequent mounts that are mounted
   * to this volume or any of its subdirectories by the host. In similar
   * fashion, no mounts created by the Container will be visible on the host.
   *
   * This is the default mode.
   *
   * This mode is equal to `private` mount propagation as described in the Linux
   * kernel documentation
   */
  NONE = 'None',

  /**
   * This volume mount will receive all subsequent mounts that are mounted to
   * this volume or any of its subdirectories.
   *
   * In other words, if the host mounts anything inside the volume mount, the
   * Container will see it mounted there.
   *
   * Similarly, if any Pod with Bidirectional mount propagation to the same
   * volume mounts anything there, the Container with HostToContainer mount
   * propagation will see it.
   *
   * This mode is equal to `rslave` mount propagation as described in the Linux
   * kernel documentation
   */
  HOST_TO_CONTAINER = 'HostToContainer',

  /**
   * This volume mount behaves the same the HostToContainer mount. In addition,
   * all volume mounts created by the Container will be propagated back to the
   * host and to all Containers of all Pods that use the same volume
   *
   * A typical use case for this mode is a Pod with a FlexVolume or CSI driver
   * or a Pod that needs to mount something on the host using a hostPath volume.
   *
   * This mode is equal to `rshared` mount propagation as described in the Linux
   * kernel documentation
   *
   * Caution: Bidirectional mount propagation can be dangerous. It can damage
   * the host operating system and therefore it is allowed only in privileged
   * Containers. Familiarity with Linux kernel behavior is strongly recommended.
   * In addition, any volume mounts created by Containers in Pods must be
   * destroyed (unmounted) by the Containers on termination.
   *
   */
  BIDIRECTIONAL = 'Bidirectional',
}

/**
 * CPU and memory compute resources
 */
export interface ContainerResources {
  readonly cpu?: CpuResources;
  readonly memory?: MemoryResources;
  readonly ephemeralStorage?: EphemeralStorageResources;
}

/**
 * CPU request and limit
 */
export interface CpuResources {
  readonly request?: Cpu;
  readonly limit?: Cpu;
}

/**
 * Represents the amount of CPU.
 * The amount can be passed as millis or units.
 */
export class Cpu {
  static millis(amount: number): Cpu {
    return new Cpu(amount + 'm');
  }
  static units(amount: number): Cpu {
    return new Cpu(amount.toString());
  }
  amount: string;
  private constructor(amount: string) {
    this.amount = amount;
  }
}

/**
 * Memory request and limit
 */
export interface MemoryResources {
  readonly request?: Size;
  readonly limit?: Size;
}

/**
 * Emphemeral storage request and limit
 */
export interface EphemeralStorageResources {
  readonly request?: Size;
  readonly limit?: Size;
}

/**
 * A collection of env variables defined in other resources.
 */
export class EnvFrom {

  constructor(
    private readonly configMap?: configmap.IConfigMap,
    private readonly prefix?: string,
    private readonly sec?: secret.ISecret) { };

  /**
   * @internal
   */
  public _toKube(): k8s.EnvFromSource {
    return {
      configMapRef: this.configMap ? {
        name: this.configMap.name,
      } : undefined,
      secretRef: this.sec ? {
        name: this.sec.name,
      } : undefined,
      prefix: this.prefix,
    };
  }

}

export function extractContainerPorts(selector?: any): ContainerPort[] {

  if (!selector) { return []; }

  // we don't use instanceof intentionally since it can create
  // cyclic import problems.
  const containers: Container[] = (selector as any).containers ?? [];

  return containers.flatMap(c => c.ports);
}

/**
 * Container environment variables.
 */
export class Env {

  /**
   * Selects a ConfigMap to populate the environment variables with.
   * The contents of the target ConfigMap's Data field will represent
   * the key-value pairs as environment variables.
   */
  public static fromConfigMap(configMap: configmap.IConfigMap, prefix?: string): EnvFrom {
    return new EnvFrom(configMap, prefix, undefined);
  }

  /**
   * Selects a Secret to populate the environment variables with.
   * The contents of the target Secret's Data field will represent
   * the key-value pairs as environment variables.
   */
  public static fromSecret(secr: secret.ISecret): EnvFrom {
    return new EnvFrom(undefined, undefined, secr);
  }

  private readonly _sources: EnvFrom[];
  private readonly _variables: { [key: string]: EnvValue };

  public constructor(sources: EnvFrom[], variables: { [name: string]: EnvValue }) {
    this._sources = sources;
    this._variables = variables;
  }

  /**
   * Add a single variable by name and value.
   * The variable value can come from various dynamic sources such a secrets of config maps.
   * Use `EnvValue.fromXXX` to select sources.
   */
  public addVariable(name: string, value: EnvValue) {
    this._variables[name] = value;
  }

  /**
   * The environment variables for this container.
   * Returns a copy. To add environment variables use `container.env.addVariable()`.
   */
  public get variables(): { [name: string]: EnvValue } {
    return { ...this._variables };
  }

  /**
   * Add a collection of variables by copying from another source.
   * Use `Env.fromXXX` functions to select sources.
   */
  public copyFrom(from: EnvFrom) {
    this._sources.push(from);
  }

  /**
   * The list of sources used to populate the container environment,
   * in addition to the `variables`.
   *
   * Returns a copy. To add a source use `container.env.copyFrom()`.
   */
  public get sources(): EnvFrom[] {
    return [...this._sources];
  }

  private renderEnv(env: { [name: string]: EnvValue }): k8s.EnvVar[] {
    const result = new Array<k8s.EnvVar>();
    for (const [name, v] of Object.entries(env)) {
      result.push({
        name,
        value: v.value,
        valueFrom: v.valueFrom,
      });
    }
    return result;
  }

  /**
   * @internal
   */
  public _toKube(): { variables?: k8s.EnvVar[]; from?: k8s.EnvFromSource[] } {
    return {
      from: undefinedIfEmpty(this._sources.map(s => s._toKube())),
      variables: undefinedIfEmpty(this.renderEnv(this._variables)),
    };
  }
}
