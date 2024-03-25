import { Container } from './container';
import * as k8s from './imports/k8s';
import { ConnectionScheme } from './probe';

/**
 * Utility class to implement the conversion between our API and the k8s action
 * structure. Used both for probes and handlers.
 *
 * @internal
 */
export class Action {

  public static fromTcpSocket(container: Container, options: { port?: number; host?: string } = {}): k8s.TcpSocketAction {
    return {
      port: k8s.IntOrString.fromNumber(options.port ?? container.portNumber ?? 80),
      host: options.host,
    };
  }

  public static fromCommand(command: string[]): k8s.ExecAction {
    return { command };
  }

  public static fromHttpGet(container: Container, path: string, options: {
    port?: number;
    scheme?: ConnectionScheme;
    host?: string;
  } = {}): k8s.HttpGetAction {
    return {
      path,
      port: k8s.IntOrString.fromNumber(options.port ?? container.portNumber ?? 80),
      scheme: options.scheme ?? ConnectionScheme.HTTP,
      host: options.host,
    };
  }
}
