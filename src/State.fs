module App.State

open Elmish
open Fable.PowerPack
open Types

let init () =
  { TargetMonster = "ready"
    CurrentMonster = "ready"
    Score = 0
    GameState = NotStarted
    HasHitBefore = false
    Progress = 100
    NewHighScore = false
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
        NewHighScore = false
        Score = 0 },
    Cmd.ofPromise waitOneSecond () (fun _ -> TimerTick) Error

  | model, HitPressed when model.CurrentMonster = target && not model.HasHitBefore ->
    { model with
        Score = model.Score + 5;
        HasHitBefore = true },
    Cmd.none

  | _, HitPressed -> model, Cmd.none

  | { GameState = Playing; Progress = 0; }, TimerTick ->
    { model with
        GameState = Ended
        NewHighScore = model.Score > model.HighScore
        HighScore = System.Math.Max(model.Score, model.HighScore) },
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
