import fs from 'node:fs';
import path from 'node:path';
import fetch from 'sync-fetch';
import determineImageSize from 'image-size';

/** @param {import('markdown-it')} md */
export default function MarkdownItLazyImages(md) {
  if (process.env.NODE_ENV === 'development')
    return;

  md.renderer.rules.image = (tokens, index) => {
    const token = tokens[index];

    const caption = md.utils.escapeHtml(token.content);

    const srcIndex = token.attrIndex('src');
    const imageUrl = token.attrs[srcIndex][1];

    const image = getImage(imageUrl);

    const { width, height } = determineImageSize(image);

    let userAttributes = preserveAttributes(md, token);

    if (caption !== '')
      userAttributes += ` alt="${caption}"`;

    return `<img ${userAttributes} width="${width}" height="${height}" loading="lazy">`;
  };
}

/**
 * @param {import('markdown-it')} md
 * @param {import('markdown-it/lib/token')} token
 *
 * @returns {string}
 * */
function preserveAttributes(md, token) {
  const ignore = ['alt'];
  const escape = ['title'];

  return token.attrs
    .filter(([key]) => !ignore.includes(key))
    .map(([key, value]) => {
      let attributeValue = value;

      if (escape.includes(key))
        attributeValue = md.utils.escapeHtml(value);

      return `${key}="${attributeValue}"`;
    })
    .join(' ');
}

/**
 * @param {string} imageUrl
 *
 * @returns {Buffer}
 * */
function getImage(imageUrl) {
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return fetch(imageUrl).buffer();
  }
  else {
    const imagePath = path.resolve('./public', withoutLeadingSlash(imageUrl));

    return fs.readFileSync(imagePath);
  }
}

/** @param {string} string */
function withoutLeadingSlash(string) {
  if (string[0] === '/') return string.slice(1);

  return string;
}
