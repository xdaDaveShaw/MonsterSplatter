module App.Types

open System

type Msg =
  | StartGame
  | TimerTick
  | NewMonster of string
  | HitPressed
  | Reset
  | HideInfo
  | PersistState
  | Error of Exception

type GameEnd =
  | Natural
  | Died

type State =
  | NotStarted
  | Playing
  | Ended of GameEnd

type Model = {
    TargetMonster: string
    CurrentMonster: string
    Score: int
    HasJustScored: bool
    GameState: State
    HasHitBefore: bool
    Progress: int
    NewHighScore: bool
    HighScore: int
    ShowInfo: bool
    Lives: int * int
  }
