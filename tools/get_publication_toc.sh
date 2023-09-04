#!/bin/env bash

TOC_CONTENT=$(cat $1 | sed '/^```/,/^```/d' | sed '/^~~~/,/^~~~/d' | grep -E "^#.*")

MED=$(( $( echo "$TOC_CONTENT" | wc -l ) / 2 ))
SENTINEL=0

IFS=$'\n'

SPANISH_TOC=":::::{.spanish}"
ENGLISH_TOC=":::::{.english}"

for line in $TOC_CONTENT; do
    
    times=$(echo "$line" | grep -o "#" | wc -l )
    indent=$(for i in $(seq 2 $times); do echo -n "\t"; done) 

    content=$( echo "$line" | sed 's/#* \(.*\)/\1/g' )
    link=$( echo "$content" | tr -d ".)(!¡" | tr '[:upper:]' '[:lower:]' | sed 's/ /-/g' )

    newline="$indent- ["$content"](#"$link")<br>"

    if [ $SENTINEL -lt $MED ]; then
        SPANISH_TOC=$SPANISH_TOC"\n"$newline
    else
        ENGLISH_TOC=$ENGLISH_TOC"\n"$newline
    fi

    SENTINEL=$(( $SENTINEL + 1 ))

done

echo -e "$SPANISH_TOC\n:::::\n"

echo -e "$ENGLISH_TOC\n:::::"