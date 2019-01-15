# rationalize.css

[![Build Status][ci-img]][ci] [![BrowserStack Status][browserstack-img]][browserstack]

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
npm install normalize@7 rationalize.css --save
```

If you don’t need IE9 support, install `normalize@latest`.

## Usage

```css
@import url('normalize.css');
@import url('rationalize.css');
```

### Starting styles

If you want to apply set of sensible starting styles, also import `start.css` to your project:

```css
@import url('rationalize.css/start.css');
```

## Browser support

Tested in IE9+ and all modern browsers.

## Test

For automated tests, run `npm run test:automated` (append `:watch` for watcher support).

For integration tests, run `npm run test:integration` (append `:watch` for watcher support).

For manual tests, run `npm run test:manual` and open <http://localhost:9000/> in your browser.

## License

MIT © [Ivan Nikolić](http://ivannikolic.com)

[ci]: https://travis-ci.org/niksy/rationalize.css
[ci-img]: https://travis-ci.org/niksy/rationalize.css.svg?branch=master
[browserstack]: https://www.browserstack.com/
[browserstack-img]: https://www.browserstack.com/automate/badge.svg?badge_key=VEhBZ0ZVMWliSGZzVExkcmZTUlBkaCs1bDdyRHllTmFRcXMzanJUd0tCaz0tLTErOGtUZDk1WHFzQjJrNW5tQUkyTnc9PQ==--41cb4dc771ca127384ccbc2b9e321b10e32f1957
[normalize]: https://necolas.github.io/normalize.css/
