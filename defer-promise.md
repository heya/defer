# `defer-promise`

This module is based on `defer` module. It exposes three events as promises:

* When `nextTick()` is run.
* When a "read" butch is run.
* When a "write" batch as run.

An application has a chance to add event handlers to run, when a promise is fullfilled using the usual means: `then()` and `done()` methods, and combine them
with other promises conditionally.

## The main API

The main API is represented by three functions that take no arguments, and return corresponding promises.

### `whenNext()`

It takes no arguments and returns a promise, which is resolved when `defer.nextTick()` tasks are run.

### `whenRead()`

It takes no arguments and returns a promise, which is resolved when `defer.submitRead()` tasks are run.

### `whenWrite()`

It takes no arguments and returns a promise, which is resolved when `defer.submitWrite()` tasks are run.
