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
    GameState = NotStarted
    HasHitBefore = false }, Cmd.none

let random = new System.Random()

let rec getNextMonster current =
  let rand = string (random.Next(4) + 1)
  if current <> rand then
    rand
  else
    getNextMonster current
  
let update msg model =
  let target = model.TargetMonster
  match model, msg with
  | _, StartGame ->
    { model with GameState = Playing; TargetMonster = (getNextMonster "") }, Cmd.none
  | model, HitPressed when model.CurrentMonster = target && not model.HasHitBefore ->
    { model with Score = model.Score + 5; HasHitBefore = true }, Cmd.none
  | _, HitPressed -> model, Cmd.none
  | { GameState = Playing }, TimerTick ->
    model, Cmd.ofMsg (NewMonster (getNextMonster model.CurrentMonster))
  | _, TimerTick -> model, Cmd.none
  | _, NewMonster s ->
    { model with CurrentMonster = s; HasHitBefore = false }, Cmd.none
  | _, Reset -> init()