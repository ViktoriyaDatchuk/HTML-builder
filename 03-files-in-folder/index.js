const fs = require('fs');
const path = require('path');

(async () => {
  try {
    const files = await fs.promises.readdir(
      path.join(__dirname, 'secret-folder'),
      { withFileTypes: true },
    );
    files.forEach((file) => {
      if (!file.isDirectory()) {
        const filePath = path.join(file.path, file.name);
        const fileName = file.name.split('.')[0];
        const fileExt = path.extname(file.name).slice(1);
        fs.stat(filePath, (err, stats) => {
          if (err) {
            console.error(err);
          }
          const size = (stats.size / 1024).toFixed(2);
          console.log(`${fileName} - ${fileExt} - ${size}kb`);
        });
      }
    });
  } catch (err) {
    console.error(err);
  }
})();
