module App.View

open App.State
open App.Types

open Elmish
open Elmish.Browser.Navigation

open Fable.Core.JsInterop
open Fable.Helpers.React
open Fable.Helpers.React.Props

open Fulma
open Fulma.Layouts
open Fulma.Elements
open Fulma.Elements.Form


importAll "../sass/main.sass"

let childTile title content =
  Tile.tile [ Tile.Size Tile.Is6; Tile.IsVertical; Tile.IsChild; ]
    (Heading.h2 [ ] [ str title ] :: content)

let targetTile model =
  childTile "Target" [
    Image.image [ Image.Is128x128 ] [
      img [ Src( sprintf "images\\%s.jpg" model.TargetMonster); ]
    ]
  ]

let currentTile model =
  childTile "Current" [
    Image.image [ Image.Is128x128 ] [
      img [ Src( sprintf "images\\%s.jpg" model.CurrentMonster); ]
    ]
  ]

let root model dispatch =

  div
    [] [
      Container.container [ ] [
          yield Field.div [] [
            Tag.list [ Tag.List.HasAddons; Tag.List.IsCentered; ] [
              Tag.tag [ Tag.Color Color.IsPrimary; Tag.Size IsMedium; ] [
                  Level.level [] [
                    Label.label [] [ str (sprintf "High Score: %d" model.HighScore) ]
                  ]
              ]
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

          yield Progress.progress [
            Progress.Size IsLarge
            Progress.Value model.Progress;
            Progress.Max 100;
          ] []

          yield Level.level [] [
            Level.item[] [
              yield Button.button [
                Button.OnClick (fun _ -> dispatch StartGame)
                Button.Disabled (model.GameState = Playing)
              ] [ str "Start" ]
            ]
            Level.item[] [
              yield Button.button [
                Button.OnClick (fun _ -> dispatch HitPressed)
                Button.Disabled (model.GameState <> Playing)
              ] [ str "Hit" ]
            ]
            Level.item[] [
              yield Button.button [
                Button.OnClick (fun _ -> dispatch Reset)
                Button.Disabled (model.GameState = Playing)
              ] [ str "Reset" ]
            ]
          ]

          if (model.NewHighScore) then
              yield Field.div [ Field.HasAddonsCentered ] [
                  Notification.notification [ Notification.Color IsDanger ] [
                      Heading.h2 [] [
                        str (sprintf "New High Score %d !!!" model.HighScore)
                      ]
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
