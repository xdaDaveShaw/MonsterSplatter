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

let update msg model =
  match model, msg with
  | model, StartGame ->
    { model with GameState = Playing }, Cmd.none
  | model, HitPressed ->
    if (model.CurrentMonster = model.TargetMonster) then
      { model with Score = model.Score + 5 }, Cmd.ofMsg (NewMonster "1")
    else
      model, Cmd.none
  | model, NewMonster s ->
    { model with CurrentMonster = s }, Cmd.none