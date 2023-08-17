export default class Diagram {
  SHIFT = 25;
  _element = null;

  constructor(data = [], dimention = 200) {
    this.data = data;
    this.dimention = dimention;
    this.center = dimention / 2;
    this.maxRadius = (dimention / 2) * 0.9;
    this._render();
  }

  _render() {
    const wrap = document.createElement("svg");
    wrap.innerHTML = this._getTemplate();
    this._element = wrap.firstElementChild;
  }

  _getTemplate() {
    let start = 0;
    const pieces = this.data.map(({ p, r }) => {
      const result = [start, start + p, Math.min(this.maxRadius, r)];
      start += p;
      return result;
    });

    console.log(pieces);
    return `
      <svg viewBox="0 0 ${this.dimention} ${this.dimention}" class="diagram">
      ${pieces.map((item) => this._makePiece(...item))}
      <circle r="${this.dimention * 0.05}" cx="50%" cy="50%"></circle>
    </svg>
      `;
  }

  _getCirclePoint(percent = null, radius = this.maxRadius) {
    const corner = ((percent + this.SHIFT) * 3.6) / 57.3; // radian
    const x = this.center - Math.cos(corner) * radius;
    const y = this.center - Math.sin(corner) * radius;
    return `${x},${y}`;
  }

  _makePiece(start, end = 0, radius = this.maxRadius) {
    if (typeof start !== "number") return "";
    const startCoords = this._getCirclePoint(start, radius);
    const endCoords = this._getCirclePoint(Math.min(100, end), radius);
    return ` <path d="M${this.center},${this.center} L${startCoords} A90,90 0 0,1 ${endCoords} Z"></path>`;
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
