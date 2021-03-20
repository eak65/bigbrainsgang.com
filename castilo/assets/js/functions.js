/*
 * Template functions file.
 *
 */
jQuery( function() { "use strict";

	var screen_has_mouse = false,
		$body = jQuery( "body" ),
		$top = jQuery( "#top" ),
		$featured = jQuery( "#featured" );

	// Simple way of determining if user is using a mouse device.
	function themeMouseMove() {
		screen_has_mouse = true;
	}
	function themeTouchStart() {
		jQuery( window ).off( "mousemove.castilo" );
		screen_has_mouse = false;
		setTimeout(function() {
			jQuery( window ).on( "mousemove.castilo", themeMouseMove );
		}, 250);
	}
	if ( ! navigator.userAgent.match( /(iPad|iPhone|iPod)/g ) ) {
		jQuery( window ).on( "touchstart.castilo", themeTouchStart ).on( "mousemove.castilo", themeMouseMove );
		if ( window.navigator.msPointerEnabled ) {
			document.addEventListener( "MSPointerDown", themeTouchStart, false );
		}
	}

	// Handle both mouse hover and touch events for traditional menu + mobile hamburger.
	jQuery( "#top .site-menu-toggle" ).on( "click.castilo", function( e ) {
		$body.toggleClass( "mobile-menu-opened" );
		e.stopPropagation();
		e.preventDefault();
	});

	jQuery( "#site-menu .menu-expand" ).on( "click.castilo", function ( e ) {
		var $parent = jQuery( this ).parent();
		if ( jQuery( ".site-menu-toggle" ).is( ":visible" ) ) {
			$parent.toggleClass( "collapse" );
		}
		e.preventDefault();
	});
	jQuery( "#site-menu .current-menu-parent" ).addClass( "collapse" );

	jQuery( document ).on({
		mouseenter: function() {
			if ( screen_has_mouse ) {
				jQuery( this ).addClass( "hover" );
			}
		},
		mouseleave: function() {
			if ( screen_has_mouse ) {
				jQuery( this ).removeClass( "hover" );
			}
		}
	}, "#site-menu li" );

	if ( jQuery( "html" ).hasClass( "touchevents" ) ) {
		jQuery( "#site-menu li.menu-item-has-children > a:not(.menu-expand)" ).on( "click.castilo", function (e) {
			if ( ! screen_has_mouse && ! window.navigator.msPointerEnabled && ! jQuery( ".site-menu-toggle" ).is( ":visible" ) ) {
				var $parent = jQuery( this ).parent();
				if ( ! $parent.parents( ".hover" ).length ) {
					jQuery( "#site-menu li.menu-item-has-children" ).not( $parent ).removeClass( "hover" );
				}
				$parent.toggleClass( "hover" );
				e.preventDefault();
			}
		});
	} else {
		// Toggle visibility of dropdowns on keyboard focus events.
		jQuery( "#site-menu li > a:not(.menu-expand), #top .site-title a, #social-links-menu a:first" ).on( "focus.castilo blur.castilo", function(e) {
			if ( screen_has_mouse && ! jQuery( "#top .site-menu-toggle" ).is( ":visible" ) ) {
				var $parent = jQuery( this ).parent();
				if ( ! $parent.parents( ".hover" ).length ) {
					jQuery( "#site-menu .menu-item-has-children.hover" ).not( $parent ).removeClass( "hover" );
				}
				if ( $parent.hasClass( "menu-item-has-children" ) ) {
					$parent.addClass( "hover" );
				}
				e.preventDefault();
			}
		});
	}

	// Toggle visibility of dropdowns if touched outside the menu area.
	jQuery( document ).on( "click.castilo", function(e) {
		if ( jQuery( e.target ).parents( "#site-menu" ).length > 0 ) {
			return;
		}
		jQuery( "#site-menu li.menu-item-has-children" ).removeClass( "hover" );
	});

	// Handle navigation stickiness.
	if ( $top.hasClass( "navbar-sticky" ) && $top.length > 0 && $featured.length > 0 ) {
		var top_nav_height, featured_height;

		function updateStickyNavVariables() {
			top_nav_height  = $top.outerHeight();
			featured_height = $featured.outerHeight() + top_nav_height;
		}

		updateStickyNavVariables();

		jQuery( window ).on( "resize.castilo", function() {
			if ( window.innerWidth >= 992 ) {
				var isFixed = $body.hasClass( "navbar-is-sticky" );
				$body.removeClass( "navbar-is-sticky" );
				updateStickyNavVariables();
				if ( isFixed ) {
					$body.addClass( "navbar-is-sticky" );
				}

				// On scroll, we want to stick/unstick the navigation.
				if ( ! $top.hasClass( "navbar-sticky-watching" ) ) {
					$top.addClass( "navbar-sticky-watching" );
					jQuery( window ).on( "scroll.castilo", function() {
						var isFixed = $body.hasClass( "navbar-is-sticky" );
						if ( 1 > ( featured_height - window.pageYOffset ) ) {
							if ( ! isFixed ) {
								$body.addClass( "navbar-is-sticky" );
								if ( parseInt( $featured.css( "margin-top" ), 10 ) != top_nav_height ) {
									$featured.css( "margin-top", top_nav_height );
								}
							}
						} else {
							if ( isFixed ) {
								$body.removeClass( "navbar-is-sticky" );
								$featured.css( "margin-top", "" );
							}
						}
					} ).scroll();
				}
			} else {
				if ( $top.hasClass( "navbar-sticky-watching" ) ) {
					$top.removeClass( "navbar-sticky-watching" );
					jQuery( window ).unbind( "scroll.castilo" );
					$body.removeClass( "navbar-is-sticky" );
					$featured.css( "margin-top", "" );
				}
			}
		}).resize();
	}

	// Handle tab navigation.
	jQuery( ".tabs a" ).on( "click.castilo", function (e) {
		var $parent = jQuery( this ).parent();
		e.preventDefault();
		if ( $parent.hasClass( "active" ) ) {
			return;
		}
		$parent.siblings( "li" ).each( function() {
			jQuery( this ).removeClass( "active" );
			jQuery( jQuery( this ).find( "a" ).attr( "href" ) ).removeClass( "active" );
		});
		$parent.addClass( "active" );
		var hash = $parent.find( "a" ).attr( "href" );
		jQuery( hash ).addClass( "active" );
	});

});
