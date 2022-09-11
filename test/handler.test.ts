import { Container, Handler, k8s } from '../src';

test('fromCommand', () => {
  const container = new Container({ image: 'image' });
  const handler = Handler.fromCommand(['hello']);
  expect(handler._toKube(container).exec).toEqual({ command: ['hello'] });
});

test('fromHttpGet', () => {
  const container = new Container({ image: 'image' });
  const handler = Handler.fromHttpGet('/path');
  expect(handler._toKube(container).httpGet).toEqual({ path: '/path', port: k8s.IntOrString.fromNumber(80), scheme: 'HTTP' });
});

test('fromTcpSocket', () => {
  const container = new Container({ image: 'image' });
  const handler = Handler.fromTcpSocket({ port: 8888 });
  expect(handler._toKube(container).tcpSocket).toEqual({ port: k8s.IntOrString.fromNumber(8888) });
});