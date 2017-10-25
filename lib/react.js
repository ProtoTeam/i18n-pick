const glob = require('glob');
const transformFileSync = require('babel-core').transformFileSync;
const fs = require('fs');

let index = 0;
const jsxArr = [];
const jsxIndexArr = [];
const textIndexArr = [];
const textArr = [];
const zhCHArr = [];

function run(path) {
  glob(`${path}/**/*.{js,jsx}`, {}, (error, files) => {
    files.forEach(filename => {
      if (filename.includes('node_modules')) {
        return;
      }
      // 如果文件目录带了_，我认为他是测试用例
      if (filename.indexOf('_') !== -1){
        return;
      }
      transformFileSync(filename, {
        presets: ['babel-preset-es2015', 'babel-preset-stage-0', 'babel-preset-react'].map(require.resolve),
        plugins: [
          require.resolve('babel-plugin-transform-decorators-legacy'),
          scan,
        ]
      });
    });

    // 这里写到text中，为了避免重复
    textArr.forEach((item, i, arr) => {
      arr[i] += `${textIndexArr[i]}\n`;
    });
    jsxArr.forEach((item, i, arr) => {
      arr[i] += `${jsxIndexArr[i]}\n`;
    });
    // 创建文件夹
    fs.mkdirSync('i18n-messages');
    fs.appendFile('i18n-messages/text.txt', textArr.join(''),  function(err) {
      if (err) {
        return console.error(err);
      }
    });
    fs.appendFile('i18n-messages/jsx.txt', jsxArr.join(''),  function(err) {
      if (err) {
        return console.error(err);
      }
    });
    fs.appendFile('i18n-messages/zh-CH.json', `[\n${zhCHArr.join(',\n')}\n]`,  function(err) {
      if (err) {
        return console.error(err);
      }
    });
  });
}

function scan({ types: t }) {
  return {
    visitor: {
      JSXAttribute(path) {
        const { node } = path;
        if (node.name.name !== 'defaultMessage' && path.node.value) {
          detectChinese(node.value.value, path, 'jsx');
        }
      },
      JSXText(path) {
        const { node } = path;
        detectChinese(node.value, path, 'jsx');
      },
      AssignmentExpression(path) {
        detectChinese(path.node.right.value, path, 'text');
      },
      ObjectProperty(path) {
        detectChinese(path.node.value.value, path, 'text');
      },
      ArrayExpression(path) {
        path.node.elements.forEach(item => {
          detectChinese(item && item.value, path, 'text');
        })
      },
    },

  }
}

function detectChinese(text, path, type) {
  if (/[\u4e00-\u9fa5]/.test(text)) {
    report(text, path, type)
  }
}

function report(text, path, type) {
  const { node } = path;
  const location = `${path.hub.file.log.filename}#${node.loc.start.line}#${node.loc.start.column}`
  if (type === 'text') {
    if (textArr.indexOf(`${text}#${location}#`) === -1 && jsxArr.indexOf(`${text}#${location}#`) === -1) {
      console.log(`${text}#${location}`);
      index++;
      textArr.push(`${text}#${location}#`);
      textIndexArr.push(index);
      zhCHArr.push(`{\n "id": "${text.replace(/"/g,'\\\"')}",\n"defaultMessage": "${text.replace(/"/g,'\\\"')}"\n}`);
    }
  } else {
    // jsx里面的需要trim一下
    text = text.trim();
    if (jsxArr.indexOf(`${text}#${location}#`) === -1) {
      console.log(`${text}#${location}`);
      index++;
      jsxArr.push(`${text}#${location}#`);
      jsxIndexArr.push(index);
      zhCHArr.push(`{\n "id": "${text.replace(/"/g,'\\\"')}",\n"defaultMessage": "${text.replace(/"/g,'\\\"')}"\n}`);
    }
  }
}

module.exports = {
  run,
};
