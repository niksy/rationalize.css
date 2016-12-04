# rationalize.css

[![Build Status][ci-img]][ci] [![Browserstack][browserstack-img]][browserstack]

Opinionated additions to [Normalize](http://necolas.github.io/normalize.css/).

Features:

* Sane `box-sizing` model
* Interactive elements with pointer cursor
* Normalized invalid state for input elements
* Normalized typography features for form elements
* Responsive adjustments for embedded content such as images and
* Default colors for text and background
* […and much more](https://github.com/niksy/rationalize.css/blob/master/index.css)

## Install

```sh
npm install rationalize.css --save
```

## Usage

```css
@import url('rationalize.css');
```

If you use [PostCSS](https://github.com/postcss/postcss) and plugin like [postcss-import](https://github.com/postcss/postcss-import), Normalize is imported by default.

### Starting styles

If you want to apply set of sensible starting styles, import `start.css` to your project:

```css
@import url('rationalize.css/start.css');
```

## Test

For local integration tests, run `npm run test:integration:local`.

For manual tests, run `npm run test:manual:local` and open <http://localhost:9000/> in your browser.

## Browser support

Tested in IE9+ and all modern browsers.

## License

MIT © [Ivan Nikolić](http://ivannikolic.com)

[ci]: https://travis-ci.org/niksy/rationalize.css
[ci-img]: https://img.shields.io/travis/niksy/rationalize.css.svg
[browserstack]: https://www.browserstack.com/
[browserstack-img]: https://cdn.rawgit.com/niksy/c73069b66d20e2e0005dc8479c125fbd/raw/f644159e3f5f07291f98f59a44146735e9962e0d/browserstack.svg
