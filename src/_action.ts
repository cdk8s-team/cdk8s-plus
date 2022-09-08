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

  public static fromHttpGet(container: Container, path: string, options: { port?: number; scheme?: ConnectionScheme } = { }): k8s.HttpGetAction {
    return {
      path,
      port: k8s.IntOrString.fromNumber(options.port ?? container.portNumber ?? 80),
      scheme: toHttpGetActionScheme(options.scheme ?? ConnectionScheme.HTTP),
    };
  }
}

function toHttpGetActionScheme(scheme: ConnectionScheme): k8s.IoK8SApiCoreV1HttpGetActionScheme {
  return k8s.IoK8SApiCoreV1HttpGetActionScheme[ConnectionScheme[scheme] as keyof typeof k8s.IoK8SApiCoreV1HttpGetActionScheme];
}