import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { useMotionValueEvent, useScroll } from "framer-motion";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Feed from "../components/feed";
import IncorrectModal from "../components/incorrectModal";
import useGetMyAllQuiz from "../service/quiz/useGetMyAllQuiz";
import useGetMyAllQuizList from "../service/quiz/useGetMyAllQuizList";
import useGetQuizResult from "../service/quiz/useGetQuizResult";
import useGetMyTags from "../service/user/useGetMyTags";
import useGetUserInfo from "../service/user/useGetUserInfo";
import useModalStore from "../store/useModalStore";
import getMyPosts from "../util/user/getMyPosts";

export default function MyPage() {
  const { scrollYProgress } = useScroll();
  const queryClient = useQueryClient();
  const { data: userInfo } = useGetUserInfo();
  const { data: myTags } = useGetMyTags(userInfo?.id);
  const [activeTab, setActiveTab] = useState("posts"); // 기본값을 'posts'로 설정
  const { data: myAllQuizList } = useGetMyAllQuizList();
  const { isOpen, openModal, closeModal } = useModalStore();
  const { data: quizStat } = useGetQuizResult();
  console.log(quizStat);

  // 👇 1. 클릭된 퀴즈 ID를 저장할 state를 추가합니다. 초기값은 null.
  const [selectedQuizId, setSelectedQuizId] = useState(null);

  // 👇 2. selectedQuizId를 사용해 퀴즈 상세 정보를 가져옵니다.
  const { data: myQuizItem } = useGetMyAllQuiz(selectedQuizId);

  // 👇 3. myQuizItem 데이터가 변경될 때마다 콘솔에 출력합니다.
  useEffect(() => {
    if (myQuizItem) {
      console.log("선택된 퀴즈의 상세 정보:", myQuizItem);
      // 여기서 모달을 열거나 다른 UI를 보여줄 수 있습니다.
    }
  }, [myQuizItem]);

  // 👇 4. 퀴즈 카드 클릭 시 실행될 핸들러 함수를 정의합니다.
  const handleQuizCardClick = (quizId) => {
    setSelectedQuizId(quizId);
    openModal("incorrectModal");
  };

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

  // 페이지 이동 시 스크롤을 맨 위로 초기화
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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
        </div>

        <div className="mypage-tab">
          <div className="mypage-tab-menu">
            <button
              className={activeTab === "posts" ? "active-tab" : ""}
              onClick={() => setActiveTab("posts")}
            >
              글
            </button>
            <button
              className={activeTab === "quizzes" ? "active-tab" : ""}
              onClick={() => setActiveTab("quizzes")}
            >
              내가 푼 문제들
            </button>
          </div>
        </div>

        {/* 내가 쓴 글 & 태그 목록들 */}
        <div className="mypage-content-list">
          {/* 태그 목록 왼쪽 사이드 */}
          <aside className="mypage-side-menu">
            <div className="side-menu-title">
              <h1 className="side-menu-title-text">
                {activeTab === "posts" ? "태그 목록" : "퀴즈 통계"}
              </h1>
            </div>
            {activeTab === "posts" ? (
              <ul className="side-menu-category">
                <li className="side-menu-item active">
                  <Link>전체보기</Link>
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
            ) : (
              <div className="quiz-stats">
                <div className="stat-item">
                  <span className="stat-number">
                    {quizStat?.totalQuizCount}
                  </span>
                  <span className="stat-label">총 문제 수</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">
                    {(quizStat?.totalQuizCount > 0
                      ? ((quizStat?.totalQuizCount - quizStat?.wrongQuizCount) /
                          quizStat?.totalQuizCount) *
                        100
                      : 0
                    ).toFixed(2)}
                    %
                  </span>
                  <span className="stat-label">평균 정답률</span>
                </div>
              </div>
            )}
          </aside>

          {/* 메인 콘텐츠 영역 */}
          <div className="mypage-main-content">
            {activeTab === "posts" ? (
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
            ) : (
              <ul className="mypage-quiz-results">
                {myAllQuizList?.map((quiz) => (
                  <>
                    <li
                      key={quiz.id}
                      className="quiz-result-card"
                      onClick={() => handleQuizCardClick(quiz.postsId)}
                    >
                      <div className="quiz-result-header">
                        <h3 className="quiz-title">{quiz.title}</h3>
                        <div className="quiz-score">
                          <span className="score-text">
                            2/3
                          </span>
                          <span className="score-percentage">
                            {Math.round(
                              (2.0 / 3) * 100
                            )}
                            %
                          </span>
                        </div>
                      </div>
                      <div className="quiz-result-content">
                        <p className="post-title">글 제목: {quiz.title}</p>
                        <p className="quiz-date">{quiz.createdAt}</p>
                      </div>
                      <div className="quiz-progress-bar">
                        <div
                          className="quiz-progress-fill"
                          style={{
                            width: `${
                              (2 / 3) * 100
                            }%`,
                          }}
                        ></div>
                      </div>
                      <div className="quiz-card-footer">
                        <Link
                          to={`/post/${quiz.postsId}`}
                          className="view-post-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
                        >
                          글 자세히 보기 →
                        </Link>
                      </div>
                    </li>
                    {isOpen("incorrectModal") && (
                      <IncorrectModal
                        closeModal={() => closeModal("incorrectModal")}
                        id={quiz.postsId}
                        isAll={true}
                      />
                    )}
                  </>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
