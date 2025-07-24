export default function Feed({ id, content, title, createdAt }) {
  return (
    <>
     <a href={`/post/${id}`}>
      <div className="feed-card">
        <img
          src="https://velog.velcdn.com/images/takuya/post/d3645507-ad33-4aff-b8fd-d51f30bd481e/image.png"
          alt=""
          className="feed-thumnail"
        />
        <div className="feed-content">
          <h1 className="feed-title">{title}</h1>
          <p className="feed-description">
            {content}
          </p>
          <div className="feed-info">
            <span className="info-date">{createdAt}</span>
            <span className="info-dot">•</span>
            <span className="info-comment">3개의 댓글</span>
          </div>
          <div className="feed-footer">
            <div className="footer-nickname">
              <span className="nickname-by">By</span>
              <a href="#"><span className="nickname-name">배고픈 둘리</span></a>
            </div>
            <span className="footer-like">♥ 125</span>
          </div>
        </div>
      </div>
      </a>
    </>
  );
}
