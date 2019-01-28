# `defer`

[![Greenkeeper badge](https://badges.greenkeeper.io/heya/defer.svg)](https://greenkeeper.io/)

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

First scheduled task of a certain type will run before the next scheduled task of the same type.

### `nextTick()`

This procedure takes a single argument: a micro task as a procedure without arguments. It is queued, and scheduled to be run at the next time slice.

### `asap()`

This procedure takes a single argument: a micro task as a procedure without arguments. "Asap" tasks are meant to be run as soon as possible, but if the current time slice cannot be scheduled at the moment, an "asap" tasks is scheduled as a normal "next tick" task. There is no inherent precendence order between "asap" and "next tick" tasks scheduled for the same time slice &mdash; they can be run in any relative order.

### `submitRead()`

This procedure takes a single argument: a micro task as a procedure without arguments. It queues "read" tasks to be run as a single batch this time slice or the next one. "Read" tasks are run before general and "write" tasks.


### `submitWrite()`

This procedure takes a single argument: a micro task as a procedure without arguments. It queues "write" tasks to be run as a single batch this time slice, or the next one. "Write" tasks are run after "read" tasks and general tasks.

# `defer-promise`

This module is based on `defer` module. It exposes three events as promises:

* When `asap()` is run.
* When `nextTick()` is run.
* When a "read" butch is run.
* When a "write" batch as run.

An application has a chance to add event handlers to run, when a promise is fullfilled using the usual means: `then()` and `done()` methods, and combine them
with other promises conditionally.

## The main API

The main API is represented by three functions that take up to one argument, and return corresponding promises.

The only argument is a `Deferred` compatible constructor similar to provided by `heya-async` module (`Deferred` or `FastDeferred`). If not specified,
the standard `Promise` is used.

### `whenAsap()`

It takes no arguments and returns a promise, which is resolved when `defer.asap()` tasks are run.

### `whenNext()`

It takes no arguments and returns a promise, which is resolved when `defer.nextTick()` tasks are run.

### `whenRead()`

It takes no arguments and returns a promise, which is resolved when `defer.submitRead()` tasks are run.

### `whenWrite()`

It takes no arguments and returns a promise, which is resolved when `defer.submitWrite()` tasks are run.

# Versions

- 1.1.0 &mdash; *Reworked `defer-promise` module.*
- 1.0.1 &mdash; *Added globals-based versions of modules.*
- 1.0.0 &mdash; *The initial public release.*

# License

BSD


[npm-image]:      https://img.shields.io/npm/v/heya-defer.svg
[npm-url]:        https://npmjs.org/package/heya-defer
[deps-image]:     https://img.shields.io/david/heya/defer.svg
[deps-url]:       https://david-dm.org/heya/defer
[dev-deps-image]: https://img.shields.io/david/dev/heya/defer.svg
[dev-deps-url]:   https://david-dm.org/heya/defer#info=devDependencies
[travis-image]:   https://img.shields.io/travis/heya/defer.svg
[travis-url]:     https://travis-ci.org/heya/defer
