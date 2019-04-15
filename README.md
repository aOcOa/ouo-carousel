## Intro

This is a basic js carousel written in vanilla js

## Usage
- Initialize a carousel:
    
  `initHtml`: the HTML inside modal

  `closeBtnClass`: close button class for custom button

  `carouselContainerDom`: the carousel container

  `supportMobile`(optional): whether to support touch event / `default:true`

  `enableAutoloop(optional)`: whether to support auto looping / `default:true`

  `pivotContainerDom(optional)`: whether to support custom pivots for mouseover / touch event

  `enableDot(optional)`: whether to generate indicated dots / `default:true`,

  `enableArrow(optional)`: whether to generate next/previous arrows / `default:true`,

  `enableInfiniteLoop(optional)`: whether to enable infinite looping / `default:false`,

  `transitionTime(optional)`: transition time for carousel changing / `default:300,`

  `loopTime(optional)`: time for auto loop / `default:2000`

  ```
  HTML
    <div class="ouoCarousel">
      <div id="carousel">
        <div class="o-custom-carouselElement"><p class="o-custom-text">HELLO</p></div>
        <div class="o-custom-carouselElement"><p class="o-custom-text">THIS IS</p></div>
        <div class="o-custom-carouselElement"><p class="o-custom-text">A</p></div>
        <div class="o-custom-carouselElement"><p class="o-custom-text">CAROUSEL</p></div>
      </div>
    </div>

    <!-- for pivot, add `data-block` attribute -->
    <div class="pivots" id="pivots">
      <span class="pivots-element" data-block="0">pivot 1</span>
      <span class="pivots-element" data-block="1">pivot 2</span>
      <span class="pivots-element" data-block="2">pivot 3</span>
      <span class="pivots-element" data-block="3">pivot 4</span>
    </div>
  ```
  ```
  JS
    const carousel = new OuoCarousel({
      carouselContainerDom: document.getElementById("carousel"),
      supportMobile: true,
      enableInfiniteLoop: false,
      pivotContainerDom: document.getElementById("pivots")
    });
  ```
