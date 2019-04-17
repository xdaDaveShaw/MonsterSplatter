module App.Storage

open Fable.Core
open Fable.Core.JsInterop
open Types

type PersistedModel = {
    ShowInfo: bool
    HighScore: int
}

let defaultPersistedModel =
  { PersistedModel.ShowInfo = true;
    HighScore = 0; }

let key = "monsterSplatter"


let loadFromStorage () : PersistedModel option =
    !!Browser.WebStorage.localStorage.getItem(key)
    |> Option.map (fun json -> !!JS.JSON.parse(json))

let saveToStorage pModel =
    Browser.WebStorage.localStorage.setItem(key, JS.JSON.stringify pModel)

let clearStorage () =
    Browser.WebStorage.localStorage.removeItem key

let mapToPModel (model: Model) =
    { ShowInfo = model.ShowInfo
      HighScore = model.HighScore }
