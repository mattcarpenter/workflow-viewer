(function () {
	'use strict';

	var $el = $('#step-modal');
	var $title = $('#step-modal h4');
	var $inData = $('#inData');
	var $outData = $('#outData');

	module.exports = {
		show: show,
		hide: hide
	};

	function show(step) {
		$inData.text(JSON.stringify(step.inData || {}, null, 2));
		$outData.text(JSON.stringify(step.outData || {}, null, 2));
		$el.modal();
		$title.html(step.name);
		console.log(step);
	}

	function hide() {

	}
})();