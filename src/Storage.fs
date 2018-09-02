module App.Storage

open Fable.Core.JsInterop
open Fable.Import
open Types

type PersistedModel = {
    ShowInfo: bool
}

let defaultPersistedModel =
  { PersistedModel.ShowInfo = true; }

let loadFromStorage () : PersistedModel option =
    !!Browser.localStorage.getItem("monsterSplatter")
    |> Option.map (fun json -> !!JS.JSON.parse(json))

let saveToStorage pModel =
    Browser.localStorage.setItem("monsterSplatter", JS.JSON.stringify pModel)

let mapToPModel (model: Model) =
    { ShowInfo = model.ShowInfo }
