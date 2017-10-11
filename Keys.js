const debugToConsole = true;
function log(message) {
    if (debugToConsole) {
        console.log(message);
    }
}
function randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}
const numberOfMonsters = 4;
function getNewValue() {
    let randomNumber = randomIntFromInterval(1, numberOfMonsters);
    return String(randomNumber);
}
function enableButton(selector) {
    $(selector).removeAttr("disabled");
}
function disableButton(selector) {
    $(selector).prop("disabled", true);
}
const secondsInAGame = 30;
const tickLengthInMs = 250;
const valueDisplayedForInMs = 1500;
let countdownTimer;
let currentValue;
let currentTarget;
let currentScore = 0;
let canHit = false;
let stopped = false;
let ticksRemainingInGame;
let elapsedTicks = 0;
function setScore(score) {
    currentScore = score;
    $("#score").text(score);
}
function incrementScore() {
    log("incrementing score. current score: " + currentScore);
    setScore(currentScore + 5);
}
function setNewValue(firstValue = false) {
    const faderSpeed = 300;
    log("setNetValue called");
    if (ticksRemainingInGame > 0) {
        let value = getNewValue();
        let changer_img = $("#changer_img");
        changer_img.fadeOut(firstValue ? 0 : faderSpeed, function () {
            let newImg = "images/" + value + ".jpg";
            changer_img.attr("src", newImg);
            currentValue = value;
            log("set current value to: " + value);
            canHit = true;
            log("canHit: true, value: " + value);
            changer_img.fadeIn(faderSpeed);
        });
    }
}
function hit() {
    log("hit called: canHit : " + canHit + " currentValue: " + currentValue + " stopped: " + stopped);
    if (stopped) {
        return;
    }
    if (canHit && currentTarget === currentValue) {
        log("Hit, Target matches Value");
        log("setting canHit: false");
        canHit = false;
        log("set canHit: false");
        incrementScore();
        setNewValue();
        elapsedTicks = 0;
    }
    else if (canHit) {
        log("Missed, disabling hit for 250ms");
        log("setting canHit: false");
        canHit = false;
        log("set canHit: false");
        setTimeout(function () {
            log("setting canHit: true");
            canHit = true;
            log("set canHit: true");
        }, 250);
    }
}
function stopGame() {
    log("Stopped: " + new Date().toISOString());
    canHit = false;
    stopped = true;
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
        countdownTimer = setTimeout(function () {
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
    let targetImg = "images/" + currentTarget + ".jpg";
    $("#target_img").attr("src", targetImg);
    $("#start_text").hide();
    enableButton("#hit");
    ticksRemainingInGame = secondsInAGame * (1000 / tickLengthInMs);
    stopped = false;
    log("Started: " + new Date().toISOString());
    $("#progressBar").progressbar({
        max: ticksRemainingInGame
    });
    setNewValue(true);
    countdownTime();
}
document.onkeypress = function (e) {
    if (e.keyCode === 32 || e.keyCode === 72 || e.keyCode === 104) {
        hit();
    }
};
$(document).ready(function () {
    $("#start").click(start);
    $("#hit").click(hit);
});
//# sourceMappingURL=keys.js.map