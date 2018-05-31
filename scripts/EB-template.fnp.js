// EB-Template is released under the GNU GENERAL PUBLIC LICENSE version 3.

/* jshint devel: true, browser: true, shadow: true,
          unused: true, undef: true, strict: true, esversion: 6 */

var EB_Template = (function() {

  "use strict"; // use latest ECMAScript standard

  var monsterHeaderType = {
    jv30_fullpage: false, // fullpage iframe view (currently same for mobile, 5/2018)
    jv30_combined: false  // combinded iframe (this is a placeholder, not implemented yet *TODO*)
  };
  var templateYoffset = 0; // usually 0 if not inside of iframe
  var timeoutIDwindowResize = null;
  var mobileScreen = false;
  const desktopBreakpoint = 481; // defines minimal screen width for desktop layout


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


  function scrollToId(css_id, yCorrection) {
    var yScroll = window.parent.scrollBy || window.scrollBy; // 1st in iframe (JV30) environment
    document.getElementById(css_id).scrollIntoView();
    yScroll(0, yCorrection);
  }


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


/*
  function iframeParentResize() {
    // not good: iframe never gets smaller, because body scrollHeight only gets bigger when scrollbar is visible, but never smaller
    var iframeParent = window.parent.document.getElementById("JobPreviewSandbox");
    var bodyThis = document.getElementsByTagName("body")[0];
    if (monsterHeaderType.jv30_fullpage) {
      iframeParent.style.height = bodyThis.scrollHeight + "px";
    }
  }
*/

  function toggleMobileMenu() {
    /* TODO  rewrite */
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
    var yCorrection = monsterHeaderType.jv30_combined ? -60 : 0; /* TODO - test later when combined is live */
    var expandMobileMenu = !!expandMobileMenu;

    console.log("navButtonClick");

    removeClassAll("#navigation button", "active");
    document.querySelectorAll("#navigation button")[buttonIndex].classList.add("active");

    for (i = 0; i < tabContent.length; i++) {
      tabContent[i].style.display = "none";
    }
    tabContent[buttonIndex].style.display = "block";

    if (mobileScreen) {
      if (expandMobileMenu) {
        toggleMobileMenu();
      }
      scrollToId("hook", yCorrection);
    }
  }


  function contentClick() {
    if (mobileScreen) {
      idSetCss("navigation", "display", "none");
      idSetCss("screenShade", "display", "none");
      removeClassAll("#mobileButton", "pressed");
    }
  }


  function onWindowResize() {

    function windowResizeAction() {
      var mainContainer = document.getElementsByClassName("containerIA")[0];
      mainContainer.classList.remove("mobile");
      if (window.screen.width < desktopBreakpoint) {
        mobileScreen = true;
        mainContainer.classList.add("mobile");
        contentClick(); // to hide the navigation menu
      } else {
        mobileScreen = false;
        idSetCss("navigation", "display", "block");
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

  function initStartingTab() {
    /* switches to some tab directly if URL parameter "tab" found, or just switches to 1st tab */
    var params = {}, // pairs of  key - value (name - value)
        locationSearch = "",
        i;

    console.group("EB_Template initStartingTab");

    if (monsterHeaderType.jv30_fullpage) {
      try {
        locationSearch = window.parent.location.search;
      }
      catch(er) {
        console.error("locationSearch error, details following");
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
        console.log(nv);
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
        console.error("navigation click error, details following");
        console.log(er);
        navButtonClick(0);
      }
    } else {
      navButtonClick(0);
    }

    console.groupEnd();
  } // end initStartingTab


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


  function getHeaderType() {
    var jobId = document.getElementsByTagName("body")[0].getAttribute("data-job-id");

    function insideOfIframe() { // test if this html document is in iframe
      try { return window.self !== window.top }
      catch (e) { return true; } // fallback for bad browsers, assumes true
    }

    //monsterHeaderType.landingpage = !!document.getElementById("myheader_content"); TODO: remove this line in summer 2018
    monsterHeaderType.jv30_fullpage = insideOfIframe();

    console.group("EB_Template getHeaderType");
    console.log("monsterHeaderType:", monsterHeaderType);
    if (jobId) { console.log("jobId = ", jobId); }
    console.groupEnd();
  }


  function initAllTabs() {
    var i;
    var tabContents = document.querySelectorAll(".containerIA .tabContent");
    for (i = 0; i < tabContents.length; i++) {
      tabContents[i].style.display = "none";
    }

    if (monsterHeaderType.jv30_combined) { //  *TODO* test when "combined" goes live
      idSetCss("mobileButtonWrapper", "top", "62px");
      idSetCss("navigation", "top", "62px");
    }

    mobileScreen = (window.screen.width < desktopBreakpoint) ? true : false;

    //document.querySelector("#navigation button").click(); // directly click on 1st item
    //tabContents[0].style.display = "block";
    //document.querySelector("#navigation button").classList.add("active"); // activate first button
    initStartingTab();
  }


  function startTemplate() {
    getHeaderType();
    onWindowResize(); // decide if mobile view should be used
    addEvents();
    initAllTabs();
  }


  document.addEventListener("DOMContentLoaded", startTemplate);


  return {
    /*publicProperty: "test",
    publicMethod: function() {},*/
    monsterHeaderType: monsterHeaderType,
    idGetCss: idGetCss,
    idSetCss: idSetCss,
    navButtonClick: navButtonClick,
    version: "1.33"
  };

})(); // end EB_Template

/* TODO: bugfix, screenShade should disappear after mobile menu click */
