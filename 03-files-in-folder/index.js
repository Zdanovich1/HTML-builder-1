const { readdir, stat } = require('fs/promises');
const path = require('path');
const { stdout } = process;

(async function (directory) {
  try {
    const files = (await readdir(directory, { withFileTypes: true })).filter(content => content.isFile());

    files.forEach(file => {
      const wayToFile = path.join(__dirname, 'secret-folder', file.name);
      const fileName = path.parse(wayToFile).name;
      const fileExtension = path.extname(wayToFile).slice(1);
      const fileInformation = stat(wayToFile);

      fileInformation.then(info => {
        const fileSize = `${info.size / 1000}kb`;
        const fileData = `${fileName} - ${fileExtension} - ${fileSize}`;

        stdout.write(`${fileData}\n`);
      });
    });
  } catch (error) {
    console.error('Error:', error.message);
  }
})(path.join(__dirname, 'secret-folder'));