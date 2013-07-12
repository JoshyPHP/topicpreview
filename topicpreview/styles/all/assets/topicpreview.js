/*
 * jQuery ToolTips for Topic Preview
 * https://github.com/VSEphpbb/topic_preview
 *
 * Copyright 2013, Matt Friedman
 * Licensed under the GPL Version 2 license.
 * http://www.opensource.org/licenses/GPL-2.0
 */

;(function ( $, window, document, undefined ) {

	$.fn.topicPreview = function( options ) {

		var settings = $.extend( {
			"delay" : 1500,
			"width" : 320,
			"left"  : 35,
			"top"   : 25,
			"drift" : 15
		}, options );

		var previewTimeout = 0,
			previewContainer = $('<div id="topic_preview"></div>').css("width", settings.width).appendTo("body");

		return this.each(function() {
			var obj = $(this),
				previewText = obj.closest("li").find(".topic_preview_first").html() || obj.closest("tr").find(".topic_preview_first").html(), // cache topic preview text
				originalTitle = obj.closest("dt").attr("title"); // cache original title attributes

			obj.hover(function() {
				// Proceed only if there is content to display
				if (previewText === undefined || previewText === '') {
					return false;
				}

				// clear any existing timeouts
				if (previewTimeout !== 0) {
					clearTimeout(previewTimeout);
				}

				// remove original titles to prevent overlap
				obj.attr("title", "").closest("dt").attr("title", "");

				previewTimeout = setTimeout(function() {
					// clear the timeout var after delay and function begins to execute	
					previewTimeout = 0;

					// Fill the topic_preview
					previewContainer.html(previewText);

					// Window bottom edge detection, invert topic preview if needed 
					var previewTop = obj.offset().top + settings.top,
						previewBottom = previewTop + previewContainer.height() + 8;
					previewContainer.toggleClass("invert", edgeDetect(previewBottom));
					previewTop = edgeDetect(previewBottom) ? obj.offset().top - previewContainer.outerHeight() - 8 : previewTop;

					// Display the topic_preview positioned relative to the hover object
					previewContainer
						.css({
							"top"   : previewTop + "px",
							"left"  : obj.offset().left + settings.left + "px"
						})
						.fadeIn("fast"); // display the topic_preview with a fadein
				}, settings.delay); // Use a delay before showing in topic_preview

			}, function() {
				// clear any existing timeouts
				if (previewTimeout !== 0) {
					clearTimeout(previewTimeout);
				}

				// Remove topic_preview
				previewContainer.stop(true, true).fadeOut("fast") // hide the topic_preview with a fadeout
					.animate({"top": "-=" + settings.drift + "px"}, {duration: "fast", queue: false}, function() {
						// animation complete
					});
				obj.closest("dt").attr("title", originalTitle); // reinstate original title attributes
			});
		});
	};

	// Check if y coord extends beyond bottom edge of window (with 20px of pad)
	function edgeDetect(y) {
		return ( y >= ($(window).scrollTop() + $(window).height() - 20) );
	}

})( jQuery, window, document );
