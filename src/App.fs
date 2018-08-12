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

let monsterLevel title imagePath =
    Level.item [ Level.Item.HasTextCentered; ] [
      div [] [
          Level.title [] [ str title ]
          Level.item [] [
              Image.image [ Image.Is128x128 ] [
                img [ Src( sprintf "images\\%s.jpg" imagePath); ]
              ]
          ]
      ]
    ]

let createMainButton dispatch gameState =
    let text, msg  =
        if gameState = Playing then
            "hit", HitPressed
        else
            "start", StartGame

    Button.button [
        Button.OnClick (fun _ -> dispatch msg)
    ] [ str text ]

let root model dispatch =
  div
    [] [
      Container.container [ ] [
          yield Field.div [] [
            Tag.list [ Tag.List.HasAddons; Tag.List.IsCentered; ] [
              Tag.tag [ Tag.Color Color.IsInfo; Tag.Size IsMedium; ] [
                  Level.level [] [
                    Label.label [] [ str (sprintf "score: %d" model.Score) ]
                  ]
              ]
              Tag.tag [ Tag.Color Color.IsPrimary; Tag.Size IsMedium; ] [
                  Level.level [] [
                    Label.label [] [ str (sprintf "high score: %d" model.HighScore) ]
                  ]
              ]
            ]
          ]

          yield Level.level [] [
              monsterLevel "target" model.TargetMonster
              monsterLevel "current" model.CurrentMonster
          ]

          yield Progress.progress [
            Progress.Size IsLarge
            Progress.Value model.Progress;
            Progress.Max 100;
          ] []

          yield Level.level [] [
            Level.item[] [
              createMainButton dispatch model.GameState
            ]

            Level.item [] [
              Button.button [
                Button.OnClick (fun _ -> dispatch Reset)
                Button.Disabled (model.GameState = Playing)
              ] [ str "reset" ]
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
