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
    var randomChar = randomIntFromInterval(65, 68);
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
var secondsInAGame = 30;
var tickLengthInMs = 250;
var valueDisplayedForInMs = 1500;
var countdownTimer;
var currentValue;
var currentTarget;
var currentScore = 0;
var canHit = false;
var ticksRemainingInGame;
var elapsedTicks = 0;
function setScore(score) {
    currentScore = score;
    $("#score").text(score);
}
function incrementScore() {
    log("incrementing score. current score: " + currentScore);
    setScore(currentScore + 5);
}
function setNewValue(firstValue) {
    if (firstValue === void 0) { firstValue = false; }
    var faderSpeed = 300;
    if (ticksRemainingInGame > 0) {
        var value_1 = getNewValue();
        var changer_1 = $("#changer");
        changer_1.fadeOut(firstValue ? 0 : faderSpeed, function () {
            changer_1.text(value_1);
            currentValue = value_1;
            log("set current value to: " + value_1);
            canHit = true;
            log("canhit: true, value: " + value_1);
            changer_1.fadeIn(faderSpeed);
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
    $("#target").text(currentTarget);
    enableButton("#hit");
    ticksRemainingInGame = secondsInAGame * (1000 / tickLengthInMs);
    log("Started: " + new Date().toISOString());
    $("#progressBar").progressbar({
        max: ticksRemainingInGame
    });
    setNewValue(true);
    countdownTime();
}
document.onkeypress = function (e) {
    if (e.keyCode === 72 || e.keyCode === 104) {
        hit();
    }
};
//# sourceMappingURL=keys.js.map