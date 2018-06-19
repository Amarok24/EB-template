# Employer-Branding Template
![version](https://img.shields.io/badge/version-1.42-orange.svg) 
![slide-show_SimpleSlider](https://img.shields.io/badge/slide--show-SimpleSlider-yellow.svg) ![map-engine_Leaflet](https://img.shields.io/badge/map--engine-Leaflet-blue.svg) ![map-layer_Mapbox](https://img.shields.io/badge/map--layer-Mapbox-blue.svg)

Changelog (only significant changes listed)
-------------------------------------------
v1.42 -- 20180619, bugfix for JV30 combined view when scrolling to ID.

v1.41 -- 20180613, updates for JV30 combined view.

v1.4 -- 20180612, this is a major update! Almost completely rewritten code. No mory sticky menu in JV30 iframe due to iOS bugs. Iframe height gets updated correctly now. Selection between multi-page and one-page layout at the top of main script. Smooth scrolling to content in good (supported) browsers (fallback without animation for bad browsers). Direct tab selection through URL parameter even in JV30 iframe. And several other small features. All map-related code is now separated from main code, see text file in "extra" folder. In case where another slideshow library is needed then the init.js script has to be changed accordingly. For no header slideshow at all: just remove init.js and simpleslider.fnp.js

v1.34 -- 20180601, more JV30 fixes. Now the mobile menu is sticky on top even inside of iframe in JV30 (animation needs optimization). Iframe height gets updated after every menu button click.

v1.33 -- 20180531 jQuery-free version. More changes for JV30. Code optimization: now class "mobile" on main container toggles mobile and desktop view (useful for CSS formatting), EB_Template script also works with this class.

v1.31 -- 20180525, still not fully free of jQuery. This update covers first changes towards full JV30 support and some other code improvements.

v1.3 -- new modern vanilla JS slider

v1.2 -- 20171121, map-code bugfix and update (using CSS for map-markers), main CSS moved to external CSS file

v1.1 -- 20170629,
- EB_Template html & Javascript version 1.1
- bxSlider updated to 4.2.12
- slideshow images only visible after bxSlider finishes loading
- added screen shade on opened mobile menu
- mobile menu button in pure CSS with CSS animation
- several CSS changes

v1.05 -- 20161020, MapQuest layer removed, using Mapbox as primary map layer.

v1.04 -- 20160321, scrollToId() Gecko/Webkit difference patch, OwlCarousel2 bug -> using bxSlider

v1.03 -- 20160314, desktop redux scrolling bugfix

v1.02 -- 20160310, code cleanup

v1.01 -- 20160303, prepared for sticky-header simulation (position fixed) with monsterHeaderType.landingpage

v1.0 -- 20160302, using buttons and OwlCarousel2

v1.0preview -- 20160301, initial main version

![end_of_text](https://img.shields.io/badge/end%20of%20readme--yellow.svg)
