import React from 'react';
import SERVER_URL from "../../constant/url";


function doParse(node) {
  if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent.trim();
      return text ? text : null;
  }

  if (node.nodeType === Node.ELEMENT_NODE && node.tagName !== 'SCRIPT') {
      return {
          tag: node.tagName.toLowerCase(),
          attributes: Object.fromEntries([...node.attributes].map(attr => [attr.name, attr.value])),
          children: [...node.childNodes].map(doParse).filter(child => child !== null)
      };
  }
  return null;
}

function jsonToHtml(node) {
  if (typeof node === 'string') {
      return escapeHtml(node);
  }

  const { tag, attributes = {}, children = [] } = node;

  const attrString = Object.entries(attributes)
      .map(([key, value]) => `${key}="${escapeHtml(value)}"`)
      .join(' ');

  const openingTag = attrString ? `<${tag} ${attrString}>` : `<${tag}>`;
  const closingTag = `</${tag}>`;

  const childHtml = children.map(jsonToHtml).join('');

  return `${openingTag}${childHtml}${closingTag}`;
}

function escapeHtml(text) {
  return text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
}

export function jsonToJsx(node, key = 0) {
  if (!node) {
    return null;
  }
  if (typeof node === 'string') {
    return node;
  }

  const { tag, attributes = {}, children = [] } = node;

  if (!tag) {
    return null;
  }

  // If the tag is 'body', render its children directly to avoid hydration errors
  if (tag === 'body') {
    return React.createElement(React.Fragment, null, ...children.map((child, idx) => jsonToJsx(child, idx)).filter(Boolean));
  }

  const props = Object.entries(attributes).reduce(
    (acc, [k, v]) => {
      if (k === 'class') {
        acc.className = v;
      } else if (k === 'style') {
        if (typeof v === 'string') {
          // style 문자열을 객체로 변환
          acc.style = v.split(';').reduce((styleAcc, style) => {
            const [key, value] = style.split(':').map(s => s.trim());
            if (key && value) {
              // CSS 속성명을 camelCase로 변환 (예: font-size -> fontSize)
              const camelKey = key.replace(/-([a-z])/g, g => g[1].toUpperCase());
              styleAcc[camelKey] = value;
            }
            return styleAcc;
          }, {});
        } else {
          // 문자열이 아니면 그대로 사용 (이미 객체일 수 있음)
          acc.style = v;
        }
      } else {
        acc[k] = v;
      }
      return acc;
    },
    { key }
  );

  return React.createElement(
    tag,
    props,
    ...children.map((child, idx) => jsonToJsx(child, idx)).filter(Boolean)
  );
}


const onWrite = async ({ title, content, slug, is_private }) => {
  try {
    const accessToken = localStorage.access;
    const response = await fetch(`${SERVER_URL}posts`,{
        method:"POST",
        headers: {
          'Content-Type': 'application/json',
          'access': `${accessToken}`
        },
        body: JSON.stringify({ title, content, slug, is_private }),
    });
    const data = await response.json();
    return{ response, data };
  } catch (error) {
    console.error('글 포스트 에러', error);
  }
}

export default onWrite;
export { doParse, jsonToHtml };
