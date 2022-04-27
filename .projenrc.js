const path = require('path');
const { cdk, javascript, JsonFile } = require('projen');
const { JobPermission } = require('projen/lib/github/workflows-model');

// the latest version of k8s we support
const LATEST_SUPPORTED_K8S_VERSION = '22';

// the version of k8s this branch supports
const SPEC_VERSION = '22';
const K8S_VERSION = `1.${SPEC_VERSION}.0`;

const project = new cdk.JsiiProject({
  name: `cdk8s-plus-${SPEC_VERSION}`,
  description: `cdk8s+ is a software development framework that provides high level abstractions for authoring Kubernetes applications. cdk8s-plus-${SPEC_VERSION} synthesizes Kubernetes manifests for Kubernetes ${K8S_VERSION}`,

  repositoryUrl: 'https://github.com/cdk8s-team/cdk8s-plus.git',
  authorName: 'Amazon Web Services',
  authorUrl: 'https://aws.amazon.com',
  keywords: [
    'cdk',
    'kubernetes',
    'k8s',
    'constructs',
    'containers',
    'configuration',
    'microservices',
  ],

  projenUpgradeSecret: 'PROJEN_GITHUB_TOKEN',
  prerelease: 'beta',

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
  ],

  majorVersion: 1,
  releaseTagPrefix: `cdk8s-plus-${SPEC_VERSION}/`,
  releaseWorkflowName: `release-k8s.${SPEC_VERSION}`,
  defaultReleaseBranch: `k8s-${SPEC_VERSION}/main`,
  minNodeVersion: '12.13.0',
  workflowNodeVersion: '12.22.0',

  // jsii configuration
  publishToMaven: {
    javaPackage: `org.cdk8s.plus${SPEC_VERSION}`,
    mavenGroupId: 'org.cdk8s',
    mavenArtifactId: `cdk8s-plus-${SPEC_VERSION}`,
  },
  publishToPypi: {
    distName: `cdk8s-plus-${SPEC_VERSION}`,
    module: `cdk8s_plus_${SPEC_VERSION}`,
  },
  publishToNuget: {
    dotNetNamespace: `Org.Cdk8s.Plus${SPEC_VERSION}`,
    packageId: `Org.Cdk8s.Plus${SPEC_VERSION}`,
  },
  publishToGo: {
    gitUserName: 'cdk8s-automation',
    gitUserEmail: 'cdk8s-team@amazon.com',
    gitBranch: `k8s.${SPEC_VERSION}`,
    moduleName: 'github.com/cdk8s-team/cdk8s-plus-go',
  },
  autoApproveOptions: {
    allowedUsernames: ['cdk8s-automation'],
    secret: 'GITHUB_TOKEN',
  },
  autoApproveUpgrades: true,
  depsUpgradeOptions: {
    workflowOptions: {
      branches: [
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
});

const importdir = path.join('src', 'imports');

const importTask = project.addTask('import', {
  exec: `cdk8s -l typescript -o ${importdir} import k8s@${K8S_VERSION}`,
  description: 'Updates imports based on latest version of cdk8s-cli.',
});
project.compileTask.prependSpawn(importTask);

const docgenTask = project.tasks.tryFind('docgen');
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

// backport task to branches based on pr labels
const backportTask = project.addTask('backport');
backportTask.exec('npx backport --accesstoken ${GITHUB_TOKEN} --pr ${BACKPORT_PR_NUMBER} --non-interactive');

// backport tasks to explicit branches based on input
for (const spec of [LATEST_SUPPORTED_K8S_VERSION, LATEST_SUPPORTED_K8S_VERSION - 1, LATEST_SUPPORTED_K8S_VERSION - 2].map(s => new Number(s))) {
  const t = project.addTask(`backport:${spec}`);
  t.exec(`npx backport --accesstoken \${GITHUB_TOKEN} --pr \${BACKPORT_PR_NUMBER} --branch k8s-${spec}/main`);
}

const backportWorkflow = project.github.addWorkflow('backport');
backportWorkflow.on({ pullRequestTarget: { types: ['closed'] } });
backportWorkflow.addJob('backport', {
  runsOn: 'ubuntu-18.04',
  permissions: {
    contents: JobPermission.WRITE,
  },
  steps: [
    {
      name: 'checkout',
      uses: 'actions/checkout@v2',
    },
    {
      name: 'backport',
      if: 'github.event.pull_request.merged == true',
      run: `npx projen ${backportTask.name}`,
      env: {
        GITHUB_TOKEN: '${{ secrets.PROJEN_GITHUB_TOKEN }}',
        BACKPORT_PR_NUMBER: '${{ github.event.pull_request.number }}',
      },
    },
    {
      name: 'log',
      if: 'always()',
      run: 'cat /home/runner/.backport/backport.log',
    },
  ],
});

const backportConfig = {
  repoOwner: 'iliapolo',
  repoName: 'cdk8s-plus',
  signoff: true,
  branchLabelMapping: {
    '^backport-to-(.+)$': '$1',
  },
  prTitle: '{commitMessages}',
  fork: false,
};

new JsonFile(project, '.backportrc.json', {
  obj: backportConfig,
});

project.synth();