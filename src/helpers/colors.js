/**
 * @param {number[]} colors
 * @return {number[]}
 */
export function hexToNormalizedRgb(colors) {
  return colors.map((string) => {
    let value = string;

    if (string[0] === '#') value = string.slice(1);

    const colorParts = value.match(/.{1,2}/g);

    return colorParts.map((part) => parseInt(part, 16) / 255);
  });
}

/**
 * @param {number[]} colors
 * @return {number[]}
 */
export function normalizeRgb(colors) {
  return colors.map((number) => number / 255);
}
