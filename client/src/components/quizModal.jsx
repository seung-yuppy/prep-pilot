import { useEffect, useState } from "react";
import useGetQuiz from "../service/quiz/useGetQuiz";
import usePostMyQuiz from "../service/quiz/usePostMyQuiz";

export default function QuizModal({ closeModal, id, text }) {
  const [isLoading, setIsLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(null);
  const [score, setScore] = useState(0);

  const [page, setPage] = useState(0);
  const { data: quiz } = useGetQuiz(id, text, page);

  const totalQuestions = quiz?.totalPages || 0;
  const currentQuestionData = quiz?.content?.[0];


  const { mutate: saveAnswer } = usePostMyQuiz();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 5000);

    return () => clearTimeout(timer); // 컴포넌트 언마운트 시 타이머 정리
  }, []);

  // '정답 확인' 버튼 클릭 시 실행되는 함수
  const handleCheckAnswer = () => {
    if (userAnswer.trim() === "") {
      alert("정답을 입력해주세요!");
      return;
    }

    const isAnswerCorrect =
      userAnswer.trim().toLowerCase() ===
      currentQuestionData.answer.toLowerCase();
    setIsCorrect(isAnswerCorrect);
    if (isAnswerCorrect) {
      setScore((prevScore) => prevScore + 1);
    } 
    // 👇 수정된 부분: 인자들을 하나의 객체로 묶어 전달
    saveAnswer({
      id: currentQuestionData?.id,
      userAnswer: userAnswer,
      isCorrect: isAnswerCorrect
    });
    setIsSubmitted(true);
  };

  // '다음 문제' 버튼 클릭 시 실행되는 함수
  const handleNextQuestion = () => {
    setIsSubmitted(false);
    setIsCorrect(null);
    setUserAnswer("");
    setCurrentStep((prevStep) => prevStep + 1);
    setPage((prevPage) => prevPage + 1);
  };

  // 사용자가 Enter 키를 눌렀을 때의 동작 처리
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      if (!isSubmitted) {
        handleCheckAnswer();
      } else {
        if (currentStep < totalQuestions) {
          handleNextQuestion();
        }
      }
    }
  };

  // 모달 내부 컨텐츠 렌더링
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="loading-container">
          <div className="loading-dots">
            <div className="loading-dot"></div>
            <div className="loading-dot"></div>
            <div className="loading-dot"></div>
          </div>
          <p className="loading-message">AI가 까다로운 문제 생성 중...</p>
        </div>
      );
    }
    // 퀴즈가 끝났을 때 결과 화면 표시
    if (currentStep >= totalQuestions) {
      return (
        <>
          <div className="modal-header">
            <h2 className="modal-title result-title">🎉 퀴즈 완료!</h2>
            <button onClick={closeModal} className="close-button">
              &times;
            </button>
          </div>
          <div className="modal-body result-body">
            <p className="result-emoji">
              {score === totalQuestions ? "🏆" : "👍"}
            </p>
            <p className="result-summary">
              총 {totalQuestions}문제 중 <span className="score">{score}</span>
              문제를 맞혔어요!
            </p>
            <p className="result-message">
              오늘도 한 걸음 성장하셨네요. 수고하셨습니다!
            </p>
          </div>
          <div className="modal-footer">
            <button onClick={closeModal} className="button-secondary">
              닫기
            </button>
          </div>
        </>
      );
    }

    // 퀴즈 진행 중 화면 표시
    return (
      <>
        <div className="modal-header">
          <h2 className="modal-title">💡 핵심 개념 퀴즈</h2>
          <button onClick={closeModal} className="close-button">
            &times;
          </button>
        </div>

        <div className="progress-container">
          <div
            className="progress-bar"
            style={{ width: `${((currentStep + 1) / totalQuestions) * 100}%` }}
          ></div>
        </div>
        <p className="progress-text">
          {currentStep + 1} / {totalQuestions}
        </p>

        <div className="modal-body">
          <p className="question-text">
            <span className="question-number">Q{currentStep + 1}.</span>{" "}
            {quiz?.content[0].question}
          </p>
          <input
            type="text"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="정답을 입력하세요..."
            disabled={isSubmitted}
            className={`input-answer ${
              isSubmitted && (isCorrect ? "input-correct" : "input-incorrect")
            }`}
            autoFocus
          />
          {isSubmitted && (
            <p
              className={`feedback-text ${
                isCorrect ? "feedback-correct" : "feedback-incorrect"
              }`}
            >
              {isCorrect
                ? "🎉 정답입니다!"
                : `😥 오답입니다. 정답은 ${quiz?.content[0].answer} 입니다.`}
            </p>
          )}
        </div>
        <div className="modal-footer">
          {!isSubmitted ? (
            <button onClick={handleCheckAnswer} className="button-primary">
              정답 확인
            </button>
          ) : (
            <button onClick={handleNextQuestion} className="button-primary">
              다음 문제 &rarr;
            </button>
          )}
        </div>
      </>
    );
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">{renderContent()}</div>
    </div>
  );
}
