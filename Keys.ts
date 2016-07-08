/// <reference path="refs/jquery.d.ts"/>

function randomIntFromInterval(min : number, max : number)
{
    return Math.floor(Math.random()*(max-min+1)+min);
}

function getNewValue() {
    var randomChar = randomIntFromInterval(65, 66);
    //return String.fromCharCode(randomChar);
    //Temp to ensure non-sequential values
    var newV = String.fromCharCode(randomChar);
    if (currentValue === newV) {
        return getNewValue();
    }
    else {
        return newV;
    }
}

function enableButton(selector: string) {
    $(selector).removeAttr("disabled");    
}

function disableButton(selector: string) {
    $(selector).prop("disabled", true);    
}

//Functions above this line do not change state!

var timer : number;
var currentValue : string;
var currentTarget : string;
var currentScore : number = 0;
const secondsInAGame = 15; 

function setScore(score: number) {
    currentScore = score;
    $("#score").text(score);
}

function incrementScore() {
    setScore(currentScore + 5);
}

function setNewValue(value: string) {
    const faderSpeed = 400;

    var changer = $("#changer");
    changer.fadeOut(faderSpeed, function () {
        currentValue = value;
    	changer.text(value);
        changer.fadeIn(faderSpeed, function() {
            //Nothing ATM
        })
    });
}

function changeLoop() {
    const timeValueShown = 2500;
    
    var newValue = getNewValue();

    clearInterval(timer);

    setNewValue(newValue);

    timer = setInterval(function() {
        changeLoop(); 
    }, timeValueShown);
}

function hit() {
    if (currentTarget === currentValue) {
        incrementScore();
        changeLoop();
    }
}

function stopGame() {
    clearInterval(timer);
    enableButton("#start");
    disableButton("#hit");
}

function start() {
    disableButton("#start");
    setScore(0);

    currentTarget = getNewValue();
    $("#target").text(currentTarget);
    
    changeLoop();
    enableButton("#hit");
    
    setTimeout(function() {
        stopGame();
    }, secondsInAGame * 1000);    
}