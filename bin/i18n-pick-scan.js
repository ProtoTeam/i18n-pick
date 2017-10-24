#!/usr/bin/env node
// vim: set ft=javascript:

const program = require('commander');
const scan = require('../lib/react');

program.parse(process.argv);

const path = program.args[0] || '.';

scan.run(path);
