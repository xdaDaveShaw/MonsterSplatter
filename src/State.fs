module App.State

open Elmish
open Elmish.Browser.Navigation
open Elmish.Browser.UrlParser
open Fable.Import.Browser
open Types


let init () =
  { TargetMonster = "ready"
    CurrentMonster = "ready"
    Score = 0
    GameState = NotStarted }, Cmd.none

let random = new System.Random()

let rec getNextMonster current =
  let rand = string (random.Next(4) + 1)
  if current <> rand then
    rand
  else
    getNextMonster current
  
let update msg model =
  match model, msg with
  | _, StartGame ->
    { model with GameState = Playing; TargetMonster = (getNextMonster "") }, Cmd.none
  | _, HitPressed ->
    if (model.CurrentMonster = model.TargetMonster) then
      { model with Score = model.Score + 5 }, Cmd.none
    else
      model, Cmd.none
  | { GameState = Playing }, TimerTick ->
    model, Cmd.ofMsg (NewMonster (getNextMonster model.CurrentMonster))
  | _, TimerTick -> model, Cmd.none
  | _, NewMonster s ->
    { model with CurrentMonster = s }, Cmd.none