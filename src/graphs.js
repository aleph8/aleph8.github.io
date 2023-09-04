import './css/force-graph.css';
import './css/tailwind.css';

import elementResizeDetectorMaker from 'element-resize-detector';

import ForceGraph from 'force-graph';

class Constellation {

	graph;
	zoom;
	minZoom;

	constructor( jsonFile, divId , initialZoom, minZoom ) {

		this.zoom = initialZoom;
		this.minZoom = minZoom;

   		fetch( jsonFile ).then(res => res.json()).then(data => {
       			this.graph = ForceGraph()
       			(document.getElementById( divId ))
           		.graphData(data)
           		.nodeId('id')
           		.nodeVal('val')
           		.nodeLabel('title')
	   			.nodeColor(node =>'#fffab9')
           		.linkSource('source')
           		.linkTarget('target')
	   			.linkWidth(3)
	   			.linkColor(() => 'rgba(255,255,255)')
           		.onNodeClick(node => window.open(`${node.id}.html`))
	   			.height(window.innerHeight)
           		.backgroundColor('transparent')
	   			.zoom( initialZoom )
	   			.minZoom( minZoom )
	   			.enablePanInteraction(false)
		   		.nodeCanvasObject((node, ctx) => { 
			   		ctx.fillStyle = '#fffab9';
			   		ctx.beginPath(); 
			   		ctx.arc(node.x, node.y, 5, 0, 2 * Math.PI, false); 
			   		ctx.fill();
			   		ctx.font = 'bold 3.5pt Monospace';
    			   		ctx.fillStyle = 'white';
    			   		ctx.textAlign = 'center';
    			   		ctx.fillText(node.title.split(" ")[1], node.x, node.y+12);
		   		})

	   			elementResizeDetectorMaker().listenTo(
               			document.getElementById( divId ),
               			el => this.graph.width(el.offsetWidth)
           		);
   		});  
	}

	zoomMod( mod ){

		var operation = this.zoom + mod;

		if( operation >= this.minZoom ){
		    this.zoom = operation ;
		}
		
		this.graph.zoom(this.zoom);
	}

	enableInteraction( enable ){
		this.graph.enablePanInteraction(enable);
	}

	showOnlyGroup( group ) {

		if (group === 'all'){
			this.graph.nodeVisibility(node => true);
			this.graph.linkVisibility(link => true);			
		}else{
			console.log("Only show: " + group + " group");
			// this.graph.nodeColor(node => node.group === group ? 'orange' : 'black' );
			this.graph.nodeVisibility(node => node.group === group);
	        this.graph.linkVisibility(link => link.source.group === group && link.target.group === group);
		}
		
	}

}

export { Constellation } 
