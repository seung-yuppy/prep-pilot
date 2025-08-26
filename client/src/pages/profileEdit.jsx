import { useRef, useState } from "react";
import SERVER_URL from "../constant/url";
import useGetUserInfo from "../service/user/useGetUserInfo";
import { useQueryClient } from "@tanstack/react-query";

export default function ProfileEdit() {
  const queryClient = useQueryClient();
  const [_, setFile] = useState();
  const fileInputRef = useRef(null);
  const { data: userInfo } = useGetUserInfo();

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      createImage(selectedFile);
    }
  };

  const createImage = async (fileToUpload) => {
    if (!fileToUpload) {
      alert("업로드할 파일이 선택되지 않았습니다.");
      return;
    }
    const accessToken = localStorage.access;
    const formData = new FormData();
    formData.append('upload', fileToUpload);
    try {
      deleteImage();
      const res = await fetch(`${SERVER_URL}image/upload`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
        
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

      queryClient.invalidateQueries({
        queryKey: ["userinfo"], 
      });

      return res2;
    } catch (error) {
      console.error("좋아요 에러", error);
    }
  }

  // const deleteUser = async () => {
  //   const accessToken = localStorage.access;
  //   try {
  //     const res = await fetch(`${SERVER_URL}quit`, {
  //       method: "DELETE",
  //     });
  //   } catch (error) {
  //     console.error("회원 탈퇴 오류 : ", error);
  //   }
  // };

  const deleteImage = async () => {
    const accessToken = localStorage.access;
    try {
      const res = await fetch(`${SERVER_URL}image/delete?imageUrl=${userInfo?.profileImageUrl}`, {
        method: "DELETE",
      });
  
      if (!res.ok) {
        const response = await fetch(`${SERVER_URL}reissue`, {
          method: "POST",
          credentials: "include",
        });

        const newAccessToken = response.headers.get("access");
        if (newAccessToken) {
          localStorage.setItem("access", newAccessToken);
        } else {
          throw new Error("액세스 토큰이 응답에 없음");
        }
      };

      const res2 = await fetch(`${SERVER_URL}userinfo/image/delete`, {
        method: "PATCH",
        headers: {
        'Content-Type': 'application/json',
        'access': `${accessToken}`
        },
      });

      return res2;
    } catch (error) {
      console.error("좋아요 에러", error);
    }
  };
  

  return (
    <>
      <div className="edit-container">
        <div className="edit-profile-header">
          <div className="edit-profile-image" style={{ position: 'relative', cursor: 'pointer' }} onClick={handleImageClick}>
            <img 
              src={userInfo?.profileImageUrl} 
              alt="프로필 이미지 없음" 
              className="profile-image"
            />
            <input 
              type="file" 
              onChange={handleFileChange} 
              accept="image/*"
              ref={fileInputRef}
              className="profile-file-input"
            />
          </div>
          <button type="button" onClick={deleteImage}>삭제하기</button>
          <div className="edit-text">
            <h2 className="edit-nickname">{userInfo?.nickname}</h2>
            <p className="edit-bio">{userInfo?.bio}</p>
            <div className="edit-text-btn-container">
              <button type="button" className="edit-text-btn">수정</button>
            </div>
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


