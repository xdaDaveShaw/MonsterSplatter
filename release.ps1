dotnet build

yarn install

Set-Location -Path .\src

dotnet fable yarn-build

Set-Location ..

Copy-Item .\public\ -Filter *.* -Destination .\release\ -Recurse

git checkout gh-play

Get-ChildItem .\release | Copy-Item -Destination . -Recurse

Remove-Item .\release -Recurse

#git checkout fable


