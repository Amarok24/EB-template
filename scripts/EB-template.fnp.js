/*
EB_Template version: 1.46
https://github.com/Amarok24/EB-template
EB_Template is released under The Unlicense,
see LICENSE.md or http://unlicense.org/ for more information.
*/

var EB_Template = (function() {

  "use strict";

  const _ONEPAGELAYOUT = false; // set this to either "true" or "false"
  const _DESKTOPBREAKPOINT = 481; // minimal screen width for desktop layout
  var _DOMQUERY = {};

  var _monsterTemplateType = {
    jv30_general: false, // true in both cases: fullpage + combined view
    jv30_combined: false  // true only in combinded view
  };
  var _timeoutIDwindowResize = null;
  var _isMobileScreen = false;
  var _winScrollBy = null; // used by scrollToObject
  var _iframeParent = null; // used in jv30


  function startTemplate() {
    _DOMQUERY = {
      container : document.querySelector(".containerIA"),
      tabContents : document.querySelectorAll(".tabContent"),
      navButtons : document.querySelectorAll("#navigation button"),
      sitemapButtons : document.querySelectorAll("#sitemap button")
    }
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
    /*
        var MUXmethod = window.MUX;
        if ((MUXmethod != null) && (MUXmethod.callResize != null)) {
          try {
            MUXmethod.callResize();
            console.info("iframe resized, MUX method");
          } catch (er) {
            console.error("EB_template: callResize error", er);
          }
        }
    */
    if (_iframeParent != null) {
      _iframeParent.style.height = _DOMQUERY.container.offsetHeight + 40 + "px";
      console.info("iframe resized, own method");
    }
  }


  function scrollToObject(elementObject, yCorrection) {
    var yCorrection = yCorrection || 0;
    try {
      elementObject.scrollIntoView({behavior: 'smooth', block: 'start', inline: 'nearest'});
      /*
      if (yCorrection != 0) {
        if (_monsterTemplateType.jv30_combined) {
          window.setTimeout( function() {_winScrollBy.scrollBy(0, yCorrection);}, 50);
          // TODO: bug in Chrome + Edge in combined view!
        } else {
          window.setTimeout( function() {_winScrollBy(0, yCorrection);}, 50); // dirty hack because scrollIntoView is asynchronous, *TODO*
        }
      }
      */
    } catch (er) {
      console.error("scrollToObject error", er);
    }
  }


  function navButtonClick(buttonIndex, ev /* default true (MouseEvent click) */ ) {
    var i;
    var tabContents = _DOMQUERY.tabContents;
    var clickOrigin = ev ? ev.target.parentElement.id : null;
    var scrollCorrection = _monsterTemplateType.jv30_combined ? -78 : 0; // JobViewHeader height is 72px

    if (!_ONEPAGELAYOUT) {
      for (i = 0; i < tabContents.length; i++) {
        tabContents[i].style.display = "none";
      }
      tabContents[buttonIndex].style.display = "block";
      removeClassAll(_DOMQUERY.navButtons, "active");
      _DOMQUERY.navButtons[buttonIndex].classList.add("active");
    }

    // first we need to resize iframe and THEN we can scroll, else wrong behaviour can be expected
    if (_monsterTemplateType.jv30_general) {
      window.setTimeout(iframeParentResize, 200); // wait a little bit for content to settle
    }

    if (_ONEPAGELAYOUT || _isMobileScreen || (clickOrigin == "sitemap")) {
      window.setTimeout( function() {scrollToObject(tabContents[buttonIndex], scrollCorrection);}, 120);
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
      console.log("EB_Template _isMobileScreen:", _isMobileScreen);
    }

    if (_timeoutIDwindowResize) {
      window.clearTimeout(_timeoutIDwindowResize);
    }
    _timeoutIDwindowResize = window.setTimeout(windowResizeAction, 50);
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
    var params = {}, // pairs of  key - value (name - value)
        locationSearch = "",
        i;

    if (_monsterTemplateType.jv30_general) {
      try {
        locationSearch = window.parent.location.search;
      }
      catch(er) {
        console.error("EB_Template initStartingTab: locationSearch error, details following");
        console.log(er);
      }
    } else {
      locationSearch = window.location.search;
    }

    if (locationSearch) {
      var a_parts = locationSearch.substring(1).split('&');
      // "a_parts" will be eg. ["tab=2", "bla=text", "val="]
      for (i = 0; i < a_parts.length; i++) {
        var nv = a_parts[i].split('=');
        console.log("EB_Template initStartingTab:", nv);
        if (!nv[0]) {
          continue;
        } // skip cases like "=25" with no 'key'
        params[nv[0]] = nv[1] || true; // 'true' if no value was provided
      }
    }

    if (params.tab) {
      try {
        navButtonClick(params.tab);
        //document.querySelectorAll(_QUERYNAVIGATION)[params.tab].click();
      } catch (er) {
        console.error("EB_Template initStartingTab: navigation click error, details following");
        console.log(er);
        navButtonClick(0);
      }
    } else {
      navButtonClick(0);
    }
  } // end initStartingTab


  function addEvents() {
    var i;
    var navItems = _DOMQUERY.navButtons;
    var navSitemapItems = _DOMQUERY.sitemapButtons;

    for (i = 0; i < navItems.length; i++) {
      navItems[i].addEventListener("click", navButtonClick.bind(null, i));
      navSitemapItems[i].addEventListener("click", navButtonClick.bind(null, i));
    }
    window.addEventListener("resize", onWindowResize);
  }


  function detectMonsterTemplateType() {
    var jobId = document.getElementsByTagName("body")[0].getAttribute("data-job-id");

    function insideOfIframe() { // test if this html document is in iframe
      try { return window.self !== window.top }
      catch (e) { return true; } // fallback for bad browsers, assumes true
    }

    _monsterTemplateType.jv30_general = insideOfIframe();
    _monsterTemplateType.jv30_combined = window.parent.document.getElementById("ContentScrollable") ? true : false;

    console.group("EB_Template detectMonsterTemplateType");
    console.log("_monsterTemplateType:", _monsterTemplateType);
    if (jobId) { console.log("jobId = ", jobId); }
    console.groupEnd();
  }


  function initAllTabs() {
    var i;
    var tabContents = _DOMQUERY.tabContents;

    if (_monsterTemplateType.jv30_combined) {
      _winScrollBy =  window.parent.document.getElementById("ContentScrollable"); // not possible to use directly .scrollBy here, TypeError: 'scrollBy' called on an object that does not implement interface Element.
      _iframeParent = window.parent.document.getElementById("JobPreviewSandbox");
      //_JobViewHeader = window.parent.document.getElementById("JobViewHeader");
    } else if (_monsterTemplateType.jv30_general) {
      _winScrollBy = window.parent.scrollBy;
      _iframeParent = window.parent.document.getElementById("JobPreviewSandbox");
    } else {
      _winScrollBy =  window.scrollBy;
    }

    if (!_ONEPAGELAYOUT) {
      for (i = 0; i < tabContents.length; i++) {
        tabContents[i].style.display = "none";
      }
      initStartingTab();
    }
  }


  document.addEventListener("DOMContentLoaded", startTemplate);

  window.addEventListener("load", function () {
    window.setTimeout(iframeParentResize, 1000);
  });


  return {
    /*publicProperty: "test",
    publicMethod: function() {},*/
    navButtonClick: navButtonClick,
    _monsterTemplateType: _monsterTemplateType // info: public properties won't get updated during runtime
  };

})(); // end EB_Template
