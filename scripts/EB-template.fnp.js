/* @license magnet:?xt=urn:btih:1f739d935676111cfff4b4693e3816e664797050&dn=gpl-3.0.txt GPL-v3-or-Later */

/* jshint devel: true, browser: true, jquery: true, shadow: true,
          unused: true, undef: true, strict: true, esversion: 6 */

var EB_Template = (function() {

  "use strict"; // use latest ECMAScript standard
  var jQ = jQuery.noConflict(); // '$' released, jQ + jQuery can be used
  // jQuery in EB_Template needed only for "offset().top"  TODO: make vanillaJS version

  var monsterHeaderType = {
    desktop: false, // height 159px
    mobile: false, // height 62px
    landingpage: false // height 37px
  };
  var //timeoutIDwindowScroll = null,
    timeoutIDwindowResize = null;


  window.requestAnimFrame = (function() {
    // SHIM for RAF, paulirish.com/2011/requestanimationframe-for-smart-animating/
    return window.requestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      window.msRequestAnimationFrame ||
      function(callback) {
        window.setTimeout(callback, 1000 / 60);
      };
  })();


  function scrollToId(css_id, correction, easingMethod) {
    var easingMethod = easingMethod || "easeOutSine";
    var correction = correction || 0;
    var el = document.getElementById(css_id);

    var scrollToY = function(scrollTargetY, speed, easing) {
      /*  Source: http://stackoverflow.com/a/26808520/5986007
          speed: time in pixels per second */
      var scrollY = window.scrollY,
        scrollTargetY = scrollTargetY || 0,
        speed = speed || 2000,
        easing = easing || 'easeOutSine',
        currentTime = 0;
      // min time .1, max time .8 seconds
      var time = Math.max(0.1, Math.min(Math.abs(scrollY - scrollTargetY) / speed, 0.8));
      // easing equations from https://github.com/danro/easing-js/blob/master/easing.js
      var easingEquations = {
        easeOutSine: function(pos) {
          return Math.sin(pos * (Math.PI / 2));
        },
        easeInOutSine: function(pos) {
          return (-0.5 * (Math.cos(Math.PI * pos) - 1));
        },
        easeInOutQuint: function(pos) {
          if ((pos /= 0.5) < 1) {
            return 0.5 * Math.pow(pos, 5);
          }
          return 0.5 * (Math.pow((pos - 2), 5) + 2);
        }
      };

      function tick() { // add animation loop
        currentTime += 1 / 60;
        var p = currentTime / time;
        var t = easingEquations[easing](p);
        if (p < 1) {
          window.requestAnimFrame(tick);
          window.scrollTo(0, scrollY + ((scrollTargetY - scrollY) * t));
        } else {
          window.scrollTo(0, scrollTargetY);
          //console.info('scrollToY done');
        }
      }
      tick(); // call it once to get started
    }; // end scrollToY
    /*
            var getOffset = function(elem) {
                // http://stackoverflow.com/a/442474/5986007 + https://www.kirupa.com/html5/get_element_position_using_javascript.htm
                var _x = 0;
                var _y = 0;
                while (elem && !isNaN(elem.offsetLeft) && !isNaN(elem.offsetTop)) {
                    _x += elem.offsetLeft - elem.scrollLeft; // + elem.clientLeft
                    _y += elem.offsetTop - elem.scrollTop; // + elem.clientTop
                    elem = elem.offsetParent;
                }
                return {top: _y, left: _x};
            }; // TODO: getOffset bugfix - DIFFERENT VALUES IN FF vs Chrome!
    */
    if (el) {
      //scrollToY( getOffset(el).top + correction, 500, easingMethod);
      scrollToY(jQ(el).offset().top + correction, 500, easingMethod);
      // TODO: remove the need for jQuery here!
    }
  } // end scrollToId


  function idGetCss(s_elementId, s_styleProp) {
    var element = document.getElementById(s_elementId);
    return window.getComputedStyle(element, null).getPropertyValue(s_styleProp);
  }


  function idSetCss(s_elementId, s_styleName, s_styleProp) {
    /* styleNames are CSS2Properties:  backgroundColor, fontSize ... */
    document.getElementById(s_elementId).style[s_styleName] = s_styleProp;
  }


  function addClassAll(myQuery, className) {
    var nodeList = document.querySelectorAll(myQuery);
    // classList in IE 10+, nodeList as result from querySelectorAll etc.
    for (var i = 0; i < nodeList.length; i++) {
      nodeList[i].classList.add(className);
    }
  }

  function removeClassAll(myQuery, className) {
    var nodeList = document.querySelectorAll(myQuery);
    for (var i = 0; i < nodeList.length; i++) {
      nodeList[i].classList.remove(className);
    }
  }

  function toggleClassAll(myQuery, className) {
    var nodeList = document.querySelectorAll(myQuery);
    for (var i = 0; i < nodeList.length; i++) {
      nodeList[i].classList.toggle(className);
    }
  }


  function toggleMobileMenu() {
    if (idGetCss("navigation", "display") === "none") {
      idSetCss("navigation", "display", "block");
      idSetCss("screenShade", "display", "block");
      addClassAll("#mobileButton", "pressed");
    } else {
      idSetCss("navigation", "display", "none");
      idSetCss("screenShade", "display", "none");
      removeClassAll("#mobileButton", "pressed");
    }
  }


  function navButtonClick(buttonIndex, expandMobileMenu /* default true (MouseEvent click) */ ) {
    var i;
    var tabContent = document.querySelectorAll(".containerIA .tabContent");
    var yCorrection = monsterHeaderType.mobile ? -60 : 0;
    var expandMobileMenu = !!expandMobileMenu;

    removeClassAll("#navigation button", "active");
    document.querySelectorAll("#navigation button")[buttonIndex].classList.add("active");

    for (i = 0; i < tabContent.length; i++) {
      tabContent[i].style.display = "none";
    }
    tabContent[buttonIndex].style.display = "block";

    if (idGetCss("mobileButtonWrapper", "display") === "block") {
      if (expandMobileMenu) {
        toggleMobileMenu();
      }
      scrollToId("hook", yCorrection);
    }
  } // navButtonClick()


  function contentClick() {
    if (idGetCss("mobileButtonWrapper", "display") === "block") {
      idSetCss("navigation", "display", "none");
      idSetCss("screenShade", "display", "none");
      removeClassAll("#mobileButton", "pressed");
    }
  }


  function onWindowResize() {

    function windowResizeAction() {
      if (idGetCss("mobileButtonWrapper", "display") === "block") {
        idSetCss("navigation", "display", "none");
      } else {
        idSetCss("navigation", "display", "block"); // use "block" or "flex"
      }
    }

    if (timeoutIDwindowResize) {
      window.clearTimeout(timeoutIDwindowResize);
    }
    timeoutIDwindowResize = window.setTimeout(windowResizeAction, 50);
  }

  /*
      function onWindowScroll() {
          function windowScrollAction() {
              // executed only 1x every 30ms, but only the very last timeout fires this function, because all previous timeouts are being discarded with every new scroll event
              if (window.pageYOffset > 37) {
                  // do something ...
              }
          }
          if (timeoutIDwindowScroll) { window.clearTimeout(timeoutIDwindowScroll); }
          timeoutIDwindowScroll = window.setTimeout(windowScrollAction, 30);
      } // onWindowScroll()
  */

  function urlParameterSwitchTab() {
    /* switches to specific tab directly, if URL parameter "tab" is found */
    var params = {}, // pairs of  key - value (name - value)
      i;

    if (location.search) {
      var a_parts = location.search.substring(1).split('&');
      // "a_parts" will be eg. ["tab=2", "bla=text", "val="]
      for (i = 0; i < a_parts.length; i++) {
        var nv = a_parts[i].split('=');
        console.log(nv);
        if (!nv[0]) {
          continue;
        } // skip cases like "=25" with no 'key'
        params[nv[0]] = nv[1] || true; // 'true' if no value was provided
      }
    }
    if (params.tab) {
      document.querySelectorAll("#navigation button")[params.tab].click();
    }
  }


  function addEvents() {
    var i;
    var navItems = document.querySelectorAll("#navigation button");

    for (i = 0; i < navItems.length; i++) {
      // stackoverflow.com/questions/35775562/get-index-of-child-with-event-currenttarget
      navItems[i].addEventListener("click", navButtonClick.bind(null, i));
    }
    document.getElementById("mobileButtonWrapper").addEventListener("click", toggleMobileMenu);
    document.querySelector(".containerIA .tabContent").addEventListener("click", contentClick);
    document.getElementById("screenShade").addEventListener("click", contentClick);
    window.addEventListener("resize", onWindowResize);
  }


  function monsterBugFixes() {
    /* if (monsterHeaderType.desktop) {
        // Monster Redux bug fix (EB page scrolling with Javascript)
        document.getElementsByTagName("html")[0].setAttribute(
            "style", "height:auto !important; overflow:auto !important");
        document.getElementsByTagName("body")[0].setAttribute(
            "style", "height:auto !important; overflow:hidden !important");
        // following corrects the position of desktop-redux footer
        var afh = document.querySelector(".AppliesFooterHolder");
        if (afh) { afh.setAttribute('style', 'margin-top: 0 !important'); }
    } */
    if (monsterHeaderType.mobile) {
      // Monster mobile-Redux padding 0 for correct mobile navigation alignment
      var jvb = document.getElementById("jobViewBody");
      var uibox = document.querySelector("#jobViewBody .ui-box");
      if (jvb) {
        jvb.setAttribute("style", "padding: 0");
      }
      if (uibox) {
        uibox.setAttribute("style", "padding: 0");
      }
    }
  }


  function getHeaderType() {
    monsterHeaderType.desktop = !!document.getElementById("monsterAppliesPageWrapper");
    monsterHeaderType.mobile = !!document.getElementById("jobViewBody");
    monsterHeaderType.landingpage = !!document.getElementById("myheader_content");
  }


  function initAllTabs() {
    var i;
    var tabContents = document.querySelectorAll(".containerIA .tabContent");
    for (i = 0; i < tabContents.length; i++) {
      tabContents[i].style.display = "none";
    }
    if (monsterHeaderType.mobile) {
      idSetCss("mobileButtonWrapper", "top", "62px");
      idSetCss("navigation", "top", "62px");
    }
    if (monsterHeaderType.landingpage && idGetCss("navigation", "position") === "fixed") {
      // if we have a fixed menu, we need a 'sticky' emulation for landingpages
      // css3 "position: sticky" currently works only in Firefox (44)
      idSetCss("navigation", "top", "38px");
    }
    //document.querySelector("#navigation button").click(); // directly click on 1st item
    tabContents[0].style.display = "block";
    document.querySelector("#navigation button").classList.add("active"); // activate first button
  }


  function startTemplate() {
    getHeaderType();
    onWindowResize(); // show #navigation if #mobileButtonWrapper is hidden
    addEvents();
    initAllTabs();
    monsterBugFixes();
    urlParameterSwitchTab();
  }


  document.addEventListener("DOMContentLoaded", startTemplate);


  return {
    /*publicProperty: "test",
    publicMethod: function() {},*/
    monsterHeaderType: monsterHeaderType,
    idGetCss: idGetCss,
    idSetCss: idSetCss,
    navButtonClick: navButtonClick,
    version: "1.1"
  };

})(); // end EB_Template

/* @license-end */
