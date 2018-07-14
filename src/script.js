import OuoCarousel from './OuoCarousel';
import './style.scss'
window.addEventListener('load', () => {
  new OuoCarousel(document.getElementById('ouoCarousel'), {
    supportMobile: true,
  })
})