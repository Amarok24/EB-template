/*
EB_Template version: 1.42
https://github.com/Amarok24/EB-template
EB_Template is released under The Unlicense,
see LICENSE.md or http://unlicense.org/ for more information.
*/

var EB_Template = (function() {

  "use strict";

  const _onePageLayout = false; // set this to either "true" or "false"
  const _desktopBreakpoint = 481; // set this to define minimal screen width for desktop layout

  var _monsterTemplateType = {
    jv30_general: false, // true in both cases: fullpage + combined view
    jv30_combined: false  // true only in combinded view
  };
  var _timeoutIDwindowResize = null;
  var _isMobileScreen = false;
  var _winScrollBy = null; // used by scrollToObject
  var _iframeParent = null; // used in jv30

/*
  function idGetCss(s_elementId, s_styleProp) {
    var element = document.getElementById(s_elementId);
    return window.getComputedStyle(element, null).getPropertyValue(s_styleProp);
  }
  function idSetCss(s_elementId, s_styleName, s_styleProp) {
    // styleNames are CSS2Properties:  backgroundColor, fontSize ...
    document.getElementById(s_elementId).style[s_styleName] = s_styleProp;
  }
  function addClassAll(myQuery, className) {
    var nodeList = document.querySelectorAll(myQuery);
    // classList in IE 10+, nodeList as result from querySelectorAll etc.
    for (var i = 0; i < nodeList.length; i++) {
      nodeList[i].classList.add(className);
    }
  }
  function toggleClassAll(myQuery, className) {
    var nodeList = document.querySelectorAll(myQuery);
    for (var i = 0; i < nodeList.length; i++) {
      nodeList[i].classList.toggle(className);
    }
  }
*/

  function removeClassAll(myQuery, className) {
    var nodeList = document.querySelectorAll(myQuery);
    for (var i = 0; i < nodeList.length; i++) {
      nodeList[i].classList.remove(className);
    }
  }


  function iframeParentResize() {
    // this function handles iframe height in JV30
    var container = document.querySelector(".containerIA");

    // the following could not be tested yet, *TODO* test in live environment
    /*
    var MUXmethod = window.MUX;
    if ((MUXmethod != null) && (MUXmethod.callResize != null)) {
      try {
        MUXmethod.callResize();
        console.info("_iframeParent resized, MUX method");
      } catch (er) {
        console.error("EB_template: callResize error", er);
      }
    } else {
      _iframeParent.style.height = container.offsetHeight + 10 + "px";
      console.info("_iframeParent resized, own method");
    }
    */
    _iframeParent.style.height = container.offsetHeight + 10 + "px";
    console.info("_iframeParent resized, own method");
  }


  function scrollToObject(elementObject, yCorrection) {
    try {
      elementObject.scrollIntoView({behavior: 'instant', block: 'start', inline: 'nearest'});
      if ( (yCorrection != null) && (yCorrection != 0) ) {
        window.setTimeout( function() {_winScrollBy(0, yCorrection);}, 50); // dirty hack because scrollIntoView is asynchronous, *TODO*
      }
    } catch (er) {
      console.error("scrollToObject error", er);
    }
  }


  function navButtonClick(buttonIndex, ev /* default true (MouseEvent click) */ ) {
    var i;
    var tabContent = document.querySelectorAll(".containerIA .tabContent");
    var clickOrigin = ev ? ev.target.parentElement.id : null;
    var scrollCorrection = _monsterTemplateType.jv30_combined ? -78 : 0; // JobViewHeader height is 72px

    if (!_onePageLayout) {
      for (i = 0; i < tabContent.length; i++) {
        tabContent[i].style.display = "none";
      }
      tabContent[buttonIndex].style.display = "block";
      removeClassAll("#navigation button", "active");
      document.querySelectorAll("#navigation button")[buttonIndex].classList.add("active");
    }

    // first we need to resize iframe and THEN we can scroll, else wrong behaviour can be expected
    if (_monsterTemplateType.jv30_general) {
      window.setTimeout(iframeParentResize, 80); // wait a little bit for content to settle
    }

    if (_onePageLayout || _isMobileScreen || (clickOrigin == "sitemap")) {
      window.setTimeout( function() {scrollToObject(tabContent[buttonIndex], scrollCorrection);}, 120);
    }
  }


  function onWindowResize() {
    function windowResizeAction() {
      var mainContainer = document.getElementsByClassName("containerIA")[0];
      var availWidth = document.body.clientWidth;

      mainContainer.classList.remove("mobile");
      if (availWidth < _desktopBreakpoint) {
        _isMobileScreen = true;
        mainContainer.classList.add("mobile");
      } else {
        _isMobileScreen = false;
      }
      console.log("EB_Template _isMobileScreen:", _isMobileScreen);
      if (_monsterTemplateType.jv30_general) {
        iframeParentResize();
      }
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
        //document.querySelectorAll("#navigation button")[params.tab].click();
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
    var navItems = document.querySelectorAll("#navigation button");
    var navSitemapItems = document.querySelectorAll("#sitemap button");

    for (i = 0; i < navItems.length; i++) {
      navItems[i].addEventListener("click", navButtonClick.bind(null, i));
      navSitemapItems[i].addEventListener("click", navButtonClick.bind(null, i));
    }
    window.addEventListener("resize", onWindowResize);
    /*
    if (_monsterTemplateType.jv30_combined) {
      window.parent.document.getElementById("ContentScrollable").addEventListener("scroll", onParentContentScroll);
    }
    */
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
    var tabContents = document.querySelectorAll(".containerIA .tabContent");

    if (_monsterTemplateType.jv30_combined) {
      _winScrollBy =  window.parent.document.getElementById("ContentScrollable").scrollBy;
      _iframeParent = window.parent.document.getElementById("JobPreviewSandbox");
      //_JobViewHeader = window.parent.document.getElementById("JobViewHeader");
    } else if (_monsterTemplateType.jv30_general) {
      _winScrollBy = window.parent.scrollBy;
      _iframeParent = window.parent.document.getElementById("JobPreviewSandbox");
    } else {
      _winScrollBy =  window.scrollBy;
    }

    if (!_onePageLayout) {
      for (i = 0; i < tabContents.length; i++) {
        tabContents[i].style.display = "none";
      }
      initStartingTab();
    }
  }


  function startTemplate() {
    detectMonsterTemplateType();
    onWindowResize(); // decides if mobile view should be used
    addEvents();
    initAllTabs();
  }


  document.addEventListener("DOMContentLoaded", startTemplate);


  return {
    /*publicProperty: "test",
    publicMethod: function() {},*/
    navButtonClick: navButtonClick,
    _monsterTemplateType: _monsterTemplateType // info: public properties won't get updated during runtime
  };

})(); // end EB_Template
