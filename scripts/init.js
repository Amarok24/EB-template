function initSlider() {
    var navSlider = simpleslider.getSlider({
        container: document.getElementById("headerSlideshow"),
        paused: true,
        prop: "opacity",
        unit: "",
        init: 0,
        show: 1,
        end: 0
    });

    var navButtons = document.querySelectorAll("#navigation button");
    var i;

    function navSliderChangeTo(index) {
      navSlider.change(index);
    }

    document.getElementById("headerSlideshow").style.paddingBottom = "19%";

    for (i = 0; i < navButtons.length; i++) {
      navButtons[i].addEventListener("click", navSliderChangeTo.bind(null, i));
    }

} // end initSlider

document.addEventListener('DOMContentLoaded', function() {
    initSlider();
});
