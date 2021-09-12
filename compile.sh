#!/bin/sh
rm dist.zip
mkdir -p dist
cd src
rollup i.js --format cjs --file ../dist/bundle.js
cp t-tinified.png ../dist/t.png
cd ..
cd dist
#terser bundle.js -o i.js --compress --mangle --mangle-props reserved=["g","img","flush","bkg","cls","col","init","generate","createWave"] --timings --toplevel --module
terser bundle.js -o i.js --compress --mangle --mangle-props --timings --toplevel --module
rm bundle.js
roadroller -O2 i.js -o ./o.js
#roadroller -Zab32 -Zlr1250 -Zmc4 -S0,1,3,6,13,21,25,42,50,355,392,481 i.js -o ./o.js
#/opt/homebrew/opt/gnu-sed/libexec/gnubin/sed 's/\x1f//g' o.js > oo.js
echo "<meta charset="UTF-8"><style>" > index-template.html
cat ../src/i.css >> index-template.html
echo "</style>" >> index-template.html
echo "<canvas id=\"c\"></canvas><canvas id=\"u\"></canvas>" >> index-template.html
echo "<script>" >> index-template.html
cat  ../src/lib/z.js >> index-template.html
echo "</script>" >> index-template.html
#echo "<script>" >> index-template.html
#cat  ../src/lib/noise.js >> index-template.html
#echo "</script>" >> index-template.html
echo "<script>" >> index-template.html
cat ../src/c.js >> index-template.html
echo "</script>" >> index-template.html
echo "<script charset=\"utf8\">" >> index-template.html
cat o.js >> index-template.html
echo "</script><div id="s">Press any key to start</div>" >> index-template.html

cat index-template.html | tr -d '\n' > index.html


rm i.js o.js index-template.html

zip -r ../dist.zip *
cd ..
echo "ect:"
./ect -9 -zip ./dist.zip
