import "./OuoCarousel.scss";

export default class OuoCarousel {
  constructor({
    context = document,
    carouselContainerDom,
    supportMobile = true,
    enableAutoloop = true,
    enableDot = true,
    enableArrow = true
  }) {
    this.context = context;
    this.currentNumber = 0;
    this.prevNumber = 0;
    this.dotsData = {};
    this.carouselContainerDom = carouselContainerDom;
    this.carouselDoms = this.carouselContainerDom.children;
    this.carouselCount = this.carouselDoms.length;

    this.widthPerCarousel = 100 / this.carouselCount;

    this.createPanel(enableDot, enableArrow, this.carouselCount).then(
      () => {
        this.setDefaultStyle(
          this.carouselContainerDom,
          this.carouselDoms,
          this.carouselCount,
          this.widthPerCarousel
        );
        this.bindEvent(supportMobile);
      }
    );
    // this.setDefaultStyle();
  }
  bindEvent(supportMobile) {
    this.setTimeId = setInterval(this._autoLoop.bind(this), 3000);
    
    this.carouselContainerDom.addEventListener("click", () =>
      clearInterval(this.setTimeId)
    );

    this.panelContainer.addEventListener(
      "click",
      this._handleChangeFigure.bind(this)
    );

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

    if (this.currentNumber === this.carouselDoms.length - 1) {
      this.currentNumber = 0;
    } else {
      this.currentNumber++;
    }

    this._changeFigure(this.currentNumber, this.widthPerCarousel, true);

    this._setDotState(this.dotsData.dotsDom, this.prevNumber, this.currentNumber);
  }
  _createArrowsDom() {
    return new Promise((resolve, reject) => {
      try {
        let arrowsContainer = this.context.createDocumentFragment();
        let prev = this.context.createElement("span");
        let next = this.context.createElement("span");

        prev.setAttribute("data-block", "prev");
        prev.setAttribute("class", "ouoCarousel-prev");
        next.setAttribute("data-block", "next");
        next.setAttribute("class", "ouoCarousel-next");

        arrowsContainer.appendChild(prev);
        arrowsContainer.appendChild(next);

        resolve(arrowsContainer);
      } catch (e) {
        reject(e);
      }
    });
  }
  _createDotData(count) {
    return new Promise((resolve, reject) => {
      try {
        let dotsContainer = this.context.createElement("div");
       dotsContainer.setAttribute('class', 'ouoCarousel-dots')
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

        resolve({ dotsDom, dotsContainer });
      } catch (e) {
        reject(e);
      }
    });
  }
  _handleTouchStart(evt) {
    clearInterval(this.setTimeId);
    this.flag = false;
    this.prevTransform =
      this.carouselContainerDom.style.transform || `translate3d(0, 0, 0)`;
    this.firstClientX = evt.touches[0].clientX;
  }
  _handleTouchMove(evt) {
    this.flag = true;
    this.latestClientX = evt.touches[0].clientX;
    let offset = this.latestClientX - this.firstClientX;
    offset = this.currentOffset - offset;
    this.carouselContainerDom.style.transition = "none";
    this.carouselContainerDom.style.transform = `translate3d(-${offset}px, 0, 0)`;
  }
  _handleTouchEnd(evt) {
    evt.stopPropagation();
    if (
      this.flag &&
      this.latestClientX - this.firstClientX < -50 &&
      this.currentNumber !== this.carouselDoms.length - 1
    ) {
      this.prevNumber = this.currentNumber++;
      this._changeFigure(this.currentNumber, this.widthPerCarousel, true);
      this._setDotState(this.dotsData.dotsDom, this.prevNumber, this.currentNumber);
    } else if (
      this.flag &&
      this.latestClientX - this.firstClientX > 50 &&
      this.currentNumber !== 0
    ) {
      this.prevNumber = this.currentNumber--;
      this._changeFigure(this.currentNumber, this.widthPerCarousel, true);
      this._setDotState(this.dotsData.dotsDom, this.prevNumber, this.currentNumber);
    } else {
      this.carouselContainerDom.style.transform = this.prevTransform;
    }
  }
  _setDotState(dotsDom,prevNumber,currentNumber) {
    dotsDom[prevNumber].className = dotsDom[
      prevNumber
    ].className.replace(" is-active", "");

    dotsDom[currentNumber].className += " is-active";
  }
  _changeFigure(offsetCount, witdh, animation) {
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
            this.currentNumber === this.carouselCount - 1
              ? this.carouselCount - 1
              : this.currentNumber + 1;
          break;
        default:
          this.currentNumber = parseInt(target, 10);
          break;
      }
      this._changeFigure(this.currentNumber, this.widthPerCarousel, true);
      this._setDotState(this.dotsData.dotsDom, this.prevNumber, this.currentNumber);
    }
  }
  createPanel(enableDot, enableArrow, carouselCount) {
    return new Promise((resolve, reject) => {
      try {
        this.panelContainer = this.context.createElement("div");

        this.panelContainer.setAttribute(
          "class",
          "ouoCarousel-panel js-ouoCarousel-panel"
        );

        if (enableDot) {
          this.dotsData = this._createDotData(carouselCount)
            .then(dotsData => {
              this.dotsData = dotsData;
              this.panelContainer.appendChild(dotsData.dotsContainer);
            })
            .catch();
        }

        if (enableArrow) {
          let arrowsDom;

          this._createArrowsDom()
            .then(arrowsDom => this.panelContainer.appendChild(arrowsDom))
            .catch();
        }

        this.carouselContainerDom.parentNode.append(this.panelContainer);
        resolve();
      } catch (e) {
        reject(e);
      }
    });
  }
  setDefaultStyle(
    carouselContainerDom,
    carouselDoms,
    carouselCount,
    widthPerCarousel
  ) {
    Array.prototype.map.call(carouselDoms, (dom, i) => {
      dom.className += " ouoCarousel-carousel";
    });

    carouselContainerDom.style.width = carouselCount * 100 + "%";

    Array.prototype.map.call(carouselDoms, (dom, i) => {
      dom.style.width = widthPerCarousel + "%";
    });

    widthPerCarousel = carouselDoms[0].clientWidth;
  }
}

/*
設定值：
{
  supportMobile: true,
  enableAutoloop: true,
  enableArrow: true,
  enableDot: true,
  carouselContainerDom,
}
定義動作：
1. 製造元素 / 加上 class
2. 設定寬度
3. autoloop
4. 



*/
