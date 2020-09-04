/*
EB Template version: 2.0a (ES6 compatible)
https://github.com/Amarok24/EB-template
eb_template is released under The Unlicense,
see LICENSE.md or http://unlicense.org/ for more information.
*/

let eb_template = (function () {
  "use strict";

  const CONTAINER = document.querySelector(".containerIA");
  const SECTIONS = CONTAINER.querySelectorAll("section");
  const BODY = document.getElementsByTagName("body")[0];

  const IN_IFRAME = window.self !== window.top;

  const DESKTOP_BREAKPOINT = 641; // set to minimal screen width for desktop
  const CLASSNAME_MOBILE = "mobile"; // set classname for mobile screen width

  const cout = console.log;
  const cerr = console.error;

  let _timeoutIDwindowResize = null;



  function iframeAutoFix(callback) {
    // Monster-specific solution, JV30
    let iframeParent = window.parent.document.getElementById("JobPreviewSandbox");

    if (iframeParent !== null) {
      iframeParent.style.height = CONTAINER.offsetHeight + 50 + "px";
      iframeParent.style.width = "100%";
      iframeParent.style.border = 0;
      cout("iframeAutoFix done");
    }

    if (typeof callback === "function") callback();
  }


  function scrollToElement(elem) {
    if (elem) {
      elem.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    } else {
      cerr("scrollToElement: given element is empty");
    }
  }


  function onWindowResize() {
    const doAfterResize = () => {
      const availWidth = document.body.clientWidth;

      BODY.classList.remove(CLASSNAME_MOBILE);
      if (availWidth < DESKTOP_BREAKPOINT) {
        BODY.classList.add(CLASSNAME_MOBILE);
      }
    }

    if (_timeoutIDwindowResize) {
      // Optimization for not overloading the browser with too many func executions.
      // Timeout ID gets deleted each time, so doAfterResize gets executed only after
      // user stops resizing the window for at least 50ms (number below)
      clearTimeout(_timeoutIDwindowResize);
    }
    _timeoutIDwindowResize = setTimeout(doAfterResize, 50);
  }


  function getUrlParams() {
    // example parameters in URL:  ...page.html?param=123&focus=pos5
    let paramsObj = {}, // pairs of key-value
      locationSearch = "";

    if (window.parent !== window) { // if we are inside of iframe
      try {
        locationSearch = window.parent.location.search;
      } catch (er) {
        cerr("getUrlParams: locationSearch error, details following");
        cout(er);
      }
    } else {
      locationSearch = window.location.search;
    }

    if (locationSearch) {
      let urlAllParameters = locationSearch.substring(1);
      let arrayParams = urlAllParameters.split("&");
      // 'arrayParams' will be eg. ["focus=pos5", "val="]

      for (let i = 0; i < arrayParams.length; i++) {
        let keyValPair = arrayParams[i].split('=');
        // keyValPair will be eg. ["focus", "pos5"]

        if (keyValPair[0] === "") continue; // skip cases like "=25" with no 'key'
        paramsObj[keyValPair[0]] = keyValPair[1] || true; // 'true' if no value provided
      }
    }

    return paramsObj;
  }



  /* ******** MAIN ************ */

  const parameters = getUrlParams();
  let scrollToParam = () => {
    scrollToElement(document.getElementById(parameters.focus));
    // TODO: rewrite to use SECTIONS, no IDs
  };
  cout(parameters);
  if (!parameters.focus) scrollToParam = null;

  onWindowResize(); // trigger once to initialize

  window.addEventListener("resize", onWindowResize);
  window.addEventListener("load", () => setTimeout(iframeAutoFix.bind(null, scrollToParam), 500));

  /* ******** MAIN END ******** */


  // Value of a variable assigned to an IIFE is simply "undefined".
  // To obtain a value or to make some content (functions, objects) available
  // to the variable (to the outside scope), we can simply return something.
  return {
    /*publicProperty: "test",
    publicMethod: function() {},*/
    iframeAutoFix: iframeAutoFix,
    CLASSNAME_MOBILE: CLASSNAME_MOBILE,
    IN_IFRAME: IN_IFRAME // info: public properties won't get updated during runtime
  };

})(); // end eb_template
