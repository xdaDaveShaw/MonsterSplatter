/// <reference path="refs/jquery.d.ts"/>
/// <reference path="refs/jqueryui.d.ts"/>
var debugToConsole = false;
function log(message) {
    if (debugToConsole) {
        console.log(message);
    }
}
function randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}
function getNewValue() {
    var randomChar = randomIntFromInterval(65, 66);
    // return String.fromCharCode(randomChar);
    // Temp to ensure non-sequential values
    var newV = String.fromCharCode(randomChar);
    if (currentValue === newV) {
        return getNewValue();
    }
    else {
        return newV;
    }
}
function enableButton(selector) {
    $(selector).removeAttr("disabled");
}
function disableButton(selector) {
    $(selector).prop("disabled", true);
}
// Functions above this line do not change state!
var changeValueTimer;
var countdownTimer;
var currentValue;
var currentTarget;
var currentScore = 0;
var canHit = false;
var ticksRemaining;
var secondsInAGame = 10;
var tickSize = 500;
function setScore(score) {
    currentScore = score;
    $("#score").text(score);
}
function incrementScore() {
    log("incrementing score. current score: " + currentScore);
    setScore(currentScore + 5);
}
function setNewValue(value) {
    var faderSpeed = 300;
    if (ticksRemaining > 0) {
        var changer_1 = $("#changer");
        changer_1.fadeOut(faderSpeed, function () {
            changer_1.text(value);
            changer_1.fadeIn(faderSpeed, function () {
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
    var timeValueShown = 2500;
    var newValue = getNewValue();
    clearInterval(changeValueTimer);
    setNewValue(newValue);
    changeValueTimer = setInterval(function () {
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
        countdownTimer = setTimeout(function () {
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
        max: ticksRemaining });
    countdownTime();
}
//# sourceMappingURL=Keys.js.map