import * as fs from 'fs';
import * as path from 'path';

export function rotate(latestVersion: string) {

  const latestVersionNumber = Number(latestVersion);

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

rotate(process.argv.slice(2)[0]);