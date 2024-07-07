export default class DiagramChart extends HTMLElement {
  static template = document.createElement("template");
  static observedAttributes = ["data-pieces", "dimention"];

  data = [];
  dimention = 200;
  centerDiametr = 10;

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  _render() {
    console.log("render");
    this.center = this.dimention / 2;
    this.shadowRoot.innerHTML = "";
    this.shadowRoot.append(DiagramChart.template.content.cloneNode(true));

    this.style.width = this.dimention + "px";
    this.style.height = this.dimention + "px";
    this.style.display = "block";

    if (this.data?.length) {
      let rotation = 0;
      this.data.forEach(({ percent, radiusPercent, color }) => {
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

  /**
   * @param {string} d
   */
  set dataPieces(d) {
    this.setAttribute("dataPieces", d);
    this.data = JSON.parce(d);
  }

  attributeChangedCallback(name, oldValue, newValue) {
    console.log("attributeChangedCallback", name);
    if (name === "data-pieces" && newValue) {
      this.data = JSON.parse(newValue) ?? [];
      this._render();
    } else if (name === "dimention" && newValue && oldValue !== newValue) {
      this.dimention = newValue;
      this.style.width = this.dimention + "px";
      this.style.height = this.dimention + "px";
      this._render();
    }
  }
}

DiagramChart.template.innerHTML = `
        <style>
            :host {
                position:relative;
                border-radius: 50%;
                background-color: white;
            }

            div {
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
`;
customElements.define("diagram-chart", DiagramChart);
