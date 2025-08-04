import { useParams } from "react-router-dom";
import useGetPost from "../service/post/useGetPost";
import SafeContent from "../components/safeContent";
import useGetComments from "../service/comment/useGetComments";
import { useState } from "react";
import usePostComment from "../service/comment/usePostComment";
import { useQueryClient } from "@tanstack/react-query";

export default function Post() {
  const queryClient = useQueryClient();
  const { id } = useParams();
  const { data: post } = useGetPost(id);
  const { data: comments } = useGetComments(id);
  const [commentText, setCommentText] = useState("");
  const commentMutation = usePostComment(id, {
    onSuccess: () => {
      alert("댓글을 작성하였습니다.");
      setCommentText("");
      queryClient.invalidateQueries({
        queryKey: ["comments", id], // 이 키는 useGetComments에서 정의한 key와 같아야 함!
      });
    },
    onError: (error) => {
      console.error("댓글 작성 오류", error);
    },
  });

  const onCreateComment = async (e) => {
    e.preventDefault();
    commentMutation.mutate({ content: commentText });
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
                    <span className="post-comment-name">{comment.id}</span>
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
