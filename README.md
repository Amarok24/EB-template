# Employer-Branding Template
![version](https://img.shields.io/badge/version-2.0a-orange.svg)
![slide-show_SimpleSlider](https://img.shields.io/badge/slide--show-SimpleSlider-yellow.svg) ![map-engine_Mapbox--GL--JS](https://img.shields.io/badge/map--engine-Mapbox--GL--JS-blue.svg) ![map-layer_Mapbox](https://img.shields.io/badge/map--layer-Mapbox-blue.svg)

## SinglePage (X)HTML Template with extras

<details>
<summary><strong>Changelog</strong></summary>

- v2.0a -- 2020-09-04, major update, code rewritten for a single-page layout
- v1.56 -- 2020-03-16, bugfix for IE 11 where first tab was not shown after first page load.
- v1.55 -- 2019-09-04, main JS file now twice, one development version (ES6 support), one production version (ES5 for old browsers like IE 11) Attention: HTML file uses picture-img (CSS3) which is not fully supported by old IE. In case of need just use "img" only.
- v1.5 -- 2019-05-20, mobile optimizations
- v1.48 -- 2018-10-05, mobile version: now completely without navigation due to Webkit iOS bugs (iPhone) and because of this there is now an #arrowScrollToTop in the bottom right corner. Desktop version: #sitemap now optional and does not lead to Javascript error when removed.
- v1.47 -- 2018-08-14, main container now gets classes "tab0", "tab1" and so on, depending on what TAB is active. Useful for advanced CSS styling.
- v1.46 -- 2018-07-09, JV30 iframe-fix update.
- v1.45 -- 2018-06-20, callResize MUX-method successfully implemented. Code-cleanup. Known bug: Chrome+Edge sitemap scroll in JV30 Combined view.
- v1.41 -- 2018-06-13, updates for JV30 combined view.
- v1.4 -- 2018-06-12, this is a major update! Almost completely rewritten code. No mory sticky menu in JV30 iframe due to iOS bugs. Iframe height gets updated correctly now. Selection between multi-page and one-page layout at the top of main script. Smooth scrolling to content in good (supported) browsers (fallback without animation for bad browsers). Direct tab selection through URL parameter even in JV30 iframe. And several other small features. All map-related code is now separated from main code, see text file in "extra" folder. In case where another slideshow library is needed then the init.js script has to be changed accordingly. For no header slideshow at all: just remove init.js and simpleslider.fnp.js
- v1.34 -- 2018-06-01, more JV30 fixes. Now the mobile menu is sticky on top even inside of iframe in JV30 (animation needs optimization). Iframe height gets updated after every menu button click.
- v1.33 -- 2018-05-31 jQuery-free version. More changes for JV30. Code optimization: now class "mobile" on main container toggles mobile and desktop view (useful for CSS formatting), EB_Template script also works with this class.
- v1.31 -- 2018-05-25, still not fully free of jQuery. This update covers first changes towards full JV30 support and some other code improvements.
- v1.3 -- new modern vanilla JS slider
- v1.2 -- 2017-11-21, map-code bugfix and update (using CSS for map-markers), main CSS moved to external CSS file
- v1.1 -- 2017-06-29, EB_Template html & Javascript version 1.1; bxSlider updated to 4.2.12; slideshow images only visible after bxSlider finishes loading; added screen shade on opened mobile menu; mobile menu button in pure CSS with CSS animation; several CSS changes
- v1.05 -- 2016-10-20, MapQuest layer removed, using Mapbox as primary map layer.
- v1.04 -- 2016-03-21, scrollToId() Gecko/Webkit difference patch, OwlCarousel2 bug -> using bxSlider
- v1.03 -- 2016-03-14, desktop redux scrolling bugfix
- v1.02 -- 2016-03-10, code cleanup
- v1.01 -- 2016-03-03, prepared for sticky-header simulation (position fixed) with monsterHeaderType.landingpage
- v1.0 -- 2016-03-02, using buttons and OwlCarousel2
- v1.0preview -- 2016-03-01, initial main version
</details>

![end_of_text](https://img.shields.io/badge/end%20of%20readme--yellow.svg)
