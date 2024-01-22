const fs = require('fs');
const path = require('path');
const { stdin, stdout, exit } = process;

const stream = fs.createWriteStream(path.join(__dirname, 'newFile.txt'));
stdout.write('Hello! Enter your text, please.\n');
stdin.on('data', (data) => {
  if (data.toString().trim() === 'exit') {
    bye();
  } else {
    stream.write(data);
  }
});
stdin.on('error', (error) => console.log('Error: ', error.message));
process.on('SIGINT', bye);

function bye() {
  stdout.write('Thank you! Bye!');
  exit();
}
