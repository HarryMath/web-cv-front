/// <reference lib="webworker" />

interface RGB {
  r: number;
  g: number;
  b: number;
}

interface HSL {
  h: number;
  s: number;
  l: number;
}

interface IColorStats {
  color: RGB,
  metTimes: number
}

interface IImageInfo {
  light: HSL,
  dark: HSL,
  darkMax: HSL,
  lightMax: HSL,
  isLight: boolean
}
// filled back with rgb(249, 250, 254)
const isTransparent = (c: RGB): boolean => {
  return c.r >= 248 && c.r <= 250 &&
    c.g >= 249 && c.g <= 251 &&
    c.b >= 253 && c.g <= 255;
}

/**
 * returns distance between two colors in RGB space.
 * @param c1 -- color 1 in RGBA format
 * @param c2 -- color 2 in RGBA format
 * @return number between 0 and 1
 */
const colorDistance = (c1: RGB, c2: RGB): number => {
  return Math.hypot(c1.r - c2.r, c1.g - c2.g, c1.b - c2.b) / 255;
}

const rgbToHsl = (rgba: RGB): HSL => {
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

const getLightness = (rgb: RGB): number => {
  return Math.hypot(rgb.r, rgb.g, rgb.b) / 255;
}

const isGray = (c: RGB, grayScale: number = 30): boolean => {
  const rR = Math.floor(c.r / grayScale);
  const rG = Math.floor(c.g / grayScale);
  const rB = Math.floor(c.b / grayScale);
  return rR === rG && rG === rB;
}

const maxColorDistance = 0.01; // 0.02;
const blockSize = 15; // 30;


addEventListener('message', ({data}): void => {
  if (!data || !data.data || !data.data.length || data.data.length < 1000) {
    postMessage(new Error('incorrect input'));
  }
  try {
    const length = data.data.length;
    let i = 0;
    let count = 0;
    let current: RGB;
    let nearest: IColorStats|undefined;
    let dominantColors: IColorStats[] = [];
    while ( i < length ) {
      current = {
        r: data.data[i],
        g: data.data[i + 1],
        b: data.data[i + 2]
      };
      if (!isTransparent(current)) {
        nearest = dominantColors
          .find(c => colorDistance(c.color, current) < maxColorDistance);
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
    const dominant: RGB = dominantColors[0].color;
    const isDominantLight = getLightness(dominant) > 0.8;
    let accent: RGB;
    const contrastColors = dominantColors
      .filter(c => {
        const lightness = getLightness(c.color);
        return (isDominantLight ? lightness < 0.8 : lightness > 0.8) && !isGray(c.color);
      });
    if (contrastColors.length > 0) {
      accent = contrastColors[0].color;
    } else {
      dominantColors = dominantColors.sort((c1, c2) => {
        return colorDistance(c2.color, dominant) - colorDistance(c1.color, dominant);
      });
      accent = dominantColors[0].color;
    }
    const dark = rgbToHsl(isDominantLight ? accent : dominant);
    const light = rgbToHsl(isDominantLight ? dominant : accent);
    const darkMax = {...dark};
    const lightMax = {...light};
    const contrastLevel = light.l - dark.l;
    let contrastDeficit = 40 - contrastLevel;
    if (contrastDeficit < 0) contrastDeficit = 0;
    lightMax.l += (1 + contrastDeficit * 0.5);
    darkMax.l -= (1 + contrastDeficit * 0.5);
    lightMax.l = lightMax.l * 0.7 + 70 * 0.3;
    darkMax.l = darkMax.l * 0.55 + 7 * 0.45;
    if (darkMax.l < 0) darkMax.l = 0;
    if (lightMax.l > 100) lightMax.l = 100;
    const response: IImageInfo = {
      dark, light, darkMax, lightMax,
      isLight: isDominantLight
    }
    postMessage(response);
  } catch (e) {
    console.log('error parsing image: ', e);
    postMessage(e);
  }
});
