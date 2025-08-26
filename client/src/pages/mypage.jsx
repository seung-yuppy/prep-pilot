import { Link } from "react-router-dom";
import Feed from "../components/feed";
import useGetUserInfo from "../service/user/useGetUserInfo";

export default function MyPage() {
  const { data: userInfo } = useGetUserInfo();
  console.log(userInfo)

  return (
    <>
      <div className="mypage-wrapper">
        <div className="mypage-info">
          <img
            src={userInfo?.profileImageUrl}
            className="mypage-profile-image"
            alt="프로필 이미지 없음"
          />
          <div className="mypage-nickname-intro">
            <h1 className="info-nickname">{userInfo?.nickname}</h1>
            <p className="info-intro">
              {userInfo?.bio}
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
          <Link to={"/editprofile"} className="post-edit">
            정보 수정
          </Link>
          <button type="button" className="post-follow">
            팔로우
          </button>
        </div>
        <div className="mypage-content">
          <div className="mypage-tab">
            <Link>글</Link>
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
