const fs = require('fs');
const Lab = require('lab')
const code = require('code');
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

		//  register the clean up of all the monkey-patched global values
		lab.after((done) => {
			map.get(this).monkey.forEach((clean) => clean());

			done();
		});
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
}

const labrat = new LabRat()

//  make lab, code and labrat globally available
labrat.globalize({ lab, code, labrat }, 'lab', 'code', 'labrat');
//  expose the it, describe, before(Each) and after(Each) methods from lab globally
labrat.globalize(lab, 'it', 'describe', 'before', 'beforeEach', 'after', 'afterEach');
//  expose the expect method from code globally
labrat.globalize(code, 'expect');
//  expose the source methos from labrat globally
labrat.globalize({
	source: labrat.source.bind(labrat),
}, 'source');

module.exports = labrat;
