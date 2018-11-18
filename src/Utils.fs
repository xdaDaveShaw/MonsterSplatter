[<AutoOpen>]
module Utils

open Elmish

module Cmd =
    let afterTimeout n (msg: 't) : Cmd<'t> =
        [ fun dispatch ->
            async {
                do! Async.Sleep n
                do (dispatch msg)
            }
            |> Async.StartImmediate
        ]
