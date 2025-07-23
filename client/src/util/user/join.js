import SERVER_URL from "../../constant/url";

const onJoin = async ({ username, password, email, name, nickname }) => {
  try {
    const response = await fetch(`${SERVER_URL}join`,{
        method:"POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password, email, name, nickname }),
    });
    const data = await response.json();
    return{ response, data };
  } catch (error) {
    console.error('회원가입 오류', error);
  }
}

export default onJoin;