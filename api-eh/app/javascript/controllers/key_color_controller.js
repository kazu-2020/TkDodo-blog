import {Controller} from "@hotwired/stimulus"
import ColorThief from "colorthief"

export default class extends Controller {
  static targets = ["image"]

  connect() {
    const colorThief = new ColorThief();
    const img = this.imageTarget;
    let googleProxyURL = 'https://images1-focus-opensocial.googleusercontent.com/gadgets/proxy?container=focus&refresh=2592000&url=';
    img.crossOrigin = 'Anonymous';
    img.src = googleProxyURL + encodeURIComponent(img.src);
    img.addEventListener('load', () => {
      this.element.style.backgroundColor = colorThief.getColor(img);
    });
  }
}
