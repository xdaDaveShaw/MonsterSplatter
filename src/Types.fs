module App.Types

type Msg =
  | StartGame
  | TimerTick
  | NewMonster of string
  | HitPressed
  | Reset

type State = 
  | NotStarted
  | Playing
  | Ended

type Model = {
    TargetMonster: string
    CurrentMonster: string
    Score: int
    GameState: State
    //HasHitBefore
    //HighScore
  }
