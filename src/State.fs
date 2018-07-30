module App.State

open Elmish
open Elmish.Browser.Navigation
open Elmish.Browser.UrlParser
open Fable.Import.Browser
open Types
open Fable.PowerPack

let init () =
  { TargetMonster = "ready"
    CurrentMonster = "ready"
    Score = 0
    GameState = NotStarted
    HasHitBefore = false
    Progress = 100
    HighScore = 0 }, Cmd.none

let random = new System.Random()

let rec getNextMonster current =
  let rand = string (random.Next(4) + 1)
  if current <> rand then
    rand
  else
    getNextMonster current
  
let waitOneSecondImp =
  promise {
    do! Promise.sleep 1000
  }
let waitOneSecond _ = waitOneSecondImp

let update msg model =
  let target = model.TargetMonster
  
  match model, msg with
  | _, StartGame ->
    { model with 
        GameState = Playing
        Progress = 100
        TargetMonster = (getNextMonster target)
        CurrentMonster = "ready"
        Score = 0 }, 
    Cmd.ofPromise waitOneSecond () (fun _ -> TimerTick) Error
  
  | model, HitPressed when model.CurrentMonster = target && not model.HasHitBefore ->
    { model with 
        Score = model.Score + 5; 
        HasHitBefore = true }, 
    Cmd.none
  
  | _, HitPressed -> model, Cmd.none
  
  | { GameState = Playing; Progress = 0; }, TimerTick ->
    let highScore = System.Math.Max(model.Score, model.HighScore)
    { model with 
        GameState = Ended
        HighScore = highScore }, 
    Cmd.none

  | { GameState = Playing }, TimerTick ->
    { model with 
        Progress = model.Progress - 5 }, 
    Cmd.ofMsg (NewMonster (getNextMonster model.CurrentMonster))

  | _, TimerTick -> model, Cmd.none
  
  | _, NewMonster s ->
    { model with 
        CurrentMonster = s; 
        HasHitBefore = false }, 
    Cmd.ofPromise waitOneSecond () (fun _ -> TimerTick) Error
  
  | _, Reset -> init()

  | _, Error _ -> init() //TODO