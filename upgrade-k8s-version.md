# How to Upgrade CDK8s+/CDK8s to a new Kubernetes version

This document describes the changes required in order to upgrade CDK8s+/CDK8s to support a new Kubernetes version. These steps should be executed in order.

## Prerequisite

1. (cdk8s repo): Generate `kubernetes-schema/vX.XX.X/_definitions.json`

    ```sh
    tools/import-spec.sh x.xx.x
    # provide the new version number e.g. 1.25.0
    ```

2. Create PR, review, merge the updated spec into CDK8s

## Create the new CDK8s+ branch

3. Create a new branch of CDK8s+ starting from the current latest K8s version branch. The new branch should be named `k8s-XX/main` (e.g. `k8s-25/main` for K8s v1.25.0).

4. On the new branch update the following:

     1. (`.projenrc.ts`): Update `LATEST_SUPPORTED_K8S_VERSION` and `SPEC_VERSION` with the new version.

        ```ts
        // the latest version of k8s we support
        const LATEST_SUPPORTED_K8S_VERSION = 25; // <-- Upgraded from 24 to 25

        // the version of k8s this branch supports
        const SPEC_VERSION = '25'; // <-- Upgraded from 24 to 25
        ```

     2. (`.projenrc.ts`): In the `JsiiProjecT()` edit `depsUpgradeOptions` to include a the oldest supported branch of k8s.

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
                `k8s-${LATEST_SUPPORTED_K8S_VERSION - 3}/main`, // <-- Add this branch so that v22 is still supported.
              ],
            ...
            },
        },
        });
        ```

     3. (`README.md`): Add the new version. i.e. Add a markdown status badge, and a new row in the supported k8s version table.

5. Import the k8s spec that you merged into cdk8s during the prerequisite.

```sh
yarn run import
# warning `yarn import` is a native yarn command so be sure to include `run`
```

6. Start up a local Kubernetes cluster using the same version that you are upgrading to. Make sure it is available on localhost:8080

7. Generate API types from the local Kubernetes cluster

```sh
yarn regenerate-api-information
# Updates ./api-resources.txt
```

8. Let Projen upgrade the remaining files

```sh
yarn build
# Updates package.json, .gitattributes, .gitignore, workflows, src/api-resource.generated.ts, src/imports/k8s.ts, .projen/*
```

9. Check all the expected files were updated as intended.

10. TODO: step to fix Go publishing

11. Update all the cdk8s-plus `docs/plus/**` with the new syntax.

12. Push the branch and verify that automation builds/tags/releases the new version successfully.

## Update CDK8s

13. Create a new cdk8s branch off of cdk8s/master

14. On the new branch update the following:
     1. (`.projenrc.js`): In the `javascript.NodeProject()` update the `devDeps` list with the new `cdk8s-plus-xx` version.

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

    2.  (`.projenrc.js`): Update the `packages` list with the new `cdk8s-plus-xx` version

        ```js
        const packages = [
          'cdk8s',
          'cdk8s-plus-22',
          'cdk8s-plus-23',
          'cdk8s-plus-24',
          'cdk8s-plus-25', // <-- new version
        ];
        ```

    3. (`README.md`): Add the new version. i.e. add a markdown status badge for the new version.

    4. (`docs/build.sh`): Add the new version to the docs copy loop.

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

    5.  (`website/build.sh`): Add the new version as an exported const

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

    6. (`website/layouts/index.html`): Add the new version to the website's landing page.

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

15. Let Projen update the other files:

    ```sh
    yarn build
    # Updates .gitignore, .projen/*, package.json
    ```

16. Update all the cdk8s `docs/**` with the new syntax.

17. Create a PR for the new branch, review, and merge into master.
