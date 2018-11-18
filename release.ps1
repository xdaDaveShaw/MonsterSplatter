dotnet restore

yarn install

Set-Location -Path .\src

# Production build the site *into public
dotnet fable yarn-build

Set-Location ..

# Copy the site to a folder not under source control so it won't be removed on Checkout of GH Pages.
Copy-Item .\public\ -Filter *.* -Destination .\release\ -Recurse

git checkout gh-pages

# Now put the site in the root of the repo.
Get-ChildItem .\release | Copy-Item -Destination . -Recurse

# And sack of the copy
Remove-Item .\release -Recurse

# Now start Bash with Jekyll to test the site on.
bash -c "jekyll server"

#git checkout master
