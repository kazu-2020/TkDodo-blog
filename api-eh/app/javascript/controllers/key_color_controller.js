import {Controller} from "@hotwired/stimulus"
import ColorThief from "colorthief"

export default class extends Controller {
  static targets = ["image"]

  connect() {
    const colorThief = new ColorThief();
    const img = this.imageTarget;
    img.crossOrigin = 'Anonymous';
    img.addEventListener('load', () => {
      const color = colorThief.getColor(img);
      this.element.style.backgroundColor = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
    });
  }
}
