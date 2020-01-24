const fs = require('fs');
const path = require('path');
const juice = require('juice').juiceResources;
const marked = require("marked");

const PLACEHOLDER_TOKEN = '@@body@@';
const DEFAULT_LAYOUT = fs.readFileSync(path.join(__dirname, './defaultLayout.html'), 'utf8');
const COMMON_CSS = fs.readFileSync(path.join(__dirname, './common.css'), 'utf8');

const ALLOWED_STRING_PROPS = new Set(['url', 'link', 'code']);
const ALLOWED_OBJECT_PROPS = new Set([
  'application',
  'client',
  'connection',
  'user',
]);

const replace = content => {
  return content.replace(/@@(\w*)\.?(\w*)@@/gi, function (str, prop, subProp) {
    if (ALLOWED_STRING_PROPS.has(prop)) {
      return `{{ ${prop} }}`;
    }

    if (ALLOWED_OBJECT_PROPS.has(prop)) {
      return `{{ ${prop}.${subProp} }}`;
    }

    return str;
  });
};

/**
 * This compiler is used to render the body field of Markdown custom email templates.
 * The process is: replace(locals) => marked => layout => inline images and css.
 */
const convert = function (template, callback) {
  const juiceOptions = {
    url: '',
    extraCss: COMMON_CSS,
    webResources: {
      images: false,
    },
  };

  let bodyHtml;

  // First convert the body from markdown to HTML.
  try {
    bodyHtml = marked(replace(template));
  } catch (err) {
    return setImmediate(callback, err);
  }

  // Render the default layout with a placeholder token.
  // Embed the HTML body inside the rendered default layout.
  const html = DEFAULT_LAYOUT.replace(PLACEHOLDER_TOKEN, bodyHtml);

  // Inline CSS styles.
  juice(html, juiceOptions, callback);
};

module.exports = {
  convert
};

const readStdIn = (callback) => {
  let data = '';

  process.stdin.setEncoding('utf8');
  process.stdin.on('readable', () => {
    let chunk;
    while ((chunk = process.stdin.read()) !== null) {
      data += chunk;
    }
  });
  process.stdin.on('end', () => {
    callback(null, data);
  });
};

if (require.main === module) {
  readStdIn((err, input) => {
    convert(input, (err, rendered) => {
      if (err) {
        console.log(err.stack);
      } else {
        console.log(rendered);
      }
    });
  });
}
