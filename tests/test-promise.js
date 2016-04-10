define(['module', 'heya-unit', '../defer-promise'], function(module, unit, defer){
	'use strict';

	if (typeof Promise == 'undefined') return;

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
				defer.whenAsap().then(function () {
					t.info('done');
					x.done();
				});
			},
			logs: ['done']
		},

		{
			test: function test_asap_preserve_order (t) {
				var x = t.startAsync();
				defer.whenAsap().then(function () {
					t.info('#1');
				});
				defer.whenAsap().then(function () {
					t.info('#2');
					x.done();
				});
			},
			logs: ['#1', '#2']
		},

		{

			test: function test_asap_cascade (t) {
				var x = t.startAsync();
				defer.whenAsap().then(function () {
					defer.whenAsap().then(function () {
						t.info('#3');
						x.done();
					});
					t.info('#1');
				});
				defer.whenAsap().then(function () {
					t.info('#2');
				});
			},
			logs: ['#1', '#2', '#3']
		},

		{
			test: function test_nextTick (t) {
				var x = t.startAsync();
				defer.whenNext().then(function () {
					t.info('done');
					x.done();
				});
			},
			logs: ['done']
		},

		{
			test: function test_nextTick_preserve_order (t) {
				var x = t.startAsync();
				defer.whenNext().then(function () {
					t.info('#1');
				});
				defer.whenNext().then(function () {
					t.info('#2');
					x.done();
				});
			},
			logs: ['#1', '#2']
		},

		{
			test: function test_nextTick_cascade (t) {
				var x = t.startAsync();
				defer.whenNext().then(function () {
					defer.whenNext().then(function () {
						t.info('#3');
						x.done();
					});
					t.info('#1');
				});
				defer.whenNext().then(function () {
					t.info('#2');
				});
			},
			logs: ['#1', '#2', '#3']
		},

		{
			test: function test_asap_takes_precedence_1 (t) {
				var x = t.startAsync(), y = t.startAsync('y');
				defer.whenNext().then(function () {
					defer.whenNext().then(function () {
						t.info('#3');
						x.done();
					});
					defer.whenAsap().then(function () {
						t.info('#2');
						y.done();
					});
					t.info('#1');
				});
			},
			logs: ['#1', '#3', '#2']
		},

		{
			test: function test_asap_takes_precedence_2 (t) {
				var x = t.startAsync();
				defer.whenNext().then(function () {
					defer.whenAsap().then(function () {
						t.info('#2');
					});
					defer.whenNext().then(function () {
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
				defer.whenNext().then(function () {
					defer.whenAsap().then(function () {
						t.info('#2');
					});
					defer.whenAsap().then(function () {
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
				defer.whenNext().then(function () {
					defer.whenRead().then(function () {
						defer.whenWrite().then(function () {
							t.info('#4');
						});
						t.info('#2');
						defer.whenWrite().then(function () {
							t.info('#5');
						});
					});
					defer.whenRead().then(function () {
						defer.whenWrite().then(function () {
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
				defer.whenNext().then(function () {
					defer.whenWrite().then(function () {
						t.info('#4');
					});
					defer.whenRead().then(function () {
						t.info('#2');
					});
					defer.whenWrite().then(function () {
						t.info('#5');
					});
					defer.whenRead().then(function () {
						t.info('#3');
						x.done();
					});
					defer.whenWrite().then(function () {
						t.info('#6');
						y.done();
					});
					t.info('#1');
				});
			},
			logs: ['#1', '#2', '#3', '#4', '#5', '#6']
		}
	]);

	return {};
});
