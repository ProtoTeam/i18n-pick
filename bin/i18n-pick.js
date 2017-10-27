#!/usr/bin/env node
 // vim: set ft=javascript:

const program = require('commander');

program
  .version('1.0.15')
  .command('scan [path]', '扫描 React 项目')
  .command('pick', '提取文案')
  .parse(process.argv);
