import OuoCarousel from './OuoCarousel';
import './style.scss'
window.addEventListener('load', () => {
  new OuoCarousel({
    carouselContainerDom: document.getElementById("ouoCarousel"),
    supportMobile: true
  });
})