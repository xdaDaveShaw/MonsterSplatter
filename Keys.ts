/// <reference path="refs/jquery.d.ts"/>

function randomIntFromInterval(min : number, max : number)
{
    return Math.floor(Math.random()*(max-min+1)+min);
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

var timer : number;
var currentValue : string;
var currentTarget : string;
const secondsInAGame = 60; 

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

function changeLoop(x : number) {
    if (x === 0) {
        return;
    }

    const timeValueShown = 5000;
    clearInterval(timer);

    var y = x;

    if (y > 0) {
        var newValue = getNewValue();
        setNewValue(newValue);

        timer = setInterval(function() {
           changeLoop(y); 
        }, timeValueShown);
        y--;    
    }
}

function hit() {
    if (currentTarget === currentValue) {
        changeLoop(5);
    }
}

function start() {
    currentTarget = getNewValue();
    changeLoop(20);
    $("#target").text(currentTarget);
    $("#start").prop("disabled", true);
}