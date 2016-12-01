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
		autoTrackOverride: false
	};

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
	this.target = typeof this.target !== "undefined" ? this.target : contentTarget;

	if (!s.Media.autoTrack) {
		var msg = 'Using Video Auto Track when Media Auto track is disabled.'

		if (!self.autoTrackOverride) {
			console.error(msg);
			return;
		}
		else {
			console.warn(msg);
		}
	}

	console.log('This is video el')
	console.log(this.target)

	if (this.classToAdd) {
		console.log('Adding a class to the tracked video.')
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
		console.log('Media Playing from ' + self.target[0].currentTime);
		self.onplay()
		s.Media.play(videoMeta.name, self.target[0].currentTime, videoMeta.segmentNum, videoMeta.segment, videoMeta.segmentLength);

		//If not started
		if (!self.isStarted) {
			self.isStarted = true
			// start it
			self.onstart();

		}
	})

	this.target.on('pause', function() {
		console.log('Media Paused at ' + self.target[0].currentTime);
		s.Media.stop(videoMeta.name, self.target[0].currentTime);
	})

	this.target.on('ended', function() {
		console.log('Media Ended at ' + self.target[0].currentTime);
		self.isEnded = true;
		self.oncomplete()
		s.Media.close(videoMeta.name);

	})

	// Things to do on removal of the video, either by DOM manipulation or window unloading.
	var onVideoRemoval = function() {
		console.log('Video removed.');
		self.isRemoved = true;

		if (self.isStarted && !self.isEnded) {
			self.isAbandoned = true;
			console.log('Video abandoned. ie Started but never ended.')
		}
	}
	this.target.parent().on('DOMNodeRemoved', onVideoRemoval);
	$(window).on('beforeunload', onVideoRemoval);

	this.autotracked = true;

	return this;
}

var initVideoAutoTrack = function() {
	console.log('Init Video Auto Track')
	if (s.Media.autoTrack) {
		console.log('Media AutoTrack is enabled. Attaching to HTML5 video players if there are any.')

		var videoSelection = $('video');

		if (videoSelection.length > 0) {
			console.log('There are video players. Attaching auto track.');
			var options = {};
			videoSelection.videoautotrack();
		}
		else {
			console.log('No video players found');
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
