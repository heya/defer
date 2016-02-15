# `defer`

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