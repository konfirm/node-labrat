/*global lab, code, describe, it, expect*/

//  We couldn't be testing this if labrat didn't work... meta or silly?
describe('Exposes BDD syntax', () => {
	describe('from "lab"', () => {
		it('it', (next) => {
			expect(it).not.to.equal(lab.it);
			expect(global.it).not.to.equal(lab.it);

			next();
		});

		it('describe', (next) => {
			expect(describe).to.equal(lab.describe);
			expect(global.describe).to.equal(lab.describe);

			next();
		});

		it('before', (next) => {
			expect(before).to.equal(lab.before);
			expect(global.before).to.equal(lab.before);

			next();
		});

		it('beforeEach', (next) => {
			expect(beforeEach).to.equal(lab.beforeEach);
			expect(global.beforeEach).to.equal(lab.beforeEach);

			next();
		});

		it('after', (next) => {
			expect(after).to.equal(lab.after);
			expect(global.after).to.equal(lab.after);

			next();
		});

		it('afterEach', (next) => {
			expect(afterEach).to.equal(lab.afterEach);
			expect(global.afterEach).to.equal(lab.afterEach);

			next();
		});
	});

	describe('from "code"', () => {
		it('expect', (next) => {
			expect(expect).to.equal(code.expect);

			next();
		});
	});
});
