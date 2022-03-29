import { Container } from './container';
import * as k8s from './imports/k8s';

/**
 * Utility class to implement the conversion between our API and the k8s action
 * structure. Used both for probes and handlers.
 *
 * @internal
 */
export class Action {

  public static fromTcpSocket(container: Container, options: { port?: number; host?: string } = {}): k8s.TcpSocketAction {
    return {
      port: k8s.IntOrString.fromNumber(options.port ?? container.port ?? 80),
      host: options.host,
    };
  }

  public static fromCommand(command: string[]): k8s.ExecAction {
    return { command };
  }

  public static fromHttpGet(container: Container, path: string, options: { port?: number } = { }): k8s.HttpGetAction {
    return {
      path,
      port: k8s.IntOrString.fromNumber(options.port ?? container.port ?? 80),
    };
  }
}