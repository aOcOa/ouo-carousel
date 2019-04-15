const { describe, it, before, after, done } = require("mocha");
const { expect } = require("chai");
const { JSDOM } = require("jsdom");
import Carousel from "../../src/OuoCarousel.js";
import { doesNotReject } from "assert";
const dom = new JSDOM /*options or whatever*/();
global.window = dom.window;
global.document = dom.document;

var chai = require("chai");
chai.use(require("chai-dom"));
const rootDom = new JSDOM(`<!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <meta http-equiv="X-UA-Compatible" content="ie=edge"/>
        <title>TEST</title>
      </head>
      <body>
        <div class="ouoCarousel">
          <div id="sleepy">
            <div class="o-custom-carouselElement"><p class="o-custom-text">HELLO</p></div>
            <div class="o-custom-carouselElement"><p class="o-custom-text">THIS IS</p></div>
            <div class="o-custom-carouselElement"><p class="o-custom-text">A</p></div>
            <div class="o-custom-carouselElement"><p class="o-custom-text">CAROUSEL</p></div>
          </div>
      </div>
      </body>
      </html>`);
let carousel;
let originalCarousel = rootDom.window.document.getElementById("sleepy").children.length;

document = rootDom.window.document;

describe("carousel", () => {
  before(() => {
    carousel = new Carousel({
      carouselContainerDom: document.getElementById("sleepy"),
      supportMobile: true,
      enableAutoloop: true,
      enableDot: true,
      enableArrow: true,
      context: document
    });
  });

  it("generate dots properly", () => {
    const doms = document.getElementsByClassName(
      "ouoCarousel-dot"
    );
    expect(doms.length).is.equal(originalCarousel);
  });

  it("generate next arrow properly", () => {
    const next = document.getElementsByClassName("ouoCarousel-prev");
    expect(next).is.not.empty;
  });

  it("generate prev arrow properly", () => {
    const prev = document.getElementsByClassName("ouoCarousel-prev");
    expect(prev).is.not.empty;
  });

  it("event: autoloop: change currentNumber", (done) => {
    
    let currentNumber1 = carousel.currentNumber;
    setTimeout(() => {
      const currentNumber2 = carousel.currentNumber;
      expect(currentNumber1).is.equal(currentNumber2 - 1);
      done();
    }, 3000);
  });
  it("event: autoloop: change dot", done => {
    const dotsDom = document.getElementsByClassName("ouoCarousel-dot");
    setTimeout(() => {
      const hasActive = dotsDom[2].className.indexOf("is-active");
      expect(hasActive).not.equal(-1);
      done();
    }, 3000);
  });
});
