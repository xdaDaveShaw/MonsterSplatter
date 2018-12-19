module App.State

open Elmish
open Fable.PowerPack
open Storage
open Types

let maxLives = 5

let createDefaultModel (pModel : PersistedModel) =
  { TargetMonster = "ready"
    CurrentMonster = "ready"
    Score = 0
    GameState = NotStarted
    HasHitBefore = false
    HasJustScored = false
    Progress = 100
    NewHighScore = false
    HighScore = pModel.HighScore
    Lives = maxLives, maxLives
    ShowInfo = pModel.ShowInfo }

let init () =
  let model =
    defaultArg (loadFromStorage()) defaultPersistedModel
    |> createDefaultModel

  model, Cmd.none

let random = new System.Random()

let rec getNextMonster current =
  let rand = string (random.Next(4) + 1)
  if current <> rand then
    rand
  else
    getNextMonster current

let delayTime = 1000

let removeLife (remaining, total) =
    remaining - 1, total

let update msg model =
  let target = model.TargetMonster

  match model, msg with
  //Start New Game
  | _, StartGame ->
    { model with
        GameState = Playing
        Progress = 100
        TargetMonster = (getNextMonster target)
        CurrentMonster = (getNextMonster target)
        NewHighScore = false
        HasJustScored = false
        HasHitBefore = false
        Lives = maxLives, maxLives
        Score = 0 },
    Cmd.afterTimeout delayTime TimerTick

  //Successful Hit (First)
  | model, HitPressed when model.CurrentMonster = target && not model.HasHitBefore ->
    { model with
        Score = model.Score + 5;
        HasJustScored = true
        HasHitBefore = true },
    Cmd.none

  // Hit Missed (First)
  | { HasHitBefore = false }, HitPressed ->
    { model with
        Lives = removeLife model.Lives;
        HasHitBefore = true },
    Cmd.none

  // Second Hit - Do Nothing
  | _, HitPressed ->
    model, Cmd.none

  //Ran out of Lives
  | { GameState = Playing; Lives = 0, _ }, TimerTick ->
    { model with GameState = Ended Died },
    Cmd.none

  //End of Game
  | { GameState = Playing; Progress = 0; }, TimerTick ->
    { model with
        GameState = Ended Natural
        NewHighScore = model.Score > model.HighScore
        HighScore = System.Math.Max(model.Score, model.HighScore) },
    Cmd.ofMsg PersistState

  //Timer Ticking While Playing
  | { GameState = Playing }, TimerTick ->
    { model with
        Progress = model.Progress - 5 },
    getNextMonster model.CurrentMonster |> NewMonster |> Cmd.ofMsg

  //Timer when not Playing
  | _, TimerTick -> model, Cmd.none

  // Request for New Monster
  | _, NewMonster s ->
    { model with
        CurrentMonster = s;
        HasJustScored = false;
        HasHitBefore = false },
    Cmd.afterTimeout delayTime TimerTick

  //Reset the Game
  | _, Reset ->
    clearStorage()
    init()

  //Hide the infomation notifiation.
  | _, HideInfo ->
    { model with ShowInfo = false },
    Cmd.ofMsg PersistState

  | _, PersistState ->
    saveToStorage (mapToPModel model)
    model, Cmd.none

  //Something broke
  | _, Error _ -> init() //TODO
