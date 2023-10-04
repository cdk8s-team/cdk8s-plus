import { Testing, ApiObject } from 'cdk8s';
import { Node } from 'constructs';
import { Ingress, IngressBackend, Secret, Service } from '../src';

test('defaultChild', () => {

  const chart = Testing.chart();

  const defaultChild = Node.of(new Ingress(chart, 'Ingress')).defaultChild as ApiObject;

  expect(defaultChild.kind).toEqual('Ingress');

});

test('IngressClassName can be set', () => {
  // GIVEN
  const chart = Testing.chart();
  const service = new Service(chart, 'my-service', { ports: [{ port: 80 }] } );

  // WHEN
  new Ingress(chart, 'my-ingress', {
    defaultBackend: IngressBackend.fromService(service),
    className: 'myIngressClassName',
  });

  // THEN
  expect(Testing.synth(chart).filter(x => x.kind === 'Ingress')).toStrictEqual([
    {
      apiVersion: 'networking.k8s.io/v1',
      kind: 'Ingress',
      metadata: { name: 'test-my-ingress-c8135042' },
      spec: {
        defaultBackend: {
          service: {
            name: 'test-my-service-c8493104',
            port: { number: 80 },
          },
        },
        ingressClassName: 'myIngressClassName',
      },
    },
  ]);
});

describe('IngressBackend', () => {
  describe('fromService', () => {
    test('if the service exposes a port, it will be used by the ingress', () => {
      // GIVEN
      const chart = Testing.chart();
      const service = new Service(chart, 'my-service');

      // WHEN
      service.bind(8899);

      // THEN
      expect(IngressBackend.fromService(service)._toKube()).toEqual({
        service: {
          name: 'test-my-service-c8493104',
          port: { number: 8899 },
        },
      });
    });

    test('fails if the service does not expose a port', () => {
      // GIVEN
      const chart = Testing.chart();
      const service = new Service(chart, 'my-service');

      // THEN
      expect(() => IngressBackend.fromService(service)).toThrow(/service does not expose any ports/);
    });


    test('fails if a port is explicitly specified, and the service is exposed through a different port', () => {
      // GIVEN
      const chart = Testing.chart();
      const service = new Service(chart, 'my-service');

      // WHEN
      service.bind(6011);

      // THEN
      expect(() => IngressBackend.fromService(service, { port: 7766 })).toThrow(/backend defines port 7766 but service exposes port 6011/);
    });

    test('service exposes a single port and its the same as the backend', () => {
      // GIVEN
      const chart = Testing.chart();
      const service = new Service(chart, 'my-service');

      // WHEN
      service.bind(6011);

      // THEN
      expect(IngressBackend.fromService(service, { port: 6011 })._toKube()).toEqual({
        service: {
          name: 'test-my-service-c8493104',
          port: { number: 6011 },
        },
      });
    });

    test('service exposes multiple ports and the backend uses one of them', () => {
      // GIVEN
      const chart = Testing.chart();
      const service = new Service(chart, 'my-service');

      // WHEN
      service.bind(6011);
      service.bind(8899);
      service.bind(1011);

      // THEN
      expect(IngressBackend.fromService(service, { port: 8899 })._toKube()).toEqual({
        service: {
          name: 'test-my-service-c8493104',
          port: { number: 8899 },
        },
      });
    });

    test('fails if backend does not specify port and service exposes multiple ports', () => {
      // GIVEN
      const chart = Testing.chart();
      const service = new Service(chart, 'my-service');

      // WHEN
      service.bind(6011);
      service.bind(1111);

      // THEN
      expect(() => IngressBackend.fromService(service)).toThrow(/unable to determine service port since service exposes multiple ports/);
    });

    test('service exposes multiple ports and backend uses a different one', () => {
      // GIVEN
      const chart = Testing.chart();
      const service = new Service(chart, 'my-service');

      // WHEN
      service.bind(6011);
      service.bind(1111);

      // THEN
      expect(() => IngressBackend.fromService(service, { port: 1234 })).toThrow(/service exposes ports 6011,1111 but backend is defined to use port 1234/);
    });
  });

  test('fromResource', () => {

    const chart = Testing.chart();
    const service = new Service(chart, 'my-service');

    // THEN
    expect(IngressBackend.fromResource(service)._toKube()).toEqual({
      resource: {
        apiGroup: 'core',
        kind: 'Service',
        name: 'test-my-service-c8493104',
      },
    });

  });

});

describe('Ingress', () => {

  describe('default backend', () => {

    test('defaultBackend property', () => {
      // GIVEN
      const chart = Testing.chart();
      const service = new Service(chart, 'my-service', { ports: [{ port: 80 }] } );

      // WHEN
      new Ingress(chart, 'my-ingress', {
        defaultBackend: IngressBackend.fromService(service),
      });

      // THEN
      expect(Testing.synth(chart).filter(x => x.kind === 'Ingress')).toStrictEqual([
        {
          apiVersion: 'networking.k8s.io/v1',
          kind: 'Ingress',
          metadata: { name: 'test-my-ingress-c8135042' },
          spec: {
            defaultBackend: {
              service: {
                name: 'test-my-service-c8493104',
                port: { number: 80 },
              },
            },
          },
        },
      ]);
    });

    test('addDefaultBackend()', () => {
      // GIVEN
      const chart = Testing.chart();
      const service = new Service(chart, 'my-service', { ports: [{ port: 80 }] } );

      // WHEN
      const ingress = new Ingress(chart, 'my-ingress');
      ingress.addDefaultBackend(IngressBackend.fromService(service));

      // THEN
      expect(Testing.synth(chart).filter(x => x.kind === 'Ingress')).toStrictEqual([
        {
          apiVersion: 'networking.k8s.io/v1',
          kind: 'Ingress',
          metadata: { name: 'test-my-ingress-c8135042' },
          spec: {
            defaultBackend: {
              service: {
                name: 'test-my-service-c8493104',
                port: { number: 80 },
              },
            },
          },
        },
      ]);
    });

  });

  test('addHostDefaultBackend()', () => {
    // GIVEN
    const chart = Testing.chart();
    const service = new Service(chart, 'my-service', { ports: [{ port: 80 }] } );

    // WHEN
    const ingress = new Ingress(chart, 'my-ingress');
    ingress.addHostDefaultBackend('my.host', IngressBackend.fromService(service));

    // THEN
    expect(Testing.synth(chart).filter(x => x.kind === 'Ingress')).toStrictEqual([
      {
        apiVersion: 'networking.k8s.io/v1',
        kind: 'Ingress',
        metadata: { name: 'test-my-ingress-c8135042' },
        spec: {
          rules: [{
            host: 'my.host',
            http: {
              paths: [
                {
                  path: '/',
                  pathType: 'Prefix',
                  backend: {
                    service: {
                      name: 'test-my-service-c8493104',
                      port: { number: 80 },
                    },
                  },
                },
              ],
            },
          }],
        },
      },
    ]);
  });

  test('addHostRule()', () => {
    // GIVEN
    const chart = Testing.chart();
    const service = new Service(chart, 'my-service', { ports: [{ port: 80 }] } );

    // WHEN
    const ingress = new Ingress(chart, 'my-ingress');
    ingress.addHostRule('my.host', '/foo', IngressBackend.fromService(service));
    ingress.addHostRule('my.host', '/bar', IngressBackend.fromService(service));
    ingress.addHostRule('your.host', '/', IngressBackend.fromService(service));

    // THEN
    expect(Testing.synth(chart).filter(x => x.kind === 'Ingress')).toStrictEqual([
      {
        apiVersion: 'networking.k8s.io/v1',
        kind: 'Ingress',
        metadata: { name: 'test-my-ingress-c8135042' },
        spec: {
          rules: [
            {
              host: 'my.host',
              http: {
                paths: [
                  {
                    path: '/bar',
                    pathType: 'Prefix',
                    backend: {
                      service: {
                        name: 'test-my-service-c8493104',
                        port: { number: 80 },
                      },
                    },
                  },
                  {
                    path: '/foo',
                    pathType: 'Prefix',
                    backend: {
                      service: {
                        name: 'test-my-service-c8493104',
                        port: { number: 80 },
                      },
                    },
                  },
                ],
              },
            },
            {
              host: 'your.host',
              http: {
                paths: [
                  {
                    path: '/',
                    pathType: 'Prefix',
                    backend: {
                      service: {
                        name: 'test-my-service-c8493104',
                        port: { number: 80 },
                      },
                    },
                  },
                ],
              },
            },
          ],
        },
      },
    ]);
  });

  test('addRule()', () => {
    // GIVEN
    const chart = Testing.chart();
    const service = new Service(chart, 'my-service', { ports: [{ port: 80 }] } );

    // WHEN
    const ingress = new Ingress(chart, 'my-ingress');
    ingress.addRule('/foo', IngressBackend.fromService(service));
    ingress.addRule('/foo/bar', IngressBackend.fromService(service));

    // THEN
    expect(Testing.synth(chart).filter(x => x.kind === 'Ingress')).toStrictEqual([
      {
        apiVersion: 'networking.k8s.io/v1',
        kind: 'Ingress',
        metadata: { name: 'test-my-ingress-c8135042' },
        spec: {
          rules: [
            {
              http: {
                paths: [
                  {
                    path: '/foo',
                    pathType: 'Prefix',
                    backend: {
                      service: {
                        name: 'test-my-service-c8493104',
                        port: { number: 80 },
                      },
                    },
                  },
                  {
                    path: '/foo/bar',
                    pathType: 'Prefix',
                    backend: {
                      service: {
                        name: 'test-my-service-c8493104',
                        port: { number: 80 },
                      },
                    },
                  },
                ],
              },
            },
          ],
        },
      },
    ]);
  });

  test('define rules upon initialization', () => {
    // GIVEN
    const chart = Testing.chart();
    const service = new Service(chart, 'my-service');
    service.bind(4000);

    // WHEN
    new Ingress(chart, 'my-ingress', {
      rules: [
        { backend: IngressBackend.fromService(service) }, // default backend
        { host: 'foo.bar', backend: IngressBackend.fromService(service) },
        { path: '/just/path', backend: IngressBackend.fromService(service) },
        { host: 'host.and', path: '/path', backend: IngressBackend.fromService(service) },
        { host: 'host.and', path: '/path/2', backend: IngressBackend.fromService(service) },
      ],
    });

    // THEN
    const expectedBackend = { service: { name: 'test-my-service-c8493104', port: { number: 4000 } } };
    expect(Testing.synth(chart).filter(x => x.kind === 'Ingress')).toEqual([
      {
        apiVersion: 'networking.k8s.io/v1',
        kind: 'Ingress',
        metadata: {
          name: 'test-my-ingress-c8135042',
        },
        spec: {
          defaultBackend: expectedBackend,
          rules: [
            {
              host: 'foo.bar',
              http: {
                paths: [
                  { path: '/', pathType: 'Prefix', backend: expectedBackend },
                ],
              },
            },
            {
              http: {
                paths: [
                  { path: '/just/path', pathType: 'Prefix', backend: expectedBackend },
                ],
              },
            },
            {
              host: 'host.and',
              http: {
                paths: [
                  { path: '/path', pathType: 'Prefix', backend: expectedBackend },
                  { path: '/path/2', pathType: 'Prefix', backend: expectedBackend },
                ],
              },
            },
          ],
        },
      },
    ]);
  });

  describe('fails for duplicate rules', () => {

    test('using addDefaultBackend()', () => {
      // GIVEN
      const chart = Testing.chart();
      const service = new Service(chart, 'my-service');
      service.bind(4000);

      // WHEN
      const ingress = new Ingress(chart, 'ingress', {
        defaultBackend: IngressBackend.fromService(service),
      });

      // THEN
      expect(() => ingress.addDefaultBackend(IngressBackend.fromService(service))).toThrow(/a default backend is already defined for this ingress/);

    });

    test('defaultBackend and rules', () => {
      // GIVEN
      const chart = Testing.chart();
      const service = new Service(chart, 'my-service');
      service.bind(4000);

      // THEN
      expect(() => new Ingress(chart, 'ingress', {
        defaultBackend: IngressBackend.fromService(service),
        rules: [{ backend: IngressBackend.fromService(service) }],
      })).toThrow(/a default backend is already defined for this ingress/);
    });

    test('two rules for the same path (no host)', () => {
      // GIVEN
      const chart = Testing.chart();
      const service = new Service(chart, 'my-service');
      service.bind(4000);
      const ingress = new Ingress(chart, 'ingress');

      // WHEN
      ingress.addRule('/foo', IngressBackend.fromService(service));
      expect(() => ingress.addRule('/foo', IngressBackend.fromService(service))).toThrow(/there is already an ingress rule for \/foo/);
    });

    test('two rules for the same path and host', () => {
      // GIVEN
      const chart = Testing.chart();
      const service = new Service(chart, 'my-service');
      service.bind(4000);
      const ingress = new Ingress(chart, 'ingress');

      // WHEN
      ingress.addHostRule('hello.io', '/foo', IngressBackend.fromService(service));
      expect(() => ingress.addHostRule('hello.io', '/foo', IngressBackend.fromService(service))).toThrow(/there is already an ingress rule for hello.io\/foo/);
    });
  });

  test('fails if path does not begin with "/"', () => {
    // GIVEN
    const chart = Testing.chart();
    const service = new Service(chart, 'my-service');
    service.bind(4000);
    const ingress = new Ingress(chart, 'ingress');

    // THEN
    expect(() => ingress.addRule('bad/path', IngressBackend.fromService(service))).toThrow(/ingress paths must begin with a "\/": bad\/path/);
  });

  test('fails if no rules or default backend are specified', () => {
    // GIVEN
    const chart = Testing.chart();
    const service = new Service(chart, 'my-service');
    service.bind(4000);
    new Ingress(chart, 'ingress');

    // THEN
    expect(() => Testing.synth(chart)).toThrow(/ingress with no rules or default backend/);
  });

  test('addTls()', () => {
    // GIVEN
    const chart = Testing.chart();
    const service = new Service(chart, 'my-service', { ports: [{ port: 80 }] } );
    const tls_secret = new Secret(chart, 'my-tls-secret', {
      metadata: { name: 'my-tls-secret' },
    });

    // WHEN
    const ingress = new Ingress(chart, 'my-ingress');
    ingress.addHostDefaultBackend('my.host', IngressBackend.fromService(service));
    ingress.addTls([{
      hosts: ['my.host'],
      secret: tls_secret,
    }]);

    // THEN
    expect(Testing.synth(chart).filter(x => x.kind === 'Ingress')).toStrictEqual([
      {
        apiVersion: 'networking.k8s.io/v1',
        kind: 'Ingress',
        metadata: { name: 'test-my-ingress-c8135042' },
        spec: {
          rules: [{
            host: 'my.host',
            http: {
              paths: [
                {
                  path: '/',
                  pathType: 'Prefix',
                  backend: {
                    service: {
                      name: 'test-my-service-c8493104',
                      port: { number: 80 },
                    },
                  },
                },
              ],
            },
          }],
          tls: [{
            hosts: ['my.host'],
            secretName: tls_secret.name,
          }],
        },
      },
    ]);
  });

  test('define tls upon initialization', () => {
    // GIVEN
    const chart = Testing.chart();
    const service = new Service(chart, 'my-service', { ports: [{ port: 80 }] } );
    const tls_secret = new Secret(chart, 'my-tls-secret', {
      metadata: { name: 'my-tls-secret' },
    });

    // WHEN
    const ingress = new Ingress(chart, 'my-ingress', {
      tls: [{
        hosts: ['my.host'],
        secret: tls_secret,
      }],
    });
    ingress.addHostDefaultBackend('my.host', IngressBackend.fromService(service));

    // THEN
    expect(Testing.synth(chart).filter(x => x.kind === 'Ingress')).toStrictEqual([
      {
        apiVersion: 'networking.k8s.io/v1',
        kind: 'Ingress',
        metadata: { name: 'test-my-ingress-c8135042' },
        spec: {
          rules: [{
            host: 'my.host',
            http: {
              paths: [
                {
                  path: '/',
                  pathType: 'Prefix',
                  backend: {
                    service: {
                      name: 'test-my-service-c8493104',
                      port: { number: 80 },
                    },
                  },
                },
              ],
            },
          }],
          tls: [{
            hosts: ['my.host'],
            secretName: tls_secret.name,
          }],
        },
      },
    ]);
  });
});
