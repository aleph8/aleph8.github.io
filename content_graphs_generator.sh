#!/bin/bash

SPECIALTIES_PATH="./src/graphs/"
ROOT_PATH=$(pwd)

for SPECIALTY in $(ls $SPECIALTIES_PATH); do

  mkdir -p dist/graphs/$SPECIALTY

  cd $SPECIALTIES_PATH$SPECIALTY

  cp index.html ../../../dist/graphs/$SPECIALTY/
  cp -r images/ ../../../dist/graphs/$SPECIALTY/

  cat << EOF > $SPECIALTY.json
{
  "nodes": [],
  "links": []
}
EOF

  for MARKDOWN_FILE in $(ls *.md); do
     ## TODO: READ THE FILE ONLY ONE TIME, METADATA WITH: sed -n '/^---/,/^---/p'	  
	  TITLE=$(cat $MARKDOWN_FILE | grep -o 'title:.*' | head -n 1 | sed 's/title://g')
	  ID=$(cat $MARKDOWN_FILE | grep -o 'id:.*' | head -n 1 | sed 's/id://g' | tr -d " ")
	  GROUP=$(cat $MARKDOWN_FILE | grep -o 'group:.*' | head -n 1 | sed 's/group://g' | tr -d " ")
	  LINKS=$(cat $MARKDOWN_FILE | sed  -n "/links:/,/---/p" | grep -Ev "links:|\-\-\-" | tr -d "-")
	  echo $TITLE" "$ID" "$GROUP" "$LINKS

	  jq '.nodes += [{"id": "'"$ID"'","group": "'"$GROUP"'","title": "'"$TITLE"'" }]' $SPECIALTY.json > $SPECIALTY.tmp && mv $SPECIALTY.tmp $SPECIALTY.json

          for link in $LINKS; do
              jq '.links += [{ "source": "'"$ID"'","target": "'"$link"'", "value": 1 }]' $SPECIALTY.json > $SPECIALTY.tmp && mv $SPECIALTY.tmp $SPECIALTY.json
	  done

	  pandoc -V fontsize=14pt -s $MARKDOWN_FILE --template aleph_default.html -o ../../../dist/graphs/$SPECIALTY/$ID.html

  done


  cp $SPECIALTY.json ../../../dist/graphs/$SPECIALTY/
  cd ../../../

done
