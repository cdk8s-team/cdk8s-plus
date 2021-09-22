# cdk8s+ (cdk8s-plus)

### High level constructs for Kubernetes

![Stability:Beta](https://img.shields.io/badge/stability-beta-orange)
[![cdk8s-plus-22](https://img.shields.io/github/workflow/status/cdk8s-team/cdk8s-plus/release-k8s.22?label=cdk8s-plus-22&logo=GitHub)](https://github.com/cdk8s-team/cdk8s-plus/actions/workflows/release-k8s.22.yml)
[![cdk8s-plus-21](https://img.shields.io/github/workflow/status/cdk8s-team/cdk8s-plus/release-k8s.21?label=cdk8s-plus-21&logo=GitHub)](https://github.com/cdk8s-team/cdk8s-plus/actions/workflows/release-k8s.21.yml)
[![cdk8s-plus-20](https://img.shields.io/github/workflow/status/cdk8s-team/cdk8s-plus/release-k8s.20?label=cdk8s-plus-20&logo=GitHub)](https://github.com/cdk8s-team/cdk8s-plus/actions/workflows/release-k8s.20.yml)

| k8s version | npm (JS/TS) | PyPI (Python) | NuGet (C#) | Maven (Java) | Go |
| --- | --- | --- | --- | --- | --- |
| 1.20.0 | [Link](https://www.npmjs.com/package/cdk8s-plus-20) | [Link](https://pypi.org/project/cdk8s-plus-20/) | [Link](https://www.nuget.org/packages/Org.Cdk8s.Plus20) | [Link](https://search.maven.org/artifact/org.cdk8s/cdk8s-plus-20) | [Link](https://github.com/cdk8s-team/cdk8s-plus-go/tree/k8s.20) |
| 1.21.0 | [Link](https://www.npmjs.com/package/cdk8s-plus-21) | [Link](https://pypi.org/project/cdk8s-plus-21/) | [Link](https://www.nuget.org/packages/Org.Cdk8s.Plus21) | [Link](https://search.maven.org/artifact/org.cdk8s/cdk8s-plus-21) | [Link](https://github.com/cdk8s-team/cdk8s-plus-go/tree/k8s.21) |
| 1.22.0 | [Link](https://www.npmjs.com/package/cdk8s-plus-22) | [Link](https://pypi.org/project/cdk8s-plus-22/) | [Link](https://www.nuget.org/packages/Org.Cdk8s.Plus22) | [Link](https://search.maven.org/artifact/org.cdk8s/cdk8s-plus-22) | [Link](https://github.com/cdk8s-team/cdk8s-plus-go/tree/k8s.22) |

**cdk8s+** is a software development framework that provides high level
abstractions for authoring Kubernetes applications. Built on top of the auto
generated building blocks provided by [cdk8s](../cdk8s), this library includes a
hand crafted *construct* for each native kubernetes object, exposing richer
API's with reduced complexity.

## :books: Getting started & Documentation

See [cdk8s.io](https://cdk8s.io/docs/latest/plus).

## :raised_hand: Contributing

If you'd like to add a new feature or fix a bug, please visit
[CONTRIBUTING.md](CONTRIBUTING.md)!

## :question: FAQ

### What's the difference between cdk8s+ 20, cdk8s+ 21, and cdk8s+ 22?

These are separately vended libraries that all provide the same Kubernetes
abstractions (as much as possible). The essential difference is that cdk8s+ 20
generates Kubernetes YAMLs for the Kubernetes 1.20.0 API specification, cd8s+ 21
generates Kubernetes YAMLs for the Kubernetes 1.21.0 API specification, and
cdk8s+ 22 generates Kubernetes YAMLs for the Kubernetes 1.22.0 API
specification.

We offer the three latest versions because each Kubernetes version can
potentially add, remove, or deprecate entire APIs. In addition, the Kubernetes
project guarantees that they will maintain release branches of the three latest
versions (currently 1.22, 1.21, 1.20).

### Which versions of kubernetes can I use with cdk8s-plus-X?

cdk8s-plus-X is designed to work with Kubernetes version 1.X. Our goal with
cdk8s+ is that if your code compiles, then you should be able to deploy it to
your cluster.

As long as you are using stable APIs (those that are not in alpha or beta),
manifests generated in version X should working in Kubernetes versions X and
above. Resources that are not stable are labeled accordingly with a suffix, e.g.
`IngressV1Beta1`.

For example, if you create a manifest using the `Deployment` construct with
cdk8s-plus-21, then it will continue working in Kubernetes 1.22.0 and onwards.

In addition, if you create a manifest using cdk8s-plus-X, you can deploy it to
older versions of Kubernetes as long as you are not using features that were
newly added in Kubernetes 1.X.

The [Kubernetes Deprecation Policy] specifies that stable and beta APIs will
continue being supported for 3 more versions after the version in which they are
deprecated. Because of this, some versions of cdk8s+ may have multiple versions
of resources available (such as `Ingress` and `IngressV1Beta`) since even though
one is deprecated, it is still possible to deploy either to your cluster.

[Kubernetes Deprecation Policy]:
https://kubernetes.io/docs/reference/using-api/deprecation-policy/

## :balance_scale: License

This project is distributed under the [Apache License, Version 2.0](./LICENSE).

This module is part of the [cdk8s project](https://github.com/cdk8s-team).
