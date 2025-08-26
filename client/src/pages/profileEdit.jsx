import { useState } from "react";
import SERVER_URL from "../constant/url";

export default function ProfileEdit() {
  const [file, setFile] = useState();
  const createImage = async () => {
    const accessToken = localStorage.access;
    const formData = new FormData();
    formData.append('upload', file);
    try {
      const res = await fetch(`${SERVER_URL}image/upload`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      console.log(data);
        
      if (!res.ok) {
        const response = await fetch(`${SERVER_URL}reissue`, {
          method: "POST",
          credentials: "include",
        });

        // 새 액세스 토큰을 응답 헤더에서 가져옴
        const newAccessToken = response.headers.get("access");
        if (newAccessToken) {
          localStorage.setItem("access", newAccessToken);
        } else {
          throw new Error("액세스 토큰이 응답에 없음");
        }
      };

      const res2 = await fetch(`${SERVER_URL}userinfo/image`, {
        method: "PATCH",
        headers: {
        'Content-Type': 'application/json',
        'access': `${accessToken}`
      },
        body: JSON.stringify({profileImageUrl: data?.url}),
      });

      return res2;
    } catch (error) {
      console.error("좋아요 에러", error);
    }
  }

  // const deleteImage = async () => {
  //   const accessToken = localStorage.access;
  //   try {
  //     const res = await fetch(`${SERVER_URL}image/delete?imageUrl=${userinfo?.profileImageUrl}`, {
  //       method: "DELETE",
  //     });
  
  //     if (!res.ok) {
  //       const response = await fetch(`${SERVER_URL}reissue`, {
  //         method: "POST",
  //         credentials: "include",
  //       });

  //       const newAccessToken = response.headers.get("access");
  //       if (newAccessToken) {
  //         localStorage.setItem("access", newAccessToken);
  //       } else {
  //         throw new Error("액세스 토큰이 응답에 없음");
  //       }
  //     };

  //     const res2 = await fetch(`${SERVER_URL}userinfo/image/delete`, {
  //       method: "PATCH",
  //       headers: {
  //       'Content-Type': 'application/json',
  //       'access': `${accessToken}`
  //       },
  //     });

  //     return res2;
  //   } catch (error) {
  //     console.error("좋아요 에러", error);
  //   }
  // };
  

  return (
    <>
      <div className="edit-container">
        <div className="edit-profile-header">
          <div className="edit-profile-image">
            <img src="" alt="프로필 이미지 없음" className="profile-image" />
            <input type="file" onChange={(e) => setFile(e.target.files[0])} />
            <button type="button" onClick={createImage}>이미지 업로드</button>
            <button type="button">이미지 삭제 버튼</button>
          </div>
          <div className="edit-text">
            <h2>송승엽{}</h2>
            <p>프론트엔드 개발...{}</p>
            <button type="button">수정</button>
          </div>
        </div>
        <div className="edit-btn-container">
          <h2 className="edit-delete-caption">회원 탈퇴</h2>
          <button type="button" className="edit-btn-delete">회원 탈퇴</button>
        </div>
        <p className="edit-delete-text">탈퇴 시 작성하신 포스트 및 댓글이 모두 삭제되며 복구되지 않습니다.</p>
      </div>
    </>
  );
};


