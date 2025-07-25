import SERVER_URL from "../../constant/url";

const onWrite = async ({ title, content, slug, is_private }) => {
  try {
    const accessToken = localStorage.access;
    const response = await fetch(`${SERVER_URL}posts`,{
        method:"POST",
        headers: {
          'Content-Type': 'application/json',
          'access': `${accessToken}`
        },
        body: JSON.stringify({ title, content, slug, is_private }),
    });
    const data = await response.json();
    return{ response, data };
  } catch (error) {
    console.error('글 포스트 에러', error);
  }
}

export default onWrite;