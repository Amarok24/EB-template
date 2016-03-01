/* @license magnet:?xt=urn:btih:1f739d935676111cfff4b4693e3816e664797050&dn=gpl-3.0.txt GPL-v3-or-Later */

/*jslint browser: true, node: true, devel: true, sloppy: false,
  white: true, vars: true, plusplus: true, indent: 4, maxlen: 90*/

var EB_Template = (function () {

    "use strict"; // use latest ECMAScript standard
    var jQ = jQuery.noConflict(); // '$' is released, both jQ and jQuery can be used

    var monsterHeaderType = {
        desktop: false, // height 159px
        mobile: false,  // height 63px
        landingpage: false  // height 37px
    };
    var timeoutIDwindowScroll = null,
        timeoutIDwindowResize = null;


    function idGetCss(s_elementId, s_styleProp) {
        var element = document.getElementById(s_elementId);
        return window.getComputedStyle(element, null).getPropertyValue(s_styleProp);
    }


    function idSetCss(s_elementId, s_styleName, s_styleProp) {
    /* styleNames are CSS2Properties:  backgroundColor, fontSize ... */
        document.getElementById(s_elementId).style[s_styleName] = s_styleProp;
    }


    function toggleMobileMenu() {
        if (idGetCss("menu", "display") === "none") {
            idSetCss("menu", "display", "block");
        } else {
            idSetCss("menu", "display", "none");
        }
    }

/*
    //vanillaJS classList only in IE 10+
    function nodeListRemoveClass(nlist, className) {
        for (var i; i < nlist.length; i++) { nlist[i].classList.remove(className); }
    }
*/
    function menuItemClick(ev) {
        var i;
        var tabContent = document.querySelectorAll(".container .tabContent");
        var n = jQ(ev.currentTarget).index();
        /* "currentTarget" always refers to the element whose event listener
            triggered the event, opposed to the "target" property, which
            returns the element that triggered the event */

        var scrollToId = function(css_id, correction) {
            var css_id = css_id || "#";
            var correction = correction || 0;

            var divPosition = jQ("#" + css_id).offset();
            jQ("html, body").animate({
                scrollTop: divPosition.top + correction
            }, "slow");
        };

        //ev.preventDefault(); // ev = click event (prevents jump to top / href=#)

        // nodeListRemoveClass(document.querySelectorAll("#menu a"), "active");
        // -- vanillaJS classList only in IE 10+
        jQ("#menu a").removeClass("active");
        jQ("#menu a:eq(" + n + ")").addClass("active");
        for (i=0; i < tabContent.length; i++) {
            tabContent[i].style.display = "none";
        }
        tabContent[n].style.display = "block";

        if (idGetCss("mobileMenuButton", "display") === "block") {
            toggleMobileMenu();
            scrollToId("hook", -15);
        }
    } // menuItemClick()


    function contentClick() {
        if (idGetCss("mobileMenuButton", "display") === "block") {
            idSetCss("menu", "display", "none");
        }
    }


    function onWindowResize() {

        function windowResizeAction() {
            if (idGetCss("mobileMenuButton", "display") === "block") {
                idSetCss("menu", "display", "none");
            } else {
                idSetCss("menu", "display", "block");
            }
        }

        if (timeoutIDwindowResize) { window.clearTimeout(timeoutIDwindowResize); }
        timeoutIDwindowResize = window.setTimeout(windowResizeAction, 50);
    }


    function onWindowScroll() {

        function windowScrollAction() {
            /* executed only 1x every 30ms, but only the very last timeout fires this function,
                    because all previous timeouts are being discarded with every new scroll event */
            var mobileButtonId = document.getElementById("mobileMenuButton"),
                menuId = document.getElementById("menu");
            if (window.pageYOffset > 63) {
                mobileButtonId.style.top = 0;
                menuId.style.top = 0;
            } else {
                mobileButtonId.style.top = "64px";
                menuId.style.top = "64px";
            }
        }

        if (timeoutIDwindowScroll) { window.clearTimeout(timeoutIDwindowScroll); }
        timeoutIDwindowScroll = window.setTimeout(windowScrollAction, 30);

    } // onWindowScroll()


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
                if (!nv[0]) { continue; } // skip cases like "=25" with no 'key'
                params[nv[0]] = nv[1] || true; // 'true' if no value was provided
            }
        }
        if (params.tab) {
            document.querySelectorAll("#menu a")[params.tab].click();
        }
    }


    function addEvents() {
        var i;
        var menuItems = document.querySelectorAll("#menu a");

        for (i=0; i < menuItems.length; i++) {
            menuItems[i].addEventListener("click", menuItemClick);
        }
        document.getElementById("mobileMenuButton").addEventListener("click", toggleMobileMenu);
        document.querySelector(".container .content").addEventListener("click", contentClick);
        window.addEventListener("resize", onWindowResize);

        if (monsterHeaderType.mobile) {
            window.addEventListener("scroll", onWindowScroll);
            if (idGetCss("mobileMenuButton", "display") === "block") {
                onWindowScroll(); // immediately set correct button position
            }
        }
    }


    function monsterBugFixes() {
        if (monsterHeaderType.desktop) {
            var afh = document.querySelector(".AppliesFooterHolder");
            var mapw = document.getElementById("monsterAppliesPageWrapper");

            /* Monster Redux bug fix (EB page scrolling with Javascript)  */
            document.getElementsByTagName("html")[0].setAttribute(
                "style", "height:auto !important; overflow:auto !important");
            document.getElementsByTagName("body")[0].setAttribute(
                "style", "height:auto !important; overflow:hidden !important");

            // following 2 are other fixes, not to do with EB scrolling
            if (afh) { afh.setAttribute('style', 'margin-top: 0 !important'); }
            if (mapw) { mapw.setAttribute('style', 'overflow: hidden !important'); }
            console.info('monsterHeaderType.desktop bugfix applied');
        }
    }


    function getHeaderType() {
        monsterHeaderType.desktop = !!document.getElementById("monsterAppliesPageWrapper");
        monsterHeaderType.mobile = !!document.getElementById("jobViewBody");
        monsterHeaderType.landingpage = !!document.getElementById("myheader_content");
    }


    function initAllTabs() {
        var i;
        var tabContents = document.querySelectorAll(".container .tabContent");
        for (i = 0; i < tabContents.length; i++) {
            tabContents[i].style.display = "none";
        }
        document.querySelector("#menu a").click(); // directly click on 1st item
    }


    function startTemplate() {
        getHeaderType();
        onWindowResize(); // show #menu if #mobileMenuButton is hidden
        addEvents();
        initAllTabs();
        monsterBugFixes();
        urlParameterSwitchTab();
    } // end startTemplate


    document.addEventListener("DOMContentLoaded", startTemplate);


    return {
        /*publicProperty: "test",
        publicMethod: function() {},*/
        monsterHeaderType: monsterHeaderType,
        idGetCss: idGetCss,
        idSetCss: idSetCss,
        version: "1.0"
    };

})(); // end EB_Template

/* @license-end */
