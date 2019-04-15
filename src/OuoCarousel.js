import "./OuoCarousel.scss";
// TODO: infinite
// TODO: bind animport '../../../sass/molecules/_carousel.scss';
import { removeClass, addClass } from "./utils/domHelper";

export default class OuoCarousel {
  constructor({
    context = document,
    carouselContainerDom,
    supportMobile = true,
    enableAutoloop = true,
    pivotContainerDom = null,
    enableDot = true,
    enableArrow = true,
    enableInfiniteLoop = false,
    transitionTime = 300,
    loopTime = 2000
  }) {
    this.context = context;
    this.currentNumber = enableInfiniteLoop ? 1 : 0;
    this.prevNumber = enableInfiniteLoop ? 1 : 0;
    this.dotsData = {};
    this.carouselContainerDom = carouselContainerDom;
    this.carouselDoms = this.carouselContainerDom.children;
    this.uiCarouselCount = this.carouselDoms.length;
    this.logicCarouselCount = this.uiCarouselCount;
    this.enableInfiniteLoop = enableInfiniteLoop;
    this.pivotContainerDom = pivotContainerDom;
    this.transitionTime = parseInt(transitionTime, 10) || 300;
    this.loopTime = parseInt(loopTime, 10) || 2000;

    if (enableInfiniteLoop) {
      this.logicCarouselCount = this.uiCarouselCount + 2;
      this.prepareInfiniteLoop();
    }
    this.widthPerCarousel = 100 / this.logicCarouselCount;

    if (pivotContainerDom) {
      this.pivots = pivotContainerDom.children;
      addClass(this.pivots[0], "is-active");
    }

    this.createPanel(enableDot, enableArrow, this.uiCarouselCount)
      .setDefaultStyle()
      .bindEvent(supportMobile);
  }
  prepareInfiniteLoop() {
    this.carouselContainerDom.insertAdjacentElement(
      "afterbegin",
      this.carouselDoms[this.uiCarouselCount - 1].cloneNode(true)
    );
    this.carouselContainerDom.insertAdjacentElement(
      "beforeend",
      this.carouselDoms[1].cloneNode(true)
    );
  }
  createPanel(enableDot, enableArrow, carouselCount) {
    this.panelContainer = this.context.createElement("div");

    this.panelContainer.setAttribute(
      "class",
      "ouoCarousel-panel js-ouoCarousel-panel"
    );

    if (enableDot) {
      this.dotsData = this._createDotData(carouselCount);
      this.panelContainer.appendChild(this.dotsData.dotsContainer);
    }

    if (enableArrow) {
      this.panelContainer.appendChild(this._createArrowsDom());
    }

    this.carouselContainerDom.parentNode.appendChild(this.panelContainer);
    return this;
  }
  setDefaultStyle() {
    const {
      carouselContainerDom,
      carouselDoms,
      logicCarouselCount,
      widthPerCarousel,
      enableInfiniteLoop,
      currentNumber
    } = this;

    Array.prototype.map.call(carouselDoms, (dom, i) => {
      dom.className += " ouoCarousel-carousel";
    });

    carouselContainerDom.style.width = logicCarouselCount * 100 + "%";

    Array.prototype.map.call(carouselDoms, (dom, i) => {
      dom.style.width = widthPerCarousel + "%";
    });

    this._changeFigure(currentNumber, widthPerCarousel, false);
    return this;
  }
  bindEvent(supportMobile) {
    this.setTimeId = setInterval(this._autoLoop.bind(this), this.loopTime);

    this.carouselContainerDom.addEventListener("click", () =>
      clearInterval(this.setTimeId)
    );

    this.panelContainer.addEventListener(
      "click",
      this._handleChangeFigure.bind(this)
    );
    if (this.pivotContainerDom) {
      this.pivotContainerDom.addEventListener(
        "mouseover",
        this._handleChangeFigure.bind(this)
      );
    }
    if (supportMobile) {
      this.carouselContainerDom.parentNode.addEventListener(
        "touchstart",
        this._handleTouchStart.bind(this),
        false
      );
      this.carouselContainerDom.parentNode.addEventListener(
        "touchmove",
        this._handleTouchMove.bind(this),
        false
      );
      this.carouselContainerDom.parentNode.addEventListener(
        "touchend",
        this._handleTouchEnd.bind(this),
        false
      );
    }
  }
  _autoLoop() {
    this.prevNumber = this.currentNumber;

    if (this.enableInfiniteLoop) {
      this.currentNumber++;
      this._changeFigure(this.currentNumber, this.widthPerCarousel, true);

      if (this.currentNumber === 0) {
        this.currentNumber = this.logicCarouselCount - 2;
        setTimeout(() => {
          this._changeFigure(this.currentNumber, this.widthPerCarousel, false);
        }, this.transitionTime);
      }
    } else {
      if (this.currentNumber === this.logicCarouselCount - 1) {
        this.currentNumber = 0;
      } else {
        this.currentNumber++;
      }
      this._changeFigure(this.currentNumber, this.widthPerCarousel, true);
    }

    this._setElementActiveState(
      this.dotsData.dotsDom,
      this.prevNumber,
      this.currentNumber
    );
    this._setElementActiveState(
      this.pivots,
      this.prevNumber,
      this.currentNumber
    );
  }
  _createArrowsDom() {
    let arrowsContainer = this.context.createDocumentFragment();
    let prev = this.context.createElement("span");
    let next = this.context.createElement("span");

    prev.setAttribute("data-block", "prev");
    prev.setAttribute("class", "ouoCarousel-prev");
    next.setAttribute("data-block", "next");
    next.setAttribute("class", "ouoCarousel-next");

    arrowsContainer.appendChild(prev);
    arrowsContainer.appendChild(next);

    return arrowsContainer;
  }
  _createDotData(count) {
    let dotsContainer = this.context.createElement("div");
    dotsContainer.setAttribute("class", "ouoCarousel-dots");
    let dotsDom = [];
    for (let i = 0; i < count; i++) {
      let dot = this.context.createElement("span");
      dot.setAttribute("data-block", i);

      if (i === 0) {
        dot.setAttribute(
          "class",
          "ouoCarousel-dot js-ouoCarousel-dot is-active"
        );
      } else {
        dot.setAttribute("class", "ouoCarousel-dot js-ouoCarousel-dot");
      }

      dotsDom.push(dot);
      dotsContainer.appendChild(dot);
    }
    return { dotsDom, dotsContainer };
  }
  _handleTouchStart(evt) {
    clearInterval(this.setTimeId);
    this.hasMoved = false;
    this.prevTransform =
      this.carouselContainerDom.style.transform || "translate3d(0, 0, 0)";
    this.firstClientX = evt.touches[0].clientX;
  }
  _handleTouchMove(evt) {
    this.hasMoved = true;
    this.latestClientX = evt.touches[0].clientX;
    let offset = this.latestClientX - this.firstClientX;
    offset = this.currentOffset - offset;
    this.carouselContainerDom.style.transition = "none";
    this.carouselContainerDom.style.transform = `translate3d(-${offset}px, 0, 0)`;
  }
  _handleTouchEnd(evt) {
    evt.stopPropagation();
    const moveOffset = this.latestClientX - this.firstClientX;
    if (
      this.hasMoved &&
      moveOffset < -50 &&
      this.currentNumber !== this.carouselDoms.length - 1
    ) {
      this.prevNumber = this.currentNumber++;
      this._changeFigure(this.currentNumber, this.widthPerCarousel, true);
      this._setElementActiveState(
        this.dotsData.dotsDom,
        this.prevNumber,
        this.currentNumber
      );
    } else if (this.hasMoved && moveOffset > 50 && this.currentNumber !== 0) {
      this.prevNumber = this.currentNumber--;
      this._changeFigure(this.currentNumber, this.widthPerCarousel, true);
      this._setElementActiveState(
        this.dotsData.dotsDom,
        this.prevNumber,
        this.currentNumber
      );
    } else {
      this.carouselContainerDom.style.transform = this.prevTransform;
    }
    if (this.enableInfiniteLoop) {
      this._infinitePositionReset();
    }
  }
  _setElementActiveState(elementDoms, prevNumber, currentNumber) {
    if (elementDoms && elementDoms.length === this.uiCarouselCount) {
      if (this.enableInfiniteLoop) {
        const prevIndex = (prevNumber - 1) % this.uiCarouselCount;
        removeClass(elementDoms[prevIndex], "is-active");
        if (currentNumber === 0) {
          addClass(elementDoms[this.uiCarouselCount - 1], "is-active");
        } else {
          addClass(
            elementDoms[(currentNumber - 1) % this.uiCarouselCount],
            "is-active"
          );
        }
      } else {
        removeClass(elementDoms[prevNumber], "is-active");
        addClass(elementDoms[currentNumber], "is-active");
      }
    }
  }
  _changeFigure(offsetCount, witdh, animation) {
    if (animation) {
      this.carouselContainerDom.style.transition = `${
        this.transitionTime
      }ms ease-in-out`;
    } else {
      this.carouselContainerDom.style.transition = "0s";
    }
    this.currentOffset =
      witdh * offsetCount * this.carouselContainerDom.clientWidth * 0.01;
    this.carouselContainerDom.style.transform = `translate3d( -${
      this.currentOffset
    }px, 0, 0)`;
  }
  // 為了動畫效果，計算圖片數並設定容器寬度
  _handleChangeFigure(evt) {
    clearInterval(this.setTimeId);
    const target = evt.target.getAttribute("data-block");

    if (target) {
      this.prevNumber = this.currentNumber;
      switch (target) {
        case "prev":
          this.currentNumber =
            this.currentNumber === 0 ? 0 : this.currentNumber - 1;
          break;
        case "next":
          this.currentNumber =
            this.currentNumber === this.logicCarouselCount - 1
              ? this.logicCarouselCount - 1
              : this.currentNumber + 1;
          break;
        default:
          this.currentNumber = this.enableInfiniteLoop
            ? parseInt(target, 10) + 1
            : parseInt(target, 10);
          break;
      }
      this._changeFigure(this.currentNumber, this.widthPerCarousel, true);
      this._setElementActiveState(
        this.dotsData.dotsDom,
        this.prevNumber,
        this.currentNumber
      );
      this._setElementActiveState(
        this.pivots,
        this.prevNumber,
        this.currentNumber
      );
      if (this.enableInfiniteLoop) {
        this._infinitePositionReset();
      }
    }
  }
  _infinitePositionReset() {
    if (this.currentNumber === 0) {
      this.currentNumber = this.uiCarouselCount;
      setTimeout(() => {
        this._changeFigure(this.currentNumber, this.widthPerCarousel, false);
      }, this.transitionTime);
    } else if (this.currentNumber === this.logicCarouselCount - 1) {
      this.currentNumber = 1;
      setTimeout(() => {
        this._changeFigure(this.currentNumber, this.widthPerCarousel, false);
      }, this.transitionTime);
    }
  }
}
