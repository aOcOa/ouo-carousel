function removeClass(dom, className) {
  if (!dom) {
    return;
  }
  if (dom.className.indexOf(` ${className}`) !== -1) {
    dom.className = dom.className.replace(` ${className}`, "");
  }
  if (dom.className.indexOf(className) !== -1) {
    dom.className = dom.className.replace(className, "");
  }
}

function addClass(dom, className) {
  if (!dom) {
    return;
  }
  if (dom.className.indexOf(className) === -1) {
    dom.className += ` ${className}`;
  }
}

function toggleClass(dom, className) {
  if (!dom) {
    return;
  }
  if (dom.className.indexOf(className) !== -1) {
    dom.className = dom.className.replace(className, "");
  } else {
    dom.className += ` ${className}`;
  }
}

export { removeClass, addClass, toggleClass };
