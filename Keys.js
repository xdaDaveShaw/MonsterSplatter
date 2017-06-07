var debugToConsole = true;
function log(message) {
    if (debugToConsole) {
        console.log(message);
    }
}
function randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}
var numberOfMonsters = 4;
function getNewValue() {
    var randomNumber = randomIntFromInterval(1, numberOfMonsters);
    return String(randomNumber);
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
    log("setNetValue called");
    if (ticksRemainingInGame > 0) {
        var value_1 = getNewValue();
        var changer_img_1 = $("#changer_img");
        changer_img_1.fadeOut(firstValue ? 0 : faderSpeed, function () {
            var newImg = "images/" + value_1 + ".jpg";
            changer_img_1.attr("src", newImg);
            currentValue = value_1;
            log("set current value to: " + value_1);
            canHit = true;
            log("canhit: true, value: " + value_1);
            changer_img_1.fadeIn(faderSpeed);
        });
    }
}
function hit() {
    log("hit called: canHit : " + canHit + " currentValue: " + currentValue);
    if (canHit && currentTarget === currentValue) {
        log("Hit, Target matches Value");
        log("setting canhit: false");
        canHit = false;
        log("set canhit: false");
        incrementScore();
        setNewValue();
        elapsedTicks = 0;
    }
    else {
        log("Missed, disabling hit for 250ms");
        log("setting canhit: false");
        canHit = false;
        log("set canhit: false");
        setTimeout(function () {
            log("setting canhit: true");
            canHit = true;
            log("set canhit: true");
        }, 250);
    }
}
function stopGame() {
    canHit = false;
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
    var targetImg = "images/" + currentTarget + ".jpg";
    $("#target_img").attr("src", targetImg);
    $("#start_text").hide();
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
    if (e.keyCode === 32 || e.keyCode === 72 || e.keyCode === 104) {
        hit();
    }
};
$(document).ready(function () {
    $("#start").click(start);
    $("#hit").click(hit);
});
//# sourceMappingURL=keys.js.map