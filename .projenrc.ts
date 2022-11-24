import * as path from 'path';
import { cdk, github, javascript, JsonFile, Task } from 'projen';
import { JobPermission } from 'projen/lib/github/workflows-model';
import { generateApiResources } from './projenrc/gen-api-resource';

// the latest version of k8s we support
const LATEST_SUPPORTED_K8S_VERSION = 25;

// the version of k8s this branch supports
const SPEC_VERSION = '25';
const K8S_VERSION = `1.${SPEC_VERSION}.0`;

const project = new cdk.JsiiProject({
  name: `cdk8s-plus-${SPEC_VERSION}`,
  description: `cdk8s+ is a software development framework that provides high level abstractions for authoring Kubernetes applications. cdk8s-plus-${SPEC_VERSION} synthesizes Kubernetes manifests for Kubernetes ${K8S_VERSION}`,
  projenrcTs: true,

  repositoryUrl: 'https://github.com/cdk8s-team/cdk8s-plus.git',
  author: 'Amazon Web Services',
  authorAddress: 'https://aws.amazon.com',
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
  ],

  majorVersion: 2,
  releaseTagPrefix: `cdk8s-plus-${SPEC_VERSION}/`,
  releaseWorkflowName: `release-k8s.${SPEC_VERSION}`,
  defaultReleaseBranch: `k8s-${SPEC_VERSION}/main`,
  minNodeVersion: '14.17.0',

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

// run backport in clean directories every time.
const backportHome = '/tmp/.backport/';
const backportDir = `${backportHome}/repositories/cdk8s-team/cdk8s-plus`;
const backportConfig = new JsonFile(project, '.backportrc.json', {
  // see https://github.com/sqren/backport/blob/main/docs/config-file-options.md
  obj: {
    repoOwner: 'cdk8s-team',
    repoName: 'cdk8s-plus',
    signoff: true,
    branchLabelMapping: {
      '^backport-to-(.+)$': '$1',
    },
    prTitle: '{commitMessages}',
    fork: false,
    publishStatusCommentOnFailure: true,
    publishStatusCommentOnSuccess: true,
    publishStatusCommentOnAbort: true,
    targetPRLabels: [project.autoApprove!.label],
    dir: backportDir,
  },
});

// backport task to branches based on pr labels
const backportTask = createBackportTask();

// backport tasks to explicit branches based on input
for (const spec of [LATEST_SUPPORTED_K8S_VERSION, LATEST_SUPPORTED_K8S_VERSION - 1, LATEST_SUPPORTED_K8S_VERSION - 2].map(s => new Number(s))) {
  createBackportTask(spec);
}

const backportWorkflow = project.github!.addWorkflow('backport');
backportWorkflow.on({ pullRequestTarget: { types: ['closed'] } });
backportWorkflow.addJob('backport', {
  runsOn: ['ubuntu-18.04'],
  permissions: {
    contents: JobPermission.WRITE,
  },
  steps: [
    // needed in order to run the projen task as well
    // as use the backport configuration in the repo.
    {
      name: 'checkout',
      uses: 'actions/checkout@v3',
      with: {
        // required because we need the full history
        // for proper backports.
        'fetch-depth': 0,
      },
    },
    {
      name: 'Set Git Identity',
      run: 'git config --global user.name "github-actions" && git config --global user.email "github-actions@github.com"',
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
  ],
});

project.addTask('regenerate-api-information', {
  description: 'Regenerate the information about the kubernetes API needed for auto-generating source code files. Requires access to a kubernetes cluster.',
  exec: 'kubectl api-resources -o wide > api-resources.txt',
});
generateApiResources(project, 'api-resources.txt', 'src/api-resource.generated.ts');

project.synth();

function createBackportTask(branch?: Number): Task {
  const name = branch ? `backport:${branch}` : 'backport';
  const task = project.addTask(name, { requiredEnv: ['BACKPORT_PR_NUMBER', 'GITHUB_TOKEN'] });
  task.exec(`rm -rf ${backportHome}`);
  task.exec(`mkdir -p ${backportHome}`);
  task.exec(`cp ${backportConfig.path} ${backportHome}`);

  // pinning because of https://github.com/sqren/backport/issues/451
  const backportVersion = '8.5.0';

  const backport = ['npx', `backport@${backportVersion}`, '--accesstoken', '${GITHUB_TOKEN}', '--pr', '${BACKPORT_PR_NUMBER}'];
  if (branch) {
    backport.push(...['--branch', `k8s-${branch}/main`]);
  } else {
    backport.push('--non-interactive');
  }
  task.exec(backport.join(' '), { cwd: backportHome });
  return task;
}
