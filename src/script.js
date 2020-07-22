import OuoCarousel from "./OuoCarousel";
import "./style.scss";

window.addEventListener("load", () => {
  new OuoCarousel({
    carouselContainerDom: document.getElementById("ouoCarousel"),
    supportMobile: true,
    enableInfiniteLoop: false,
    pivotContainerDom: document.getElementById("pivots")
  });
});
