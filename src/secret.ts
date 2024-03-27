import { ApiObject } from 'cdk8s';
import { Construct } from 'constructs';
import * as base from './base';
import { EnvValue, EnvValueFromSecretOptions } from './container';
import * as k8s from './imports/k8s';
import * as serviceaccount from './service-account';

/**
 * Common properties for `Secret`.
 */
export interface CommonSecretProps extends base.ResourceProps {

  /**
   * If set to true, ensures that data stored in the Secret cannot be updated (only object metadata can be modified).
   * If not set to true, the field can be modified at any time.
   *
   * @default false
   */
  readonly immutable?: boolean;

}

/**
 * Options for `Secret`.
 */
export interface SecretProps extends CommonSecretProps {
  /**
   * stringData allows specifying non-binary secret data in string form. It is
   * provided as a write-only convenience method. All keys and values are merged
   * into the data field on write, overwriting any existing values. It is never
   * output when reading from the API.
   */
  readonly stringData?: { [key: string]: string };

  /**
   * Optional type associated with the secret.  Used to facilitate programmatic
   * handling of secret data by various controllers.
   *
   * @default undefined - Don't set a type.
   */
  readonly type?: string;

}

export interface ISecret extends base.IResource {
  /**
   * Returns EnvValue object from a secret's key.
   * @param key Secret's key
   * @param options Additional EnvValue options
   */
  envValue(key: string, options?: EnvValueFromSecretOptions): EnvValue;
}

/**
 * Represents a specific value in JSON secret.
 */
export interface SecretValue {
  /**
   * The secret
   */
  readonly secret: ISecret;

  /**
   * The JSON key
   */
  readonly key: string;
}

class ImportedSecret extends Construct implements ISecret {

  private readonly _name: string;

  public readonly resourceType = 'secrets';

  constructor(scope: Construct, id: string, name: string) {
    super(scope, id);
    this._name = name;
  }

  public get name(): string {
    return this._name;
  }

  public get apiVersion(): string {
    return k8s.KubeSecret.GVK.apiVersion;
  }

  public get apiGroup(): string {
    return '';
  }

  public get kind(): string {
    return k8s.KubeSecret.GVK.kind;
  }

  public get resourceName(): string {
    return this.name;
  }

  public envValue(key: string, options?: EnvValueFromSecretOptions): EnvValue {
    return EnvValue.fromSecretValue({ secret: this, key }, options);
  }

}

/**
 * Kubernetes Secrets let you store and manage sensitive information, such as
 * passwords, OAuth tokens, and ssh keys. Storing confidential information in a
 * Secret is safer and more flexible than putting it verbatim in a Pod
 * definition or in a container image.
 *
 * @see https://kubernetes.io/docs/concepts/configuration/secret
 */
export class Secret extends base.Resource implements ISecret {

  /**
   * Imports a secret from the cluster as a reference.
   */
  public static fromSecretName(scope: Construct, id: string, name: string): ISecret {
    return new ImportedSecret(scope, id, name);
  }

  /**
   * @see base.Resource.apiObject
   */
  protected readonly apiObject: ApiObject;

  public readonly resourceType = 'secrets';

  /**
   * Whether or not the secret is immutable.
   */
  public readonly immutable: boolean;

  private readonly stringData: { [key: string]: string };

  public constructor(scope: Construct, id: string, props: SecretProps = { }) {
    super(scope, id);

    this.stringData = props.stringData ?? {};

    this.immutable = props.immutable ?? false;
    this.apiObject = new k8s.KubeSecret(this, 'Resource', {
      metadata: props.metadata,
      type: props.type,
      stringData: this.stringData,
      immutable: this.immutable,
    });
  }

  /**
   * Adds a string data field to the secret.
   * @param key Key
   * @param value Value
   */
  public addStringData(key: string, value: string) {
    this.stringData[key] = value;
  }

  /**
   * Gets a string data by key or undefined
   * @param key Key
   */
  public getStringData(key: string): string | undefined {
    return this.stringData[key];
  }

  public envValue(key: string, options?: EnvValueFromSecretOptions): EnvValue {
    return EnvValue.fromSecretValue({ secret: this, key }, options);
  }
}

/**
 * Options for `BasicAuthSecret`.
 */
export interface BasicAuthSecretProps extends CommonSecretProps {
  /**
   * The user name for authentication
   */
  readonly username: string;

  /**
   * The password or token for authentication
   */
  readonly password: string;
}

/**
 * Create a secret for basic authentication.
 *
 * @see https://kubernetes.io/docs/concepts/configuration/secret/#basic-authentication-secret
 */
export class BasicAuthSecret extends Secret {
  public constructor(scope: Construct, id: string, props: BasicAuthSecretProps) {
    super(scope, id, {
      type: 'kubernetes.io/basic-auth',
      stringData: {
        username: props.username,
        password: props.password,
      },
      immutable: props.immutable,
      metadata: props.metadata,
    });
  }
}

/**
 * Options for `SshAuthSecret`.
 */
export interface SshAuthSecretProps extends CommonSecretProps {
  /**
   * The SSH private key to use
   */
  readonly sshPrivateKey: string;
}

/**
 * Create a secret for ssh authentication.
 *
 * @see https://kubernetes.io/docs/concepts/configuration/secret/#ssh-authentication-secrets
 */
export class SshAuthSecret extends Secret {
  public constructor(scope: Construct, id: string, props: SshAuthSecretProps) {
    super(scope, id, {
      type: 'kubernetes.io/ssh-auth',
      stringData: {
        'ssh-privatekey': props.sshPrivateKey,
      },
      immutable: props.immutable,
      metadata: props.metadata,
    });
  }
}

/**
 * Options for `ServiceAccountTokenSecret`.
 */
export interface ServiceAccountTokenSecretProps extends CommonSecretProps {
  /**
   * The service account to store a secret for
   */
  readonly serviceAccount: serviceaccount.IServiceAccount;
}

/**
 * Create a secret for a service account token.
 *
 * @see https://kubernetes.io/docs/concepts/configuration/secret/#service-account-token-secrets
 */
export class ServiceAccountTokenSecret extends Secret {
  public constructor(scope: Construct, id: string, props: ServiceAccountTokenSecretProps) {
    super(scope, id, {
      type: 'kubernetes.io/service-account-token',
      metadata: props.metadata,
      immutable: props.immutable,
    });

    this.metadata.addAnnotation('kubernetes.io/service-account.name', props.serviceAccount.name);
  }
}

/**
 * Options for `TlsSecret`.
 */
export interface TlsSecretProps extends CommonSecretProps {
  /**
   * The TLS cert
   */
  readonly tlsCert: string;

  /**
   * The TLS key
   */
  readonly tlsKey: string;
}

/**
 * Create a secret for storing a TLS certificate and its associated key.
 *
 * @see https://kubernetes.io/docs/concepts/configuration/secret/#tls-secrets
 */
export class TlsSecret extends Secret {
  public constructor(scope: Construct, id: string, props: TlsSecretProps) {
    super(scope, id, {
      type: 'kubernetes.io/tls',
      stringData: {
        'tls.crt': props.tlsCert,
        'tls.key': props.tlsKey,
      },
      immutable: props.immutable,
      metadata: props.metadata,
    });
  }
}

/**
 * Options for `DockerConfigSecret`.
 */
export interface DockerConfigSecretProps extends CommonSecretProps {
  /**
   * JSON content to provide for the `~/.docker/config.json` file. This will
   * be stringified and inserted as stringData.
   *
   * @see https://docs.docker.com/engine/reference/commandline/cli/#sample-configuration-file
   */
  readonly data: { [key: string]: any };
}

/**
 * Create a secret for storing credentials for accessing a container image
 * registry.
 *
 * @see https://kubernetes.io/docs/concepts/configuration/secret/#docker-config-secrets
 */
export class DockerConfigSecret extends Secret {
  public constructor(scope: Construct, id: string, props: DockerConfigSecretProps) {
    super(scope, id, {
      type: 'kubernetes.io/dockerconfigjson',
      stringData: {
        '.dockerconfigjson': JSON.stringify(props.data),
      },
      immutable: props.immutable,
      metadata: props.metadata,
    });
  }
}
