describe('VideoAutoTrack', function() {


    beforeAll(function() {
      console.log('Testing VideoAutoTrack.')
      container = $('<div id="video-auto-track"></div>');
      $(document.body).append(container);

      // Borrowed from https://www.w3.org/2010/05/video/mediaevents.html
      var videoHTML = '<video id="video" controls="" preload="none" mediagroup="myVideoGroup" poster="https://media.w3.org/2010/05/sintel/poster.png"><source id="mp4" src="https://media.w3.org/2010/05/sintel/trailer.mp4" type="video/mp4"><source id="webm" src="https://media.w3.org/2010/05/sintel/trailer.webm" type="video/webm"><source id="ogv" src="https://media.w3.org/2010/05/sintel/trailer.ogv" type="video/ogg"><p>Your user agent does not support the HTML5 Video element.</p></video>';

      container.append(videoHTML);

      s.Media.autotrack = true;

    });

    afterEach(function() {
      // Remove auto-track
      container.children().removeClass('auto-tracked')
      // Stop the video
      $('video')[0].pause()
      // Seek it to the beginning
      // $('video')[0].currentTime = 0
    });

    it('Should construct and add the class auto-tracked', function() {
      var sel = $('video')
      sel.videoautotrack();

      expect(sel.hasClass('auto-tracked')).toBe(true);
    });

    it('Should call the onstart callback', function(done) {
      var sel = $('video')
      var started = 0
      sel.videoautotrack({
        onstart: function() {
          //Should only run the first time a user presses play
          started += 1
          expect(started).toBe(1);
          done()
        }
      });

      //Press play
      sel[0].play();
      sel[0].play();
      sel[0].play();


    });

    it('Should call the onplay callback', function(done) {
      var sel = $('video')
      sel.videoautotrack({
        onplay: function() {
          //If this callback runs, success!
          var played = true
          expect(played).toBe(true);
          done()
        }
      });

      //Press play
      sel[0].play();


    });

    it('Should call the oncomplete callback', function(done) {
      var sel = $('video')
      sel.videoautotrack({
        oncomplete: function() {
          //If this callback runs, success!
          var complete = true
          expect(complete).toBe(true);
          done()
        }
      });

      sel.on('canplaythrough', function() {
        //Seek to the end
        sel[0].currentTime = sel[0].duration
      });


    });

    it('Should do nothing upon construction with autotrack is disabled', function() {
      s.Media.autoTrack = false;
      var sel = $('video')
      sel.videoautotrack();

      expect(sel.hasClass('auto-tracked')).toBe(false);
    });

    it('Should override the autotrack switch i.e. use autotrack anyway', function() {
      s.Media.autoTrack = false;
      var sel = $('video')
      sel.videoautotrack({
        autoTrackOverride: true
      });

      expect(sel.hasClass('auto-tracked')).toBe(true);
    });

});
