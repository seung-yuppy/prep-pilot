export default function Feed() {
  return (
    <>
      <div className="feed-card">
        <img
          src="https://velog.velcdn.com/images/takuya/post/d3645507-ad33-4aff-b8fd-d51f30bd481e/image.png"
          alt=""
          className="feed-thumnail"
        />
        <div className="feed-content">
          <h1 className="feed-title">2025년, 내가 선택한 프로그래머...</h1>
          <p className="feed-description">
            안녕하세요! 최근 저희 팀은 개발 효율성을 높이기 위해 다양한 도구를
            시도해 왔습니다. 특히 신입 엔지니어가 들어올 때...
          </p>
          <div className="feed-info">
            <span className="info-date">2025년 7월 21일</span>
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
    </>
  );
}
