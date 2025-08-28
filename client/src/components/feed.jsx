import { Link } from "react-router-dom";
import PreviewContent from "./previewContent";

export default function Feed({ id, content, title, createdAt, nickname, commentCounts, likesCounts }) {
  // 이미지 배열
  const images = [
    "https://miro.medium.com/0*gtY-llyEbkeoS1Sp.png",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/4/40/JSPLife.png/800px-JSPLife.png",
    "https://img1.daumcdn.net/thumb/R800x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2F50AV5%2FbtrW0PHbA40%2FAAAAAAAAAAAAAAAAAAAAAB6HMUdfYC8AUDsKRgemOFiMu7yW6VPbXd_O_DTFoArM%2Fimg.jpg%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1756652399%26allow_ip%3D%26allow_referer%3D%26signature%3Dus1j%252B6UCCU9jH4F59Hlj1BVwGuQ%253D",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRzzA0R7_Az6ogDRNSKZuXJ1peO2Sl7Pq9DuQ&s"
  ];

  // id를 기반으로 이미지 선택 (4개 이미지를 순환)
  const selectedImage = images[id % images.length];

  return (
    <>
      <Link to={`/post/${id}`}>
        <div className="feed-card">
          <img
            src={selectedImage}
            alt=""
            className="feed-thumnail"
          />
          <div className="feed-content">
            <h1 className="feed-title">{title.length > 10 ? title.slice(0, 14) + "..." : title}</h1>
            <div className="feed-description">
              <PreviewContent content={content} />
            </div>
            <div className="feed-info">
              <span className="info-date">{createdAt}</span>
              <span className="info-dot">•</span>
              <span className="info-comment">{commentCounts}개의 댓글</span>
            </div>
            <div className="feed-footer">
              <div className="footer-nickname">
                <span className="nickname-by">By</span>
                <span className="nickname-name">{nickname}</span>
              </div>
              <span className="footer-like">{likesCounts}</span>
            </div>
          </div>
        </div>
      </Link>
    </>
  );
}
