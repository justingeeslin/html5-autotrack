describe('VideoAutoTrack', function() {


    beforeAll(function() {
      console.log('Testing VideoAutoTrack.')
      container = $('<div id="video-auto-track"></div>');
      $(document.body).append(container);

      // Borrowed from https://www.w3.org/2010/05/video/mediaevents.html
      videoHTML = '<video id="video" controls="" preload="none" mediagroup="myVideoGroup" poster="https://media.w3.org/2010/05/sintel/poster.png"><source id="mp4" src="https://media.w3.org/2010/05/sintel/trailer.mp4" type="video/mp4"><source id="webm" src="https://media.w3.org/2010/05/sintel/trailer.webm" type="video/webm"><source id="ogv" src="https://media.w3.org/2010/05/sintel/trailer.ogv" type="video/ogg"><p>Your user agent does not support the HTML5 Video element.</p></video>';

      container.append(videoHTML);

      s.Media.autoTrack = true;

    });

    afterEach(function() {

      //Remove the video element
      container.empty();
      //add it back
      console.log('Adding a new video after the test.')
      container.append(videoHTML);

      // Expect this to be the default on pages
      s.Media.autoTrack = true;
    });

    it('Should construct and add the class auto-tracked', function() {
      var sel = $('video:first')
      myVideoTrack = new VideoAutoTrack({}, sel);

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
      // sel[0].play();
      // sel[0].play();


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
        onplay: function() {
          window.setTimeout(function() {
            //Seek to the end
            sel[0].currentTime = sel[0].duration
          }, 2000)
        },
        oncomplete: function() {
          //If this callback runs, success!
          var complete = true
          expect(complete).toBe(true);
          done()
        }
      });

      //Press play
      sel[0].play();


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

    it('Should find a video to be removed when a DOM mutation removes the element', function() {
      var sel = $('video:first')
      myVideoAT = new VideoAutoTrack({}, sel);

      // DOM mutation
      console.log('Removing this video');
      sel.remove()

      expect(myVideoAT.isRemoved).toBe(true);
    })

    it('Should find a video to be abandoned once removed after pressing play before the video ends', function(done) {
      var sel = $('video:first')
      myVideoAT2 = new VideoAutoTrack({
        onplay: function() {
          console.log('Playing..')
          // Save off this because of the setTimeout.
          var self = this
          // Wait a little bit after pressing play
          setTimeout(function () {
            // DOM mutation
            console.log('Removing this video');
            sel.remove()
            console.log('This:')
            console.log(self)
            expect(self.isAbandoned).toBe(true);

            done()

          }, 2000);

        }
      }, sel);

      console.log('Pressing play.')
      sel[0].play();

    })

    // it('Should find a video to be removed when the window unloads', function() {
    //   var sel = $('video:first')
    //   myVideoAT3 = new VideoAutoTrack({}, sel);
    //
    //   // Simulate a window unload
    //   console.log('Unload the window');
    //   // Simulate
    //   $(window).trigger('beforeunload');
    //   // Actual unload
    //   // window.location = '';
    //
    //   expect(myVideoAT3.isRemoved).toBe(true);
    //
    //
    // })



});
