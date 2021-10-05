import {Controller} from "@hotwired/stimulus"
import ColorThief from "colorthief"

export default class extends Controller {
  static targets = ["image"]

  connect() {
    const colorThief = new ColorThief();
    const img = this.imageTarget;
    img.crossOrigin = 'Anonymous';

    if (img.complete) {
      this.element.style.backgroundColor = colorThief.getColor(img);
    } else {
      image.addEventListener('load', function() {
        this.element.style.backgroundColor = colorThief.getColor(img);
      });
    }
  }
}
