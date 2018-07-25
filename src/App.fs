module App.View

open Elmish
open Elmish.Browser.Navigation
open Elmish.Browser.UrlParser
open Fable.Core
open Fable.Core.JsInterop
open Fable.Import
open Fable.Import.Browser
open Types
open App.State
open Fable.Helpers.React
open Fable.Helpers.React.Props

open Fulma
open Fulma.Layouts
open Fulma.Elements
open Fulma.Elements.Form
open Fulma.Extra.FontAwesome
open Fulma.Components
open Fulma.BulmaClasses
open Fulma.BulmaClasses.Bulma


importAll "../sass/main.sass"


let targetTile = 
  Tile.child [] [
    div [] [
      img [ Src "images\\ready.jpg" ]
    ]
  ]

let currentTile = 
  Tile.child [] [
    div [] [
      img [ Src "images\\ready.jpg" ]
    ]
  ]

let root model dispatch =

  div
    [] [ 
      Container.container [] [
        yield Tile.ancestor [] [ 
          Tile.parent [ Tile.is4 ] [
            targetTile
            currentTile
          ]
        ]
      ]
    ]

open Elmish.React
open Elmish.Debug
open Elmish.HMR

// App
Program.mkProgram init update root
#if DEBUG
|> Program.withConsoleTrace
|> Program.withDebugger
|> Program.withHMR
#endif
|> Program.withReact "elmish-app"
|> Program.run
