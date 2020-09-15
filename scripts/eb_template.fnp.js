/*
EB Template version: 2.1
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

  const BIGSCREEN_BREAKPOINT = 641; // minimal screen width for big screens
  const SMALLSCREEN_CLASSNAME = "smallScreen"; // CSS classname for small screens

  const cout = console.log;
  const cerr = console.error;

  let _timeoutIDwindowResize = null;


  function iframeAutoFix(callback, callBackParams) {
    // JV30-specific solution
    let iframeParent = window.parent.document.getElementById("JobPreviewSandbox");

    if (iframeParent !== null) {
      iframeParent.style.height = CONTAINER.offsetHeight + 20 + "px";
      iframeParent.style.width = "100%";
      iframeParent.style.border = 0;
      cout("iframeAutoFix done");
    }

    if (typeCheck(callback, "function")) callback(callBackParams);
  }


  function typeCheck(obj, type) {
    if (obj === null) {
      return type === "null" ? true : false;
    }
    if (obj === undefined) {
      return type === "undefined" ? true : false;
    }

    return obj.constructor.name.toLowerCase() === type.toLowerCase();
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


  function setBodyClass() {
    const availWidth = document.body.clientWidth;

    BODY.classList.remove(SMALLSCREEN_CLASSNAME);
    if (availWidth < BIGSCREEN_BREAKPOINT) {
      BODY.classList.add(SMALLSCREEN_CLASSNAME);
    }
  }


  function onWindowResize() {
    const doAfterResize = () => {
      setBodyClass();
      iframeAutoFix();
    }

    if (_timeoutIDwindowResize) {
      // Optimization for not overloading the browser with too many func executions.
      // Timeout ID gets deleted each time, so doAfterResize gets executed only after
      // user stops resizing the window for at least 50ms (number below)
      clearTimeout(_timeoutIDwindowResize);
    }
    _timeoutIDwindowResize = setTimeout(doAfterResize, 100);
  }


  function getUrlParams() {
    // example parameters in URL:  ...page.html?param=123&focus=pos5
    let paramsObj = {}, // pairs of key-value
        locationSearch = "";

    if (IN_IFRAME) { // if we are inside of iframe
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
      // 'arrayParams' will be eg. ["focus=5", "val="]

      for (let i = 0; i < arrayParams.length; i++) {
        let keyValPair = arrayParams[i].split("=");
        // keyValPair will be eg. ["focus", "5"]

        if (keyValPair[0] === "") continue; // skip cases like "=25" with no 'key'
        paramsObj[keyValPair[0]] = keyValPair[1] || true; // 'true' if no value provided
      }
    }

    return paramsObj;
  }


  function focusSectionNum(num) {
    if (!typeCheck(num, "undefined")) {
      const selectedSection = SECTIONS[num-1];
      if (selectedSection) scrollToElement(selectedSection);
    }
  }



  /* ******** MAIN ************ */

  const parameters = getUrlParams();
  cout(parameters);

  setBodyClass();

  window.addEventListener("resize", onWindowResize);
  window.addEventListener("load", () => setTimeout(iframeAutoFix.bind(null,   focusSectionNum, parameters.focus), 500));

  /* ******** MAIN END ******** */


  // Value of a variable assigned to an IIFE is simply "undefined".
  // To obtain a value or to make some content (functions, objects) available
  // to the variable (to the outside scope), we can simply return something.
  return {
    /*publicProperty: "test",
    publicMethod: function() {},*/
    iframeAutoFix: iframeAutoFix,
    IN_IFRAME: IN_IFRAME // info: public properties won't get updated during runtime
  };

})(); // end eb_template
