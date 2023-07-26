import * as path from 'path';
import { Cdk8sTeamJsiiProject } from '@cdk8s/projen-common';
import { github, javascript } from 'projen';
import { generateApiResources } from './projenrc/gen-api-resource';

// the latest version of k8s we support
const LATEST_SUPPORTED_K8S_VERSION = 27;

// the version of k8s this branch supports
const SPEC_VERSION = '27';
const K8S_VERSION = `1.${SPEC_VERSION}.0`;

const project = new Cdk8sTeamJsiiProject({
  name: `cdk8s-plus-${SPEC_VERSION}`,
  description: `cdk8s+ is a software development framework that provides high level abstractions for authoring Kubernetes applications. cdk8s-plus-${SPEC_VERSION} synthesizes Kubernetes manifests for Kubernetes ${K8S_VERSION}`,
  projenrcTs: true,
  repoName: 'cdk8s-plus',

  keywords: [
    'cdk',
    'kubernetes',
    'k8s',
    'constructs',
    'containers',
    'configuration',
    'microservices',
  ],

  projenCredentials: github.GithubCredentials.fromPersonalAccessToken(),

  peerDeps: [
    'cdk8s',
    'constructs',
  ],
  deps: [
    'minimatch',
  ],
  bundledDeps: [
    'minimatch',
  ],
  devDeps: [
    'constructs',
    '@types/minimatch',
    'cdk8s',
    'cdk8s-cli',
    'constructs',
    'snake-case',
    '@cdk8s/projen-common',
  ],

  majorVersion: 2,
  releaseTagPrefix: `cdk8s-plus-${SPEC_VERSION}/`,
  releaseWorkflowName: `release-k8s.${SPEC_VERSION}`,
  defaultReleaseBranch: `k8s-${SPEC_VERSION}/main`,

  golangBranch: `k8s.${SPEC_VERSION}`,
  depsUpgradeOptions: {
    workflowOptions: {
      branches: [
        // Support the 3 latest major versions
        `k8s-${LATEST_SUPPORTED_K8S_VERSION}/main`,
        `k8s-${LATEST_SUPPORTED_K8S_VERSION - 1}/main`,
        `k8s-${LATEST_SUPPORTED_K8S_VERSION - 2}/main`,
      ],

      // run upgrade-dependencies workflow at a different hour than other cdk8s
      // repos to decrease flakiness of integration tests caused by new versions
      // of cdk8s being published to different languages at the same time
      schedule: javascript.UpgradeDependenciesSchedule.expressions(['0 2 * * *']),
    },
  },
  backport: true,
  backportBranches: [
    `k8s-${LATEST_SUPPORTED_K8S_VERSION - 1}/main`,
    `k8s-${LATEST_SUPPORTED_K8S_VERSION - 2}/main`,
  ],
});

project.gitignore.exclude('.vscode/');

const importdir = path.join('src', 'imports');

const importTask = project.addTask('import', {
  exec: `cdk8s -l typescript -o ${importdir} import k8s@${K8S_VERSION}`,
  description: 'Updates imports based on latest version of cdk8s-cli.',
});
project.compileTask.prependSpawn(importTask);

const docgenTask = project.tasks.tryFind('docgen')!;
docgenTask.reset();
for (const lang of ['typescript', 'python', 'java']) {
  const genTask = project.addTask(`docgen:${lang}`);
  const output = `docs/${lang}.md`;
  genTask.exec(`mkdir -p docs && jsii-docgen -l ${lang} -o ${output}`);
  docgenTask.spawn(genTask);
  // ignoring since it creates merge conflicts in
  // the backport PR's.
  project.gitignore.exclude(output);
}

project.addTask('regenerate-api-information', {
  description: 'Regenerate the information about the kubernetes API needed for auto-generating source code files. Requires access to a kubernetes cluster.',
  exec: 'kubectl api-resources -o wide > api-resources.txt',
});
generateApiResources(project, 'api-resources.txt', 'src/api-resource.generated.ts');

project.synth();