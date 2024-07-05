export default class Diagram {
  _element = null;

  constructor(data = [], dimention = 200) {
    this.data = data;
    this.dimention = dimention;
    this.center = dimention / 2;
    this._render();
  }

  _render() {
    const wrap = document.createElement("div");
    wrap.innerHTML = this._getTemplate();
    this._element = wrap.firstElementChild;
    this._element.style.width = this.dimention + "px";
    this._element.style.height = this.dimention + "px";

    let rotation = 0;
    this.data.forEach(({ percent, radiusPercent, color }) => {
      this._element.append(
        this._makePiece(
          rotation,
          percent,
          Math.round(this.center * radiusPercent),
          color
        )
      );
      rotation += percent;
    });
  }

  _getTemplate() {
    return `<div class="diagram" ><div class="diagram__center"></div></div>`;
  }

  _makePiece(rotation, percent, radius = this.center, color) {
    const piece = document.createElement("div");
    piece.classList.add("diagram__chart");
    piece.style.setProperty(
      "--rotation",
      Math.round((rotation * 360) / 100) + "deg"
    );
    piece.style.setProperty("--value", percent + "%");
    piece.style.setProperty("--dimention", 2 * radius + "px");
    piece.style.setProperty("--color", color);
    piece.style.setProperty("--shift", this.center - radius + "px");
    return piece;
  }

  updateData(newData = this.data) {}

  remove() {
    if (this.element) this.element.remove();
  }

  destroy() {
    this.remove();
    this._element = null;
  }

  get element() {
    return this._element;
  }
}
