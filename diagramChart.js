export default class DiagramChart extends HTMLElement {
  static template = document.createElement("template");
  data = [];
  dimention = 200;

  constructor() {
    super();

    this.data = JSON.parse(this.dataset.pieces) ?? [];
    this.dimention = this.getAttribute("dimention") ?? this.dimention;
    this.center = this.dimention / 2;
    this._render();
  }

  _render() {
    this.attachShadow({ mode: "open" });
    this.shadowRoot.append(DiagramChart.template.content.cloneNode(true));

    this.style.width = this.dimention + "px";
    this.style.height = this.dimention + "px";

    let rotation = 0;
    this.data.forEach(({ percent, radiusPercent, color }) => {
      console.log("first", { percent, radiusPercent, color });
      this.shadowRoot.append(
        DiagramChart.makePiece(
          rotation,
          percent,
          color,
          Math.round(this.center * radiusPercent),
          this.center
        )
      );
      rotation += percent;
    });
  }

  static makePiece(rotation, percent, color, radius, center) {
    const piece = document.createElement("div");
    piece.style.setProperty(
      "--rotation",
      Math.round((rotation * 360) / 100) + "deg"
    );
    piece.style.setProperty("--value", percent + "%");
    piece.style.setProperty("--dimention", 2 * radius + "px");
    piece.style.setProperty("--color", color);
    piece.style.setProperty("--shift", center - radius + "px");
    return piece;
  }

  get dimention() {
    this.getAttribute("dimention");
  }
  /**
   * @param {number} d
   */
  set dimention(d) {
    this.setAttribute("dimention", d);
  }

  /**
   * @param {string} d
   */
  set dataPieces(d) {
    this.setAttribute("dataPieces", d);
    this.data = JSON.parce(d);
  }
}

DiagramChart.observedAttributes = ["data-pieces", "dimention"];
DiagramChart.template.innerHTML = `
        <style>
            :host {
                position:relative;
                border-radius: 50%;
                background-color: white;
            }

            div#center {
                border-radius: 50%;
                width: 10%;
                height: 10%;
                position: absolute;
                left: 45%;
                top: 45%;
                background-color: black;
                z-index: 2;
            } 

            div:not(#center) {
                position: absolute;
                border-radius: 50%;

                --shift: 0;
                --dimention: 200px;
                --value: 25%;
                --color: black;
                --centered: 0px;
                --rotation: 0;
                width: var(--dimention);
                height: var(--dimention);
                background: conic-gradient(var(--color) var(--value), transparent 0);
                transform-origin: center;
                transform: translateX(var(--shift)) translateY(var(--shift))
                    rotate(var(--rotation));
                z-index: 1;
            }
        </style>
        <div id='center'></div>
`;
customElements.define("diagram-chart", DiagramChart);
