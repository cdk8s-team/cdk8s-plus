import * as fs from 'fs';
import * as path from 'path';

export function replaceOldVersionReferences(latestVersion: string) {

  const latestVersionNumber = Number(latestVersion);

  // replaces references in .projenrc.ts file
  const projenFilePath = '.projenrc.ts';
  let projenFileData = fs.readFileSync(projenFilePath, 'utf-8');
  projenFileData = projenFileData.replace(`= ${latestVersionNumber - 1}`, `= ${latestVersion}`);
  projenFileData = projenFileData.replace(`= '${latestVersionNumber - 1}`, `= '${latestVersion}`);
  fs.writeFileSync(projenFilePath, projenFileData);

  // replace references in docs/plus/**
  // all version references here appear in the form: cdk8s-plus-XX
  const docsFileNames = fs.readdirSync('docs/plus/', { encoding: 'utf-8' });
  docsFileNames.forEach(function (filePath) {
    const curFilePath = path.join('docs/plus', filePath);
    let curFileData = fs.readFileSync(curFilePath, 'utf-8');
    curFileData = curFileData.replace(new RegExp(`cdk8s-plus-${latestVersionNumber - 1}`, 'g'), `cdk8s-plus-${latestVersion}`);
    fs.writeFileSync(curFilePath, curFileData);
  });
}

replaceOldVersionReferences(process.argv.slice(2)[0]);