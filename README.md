# Monster splatter

## About

This is my learning / experimentation in Fable / Elmish / Fulma
something that actually does more than your average DOM manipulation.

I'm writing it for my daughter who likes to sit with me when I'm working
and play little games like this.

As it stands, it is very basic, but I plan to try and integrate tests
as well as more features.

I've already learnt a good deal getting it going.

## Release Process

To release a new version of the site from a branch run `.\release.ps1`.

This will:

- Build the site in Release mode into `deploy`
- Check out the `gh-pages` branch
- Delete previous version of the JS files with a hash in their name.
- Overwrite all the files in the branch with the files in the `deploy` folder.

From there, you can review the pending changes and check everything works
before committing the code and pushing it.
