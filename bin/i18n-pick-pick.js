#!/usr/bin/env node
// vim: set ft=javascript:

const fs = require('fs');
const program = require('commander');
const path = require('path');
const config = require('../i18n.config')();

program.parse(process.argv);


const needImport = [];
const importStatement = config.importStatement;
const callStatement = config.callStatement;
const targetDir = config.targetDir;
const sourceMapPath = path.join(process.cwd(), targetDir, 'zh-CH.json');


function replace(text, chinese, replaceString) {
    let textArr = text.split(/intl\.get\(.+?\)/);
    const newArr = JSON.parse(JSON.stringify(textArr));
    textArr.forEach((item, index, arr) => {
        arr[index] = item.replace(chinese, replaceString);
    });
    newArr.forEach((item, index, arr) => {
        if (item !== textArr[index]) {
            text = text.replace(item, textArr[index]);
        }
    })
    return text;
}

function generateAndWrite(sourceObj) {
    if (!sourceObj) return;
    const { key, text, textType, filename, line, column } = sourceObj;

    const left = textType == 'jsx' ? '{' : '';
    const right = textType == 'jsx' ? '}' : '';

    // 拿到文件数据
    const data = fs.readFileSync(filename, 'utf8');
    const arr = data.split('\n');

    const temp1 = arr[line - 1];
    const temp2 = arr[line];
    let chinese = text.replace(/\\"/g, '"');
    const replaceString = `${left}${callStatement}('${key}')${right}`;
    // 这里是为了匹配前后如果有引号的情况
    arr[line - 1] = replace(arr[line - 1], `"${chinese}"`, replaceString);
    if (temp1 === arr[line - 1]) {
        arr[line - 1] = replace(arr[line - 1], `'${chinese}'`, replaceString);
        if (temp1 === arr[line - 1]) {
            arr[line - 1] = replace(arr[line - 1], chinese, replaceString);
            if (temp1 === arr[line - 1]) {
                arr[line] = replace(arr[line], `"${chinese}"`, replaceString);
                if (temp2 === arr[line]) {
                    arr[line] = replace(arr[line], `'${chinese}'`, replaceString);
                    if (temp2 === arr[line]) {
                        arr[line] = replace(arr[line], chinese, replaceString);
                        if (temp2 === arr[line]) {
                            if (arr[line].indexOf(text) !== -1 ||
                                arr[line - 1].indexOf(text) !== -1) {
                                console.log('失败，请手动替换', JSON.stringify(sourceObj, null, "\t"));
                                return 0;
                            }
                        }
                    }
                }
            }
        }
    }

    const result = arr.join('\n');
    if (needImport.indexOf(filename) === -1 && arr.indexOf(importStatement) === -1) {
        needImport.push(filename);
    }

    fs.writeFileSync(filename, result, 'utf8');
    return 1;
}


let data = null;
try {
    data = require(sourceMapPath);
} catch(e) {
    console.log('获取映射文件出错！', e);
return;
}

data.forEach(item=>{
    item.source.forEach(src=>{
        const [filename, line, column] = src.location.split('#');
        const opts = {
            key: item.id,
            text: item.defaultMessage,
            textType: src.type,
            filename: filename,
            line: line,
            column: column
        };
        const flag = generateAndWrite(opts);
        if (flag) {
            console.log('替换成功，'+opts.text+' => '+opts.key+' #'+src.location);
        }
    })
});

// 这里加上文件头的import
needImport.forEach(src => {
    fs.readFile(src, 'utf8', (err, data) => {
        if (err) return console.log(err);

        const result = `${importStatement}\n${data}`;
        fs.writeFile(src, result, 'utf8', e => {
            if (e) return console.log(e);
            return 1;
        });
        return 1;
    });
});
