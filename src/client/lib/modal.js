(function () {
	'use strict';

	var $el = $('#step-modal');
	var $title = $('#step-modal h4');

	module.exports = {
		show: show,
		hide: hide
	};

	function show(step) {
		$el.modal().draggable();
		$title.html(step.name);
	}

	function hide() {

	}
})();