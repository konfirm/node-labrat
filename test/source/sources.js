/*global labrat, describe, it, expect*/

describe('Loading sources', () => {
	const fs = require('fs');

	it('points to the source path', (next) => {
		const hard = fs.realpathSync('source');
		const soft = fs.realpathSync(labrat.sourcePath);

		expect(hard).to.equal(soft);

		next();
	});

	it('source loads labrat', (next) => {
		const loaded = source('labrat');

		expect(loaded).to.equal(labrat);

		next();
	});

	it('allows changing the source path', (next) => {
		labrat.sourcePath = './foo/bar/baz';

		expect(labrat.sourcePath).to.equal('./foo/bar/baz');
		expect(() => source('labrat')).to.throw(Error, /^cannot find module/i);

		next();
	});
});
