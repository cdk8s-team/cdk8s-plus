import { Duration } from 'cdk8s';
import * as _action from './_action';
import * as container from './container';
import * as k8s from './imports/k8s';

/**
 * Probe options.
 */
export interface ProbeOptions {
  /**
   * Minimum consecutive failures for the probe to be considered failed after
   * having succeeded.
   *
   * Defaults to 3. Minimum value is 1.
   *
   * @default 3
   */
  readonly failureThreshold?: number;

  /**
   * Number of seconds after the container has started before liveness probes
   * are initiated.
   *
   * @see https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle#container-probes
   * @default - immediate
   */
  readonly initialDelaySeconds?: Duration;

  /**
   * How often (in seconds) to perform the probe.
   *
   * Default to 10 seconds. Minimum value is 1.
   *
   * @default Duration.seconds(10) Minimum value is 1.
   */
  readonly periodSeconds?: Duration;

  /**
   * Minimum consecutive successes for the probe to be considered successful
   * after having failed. Defaults to 1.
   *
   * Must be 1 for liveness and startup. Minimum value is 1.
   *
   * @default 1 Must be 1 for liveness and startup. Minimum value is 1.
   */
  readonly successThreshold?: number;

  /**
   * Number of seconds after which the probe times out.
   *
   * Defaults to 1 second. Minimum value is 1.
   *
   * @see https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle#container-probes
   * @default Duration.seconds(1)
   */
  readonly timeoutSeconds?: Duration;
}

export enum ConnectionScheme {
  /**
   * Use HTTP request for connecting to host.
   */
  HTTP = 'HTTP',

  /**
   * Use HTTPS request for connecting to host.
   */
  HTTPS = 'HTTPS'
}

/**
 * Options for `Probe.fromHttpGet()`.
 */
export interface HttpGetProbeOptions extends ProbeOptions {
  /**
   * The TCP port to use when sending the GET request.
   *
   * @default - defaults to `container.port`.
   */
  readonly port?: number;

  /**
   *  Scheme to use for connecting to the host (HTTP or HTTPS).
   *
   *  @default ConnectionScheme.HTTP
   */
  readonly scheme?: ConnectionScheme;

  /**
   * The host name to connect to on the container.
   *
   * @default - defaults to the pod IP
   */
  readonly host?: string;
}

/**
 * Options for `Probe.fromCommand()`.
 */
export interface CommandProbeOptions extends ProbeOptions {

}

/**
 * Options for `Probe.fromTcpSocket()`.
 */
export interface TcpSocketProbeOptions extends ProbeOptions {
  /**
   * The TCP port to connect to on the container.
   *
   * @default - defaults to `container.port`.
   */
  readonly port?: number;

  /**
   * The host name to connect to on the container.
   *
   * @default - defaults to the pod IP
   */
  readonly host?: string;
}

/**
 * Probe describes a health check to be performed against a container to
 * determine whether it is alive or ready to receive traffic.
 */
export class Probe {

  /**
   * Defines a probe based on an HTTP GET request to the IP address of the container.
   *
   * @param path The URL path to hit
   * @param options Options
   */
  public static fromHttpGet(path: string, options: HttpGetProbeOptions = {}): Probe {
    return new Probe(options, undefined, undefined, { path, ...options });
  }

  /**
   * Defines a probe based on a command which is executed within the container.
   *
   * @param command The command to execute
   * @param options Options
   */
  public static fromCommand(command: string[], options: CommandProbeOptions = {}): Probe {
    return new Probe(options, undefined, { command, ...options }, undefined);
  }

  /**
   * Defines a probe based opening a connection to a TCP socket on the container.
   *
   * @param options Options
   */
  public static fromTcpSocket(options: TcpSocketProbeOptions = {}): Probe {
    return new Probe(options, options, undefined, undefined);
  }

  private constructor(
    private readonly probeOptions: ProbeOptions,
    private readonly tcpSocketOptions?: TcpSocketProbeOptions,
    private readonly commandOptions?: { command: string[] } & ProbeOptions,
    private readonly httpGetOptions?: { path: string } & HttpGetProbeOptions) {}

  /**
   * @internal
   */
  public _toKube(cont: container.Container): k8s.Probe {

    const exec = this.commandOptions ? _action.Action.fromCommand(this.commandOptions.command) : undefined;
    const httpGet = this.httpGetOptions ? _action.Action.fromHttpGet(cont, this.httpGetOptions.path, this.httpGetOptions) : undefined;
    const tcpSocket = this.tcpSocketOptions ? _action.Action.fromTcpSocket(cont, this.tcpSocketOptions) : undefined;

    return {
      failureThreshold: this.probeOptions.failureThreshold ?? 3,
      initialDelaySeconds: this.probeOptions.initialDelaySeconds ? this.probeOptions.initialDelaySeconds.toSeconds() : undefined,
      periodSeconds: this.probeOptions.periodSeconds ? this.probeOptions.periodSeconds.toSeconds() : undefined,
      successThreshold: this.probeOptions.successThreshold,
      timeoutSeconds: this.probeOptions.timeoutSeconds ? this.probeOptions.timeoutSeconds.toSeconds() : undefined,
      exec: exec,
      httpGet,
      tcpSocket,
    };
  }
}
