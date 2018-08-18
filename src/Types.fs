module App.Types

open System

type Msg =
  | StartGame
  | TimerTick
  | NewMonster of string
  | HitPressed
  | Reset
  | HideInfo
  | Error of Exception

type State =
  | NotStarted
  | Playing
  | Ended

type Model = {
    TargetMonster: string
    CurrentMonster: string
    Score: int
    GameState: State
    HasHitBefore: bool
    Progress: int
    NewHighScore: bool
    HighScore: int
    ShowInfo: bool
  }
