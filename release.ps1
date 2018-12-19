dotnet restore

yarn install

Set-Location -Path .\src

# Production build the site to the "deploy" folder.
yarn run build

Set-Location ..

git checkout gh-pages

#Remove old versions
Remove-Item app.*.js*
Remove-Item vendors.*.js*

# Now put the site in the root of the repo.
Get-ChildItem .\deploy | Copy-Item -Destination . -Recurse

# Now start Bash with Jekyll to test the site on.
bash -c "jekyll server"

#git checkout master
