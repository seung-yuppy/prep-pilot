export default function PreviewContent({ content }) {
  try {
    const parsed = JSON.parse(content);

    // 텍스트만 추출하는 유틸리티 함수
    const extractText = (node) => {
      if (typeof node === "string") return node;
      if (Array.isArray(node)) return node.map(extractText).join("");
      if (typeof node === "object" && node !== null) {
        return extractText(node.children || []);
      }
      return "";
    };

    const fullText = extractText(parsed);
    const previewText = fullText.length > 10 ? fullText.slice(0, 20) + "..." : fullText;

    return <>{previewText}</>;
  } catch (e) {
    console.error("Invalid content JSON:", e);
    return <p>불러올 수 없는 콘텐츠입니다.</p>;
  }
}