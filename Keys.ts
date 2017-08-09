/// <reference path="refs/jquery.d.ts"/>
/// <reference path="refs/jqueryui.d.ts"/>

const debugToConsole: boolean = true;

function log(message: string): void {
    if (debugToConsole) {
        console.log(message);
    }
}

function randomIntFromInterval(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

const numberOfMonsters: number = 4;

function getNewValue(): string {
    let randomNumber: number  = randomIntFromInterval(1, numberOfMonsters);
    return String(randomNumber);
}

function enableButton(selector: string): void {
    $(selector).removeAttr("disabled");
}

function disableButton(selector: string): void {
    $(selector).prop("disabled", true);
}

// functions above this line do not change state!

const secondsInAGame: number = 30;          // total length of the game in seconds
const tickLengthInMs: number = 250;         // each tick is a countdown on the timer.
const valueDisplayedForInMs: number = 1500; // how long you have to think about the match.

let countdownTimer: number;
let currentValue: string;
let currentTarget: string;
let currentScore: number = 0;
let canHit: boolean = false;
let stopped: boolean = false;
let ticksRemainingInGame: number;
let elapsedTicks: number = 0;

function setScore(score: number): void {
    currentScore = score;
    $("#score").text(score);
}

function incrementScore(): void  {
    log("incrementing score. current score: " + currentScore);
    setScore(currentScore + 5);
}

function setNewValue(firstValue: boolean = false): void {
    const faderSpeed: number = 300;
    log("setNetValue called");
    if (ticksRemainingInGame > 0) {
        let value: string = getNewValue();
        let changer_img: JQuery = $("#changer_img");
        changer_img.fadeOut(firstValue ? 0 : faderSpeed, function (): void {
            let newImg: string = "images/" + value + ".jpg";
            changer_img.attr("src", newImg);
            currentValue = value;
            log("set current value to: " + value);
            canHit = true;
            log("canHit: true, value: " + value);
            changer_img.fadeIn(faderSpeed);
        });
    }
}

function hit(): void {
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
    } else if (canHit) {
        log("Missed, disabling hit for 250ms");
        log("setting canHit: false");
        canHit = false;
        log("set canHit: false");
        setTimeout(function(): void {
            log("setting canHit: true");
            canHit = true;
            log("set canHit: true");
        }, 250);
    }
}

function stopGame(): void {
    log("Stopped: " + new Date().toISOString());
    canHit = false;
    stopped = true;
    enableButton("#start");
    disableButton("#hit");
    clearTimeout(countdownTimer);
}

function countdownTime(): void {
    if (ticksRemainingInGame <= 0) {
        log("Stopped: " + new Date().toISOString());
        stopGame();
    } else {
        ticksRemainingInGame--;
        log("ticksRemaining: " + ticksRemainingInGame);

        clearTimeout(countdownTimer);

        countdownTimer = setTimeout(function (): void {
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

function start(): void {
    disableButton("#start");
    setScore(0);

    currentTarget = getNewValue();
    let targetImg: string = "images/" + currentTarget + ".jpg";
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

document.onkeypress = function (e: KeyboardEvent): void {
    // space or "h" (maybe?)
    if (e.keyCode === 32 || e.keyCode === 72 || e.keyCode === 104) {
        hit();
    }
};

$(document).ready(function(): void {
    $("#start").click(start);
    $("#hit").click(hit);
});