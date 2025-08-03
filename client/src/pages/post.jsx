import { useParams } from "react-router-dom";
import useGetPost from "../service/post/useGetPost";
import SafeContent from "../components/safeContent";

export default function Post() {
  const { id } = useParams();
  const { data: post } = useGetPost(id);

  return (
    <>
      <div className="post-content">
        <h1 className="post-title">{post?.title}</h1>
        <div className="post-head">
          <div className="post-header">
            <span className="post-nickname">{post?.nickname}</span>
            <span className="post-dot">•</span>
            <span className="post-date">{post?.createdAt}</span>
          </div>
          <button type="button" className="post-follow">
            팔로우
          </button>
        </div>
        <div className="post-decription">
          <SafeContent content={post?.content} />
        </div>
        <hr className="content-comment-gap" />
        <div className="post-comment-container">
          <span className="post-comment-count">4개의 댓글</span>
          <form className="post-comment-form">
            <textarea
              type="text"
              name="comment"
              placeholder="댓글을 작성하세요"
              className="post-comment-input"
            />
            <div className="post-comment-btn-wrapper">
              <button type="submit" className="post-comment-btn">
                댓글 작성
              </button>
            </div>
          </form>
          <div className="post-comment-list">
            <div className="post-comment-userInfo"> 
              <img src="https://velog.velcdn.com/images/seolist/profile/50631e3e-ac81-416d-b293-5e758621f980/social_profile.jpeg" alt="프로필 이미지 없음" className="post-comment-userImage" />
              <div className="post-comment-namedate">
                <span className="post-comment-name">fashion361</span>
                <span className="post-comment-date">2025년 8월 3일</span>
              </div>
            </div>
            <div className="post-comment-content-container">
              <span className="post-comment-content">스크롤 기반 CSS 애니메이션은 이제 animation-timeline 속성 덕분에 몇 줄의 코드만으로도 구현 가능하며, Safari 26 베타부터 지원됩니다. 타겟, 키프레임, 타임라인 세 요소를 활용해 사용자 스크롤에 반응하는 인터랙티브한 효과를 만들 수 있어 웹 디자인의 표현력이 크게 향상됩니다.</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
