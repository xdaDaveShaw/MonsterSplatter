/// <reference path="refs/jquery.d.ts"/>
/// <reference path="refs/jqueryui.d.ts"/>

const debugToConsole: boolean = false;

function log(message: string): void {
    if (debugToConsole) {
        console.log(message);
    }
}

function randomIntFromInterval(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function getNewValue(): string {
    let randomChar: number  = randomIntFromInterval(65, 68);
    // return String.fromCharCode(randomChar);
    // temp to ensure non-sequential values
    let newV: string = String.fromCharCode(randomChar);
    if (currentValue === newV) {
        return getNewValue();
    } else {
        return newV;
    }
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

    if (ticksRemainingInGame > 0) {
        let value: string = getNewValue();
        let changer: JQuery = $("#changer");
        changer.fadeOut(firstValue ? 0 : faderSpeed, function (): void {
            changer.text(value);
            currentValue = value;
            log("set current value to: " + value);
            canHit = true;
            log("canhit: true, value: " + value);
            changer.fadeIn(faderSpeed);
        });
    }
}

function hit(): void {
    log("hit called: canHit : " + canHit + " currentValue: " + currentValue);

    if (canHit && currentTarget === currentValue) {
        log("setting canhit: false");
        canHit = false;
        log("set canhit: false");
        incrementScore();
        setNewValue();
        elapsedTicks = 0;
    }
}

function stopGame(): void {
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

document.onkeypress = function (e: KeyboardEvent): void {
    if (e.keyCode === 72 || e.keyCode === 104) { // h (maybe?)
        hit();
    }
};