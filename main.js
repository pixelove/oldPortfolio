var Pixelove = {};

Pixelove.inTransition = false;
Pixelove.mwheelThrottle = 500;
Pixelove.mwheelLast = 0;

/*
 * Selectors
 */
Pixelove.selectors = {
  viewer: function () {
    return $('#viewer');
  },
  viewerInnerDiv: function () {
    return $('#viewer .wrapper');
  },
  slide: function () {
    return $('.slide');
  },
  slideCover: function () {
    return $('.slide .cover');
  },
  slideDetails: function (slideName) {
    if (slideName) {
      return $('.slideDetails[rel=' + slideName + ']');
    } else {
      return $('.slideDetails');
    }
  }
}

/*
 * Slides
 */
Pixelove.slide = {
  onClick: function (e) {
    // var slideName = $(e.currentTarget).parents('.slide').attr('rel') || null;
    console.log($(e.target).parents('.slide').attr('rel'));
    // console.log('Slide clicked:', slideName);
    // if (slideName) {
    //   Pixelove.slide.showSlide(slideName);
    // }
  },
  showSlide: function (slideName) {
    Pixelove.selectors.slideDetails(slideName).slideDown();
    $('.menu .normal').animate({marginTop: -30});
    $('.menu .alt').animate({marginTop: 0});


    // unbind
    Pixelove.unbindNavKeyboard();
    Pixelove.unbindNavMouseWheel();
    Pixelove.unbindNavTouch();
    Pixelove.bindEscKey();

  },
  hideSlide: function (e) {
    Pixelove.selectors.slideDetails().slideUp();
    $('.menu .normal').animate({marginTop: 0});
    $('.menu .alt').animate({marginTop: 0});

    // rebind
    Pixelove.bindNavKeyboard();
    Pixelove.bindNavMouseWheel();
    Pixelove.bindNavTouch();
  }
}

/*
 * Navigation
 */
Pixelove.nav = {
  jumpTo: function (slideIndex) {
    // $('body').off('mousewheel');
    if (Pixelove.inTransition) {
      return;
    }
    Pixelove.inTransition = true;
    var slides = Pixelove.selectors.slide();
    var newOffset = slides[slideIndex].offsetLeft;

    // arbitrary offset
    newOffset = (newOffset - 100 > 0 ? newOffset - 100 : 0);

    // console.log('jumpTo', slideIndex, newOffset);
    Pixelove.selectors.viewer().clearQueue().animate({scrollLeft: newOffset}, 'medium');
    Pixelove.inTransition = false;
  },
  current: function () {
    var bodyOffset = Pixelove.selectors.viewer().scrollLeft();
    var slides = Pixelove.selectors.slide();

    var currentFound = false;

    for (i = 0; i < slides.length; i++) {
      if (currentFound === false) {
        if (slides[i].offsetLeft >= bodyOffset) {
          currentFound = i;
        }
      }
    }
    return (currentFound !== false ? currentFound : (slides.length - 1));
  },

  next: function (e) {
    var slides = Pixelove.selectors.slide();
    var current = Pixelove.nav.current();

    if (e) {
      var slide = ($(e.target).hasClass('.slide') ? $(e.target) : $(e.target).parent('.slide'));
      current = $(slides).index(slide);
    }

    var viewerOffset = Pixelove.selectors.viewer().scrollLeft();
    var viewportWidth = $(window).width();
    var innerWidth = Pixelove.selectors.viewerInnerDiv().width();
    if (viewportWidth + viewerOffset === innerWidth) {
      current = slides.length - 1;
    }

    var dest = current;

    if (current === (slides.length - 1)) {
      dest = 0;
    } else {
      dest = current + 1;
    }

    return Pixelove.nav.jumpTo(dest);
  },

  prev: function (e) {
    var slides = Pixelove.selectors.slide();
    var current = Pixelove.nav.current();
    if (e) {
      var slide = ($(e.target).hasClass('.slide') ? $(e.target) : $(e.target).parent('.slide'));
      current = $(slides).index(slide);
    }
    var dest = current;

    if (current === 0) {
      dest = slides.length - 1;
    } else {
      dest = current - 1;
    }

    return Pixelove.nav.jumpTo(dest);
  }
}


/*
 * EVENT BINDINGS
 */
Pixelove.bindEscKey = function () {
  $(document).keydown(function(e) {
    if (e.which === 27) {
      e.preventDefault();
      Pixelove.slide.hideSlide();
    };

    if (e.which === 37 || e.which === 39) {
      return e.preventDefault();
    }
  });
};

Pixelove.bindNavKeyboard = function () {
  // 37 = left, 39 = right
  // 38 = up, 40 = down
  $(document).keydown(function(e) {
    switch(e.which) {
      case 37:
        e.preventDefault();
        Pixelove.nav.prev();
      break;

      case 39:
        e.preventDefault();
        Pixelove.nav.next();
      break;

      default:
        return;
    };
  });
};

Pixelove.bindNavMouseWheel = function () {
  // return;
  $('body').on('mousewheel', function(e) {
    // throttling multiple runs to prevent blocking
    if (Pixelove.mwheelLast + Pixelove.mwheelThrottle > Date.now()) {
      return;
    }
    Pixelove.mwheelLast = Date.now();

    if (e.deltaX > 0 || e.deltaY < 0) {
      e.preventDefault();
      Pixelove.nav.next();
    }

    if (e.deltaX < 0 || e.deltaY > 0) {
      e.preventDefault();
      Pixelove.nav.prev();
    }
  });
};

Pixelove.bindNavTouch = function () {
  $('.slide, .slide .cover').on('swiperight', Pixelove.nav.prev);
  $('.slide, .slide .cover').on('swipeleft', Pixelove.nav.next);
}

Pixelove.unbindNavKeyboard = function () {
  $(document).off('keydown');
};

Pixelove.unbindNavMouseWheel = function () {
  $('body').off('mousewheel');
};

Pixelove.unbindNavTouch = function () {
  $('.slide, .slide .cover').off('swiperight swipeleft');
};



Pixelove.bindView = function () {
  // var eventType = ($.mobile.support.touch ? 'tap' : 'click');
  var eventType = 'click';

  Pixelove.selectors.slideCover().on(eventType, function (e) {
    var slideName = $(e.target).parents('.slide').attr('rel');
    if (slideName) {
      Pixelove.slide.showSlide(slideName);
    }
  });

  $('.menu a').on(eventType, function (e) {
    var slideName = $(e.target).attr('rel');
    console.log(slideName);
    if (slideName === 'back') {
      return Pixelove.slide.hideSlide();
    }
    if (slideName) {
      return Pixelove.slide.showSlide(slideName);
    }
  });

  // $('.intro').on('tap', function (e) {
  //   alert('tap event');
  // });
  // $('.intro').on('taphold', function (e) {
  //   alert('taphold event');
  // });
}

/*
 * Update viewer
 */
Pixelove.updateViewerWidth = function () {
  var slides = Pixelove.selectors.slide();
  var runningTotal = 0;

  for (i = 0; i < slides.length; i++) {
    runningTotal += $(slides[i]).outerWidth();
  }
  // adding buffer for whitespace (need to float items instead)
  runningTotal += 100;
  Pixelove.selectors.viewerInnerDiv().css('width', runningTotal);
};

Pixelove.updateViewerHeight = function () {
  Pixelove.selectors.viewer().css('height', 100);
  var viewportHeight = $(window).height();
  var headerHeight = $('.topRow').parents('.container').height();
  var newHeight = viewportHeight - headerHeight;

  Pixelove.selectors.viewer().css('height', newHeight);
};


/*
 * Init
 */
Pixelove.init = function () {
  console.log('Page initialised');

  Pixelove.bindNavKeyboard();
  Pixelove.bindNavMouseWheel();
  Pixelove.bindNavTouch();
  Pixelove.bindView();
};


/*
 * Execution events
 */
$(document).ready(function () {
  Pixelove.init();
});


$(window).load(function() {
  Pixelove.updateViewerWidth();
  Pixelove.updateViewerHeight();

  $(window).resize(function(e) {
    Pixelove.updateViewerHeight();
  });
})
