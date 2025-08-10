import { Link } from "react-router-dom";
import Feed from "../components/feed";

export default function MyPage() {
  return (
    <>
      <div className="mypage-wrapper">
        <div className="mypage-info">
          <img
            src="https://velog.velcdn.com/images/prettylee620/profile/4d44e3a6-dca0-4c1a-be20-63d0be4b2feb/image.jpeg"
            className="mypage-profile-image"
            alt="프로필 이미지 없음"
          />
          <div className="mypage-nickname-intro">
            <h1 className="info-nickname">배고픈 둘리</h1>
            <p className="info-intro">
              내 지식을 기록하여, 다른 사람들과 공유하여 함께 발전하는 사람이
              되고 싶다.
            </p>
          </div>
        </div>
        <div className="mypage-follow">
          <h2 className="mypage-followers">
            <span className="mypage-followings">216 </span>
            팔로워
          </h2>
          <h2 className="mypage-followers">
            <span className="mypage-followings">23 </span>
            팔로잉
          </h2>
        </div>
        <div className="follow-btn">
          <button type="button" className="post-follow">
            팔로우
          </button>
        </div>
        <div className="mypage-content">
          <div className="mypage-tab">
            <Link>글</Link>
            <Link>시리즈</Link>
            <Link>소개</Link>
          </div>
          {/* <Feed /> */}
        </div>
        
        {/* 태그 목록 옆 사이드 */}
        <aside className="mypage-side-menu">
          <div className="side-menu-title">
            <h1 className="side-menu-title-text">태그 목록</h1>
          </div>
          <ul className="side-menu-category">
            <li className="side-menu-item"><Link>전체보기</Link>(0)</li>
            <li className="side-menu-item"><Link>코딩</Link>(0)</li>
            <li className="side-menu-item"><Link>일상</Link>(0)</li>
          </ul>
        </aside>
      </div>
    </>
  );
}
