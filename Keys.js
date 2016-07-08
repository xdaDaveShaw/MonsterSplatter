/// <reference path="refs/jquery.d.ts"/>
function randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}
function getNewValue() {
    var randomChar = randomIntFromInterval(65, 68);
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
//Functions above this line do not change state!
var timer;
var currentValue;
var currentTarget;
var secondsInAGame = 15;
function setNewValue(value) {
    var faderSpeed = 400;
    var changer = $("#changer");
    changer.fadeOut(faderSpeed, function () {
        currentValue = value;
        changer.text(value);
        changer.fadeIn(faderSpeed, function () {
            //Nothing ATM
        });
    });
}
function changeLoop() {
    var timeValueShown = 5000;
    clearInterval(timer);
    var newValue = getNewValue();
    setNewValue(newValue);
    timer = setInterval(function () {
        changeLoop();
    }, timeValueShown);
}
function hit() {
    if (currentTarget === currentValue) {
        changeLoop();
    }
}
function start() {
    currentTarget = getNewValue();
    changeLoop();
    setTimeout(function () {
        clearInterval(timer);
        $("#start").removeAttr("disabled");
    }, secondsInAGame * 1000);
    $("#target").text(currentTarget);
    $("#start").prop("disabled", true);
}
//# sourceMappingURL=Keys.js.map