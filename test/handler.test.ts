import { Container, Handler } from '../src';
import { IntOrString } from '../src/imports/k8s';

test('fromCommand', () => {
  const container = new Container({ image: 'image' });
  const handler = Handler.fromCommand(['hello']);
  expect(handler._toKube(container).exec).toEqual({ command: ['hello'] });
});

test('fromHttpGet', () => {
  const container = new Container({ image: 'image' });
  const handler = Handler.fromHttpGet('/path');
  expect(handler._toKube(container).httpGet).toEqual({ path: '/path', port: IntOrString.fromNumber(80) });
});

test('fromTcpSocket', () => {
  const container = new Container({ image: 'image' });
  const handler = Handler.fromTcpSocket({ port: 8888 });
  expect(handler._toKube(container).tcpSocket).toEqual({ port: IntOrString.fromNumber(8888) });
});