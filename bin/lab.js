#!/usr/bin/env node

const fs = require('fs');
const path = fs.realpathSync(`${__dirname}/../node_modules/lab`);
const ratpack = require('../package.json');
const labpack = require(`${path}/package.json`);

if (!path) {
	throw new Error('Lab not found');
}

console.log(`Running ${labpack.name}@${labpack.version} (${ratpack.name}@${ratpack.version})`);
require(`${path}/bin/lab`);
