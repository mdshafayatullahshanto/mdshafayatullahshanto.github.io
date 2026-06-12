
/**
 * @file Main interactions and UI logic.
 * @requires jQuery
 */
/* global jQuery, $ */

/**
 * @param {JQueryStatic} $
 */
!(function ($) {
  "use strict";

  // Cache frequently used selectors
  /** @type {JQuery} */
  let $body = $('body');
  /** @type {JQuery} */
  let $header = $('#header');

  // Nav Menu
  $(document).on('click', '.nav-menu a, .mobile-nav a', function (e) {
    if (location.pathname.replace(/^\//, '') === this.pathname.replace(/^\//, '') && location.hostname === this.hostname) {
      var hash = this.hash;
      var target = $(hash);
      if (target.length) {
        e.preventDefault();

        if ($(this).parents('.nav-menu, .mobile-nav').length) {
          $('.nav-menu .active, .mobile-nav .active').removeClass('active');
          $(this).closest('li').addClass('active');
        }

        if (hash === '#header') {
          $header.removeClass('header-top');
          $("section").removeClass('section-show');
          return;
        }

        if (!$header.hasClass('header-top')) {
          $header.addClass('header-top');
          setTimeout(function () {
            $("section").removeClass('section-show');
            $(hash).addClass('section-show');
          }, 350);
        } else {
          $("section").removeClass('section-show');
          $(hash).addClass('section-show');
        }

        if ($body.hasClass('mobile-nav-active')) {
          $body.removeClass('mobile-nav-active');
          $('.mobile-nav-toggle i').toggleClass('icofont-navigation-menu icofont-close');
          $('.mobile-nav-overly').fadeOut();
        }
        return false;
      }
    }
  });

  // Activate/show sections on load with hash links
  if (window.location.hash) {
    var initial_nav = window.location.hash;
    if ($(initial_nav).length) {
      $header.addClass('header-top');
      $('.nav-menu .active, .mobile-nav .active').removeClass('active');
      $('.nav-menu, .mobile-nav').find('a[href="' + initial_nav + '"]').parent('li').addClass('active');
      setTimeout(function () {
        $("section").removeClass('section-show');
        $(initial_nav).addClass('section-show');
      }, 350);
    }
  }

  // Mobile Navigation
  /** @type {JQuery} */
  var $navMenu = $('.nav-menu');
  if ($navMenu.length) {
    /** @type {JQuery} */
    var $mobile_nav = $navMenu.clone().prop({
      class: 'mobile-nav d-lg-none'
    });
    $body.append($mobile_nav);
    $body.prepend('<button type="button" class="mobile-nav-toggle d-lg-none"><i class="icofont-navigation-menu"></i></button>');
    $body.append('<div class="mobile-nav-overly"></div>');

    $(document).on('click', '.mobile-nav-toggle', function (e) {
      e.preventDefault();
      $body.toggleClass('mobile-nav-active');
      $('.mobile-nav-toggle i').toggleClass('icofont-navigation-menu icofont-close');
      $('.mobile-nav-overly').toggle();
    });

    // Close mobile nav when clicking outside
    $(document).click(function (e) {
      var container = $(".mobile-nav, .mobile-nav-toggle");
      if (!container.is(e.target) && container.has(e.target).length === 0) {
        if ($body.hasClass('mobile-nav-active')) {
          $body.removeClass('mobile-nav-active');
          $('.mobile-nav-toggle i').toggleClass('icofont-navigation-menu icofont-close');
          $('.mobile-nav-overly').fadeOut();
        }
      }
    });

    // Close mobile nav when clicking on overlay
    $(document).on('click', '.mobile-nav-overly', function () {
      $body.removeClass('mobile-nav-active');
      $('.mobile-nav-toggle i').toggleClass('icofont-navigation-menu icofont-close');
      $('.mobile-nav-overly').fadeOut();
    });

    // Close mobile nav when clicking on menu item
    $(document).on('click', '.mobile-nav a', function () {
      if ($body.hasClass('mobile-nav-active')) {
        $body.removeClass('mobile-nav-active');
        $('.mobile-nav-toggle i').toggleClass('icofont-navigation-menu icofont-close');
        $('.mobile-nav-overly').fadeOut();
      }
    });

    // Add touch support for mobile devices
    var touchStartY = 0;
    var touchEndY = 0;

    $mobile_nav.on('touchstart', function (e) {
      touchStartY = e.originalEvent.touches[0].clientY;
    });

    $mobile_nav.on('touchend', function (e) {
      touchEndY = e.originalEvent.changedTouches[0].clientY;
      // Optional: Close nav on swipe up gesture
      if (touchStartY - touchEndY > 100) {
        $body.removeClass('mobile-nav-active');
        $('.mobile-nav-toggle i').toggleClass('icofont-navigation-menu icofont-close');
        $('.mobile-nav-overly').fadeOut();
      }
    });

  } else if ($('.mobile-nav, .mobile-nav-toggle').length) {
    $(".mobile-nav, .mobile-nav-toggle").hide();
  }

  // jQuery counterUp
  $('[data-toggle="counter-up"]').counterUp({
    delay: 10,
    time: 1000
  });

  // Skills section
  $('.skills-content').waypoint(function () {
    $('.progress .progress-bar').each(function () {
      $(this).css("width", $(this).attr("aria-valuenow") + '%');
    });
  }, {
    offset: '80%'
  });

  // Testimonials carousel (uses the Owl Carousel library)
  $(".testimonials-carousel").owlCarousel({
    autoplay: true,
    dots: true,
    loop: true,
    responsive: {
      0: {
        items: 1
      },
      768: {
        items: 2
      },
      900: {
        items: 3
      }
    }
  });

  // Porfolio isotope and filter
  $(window).on('load', function () {
    var portfolioIsotope = $('.portfolio-container').isotope({
      itemSelector: '.portfolio-item',
      layoutMode: 'fitRows'
    });

    $('#portfolio-flters li').on('click', function () {
      $("#portfolio-flters li").removeClass('filter-active');
      $(this).addClass('filter-active');

      portfolioIsotope.isotope({
        filter: $(this).data('filter')
      });
    });

    // Projects isotope and filter
    var $projectsContainer = $('.projects-container');
    var projectsIsotope = $projectsContainer.isotope({
      itemSelector: '.project-item',
      layoutMode: 'fitRows',
      transitionDuration: '0.6s'
    });

    // Cache filter lists
    var $primaryFilters = $('.projects-filter-primary li');
    var $secondaryFilters = $('.projects-filter-secondary li');

    // Primary filter click handler
    $primaryFilters.on('click', function () {
        $primaryFilters.removeClass('filter-active');
      $(this).addClass('filter-active');

      // Clear secondary filter active state
      $secondaryFilters.removeClass('filter-active');

      var filterValue = $(this).data('filter');
        projectsIsotope.isotope({
        filter: filterValue
      });
    });

    // Secondary filter click handler
    $secondaryFilters.on('click', function () {
        $secondaryFilters.removeClass('filter-active');
      $(this).addClass('filter-active');

      // Clear primary filter active state except "ALL"
      $primaryFilters.removeClass('filter-active');

      var filterValue = $(this).data('filter');
        projectsIsotope.isotope({
        filter: filterValue
      });
    });

  });

  // Initiate venobox (lightbox feature used in portofilo)
  $(document).ready(function () {
    $('.venobox').venobox();
  });

  // Photo Gallery Navigation
  $(document).ready(function () {
    var $galleryImage = $('#galleryImage');
    if ($galleryImage.length === 0) {
      return;
    }

    // Gallery Configuration - Easy to modify
    var galleryConfig = {
      images: [
        {
          src: 'assets/img/achievements/ASHRAE.jpg',
          alt: 'ASHRAE Achievement',
          title: 'ASHRAE Bangladesh Chapter'
        },
        {
          src: 'assets/img/achievements/IUBAT.JPG',
          alt: 'ASHRAE IUBAT Student Branch Achievement',
          title: 'Recognized by ASHRAE for contributions and active involvement'
        },
        {
          src: 'assets/img/achievements/MSUS.jpg',
          alt: 'MEP Project Achievement',
          title: 'MEP Project Award'
        }
      ],
      fadeSpeed: 200,
      autoPlay: false,
      autoPlayDelay: 5000
    };

    var currentIndex = 0;
    var $dots = $('.gallery-dot');
    var $prevBtn = $('.gallery-prev');
    var $nextBtn = $('.gallery-next');
    var isTransitioning = false;

    function updateGallery(index) {
      if (isTransitioning) return;

      currentIndex = (index + galleryConfig.images.length) % galleryConfig.images.length;
      isTransitioning = true;

      var currentImage = galleryConfig.images[currentIndex];

      $galleryImage.fadeOut(galleryConfig.fadeSpeed, function () {
        $(this)
          .attr('src', currentImage.src)
          .attr('alt', currentImage.alt)
          .attr('title', currentImage.title)
          .fadeIn(galleryConfig.fadeSpeed, function () {
            isTransitioning = false;
          });
      });

      $dots.removeClass('active');
      $dots.eq(currentIndex).addClass('active');
    }

    function preloadImages() {
      galleryConfig.images.forEach(function (imageObj) {
        var img = new Image();
        img.src = imageObj.src;
      });
    }

    // Initialize gallery
    function initGallery() {
      preloadImages();
      $dots.eq(currentIndex).addClass('active');

      // Set initial image attributes
      var initialImage = galleryConfig.images[currentIndex];
      $galleryImage
        .attr('src', initialImage.src)
        .attr('alt', initialImage.alt)
        .attr('title', initialImage.title);
    }

    // Navigation button events
    $prevBtn.on('click', function (e) {
      e.preventDefault();
      updateGallery(currentIndex - 1);
    });

    $nextBtn.on('click', function (e) {
      e.preventDefault();
      updateGallery(currentIndex + 1);
    });

    // Dot navigation
    $dots.on('click', function (e) {
      e.preventDefault();
      var targetIndex = parseInt($(this).data('index'));
      if (targetIndex !== currentIndex) {
        updateGallery(targetIndex);
      }
    });

    // Keyboard navigation
    $(document).on('keydown', function (e) {
      if ($galleryImage.is(':visible')) {
        switch (e.keyCode) {
          case 37: // Left arrow
            e.preventDefault();
            updateGallery(currentIndex - 1);
            break;
          case 39: // Right arrow
            e.preventDefault();
            updateGallery(currentIndex + 1);
            break;
          case 27: // Escape key (optional: could be used to close gallery if needed)
            e.preventDefault();
            break;
        }
      }
    });

    // Touch/swipe support for mobile
    var touchStartX = 0;
    var touchEndX = 0;

    $galleryImage.on('touchstart', function (e) {
      touchStartX = e.originalEvent.touches[0].clientX;
    });

    $galleryImage.on('touchend', function (e) {
      touchEndX = e.originalEvent.changedTouches[0].clientX;
      var diff = touchStartX - touchEndX;

      if (Math.abs(diff) > 50) { // Minimum swipe distance
        if (diff > 0) {
          updateGallery(currentIndex + 1); // Swipe left - next image
        } else {
          updateGallery(currentIndex - 1); // Swipe right - previous image
        }
      }
    });

    // Auto-play functionality
    var autoPlayInterval;

    function startAutoPlay() {
      if (galleryConfig.autoPlay) {
        autoPlayInterval = setInterval(function () {
          updateGallery(currentIndex + 1);
        }, galleryConfig.autoPlayDelay);
      }
    }

    function stopAutoPlay() {
      clearInterval(autoPlayInterval);
    }


    // Initialize the gallery
    initGallery();
    startAutoPlay();
  });



})(jQuery);