if [[ $# -lt 2 ]] ; then
    echo 'USAGE: sh build.sh <VERSION> <message>'
    echo Latest version: $(git tag | tail -n 1)

    exit 0
fi

cat src/*.js > index.js
git commit index.js -m "Compiled - $2"
git tag -a $1 -m $2
git push origin master --follow-tags
