# `defer`

[![Build status][travis-image]][travis-url]
[![Dependencies][deps-image]][deps-url]
[![devDependencies][dev-deps-image]][dev-deps-url]
[![NPM version][npm-image]][npm-url]


This module provides a functionality similar to [`process.nextTick()`](https://nodejs.org/docs/latest/api/process.html#process_process_nexttick_callback_arg)
of [node.js](https://nodejs.org/en/), but in browser. It tries to use [`setImmediate()`](https://developer.mozilla.org/en-US/docs/Web/API/Window/setImmediate),
if available, reverting to [`postMessage()`](https://developer.mozilla.org/en-US/docs/Web/API/window/postMessage), and falling back on
[`setTimeout()`](https://developer.mozilla.org/en-US/docs/Web/API/WindowTimers/setTimeout). In general, the module's implementation follows
[`setImmediate` polyfill](https://github.com/YuzuJS/setImmediate) outline.

The module provides a foundation for running micro tasks, yet giving a chance for a browser to run its internal tasks as well including layout,
rendering, and garbage collection.

Additionally a batching is provided for "read" and "write" operations.

"Read" and "write" tasks are used for DOM operations to prevent an excessive DOM thrashing. "Read" operation, such as reading of layout-related style properties,
or node geometry measuring of any sort, can delay everything synchronously until a browser finishes a layout and assigns all sizes, and offesets.
"Write" operations can mutate DOM invalidating everyting, and triggering re-application of CSS rules, and re-layout. Interleaving such operations slows down
everything considerably. Batching them together by kind speeds things up.

This module can be used with [AMD]() and globals. In the latter case it can be accessed as `window.heya.defer`.

## The main API

* `nextTick()` &mdash; runs a micro task during a next tick.
* `asap()` &mdash; adds a micro task to the end of a current task queue.
* `submitRead()` &mdash; submits a "read" task. All "read" tasks run as a single batch.
* `submitWrite()` &mdash; submits a "write" task. All "write" tasks run as a single batch.

### `nextTick()`

This procedure takes a single argument: a micro task as a procedure without arguments. It is queued, and scheduled to be run at a next time slice.

### `asap()`

This procedure takes a single argument: a micro task as a procedure without arguments. It is added to a queue to be run, when tasks are executed &mdash;
it can happen this time slice, or the next one.

### `submitRead()`

This procedure takes a single argument: a micro task as a procedure without arguments. It is based on `asap()`, and queues "read" tasks to be run as a single batch.


### `submitWrite()`

This procedure takes a single argument: a micro task as a procedure without arguments. It is based on `asap()`, and queues "write" tasks to be run as a single batch.

# `defer-promise`

This module is based on `defer` module. It exposes three events as promises:

* When `asap()` is run.
* When `nextTick()` is run.
* When a "read" butch is run.
* When a "write" batch as run.

An application has a chance to add event handlers to run, when a promise is fullfilled using the usual means: `then()` and `done()` methods, and combine them
with other promises conditionally.

## The main API

The main API is represented by three functions that take no arguments, and return corresponding promises.

### `whenAsap()`

It takes no arguments and returns a promise, which is resolved when `defer.asap()` tasks are run.

### `whenNext()`

It takes no arguments and returns a promise, which is resolved when `defer.nextTick()` tasks are run.

### `whenRead()`

It takes no arguments and returns a promise, which is resolved when `defer.submitRead()` tasks are run.

### `whenWrite()`

It takes no arguments and returns a promise, which is resolved when `defer.submitWrite()` tasks are run.

# Versions

1.0.0 &mdash; *the initial public release*

# License

BSD


[npm-image]:      https://img.shields.io/npm/v/heya-async.svg
[npm-url]:        https://npmjs.org/package/heya-async
[deps-image]:     https://img.shields.io/david/heya/async.svg
[deps-url]:       https://david-dm.org/heya/async
[dev-deps-image]: https://img.shields.io/david/dev/heya/async.svg
[dev-deps-url]:   https://david-dm.org/heya/async#info=devDependencies
[travis-image]:   https://img.shields.io/travis/heya/async.svg
[travis-url]:     https://travis-ci.org/heya/async
