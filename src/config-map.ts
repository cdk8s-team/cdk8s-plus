import { createHash } from 'crypto';
import * as configmap from 'fs';
import * as path from 'path';
import { ApiObject, Lazy } from 'cdk8s';
import { Construct } from 'constructs';
import stringify from 'json-stable-stringify';
import { Minimatch } from 'minimatch';
import * as base from './base';
import * as k8s from './imports/k8s';
import { undefinedIfEmpty } from './utils';

/**
 * Properties for initialization of `ConfigMap`.
 */
export interface ConfigMapProps extends base.ResourceProps {
  /**
   * BinaryData contains the binary data.
   *
   * Each key must consist of alphanumeric characters, '-', '_' or '.'.
   * BinaryData can contain byte sequences that are not in the UTF-8 range. The
   * keys stored in BinaryData must not overlap with the ones in the Data field,
   * this is enforced during validation process.
   *
   * You can also add binary data using `configMap.addBinaryData()`.
   */
  readonly binaryData?: { [key: string]: string };

  /**
   * Data contains the configuration data.
   *
   * Each key must consist of alphanumeric characters, '-', '_' or '.'. Values
   * with non-UTF-8 byte sequences must use the BinaryData field. The keys
   * stored in Data must not overlap with the keys in the BinaryData field, this
   * is enforced during validation process.
   *
   * You can also add data using `configMap.addData()`.
   */
  readonly data?: { [key: string]: string };

  /**
   * If set to true, ensures that data stored in the ConfigMap cannot be updated (only object metadata can be modified).
   * If not set to true, the field can be modified at any time.
   *
   * @default false
   */
  readonly immutable?: boolean;
}

/**
 * Represents a config map.
 */
export interface IConfigMap extends base.IResource {}

class ImportedConfigMap extends Construct implements IConfigMap {
  private readonly _name: string;

  public readonly resourceType = 'configmaps';

  constructor(scope: Construct, id: string, name: string) {
    super(scope, id);
    this._name = name;
  }

  public get name(): string {
    return this._name;
  }

  public get apiVersion(): string {
    return k8s.KubeConfigMap.GVK.apiVersion;
  }

  public get apiGroup(): string {
    return '';
  }

  public get kind(): string {
    return k8s.KubeConfigMap.GVK.kind;
  }

  public get resourceName(): string {
    return this.name;
  }
}

/**
 * ConfigMap holds configuration data for pods to consume.
 */
export class ConfigMap extends base.Resource implements IConfigMap {
  /**
   * Represents a ConfigMap created elsewhere.
   */
  public static fromConfigMapName(
    scope: Construct,
    id: string,
    name: string,
  ): IConfigMap {
    return new ImportedConfigMap(scope, id, name);
  }

  /**
   * @see base.Resource.apiObject
   */
  protected readonly apiObject: ApiObject;

  public readonly resourceType = 'configmaps';

  private readonly _binaryData: { [key: string]: string } = {};
  private readonly _data: { [key: string]: string } = {};

  /**
   * Whether or not this config map is immutable.
   */
  public readonly immutable: boolean;

  public constructor(scope: Construct, id: string, props: ConfigMapProps = {}) {
    super(scope, id);

    this.immutable = props.immutable ?? false;
    this.apiObject = new k8s.KubeConfigMap(this, 'Resource', {
      metadata: props.metadata,

      // we need lazy here because we filter empty
      data: Lazy.any({ produce: () => this.synthesizeData() }),
      binaryData: Lazy.any({ produce: () => this.synthesizeBinaryData() }),
      immutable: this.immutable,
    });

    for (const [k, v] of Object.entries(props.data ?? {})) {
      this.addData(k, v);
    }

    for (const [k, v] of Object.entries(props.binaryData ?? {})) {
      this.addBinaryData(k, v);
    }
  }

  /**
   * Adds a data entry to the config map.
   * @param key The key
   * @param value The value
   *
   * @throws if there is either a `data` or `binaryData` entry with the same key
   */
  public addData(key: string, value: string) {
    this.verifyKeyAvailable(key);

    this._data[key] = value;
  }

  /**
   * The data associated with this config map.
   *
   * Returns an copy. To add data records, use `addData()` or `addBinaryData()`.
   */
  public get data(): Record<string, string> {
    return { ...this._data };
  }

  /**
   * Adds a binary data entry to the config map. BinaryData can contain byte
   * sequences that are not in the UTF-8 range.
   * @param key The key
   * @param value The value
   *
   * @throws if there is either a `data` or `binaryData` entry with the same key
   */
  public addBinaryData(key: string, value: string) {
    this.verifyKeyAvailable(key);

    this._binaryData[key] = value;
  }

  /**
   * The binary data associated with this config map.
   *
   * Returns a copy. To add data records, use `addBinaryData()` or `addData()`.
   */
  public get binaryData(): Record<string, string> {
    return { ...this._binaryData };
  }

  /**
   * Adds a file to the ConfigMap.
   * @param localFile The path to the local file
   * @param key The ConfigMap key (default to the file name).
   */
  public addFile(localFile: string, key?: string) {
    key = key ?? path.basename(localFile);
    const value = configmap.readFileSync(localFile, 'utf-8');

    this.addData(key, value);
  }

  /**
   * Adds a directory to the ConfigMap.
   * @param localDir A path to a local directory
   * @param options Options
   */
  public addDirectory(localDir: string, options: AddDirectoryOptions = {}) {
    const exclude = options.exclude ?? [];
    const shouldInclude = (file: string) => {
      for (const pattern of exclude) {
        const mm = new Minimatch(pattern);
        if (mm.match(file)) {
          return false;
        }
      }
      return true;
    };

    const keyPrefix = options.keyPrefix ?? '';
    for (const file of configmap.readdirSync(localDir)) {
      const filePath = path.join(localDir, file);

      if (configmap.statSync(filePath).isDirectory()) {
        continue;
      }

      if (!shouldInclude(file)) {
        continue;
      }

      const relativeFilePath = keyPrefix + file;
      this.addFile(filePath, relativeFilePath);
    }
  }

  /**
   * Adds an annotation to the supplied object that contains the checksum of the
   * config map contents.
   * @param obj Resource object to add the annotation to
   */
  public addChecksumTo(obj: base.Resource) {
    obj.metadata.addAnnotation(
      `checksum/${this.node.id}`,
      Lazy.any({
        produce: () => this.computeChecksum(),
      }),
    );
  }

  private verifyKeyAvailable(key: string) {
    if (key in this._data || key in this._binaryData) {
      throw new Error(
        `unable to add a ConfigMap entry with key "${key}". It is already used`,
      );
    }
  }

  private synthesizeData() {
    return undefinedIfEmpty(this._data);
  }

  private synthesizeBinaryData() {
    return undefinedIfEmpty(this._binaryData);
  }

  private computeChecksum() {
    return createHash('sha256')
      .update(stringify(this._data))
      .update(stringify(this._binaryData))
      .digest('hex');
  }
}

/**
 * Options for `configmap.addDirectory()`
 */
export interface AddDirectoryOptions {
  /**
   * A prefix to add to all keys in the config map.
   * @default ""
   */
  readonly keyPrefix?: string;

  /**
   * Glob patterns to exclude when adding files.
   * @default - include all files
   */
  readonly exclude?: string[];
}
