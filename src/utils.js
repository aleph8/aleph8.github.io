function uncheckAll ( checkboxName ){

    var checkbox = document.getElementsByName( checkboxName );

    console.log(checkbox);
    console.log(checkboxName);

    for (var i = 0; i < checkbox.length; i++) {
        checkbox[i].checked = false;
    }

}

export { uncheckAll }
