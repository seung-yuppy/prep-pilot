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

