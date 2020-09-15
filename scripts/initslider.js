function initSlider() {
  const navSlider = simpleslider.getSlider({
    container: document.getElementById("headerSlideshow"),
    paused: false,
    prop: "opacity",
    unit: "",
    init: 0,
    show: 1,
    end: 0
  });
}
