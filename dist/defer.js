(function(_,f,g){g=window;g=g.heya||(g.heya={});g.defer=f();})
([], function () {
	'use strict';

	// general job queue, with dedicated read/write slots partially inspired by https://github.com/wilsonpage/fastdom under MIT

	var queue = [], backlog = [], reads = [], writes = [], handle = null, start,
		PROCESSING = {}; // handle can be null (nothing), PROCESSING (processing), or something else (delay)

	function processJobs () {
		handle = PROCESSING;
		// run reads
		for (var i = 0; i < reads.length; ++i) {
			reads[i]();
		}
		reads = [];
		// run regular jobs
		for (i = 0; i < queue.length; ++i) {
			queue[i]();
		}
		queue = backlog;
		backlog = [];
		handle = null;
		// run writes
		for (i = 0; i < writes.length; ++i) {
			writes[i]();
		}
		writes = [];
		if (queue.length || reads.length) {
			start();
		}
	}

	function asap (f) {
		queue.push(f);
		handle === null && start();
	}

	function nextTick (f) {
		(handle === PROCESSING ? backlog : queue).push(f);
		handle === null && start();
	}

	function submitRead (f) {
		reads.push(f);
		handle === null && start();
	}

	function submitWrite (f) {
		writes.push(f);
		handle === null && start();
	}

	if (typeof setImmediate == 'function') {
		start = function () {
			handle = setImmediate(processJobs);
		};
	} else if (typeof postMessage == 'function' && typeof addEventListener == 'function') {
		addEventListener('message', function (evt) {
			var src = evt.source;
			if ((src === window || src === null) && evt.data === 'ay-process-tick') {
				evt.stopPropagation();
				processJobs();
			}
		}, true);
		start = function () {
			handle = 1;
			postMessage('ay-process-tick', '*');
		};
	} else {
		start = function () {
			handle = setTimeout(processJobs);
		};
	}

	return {
		asap:        asap,        // run possibly in this cycle
		nextTick:    nextTick,    // run after a delay in the next cycle
		submitRead:  submitRead,  // run a read operation in a single batch
		submitWrite: submitWrite  // run a write operation in a single batch
	};
});
