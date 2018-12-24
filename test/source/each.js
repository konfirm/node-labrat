/*global labrat, describe, it, expect, each*/

describe('Exposes each', () => {
	it('provides a global method each', (next) => {
		expect(each).to.be.function();

		next();
	});

	describe('iterates markdown tables', () => {
		let count = 0;

		each`
			title   | value             | json
			array   | ${[1, 2, 3]}      | [1,2,3]
			object  | ${{ a: 1, b: 2 }} | {"a":1,"b":2}
			string  | ${'foo'}          | "foo"
			string  | foo               | "foo"
			number  | ${123}            | 123
			boolean | ${true}           | true
			boolean | ${false}          | false
			null    | ${null}           | null
		`('$title turns into $json', ({ value, json }, next) => {
			expect(JSON.stringify(value)).to.equal(json);
			++count;

			next();
		});

		it('reached all tests', (next) => {
			expect(count).to.equal(8);

			next();
		});
	});
});
