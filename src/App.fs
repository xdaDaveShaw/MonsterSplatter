module App.View

open App.State
open App.Types

open Elmish
open Elmish.Navigation

open Fable.Core.JsInterop
open Fable.React
open Fable.React.Props

open Fulma
open Fable.FontAwesome

importAll "../sass/main.sass"

[<Literal>]
let Instructions = @"Press 'start' to begin a game.
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

    let createIcon className =
        Icon.icon [ ] [
            Fa.i [
                Fa.CustomClass className
                Fa.Solid.Heart
            ] [ ] ]

    let getIconClass position =
        if position <= (total - remaining) then
            "dead"
        else
            "alive"

    [1..total]
    |> List.map (getIconClass >> createIcon)

let root model dispatch =
  div
    [] [
      yield Container.container [ ] [
          yield Field.div [] [
            Tag.list [ Tag.List.HasAddons; Tag.List.IsCentered; ] [
              Tag.tag [ Tag.Color Color.IsInfo; Tag.Size IsMedium; ] [
                  Level.level [] [
                    let className = if model.HasJustScored then "scored" else ""
                    yield
                        Label.label [ Label.CustomClass className] [ str (sprintf "score: %d" model.Score) ]
                  ]
              ]
              Tag.tag [ Tag.Color Color.IsPrimary; Tag.Size IsMedium; ] [
                  Level.level [] [
                    Label.label [] [ str (sprintf "high score: %d" model.HighScore) ]
                  ]
              ]

              Tag.tag [ Tag.Color Color.IsWarning; Tag.Size IsMedium; ] [
                  Level.level [] [
                      Label.label [] (createsLivesLabel model.Lives)
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
              p [] [ str Instructions ]
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
                  Icon.icon [ ] [ Fa.i [ Fa.Solid.Times ] [ ] ]
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
        Content.content [
            Content.Option.Modifiers [
                Modifier.TextAlignment (Screen.All, TextAlignment.Centered) ]
         ] [
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
open Elmish.HMR //Must be last

// App
Program.mkProgram init update root
#if DEBUG
|> Program.withConsoleTrace
|> Program.withDebugger
#endif
|> Program.withReactBatched "elmish-app"
|> Program.run
