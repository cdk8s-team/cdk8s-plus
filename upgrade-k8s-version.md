# How to Upgrade CDK8s+/CDK8s to a new Kubernetes version

This document describes the changes required in order to upgrade CDK8s+/CDK8s to support a new Kubernetes version. These steps should be executed in order.

## :one: Prerequisite

### Add new k8s spec to cdk8s repo

1. ([cdk8s repo](https://github.com/cdk8s-team/cdk8s)): Generate [`kubernetes-schema/vX.XX.X/_definitions.json`](https://github.com/cdk8s-team/cdk8s/tree/master/kubernetes-schemas)

    ```sh
    tools/import-spec.sh x.xx.x
    # provide the new version number e.g. 1.25.0
    ```

2. Create PR, review then merge the updated spec into cdk8s/master branch ([e.g. v25 PR](https://github.com/cdk8s-team/cdk8s/pull/1007)).

### Publish new branch to cdk8s-plus-go repo

3. ([cdk8s-plus-go repo](https://github.com/cdk8s-team/cdk8s-plus-go)): Create and publish a new branch for the new k8s version

    ```sh
    git checkout -b k8s.xx
    # e.g. k8s.25 for version 1.25.0
    git push --set-upstream origin k8s.xx
    ```

### Create a new backport label in cdk8s-plus' GitHub

4. Open the [cdk8s-plus GitHub label list](https://github.com/cdk8s-team/cdk8s-plus/issues/labels)

5. Add a new label for the **current** Kubernetes version.
   - Label name: `backport-to-k8s-XX/main`
   - Label color: `#F53E94`

  e.g. If you were upgrading from v24 -> v25 the new label would be `backport-to-k8s-24/main`

## :two: Create the new CDK8s+ branch

6. Create a new branch of CDK8s+ starting from the current latest K8s version branch. The new branch should be named `k8s-XX/main` (e.g. `k8s-25/main` for K8s v1.25.0).

7. On the new branch update the following:

     1. ([`.projenrc.ts`](https://github.com/cdk8s-team/cdk8s-plus/blob/k8s-24/main/.projenrc.ts)): Update `LATEST_SUPPORTED_K8S_VERSION` and `SPEC_VERSION` with the new version.

        ```ts
        // the latest version of k8s we support
        const LATEST_SUPPORTED_K8S_VERSION = 25; // <-- Upgraded from 24 to 25

        // the version of k8s this branch supports
        const SPEC_VERSION = '25'; // <-- Upgraded from 24 to 25
        ```

     2. ([`.projenrc.ts`](https://github.com/cdk8s-team/cdk8s-plus/blob/k8s-24/main/.projenrc.ts)): In the `JsiiProject()` edit `depsUpgradeOptions` to include a the oldest supported branch of k8s.

        ```ts
        const LATEST_SUPPORTED_K8S_VERSION = 25 // <-- Upgraded from 24 to 25
        const project = new cdk.JsiiProject({
        ...
        depsUpgradeOptions: {
            workflowOptions: {
              branches: [
                `k8s-${LATEST_SUPPORTED_K8S_VERSION}/main`, // was 24, now is 25
                `k8s-${LATEST_SUPPORTED_K8S_VERSION - 1}/main`, // was 23, now is 24
                `k8s-${LATEST_SUPPORTED_K8S_VERSION - 2}/main`, // was 22, now is 23
              ],
            ...
            },
        },
        });
        ```

     3. ([`README.md`](https://github.com/cdk8s-team/cdk8s-plus/blob/k8s-24/main/README.md)): Add the new version. i.e. Add a markdown status badge, and a new row in the supported k8s version table.

8. Import the k8s spec that you merged into cdk8s during the prerequisite.

```sh
yarn run import
# warning `yarn import` is a native yarn command so be sure to include `run`
```

9. Start up a local Kubernetes cluster using the same version that you are upgrading to. Make sure kubectl on your machine is configured to connect to it.

10. Generate API types from the local Kubernetes cluster

```sh
yarn regenerate-api-information
# Updates ./api-resources.txt
```

11. Let Projen upgrade the remaining files

```sh
yarn build
# Updates package.json, .gitattributes, .gitignore, workflows, src/api-resource.generated.ts, src/imports/k8s.ts, .projen/*
```

12. Check all the expected files were updated as intended.

13. Update all the cdk8s-plus `docs/plus/**` with the new syntax.

14. Push the branch and verify that automation builds/tags/releases the new version successfully.

15. Update CDK8s+'s default branch to the new branch in the [GitHub repo settings](https://github.com/cdk8s-team/cdk8s-plus/settings/branches).

## :three: Update CDK8s

16. Create a new cdk8s branch off of cdk8s/master

17. On the new branch update the following:
     1. ([`.projenrc.js`](https://github.com/cdk8s-team/cdk8s/blob/master/.projenrc.js)): In the `javascript.NodeProject()` update the `devDeps` list with the new `cdk8s-plus-xx` version.

        ```js
        const project = new javascript.NodeProject({
        ...
        devDeps: [
            '@types/jest',
            '@types/node',
            'cdk8s',
            'cdk8s-cli',
            'cdk8s-plus-22',
            'cdk8s-plus-23',
            'cdk8s-plus-24',
            'cdk8s-plus-25', // <-- new version
            'constructs',
            'lerna@^4',
            'semver',
            'ts-jest',
            'typescript',
          'projen',
        ],
        });
        ```

    2.  ([`.projenrc.js`](https://github.com/cdk8s-team/cdk8s/blob/master/.projenrc.js)): Update the `packages` list with the new `cdk8s-plus-xx` version

        ```js
        const packages = [
          'cdk8s',
          'cdk8s-plus-22',
          'cdk8s-plus-23',
          'cdk8s-plus-24',
          'cdk8s-plus-25', // <-- new version
        ];
        ```

    3. ([`README.md`](https://github.com/cdk8s-team/cdk8s/blob/master/README.md)): Add the new version. i.e. add a markdown status badge for the new version.

    4. ([`docs/build.sh`](https://github.com/cdk8s-team/cdk8s/blob/master/docs/build.sh)): Add the new version to the docs copy loop.

        ```bash
        ...
        for module in cdk8s cdk8s-plus-22 cdk8s-plus-23 cdk8s-plus-24 cdk8s-plus-25; do # <-- added cdk8s-plus-25
          javamd=$(node -p "require.resolve('${module}/docs/java.md')")
          pythonmd=$(node -p "require.resolve('${module}/docs/python.md')")
          typescriptmd=$(node -p "require.resolve('${module}/docs/typescript.md')")
          cat $javamd | sed "s/# API Reference/# ${module} (Java)/" > "docs/reference/${module}/java.md"
          cat $pythonmd | sed "s/# API Reference/# ${module} (Python)/" > "docs/reference/${module}/python.md"
          cat $typescriptmd | sed "s/# API Reference/# ${module} (TypeScript)/" > "docs/reference/${module}/typescript.md"
        done
        ...
        ```

    5.  ([`website/build.sh`](https://github.com/cdk8s-team/cdk8s/blob/master/website/build.sh)): Add the new version as an exported const

        ```bash
        ...
        export CDK8S_CORE_VERSION="$(get_version cdk8s)"
        export CDK8S_PLUS22_VERSION="$(get_version cdk8s-plus-22)"
        export CDK8S_PLUS23_VERSION="$(get_version cdk8s-plus-23)"
        export CDK8S_PLUS24_VERSION="$(get_version cdk8s-plus-24)"
        export CDK8S_PLUS25_VERSION="$(get_version cdk8s-plus-25)" # <-- new version
        export CDK8S_CLI_VERSION="$(get_version cdk8s-cli)"
        ...
        ```

    6. ([`website/layouts/index.html`](https://github.com/cdk8s-team/cdk8s/blob/master/website/layouts/index.html)): Add the new version to the website's landing page.

        ```html
        ...
        {{- $cdk8s_core_version := getenv "CDK8S_CORE_VERSION" }}
        {{- $cdk8s_plus22_version := getenv "CDK8S_PLUS22_VERSION" }}
        {{- $cdk8s_plus23_version := getenv "CDK8S_PLUS23_VERSION" }}
        {{- $cdk8s_plus24_version := getenv "CDK8S_PLUS24_VERSION" }}
        {{- $cdk8s_plus25_version := getenv "CDK8S_PLUS25_VERSION" }} <!-- New version -->
        {{- $cdk8s_cli_version := getenv "CDK8S_CLI_VERSION" }}
        ...
        {{- $link_cdk8s_ref := (print $docs_root "/reference/cdk8s/typescript") }}
        {{- $link_plus22_ref := (print $docs_root "/reference/cdk8s-plus-22/typescript") }}
        {{- $link_plus23_ref := (print $docs_root "/reference/cdk8s-plus-23/typescript") }}
        {{- $link_plus24_ref := (print $docs_root "/reference/cdk8s-plus-24/typescript") }}
        {{- $link_plus25_ref := (print $docs_root "/reference/cdk8s-plus-25/typescript") }} <!-- New version -->
        {{- $link_cli := (print $docs_root "/cli") }}
        ...
        <nav class="dropdown-list w-dropdown-list">
        <a href="{{ $link_cdk8s_ref }}" class="dropdown-link w-dropdown-link">cdk8s  ({{ $cdk8s_core_version }})</a>
        <a href="{{ $link_plus22_ref }}" class="dropdown-link w-dropdown-link">cdk8s-plus-22  ({{ $cdk8s_plus22_version }})</a>
        <a href="{{ $link_plus23_ref }}" class="dropdown-link w-dropdown-link">cdk8s-plus-23  ({{ $cdk8s_plus23_version }})</a>
        <a href="{{ $link_plus24_ref }}" class="dropdown-link w-dropdown-link">cdk8s-plus-24  ({{ $cdk8s_plus24_version }})</a>
        <a href="{{ $link_plus25_ref }}" class="dropdown-link w-dropdown-link">cdk8s-plus-24  ({{ $cdk8s_plus24_version }})</a>
        <a href="{{ $link_plus25_ref }}" class="dropdown-link w-dropdown-link">cdk8s-plus-25  ({{ $cdk8s_plus25_version }})</a> <!-- New version -->
        <a href="{{ $link_cli }}" target="_blank" class="dropdown-link w-dropdown-link">cdk8s-cli ({{ $cdk8s_cli_version }})<a>
        </nav>
        ...
        ```

    7. ([`docs/reference/`](https://github.com/cdk8s-team/cdk8s/blob/master/docs/reference/)): Create a new directory for the new version. i.e. `docs/reference/cdk8s-plus-XX/`. Inside the new dir create two files.

        Create a `.pages` file with the following:

          ```bash
          nav:
          - TypeScript: typescript.md
          - Python: python.md
          - Java: java.md
          - Go: go.md
          ```

        And a `go.md` file with the following (updated to match the new version):

          ```markdown
          # cdk8s-plus-25 (Go) <a name="API Reference"></a>

          For Go API reference, please visit <https://pkg.go.dev/github.com/cdk8s-team/cdk8s-plus-go/cdk8splus25>.
          ```
    8. Update the [navigation page](https://github.com/cdk8s-team/cdk8s/blob/master/docs/plus/.pages) for cdk8s-plus and the [api reference](https://github.com/cdk8s-team/cdk8s/blob/master/docs/reference/.pages) and the [index](https://github.com/cdk8s-team/cdk8s/blob/master/docs/reference/index.md)
    9. Update the references in the examples directory.
    10. Update the references in https://github.com/cdk8s-team/cdk8s/blob/master/docs/plus/index.md

18.  Let Projen update the other files:

  ```sh
  yarn build
  # Updates .gitignore, .projen/*, package.json
  ```

19.  Update all the cdk8s [`docs/**`](https://github.com/cdk8s-team/cdk8s/tree/master/docs) with the new syntax.

20.  Create a PR for the new branch, review then merge into cdk8s/master branch.

21.  Wait for the automation to pull the new version docs and publish to the website.

22.  Verify the website has the new version docs:

  - The [landing page](https://cdk8s.io/)'s "API Reference" dropdown.
  - The [docs "cdk8s+" section](https://cdk8s.io/docs/latest/plus/).
  - The [docs "API Reference" section](https://cdk8s.io/docs/latest/reference/).

23. Update the relevant packages in our package integrity mechanism (for example: https://github.com/cdklabs/cdk-ops/pull/2530)

## 🎉 You did it! 🎉

1. Now go outside :house_with_garden:
2. Get some fresh air :lotus_position:
3. Come back inside :door:
4. Automate all of this :technologist:
