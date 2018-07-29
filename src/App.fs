module App.View

open Elmish
open Elmish.Browser.Navigation
open Elmish.Browser.UrlParser
open Fable.Core
open Fable.Core.JsInterop
open Fable.Import
//open Fable.Import.Browser
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
open Fable
open System.ComponentModel


importAll "../sass/main.sass"

let das dispatch = 
  Fable.Import.Browser.window.setInterval (
    (fun _ -> dispatch TimerTick), 1000, [||]
  ) |> ignore

let timer initial = 
  Cmd.ofSub das

let childTile title content =
  Tile.tile [ ] [
      Notification.notification [ Notification.Props [ Style [ Height "100%"; Width "100%" ] ] ]
          (Heading.h2 [ ] [ str title ] :: content)
  ]

let targetTile model = 
  childTile "Target" [
    Image.image [ Image.IsSquare ] [
      img [ Src( sprintf "images\\%s.jpg" model.TargetMonster); ]
    ]
  ]

let currentTile model = 
  childTile "Current" [
    Image.image [ ] [
      img [ Src( sprintf "images\\%s.jpg" model.CurrentMonster); ]
    ]
  ]

let root model dispatch =

  div
    [] [ 
      Container.container [ ] [
          yield Field.div [] [
            Tag.list [ Tag.List.HasAddons; Tag.List.IsCentered; ] [
              Tag.tag [ Tag.Color Color.IsInfo; Tag.Size IsMedium; ] [
                  Level.level [] [
                    Label.label [] [ str (sprintf "Score: %d" model.Score) ]
                  ]
              ]
            ]
          ]

          yield Tile.ancestor [ Tile.Size Tile.Is12 ] [ 
            Tile.parent [ Tile.Size Tile.Is12 ] [
              targetTile model
              currentTile model
            ]
          ]

          yield Button.button [
            Button.IsFullwidth
            Button.OnClick (fun _ -> dispatch StartGame)
            Button.Disabled (model.GameState = Playing)
          ] [ str "Start" ]

          yield Button.button [
            Button.IsFullwidth
            Button.OnClick (fun _ -> dispatch HitPressed)
            Button.Disabled (model.GameState <> Playing)
          ] [ str "Hit" ]
        ]
      ]

open Elmish.React
open Elmish.Debug
open Elmish.HMR

// App
Program.mkProgram init update root
|> Program.withSubscription timer
#if DEBUG
|> Program.withConsoleTrace
|> Program.withDebugger
|> Program.withHMR
#endif
|> Program.withReact "elmish-app"
|> Program.run
