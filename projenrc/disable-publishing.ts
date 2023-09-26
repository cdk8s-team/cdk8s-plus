import * as fs from 'fs';

function disablePublishing() {
  const filePath = '.projenrc.ts';
  let curFileData = fs.readFileSync(filePath, 'utf-8');
  curFileData.replace('project.package.addField(\'private\', false);', 'project.package.addField(\'private\', true);');
  fs.writeFileSync(filePath, curFileData);
}

disablePublishing();