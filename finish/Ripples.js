export default class {
  constructor(config) {
    this.rippleEnd = false;
    this.els = config.els;
    this.options = config.options;
    this.elementData = {
      size: 0,
      color: this.options.color,
      transition: this.options.transition,
      halfWidth: 0,
      halfHeight: 0,
      touchData: {
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      },
    };
    this.els.forEach((element) => {
      element.addEventListener("pointerdown", (event) => {
        this.start(event);
      });
      element.addEventListener("mouseup", () => {
        this.end();
      });
      element.addEventListener("touchend", () => {
        this.end();
      });
    });
  }
  start(event) {
    this.setElementSize(event.target);
    this.elementData.halfWidth = event.target.offsetWidth / 2;
    this.elementData.halfHeight = event.target.offsetHeight / 2;
    this.rippleTimeout = setTimeout(() => {
      this.rippleEnd = true;
    }, this.elementData.transition);
    this.create(event);
  }
  setElementSize(element) {
    const width = Number(
      window
        .getComputedStyle(element)
        .getPropertyValue("width")
        .replace(/px/gi, "")
    );
    const height = Number(
      window
        .getComputedStyle(element)
        .getPropertyValue("height")
        .replace(/px/gi, "")
    );
    this.elementData.size =
      Math.sqrt(Math.pow(width, 2) + Math.pow(height, 2)) / 4;
  }
  create(event) {
    const span = document.createElement("span");
    span.classList.add("ripple");
    event.target.appendChild(span);
    this.setTouchData(event);
    span.style.top = `${
      this.elementData.touchData.top - this.elementData.size / 2
    }px`;
    span.style.left = `${
      this.elementData.touchData.left - this.elementData.size / 2
    }px`;
    span.style.willChange = "transform border-radius width height top left";
    span.style.backgroundColor = this.elementData.color;
    span.style.transform = `scale(${
      this.getScaleRipple() / (this.elementData.size / 2)
    })`;
    span.style.width = `${this.elementData.size}px`;
    span.style.height = `${this.elementData.size}px`;
    span.style.borderRadius = "100%";
    span.style.position = "absolute";
    span.style.pointerEvents = "none";
    span.style.opacity = "1";
    span.style.transition = `opacity linear ${this.elementData.transition}ms, transform linear ${this.elementData.transition}ms`;
  }
  setTouchData(event) {
    this.elementData.touchData.top = Number(
      Math.abs(event.target.getBoundingClientRect().top - event.clientY)
    );
    this.elementData.touchData.left = Number(
      Math.abs(event.target.getBoundingClientRect().left - event.clientX)
    );
    this.elementData.touchData.right = Number(
      Math.abs(event.target.getBoundingClientRect().right - event.clientX)
    );
    this.elementData.touchData.bottom = Number(
      Math.abs(event.target.getBoundingClientRect().bottom - event.clientY)
    );
  }
  getFormula() {
    return {
      a: Math.sqrt(
        this.elementData.touchData.bottom ** 2 +
          this.elementData.touchData.right ** 2
      ),
      b: Math.sqrt(
        this.elementData.touchData.bottom ** 2 +
          this.elementData.touchData.left ** 2
      ),
      c: Math.sqrt(
        this.elementData.touchData.top ** 2 +
          this.elementData.touchData.right ** 2
      ),
      d: Math.sqrt(
        this.elementData.touchData.top ** 2 +
          this.elementData.touchData.left ** 2
      ),
    };
  }
  getScaleRipple() {
    return this.elementData.touchData.top <= this.elementData.halfHeight &&
      this.elementData.touchData.left <= this.elementData.halfWidth
      ? this.getFormula().a
      : this.elementData.touchData.top < this.elementData.halfHeight &&
        this.elementData.touchData.left > this.elementData.halfWidth
      ? this.getFormula().b
      : this.elementData.touchData.top > this.elementData.halfHeight &&
        this.elementData.touchData.left < this.elementData.halfWidth
      ? this.getFormula().c
      : this.elementData.touchData.top > this.elementData.halfHeight &&
        this.elementData.touchData.left > this.elementData.halfWidth
      ? this.getFormula().d
      : this.getFormula().d;
  }
  end() {
    const span = document.querySelectorAll(".ripple");
    span.forEach((ripple) => {
      if (this.rippleEnd) {
        ripple.style.opacity = "0";
        ripple.style.transition = `opacity linear ${this.elementData.transition}ms`;
        ripple.addEventListener("transitionend", () => {
          ripple.remove();
        });
      } else {
        setTimeout(() => {
          ripple.style.opacity = "0";
          ripple.style.transition = `opacity linear ${this.elementData.transition}ms`;
          ripple.addEventListener("transitionend", () => {
            ripple.remove();
          });
        }, this.elementData.transition);
      }
      clearTimeout(this.rippleTimeout);
      this.rippleEnd = false;
    });
  }
}
