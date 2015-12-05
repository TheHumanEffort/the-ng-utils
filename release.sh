if [[ $# -lt 2 ]] ; then
    echo 'USAGE: sh build.sh <VERSION> <message>'
    echo Latest version: $(git tag | tail -n 1)

    exit 0
fi
echo Compiling
cat src/*.js > index.js
echo Committing index
git commit index.js -m "Compiled - $2"
echo version bump in json
node_modueles/.bin/json -I -f package.json -e 'this.version = "'$1'"'
echo committing versoin bump
git commit package.json -m "Version bump."
echo tagging.. 
git tag -a $1 -m "$2"
echo pushing up
git push origin master --follow-tags
git push origin $1
