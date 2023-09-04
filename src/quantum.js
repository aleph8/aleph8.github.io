import { Constellation } from './graphs.js'
import { uncheckAll } from './utils.js'

const quantum_constellation = new Constellation( 'quantum.json' , 'graph', 4 , 3 );

await new Promise(resolve => setTimeout(resolve, 500));

if( screen.width < 1024 ){
  quantum_constellation.enableInteraction(true);
}

// CONTROLS

//// INTERACTION TOOL

var btnInteraction = document.getElementById( "interactionButton" );

btnInteraction.addEventListener('change', () => {

  if( btnInteraction.checked ){
	quantum_constellation.enableInteraction(true);
  }else{
	quantum_constellation.enableInteraction(false);
  }
  
}, false);

//// ZOOM TOOLS

var btnIn = document.getElementById( "zoomInButton" );

btnIn.addEventListener('click', function () {
  quantum_constellation.zoomMod(1);
}, false);

var btnOut = document.getElementById( "zoomOutButton" );

btnOut.addEventListener('click', function () {
  quantum_constellation.zoomMod(-1);
}, false);

//// SELECTORS TOOLS

//// //// All groups

var checkAll = document.getElementById( "selectorAll" );

checkAll.addEventListener('change', function () {
  if (this.checked) {
  	quantum_constellation.showOnlyGroup( 'all');
  }
}, false);


//// BUTTONS

var btnTools = document.getElementById( "enableTools" );
var tools =  document.getElementById( "tools" ); 

btnTools.addEventListener('click', function () {
  	if(tools.classList.contains('hidden')){
		tools.classList.remove('hidden');
	}else{
		tools.classList.add('hidden');
	}
}, false);

//// TESTING

console.log("INIT ... ");

// pentesting_constellation.hide();

console.log("END ...");
