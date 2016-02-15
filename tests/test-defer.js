define(['module', 'heya-unit', '../defer'], function(module, unit, defer){
	'use strict';

	// tests (this is a copy of tests.js custom-tailored to test the main module)

	unit.add(module, [
		function test_exist (t) {
			eval(t.TEST('typeof defer == "object"'));
			eval(t.TEST('typeof defer.asap == "function"'));
			eval(t.TEST('typeof defer.nextTick == "function"'));
		},

		{
			test: function test_asap (t) {
				var x = t.startAsync('async');
				defer.asap(function () {
					t.info('done');
					x.done();
				});
			},
			logs: ['done']
		},

		{
			test: function test_asap_preserve_order (t) {
				var x = t.startAsync('async');
				defer.asap(function () {
					t.info('#1');
				});
				defer.asap(function () {
					t.info('#2');
					x.done();
				});
			},
			logs: ['#1', '#2']
		},

		{

			test: function test_asap_cascade (t) {
				var x = t.startAsync('async');
				defer.asap(function () {
					defer.asap(function () {
						t.info('#3');
						x.done();
					});
					t.info('#1');
				});
				defer.asap(function () {
					t.info('#2');
				});
			},
			logs: ['#1', '#2', '#3']
		},

		{
			test: function test_nextTick (t) {
				var x = t.startAsync('async');
				defer.asap(function () {
					t.info('done');
					x.done();
				});
			},
			logs: ['done']
		},

		{
			test: function test_nextTick_preserve_order (t) {
				var x = t.startAsync('async');
				defer.nextTick(function () {
					t.info('#1');
				});
				defer.nextTick(function () {
					t.info('#2');
					x.done();
				});
			},
			logs: ['#1', '#2']
		},

		{
			test: function test_nextTick_cascade (t) {
				var x = t.startAsync('async');
				defer.nextTick(function () {
					defer.nextTick(function () {
						t.info('#3');
						x.done();
					});
					t.info('#1');
				});
				defer.nextTick(function () {
					t.info('#2');
				});
			},
			logs: ['#1', '#2', '#3']
		},

		{
			test: function test_asap_takes_precedence_1 (t) {
				var x = t.startAsync('async');
				defer.nextTick(function () {
					defer.nextTick(function () {
						t.info('#3');
						x.done();
					});
					defer.asap(function () {
						t.info('#2');
					});
					t.info('#1');
				});
			},
			logs: ['#1', '#2', '#3']
		},

		{
			test: function test_asap_takes_precedence_2 (t) {
				var x = t.startAsync('async');
				defer.nextTick(function () {
					defer.asap(function () {
						t.info('#2');
					});
					defer.nextTick(function () {
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
				var x = t.startAsync('async');
				defer.nextTick(function () {
					defer.asap(function () {
						t.info('#2');
					});
					defer.asap(function () {
						t.info('#3');
						x.done();
					});
					t.info('#1');
				});
			},
			logs: ['#1', '#2', '#3']
		}
	]);

	return {};
});
