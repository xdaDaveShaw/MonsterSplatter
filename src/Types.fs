module App.Types

open System

type Msg =
  | StartGame
  | TimerTick
  | NewMonster of string
  | HitPressed
  | Reset
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
    HighScore: int
  }
