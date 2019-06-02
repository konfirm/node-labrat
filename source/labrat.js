const fs = require('fs');
const Lab = require('@hapi/lab')
const code = require('@hapi/code');
const tlEach = require('template-literal-each');
const lab = Lab.script();
const map = new WeakMap();

/**
 *  Convenience wrapper around the Hapi Lab and Code BDD syntax
 *  @class   LabRat
 *  @author  Rogier Spieker <rogier+labrat@konfirm.eu>
 */
class LabRat {
	constructor() {
		const base = process.cwd();
		const path = fs.readdirSync(base)
			.filter((file) => /^(?:src|sources?|libs?)$/i.test(file))
			.reduce((carry, file) => carry);

		//  assign the base settings to the WeakMap
		map.set(this, {
			path: `${base}/${path}`,
			monkey: []
		})

		lab.after(() => new Promise((resolve) => {
			map.get(this).monkey.forEach((clean) => clean());

			resolve();
		}));
	}

	/**
	 *  Obtain an object consisting of labrat, lab and code
	 *  @return  {Object}  { labrat, lab, code }
	 */
	get export() {
		return { labrat: this, lab, code };
	}

	/**
	 *  Get the base path for sources to load
	 *  @return  {String}  source path
	 */
	get sourcePath() {
		return map.get(this).path;
	}

	/**
	 *  Set the base path for sources to load
	 *  @param   {String}  path
	 *  @return  void
	 */
	set sourcePath(value) {
		const settings = map.get(this);

		settings.path = value;
	}

	/**
	 *  Register all provided item from the given `from`
	 *  @param   {Object}           from
	 *  @param   {...String|Array}  list
	 *  @return  void
	 */
	globalize(from, ...list) {
		if (!list.length) {
			list = Object.keys(from);
		}

		const patch = (key) => {
			global[key] = from[key];

			return () => delete global[key];
		}

		map.get(this).monkey.push(...[].concat(list).map(patch));
	}

	/**
	 *  Require a module from a default location
	 *  (use this to prevent tons of `../../path/to/module' constructs)
	 *  @param   {String}  module
	 *  @return  {*}       module
	 */
	source(module) {
		const path = map.get(this).path;

		return require(`${path}/${module}`);
	}

	/**
	 * Run a single test using a Promise to mimic older Lab behavor
	 * 
	 * @param string  title 
	 * @param funtion test 
	 */
	testRunner(title, test) {
		lab.it(title, () => new Promise((resolve) => test(resolve)));
	}

	/**
	 * Implementation of a markdown-table processor to repeatedly run the same
	 * test on many slight variations

	 * @param  {...any} args 
	 */
	each(...args) {
		const traverse = tlEach(...args);

		return (description, test) => traverse((record) => {
			const title = description.replace(/\$(\w+)/g, (_, name) => record[name]);

			this.testRunner(title, (next) => test(record, next));
		});
	}
}

const labrat = new LabRat()

//  make lab, code and labrat globally available
labrat.globalize({ lab, code, labrat }, 'lab', 'code', 'labrat');
//  expose the describe, before(Each) and after(Each) methods from lab globally
labrat.globalize(lab, 'describe', 'before', 'beforeEach', 'after', 'afterEach');
//  expose the expect from code globally
labrat.globalize(code, 'expect');
//  expose the source and it methods from labrat globally
labrat.globalize({
	source: labrat.source.bind(labrat),
	it: labrat.testRunner.bind(labrat),
	each: labrat.each.bind(labrat),
}, 'source', 'it', 'each');

module.exports = labrat;
