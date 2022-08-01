const $gridToggleBtn = document.querySelector('[data-grid-toggle]');
const $gridOverlay = document.querySelector('[data-grid-overlay]');
$gridToggleBtn.addEventListener('click', toggleGrid);
function toggleGrid() {
  $gridOverlay.classList.toggle('grid--off');
  $gridToggleBtn.classList.toggle('grid--off');
}

// Start Rellax
const rellax = new Rellax('.rellax', {
  // callback: function(positions) {}
});

let _isMenuCliked = false;

// Close menu after clicking link
const $menuLinks = document.querySelectorAll('[data-mobile-menu-link]');
const events = ['click', 'touchend'];
$menuLinks.forEach(el => {
  events.forEach(event => {
    el.addEventListener(event, () => {
      _isMenuCliked = true;

      setTimeout(() => {
        document.documentElement.classList.remove('menu--active');
        _isMenuCliked = false;
      }, 250);
    });
  });
});

const $mobileMenuToggleBtns = document.querySelectorAll('[data-mobile-menu-button]');
$mobileMenuToggleBtns.forEach(el => {
  el.addEventListener('click', event => {
    toggleMobileMenu(event);
  });
});

// -- News Carousel -- //
// import Flickity from 'flickity';
// import imagesLoaded from 'imagesloaded';

class NewsCarousel {
  constructor(el) {
    const news = document.querySelectorAll('.news');

    imagesLoaded(news, () => {
      this.init(el);
    });

    this.itemIndex = 0;
  }

  init(el) {
    el.classList.add('revealed');

    this.newsItem = '.news__item';

    this.counter(el);

    this.carousel = new Flickity(el, {
      contain: true,
      pageDots: false,
      cellAlign: 'left',
      cellSelector: this.newsItem,
      draggable: false,
      wrapAround: true,
      on: {
        change: index => {
          this.$active.innerHTML = `0${index + 1}`;
        } } });



    const btnPrev = el.querySelector('.news-carousel__btn-prev');
    const btnNext = el.querySelector('.news-carousel__btn-next');

    btnPrev.addEventListener('click', () => {
      let prevIndex;

      if (this.carousel.selectedIndex <= 0) {
        prevIndex = this.carousel.cells.length - 1;
      } else {
        prevIndex = this.carousel.selectedIndex - 1;
      }

      el.querySelectorAll('.news__item')[prevIndex].querySelector('figure').classList.add('prev');
      el.querySelectorAll('.news__item')[prevIndex].querySelector('figure').classList.add('hidden');

      this.carousel.previous();

      setTimeout(() => {
        const activeIndex = this.carousel.selectedIndex;

        el.querySelectorAll('.news__item').forEach((item, i) => {
          let figure = item.querySelector('figure');

          figure.classList.remove('hidden');
        });
      }, 250);
    });

    btnNext.addEventListener('click', () => {
      const activeIndex = this.carousel.selectedIndex;

      el.querySelectorAll('.news__item').forEach((item, i) => {
        let figure = item.querySelector('figure');

        figure.classList.remove('prev');

        if (i === activeIndex) {
          figure.classList.add('hidden');
        } else {
          figure.classList.remove('hidden');
        }
      });

      setTimeout(() => {
        this.carousel.next();
      }, 250);
    });
  }

  counter(el) {
    this.$active = el.querySelector('[data-news-carousel-active]');
    this.$total = el.querySelector('[data-news-carousel-total]');
    this.totalLength = el.querySelectorAll(this.newsItem).length;
    this.$total.innerHTML = `0${this.totalLength}`;
  }}


// export default NewsCarousel;

// Initialize the News Carousels
const newsCarouselElements = document.querySelectorAll('.news-carousel');

newsCarouselElements.forEach((el, i) => {
  new NewsCarousel(el);
});

// -- Image Carousel -- //
class ImageCarousel {
  constructor(el) {
    imagesLoaded(el, {
      background: '.image-carousel__image' },
    () => {
      this.init(el);
      scrollies.updateSettings();
    });
  }

  init(el) {
    el.classList.add('revealed');

    var $imgs = el.querySelector('img');

    const thisClass = this;
    this.carousel = new Flickity(el, {
      wrapAround: true,
      on: {
        scroll: function () {
          // const $imgs = this.slider.querySelectorAll('.image-carousel__image')
          // // console.log('scroll() $imgs', $imgs)
          // console.log('this:', this)
          // // console.log(x)
          // this.slides.forEach(( slide, i ) => {
          //   const img = $imgs[i];
          //   const x = ( slide.target + this.x ) * -1/3;
          //   console.log('slide:', slide)
          //   img.style.transform = 'translateX( ' + x  + 'px)';
          // })
        } } });


  }}


// Initiallie the Image Carousels
const imageCarouselElements = document.querySelectorAll('.image-carousel');

imageCarouselElements.forEach((el, i) => {
  new ImageCarousel(el);
});

// -- Native Smooth Scrolling -- //
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const timeout = _isMenuCliked ? 250 : 0;
    const hash = anchor.getAttribute('href');
    const elTop = document.querySelector(hash).getBoundingClientRect().top + window.pageYOffset;

    setTimeout(() => {
      scrollTo(document.documentElement, elTop - 100, 600);
      enableScroll();
    }, timeout);
  });
});

// -- Scroll Backgrounds -- //
class ScrollEffects {
  constructor(el) {
    this.el = el;
    this.scrollClass = 'in-view';
    this.scrollTops = [];
    this.$scrollEls = document.querySelectorAll(this.el);
    this.scrollElsCount = this.$scrollEls.length;
    this.$scrollShowNavEl = document.querySelector('[data-scrolling-up-show-nav]');
    this.$scrollNav = document.querySelector('[data-header-scroll]');

    if (this.scrollElsCount > 0) {
      this.buildPageBackgrounds();
      this.updateSettings();
      this.attachEvents();
    }
  }

  updateSettings() {
    this.winHeight = window.innerHeight;
    this.scrollOffset = this.winHeight * 0.65;
    this.pageBgScrollOffset = this.winHeight * 0.65;
    this.$scrollEls = document.querySelectorAll(this.el);
  }

  attachEvents() {
    this.lastScrollTop = 0;

    // this.setScrollTops()
    // this.onResize()
    this.parallaxUpdateSettings('[data-parallax]');

    this.onScroll();

    window.addEventListener('scroll', () => {
      // this.parallax()
      this.onScroll();
    });

    // Only run stuff after resize is done
    window.addEventListener('resize', () => {
      clearTimeout(this.resizeTimer);

      // Only do stuff when resizing is done
      this.resizeTimer = setTimeout(() => {
        // this.onResize()
        // console.log('resizing is done')
      }, 250);
    });
  }

  addClassToInViewItem() {
    this.$scrollEls.forEach((el, i) => {
      if (this.lastScrollY + this.scrollOffset >= this.getOffsetTop(el)) {
        el.classList.add('in-view');
      } else {
        el.classList.remove('in-view');
      }
    });
  }

  buildPageBackgrounds() {
    this.$pageBackgrounds = document.querySelector('[data-page-bgs]');

    this.$scrollBackgroundEls = document.querySelectorAll('[data-scroll-item-bg]');

    this.$scrollBackgroundEls.forEach((el, i) => {
      const $div = document.createElement('div');

      $div.setAttribute('data-page-bg', i);
      $div.classList.add('bg__item');
      $div.style.background = el.dataset.scrollItemBg;

      // if (el.getAttribute('data-scroll-item-bg-slide-up') !== undefined) {
      //   $div.setAttribute('data-page-bg-slide-up', i)
      //   $div.classList.add('bg__item--slide-up')
      // }

      this.$pageBackgrounds.appendChild($div);
    });

    this.$pageBackgroundEls = this.$pageBackgrounds.querySelectorAll('[data-page-bg]');
  }

  revealNavOnScroll() {
    if (this.scrollDirection === 'up' && this.lastScrollY >= this.getOffsetTop(this.$scrollShowNavEl)) {
      this.$scrollNav.classList.add('header-scroll--reveal');
    } else {
      this.$scrollNav.classList.remove('header-scroll--reveal');
    }
  }

  setScrollDirection() {
    if (this.lastScrollY > this.lastScrollTop) {
      this.scrollDirection = 'down';
    } else {
      this.scrollDirection = 'up';
    }

    this.lastScrollTop = this.lastScrollY;
  }

  parallaxUpdateSettings(els) {
    this.parallaxEls = document.querySelectorAll(els);
    this.parallaxSettings = [];

    this.parallaxEls.forEach((el, i) => {
      this.parallaxSettings[i] = {
        max: parseFloat(el.dataset.parallaxMax) || 30,
        power: parseFloat(el.dataset.parallax) || 4 };

    });

    // console.log('parallaxSettings[]:', this.parallaxSettings)
  }

  parallax(els) {
    this.parallaxEls.forEach((el, i) => {
      const elStyles = el.style;
      const elTop = Math.min(this.parallaxSettings[i].max, this.lastScrollY / this.parallaxSettings[i].power);

      elStyles.transform = `translate3d(0, ${elTop}px, 0)`;
      elStyles.transitionDuration = '0ms';
      elStyles.transitionDelay = '0ms';
    });
  }

  setScrollTops() {
    this.$scrollEls.forEach((el, i) => {
      this.scrollTops[i] = this.getOffsetTop(el);

      el.dataset.scrollItem = i;
      el.dataset.scrollOffsetTop = this.scrollTops[i];
    });
  }

  updatePageBackgrounds() {
    this.$scrollBackgroundEls.forEach((el, i) => {
      if (this.lastScrollY + this.pageBgScrollOffset >= this.getOffsetTop(el)) {
        this.$pageBackgroundEls[i].classList.add('bg__item--active');
      } else {
        this.$pageBackgroundEls[i].classList.remove('bg__item--active');
      }
    });
  }

  // get offsetTop of element
  getOffsetTop(el) {
    return el.getBoundingClientRect().top + this.lastScrollY;
  }

  onScroll() {
    this.lastScrollY = window.pageYOffset;
    this.parallax();
    this.setScrollDirection();
    this.requestTick();


  }

  animateOnScroll() {
    this.revealNavOnScroll();
    this.addClassToInViewItem();
    this.updatePageBackgrounds();

    // allow further rAFs to be called
    this.isTicking = false;
  }

  // Reset stuff after resizing is done
  onResize() {
    this.updateSettings();
    // this.setScrollTops()
    this.requestTick();
  }

  // Calls rAF if it's not already been done already
  requestTick() {
    if (!this.isTicking) {
      requestAnimationFrame(() => {
        // this.setScrollTops()
        this.animateOnScroll();
      });

      this.isTicking = true;
    }
  }

  // Play/Pause videos when they are in/out of view
  toggleVideos(toggleState) {
    const $video = this.$activeItem.querySelector('[data-video-play-in-view]');

    if (!$video) return;

    if (toggleState === 'play' && $video.paused) {
      $video.play();
    } else if (toggleState === 'pause' && !$video.paused) {
      $video.pause();
    }
  }}




const scrollies = new ScrollEffects('[data-scroll-item], .flickity-page-dots');

class NewsLetterSignUp {
  constructor(selectorQuery) {
    this.section = document.querySelector(selectorQuery);
    this.form = document.querySelector('#newsletter__form');
    this.email = document.querySelector('#newsletter__email');
    this.submit = document.querySelector('#newsletter__submit');
    this.success = document.querySelector('.newsletter__messages--success');
    this.error = document.querySelector('.newsletter__messages--error');

    this.init();
  }

  init() {
    this.form.addEventListener("keydown", this.checkFormSubmit.bind(this));

    const events = ['input', 'paste', 'scroll'];

    events.forEach(event => {
      this.email.addEventListener(event, () => {
        this.validateEmail();
        this.checkFocus();
      });
    });
  }

  checkFormSubmit(e) {
    if (e && e.keyCode == 13) {
      this.submitForm(e);
    }
  }

  checkFocus() {
    const emailId = this.email.getAttribute('id');
    const label = document.querySelector(`label[for="${emailId}"]`);
    this.email.value.length > 0 ? label.classList.add('focus') : label.classList.remove('focus');
  }

  isValidEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }

  validateEmail() {
    this.error.classList.remove('show');

    let error = false;

    if (this.email.value.length > 0) {
      if (!this.isValidEmail(this.email.value)) {
        error = true;
        this.error.classList.add('show');
        this.error.innerHTML = 'Please input a valid email address.';
      } else {
        this.error.classList.remove('show');
        error = false;
      }
    } else if (this.email.value === '') {
      error = true;
      this.error.classList.add('show');
      this.error.innerHTML = 'Please input an email address.';
    } else {
      this.error.classList.remove('show');
      error = false;
    }

    return error;
  }

  successMessage() {
    this.error.innerHTML = '';
    this.section.classList.add('success');
  }

  submitForm(e) {
    e.preventDefault();

    let checkEmail = this.validateEmail();

    if (!checkEmail) {
      this.successMessage();
    }
  }}


const newsletter = new NewsLetterSignUp(".newsletter");

// -- Global functions (These should get refactored later) -- //

function scrollTo(element, to, duration) {
  if (duration <= 0) return;
  var difference = to - element.scrollTop;
  var perTick = difference / duration * 10;

  setTimeout(function () {
    element.scrollTop = element.scrollTop + perTick;
    if (element.scrollTop === to) return;
    scrollTo(element, to, duration - 10);
  }, 10);
}

// left: 37, up: 38, right: 39, down: 40,
// spacebar: 32, pageup: 33, pagedown: 34, end: 35, home: 36
const scollKeys = { 37: 1, 38: 1, 39: 1, 40: 1 };

function scrollPreventDefault(e) {
  e = e || window.event;
  if (e.preventDefault)
  e.preventDefault();
  e.returnValue = false;
}

function preventDefaultForScrollKeys(e) {
  if (scollKeys[e.keyCode]) {
    scrollPreventDefault(e);
    return false;
  }
}

function disableScroll() {
  if (window.addEventListener) // older FF
    window.addEventListener('DOMMouseScroll', scrollPreventDefault, false);
  window.onwheel = scrollPreventDefault; // modern standard
  window.onmousewheel = document.onmousewheel = scrollPreventDefault; // older browsers, IE
  window.ontouchmove = scrollPreventDefault; // mobile
  document.onkeydown = preventDefaultForScrollKeys;
}

function enableScroll() {
  if (window.removeEventListener)
  window.removeEventListener('DOMMouseScroll', scrollPreventDefault, false);
  window.onmousewheel = document.onmousewheel = null;
  window.onwheel = null;
  window.ontouchmove = null;
  document.onkeydown = null;
}

function toggleMobileMenu(event) {
  const buttonType = event.target.closest('[data-mobile-menu-button]').dataset.mobileMenuButton; // we have one button in header and one in scroll header
  const $page = document.documentElement;

  // $page.dataset.menuButtonType = buttonType

  if ($page.classList.contains('menu--active')) {
    $page.dataset.menuButtonType = '';
    console.log('menu--active');
    enableScroll();
  } else {
    if (buttonType === 'top') {
      disableScroll();

      $page.classList.add('menu--active--top');
    }

    $page.dataset.menuButtonType = buttonType;
  }

  $page.classList.toggle('menu--active');
}



/**
* Start Patrick Stuff
**/

const btnScroll = document.querySelector('.btn-scroll');
const btnTop = document.querySelector('.btn-top');
const charsScroll = new SplitText('.btn-scroll', { type: 'chars' }).chars;
const charsTop = new SplitText('.btn-top', { type: 'chars' }).chars;

let scrollBtnShown = false;

TweenMax.set(charsScroll, { x: 5, y: 10, opacity: 0 });
TweenMax.set(charsTop, { x: 5, y: 10, opacity: 0 });

setTimeout(() => {
  showBtnScroll();
}, 1500);

function showBtnScroll() {
  if (!scrollBtnShown) {
    TweenMax.staggerTo(charsScroll, .5, { x: 0, y: 0, opacity: 1, ease: Back.easeOut.config(1.7), delay: 0.5 }, 0.1);
    TweenMax.staggerTo(charsTop, .5, { x: 5, y: -10, opacity: 0, ease: Back.easeOut.config(1.7) }, 0.1);
    btnScroll.classList.remove('disabled');
    btnTop.classList.add('disabled');
    scrollBtnShown = true;
  }
}

function hideBtnScroll() {
  if (scrollBtnShown) {
    TweenMax.staggerTo(charsScroll, .5, { x: 5, y: -10, opacity: 0, ease: Back.easeOut.config(1.7) }, 0.1);
    TweenMax.staggerTo(charsTop, .5, { x: 0, y: 0, opacity: 1, ease: Back.easeOut.config(1.7), delay: 0.5 }, 0.1);
    btnScroll.classList.add('disabled');
    btnTop.classList.remove('disabled');
    scrollBtnShown = false;
  }
}

window.addEventListener('scroll', () => {
  if (window.pageYOffset > 100) {
    hideBtnScroll();
  } else {
    showBtnScroll();
  }
});