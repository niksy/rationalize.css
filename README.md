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

## Install

```sh
npm install rationalize.css --save
```

## Usage

```css
@import url('normalize.css');
@import url('rationalize.css');
```

## Test

For manual tests, run `npm test -- --watch` and open <http://localhost:9000/> in your browser.

## Browser support

Tested in IE8+ and all modern browsers.

## License

MIT © [Ivan Nikolić](http://ivannikolic.com)

[ci]: https://travis-ci.org/niksy/rationalize.css
[ci-img]: https://img.shields.io/travis/niksy/rationalize.css.svg
[browserstack]: https://www.browserstack.com/
[browserstack-img]: https://cdn.rawgit.com/niksy/c73069b66d20e2e0005dc8479c125fbd/raw/f644159e3f5f07291f98f59a44146735e9962e0d/browserstack.svg
