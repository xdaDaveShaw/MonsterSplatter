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
    let randomChar = randomIntFromInterval(65, 68);
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

const secondsInAGame = 30;
const tickLengthInMs = 250;
const valueDisplayedForInMs = 1500;

let countdownTimer: number;
let currentValue: string;
let currentTarget: string;
let currentScore: number = 0;
let canHit = false;
let ticksRemainingInGame: number;
let elapsedTicks: number = 0;

function setScore(score: number) {
    currentScore = score;
    $("#score").text(score);
}

function incrementScore() {
    log("incrementing score. current score: "  + currentScore);
    setScore(currentScore + 5);
}

function setNewValue(firstValue: boolean = false) {
    const faderSpeed = 300;

    if (ticksRemainingInGame > 0) {
        let value = getNewValue();
        let changer = $("#changer");
        changer.fadeOut(firstValue ? 0 : faderSpeed, function () {
            changer.text(value);
            currentValue = value;
            log("set current value to: " + value);
            canHit = true;
            log("canhit: true, value: " + value);
            changer.fadeIn(faderSpeed);
        });
    }
}

function hit() {
    log("hit called: canHit : " + canHit + " currentValue: " + currentValue);

    if (canHit && currentTarget === currentValue) {
        log("setting canhit: false");
        canHit = false;
        log("set canhit: false");
        incrementScore();
        setNewValue();
    }
}

function stopGame() {
    enableButton("#start");
    disableButton("#hit");
    clearTimeout(countdownTimer);
}

function countdownTime() {
    if (ticksRemainingInGame <= 0) {
        log("Stopped: " + new Date().toISOString());
        stopGame();
    }
    else {
        ticksRemainingInGame--;
        log("ticksRemaining: " + ticksRemainingInGame);

        clearTimeout(countdownTimer);

        countdownTimer = setTimeout(function() {
            if (elapsedTicks * tickLengthInMs >= valueDisplayedForInMs) {
                elapsedTicks = 0;
                setNewValue();
            }
            elapsedTicks++;

            countdownTime();
        }, tickLengthInMs);
    }
    $("#progressBar").progressbar("option", "value", ticksRemainingInGame);
}

function start() {
    disableButton("#start");
    setScore(0);

    currentTarget = getNewValue();
    $("#target").text(currentTarget);

    enableButton("#hit");

    ticksRemainingInGame = secondsInAGame * (1000 / tickLengthInMs);

    log("Started: " + new Date().toISOString());

    $("#progressBar").progressbar({
        max: ticksRemainingInGame});

    setNewValue(true);

    countdownTime();
}

document.onkeypress = function(e) {
    if (e.keyCode === 72 || e.keyCode === 104) {
        hit();
    }
};