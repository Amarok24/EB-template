/*
EB_Template version: 1.4
https://github.com/Amarok24/EB-template
EB_Template is released under The Unlicense,
see LICENSE.md or http://unlicense.org/ for more information.
*/

var EB_Template = (function() {

  "use strict"; // use latest ECMAScript standard

  const _onePageLayout = false; // set this to either "true" or "false"
  const _desktopBreakpoint = 481; // set this to define minimal screen width for desktop layout

  var _monsterHeaderType = {
    jv30_fullpage: false, // fullpage iframe view (currently same for mobile, 5/2018)
    jv30_combined: false  // combinded iframe (this is a placeholder, not implemented yet *TODO*)
  };
  var _timeoutIDwindowResize = null;
  var _isMobileScreen = false;
  var _winScrollBy = null; // used by scrollToObject
  //var _siteNavigation = null;

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
    var iframeParent = window.parent.document.getElementById("JobPreviewSandbox");
    //var bodyThis = document.body;
    var container = document.querySelector(".containerIA");

    // the following could not be tested yet, *TODO* test in live environment
    var MUXobject = window.parent.window.MUX;
    if (MUXobject != null) {
      try {
        MUXobject.callResize();
        console.info("iframeParent resized, MUX method");
      } catch (er) {
        console.error("EB_template: callResize error", er);
      }
    } else {
      // the following line is just a quick hack, not good: iframe never gets smaller, because body scrollHeight only gets bigger when scrollbar is visible, but never smaller
      //iframeParent.style.height = bodyThis.scrollHeight + "px";
      iframeParent.style.height = container.offsetHeight + 10 + "px";
      console.info("iframeParent resized, own method");
    }
  }


  function scrollToObject(elementObject, yCorrection) {
    try {
      elementObject.scrollIntoView({behavior: 'smooth', block: 'start', inline: 'nearest'});
      if ( (yCorrection != null) && (yCorrection != 0) ) {
        window.setTimeout( function() {_winScrollBy(0, yCorrection);}, 800); // dirty hack because scrollIntoView is asynchronous, *TODO*
      }
    } catch (er) {
      console.error("scrollToObject error", er);
    }
  }


  function navButtonClick(buttonIndex, ev /* default true (MouseEvent click) */ ) {
    var i;
    var tabContent = document.querySelectorAll(".containerIA .tabContent");
    var yCorrection = _monsterHeaderType.jv30_combined ? -80 : 0; /* TODO - test later when combined is live */
    var clickOrigin = ev ? ev.target.parentElement.id : null;

    if (!_onePageLayout) {
      for (i = 0; i < tabContent.length; i++) {
        tabContent[i].style.display = "none";
      }
      tabContent[buttonIndex].style.display = "block";
      removeClassAll("#navigation button", "active");
      document.querySelectorAll("#navigation button")[buttonIndex].classList.add("active");
    }

    // first we need to resize iframe and THEN we can scroll, else wrong behaviour can be expected
    if (_monsterHeaderType.jv30_fullpage) {
      window.setTimeout(iframeParentResize, 80); // wait a little bit for content to settle
    }

    if (_onePageLayout || _isMobileScreen || (clickOrigin == "sitemap")) {
      window.setTimeout( function() {scrollToObject(tabContent[buttonIndex], yCorrection);}, 120);
    }
  } // end navButtonClick


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
      if (_monsterHeaderType.jv30_fullpage) {
        iframeParentResize();
      }
    }

    if (_timeoutIDwindowResize) {
      window.clearTimeout(_timeoutIDwindowResize);
    }
    _timeoutIDwindowResize = window.setTimeout(windowResizeAction, 50);
  } // end onWindowResize

/*
  function onParentWindowScroll() {
    // this was a workaround solution for a fixed navigation inside of JV30 iframe
    // to be used together with window.parent.addEventListener("scroll", onParentWindowScroll);
    // and with this after each window resize: JobViewContentYPosition = window.parent.document.getElementById("JobViewContent").offsetTop;
    if (!_isMobileScreen && (window.parent.pageYOffset > JobViewContentYPosition)) {
      siteNavigation.style.top = (window.parent.pageYOffset - JobViewContentYPosition) + "px";
    }
  }
*/

  function initStartingTab() {
    // switches to some tab directly if URL parameter "tab" found, or just switches to 1st tab
    var params = {}, // pairs of  key - value (name - value)
        locationSearch = "",
        i;

    if (_monsterHeaderType.jv30_fullpage) {
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
  }


  function getHeaderType() {
    var jobId = document.getElementsByTagName("body")[0].getAttribute("data-job-id");

    function insideOfIframe() { // test if this html document is in iframe
      try { return window.self !== window.top }
      catch (e) { return true; } // fallback for bad browsers, assumes true
    }

    //_monsterHeaderType.landingpage = !!document.getElementById("myheader_content"); TODO: remove this line in summer 2018
    _monsterHeaderType.jv30_fullpage = insideOfIframe();

    if (_monsterHeaderType.jv30_fullpage) {
      document.body.style.overflowY = "hidden"; // removes vertical scrollbar
    }

    console.group("EB_Template getHeaderType");
    console.log("_monsterHeaderType:", _monsterHeaderType);
    if (jobId) { console.log("jobId = ", jobId); }
    console.groupEnd();
  } // end getHeaderType


  function initAllTabs() {
    var i;
    //siteNavigation = document.getElementById("navigation");
    var tabContents = document.querySelectorAll(".containerIA .tabContent");

    if (_monsterHeaderType.jv30_fullpage) {
      _winScrollBy = window.parent.scrollBy;
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
    getHeaderType();
    onWindowResize(); // decides if mobile view should be used
    addEvents();
    initAllTabs();
  }


  document.addEventListener("DOMContentLoaded", startTemplate);


  return {
    /*publicProperty: "test",
    publicMethod: function() {},*/
    navButtonClick: navButtonClick,
    _monsterHeaderType: _monsterHeaderType // info: public properties won't get updated during runtime
  };

})(); // end EB_Template
