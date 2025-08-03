import SERVER_URL from "../../constant/url";

const getPost = async(id) => {
  try {
    const res = await fetch(`${SERVER_URL}posts/${id}`, {
      method: "GET",
    });
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("post 게시글 불러오기 오류", error);
  }
}

export default getPost;