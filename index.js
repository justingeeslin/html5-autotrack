VideoAutoTrack = function (opts, contentTarget) {
	var self = this;

	// User-configurable defaults
	var defaults = {
		target : $('video'),
		classToAdd : 'auto-tracked',
		//Fired once, the first time the user presses play
		onstart: function() {},
		//Every time the user presses play
		onplay: function() {},
		//Fired when the video finishes
		oncomplete: function() {},
		// s.Media.overtrack decides if this class should attach its event handlers to the object. If you want to use this class anyway, set this to true.
		autoTrackOverride: false,
		// Enables logging
		debug: false
	};

	this.log = function(msg) {
		if (this.debug) {
			console.log(msg);
		}
	}

	// Read-only, public variables
	// Keep up with whether the events have been attached or not.
	this.autotracked = false;
	// Has the video started played. Even if it was paused, has it ever started playing.
	this.isStarted = false;
	// Has the video reached the end.
	this.isEnded = false;
	// has the video been removed either through DOM mutations or Window unloads.
	this.isRemoved = false;
	// has the video been removed after pressing play for the first time and before it ends.
	this.isAbandoned = false;

	$.extend(this, defaults, opts);

	//jQuery Selection overrides target option
	this.target = typeof contentTarget !== "undefined" ? $(contentTarget) : this.target;

	if (typeof s == "object" && typeof s.Media != "undefined" && s.Media.autoTrack == false) {
		var msg = 'Using Video Auto Track when Media Auto track is disabled.'

		if (!self.autoTrackOverride) {
			console.error(msg);
			return;
		}
		else {
			console.warn(msg);
		}
	}

	self.log('Autotracking this video el:')
	self.log(this.target)

	if (this.classToAdd) {
		self.log('Adding a class to the tracked video.')
		this.target.addClass(this.classToAdd)
	}

	var videoMeta = {
		name: "Video 1",
		segment: undefined,
		segmentNum: undefined,
		segmentLength: undefined
	}

	var mediaName = 'Video'

	this.target.on('play', function() {
		self.log('Media Playing from ' + self.target[0].currentTime);
		self.onplay()

		if (typeof s.Media !== "undefined" && typeof s.Media.play !== "undefined") {
			s.Media.play(videoMeta.name, self.target[0].currentTime, videoMeta.segmentNum, videoMeta.segment, videoMeta.segmentLength);
		}
		else {
			console.warn('Attempting to call s.Media.play() but play is undefined.');
		}

		//If not started
		if (!self.isStarted) {
			self.isStarted = true
			// start it
			self.onstart();

		}
	})

	this.target.on('pause', function() {
		self.log('Media Paused at ' + self.target[0].currentTime);
		if (typeof s.Media !== "undefined" && typeof s.Media.stop !== "undefined") {
			s.Media.stop(videoMeta.name, self.target[0].currentTime);
		}
		else {
			console.warn('Attempting to call s.Media.stop() but stop is undefined.');
		}

	})

	this.target.on('ended', function() {
		self.log('Media Ended at ' + self.target[0].currentTime);
		self.isEnded = true;
		self.oncomplete()

		if (typeof s.Media !== "undefined" && typeof s.Media.close !== "undefined") {
			s.Media.close(videoMeta.name);
		}
		else {
			console.warn('Attempting to call s.Media.close() but close is undefined.');
		}

	})

	// Things to do on removal of the video, either by DOM manipulation or window unloading.
	var onVideoRemoval = function() {
		self.log('Video removed.');
		self.isRemoved = true;

		if (self.isStarted && !self.isEnded) {
			self.isAbandoned = true;
			self.log('Video abandoned. ie Started but never ended.')
		}
	}

	this.target.on('remove', onVideoRemoval);
	this.target.parent().on('DOMNodeRemoved', onVideoRemoval);
	$(window).on('beforeunload', onVideoRemoval);

	this.autotracked = true;

	return this;
}

var initVideoAutoTrack = function() {
	// self.log('Init Video Auto Track')
	if (typeof s == "object" && typeof s.Media != "undefined" && s.Media.autoTrack) {
		// self.log('Media AutoTrack is enabled. Attaching to HTML5 video players if there are any.')

		var videoSelection = $('video');

		if (videoSelection.length > 0) {
			// self.log('There are video players. Attaching auto track.');
			var options = {};
			videoSelection.videoautotrack();
		}
		else {
			// self.log('No video players found');
		}

	}

}

//jQuery Plug-in for convenience
(function ( $ ) {

	$.fn.videoautotrack = function( options ) {
		return this.each(function() {
			var myVideoTrack = new VideoAutoTrack(options, this);
		});
	};

}( jQuery ));

$(document).ready(initVideoAutoTrack);

if (typeof module !== "undefined") {
	module.exports = VideoAutoTrack;
}
