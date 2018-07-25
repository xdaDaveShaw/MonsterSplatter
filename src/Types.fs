module App.Types

type Msg =
  | NewMonster of string
  | HitPressed

type Model = {
    TargetMonster: string
    CurrentMonster: string
    Score: int
    //HasHitBefore
    //Game State
    //HighScore
  }
