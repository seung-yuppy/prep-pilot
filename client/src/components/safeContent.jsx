// components/SafeContent.jsx
import { jsonToJsx } from "../util/posts/write";

export default function SafeContent({ content }) {
  try {
    const parsed = JSON.parse(content);
    return <>{jsonToJsx(parsed)}</>;
  } catch (e) {
    console.error("Invalid content JSON:", e);
    return <p>불러올 수 없는 콘텐츠입니다.</p>;
  }
}