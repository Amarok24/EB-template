/*
EB Template version: 1.55 (ES5 for old browsers)
https://github.com/Amarok24/EB-template
eb_template is released under The Unlicense,
see LICENSE.md or http://unlicense.org/ for more information.
*/

var eb_template = function () {
  "use strict";

  var _ONEPAGELAYOUT = false; // set this to either "true" or "false", "true" makes sense with no navi-connected slideshow
  var _DESKTOPBREAKPOINT = 680; // set this to minimal screen width for desktop layout

  var cout = console.log;
  var cerr = console.error;

  var _DOMQUERY = {};

  var _monsterTemplateType = {
    jv30_general: false, // true in both cases: fullpage + combined view
    jv30_combined: false // true only in combinded view
  };
  var _timeoutIDwindowResize = null;
  var _isMobileScreen = false;
  var _iframeParent = null; // used in jv30
  //let _winScrollBy = null;


  function startTemplate() {
    _DOMQUERY = {
      container: document.querySelector(".containerIA"),
      tabContents: document.querySelectorAll(".tabContent"),
      navButtons: document.querySelectorAll("#navigation button"),
      sitemapButtons: document.querySelectorAll("#sitemap button")
    };
    detectMonsterTemplateType();
    onWindowResize(); // decides if mobile view should be used
    addEvents();
    initAllTabs();
  }

  function removeClassAll(nList, className) {
    var nodeList = nList;

    for (var i = 0; i < nodeList.length; i++) {
      nodeList[i].classList.remove(className);
    }
  }

  function iframeParentResize() {
    // this function handles iframe height in JV30
    if (_iframeParent != null) {
      _iframeParent.style.height = _DOMQUERY.container.offsetHeight + 20 + "px";
      console.info("iframe resized, own method");
    }
  }

  function scrollToObject(elementObject) {
    //var yCorrection = yCorrection || 0;
    try {
      elementObject.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
        inline: 'nearest'
      });
      /*if (yCorrection != 0) {
        if (_monsterTemplateType.jv30_combined) {
          setTimeout( function() {_winScrollBy.scrollBy(0, yCorrection);}, 50);
          // TODO: bug in Chrome + Edge in combined view!
        } else {
          setTimeout( function() {_winScrollBy(0, yCorrection);}, 50); // dirty hack because scrollIntoView is asynchronous, *TODO*
        }
      }*/
    } catch (er) {
      cerr("scrollToObject error", er);
    }
  }

  function navButtonClick(buttonIndex, ev
  /* default true (MouseEvent click) */
  ) {
    var tabContents = _DOMQUERY.tabContents;
    var clickOrigin = ev ? ev.target.parentElement.id : null;
    var scrollCorrection = _monsterTemplateType.jv30_combined ? -78 : 0; // JobViewHeader height is 72px

    if (!_ONEPAGELAYOUT) {
      for (var i = 0; i < tabContents.length; i++) {
        tabContents[i].style.display = "none";

        _DOMQUERY.container.classList.remove("tab" + i);
      }

      tabContents[buttonIndex].style.display = "block";
      removeClassAll(_DOMQUERY.navButtons, "active");

      _DOMQUERY.navButtons[buttonIndex].classList.add("active");
    }

    _DOMQUERY.container.classList.add("tab" + buttonIndex); // first we need to resize iframe and THEN we can scroll, else wrong behaviour can be expected


    if (_monsterTemplateType.jv30_general) {
      setTimeout(iframeParentResize, 200); // wait a little bit for content to settle
    }

    if (_ONEPAGELAYOUT || _isMobileScreen || clickOrigin == "sitemap") {
      setTimeout(function () {
        scrollToObject(tabContents[buttonIndex], scrollCorrection);
      }, 120);
    }
  }

  function onWindowResize() {
    function windowResizeAction() {
      var mainContainer = _DOMQUERY.container;
      var availWidth = document.body.clientWidth;
      mainContainer.classList.remove("mobile");

      if (availWidth < _DESKTOPBREAKPOINT) {
        _isMobileScreen = true;
        mainContainer.classList.add("mobile");
      } else {
        _isMobileScreen = false;
      }

      cout("eb_template _isMobileScreen:", _isMobileScreen);
    }

    if (_timeoutIDwindowResize) {
      window.clearTimeout(_timeoutIDwindowResize);
    }

    _timeoutIDwindowResize = setTimeout(windowResizeAction, 50);
  }
  /*
    function onParentContentScroll() {
      // combined view feature to detect reduced banner
      if (_JobViewHeader.classList.contains("is-reduced")) {
        _iframeParent.style.marginTop = "72px";
      } else {
        _iframeParent.style.marginTop = "0";
      }
    }
  */


  function initStartingTab() {
    // switches to some tab directly if URL parameter "tab" found, or just switches to 1st tab
    var params = {},
        // pairs of  key - value (name - value)
    locationSearch = "";

    if (_monsterTemplateType.jv30_general) {
      try {
        locationSearch = window.parent.location.search;
      } catch (er) {
        cerr("eb_template initStartingTab: locationSearch error, details following");
        cout(er);
      }
    } else {
      locationSearch = window.location.search;
    }

    if (locationSearch) {
      var a_parts = locationSearch.substring(1).split('&'); // "a_parts" will be eg. ["tab=2", "bla=text", "val="]

      for (var i = 0; i < a_parts.length; i++) {
        var nv = a_parts[i].split('=');
        cout("eb_template initStartingTab:", nv);

        if (!nv[0]) {
          continue;
        } // skip cases like "=25" with no 'key'


        params[nv[0]] = nv[1] || true; // 'true' if no value was provided
      }
    }

    if (params.tab) {
      try {
        navButtonClick(params.tab); //document.querySelectorAll(_QUERYNAVIGATION)[params.tab].click();
      } catch (er) {
        cerr("eb_template initStartingTab: navigation click error, details following");
        cout(er);
        navButtonClick(0);
      }
    } else {
      navButtonClick(0);
    }
  } // end initStartingTab


  function addEvents() {
    var navItems = _DOMQUERY.navButtons;
    var navSitemapItems = _DOMQUERY.sitemapButtons;

    if (navItems.length) {
      for (var i = 0; i < navItems.length; i++) {
        navItems[i].addEventListener("click", navButtonClick.bind(navItems[i], i));

        if (navSitemapItems.length) {
          navSitemapItems[i].addEventListener("click", navButtonClick.bind(navSitemapItems[i], i));
        }
      }
    }

    window.addEventListener("resize", onWindowResize);
  }

  function detectMonsterTemplateType() {
    var jobId = document.getElementsByTagName("body")[0].getAttribute("data-job-id");

    function insideOfIframe() {
      // test if this html document is in iframe
      try {
        return window.self !== window.top;
      } catch (er) {
        return true;
      } // fallback for bad browsers, assumes true

    }

    _monsterTemplateType.jv30_general = insideOfIframe();

    try {
      _monsterTemplateType.jv30_combined = window.parent.document.getElementById("ContentScrollable") ? true : false;
    } catch (er) {
      cerr("access to window.parent.document failed, probably cross-origin violation");
    }

    console.group("eb_template detectMonsterTemplateType");
    cout("_monsterTemplateType:", _monsterTemplateType);

    if (jobId) {
      cout("jobId = ", jobId);
    }

    console.groupEnd();
  }

  function initAllTabs() {
    var tabContents = _DOMQUERY.tabContents;

    try {
      if (_monsterTemplateType.jv30_combined) {
        //_winScrollBy =  window.parent.document.getElementById("ContentScrollable"); // not possible to use directly .scrollBy here, TypeError: 'scrollBy' called on an object that does not implement interface Element.
        _iframeParent = window.parent.document.getElementById("JobPreviewSandbox"); //_JobViewHeader = window.parent.document.getElementById("JobViewHeader");
      } else if (_monsterTemplateType.jv30_general) {
        //_winScrollBy = window.parent.scrollBy;
        _iframeParent = window.parent.document.getElementById("JobPreviewSandbox");
      } else {//_winScrollBy =  window.scrollBy;
      }
    } catch (er) {
      cerr("access to window.parent.document failed, probably cross-origin violation");
    }

    if (!_ONEPAGELAYOUT) {
      for (var i = 0; i < tabContents.length; i++) {
        tabContents[i].style.display = "none";
      }

      initStartingTab();
    }
  }

  document.addEventListener("DOMContentLoaded", startTemplate);
  window.addEventListener("load", function () {
    return setTimeout(iframeParentResize, 1000);
  });
  return {
    /*publicProperty: "test",
    publicMethod: function() {},*/
    navButtonClick: navButtonClick,
    _monsterTemplateType: _monsterTemplateType // info: public properties won't get updated during runtime

  };
}(); // end eb_template
