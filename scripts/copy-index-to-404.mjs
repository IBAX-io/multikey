import { promises as fs } from 'fs';
import { join } from 'path';

const source = join(process.cwd(), 'dist', 'index.html');
const destination = join(process.cwd(), 'dist', '404.html');
// console.log('source: ', source);
// console.log('destination: ', destination);

fs.copyFile(source, destination)
  .then(() => {
    console.log('Copied index.html to 404.html successfully.');
  })
  .catch((err) => {
    console.error('Failed to copy index.html to 404.html:', err);
  });
