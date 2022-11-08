const fs = require('fs');
const path = require('path');
const fsPromises = require('fs/promises');

const wayToProjectDirectory = path.join(__dirname, 'project-dist');
const sourceStylesDirWay = path.join(__dirname, 'styles');
const outputStylesFilePath = path.join(wayToProjectDirectory, 'style.css');
const wayToAssetsFolder = path.join(__dirname, 'assets');
const wayToAssetsCopyFolder = path.join(wayToProjectDirectory, 'assets');
const componentsFolderWay = path.join(__dirname, 'components');
const htmlFileWay = path.join(__dirname, 'template.html');
const htmlFileCopyWay = path.join(wayToProjectDirectory, 'index.html');

async function bundleStyles() {
   const writeStream = fs.createWriteStream(outputStylesFilePath);
   const files = await fsPromises.readdir(sourceStylesDirWay, { withFileTypes: true });
   for (const file of files) {
      const sourceFileWay = path.join(sourceStylesDirWay, file.name);
      const sourceFileExtension = path.extname(sourceFileWay);
      if (file.isFile() && sourceFileExtension === '.css') {
         let styleFileContent = await fsPromises.readFile(sourceFileWay, 'utf-8');
         styleFileContent = `${styleFileContent.trim()}\n\n`;
         writeStream.write(styleFileContent);
      }
   }
}

async function copyAssets(originalFileWay, copyFileWay) {
   await fsPromises.rm(copyFileWay, { recursive: true, force: true });
   await fsPromises.mkdir(copyFileWay, { recursive: true });
   const files = await fsPromises.readdir(originalFileWay, { withFileTypes: true });
   for (let file of files) {
      const source = path.join(originalFileWay, file.name);
      const destination = path.join(copyFileWay, file.name);
      if (file.isFile()) {
         await fsPromises.copyFile(source, destination);
      } else {
         await copyAssets(source, destination);
      }
   }
}

async function completeHtmlFile() {
   await fsPromises.copyFile(htmlFileWay, htmlFileCopyWay);
   let htmlFileContent = await fsPromises.readFile(htmlFileCopyWay, 'utf-8');
   const writeStream = fs.createWriteStream(htmlFileCopyWay);
   const files = await fsPromises.readdir(componentsFolderWay, { withFileTypes: true });
   for (const file of files) {
      const sourceFileWay = path.join(componentsFolderWay, file.name);
      const sourceFileExtension = path.extname(sourceFileWay);
      if (file.isFile() && sourceFileExtension === '.html') {
         const sourceFileName = path.parse(sourceFileWay).name;
         const htmlFileComponentContent = await fsPromises.readFile(sourceFileWay, 'utf-8');
         const substitude = `{{${sourceFileName}}}`;
         htmlFileContent = htmlFileContent.replace(substitude, htmlFileComponentContent);
      }
   }
   writeStream.write(htmlFileContent);
}

(async () => {
   try {
      await fsPromises.rm(wayToProjectDirectory, { recursive: true, force: true });
      await fsPromises.mkdir(wayToProjectDirectory, { recursive: true });
      await bundleStyles();
      await copyAssets(wayToAssetsFolder, wayToAssetsCopyFolder);
      await completeHtmlFile();
   } catch (err) {
      console.log(`Error: ${err.message}`);
   }
})();