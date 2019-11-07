$(function(){
    $(".questions").hide();
    $(".final").hide();
})

// setting up button to start quiz
$(function startQuiz(){
    $(".quiz-start").on('click', '.begin', function(event){
        event.preventDefault();
        $(".quiz-start").hide();
        $(".questions").show();
        renderQuestion();
    })
})

// these are what render the question and answer options
function answerOptions(){
    let questionOption = STORE.questions[STORE.currentQuestion]
    for(let i=0;i<questionOption.options.length;i++){
        $(".js-options").prepend(`
            <input type="radio" name="options" id="choice${i+1}" value="${questionOption.options[i]}" tabindex ="${i+1}" required>
            <label for="choice${i+1}">${questionOption.options[i]}</label><br/>
        `);
    }
}

function renderQuestion(){
    let askQuestion = STORE.questions[STORE.currentQuestion];
    $(".questions").html(`
        <form class="options-form js-options">
            <p class="answer-checked"></p>
            <button type="submit" class="submit-answer" tabindex ="5">Submit</button>
            <button type="button" class="next" tabindex ="6">Next</button>
            <ul class="tracker">
                <li class="tracked js-score">Score: ${STORE.score}/${STORE.questions.length}</li>
                <li class="tracked js-currentQuestion">Question: ${STORE.currentQuestion + 1}/${STORE.questions.length}</li>
            </ul>
        </form>
        `)

        $(".next").hide();
        answerOptions();
        $(".js-options").prepend(`<p class="quiz question">${askQuestion.question}</p>`)
        
}

// these check the chosen answer against the correct answer
function rightAnswer(){
    $(".answer-checked").text(`You are correct!!`);
    $(".answer-checked").addClass('right-answer');
    STORE.score++;
    $(".js-score").text(`Score: ${STORE.score}/${STORE.questions.length}`);
}

function wrongAnswer(){
    let questionAnswer = STORE.questions[STORE.currentQuestion];
    $(".answer-checked").addClass('wrong-answer');
    $(".answer-checked").text(`Sorry, but the correct answer is ${questionAnswer.answer} `);
    
}

$(function checkAnswer(){
    $(".questions").on('submit', function(event){
        event.preventDefault();
        let questionAnswer = STORE.questions[STORE.currentQuestion];
        let selectedAnswer = $('input:checked').val();
        if(selectedAnswer === questionAnswer.answer){
            rightAnswer();
        } else {
            wrongAnswer();
        };
        STORE.currentQuestion++;
        $(".submit-answer").hide();
        $("input[type=radio]").attr('disabled', true);
        $(".next").show();
    });
})

// final results page with retry button
function showFinalResults(){
    $(".questions").hide();
    $(".final").show();
    $(".final").html(`
        <h2>You have completed the quiz!</h2>
        <p>Your final score is Score: ${STORE.score}/${STORE.questions.length}</p>
    `)

    if(STORE.score <= STORE.questions.length / 2 ){
        $(".final").append(`
        <p>Better luck next time!</p>
        `)
    } else{
        $(".final").append(`
        <p>Great Job!</p>
        `)      
    }

    $(".final").append(`
        <h2 class="key-message">Answer Key!</h2>
        <ul class="answer-key"></ul>
    `)

    for (let i = 0; i < STORE.questions.length; i++){
        $('.answer-key').append(`
        <li>
            <h3>Question ${i+1}:${STORE.questions[i].question}</h3>
            <p>Correct Answer: ${STORE.questions[i].answer}</p>
        </li>
        `)
    }

    $(".final").append(`
        <p class="key-message">Interested in this amazing show? <br> Watch it here:<a href="https://www.amazon.com/Rising-Part-1/dp/B07HLKWDZF/ref=sr_1_3?crid=3BQUXZFE3HMIJ&keywords=stargate+atlantis&qid=1573166580&sprefix=stargate%2Caps%2C208&sr=8-3" target="_blank">Amazon Prime</a></p>
        
    `)

    STORE.score = 0;
    STORE.currentQuestion = 0;
    $(".final").append(`
    <button type="button" class="retry" tabindex ="7">Retry?</button>
    `)
}

$(function nextQuestion(){
    $(".questions").on('click','.next',(event)=>{
        STORE.currentQuestion === STORE.questions.length? showFinalResults() : renderQuestion();
    });
})

$(function retry(){
    $(".final").on('click','.retry',(event)=>{
        $(".final").hide()
        $(".quiz-start").show()
    });
})
