import {Controller} from "@hotwired/stimulus"
import ColorThief from "colorthief"

export default class extends Controller {
  static targets = ["image", "setBackgroundColor"]

  connect() {
    const colorThief = new ColorThief();
    const img = this.imageTarget;
    img.crossOrigin = 'Anonymous';
    img.addEventListener('load', () => {
      const color = colorThief.getColor(img);
      this.setBackgroundColorTargets.forEach((target) => {
        const opacity = target.dataset.opacity || '1.0'
        target.style.backgroundColor = `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${opacity})`;
      })
    });
  }
}
