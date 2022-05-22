import * as _action from './_action';
import * as container from './container';
import * as k8s from './imports/k8s';

/**
 * Options for `Handler.fromTcpSocket`.
 */
export interface HandlerFromTcpSocketOptions {
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
 * Options for `Handler.fromHttpGet`.
 */
export interface HandlerFromHttpGetOptions {

  /**
   * The TCP port to use when sending the GET request.
   *
   * @default - defaults to `container.port`.
   */
  readonly port?: number;

}

/**
 * Defines a specific action that should be taken.
 */
export class Handler {

  /**
   * Defines a handler based on an HTTP GET request to the IP address of the container.
   *
   * @param path The URL path to hit
   * @param options Options
   */
  public static fromHttpGet(path: string, options: HandlerFromHttpGetOptions = {}): Handler {
    return new Handler(undefined, undefined, { path, ...options });
  }

  /**
   * Defines a handler based on a command which is executed within the container.
   *
   * @param command The command to execute
   */
  public static fromCommand(command: string[]): Handler {
    return new Handler(undefined, { command }, undefined);
  }

  /**
   * Defines a handler based opening a connection to a TCP socket on the container.
   *
   * @param options Options
   */
  public static fromTcpSocket(options: HandlerFromTcpSocketOptions = {}): Handler {
    return new Handler(options, undefined, undefined);
  }

  private constructor(
    private readonly tcpSocketOptions?: HandlerFromTcpSocketOptions,
    private readonly commandOptions?: { command: string[] },
    private readonly httpGetOptions?: { path: string } & HandlerFromHttpGetOptions) {}

  /**
   * @internal
   */
  public _toKube(cont: container.Container): k8s.LifecycleHandler {

    const exec = this.commandOptions ? _action.Action.fromCommand(this.commandOptions.command) : undefined;
    const httpGet = this.httpGetOptions ? _action.Action.fromHttpGet(cont, this.httpGetOptions.path, this.httpGetOptions) : undefined;
    const tcpSocket = this.tcpSocketOptions ? _action.Action.fromTcpSocket(cont, this.tcpSocketOptions) : undefined;

    return { exec, httpGet, tcpSocket };
  }

}