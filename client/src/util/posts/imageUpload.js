import SERVER_URL from "../../constant/url";


const onImageUpload = async (formData) => {
  try {
    const response = await fetch(`${SERVER_URL}image/upload`, {
      method: "POST",
      body: formData,
    });
    const data = await response.json();
    return { response, data };
  } catch (error) {
    console.error('이미지 업로드 에러', error);
  }
}

export default onImageUpload;
