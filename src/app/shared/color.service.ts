import {Injectable} from '@angular/core';

export interface Color {
  hsl: HSL;
  isLight: boolean;
}

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
  dominant: Color,
  accent: Color
}

interface IColorStats {
  color: RGB,
  metTimes: number
}

@Injectable({providedIn: 'root'})
export class ColorService {

  public defaultColors: IPalette = {
    dominant: {hsl: {h: 240, s: 14, l: 15}, isLight: false},
    accent: {hsl: this.rgbaToHsla({r: 255, g: 255, b: 255}), isLight: true}
  }

  async getPalette(imageURL: string): Promise<IPalette> {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext && canvas.getContext('2d');
    return new Promise(resolve => {
      if (!context) {
        resolve(this.defaultColors)
      } else {
        const blockSize = 30;
        const maxColorDistance = 0.02;
        let dominantColors: IColorStats[] = [];
        let current: RGB;
        let nearest: IColorStats|undefined;
        const imageElement = new Image();
        imageElement.onload = (): void => {
          context.drawImage(imageElement, 0, 0);
          const height = canvas.height = imageElement.naturalHeight || 140;
          const width = canvas.width = imageElement.naturalWidth || 140;
          context.fillStyle = 'rgb(249,250,254)';
          context.fillRect(0, 0, width, height);
          context.drawImage(imageElement, 0, 0);
          try {
            const data = context.getImageData(0, 0, width, height);
            const length = data.data.length;
            let i = 0;
            let r; let g; let b;
            let count = 0;
            while ( i < length ) {
              r = data.data[i];
              g = data.data[i + 1];
              b = data.data[i + 2];
              current = {r, g, b};
              if (!this.isTransparent(r, g, b)) {
                nearest = dominantColors
                  .find(c => this.colorDistance(c.color, current) < maxColorDistance);
                if (nearest) {
                  nearest.metTimes++;
                } else {
                  dominantColors.push({ color: current, metTimes: 1 });
                }
                count++;
              }
              i += blockSize * 4;
            }
            dominantColors = dominantColors.sort((c1, c2) => c2.metTimes - c1.metTimes);
            const dominant = dominantColors[0].color;
            const isDominantLight = this.getLightness(dominant) > 0.5;
            let accent: RGB;
            const contrastColors = dominantColors
              .filter(c => {
                const isLight = this.getLightness(c.color) > 0.5;
                return isDominantLight ? !isLight : isLight;
              });
            if (contrastColors.length > 0) {
              accent = contrastColors[0].color;
            } else {
              dominantColors = dominantColors.sort((c1, c2) => {
                return this.colorDistance(c2.color, dominant) - this.colorDistance(c1.color, dominant);
              });
              accent = dominantColors[0].color;
            }
            resolve({
              dominant: {
                hsl: this.exchangeColor(this.rgbaToHsla(dominant), isDominantLight, isDominantLight ? 0 : 0.5),
                isLight: isDominantLight
              },
              accent: {
                hsl: this.exchangeColor(this.rgbaToHsla(accent), !isDominantLight, isDominantLight? 1.5 : 0.3),
                isLight: !isDominantLight
              }
            });
          } catch (e) {
            console.log('error parsing image: ', e);
            resolve(this.defaultColors);
          }
        };
        imageElement.crossOrigin = 'Anonymous';
        imageElement.src = imageURL;
      }
    });
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

  isGray(r: number, g: number, b: number, grayScale: number): boolean {
    const rR = Math.floor(r / grayScale);
    const rG = Math.floor(g / grayScale);
    const rB = Math.floor(b / grayScale);
    return rR === rG && rG === rB && r < 235 && r > 10;
  }

  getLightness(rgb: RGB): number {
    return Math.sqrt(rgb.r * rgb.r + rgb.g * rgb.g + rgb.b + rgb.b) / 255;
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
    hsla.s = hsla.s * (1 + power) + 2 * power;
    if (isLight) {
      hsla.l = (hsla.l + 100 * power) / (1 + power);
    } else {
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
