const fs = require('fs');
const path = require('path');
const { stdout } = process;

async function copyDir() {
  try {
    await fs.promises.rm(path.join(__dirname, 'newFiles'), {
      force: true,
      recursive: true,
    });
    await fs.promises.mkdir(path.join(__dirname, 'newFiles'), {
      recursive: true,
    });
    stdout.write('Directory created successfully!\n');
    const files = await fs.promises.readdir(path.join(__dirname, 'files'));
    files.forEach(async (file) => {
      try {
        await fs.promises.copyFile(
          path.join(__dirname, 'files', file),
          path.join(__dirname, 'newFiles', file),
        );
        stdout.write(`File ${file} copied successfully!\n`);
      } catch (err) {
        console.error(err);
      }
    });
  } catch (err) {
    console.error(err);
  }
}

copyDir();
