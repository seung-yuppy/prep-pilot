import axios from "axios";

const reissueToken = async () => {
    try {
        const response = await axios.post(
            "http://localhost:8080/reissue",
            { withCredentials: true } // 쿠키 포함
        );

        // 새 액세스 토큰을 응답 헤더에서 가져옴
        const newAccessToken = response.headers["access"];

        if (newAccessToken) {
            localStorage.setItem("accessToken", newAccessToken);
            return newAccessToken;
        } else {
            throw new Error("액세스 토큰이 응답에 없음");
        }
    } catch (error) {
        console.error("토큰 재발급 실패", error);
        throw error;
    }
};

const api = axios.create({
    baseURL: "http://localhost:8080",
    withCredentials: true, // 쿠키 포함
});

// 요청 인터셉터 (Access Token을 자동으로 헤더에 추가)
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
        config.headers["access"] = `${token}`;
    }
    return config;
});

// 응답 인터셉터 (토큰 만료 시 재발급)
api.interceptors.response.use(
    (response) => response, // 정상 응답
    async (error) => {
        if (error.response && error.response.status === 401) {
            try {
                const newAccessToken = await reissueToken(); // 토큰 재발급
                error.config.headers["access"] = `${newAccessToken}`;
                console.log("재발급");
                return axios.request(error.config); // 원래 요청 재시도
            } catch (reissueError) {
                console.error("토큰 갱신 실패", reissueError);
                window.location.href = "/login"; // 로그인 페이지로 이동
            }
        }
        return Promise.reject(error);
    }
);

export default api;