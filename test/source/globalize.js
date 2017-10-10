/*global labrat, describe, it, expect*/

describe('Globalize', () => {
	it('allows cherrypicking what to expose', (next) => {
		const options = {
			fooA: () => 'is foo',
			barA: () => 'is bar',
			bazA: () => 'is baz',
		};

		labrat.globalize(options, 'fooA');

		expect(global).to.contain('fooA');
		expect(global.fooA).to.be.function();
		expect(global.fooA).to.equal(fooA);
		expect(global.fooA).to.equal(options.fooA);
		expect(fooA()).to.equal('is foo');

		expect(global).not.to.contain('barA');
		expect(global).not.to.contain('bazA');

		next();
	});

	it('exposes all if no keys are provided', (next) => {
		const options = {
			fooB: () => 'is foo',
			barB: () => 'is bar',
			bazB: () => 'is baz',
		};

		labrat.globalize(options);

		expect(global).to.contain('fooB');
		expect(global.fooB).to.be.function();
		expect(global.fooB).to.equal(fooB);
		expect(global.fooB).to.equal(options.fooB);
		expect(fooB()).to.equal('is foo');

		expect(global).to.contain('barB');
		expect(global.barB).to.be.function();
		expect(global.barB).to.equal(barB);
		expect(global.barB).to.equal(options.barB);
		expect(barB()).to.equal('is bar');

		expect(global).to.contain('bazB');
		expect(global.bazB).to.be.function();
		expect(global.bazB).to.equal(bazB);
		expect(global.bazB).to.equal(options.bazB);
		expect(bazB()).to.equal('is baz');

		next();
	});
});
