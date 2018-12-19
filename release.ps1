dotnet restore

yarn install

#Clear the last deployment
Remove-Item .\deploy\ -Recurse -Force

# Production build the site to the "deploy" folder.
yarn run build

git checkout gh-pages

#Remove old versions of generated JS files
Remove-Item app.*.js*
Remove-Item vendors.*.js*

# Now put the site in the root of the repo.
Get-ChildItem .\deploy | Copy-Item -Destination . -Recurse

# Now start Bash with Jekyll to test the site on.
bash -c "jekyll server"

#git checkout master
