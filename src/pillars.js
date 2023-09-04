import { Constellation } from './graphs.js'
import { uncheckAll } from './utils.js'

const pillars_constellation = new Constellation( 'pillars.json' , 'graph', 4 , 3 );

await new Promise(resolve => setTimeout(resolve, 500));

if( screen.width < 1024 ){
  pillars_constellation.enableInteraction(true);
}

// CONTROLS

//// INTERACTION TOOL

var btnInteraction = document.getElementById( "interactionButton" );

btnInteraction.addEventListener('change', () => {

  if( btnInteraction.checked ){
	pillars_constellation.enableInteraction(true);
  }else{
	pillars_constellation.enableInteraction(false);
  }
  
}, false);

//// ZOOM TOOLS

var btnIn = document.getElementById( "zoomInButton" );

btnIn.addEventListener('click', function () {
  pillars_constellation.zoomMod(1);
}, false);

var btnOut = document.getElementById( "zoomOutButton" );

btnOut.addEventListener('click', function () {
  pillars_constellation.zoomMod(-1);
}, false);

//// SELECTORS TOOLS

//// //// All groups

var checkAll = document.getElementById( "selectorAll" );

checkAll.addEventListener('change', function () {
  if (this.checked) {
  	pillars_constellation.showOnlyGroup( 'all');
  }
}, false);

//// //// 3D Print Group

var check3dprint = document.getElementById( "selector3dprint" );

check3dprint.addEventListener('change', function () {

  if (this.checked) {
  	pillars_constellation.showOnlyGroup('3dprint');
  }

}, false);

//// //// Programming Group

var checkProgramming = document.getElementById( "selectorProgramming" );

checkProgramming.addEventListener('change', function () {

  if (this.checked) {
  	pillars_constellation.showOnlyGroup('Programming');
  }

}, false);


//// //// Server Group

var checkServer = document.getElementById( "selectorServer" );

checkServer.addEventListener('change', function () {

  if (this.checked) {
  	pillars_constellation.showOnlyGroup('Server');
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