module App.State

open Elmish
open Elmish.Browser.Navigation
open Elmish.Browser.UrlParser
open Fable.Import.Browser
open Types


let init () =
  { TargetMonster = "ready"
    CurrentMonster = "ready"
    Score = 0 }, Cmd.none

let update msg model =
  match model, msg with
  | model, HitPressed ->
    if (model.CurrentMonster = model.TargetMonster) then
      { model with Score = model.Score + 5 }, Cmd.none
    else
      model, Cmd.none
  | _, _ -> model, Cmd.none
