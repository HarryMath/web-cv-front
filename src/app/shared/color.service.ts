import {Injectable} from '@angular/core';

export interface RGB {
  r: number;
  g: number;
  b: number;
}

export interface HSL {
  h: number;
  s: number;
  l: number;
}


export interface IPalette {
  dominantLight: HSL,
  dominantDark: HSL
}

@Injectable({providedIn: 'root'})
export class ColorService {

  public defaultColors: IPalette = {
    dominantDark: {h: 240, s: 14, l: 15},
    dominantLight: {h: 240, s: 11, l: 40}
  }

  async getPalette(imageURL: string): Promise<IPalette> {
    return new Promise(resolve => {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext && canvas.getContext('2d');
      if (typeof Worker == 'undefined' || !context) {
        resolve(this.defaultColors);
        return;
      }
      const imageElement = new Image();
      imageElement.crossOrigin = 'Anonymous';
      imageElement.src = imageURL;
      imageElement.onload = (): void => {
        context.drawImage(imageElement, 0, 0);
        const height = canvas.height = imageElement.naturalHeight || 240;
        const width = canvas.width = imageElement.naturalWidth || 240;
        context.fillStyle = 'rgb(249,250,254)';
        context.fillRect(0, 0, width, height);
        context.drawImage(imageElement, 0, 0);
        const data = context.getImageData(0, 0, width, height);
        // const worker = new Worker(new URL('./image.worker', import.meta.url));
        const worker = new Worker(new URL('http://localhost:4200/assets/image.worker.js'));
        worker.postMessage(data);
        worker.onmessage = ({data}) => {
          if (data && data.dominantDark) {
            resolve(data as IPalette);
          } else {
            resolve(this.defaultColors);
          }
        }
      }
    });
  }

  createGray(c: HSL): HSL {
    const l = c.l > 40 ? c.l - 20 : c.l + 15;
    return {
      h: c.h,
      s: c.s / (1.1 + (90 - l) * 0.02),
      l
    };
  }

  isTransparent(r: number, g: number, b: number): boolean {
    return r >= 248 && r <= 250 &&
      g >= 249 && g <= 251 &&
      b >= 253 && g <= 255;
  }

  generateHSL(text: string): HSL {
    const t = text.toLowerCase();
    let hSum = 0;
    for (let i = 0; i < t.length; i++) {
      hSum += t.charCodeAt(i);
    }
    const h = Math.abs(t.charCodeAt(0) + hSum) % 361;
    const s = Math.abs(30 + (( t.charCodeAt(0) + t.charCodeAt(t.length - 1) ) % 120) / 120 * (90 - 40)) % 91;
    const l = Math.abs(45 + (( t.charCodeAt(2) * 2 + t.charCodeAt(0) ) % (123 - 95)) / (123 - 95) * (95 - 75)) % 96;
    return {h, s, l};
  }

  isGray(c: RGB, grayScale: number = 30): boolean {
    const rR = Math.floor(c.r / grayScale);
    const rG = Math.floor(c.g / grayScale);
    const rB = Math.floor(c.b / grayScale);
    return rR === rG && rG === rB;
  }

  getLightness(rgb: RGB): number {
    return Math.hypot(rgb.r, rgb.g, rgb.b) / 255;
  }

  rgbaToHsla(rgba: RGB): HSL {
    const r = rgba.r / 255;
    const g = rgba.g / 255;
    const b = rgba.b / 255;
    const cmin = Math.min(r, g, b);
    const cmax = Math.max(r, g, b);
    const delta = cmax - cmin;
    let h: number;
    let s: number;
    let l: number;
    if (delta === 0) {
      h = 0;
    }
    else if (cmax === r) { h = ((g - b) / delta) % 6; }
    else if (cmax === g) { h = (b - r) / delta + 2; }
    else { h = (r - g) / delta + 4; }
    h = Math.round(h * 60);
    if (h < 0) { h += 360; }
    l = (cmax + cmin) / 2;
    s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
    s = +(s * 100).toFixed(1);
    l = +(l * 100).toFixed(1);
    return {h, s, l};
  }

  exchangeColor(hsla: HSL, isLight: boolean, power: number): HSL {
    if (isLight) {
      hsla.s = hsla.s * (1 + power) + 2 * power;
      hsla.l = (hsla.l + 100 * power) / (1 + power);
    } else {
      hsla.s = hsla.s * ((1 + power * 0.5) + 0.5 * power);
      hsla.l = hsla.l / (1 + power);
    }
    if (hsla.s > 100) { hsla.s = 100; }
    return hsla;
  }

  /**
   * returns distance between two colors in RGB space.
   * @param c1 -- color 1 in RGBA format
   * @param c2 -- color 2 in RGBA format
   * @return number between 0 and 1
   */
  colorDistance(c1: RGB, c2: RGB): number {
    return Math.hypot(c1.r - c2.r, c1.g - c2.g, c1.b - c2.b) / 255;
  }
}
