(function(_,f){window.heya.defer.promise=f(window.heya.async.FastDeferred,window.heya.defer);})
(['heya-async/FastDeferred', './defer'], function (Deferred, defer) {
	'use strict';

	// defer queues with promises
	// depends on defer.js and Deferred.js

	function getPromise (queue) {
		var deferred;
		return function () {
			if (!deferred) {
				deferred = new Deferred();
				defer[queue](function () {
					deferred.resolve(true);
					deferred = null;
				});
			}
			return deferred.promise;
		};
	}

	defer.whenAsap  = getPromise('asap');
	defer.whenNext  = getPromise('nextTick');
	defer.whenRead  = getPromise('submitRead');
	defer.whenWrite = getPromise('submitWrite');
}());
