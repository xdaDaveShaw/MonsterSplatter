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
function changeLoop(x) {
    if (x === 0) {
        return;
    }
    clearTimeout(timer);
    var y = x;
    if (y > 0) {
        var newValue = getNewValue();
        setNewValue(newValue);
        timer = setTimeout(function () {
            changeLoop(y);
        }, 5000);
        y--;
    }
}
function hit() {
    changeLoop(5);
}
function start() {
    changeLoop(20);
}
//# sourceMappingURL=Keys.js.map