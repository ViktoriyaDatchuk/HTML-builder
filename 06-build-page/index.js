const fs = require('fs');
const path = require('path');
const { stdout } = process;

async function buildcreateProject() {
  try {
    await fs.promises.rm(path.join(__dirname, 'project-dist'), {
      force: true,
      recursive: true,
    });
    await fs.promises.mkdir(path.join(__dirname, 'project-dist'), {
      recursive: true,
    });
    stdout.write('Directory created successfully!\n');
    await copyDir(
      path.join(__dirname, 'assets'),
      path.join(__dirname, 'project-dist', 'assets'),
    );
    await createHtmlFile();
    await createCssFile();
  } catch (err) {
    console.error(err);
  }
}

async function copyDir(pathFrom, pathTo) {
  try {
    await fs.promises.rm(pathTo, {
      force: true,
      recursive: true,
    });
    await fs.promises.mkdir(pathTo, {
      recursive: true,
    });
    stdout.write('Directory created successfully!\n');
    const files = await fs.promises.readdir(pathFrom, { withFileTypes: true });
    files.forEach(async (file) => {
      try {
        if (file.isDirectory()) {
          copyDir(path.join(pathFrom, file.name), path.join(pathTo, file.name));
        } else {
          await fs.promises.copyFile(
            path.join(pathFrom, file.name),
            path.join(pathTo, file.name),
          );
          stdout.write(`File ${file.name} copied successfully!\n`);
        }
      } catch (err) {
        console.error(err);
      }
    });
  } catch (err) {
    console.error(err);
  }
}

async function createHtmlFile() {
  try {
    let templates = await fs.promises.readFile(
      path.join(__dirname, 'template.html'),
      'utf-8',
    );
    const templatesComponents = templates.match(/{{[a-z]*}}/gi);
    if (templatesComponents) {
      for await (let template of templatesComponents) {
        const fileName = `${template.replace(/{{|}}/g, '')}.html`;
        const fileContent = await fs.promises.readFile(
          path.join(__dirname, 'components', fileName),
          'utf-8',
        );
        templates = templates.replace(template, fileContent);
      }
      await fs.promises.writeFile(
        path.join(__dirname, 'project-dist', 'index.html'),
        templates,
      );
    }
  } catch (err) {
    console.error(err);
  }
}

async function createCssFile() {
  try {
    await fs.promises.rm(path.join(__dirname, 'project-dist', 'style.css'), {
      force: true,
      recursive: true,
    });
    const files = await fs.promises.readdir(path.join(__dirname, 'styles'), {
      withFileTypes: true,
    });
    const outStream = fs.createWriteStream(
      path.join(__dirname, 'project-dist', 'style.css'),
    );
    files.forEach((file) => {
      if (!file.isDirectory() && path.extname(file.name).slice(1) === 'css') {
        let fileContent = '';
        const inStream = fs.createReadStream(
          path.join(file.path, file.name),
          'utf8',
        );
        inStream.on(
          'data',
          (chunk) => (fileContent = fileContent + chunk + '\n'),
        );
        inStream.on('end', () => {
          outStream.write(fileContent);
        });
      }
    });
  } catch (err) {
    console.error(err);
  }
}

buildcreateProject();
