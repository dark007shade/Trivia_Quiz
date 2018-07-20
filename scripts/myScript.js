/* jshint browser: true */

/* TRIVIA API URL */
/* https://opentdb.com/api.php */

var userCategory;
var userDifficulty;

var quizOptions;
var quizOptionsLabels;
var optionsLabelsCSSText = "color:white;background-color:#012367;-webkit-transition:all 0.3s ease 0s;transition:all 0.3s ease 0s;border-radius:5px;";
var optionsLabelsCSSTextReverse = "color:black;background-color:transparent;-webkit-transition:all 0.3s ease 0s;transition:all 0.3s ease 0s;border-radius:5px;";

var quizAnswersData;
var answersArray = [];
var currentQuestionIndex = 0;

var userChoicesArray = [];

var userAnswer = "";

var correctAnswersCount = 0;
var resultsMessage = "";

var selectedCategory = document.getElementById("quizCategory");

var selectedDifficulty = document.getElementById("quizDifficulty");

var quizGenerateButton = document.getElementById("quizGenerateButton");
quizGenerateButton.addEventListener("click", generateQuiz, false);

var submitAnswerButton = document.getElementById("submitAnswerButton");
submitAnswerButton.addEventListener("click", submitAnswer, false);

var tryAgainButton = document.getElementById("tryAgainButton");
tryAgainButton.addEventListener("click", tryAgain, false);

//var chartType = mySurvey.options[mySurvey.selectedIndex].value;


//Fisher-Yates (aka Knuth) Shuffle
//https://github.com/coolaj86/knuth-shuffle
function shuffle(array) {
    var currentIndex = array.length,
        temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}
//Parses JSON string into HTML DOM to avoid string comparison errors
//https://stackoverflow.com/questions/3700326/decode-amp-back-to-in-javascript
function removeCharRef(encodedStr) {
    var parser = new DOMParser();
    var dom = parser.parseFromString(
        '<!doctype html><body>' + encodedStr,
        'text/html');
    var decodedString = dom.body.textContent;
    //console.log(decodedString);
    return decodedString;
}


var video = document.getElementById("bgvid");
if (document.body.clientWidth >= 1024) {
    video.autoplay = true;
    video.load();

} else {
    video.autoplay = false;
}




window.onload = function () {
    var myRequest = new XMLHttpRequest();

    myRequest.open("GET", "https://opentdb.com/api_category.php", true);

    myRequest.onload = function () {

        if (myRequest.readyState == 4 && myRequest.status == 200) {

            var quizCategoriesData = JSON.parse(myRequest.responseText);
            console.log(quizCategoriesData.trivia_categories);

            for (var i = 0; i < quizCategoriesData.trivia_categories.length; i++) {
                
                
                //Removed following four categories due to errors (Entertainment: Musicals & Theatres, Entertainment: Board Games, Art,, Science: Gadgets)
                if (quizCategoriesData.trivia_categories[i].id == 13 || quizCategoriesData.trivia_categories[i].id == 16 || quizCategoriesData.trivia_categories[i].id == 25 || quizCategoriesData.trivia_categories[i].id == 30) {
                    continue;
                } else {
                    document.getElementById("quizCategory").innerHTML += ('<option value="' + quizCategoriesData.trivia_categories[i].id + '">' + quizCategoriesData.trivia_categories[i].name + '</option>');
                }


            }


        }
    };
    myRequest.send();
};

var answerSelected = false;

function generateQuiz() {



    document.getElementById("quizGenerateButton").disabled = true;

    //document.getElementById("submitAnswerButton").disabled = true;

    userCategory = selectedCategory.options[selectedCategory.selectedIndex].value;
    userDifficulty = selectedDifficulty.options[selectedDifficulty.selectedIndex].value;

    //console.log(userCategory);
    //console.log(userDifficulty);



    //console.log("https://opentdb.com/api.php?amount=10&category=" + userCategory + "&difficulty=" + userDifficulty + "&type=multiple");

    var myRequest = new XMLHttpRequest();

    myRequest.open("GET", "https://opentdb.com/api.php?amount=10&category=" + userCategory + "&difficulty=" + userDifficulty + "&type=multiple", true);

    //myRequest.open("GET", "https://opentdb.com/api.php?amount=10&category=14&difficulty=medium&type=multiple", true);

    //console.log("Ready State: " + myRequest.readyState);
    //console.log("Status: " + myRequest.status);

    myRequest.onload = function () {

        if (myRequest.readyState == 4 && myRequest.status == 200) {


            quizAnswersData = JSON.parse(myRequest.responseText);
            //console.log(quizAnswersData);

            document.getElementById("quizCustom").style.display = "none";
            document.getElementById("headerC").style.display = "none";
            document.getElementById("quizQuestions").style.display = "flex";


            document.getElementById("question").innerHTML = '<u>Question ' + (currentQuestionIndex + 1) + '</u><br/><br/>' + quizAnswersData.results[currentQuestionIndex].question;


            for (var i = 0; i < 3; i++) {
                answersArray.push(quizAnswersData.results[currentQuestionIndex].incorrect_answers[i]);
                //console.log(answersArray[i]);
            }
            answersArray.push(quizAnswersData.results[currentQuestionIndex].correct_answer);
            //console.log(quizAnswersData.results["0"].correct_answer);
            //console.log("");

            answersArray = shuffle(answersArray);
            //console.log(answersArray);

            for (var j = 0; j < answersArray.length; j++) {
                //document.getElementById("quizOptions").innerHTML += ('<input type="radio" name="answer" value="' + answersArray[j] + '"> ' + answersArray[j] + '<br/>');

                document.getElementById("quizOptions").innerHTML += ('<label class="radioButtonLabel"><input type="radio" name="answer" value="' + answersArray[j] + '">' + answersArray[j] + '</label>');
            }

            quizOptions = document.getElementsByName("answer");
            quizOptionsLabels = document.getElementsByClassName("radioButtonLabel");
            //console.log(quizOptions);
            for (var k = 0; k < quizOptions.length; k++) {
                quizOptions[k].addEventListener("click", setAnswer, false);
            }


            //console.log(currentQuestionIndex);
            currentQuestionIndex++;

        }
    };
    myRequest.send();

}

function submitAnswer() {


    for (var m = 0; m < quizOptions.length; m++) {
        if (quizOptions[m].checked) {
            quizOptionsLabels[m].style.cssText = optionsLabelsCSSText;

            answerSelected = true;
            //console.log(answerSelected);
            document.getElementById("errorMessage").style.display = "none";
        } else {
            quizOptionsLabels[m].style.cssText = optionsLabelsCSSTextReverse;
        }
    }
    if (!answerSelected) {
        //console.log(answerSelected);
        document.getElementById("errorMessage").style.display = "block";
    } else {
        userChoicesArray.push(userAnswer);
        if (currentQuestionIndex < 10) {

            //console.log(currentQuestionIndex);
            //document.getElementById("submitAnswerButton").disabled = true;

            //console.log("test");
            //console.log(quizAnswersData);
            document.getElementById("quizOptions").innerHTML = "";

            //console.log(answersArray);
            answersArray = [];
            //console.log(answersArray);

            for (var i = 0; i < 3; i++) {
                answersArray.push(quizAnswersData.results[currentQuestionIndex].incorrect_answers[i]);
                //console.log(answersArray);
            }
            answersArray.push(quizAnswersData.results[currentQuestionIndex].correct_answer);
            //console.log(quizAnswersData.results["0"].correct_answer);
            //console.log("");

            answersArray = shuffle(answersArray);
            //console.log(answersArray);

            document.getElementById("question").innerHTML = '<u>Question ' + (currentQuestionIndex + 1) + '</u><br/><br/>' + quizAnswersData.results[currentQuestionIndex].question;

            //console.log(quizAnswersData.results[currentQuestionIndex].question);

            for (var j = 0; j < answersArray.length; j++) {
                //document.getElementById("quizOptions").innerHTML += ('<input type="radio" name="answer" value="' + answersArray[j] + '"> ' + answersArray[j] + '<br/>');

                document.getElementById("quizOptions").innerHTML += ('<label class="radioButtonLabel"><input type="radio" name="answer" value="' + answersArray[j] + '">' + answersArray[j] + '</label>');
            }

            for (var k = 0; k < quizOptions.length; k++) {
                quizOptions[k].addEventListener("click", setAnswer, false);
            }


            //console.log(userChoicesArray);
            currentQuestionIndex++;

            answerSelected = false;

        } else {
            //console.log(userChoicesArray);


            document.getElementById("quizQuestions").style.display = "none";
            document.getElementById("resultsC").style.display = "inline-flex";


            for (var l = 0; l < userChoicesArray.length; l++) {

                //console.log(userChoicesArray[l] + " | " + quizAnswersData.results[l].correct_answer);

                document.getElementById("correctAnswers").innerHTML += '<li><u>Question ' + (l + 1) + '</u><br/>' + quizAnswersData.results[l].question + '<br/><br/>';

                if (removeCharRef(userChoicesArray[l]) == removeCharRef(quizAnswersData.results[l].correct_answer)) {
                    document.getElementById("correctAnswers").innerHTML += '<strong class="right">' + quizAnswersData.results[l].correct_answer + '</strong><br/><br/></li>';
                    correctAnswersCount++;
                    //console.log(correctAnswersCount);
                    //console.log(userChoicesArray[l]);

                } else {
                    document.getElementById("correctAnswers").innerHTML += '<strong class="wrong">' + userChoicesArray[l] + '<br/></strong><strong class="right">' + quizAnswersData.results[l].correct_answer + '</strong><br/><br/></li>';
                }
            }
            document.getElementById("counter").innerHTML = "You got " + correctAnswersCount + " out of 10!";


            document.getElementById("counter").className = "animated bounceIn";

            document.getElementById("resultsMessage").className = "animated bounceIn";

            document.getElementById("correctAnswers").className = "animated fadeInUp";


            if (correctAnswersCount === 0) {
                resultsMessage = "Wow, you suck!";
            } else if (correctAnswersCount > 0 && correctAnswersCount <= 3) {
                resultsMessage = "Well, it could be worse..";
            } else if (correctAnswersCount > 3 && correctAnswersCount <= 6) {
                resultsMessage = "Not bad! Keep it up!";
            } else if (correctAnswersCount > 6 && correctAnswersCount < 10) {
                resultsMessage = "You're pretty good!";
            } else if (correctAnswersCount === 10) {
                resultsMessage = "It's a perfect 10!";
            } else {
                resultsMessage = "ERROR!";
            }

            document.getElementById("resultsMessage").innerHTML = resultsMessage;
        }

    }




}



function setAnswer() {

    //console.log(userChoicesArray);

    for (var i = 0; i < quizOptions.length; i++) {
        if (quizOptions[i].checked) {
            quizOptionsLabels[i].style.cssText = optionsLabelsCSSText;
            userAnswer = quizOptions[i].value;
            //console.log(userAnswer);

            //document.getElementById("submitAnswerButton").disabled = false;

            document.getElementById("errorMessage").style.display = "none";

            answerSelected = true;
        } else {
            quizOptionsLabels[i].style.cssText = optionsLabelsCSSTextReverse;
        }
    }
}

function tryAgain() {
    location.reload();
}
