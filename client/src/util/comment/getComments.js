import SERVER_URL from "../../constant/url";

const getComments = async (id) => {
  try {
    const res = await fetch(`${SERVER_URL}${id}/comment`, {
      method: "GET"
    });
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("comment list 불러오기 오류", error);
  }
}

export default getComments;