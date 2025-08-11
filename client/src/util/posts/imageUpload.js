import SERVER_URL from "../../constant/url";

const onImageUpload = async (file) => {
  const formData = new FormData();
  formData.append('upload', file, file.name);

  try {
    const accessToken = localStorage.access;
    const response = await fetch(`${SERVER_URL}image/upload`, {
      method: "POST",
      body: formData,
    });
    const data = await response.json();
    return { response, data };
  } catch (error) {
    console.error('이미지 업로드 에러', error);
    throw error;
  }
}

export default onImageUpload;

