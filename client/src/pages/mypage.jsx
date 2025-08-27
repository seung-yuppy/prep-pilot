import { Link } from "react-router-dom";
import Feed from "../components/feed";
import useGetUserInfo from "../service/user/useGetUserInfo";
import useGetMyTags from "../service/user/useGetMyTags";
import getMyPosts from "../util/user/getMyPosts";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { useMotionValueEvent, useScroll } from "framer-motion";
import { useEffect } from "react";

export default function MyPage() {
  const { scrollYProgress } = useScroll();
  const queryClient = useQueryClient();
  const { data: userInfo } = useGetUserInfo();
  const { data: myTags } = useGetMyTags(userInfo?.id);

  const {
    data: myPosts,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["myPosts"],
    queryFn: ({ pageParam = 0 }) => getMyPosts(pageParam),
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.last ? undefined : allPages.length;
    },
  });

  // 스크롤 90% 넘으면 다음 페이지 요청
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (latest > 0.9 && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  });

  useEffect(() => {
    queryClient.invalidateQueries({
      queryKey: ["myPosts"],
    });
  }, [queryClient]);

  console.log(myPosts);

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
            <p className="info-intro">{userInfo?.bio}</p>
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

        <div className="mypage-tab">
          <div className="mypage-tab-menu">
            <Link className="active-tab">글</Link>
            <Link>퀴즈</Link>
          </div>
        </div>

        {/* 내가 쓴 글 & 태그 목록들 */}
        <div className="mypage-content-list">
          {/* 태그 목록 왼쪽 사이드 */}
          <aside className="mypage-side-menu">
            <div className="side-menu-title">
              <h1 className="side-menu-title-text">태그 목록</h1>
            </div>
            <ul className="side-menu-category">
              <li className="side-menu-item">
                <Link>전체보기</Link>()
              </li>
              {myTags &&
                myTags.map((myTag, index) => (
                  <li key={index} className="side-menu-item">
                    <Link>
                      {myTag?.tagName} ({myTag?.count})
                    </Link>
                  </li>
                ))}
            </ul>
          </aside>
          {/* 내가 쓴 글 오른쪽 사이드 */}
          <ul className="mypage-mypost">
            {myPosts?.pages.map((page) =>
              page.content.map((value) => (
                <li key={value.id}>
                  <Feed
                    id={value.id}
                    title={value.title}
                    content={value.content}
                    createdAt={value.createdAt}
                    nickname={value.nickname}
                    commentCounts={value.commentCounts}
                    likesCounts={value.likesCounts}
                  />
                </li>
              ))
            )}
            {isFetchingNextPage && (
              <h1 className="feed-nocontent">로딩 중...</h1>
            )}
            {!hasNextPage && (
              <h1 className="feed-nocontent">글 목록이 없습니다.</h1>
            )}
          </ul>
        </div>
      </div>
    </>
  );
}
