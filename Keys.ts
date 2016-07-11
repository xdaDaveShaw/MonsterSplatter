/// <reference path="refs/jquery.d.ts"/>
/// <reference path="refs/jqueryui.d.ts"/>

const debugToConsole = false;

function log(message: string) {
    if (debugToConsole) {
        console.log(message);
    }
}

function randomIntFromInterval(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function getNewValue() {
    let randomChar = randomIntFromInterval(65, 66);
    // return String.fromCharCode(randomChar);
    // Temp to ensure non-sequential values
    let newV = String.fromCharCode(randomChar);
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

// Functions above this line do not change state!

let changeValueTimer: number;
let countdownTimer: number;
let currentValue: string;
let currentTarget: string;
let currentScore: number = 0;
let canHit = false;
let ticksRemaining: number;
const secondsInAGame = 10;
const tickSize = 500;

function setScore(score: number) {
    currentScore = score;
    $("#score").text(score);
}

function incrementScore() {
    log("incrementing score. current score: "  + currentScore);
    setScore(currentScore + 5);
}

function setNewValue(value: string) {
    const faderSpeed = 300;

    if (ticksRemaining > 0) {
        let changer = $("#changer");
        changer.fadeOut(faderSpeed, function () {
            changer.text(value);
            changer.fadeIn(faderSpeed, function() {
                // Nothing ATM
                currentValue = value;
                log("set current value to: " + value);

                canHit = true;
                log("canhit: true, value: " + value);
            });
        });
    }
}

function changeLoop() {
    const timeValueShown = 2500;

    let newValue = getNewValue();

    clearInterval(changeValueTimer);

    setNewValue(newValue);

    changeValueTimer = setInterval(function() {
        changeLoop();
    }, timeValueShown);
}

function hit() {
    log("hit called: canHit : " + canHit + " currentValue: " + currentValue);

    if (canHit && currentTarget === currentValue) {
        log("setting canhit: false");
        canHit = false;
        log("set canhit: false");
        incrementScore();
        changeLoop();
    }
}

function stopGame() {
    enableButton("#start");
    disableButton("#hit");
    clearInterval(changeValueTimer);
    clearTimeout(countdownTimer);
}

function countdownTime() {
    if (ticksRemaining === 0) {
        log("Stopped: " + new Date().toISOString());
        stopGame();
    }
    else {
        ticksRemaining--;
        log("ticksRemaining: " + ticksRemaining);

        clearTimeout(countdownTimer);

        countdownTimer = setTimeout(function() {
            countdownTime();
        }, tickSize);
    }
    $("#progressBar").progressbar("option", "value", ticksRemaining);
}

function start() {
    disableButton("#start");
    setScore(0);

    currentTarget = getNewValue();
    $("#target").text(currentTarget);

    changeLoop();
    enableButton("#hit");

    ticksRemaining = secondsInAGame * (1000 / tickSize);

    log("Started: " + new Date().toISOString());

    $("#progressBar").progressbar({
        max: ticksRemaining});

    countdownTime();
}