import lunr from 'lunr';

async function chargeJSON( json_file ){
    const response = await fetch( json_file );
    const data = await response.json();
    return data;
}

let langbutton = document.getElementById('lang-es');

function isSpanish(){
    return langbutton.classList.contains('hidden');
}

// Search Elements Definition and Configuration

let json_es = await chargeJSON("/index_es.json");
let json_en = await chargeJSON("/index_en.json");

let latestpublications = document.getElementById('latest-publication-div');
let pub, perma;

for( let i = 0; i < 5; i++){
    pub = json_es[i];
    perma = document.createElement('a');
    perma.setAttribute('href',pub.permalink);
    perma.innerHTML = pub.title + " (" + pub.specialty.charAt(0).toUpperCase() + pub.specialty.slice(1) +") ";
    latestpublications.appendChild(perma);
    latestpublications.appendChild(document.createElement("br"));
}

let idx_es = lunr(function () {
 
    this.ref('permalink')
    this.field('specialty')
    this.field('title')
    this.field('content')

    json_es.forEach(function (doc) {
        this.add(doc)
    }, this)

});

let idx_en = lunr(function () {
 
    this.ref('permalink')
    this.field('specialty')
    this.field('title')
    this.field('content')

    json_en.forEach(function (doc) {
        this.add(doc)
    }, this)

});

let textinput       = document.getElementById('search-input');
let searchbutton    = document.getElementById('search-button');
let sectionselector = document.getElementById('home-section-selector');
let resultsbox      = document.getElementById('search-results');
let searchresults;
let fulldata;

let searchsection      = document.getElementById('home-search');
let descriptionsection = document.getElementById('home-description');

let searchicon      = document.getElementById('search-icon');
let descriptionicon = document.getElementById('description-icon');

sectionselector.addEventListener('click', ()=>{

    if(! searchicon.classList.contains("hidden")){

        searchicon.classList.add("hidden");
        searchsection.classList.remove("hidden");

        descriptionicon.classList.remove("hidden");
        descriptionsection.classList.add("hidden");


    }else{

        descriptionicon.classList.add("hidden");
        descriptionsection.classList.remove("hidden");

        searchicon.classList.remove("hidden");
        searchsection.classList.add("hidden");

    }
    
});

searchbutton.addEventListener('click', ()=>{

    while( resultsbox.firstChild ){
        resultsbox.removeChild( resultsbox.lastChild );
    }

    let json_file, idx_search;

    let number_of_results = document.createElement("p");
    number_of_results.setAttribute('class','mt-10 font-bold');

    if( isSpanish() ){
        json_file = json_es;
        idx_search = idx_es;
        number_of_results.innerHTML = "Resultado"
    }else{
        json_file = json_en;
        idx_search = idx_en;
        number_of_results.innerHTML = "Result"
    }

    //// SEARCH PROCESS

    if(textinput.value == "thanos"){
        document.body.classList.add("transition-opacity");
        document.body.classList.add("duration-[3000ms]");
        document.body.classList.add("ease-out");
        document.body.classList.add("opacity-0");
        console.log("THANOS");
    }

    if(textinput.value.trim() != ""){
        searchresults = idx_search.search(textinput.value);
    }else{
        searchresults = [];
    }

    if(searchresults.length != 1){
        number_of_results.innerHTML = searchresults.length + " " + number_of_results.innerHTML + "s";
    }else{
        number_of_results.innerHTML = searchresults.length + " " + number_of_results.innerHTML;
    }

    resultsbox.appendChild(number_of_results);

    fulldata = searchresults.map(function (result) {
        return json_file.filter(function ( publication , index, arr) {
            return publication.permalink == result.ref;
        })[0];
    });

    // console.log( fulldata );

    for (var i = 0; i < fulldata.length; i++) {
        
        let actual_publication = fulldata[i];

        let publication_div       = document.createElement('div'),
        publication_div_title     = document.createElement('div'),
        publication_div_content   = document.createElement('div'),
        publication_title         = document.createElement('h2'),
        publication_specialty     = document.createElement('p'),
        publication_href          = document.createElement('a'),
        separator_element         = document.createElement('HR');

        separator_element.setAttribute('class','bg-black h-1 mt-2 mb-2');
        
        publication_title.innerHTML           = actual_publication.title;
        publication_title.setAttribute('class','font-bold')

        publication_specialty.innerHTML       = actual_publication.specialty.charAt(0).toUpperCase() + actual_publication.specialty.slice(1);
        publication_specialty.setAttribute('class','ml-auto italic');

        publication_div_title.setAttribute('class','flex');
        publication_div_title.appendChild(publication_title);
        publication_div_title.appendChild(publication_specialty);

        let words = textinput.value.trim().toLowerCase().replace(/\s{1,}/g, '|').split('|');
        // console.log(words);

        let buildRegex = "";
        let buildRegexHigh = "";
        let j = 0;

        while(j < words.length - 1){
            buildRegex += '.{1,50}'+ words[j] +'.{1,50}|';
            buildRegexHigh += words[j] + '|';
            j = j + 1;
        }


        buildRegex += '.{1,50}'+ words[j] +'.{1,50}'
        buildRegexHigh += words[j];

        const regexp = new RegExp(buildRegex, 'g');
        const regexpHigh = new RegExp("(" + buildRegexHigh + ")", 'g');
        // console.log(regexpHigh);
        let match;

        let sentinel = 0;

        publication_div_content.innerHTML = "<b> ... </b>";
        while((match = regexp.exec(actual_publication.content)) !== null && sentinel < 5 ) {
            // console.log(match[0]);
            publication_div_content.innerHTML += match[0].replace(regexpHigh, "<span style='background-color: yellow;'>$1</span>" ) + " [...] " ;
            sentinel = sentinel + 1;
        }

        if( publication_div_content.innerHTML == "<b> ... </b>" ){
            if(isSpanish()){
                publication_div_content.innerHTML += " ¡En esta publicación hay coincidencias!" ;
            }else{
                publication_div_content.innerHTML += " In this publication there are matches!" ;
            }
        }

        publication_div.setAttribute('class','bg-white text-black mt-10 p-4 rounded-l-lg border-l-[12px]  border-gray-300 w-full');
        publication_div.appendChild(publication_div_title);
        publication_div.appendChild(separator_element);
        publication_div.appendChild(publication_div_content);

        publication_href.setAttribute('href', actual_publication.permalink);
        publication_href.setAttribute('class','w-full');
        publication_href.appendChild(publication_div);

        resultsbox.appendChild(publication_href);

        // console.log(actual_publication);

    }

});

/////
// let results = idx_es.search("principio");
// console.log('Results: ', results.length);