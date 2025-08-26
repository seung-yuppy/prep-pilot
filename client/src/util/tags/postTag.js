
import SERVER_URL from "../../constant/url";

const onPostTag = async ({ name }) => {
  try {
    const accessToken = localStorage.access;
    const response = await fetch(`${SERVER_URL}tags`,{
        method:"POST",
        headers: {
          'Content-Type': 'application/json',
          'access': `${accessToken}`
        },
        body: JSON.stringify({ name })
    });
    const data = await response.json();
    return{ response, data };
  } catch (error) {
    console.error('태그 포스트 에러', error);
  }
}

export default onPostTag;
