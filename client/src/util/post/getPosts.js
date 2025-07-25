import SERVER_URL from "../../constant/url";

const getPosts = async (page) => {
  try {
    const res = await fetch(`${SERVER_URL}posts?page=${page}`,{
      method: "GET",
    });
    const data = await res.json();
    const content = await data.content;
    return { content };
  } catch (error) {
    console.error("post list 불러오기 오류", error);
  }
}

export default getPosts;