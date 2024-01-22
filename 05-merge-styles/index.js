const fs = require('fs');
const path = require('path');

(async () => {
  try {
    await fs.promises.rm(path.join(__dirname, 'project-dist', 'bundle.css'), {
      force: true,
      recursive: true,
    });
    const files = await fs.promises.readdir(path.join(__dirname, 'styles'), {
      withFileTypes: true,
    });
    const outStream = fs.createWriteStream(
      path.join(__dirname, 'project-dist', 'bundle.css'),
    );
    files.forEach((file) => {
      if (!file.isDirectory() && path.extname(file.name).slice(1) === 'css') {
        let fileContent = '';
        const inStream = fs.createReadStream(
          path.join(file.path, file.name),
          'utf8',
        );
        inStream.on('data', (chunk) => (fileContent += chunk));
        inStream.on('end', () => {
          outStream.write(fileContent);
        });
      }
    });
  } catch (err) {
    console.error(err);
  }
})();
