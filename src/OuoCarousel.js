
// TODO: 命名亂亂的
import './OuoCarousel.scss';
class OuoCarousel {
  constructor(carouselContainerDom, config) {
    this.carouselContainerDom = carouselContainerDom;
    this.carouselDoms = this.carouselContainerDom.children;
    this.carouselCount = this.carouselContainerDom.children.length;


    this.currentNumber = 0;
    this.prevNumber = 0;
    this.dotDoms = [];

    // add className and dots
    this.dotsContainer = document.createElement("div");
    this.panelContainer = document.createElement("div");
    this.dotsContainer.setAttribute("class", "ouoCarousel-dots js-ouoCarousel-dots");
    this.panelContainer.setAttribute("class", "ouoCarousel-panel js-ouoCarousel-panel");
   
    let prev = document.createElement("span");
    let next = document.createElement("span");
    prev.setAttribute("data-block", "prev");
    prev.setAttribute("class", "ouoCarousel-prev");
    next.setAttribute("data-block", "next");
    next.setAttribute("class", "ouoCarousel-next");

    this.panelContainer.appendChild(next);
    this.panelContainer.appendChild(prev);

    Array.prototype.map.call(this.carouselDoms, (dom, i) => {
      dom.className += " ouoCarousel-carousel";
      let dot = document.createElement("span");
      dot.setAttribute("data-block", i );
      if(i === 0){
        dot.setAttribute("class", "ouoCarousel-dot js-ouoCarousel-dot is-active");
      }
      else{
        dot.setAttribute("class", "ouoCarousel-dot js-ouoCarousel-dot");
      }
      this.dotDoms.push(dot);
      this.dotsContainer.appendChild(dot);
    });
    this.panelContainer.append(this.dotsContainer);
    carouselContainerDom.parentNode.append(this.panelContainer);
    this.carouselDoms = Array.prototype.slice.call(this.carouselDoms,0, this.carouselCount);

    // this.generateDots();
    this.setDefaultStyle();
    this.setTimeId = setInterval(this.autoLoop.bind(this), 3000);

    this.carouselContainerDom.addEventListener("click", () =>
      clearInterval(this.setTimeId)
    );

    this.panelContainer.addEventListener("click", this.handleChangeFigure.bind(this));


    // generate arrows


    if(config.supportMobile){
      this.carouselContainerDom.parentNode.addEventListener("touchstart", this.handleTouchStart.bind(this), false);
      this.carouselContainerDom.parentNode.addEventListener("touchmove", this.handleTouchMove.bind(this), false);
      this.carouselContainerDom.parentNode.addEventListener("touchend", this.handleTouchEnd.bind(this), false);
    }

    // this.dotCarouselDom = data.dotCarouselDom;
    // this.carouselDoms = data.carouselDoms;
    // this.dotDoms = data.dotDoms;
    // this.isMobile = data.isMobile;

    // this.bindEvent();
    // this.setTimeId = setInterval(this.autoLoop.bind(this), 3000);
  }
  setDefaultStyle() {
    this.widthPerCarousel = 100 / this.carouselCount;
    this.carouselContainerDom.style.width = this.carouselCount * 100 + "%";

    Array.prototype.map.call(this.carouselDoms, (dom, i) => {
      dom.style.width = this.widthPerCarousel + "%";
    });
    this.widthPerCarouselPx = this.carouselDoms[0].clientWidth;
  }
  // 自動輪播
  autoLoop() {
    this.prevNumber = this.currentNumber;
    if (this.currentNumber === this.carouselDoms.length -1) {
      this.currentNumber = 0;
    } else {
      this.currentNumber++;
    }
    this.changeFigure(this.currentNumber, this.widthPerCarousel, true);

    this.setDotState();
  }
  changeFigure(offsetCount, witdh, animation) {
    if (animation) {
      this.carouselContainerDom.style.transition = "0.3s ease-in-out";
    } else {
      this.carouselContainerDom.style.transition = "0s";
    }
    this.currentOffset =
      witdh * offsetCount * this.carouselContainerDom.clientWidth * 0.01;
    this.carouselContainerDom.style.transform = `translate3d( -${
      this.currentOffset
    }px, 0, 0)`;
  }
  handleTouchStart(evt) {
    clearInterval(this.setTimeId);
    this.flag = false;
    this.prevTransform =
      this.carouselContainerDom.style.transform || `translate3d(0, 0, 0)`;
    this.firstClientX = evt.touches[0].clientX;
  }
  handleTouchMove(evt) {
    this.flag = true;
    this.latestClientX = evt.touches[0].clientX;
    let offset = this.latestClientX - this.firstClientX;
    offset = this.currentOffset - offset;
    this.carouselContainerDom.style.transition = "none";
    this.carouselContainerDom.style.transform = `translate3d(-${offset}px, 0, 0)`;
  }
  handleTouchEnd(evt) {
    evt.stopPropagation();
    if (
      this.flag &&
      this.latestClientX - this.firstClientX < -50 &&
      this.currentNumber !== this.carouselDoms.length - 1
    ) {
      this.prevNumber = this.currentNumber++;
      this.changeFigure(this.currentNumber , this.widthPerCarousel, true);
      this.setDotState();
    } else if (
      this.flag &&
      this.latestClientX - this.firstClientX > 50 &&
      this.currentNumber !== 0
    ) {
      this.prevNumber = this.currentNumber--;
      this.changeFigure(this.currentNumber , this.widthPerCarousel, true);
      this.setDotState();
    } else {
      this.carouselContainerDom.style.transform = this.prevTransform;
    }
  }
  // 為了動畫效果，計算圖片數並設定容器寬度
  handleChangeFigure(evt) {
    clearInterval(this.setTimeId);
    const target = evt.target.getAttribute("data-block");
    if(target){
      this.prevNumber = this.currentNumber;
      switch (target) {
        case "prev":
        this.currentNumber = this.currentNumber === 0 ? 0 : this.currentNumber - 1;
          break;
        case "next":
          this.currentNumber = this.currentNumber === this.carouselCount  -1?this.carouselCount  -1 : this.currentNumber + 1;
          break;
        default:
          this.currentNumber = target;
          break;
      }
      this.changeFigure(this.currentNumber, this.widthPerCarousel, true);
      this.setDotState();
    }
  }
  setDotState() {
    this.dotDoms[this.prevNumber ].className = this.dotDoms[
      this.prevNumber 
    ].className.replace(" is-active", "");
    this.dotDoms[this.currentNumber ].className += " is-active";
  }
}

export default OuoCarousel;
