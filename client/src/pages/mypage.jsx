import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { useMotionValueEvent, useScroll } from "framer-motion";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Feed from "../components/feed";
import useGetMyTags from "../service/user/useGetMyTags";
import useGetUserInfo from "../service/user/useGetUserInfo";
import getMyPosts from "../util/user/getMyPosts";
import useGetMyAllQuizList from "../service/quiz/useGetMyAllQuizList";
import useGetMyAllQuiz from "../service/quiz/useGetMyAllQuiz";

export default function MyPage() {
  const { scrollYProgress } = useScroll();
  const queryClient = useQueryClient();
  const { data: userInfo } = useGetUserInfo();
  const { data: myTags } = useGetMyTags(userInfo?.id);
  const [activeTab, setActiveTab] = useState('posts'); // 기본값을 'posts'로 설정
  const { data: myAllQuizList } = useGetMyAllQuizList();

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
  };


  // 임시 퀴즈 결과 데이터 (나중에 API로 교체)
  const quizResults = [
    {
      id: 1,
      quizTitle: "자바 기초 문법 퀴즈",
      correctAnswers: 8,
      totalQuestions: 10,
      postTitle: "자바 프로그래밍 기초",
      date: "2024-01-15"
    },
    {
      id: 2,
      quizTitle: "객체지향 프로그래밍 퀴즈",
      correctAnswers: 7,
      totalQuestions: 10,
      postTitle: "OOP 개념 정리",
      date: "2024-01-10"
    },
    {
      id: 3,
      quizTitle: "자바 컬렉션 프레임워크 퀴즈",
      correctAnswers: 9,
      totalQuestions: 10,
      postTitle: "자바 컬렉션 완벽 가이드",
      date: "2024-01-05"
    }
  ];

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
              className={activeTab === 'posts' ? 'active-tab' : ''}
              onClick={() => setActiveTab('posts')}
            >
              글
            </button>
            <button 
              className={activeTab === 'quizzes' ? 'active-tab' : ''}
              onClick={() => setActiveTab('quizzes')}
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
                {activeTab === 'posts' ? '태그 목록' : '퀴즈 통계'}
              </h1>
            </div>
            {activeTab === 'posts' ? (
              <ul className="side-menu-category">
                <li className="side-menu-item">
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
                  <span className="stat-number">{quizResults.length}</span>
                  <span className="stat-label">총 퀴즈 수</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">
                    {Math.round(quizResults.reduce((acc, quiz) => acc + (quiz.correctAnswers / quiz.totalQuestions), 0) / quizResults.length * 100)}%
                  </span>
                  <span className="stat-label">평균 정답률</span>
                </div>
              </div>
            )}
          </aside>
          
          {/* 메인 콘텐츠 영역 */}
          <div className="mypage-main-content">
            {activeTab === 'posts' ? (
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
                  <li key={quiz.id} className="quiz-result-card" onClick={() => handleQuizCardClick(quiz.id)}>
                    <div className="quiz-result-header">
                      <h3 className="quiz-title">{quiz.title}</h3>
                      <div className="quiz-score">
                        <span className="score-text">
                          {quiz.correctAnswers}/{quiz.totalQuestions}
                        </span>
                        <span className="score-percentage">
                          {Math.round((quiz.correctAnswers / quiz.totalQuestions) * 100)}%
                        </span>
                      </div>
                    </div>
                    <div className="quiz-result-content">
                      <p className="post-title">글: {quiz.title}</p>
                      <p className="quiz-date">{quiz.createdAt}</p>
                    </div>
                    <div className="quiz-progress-bar">
                      <div 
                        className="quiz-progress-fill"
                        style={{ width: `${(quiz.correctAnswers / quiz.totalQuestions) * 100}%` }}
                      ></div>
                    </div>
                    <div className="quiz-card-footer">
                      <Link to={`/post/139`} className="view-post-btn">
                        글 자세히 보기 →
                      </Link>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
