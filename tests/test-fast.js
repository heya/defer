define(['module', 'heya-unit', '../defer-promise', 'heya-async/FastDeferred'], function(module, unit, defer, Deferred){
	'use strict';

	unit.add(module, [
		function test_exist (t) {
			eval(t.TEST('typeof defer == "object"'));
			eval(t.TEST('typeof defer.whenAsap == "function"'));
			eval(t.TEST('typeof defer.whenNext == "function"'));
			eval(t.TEST('typeof defer.whenRead == "function"'));
			eval(t.TEST('typeof defer.whenWrite == "function"'));
		},

		{
			test: function test_asap (t) {
				var x = t.startAsync();
				defer.whenAsap(Deferred).then(function () {
					t.info('done');
					x.done();
				});
			},
			logs: ['done']
		},

		{
			test: function test_asap_preserve_order (t) {
				var x = t.startAsync();
				defer.whenAsap(Deferred).then(function () {
					t.info('#1');
				});
				defer.whenAsap(Deferred).then(function () {
					t.info('#2');
					x.done();
				});
			},
			logs: ['#1', '#2']
		},

		{

			test: function test_asap_cascade (t) {
				var x = t.startAsync();
				defer.whenAsap(Deferred).then(function () {
					defer.whenAsap(Deferred).then(function () {
						t.info('#3');
						x.done();
					});
					t.info('#1');
				});
				defer.whenAsap(Deferred).then(function () {
					t.info('#2');
				});
			},
			logs: ['#1', '#2', '#3']
		},

		{
			test: function test_nextTick (t) {
				var x = t.startAsync();
				defer.whenNext(Deferred).then(function () {
					t.info('done');
					x.done();
				});
			},
			logs: ['done']
		},

		{
			test: function test_nextTick_preserve_order (t) {
				var x = t.startAsync();
				defer.whenNext(Deferred).then(function () {
					t.info('#1');
				});
				defer.whenNext(Deferred).then(function () {
					t.info('#2');
					x.done();
				});
			},
			logs: ['#1', '#2']
		},

		{
			test: function test_nextTick_cascade (t) {
				var x = t.startAsync();
				defer.whenNext(Deferred).then(function () {
					defer.whenNext(Deferred).then(function () {
						t.info('#3');
						x.done();
					});
					t.info('#1');
				});
				defer.whenNext(Deferred).then(function () {
					t.info('#2');
				});
			},
			logs: ['#1', '#2', '#3']
		},

		{
			test: function test_asap_takes_precedence_1 (t) {
				var x = t.startAsync(), y = t.startAsync('y');
				defer.whenNext(Deferred).then(function () {
					defer.whenNext(Deferred).then(function () {
						t.info('#3');
						x.done();
					});
					defer.whenAsap(Deferred).then(function () {
						t.info('#2');
						y.done();
					});
					t.info('#1');
				});
			},
			logs: ['#1', '#2', '#3']
		},

		{
			test: function test_asap_takes_precedence_2 (t) {
				var x = t.startAsync();
				defer.whenNext(Deferred).then(function () {
					defer.whenAsap(Deferred).then(function () {
						t.info('#2');
					});
					defer.whenNext(Deferred).then(function () {
						t.info('#3');
						x.done();
					});
					t.info('#1');
				});
			},
			logs: ['#1', '#2', '#3']
		},

		{
			test: function test_asap_nextTick_preserve_order (t) {
				var x = t.startAsync();
				defer.whenNext(Deferred).then(function () {
					defer.whenAsap(Deferred).then(function () {
						t.info('#2');
					});
					defer.whenAsap(Deferred).then(function () {
						t.info('#3');
						x.done();
					});
					t.info('#1');
				});
			},
			logs: ['#1', '#2', '#3']
		},

		{
			test: function test_read_takes_precedence_1 (t) {
				var x = t.startAsync();
				defer.whenNext(Deferred).then(function () {
					defer.whenRead(Deferred).then(function () {
						defer.whenWrite(Deferred).then(function () {
							t.info('#4');
						});
						t.info('#2');
						defer.whenWrite(Deferred).then(function () {
							t.info('#5');
						});
					});
					defer.whenRead(Deferred).then(function () {
						defer.whenWrite(Deferred).then(function () {
							t.info('#6');
							x.done();
						});
						t.info('#3');
					});
					t.info('#1');
				});
			},
			logs: ['#1', '#2', '#3', '#4', '#5', '#6']
		},

		{
			test: function test_read_takes_precedence_2 (t) {
				var x = t.startAsync(), y = t.startAsync('y');
				defer.whenNext(Deferred).then(function () {
					defer.whenWrite(Deferred).then(function () {
						t.info('#4');
					});
					defer.whenRead(Deferred).then(function () {
						t.info('#2');
					});
					defer.whenWrite(Deferred).then(function () {
						t.info('#5');
					});
					defer.whenRead(Deferred).then(function () {
						t.info('#3');
						x.done();
					});
					defer.whenWrite(Deferred).then(function () {
						t.info('#6');
						y.done();
					});
					t.info('#1');
				});
			},
			logs: ['#1', '#4', '#5', '#6', '#2', '#3']
		}
	]);

	return {};
});
