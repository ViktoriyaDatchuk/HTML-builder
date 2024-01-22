const fs = require('fs');
const path = require('path');
const { stdout } = process;

const stream = fs.createReadStream(path.join(__dirname, 'text.txt'), 'utf-8');
let text = '';
stream.on('data', (chunk) => (text += chunk));
stream.on('end', () => stdout.write(text));
stream.on('error', (error) => console.log('Error: ', error.message));
