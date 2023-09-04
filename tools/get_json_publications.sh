#!/bin/env bash

PUBLICATIONS_PATHS=$(find ../src/graphs/ | grep -E ".md")

declare -A PUBLICATION_DICT

for publication in $PUBLICATIONS_PATHS; do
    id=$(echo "$publication" | grep -Eo "[0-9]{8}" )
    ordered_id=$(echo "$id" | sed 's/\([0-9]\{2\}\)\([0-9]\{2\}\)\([0-9]\{4\}\)/\3\2\1/g')
    PUBLICATION_DICT[$ordered_id]=$publication
done

# echo "${!PUBLICATION_DICT[@]}"

IFS=$'\n' 
ordered_list=$(echo $(sort -r <<<"${!PUBLICATION_DICT[*]}"))
unset IFS

SENTINEL=0

echo "[]" > index_es.json
echo "[]" > index_en.json

for element in $ordered_list;do

    path=$(echo "${PUBLICATION_DICT[$element]}")

    TITLE=$(cat $path | grep -o 'title:.*' | head -n 1 | sed 's/title://g')
	ID=$(cat $path | grep -o 'id:.*' | head -n 1 | sed 's/id://g' | tr -d " ")
    SPECIALTY=$(cat $path | grep -o 'specialty:.*' | head -n 1 | sed 's/specialty://g' | tr -d " ")
    PERMALINK="/graphs/"$SPECIALTY"/"$ID".html"

    # TODO Check the "$" regex
    
    CONTENT_ES=$( cat $path | sed -n '/^:::::{.spanish}/,/^:::::/p' | sed -E -e 's/:::::.*|^!\[.*|- \[.*|\[.*\](.*)|[\t]*//g' | sed '/^```/,/^```/d' | sed '/^~~~/,/^~~~/d' | sed '/<div.*>/,/<\/div>/d' | sed '/\$.*/,/\$*/d' | tr -d "\"*#" | tr '\n' ' ' | sed -E 's/[ ]{2,20}/ /g' | tr '[:upper:]' '[:lower:]' )
    CONTENT_EN=$( cat $path | sed -n '/^:::::{.english}/,/^:::::/p' | sed -E -e 's/:::::.*|^!\[.*|- \[.*|\[.*\](.*)|[\t]*//g' | sed '/^```/,/^```/d' | sed '/^~~~/,/^~~~/d' | sed '/<div.*>/,/<\/div>/d' | sed '/\$.*/,/\$*/d' | tr -d "\"*#" | tr '\n' ' ' | sed -E 's/[ ]{2,20}/ /g' | tr '[:upper:]' '[:lower:]' )

    cat index_es.json | jq '. += [{ "title":"'"$TITLE"'", "id":"'"$ID"'", "specialty":"'"$SPECIALTY"'", "permalink":"'"$PERMALINK"'", "content":"'"$CONTENT_ES"'" }]' > index_es.tmp && mv index_es.tmp index_es.json
    cat index_en.json | jq '. += [{ "title":"'"$TITLE"'", "id":"'"$ID"'", "specialty":"'"$SPECIALTY"'", "permalink":"'"$PERMALINK"'", "content":"'"$CONTENT_EN"'" }]' > index_en.tmp && mv index_en.tmp index_en.json

    SENTINEL=$(( $SENTINEL + 1))

done