/******

Sections
--------
1. Basic
2. Navigation
3. Hero
4. Portfolio
5. Testimonials
6. Processes & On-Scroll Animations
7. Contact

******/





/* 1. Basic */

$('.img-as-bg').each(function(index, el) {
	var $img = $(el);

	$img.parent().css('background-image', 'url("' + $img.attr('src') + '")');
	$img.remove();
});





/* 2. Navigation */

var $nav = $('nav'),
	$menu = $('nav ul.menu'),
	$menuItems = $menu.find('li'),
	$openMenu = $('.open-menu'),
	openMenuLock = false;

$menu.find('li').each(function(index, el) {
	$(this).css('transition-delay', index*0.05+'s');
});

$menuItems.find('a').on('click', function(e){
	var sectionId = $(this).attr('href');
	if (sectionId.indexOf('#') !== 0) return;
	e.preventDefault();
	var	$section = $(sectionId);
	$('html, body').animate({
		scrollTop: $section.offset().top
	}, 300);
});

function getCurrentSection(){
	var currentSection = null;
	$('section').each(function(index, el) {
		var $this = $(this),
			rangeTop = $this.offset().top - $win.height() / 2,
			rangeBottom = rangeTop + $this.outerHeight();

		if (rangeTop<$win.scrollTop() && $win.scrollTop()<rangeBottom){
			currentSection = el;
			return false;
		};
	});
	return currentSection;
}

$openMenu.on('click', function(){
	if (openMenuLock) return;
	openMenuLock = true;
	if ($nav.hasClass('opened')){
		$menu.removeClass('show-menu-items');
		setTimeout(function(){
			$nav.removeClass('opened');
			openMenuLock = false;
			$menuItems.find('a').removeClass('current');
		}, 300);
	} else{
		var currentSectionId = $(getCurrentSection()).attr('id');
		$menuItems.each(function(index, el) {
			var $this = $(this),
				$a = $this.find('a'),
				href = $a.attr('href');

			if (href === '#' + currentSectionId){
				$a.addClass('current');
			}
		});
		$nav.addClass('opened');
		setTimeout(function(){
			$menu.addClass('show-menu-items');
			openMenuLock = false;
		}, 300);
	}
});

$menu.find('a').on('click', function(e){
	$openMenu.click();
});

$nav.on('click', function(e){
	var tagName = $(e.target).parent().get(0).tagName;
	if (tagName !== 'LI' && tagName !== 'NAV'){
		$openMenu.click();
	}
});





/* 3. Hero */

var $titles = $('.titles'),
	$heroSlides = $('.hero-slides');

$titles.textillate({
	selector: '.texts',
	loop: $('.titles li').length > 1,
	minDisplayTime: 5000,
	initialDelay: 1000,
	autoStart: true,
	inEffects: [],
	outEffects: [],
	in: {
		effect: 'fadeInUp',
		delayScale: 1.5,
		delay: 50,
		sync: true,
		reverse: false,
		callback: function () {}
	},
	out: {
		effect: 'fadeOutUp',
		delayScale: 1.5,
		delay: 50,
		sync: true,
		shuffle: false,
		reverse: false,
		callback: function () {}
	},
	callback: function () {},
	type: 'word'
});

$titles.on('outAnimationBegin.tlt', function(e){
	$heroSlides.trigger('next.owl.carousel');
});

$heroSlides.owlCarousel({
	loop:true,
	margin:0,
	nav:false,
	items:1,
	dots: false,
	smartSpeed: 1800,
	mouseDrag: false,
	touchDrag: false,
});

$titles.on('start.tlt', function () {
	$('.down-arrow').addClass('play');
});

$('.scroll-down-indicator').on('click', function(e){
	$('html, body').animate({
		'scrollTop': $win.height()
	}, 800);
});





/* 4. Portfolio */

var $grid = $('.grid');
$grid.imagesLoaded( function() {
	$grid.isotope({
		itemSelector: '.grid-item',
		layoutMode: 'masonry'
	});
});

var $portfolioCats = $('.portfolio-cats a');
$portfolioCats.on('click', function(e){
	e.preventDefault();
	var cat = $(this).data('cat');
	if (cat !== '*') {
		cat = '.' + cat;
	}
	$grid.isotope({
		filter: cat
	});
});

var $portfolioItems = $('#portfolio .grid-item'),
	$portfolioModal = $('.portfolio-modal'),
	$portfolioModalNavPrev = $('.portfolio-modal .modal-nav-prev'),
	$portfolioModalNavNext = $('.portfolio-modal .modal-nav-next'),
	$portfolioModalNavClose = $('.portfolio-modal .modal-nav-close'),
	$portfolioOverlay = $('.portfolio-overlay'),
	$portfolioOpenModal = $('.portfolio-open-modal');

$portfolioModalNavPrev.on('click',function(e){
	e.preventDefault();
	$portfolioItems.filter('.current').prev().trigger('click');
});

$portfolioModalNavNext.on('click',function(e){
	e.preventDefault();
	$portfolioItems.filter('.current').next().trigger('click');
});

$portfolioModalNavClose.on('click',function(e){
	e.preventDefault();
	$portfolioOverlay.trigger('click');
});

$portfolioOpenModal.on('click', function(e){
	e.preventDefault();
	$(this).parents('.grid-item').trigger('click');
});

function openPortfolioModal(){
	setTimeout(function(){
		$portfolioModal.addClass('opened');
		$portfolioOverlay.addClass('loaded');
	}, 300);
}

$portfolioItems.on('click', function(e){
	if (e.target.tagName.toLowerCase() !== 'img' && !$(e.target).hasClass('grid-item')) return;
	var $this = $(this),
		$info = $this.find('.portfolio-info'),
		$left = $portfolioModal.find('.left'),
		$right = $portfolioModal.find('.right'),
		$imageList = $this.find('ul.image-list'),
		$video = $this.find('ul.video');

	$this.addClass('current').siblings().removeClass('current');

	// modal navigation
	$portfolioModalNavPrev.parent().toggleClass('enabled', $this.prev().length > 0);
	$portfolioModalNavNext.parent().toggleClass('enabled', $this.next().length > 0);

	// load info into modal
	$left.empty().append( $info.clone() );
	$right.empty();

	// create carousel for images
	if ($imageList.length > 0){
		var $carousel = $('<div />').addClass('owl-carousel owl-theme');
		$imageList.find('img').each(function(index, el) {
			var $img = $(el).clone();

			$img.attr('src', $img.data('src'));
			if ($img.hasClass('img-vertical')){
				$img.css('max-height', $win.innerHeight()-240);
			}
			$('<div />').addClass('item').append($img).appendTo($carousel);
		});
		$right.append($carousel);

		$carousel.imagesLoaded(function() {
			$carousel.owlCarousel({
				loop:true,
				margin:0,
				nav:false,
				items:1,
				autoHeight:true,
				dots: true,
			});
			openPortfolioModal();
		});
	}

	// load video into modal
	if ($video.length > 0){
		var $iframe = $video.find('iframe'),
			src = $iframe.data('src'),
			$wideScreen = $('<div />').addClass('wide-screen');

		if (src.indexOf('youtube') !== -1){
			// YouTube video
			var	srcSplit = src.split('?'),
				srcMain = null;

			if (srcSplit.length > 0){
				srcMain = srcSplit[0];
				srcPure = srcMain.split('/');
				srcPure = srcPure.pop();

				var $thumbnail = $('<a />').attr({'href': '#'}).append(
						$('<img/>').attr(
							{'src': 'http://i.ytimg.com/vi/'+ srcPure + '/maxresdefault.jpg'}
						)
					);

				$wideScreen.append($thumbnail);
				$wideScreen.imagesLoaded(function(){
					$right.append($wideScreen);
					openPortfolioModal();
				});

				$thumbnail.on('click', function(e){
					e.preventDefault();
					src = src+'&autoplay=1';
					$wideScreen.empty().append( $iframe.clone().attr({'src': src}) );
				});
			}
		} else{
			$wideScreen.append(
				$iframe.clone().attr({'src': src}).on('load', function(){
					openPortfolioModal();
				})
			);
			$right.append($wideScreen);
		}
	}

	$portfolioOverlay.css('display','flex');
	setTimeout(function(){
		$portfolioOverlay.addClass('opened');
	},100);
});

$portfolioOverlay.on('click', function(e){
	if (!$(e.target).hasClass('portfolio-overlay')) return;
	$portfolioModal.find('.right').empty();
	$portfolioModal.removeClass('opened');
	setTimeout(function(){
		$portfolioOverlay.removeClass('opened');
		setTimeout(function(){
			$portfolioOverlay.hide();
			$portfolioOverlay.removeClass('loaded');
		}, 300);
	}, 300);
});





/* 5. Testimonials */

$('#testimonials>.owl-carousel').owlCarousel({
	loop:true,
	margin:0,
	nav:false,
	items:1,
	autoHeight:true,
	dots: true,
	autoplay:true,
	autoplayTimeout:8000,
	autoplayHoverPause:true,
	smartSpeed:600,
});





/* 6. Processes & On-Scroll Animations */

var $processLines = $('svg.process-line>path'),
	$win = $(window),
	winHeight = $win.height(),
	previousWinScrollTop = 0;

function onScrollHandler(){
	var winScrollTop = $win.scrollTop();
	$processLines.css('stroke-dashoffset', winScrollTop/5);
	if (winScrollTop - previousWinScrollTop > 0){
		$('.animation-chain').each(function(index, el) {
			var $el = $(el);
			if (winScrollTop > $el.offset().top - winHeight/4*3){
				var animationName = $el.data('animation');
				if (animationName === undefined || animationName === ''){
					animationName = 'fadeInUp';
				}
				$el.animateCssChain(animationName);
			}
		});
	}
	previousWinScrollTop = winScrollTop;
	window.requestAnimationFrame(onScrollHandler);
}
window.requestAnimationFrame(onScrollHandler);

$.fn.extend({
	animateCss: function (animationName) {
		var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
		$(this).addClass('animated ' + animationName).one(animationEnd, function() {
			$(this).removeClass(animationName);
		});
	},
	animateCssChain: function (animationName, delay){
		if (delay === undefined || delay === null || delay === '') delay = 0.1;

		$(this).children().each(function(index, el) {
			var $el = $(el);
			if ($el.hasClass('animated')) return true;
			$el.css({
				'-webkit-animation-delay': delay*index + 's',
				'animation-delay': delay*index + 's'
			}).animateCss(animationName);
		});
	}
});





/* 7. Contact */

var $contactFormInputs = $('.contact-main').find('input, textarea');
$contactFormInputs.on('change', function(e) {
	$this = $(this);
	if (this.value !== ''){
		$this.addClass('focused');
	} else{
		$this.removeClass('focused');
	}
});

var $mapViewSwitch = $('a.map-view-switch'),
	$mapCanvas = $('.map-canvas'),
	$contactMain = $('.contact-main');

// Activate Google Maps
if ($mapCanvas.length > 0){
	$mapCanvas.googleMaps({
		styled: false,
		disableDefaultUI: false,
		latitude: 29.597080,
		longitude: -95.620972,
		zoom: 15,
	});
}

$mapViewSwitch.on('click', function(e){
	e.preventDefault();
	if ($mapCanvas.hasClass('opened')){
		$mapCanvas.removeClass('opened');
		$contactMain.removeClass('closed');
		$mapCanvas.data('plugin_googleMaps').removeMarker();
	} else{
		$mapCanvas.addClass('opened');
		$contactMain.addClass('closed');
		$mapCanvas.data('plugin_googleMaps').addMarker();
	}
});
