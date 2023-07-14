import { Names, Size } from 'cdk8s';
import { IConstruct, Construct } from 'constructs';
import * as configmap from './config-map';
import * as k8s from './imports/k8s';
import * as pvc from './pvc';
import * as secret from './secret';

/**
 * Represents a piece of storage in the cluster.
 */
export interface IStorage extends IConstruct {

  /**
   * Convert the piece of storage into a concrete volume.
   */
  asVolume(): Volume;
}

/**
 * Volume represents a named volume in a pod that may be accessed by any
 * container in the pod.
 *
 * Docker also has a concept of volumes, though it is somewhat looser and less
 * managed. In Docker, a volume is simply a directory on disk or in another
 * Container. Lifetimes are not managed and until very recently there were only
 * local-disk-backed volumes. Docker now provides volume drivers, but the
 * functionality is very limited for now (e.g. as of Docker 1.7 only one volume
 * driver is allowed per Container and there is no way to pass parameters to
 * volumes).
 *
 * A Kubernetes volume, on the other hand, has an explicit lifetime - the same
 * as the Pod that encloses it. Consequently, a volume outlives any Containers
 * that run within the Pod, and data is preserved across Container restarts. Of
 * course, when a Pod ceases to exist, the volume will cease to exist, too.
 * Perhaps more importantly than this, Kubernetes supports many types of
 * volumes, and a Pod can use any number of them simultaneously.
 *
 * At its core, a volume is just a directory, possibly with some data in it,
 * which is accessible to the Containers in a Pod. How that directory comes to
 * be, the medium that backs it, and the contents of it are determined by the
 * particular volume type used.
 *
 * To use a volume, a Pod specifies what volumes to provide for the Pod (the
 * .spec.volumes field) and where to mount those into Containers (the
 * .spec.containers[*].volumeMounts field).
 *
 * A process in a container sees a filesystem view composed from their Docker
 * image and volumes. The Docker image is at the root of the filesystem
 * hierarchy, and any volumes are mounted at the specified paths within the
 * image. Volumes can not mount onto other volumes
 */
export class Volume extends Construct implements IStorage {

  /**
   * Mounts an Amazon Web Services (AWS) EBS volume into your pod.
   * Unlike emptyDir, which is erased when a pod is removed, the contents of an EBS volume are
   * persisted and the volume is unmounted. This means that an EBS volume can be pre-populated with data,
   * and that data can be shared between pods.
   *
   * There are some restrictions when using an awsElasticBlockStore volume:
   *
   * - the nodes on which pods are running must be AWS EC2 instances.
   * - those instances need to be in the same region and availability zone as the EBS volume.
   * - EBS only supports a single EC2 instance mounting a volume.
   */
  public static fromAwsElasticBlockStore(scope: Construct, id: string, volumeId: string, options: AwsElasticBlockStoreVolumeOptions = {}): Volume {
    return new Volume(scope, id, options.name ?? `ebs-${volumeId}`, {
      awsElasticBlockStore: {
        volumeId,
        fsType: options.fsType ?? 'ext4',
        partition: options.partition,
        readOnly: options.readOnly ?? false,
      },
    });
  }

  /**
   * Mounts a Microsoft Azure Data Disk into a pod.
   */
  public static fromAzureDisk(scope: Construct, id: string, diskName: string, diskUri: string, options: AzureDiskVolumeOptions = {}): Volume {
    return new Volume(scope, id, options.name ?? `azuredisk-${diskName}`, {
      azureDisk: {
        diskName,
        diskUri,
        cachingMode: options.cachingMode ?? AzureDiskPersistentVolumeCachingMode.NONE,
        fsType: options.fsType ?? 'ext4',
        kind: options.kind ?? AzureDiskPersistentVolumeKind.SHARED,
        readOnly: options.readOnly ?? false,
      },
    });
  }

  /**
   * Mounts a Google Compute Engine (GCE) persistent disk (PD) into your Pod.
   * Unlike emptyDir, which is erased when a pod is removed, the contents of a PD are
   * preserved and the volume is merely unmounted. This means that a PD can be pre-populated
   * with data, and that data can be shared between pods.
   *
   * There are some restrictions when using a gcePersistentDisk:
   *
   * - the nodes on which Pods are running must be GCE VMs
   * - those VMs need to be in the same GCE project and zone as the persistent disk
   */
  public static fromGcePersistentDisk(scope: Construct, id: string, pdName: string, options: GCEPersistentDiskVolumeOptions = {}): Volume {
    return new Volume(scope, id, options.name ?? `gcedisk-${pdName}`, {
      gcePersistentDisk: {
        pdName,
        fsType: options.fsType ?? 'ext4',
        partition: options.partition,
        readOnly: options.readOnly ?? false,
      },
    });
  }

  /**
   * Populate the volume from a ConfigMap.
   *
   * The configMap resource provides a way to inject configuration data into
   * Pods. The data stored in a ConfigMap object can be referenced in a volume
   * of type configMap and then consumed by containerized applications running
   * in a Pod.
   *
   * When referencing a configMap object, you can simply provide its name in the
   * volume to reference it. You can also customize the path to use for a
   * specific entry in the ConfigMap.
   *
   * @param configMap The config map to use to populate the volume.
   * @param options Options
   */
  public static fromConfigMap(scope: Construct, id: string, configMap: configmap.IConfigMap, options: ConfigMapVolumeOptions = { }): Volume {
    return new Volume(scope, id, options.name ?? `configmap-${configMap.name}`, {
      configMap: {
        name: configMap.name,
        defaultMode: options.defaultMode,
        optional: options.optional,
        items: Volume.renderItems(options.items),
      },
    });
  }

  /**
   * An emptyDir volume is first created when a Pod is assigned to a Node, and
   * exists as long as that Pod is running on that node. As the name says, it is
   * initially empty. Containers in the Pod can all read and write the same
   * files in the emptyDir volume, though that volume can be mounted at the same
   * or different paths in each Container. When a Pod is removed from a node for
   * any reason, the data in the emptyDir is deleted forever.
   *
   * @see http://kubernetes.io/docs/user-guide/volumes#emptydir
   *
   * @param options - Additional options.
   */
  public static fromEmptyDir(scope: Construct, id: string, name: string, options: EmptyDirVolumeOptions = { }): Volume {
    return new Volume(scope, id, name, {
      emptyDir: {
        medium: options.medium,
        sizeLimit: options.sizeLimit
          ? k8s.Quantity.fromString(`${options.sizeLimit.toMebibytes()}Mi`)
          : undefined,
      },
    });
  }

  /**
   * Populate the volume from a Secret.
   *
   * A secret volume is used to pass sensitive information, such as passwords, to Pods.
   * You can store secrets in the Kubernetes API and mount them as files for use by pods
   * without coupling to Kubernetes directly.
   *
   * secret volumes are backed by tmpfs (a RAM-backed filesystem)
   * so they are never written to non-volatile storage.
   *
   * @see https://kubernetes.io/docs/concepts/storage/volumes/#secret
   *
   * @param secr The secret to use to populate the volume.
   * @param options Options
   */
  public static fromSecret(scope: Construct, id: string, secr: secret.ISecret, options: SecretVolumeOptions = { }): Volume {
    return new Volume(scope, id, options.name ?? `secret-${secr.name}`, {
      secret: {
        secretName: secr.name,
        defaultMode: options.defaultMode,
        optional: options.optional,
        items: Volume.renderItems(options.items),
      },
    });
  }

  /**
   * Used to mount a PersistentVolume into a Pod.
   * PersistentVolumeClaims are a way for users to "claim" durable storage (such as a GCE PersistentDisk or an iSCSI volume)
   * without knowing the details of the particular cloud environment.
   *
   * @see https://kubernetes.io/docs/concepts/storage/persistent-volumes/
   */
  public static fromPersistentVolumeClaim(scope: Construct, id: string,
    claim: pvc.IPersistentVolumeClaim,
    options: PersistentVolumeClaimVolumeOptions = {}): Volume {
    return new Volume(scope, id, options.name ?? `pvc-${claim.name}`, {
      persistentVolumeClaim: {
        claimName: claim.name,
        readOnly: options.readOnly ?? false,
      },
    });
  }

  /**
   * Used to mount a file or directory from the host node's filesystem into a Pod.
   * This is not something that most Pods will need, but it offers a powerful
   * escape hatch for some applications.
   *
   * @see https://kubernetes.io/docs/concepts/storage/volumes/#hostpath
   */
  public static fromHostPath(scope: Construct, id: string, name: string, options: HostPathVolumeOptions): Volume {
    return new Volume(scope, id, name, {
      hostPath: {
        path: options.path,
        type: options.type ?? HostPathVolumeType.DEFAULT,
      },
    });
  }

  /**
   * Used to mount an NFS share into a Pod.
   *
   * @see https://kubernetes.io/docs/concepts/storage/volumes/#nfs
   */
  public static fromNfs(scope: Construct, id: string, name: string, options: NfsVolumeOptions): Volume {
    return new Volume(scope, id, name, {
      nfs: {
        server: options.server,
        path: options.path,
        readOnly: options.readOnly,
      },
    });
  }

  /**
   * Populate the volume from a CSI driver, for example the Secrets Store CSI
   * Driver: https://secrets-store-csi-driver.sigs.k8s.io/introduction.html.
   * Which in turn needs an associated provider to source the secrets, such as
   * the AWS Secrets Manager and Systems Manager Parameter Store provider:
   * https://aws.github.io/secrets-store-csi-driver-provider-aws/.
   *
   * @param driver The name of the CSI driver to use to populate the volume.
   * @param options Options for the CSI volume, including driver-specific ones.
   */
  public static fromCsi(scope: Construct, id: string, driver: string, options: CsiVolumeOptions = { }): Volume {
    return new Volume(scope, id, options.name ?? Names.toDnsLabel(scope, { extra: [id] }), {
      csi: {
        driver: driver,
        fsType: options.fsType,
        readOnly: options.readOnly,
        volumeAttributes: options.attributes,
      },
    });
  }

  /**
    * @internal
   */
  private static renderItems = (items?: { [key: string]: PathMapping }): undefined | Array<k8s.KeyToPath> => {
    if (!items) { return undefined; }
    const result = new Array<k8s.KeyToPath>();
    for (const key of Object.keys(items).sort()) {
      result.push({
        key,
        path: items[key].path,
        mode: items[key].mode,
      });
    }
    return result;
  };


  private constructor(scope: Construct, id: string,
    public readonly name: string,
    private readonly config: Omit<k8s.Volume, 'name'>) {
    super(scope, id);
    this.name = name.slice(0, 63);
  }

  public asVolume(): Volume {
    return this;
  }

  /**
   * @internal
   */
  public _toKube(): k8s.Volume {
    return {
      name: this.name,
      ...this.config,
    };
  }
}

/**
 * Options of `Volume.fromGcePersistentDisk`.
 */
export interface GCEPersistentDiskVolumeOptions {
  /**
   * The volume name.
   *
   * @default - auto-generated
   */
  readonly name?: string;

  /**
   * Filesystem type of the volume that you want to mount.
   * Tip: Ensure that the filesystem type is supported by the host operating system.
   *
   * @see https://kubernetes.io/docs/concepts/storage/volumes#awselasticblockstore
   * @default 'ext4'
   */
  readonly fsType?: string;

  /**
   * The partition in the volume that you want to mount. If omitted, the default is to mount by volume name.
   * Examples: For volume /dev/sda1, you specify the partition as "1".
   * Similarly, the volume partition for /dev/sda is "0" (or you can leave the property empty).
   *
   * @default - No partition.
   */
  readonly partition?: number;

  /**
   * Specify "true" to force and set the ReadOnly property in VolumeMounts to "true".
   *
   * @see https://kubernetes.io/docs/concepts/storage/volumes#awselasticblockstore
   * @default false
   */
  readonly readOnly?: boolean;

}

/**
 * Options of `Volume.fromAzureDisk`.
 */
export interface AzureDiskVolumeOptions {
  /**
   * The volume name.
   *
   * @default - auto-generated
   */
  readonly name?: string;

  /**
   * Host Caching mode.
   *
   * @default - AzureDiskPersistentVolumeCachingMode.NONE.
   */
  readonly cachingMode?: AzureDiskPersistentVolumeCachingMode;

  /**
   * Filesystem type to mount. Must be a filesystem type supported by the host operating system.
   *
   * @default 'ext4'
   */
  readonly fsType?: string;

  /**
   * Kind of disk.
   *
   * @default AzureDiskPersistentVolumeKind.SHARED
   */
  readonly kind?: AzureDiskPersistentVolumeKind;

  /**
   * Force the ReadOnly setting in VolumeMounts.
   *
   * @default false
   */
  readonly readOnly?: boolean;
}

/**
 * Options of `Volume.fromAwsElasticBlockStore`.
 */
export interface AwsElasticBlockStoreVolumeOptions {
  /**
   * The volume name.
   *
   * @default - auto-generated
   */
  readonly name?: string;

  /**
   * Filesystem type of the volume that you want to mount.
   * Tip: Ensure that the filesystem type is supported by the host operating system.
   *
   * @see https://kubernetes.io/docs/concepts/storage/volumes#awselasticblockstore
   * @default 'ext4'
   */
  readonly fsType?: string;

  /**
   * The partition in the volume that you want to mount. If omitted, the default is to mount by volume name.
   * Examples: For volume /dev/sda1, you specify the partition as "1".
   * Similarly, the volume partition for /dev/sda is "0" (or you can leave the property empty).
   *
   * @default - No partition.
   */
  readonly partition?: number;

  /**
   * Specify "true" to force and set the ReadOnly property in VolumeMounts to "true".
   *
   * @see https://kubernetes.io/docs/concepts/storage/volumes#awselasticblockstore
   * @default false
   */
  readonly readOnly?: boolean;
}

/**
 * Options for the ConfigMap-based volume.
 */
export interface ConfigMapVolumeOptions {
  /**
   * The volume name.
   *
   * @default - auto-generated
   */
  readonly name?: string;

  /**
   * Mode bits to use on created files by default. Must be a value between 0 and
   * 0777. Defaults to 0644. Directories within the path are not affected by
   * this setting. This might be in conflict with other options that affect the
   * file mode, like fsGroup, and the result can be other mode bits set.
   *
   * @default 0644. Directories within the path are not affected by this
   * setting. This might be in conflict with other options that affect the file
   * mode, like fsGroup, and the result can be other mode bits set.
   */
  readonly defaultMode?: number;

  /**
   * Specify whether the ConfigMap or its keys must be defined.
   * @default - undocumented
   */
  readonly optional?: boolean;

  /**
   * If unspecified, each key-value pair in the Data field of the referenced
   * ConfigMap will be projected into the volume as a file whose name is the key
   * and content is the value. If specified, the listed keys will be projected
   * into the specified paths, and unlisted keys will not be present. If a key
   * is specified which is not present in the ConfigMap, the volume setup will
   * error unless it is marked optional. Paths must be relative and may not
   * contain the '..' path or start with '..'.
   *
   * @default - no mapping
   */
  readonly items?: { [key: string]: PathMapping };
}

/**
 * Maps a string key to a path within a volume.
 */
export interface PathMapping {
  /**
   * The relative path of the file to map the key to. May not be an absolute
   * path. May not contain the path element '..'. May not start with the string
   * '..'.
   */
  readonly path: string;

  /**
   * Optional: mode bits to use on this file, must be a value between 0 and
   * 0777. If not specified, the volume defaultMode will be used. This might be
   * in conflict with other options that affect the file mode, like fsGroup, and
   * the result can be other mode bits set.
   */
  readonly mode?: number;
}

/**
 * Options for volumes populated with an empty directory.
 */
export interface EmptyDirVolumeOptions {
  /**
   * By default, emptyDir volumes are stored on whatever medium is backing the
   * node - that might be disk or SSD or network storage, depending on your
   * environment. However, you can set the emptyDir.medium field to
   * `EmptyDirMedium.MEMORY` to tell Kubernetes to mount a tmpfs (RAM-backed
   * filesystem) for you instead. While tmpfs is very fast, be aware that unlike
   * disks, tmpfs is cleared on node reboot and any files you write will count
   * against your Container's memory limit.
   *
   * @default EmptyDirMedium.DEFAULT
   */
  readonly medium?: EmptyDirMedium;

  /**
   * Total amount of local storage required for this EmptyDir volume. The size
   * limit is also applicable for memory medium. The maximum usage on memory
   * medium EmptyDir would be the minimum value between the SizeLimit specified
   * here and the sum of memory limits of all containers in a pod.
   *
   * @default - limit is undefined
   */
  readonly sizeLimit?: Size;
}

/**
 * The medium on which to store the volume.
 */
export enum EmptyDirMedium {
  /**
   * The default volume of the backing node.
   */
  DEFAULT = '',

  /**
   * Mount a tmpfs (RAM-backed filesystem) for you instead. While tmpfs is very
   * fast, be aware that unlike disks, tmpfs is cleared on node reboot and any
   * files you write will count against your Container's memory limit.
   */
  MEMORY = 'Memory'
}

/**
 * Options for a PersistentVolumeClaim-based volume.
 */
export interface PersistentVolumeClaimVolumeOptions {
  /**
   * The volume name.
   *
   * @default - Derived from the PVC name.
   */
  readonly name?: string;

  /**
   * Will force the ReadOnly setting in VolumeMounts.
   *
   * @default false
   */
  readonly readOnly?: boolean;

}

/**
 * Options for the Secret-based volume.
 */
export interface SecretVolumeOptions {
  /**
   * The volume name.
   *
   * @default - auto-generated
   */
  readonly name?: string;

  /**
   * Mode bits to use on created files by default. Must be a value between 0 and
   * 0777. Defaults to 0644. Directories within the path are not affected by
   * this setting. This might be in conflict with other options that affect the
   * file mode, like fsGroup, and the result can be other mode bits set.
   *
   * @default 0644. Directories within the path are not affected by this
   * setting. This might be in conflict with other options that affect the file
   * mode, like fsGroup, and the result can be other mode bits set.
   */
  readonly defaultMode?: number;

  /**
   * Specify whether the secret or its keys must be defined.
   * @default - undocumented
   */
  readonly optional?: boolean;

  /**
   * If unspecified, each key-value pair in the Data field of the referenced
   * secret will be projected into the volume as a file whose name is the key
   * and content is the value. If specified, the listed keys will be projected
   * into the specified paths, and unlisted keys will not be present. If a key
   * is specified which is not present in the secret, the volume setup will
   * error unless it is marked optional. Paths must be relative and may not
   * contain the '..' path or start with '..'.
   *
   * @default - no mapping
   */
  readonly items?: { [key: string]: PathMapping };

}

/**
 * Azure Disk kinds.
 */
export enum AzureDiskPersistentVolumeKind {

  /**
   * Multiple blob disks per storage account.
   */
  SHARED = 'Shared',

  /**
   * Single blob disk per storage account.
   */
  DEDICATED = 'Dedicated',

  /**
   * Azure managed data disk.
   */
  MANAGED = 'Managed',
}

/**
 * Azure disk caching modes.
 */
export enum AzureDiskPersistentVolumeCachingMode {

  /**
   * None.
   */
  NONE = 'None',

  /**
   * ReadOnly.
   */
  READ_ONLY = 'ReadOnly',

  /**
   * ReadWrite.
   */
  READ_WRITE = 'ReadWrite'
}

/**
 * Options for a HostPathVolume-based volume.
 */
export interface HostPathVolumeOptions {
  /**
   * The path of the directory on the host.
   */
  readonly path: string;

  /**
   * The expected type of the path found on the host.
   *
   * @default HostPathVolumeType.DEFAULT
   */
  readonly type?: HostPathVolumeType;

}

/**
 * Host path types.
 */
export enum HostPathVolumeType {
  /**
   * Empty string (default) is for backward compatibility, which means that no
   * checks will be performed before mounting the hostPath volume.
   */
  DEFAULT = '',

  /**
   * If nothing exists at the given path, an empty directory will be created
   * there as needed with permission set to 0755, having the same group and
   * ownership with Kubelet.
   */
  DIRECTORY_OR_CREATE = 'DirectoryOrCreate',

  /**
   * A directory must exist at the given path.
   */
  DIRECTORY = 'Directory',

  /**
   * If nothing exists at the given path, an empty file will be created there
   * as needed with permission set to 0644, having the same group and ownership
   * with Kubelet.
   */
  FILE_OR_CREATE = 'FileOrCreate',

  /**
   * A file must exist at the given path.
   */
  FILE = 'File',

  /**
   * A UNIX socket must exist at the given path.
   */
  SOCKET = 'Socket',

  /**
   * A character device must exist at the given path.
   */
  CHAR_DEVICE = 'CharDevice',

  /**
   * A block device must exist at the given path.
   */
  BLOCK_DEVICE = 'BlockDevice'
}

/**
 * Options for the NFS based volume.
 */
export interface NfsVolumeOptions {

  /**
   * Server is the hostname or IP address of the NFS server.
   */
  readonly server: string;

  /**
   * If set to true, will force the NFS export to be mounted with read-only permissions.
   *
   * @default - false
   */
  readonly readOnly?: boolean;

  /**
   * Path that is exported by the NFS server
   */
  readonly path: string;
}

/**
 * Options for the CSI driver based volume.
 */
export interface CsiVolumeOptions {
  /**
   * The volume name.
   *
   * @default - auto-generated
   */
  readonly name?: string;

  /**
   * The filesystem type to mount. Ex. "ext4", "xfs", "ntfs". If not provided,
   * the empty value is passed to the associated CSI driver, which will
   * determine the default filesystem to apply.
   *
   * @default - driver-dependent
   */
  readonly fsType?: string;

  /**
   * Whether the mounted volume should be read-only or not.
   *
   * @default - false
   */
  readonly readOnly?: boolean;

  /**
   * Any driver-specific attributes to pass to the CSI volume builder.
   *
   * @default - undefined
   */
  readonly attributes?: {[key: string]: string};
}