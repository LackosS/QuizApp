import React, { useState, useEffect } from 'react';

function Quiz() {
    const [questions, setQuestions] = useState([]);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [score, setScore] = useState(0);
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [isSubmitted, setIsSubmitted] = useState(false);

    useEffect(() => {
        fetch('/questions.json')
            .then(response => response.json())
            .then(data => setQuestions(data))
            .catch(error => console.error('Error loading questions:', error));
    }, []);

    const toggleOption = (index) => {
        const newSelectedOptions = selectedOptions.includes(index)
            ? selectedOptions.filter(optionIndex => optionIndex !== index)
            : [...selectedOptions, index];
        setSelectedOptions(newSelectedOptions);
        setIsSubmitted(false);
    };

    const isOptionCorrect = (index) => questions[currentQuestion].correct.includes(index);
    const isOptionSelected = (index) => selectedOptions.includes(index);

    const submitAnswer = () => {
        setIsSubmitted(true);
        if (selectedOptions.every(index => isOptionCorrect(index)) &&
            selectedOptions.length === questions[currentQuestion].correct.length) {
            setScore(score + 1);
        }
    };

    const nextQuestion = () => {
        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
            setSelectedOptions([]);
            setIsSubmitted(false);
        }
    };

    const resetQuiz = () => {
        setCurrentQuestion(0);
        setScore(0);
        setSelectedOptions([]);
        setIsSubmitted(false);
    };

    const calculateMaxPoints = () => {
        return questions.reduce((total, question) => total + question.correct.length, 0);
    };

    return (
        <div style={{display:'flex',justifyContent:'center',alignItems:'center'}}>
            <div id="quiz-container">
                {questions.length > 0 && (
                    <div>
                        <div>{questions[currentQuestion].question}</div>
                        <ul>
                            {questions[currentQuestion].options.map((option, index) => (
                                <li key={index}
                                    onClick={() => toggleOption(index)}
                                    className={isOptionSelected(index) ? 'selected' : ''}
                                    style={{ 
                                        backgroundColor: isSubmitted ? (isOptionCorrect(index) ? 'green' : (isOptionSelected(index) ? 'maroon' : null)) : null,
                                        border: isSubmitted && isOptionSelected(index) ? '2px solid orange' : 'none'
                                    }}>
                                    {option}
                                </li>
                            ))}
                        </ul>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            {!isSubmitted && <button onClick={submitAnswer}>Submit Answer</button>}
                            {isSubmitted && <button onClick={nextQuestion}>Next Question</button>}
                        </div>
                    </div>
                )}
                {currentQuestion === questions.length - 1 && isSubmitted && (
                    <div style={{ textAlign: 'center' }}>
                        Your final score is: {score} out of {calculateMaxPoints()}
                    </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
                    <button onClick={resetQuiz}>Start Over</button>
                </div>
            </div>
        </div>
    );
    
                }    

export default Quiz;
