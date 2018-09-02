module App.View

open App.State
open App.Types

open Elmish
open Elmish.Browser.Navigation

open Fable.Core.JsInterop
open Fable.Helpers.React
open Fable.Helpers.React.Props

open Fulma

importAll "../sass/main.sass"

[<Literal>]
let instructions = @"Press 'start' to begin a game.
Press 'hit' (or use Space Bar) when the two mosters match to gain 5 points.
Match as many as you can in the time to earn a high score."

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
      Button.Color IsSuccess
      Button.OnClick (fun _ -> dispatch msg)
    ] [ str text ]


let createsLivesLabel (remaining, total) =
    let dead = String.replicate (total - remaining) "🖤"
    let remain = String.replicate remaining "💗"
    str (dead + remain)

let root model dispatch =
  div
    [] [
      yield Container.container [ ] [
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

              Tag.tag [ Tag.Color Color.IsWarning; Tag.Size IsMedium; ] [
                  Level.level [] [
                      Label.label [] [ createsLivesLabel model.Lives ]
                  ]
              ]
            ]
          ]

          if (model.ShowInfo) then
            yield Notification.notification [ Notification.Color IsInfo ] [
              Notification.delete [
                GenericOption.Props [ OnClick (fun _ -> dispatch HideInfo) ]
              ] []
              strong [] [str "Monster Splatter" ]
              p [] [ str "Monster Splatter is a simple picture matching game." ]
              p [] [ str instructions ]
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
                Button.Color IsDanger
                Button.OnClick (fun _ -> dispatch Reset)
                Button.Disabled (model.GameState = Playing)
                Button.Props [ Title "reset EVERYTHING back to the initial state" ]
              ] [
                  span [] [ str "reset " ]
                  FontAwesome.Icon.faIcon [] [ FontAwesome.Fa.icon FontAwesome.Fa.I.Times ]
              ]
            ]
          ]

          if (model.NewHighScore) then
            yield Field.div [ Field.HasAddonsCentered ] [
                Notification.notification [ Notification.Color IsDanger ] [
                    Heading.h2 [] [
                      str (sprintf "new high score %d !!!" model.HighScore)
                    ]
                ]
            ]

          if (model.GameState = Ended Died) then
            yield Field.div [ Field.HasAddonsCentered ] [
                Notification.notification [ Notification.Color IsDanger ] [
                    Heading.h2 [] [
                      str "game over!"
                    ]
                    Text.p [ Modifiers [ Modifier.TextAlignment (Screen.All, TextAlignment.Centered) ] ] [
                        str "click start to try again"
                    ]
                ]
            ]
        ]

      yield Footer.footer [ ] [
        Content.content [ Content.CustomClass Fulma.TextAlignment.Classes.HasTextCentered ] [
            str "Monster Splatter - Developed by "
            a [ Href "https://taeguk.co.uk/about" ] [ str "Dave Shaw" ]
            p [] [
                str "More information on "
                a [ Href "https://github.com/xdaDaveShaw/MonsterSplatter" ] [ str "GitHub" ]
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
