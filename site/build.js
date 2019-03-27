const fs = require('fs');
const path = require('path');

const nunjucks = require('nunjucks');
const rimraf = require('rimraf');
const { ncp } = require('ncp');
const sass = require('node-sass');

const url = process.env.SITE_ROOT || 'http://localhost:5000';

console.log(`Starting generating ${url}`);

const data = {
  env: {
    locals: { url },
  },
  page: {
    title: 'A/B Testing for WordPress - By CleverNode',
    description: 'WordPress plugin to create A/B and split tests right from your content editor.',
  },
};

const output = nunjucks.render(path.resolve(__dirname, 'src/index.html'), data);
const outputDir = path.resolve(__dirname, 'build');

// clean and make build dir
try {
  rimraf.sync(outputDir);
} catch (e) {
  console.log('No build dir found. Skipping removal.');
}
fs.mkdirSync(outputDir);

// write html file
fs.writeFileSync(`${outputDir}/index.html`, output);
console.log('Wrote HTML file.');

// create assets folder
fs.mkdirSync(path.resolve(__dirname, 'build/assets'));
fs.mkdirSync(path.resolve(__dirname, 'build/assets/css'));

// copy images
const imagesSrc = path.resolve(__dirname, 'src/assets/images');
const imagesDest = path.resolve(__dirname, 'build/assets/images');
ncp(imagesSrc, imagesDest, (err) => {
  if (err) console.error(err);

  console.log('Copied image files.');

  // render Sass
  const sassOutput = sass.renderSync({
    file: path.resolve(__dirname, 'src/assets/css/style.scss'),
    outputStyle: 'compressed',
  });

  fs.writeFileSync(`${outputDir}/assets/css/style.css`, sassOutput.css.toString());

  console.log('Wrote Sass output');
});
