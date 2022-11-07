
const fs = require('fs');
const path = require('path');
const process = require('process');
const { stdin, stdout } = process;

const wayToFile = path.join(__dirname, "text.txt");
const writeStream = fs.createWriteStream(wayToFile, "utf-8");

stdout.write(`Hello. Please enter some text, which will be written to the file text.txt.
To exit, enter "exit" or press "Ctrl + C" (may not work in VS Code, but works in Git Bash).\n`);
stdin.on('data', data => {
  if (data.toString() === 'exit\n' || data.toString() === 'exit\r\n'){
    process.exit();
  }
  writeStream.write(data);
});

process.on('SIGINT',()=> process.exit());

process.on('exit', () => {
  console.log('Thank you, good bye!');
});