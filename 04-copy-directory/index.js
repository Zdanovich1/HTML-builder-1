const fs = require('fs');
const path = require('path');
const { readdir, copyFile, mkdir} = require('fs/promises');

const copyDirName = 'files-copy';
const originalDirName = 'files';

fs.rm(path.join(__dirname, copyDirName), { recursive: true }, ()=>{
  copyFolder(path.join(__dirname, originalDirName));
});

async function copyFolder(wayToDir) {
  await mkdir(path.join(__dirname, copyDirName));
  const files = await readdir(wayToDir, { withFileTypes: true });

  for (const file of files) {
    const name = path.basename(file.name);
    await copyFile(path.join(__dirname, originalDirName, name), path.join(__dirname, copyDirName, name));
  }

}
