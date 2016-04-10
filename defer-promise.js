define(['./defer'], function (defer) {
	'use strict';

	// defer queues with promises

	function getPromise (queue) {
		var promise;
		return function (Deferred) {
			if (!promise) {
				var P = Deferred && Deferred.Wrapper || Promise;
				promise = new P(function (resolve) {
					defer[queue](function () {
						promise = null;
						resolve(true);
					});
				});
			}
			return promise;
//			var P = Deferred && Deferred.Wrapper || Promise;
//			return new P(function (resolve) {
//				defer[queue](resolve);
//			});
		};
	}

	defer.whenAsap  = getPromise('asap');
	defer.whenNext  = getPromise('nextTick');
	defer.whenRead  = getPromise('submitRead');
	defer.whenWrite = getPromise('submitWrite');

	return defer;
});
