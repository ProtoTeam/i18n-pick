#!/usr/bin/env node
 // vim: set ft=javascript:

const program = require('commander');

program
  .version('1.5.0')
  .command('scan [path]', '扫描 React 项目')
  .command('pick', '替换文案')
  .command('export', '导出文案')
  .parse(process.argv);
