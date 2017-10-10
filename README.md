# LabRat
A simple wrapper around Hapi's [lab](https://github.com/hapijs/lab) and [code](https://github.com/hapijs/code) modules to allow for easy BDD-style test bootstrapping.
It globally exposes several BDD-style methods from both [lab](https://github.com/hapijs/lab) and [code](https://github.com/hapijs/code) wich are cleaned up after the tests, this prevents lab from reporting (the defined globals) as possible leaks.

## Installation
Note that labrat is a so-called scoped npm module, hence you will need to specify the scope for both the installation and use.

```
$ npm install --save-dev @konfirm/labrat
```

## Usage
LabRat is intended to make the [lab](https://github.com/hapijs/lab) bootstrap slightly more convenient, to use the bootstrap create a file `test/index.spec.js` with the following contents:

```
module.exports = require('@konfirm/labrat').export;
```

Now you can easily create your tests in subfolders of `test`, where you automatically have access to all of the BDD-style functions [lab](https://github.com/hapijs/lab) and [code](https://github.com/hapijs/code) offer.

If you'd like to add (and thus afterwards remove) your own custom global functions, simply provide this to the [`globalize`](#globalize) method;


### `describe` (lab)
```
describe('Description', () => {
	//  your tests
});
```

### `it` (lab)
```
it('does something', (next) => {
	//  your expectation(s)

	next();
})
```

### `before` (lab)
Executes a function call before the tests inside a describe-block.

```
describe('Description', () => {
	before((done) => {
		//  wait one second
		setTimeout(done, 1000);
	});
});
```

### `beforeEach` (lab)
Similar to `before` but executes the function call before each test inside the describe-block;

```
describe('Description', () => {
	beforeEach((done) => {
		//  wait one second
		setTimeout(done, 1000);
	});
});
```

### `after` (lab)
Executes a function call after the tests inside a describe-block

```
describe('Description', () => {
	after((done) => {
		//  wait one second
		setTimeout(done, 1000);
	});
});
```

### `afterEach` (lab)
Similar to `after` but executes a function call after each test inside a describe-block

```
describe('Description', () => {
	afterEach((done) => {
		//  wait one second
		setTimeout(done, 1000);
	});
});
```

### `expect` (code)
Expect provides the `Code.expect` method, with full access to its [full assertion library](https://github.com/hapijs/code/blob/master/API.md)

```
expect(true).to.be.a.boolean().and.to.not.equal(false);
```

### `globalize`
LabRat can make most functions available globally (and clean them up before [lab]() checks for any leaked properties).

```
//  expose the platform, freemem and totalmem method from the native 'os' module
labrat.globalize(require('os'), 'platform', 'freemem', 'totalmem');
```

If the function to globalize is stand-alone (not part of a module/class/object), a slightly more elaborate syntax must be used:

```
function hello(who) {
	return `hello ${who}`;
}

labrat.globalize({ hello }, 'hello');
```

The example above can also be written in a slightly more compact way
```
labrat.globalize({ hello: (who) => `hello ${who}` }, 'hello');
```

### `source`
A lot of times requiring a local module to test can look a bit messy as the path may end up looking something like `../../path/to/module` in the test file.
In order to reduce this visual clutter, there's the `source` function, which is a wrapper around `require` with a prepared base path.

```
const MyModule = source('mymodule');
```

By default LabRat will look for the following common module folders in the project root directory;
 - src
 - source
 - sources
 - lib
 - libs

If your project is structured differently, no worries, you can easily change the path.

```
labrat.sourcePath = '/path/to/modules';
```

If the project uses the same location for its own modules, simply add this to the `test/index.spec.js` file:

```
const labrat = require('@konfirm/labrat');
labrat.sourcePath = '/path/to/the/modules';

module.exports = labrat.export;
```

#### Tips to define a custom path
A pretty basic project setup would be something like

```
my_modules/
	*
node_modules/
	*
test/
	index.spec.js
package.json
```

From the `index.spec.js` there are to ways to set `my_modules` as the main module path for labrat:

_Relative to `index.spec.js`_
```
labrat.sourcePath = `${__dirname}/../my_modules`;
```

_Relative to the project folder_
```
labrat.sourcePath = `${process.cwd()}/my_modules`;
```

## License

MIT License
Copyright (c) 2017 Rogier Spieker (Konfirm)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
