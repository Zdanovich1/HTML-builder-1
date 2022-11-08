const fs = require('fs');
const path = require('path');
const { readdir, readFile } = require('fs/promises');

const wayToDirectory = path.join(__dirname, 'styles');
const outputFilePath = path.join(__dirname, 'project-dist', 'bundle.css');

(async () => {
  try {
    const writeStream = fs.createWriteStream(outputFilePath);
    const files = await readdir(wayToDirectory, { withFileTypes: true });
    
    for (const file of files) {

      const wayToFile = path.join(wayToDirectory, file.name);
      const fileExtension = path.extname(wayToFile);

      if (file.isFile() && fileExtension === '.css') {
        let fileContent = await readFile(wayToFile, 'utf-8');
        fileContent = `${fileContent.trim()}\n\n`;
        writeStream.write(fileContent);
      }
    }
  } catch (err) {
    console.log(`Error: ${err.message}`);
  }
})();