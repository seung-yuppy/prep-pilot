import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useParams } from "react-router-dom";
import IncorrectModal from "../components/incorrectModal";
import QuizModal from "../components/quizModal";
import SafeContent from "../components/safeContent";
import useGetComments from "../service/comment/useGetComments";
import usePostComment from "../service/comment/usePostComment";
import useGetIsLikePost from "../service/post/useGetIsLikePost";
import useGetPost from "../service/post/useGetPost";
import useGetTags from "../service/post/useGetTags";
import usePostLikePost from "../service/post/usePostLikePost";
import useModalStore from "../store/useModalStore";
import useUserStore from "../store/useUserStore";

export default function Post() {
  const queryClient = useQueryClient();
  const { id } = useParams();
  const { isLoggedIn } = useUserStore();
  const { isOpen, openModal, closeModal } = useModalStore();
  const { data: post } = useGetPost(id);
  const { data: comments } = useGetComments(id);
  const { data: tags } = useGetTags(id);
  const [commentText, setCommentText] = useState("");
  const { data: isLikePost } = useGetIsLikePost(id);
  const likePostMutation = usePostLikePost(id, {
    onSuccess: () => {
      if (isLoggedIn) {
        if (!isLikePost) alert("이 게시글을 좋아합니다.");
        else alert("이 게시물을 안좋아합니다.");
        queryClient.invalidateQueries({ queryKey: ["isLikePost", id] });
        queryClient.invalidateQueries({ queryKey: ["post", id] });
      } else {
        alert("로그인을 진행해주세요!");
      }
    },
    onError: (error) => alert("게시글 좋아요 에러 발생", error),
  });

  const commentMutation = usePostComment(id, {
    onSuccess: () => {
      alert("댓글을 작성하였습니다.");
      setCommentText("");
      queryClient.invalidateQueries({
        queryKey: ["comments", id],
      });
    },
    onError: (error) => {
      console.error("댓글 작성 오류", error);
    },
  });

  const onCreateComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) alert("댓글을 입력하세요!");
    else commentMutation.mutate({ content: commentText });
  };

  const onLikePost = () => {
    likePostMutation.mutate();
  };

  return (
    <>
      <div className="post-content">
        <h1 className="post-title">{post?.title}</h1>
        <div className="post-head">
          <div className="post-header">
            <span className="post-nickname">{post?.nickname}</span>
            <span className="post-dot">•</span>
            <span className="post-date">{post?.createdAt}</span>
            <span className="post-dot">•</span>
            <span className="post-like">{post?.likesCounts}</span>
          </div>
          <div className="post-btn-container">
            <button
              type="button"
              className={isLikePost ? "post-dislike" : "post-like"}
              onClick={onLikePost}
            >
              {isLikePost ? "안 좋아요" : "♥ 좋아요"}
            </button>
            <button type="button" className="post-follow">
              팔로우
            </button>
          </div>
        </div>
        <div className="post-tags">
          {tags &&
            tags.map((tag, index) => (
              <span className="tag-item" key={index}>
                {tag?.name}
              </span>
            ))}
        </div>
        <div className="post-decription">
          <SafeContent content={post?.content} />
        </div>

        {/* 문제 풀기 버튼 영역 */}
        <hr className="content-comment-gap" />
        <div className="quiz-btn-container">
          <button
            type="button"
            className="quiz-btn-test"
            onClick={() => openModal("quizModal")}
          >
            문제 풀기
          </button>
          <button
            type="button"
            className="quiz-btn-incorrect"
            onClick={() => openModal("incorrectModal")}
          >
            오답 노트
          </button>
        </div>

        {/* 문제 푸는 모달 영역 */}
        {isOpen("quizModal") && (
          <QuizModal closeModal={() => closeModal("quizModal")} />
        )}

        {isOpen("incorrectModal") && (
          <IncorrectModal closeModal={() => closeModal("incorrectModal")} />
        )}

        {/* 댓글 영역 */}
        <hr className="content-comment-gap" />
        <div className="post-comment-container">
          <span className="post-comment-count">
            {comments?.length}개의 댓글
          </span>
          <form className="post-comment-form" onSubmit={onCreateComment}>
            <textarea
              type="text"
              name="comment"
              placeholder="댓글을 작성하세요"
              className="post-comment-input"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
            />
            <div className="post-comment-btn-wrapper">
              <button type="submit" className="post-comment-btn">
                댓글 작성
              </button>
            </div>
          </form>
          <div className="post-comment-list">
            {comments?.map((comment) => (
              <>
                <div className="post-comment-userInfo">
                  <img
                    src="https://velog.velcdn.com/images/seolist/profile/50631e3e-ac81-416d-b293-5e758621f980/social_profile.jpeg"
                    alt="프로필 이미지 없음"
                    className="post-comment-userImage"
                  />
                  <div className="post-comment-namedate">
                    <span className="post-comment-name">
                      {comment.nickname}
                    </span>
                    <span className="post-comment-date">
                      {comment.createdAt}
                    </span>
                  </div>
                </div>
                <div className="post-comment-content-container">
                  <span className="post-comment-content">
                    {comment.content}
                  </span>
                </div>
              </>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
