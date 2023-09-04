const spanishElements = document.querySelectorAll('.spanish');
const englishElements = document.querySelectorAll('.english');

englishElements.forEach((item) => {
    item.classList.add('hidden');
})

spanishElements.forEach((item) => {
    item.classList.add('block');
})

let englishlang = document.getElementById('lang-en');

englishlang.addEventListener('click', () => {

    englishElements.forEach((item) => {
        item.classList.remove('hidden');
        item.classList.add('block');
    })
    
    spanishElements.forEach((item) => {
        item.classList.remove('block');
        item.classList.add('hidden');
    })

});

let spanishlang = document.getElementById('lang-es');

spanishlang.addEventListener('click', () => {

    englishElements.forEach((item) => {
        item.classList.remove('block');
        item.classList.add('hidden');
    })
    
    spanishElements.forEach((item) => {
        item.classList.remove('hidden');
        item.classList.add('block');
    })

});