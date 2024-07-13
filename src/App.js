import { useEffect, useRef, useState } from 'react';
import Cytoscape from 'cytoscape';
import COSEBilkent from 'cytoscape-cose-bilkent';
import CytoscapeComponent from 'react-cytoscapejs';
import FileUploadButton from './FileUpload';
import DownloadXMLButton from './DownloadXMLButton';
import PopUp from './PopUp';
import {ExportIMG, PanZoom} from './CytoTools';
import backboneImage from './backbone.PNG';
import crossbarImage from './crossbar.PNG';
import topologyImage from './topology.PNG';
import cylinderImage from './cylinder.png';
import { isEmpty } from 'lodash';

// cytoscape graph layout: https://github.com/cytoscape/cytoscape.js-cose-bilkent
Cytoscape.use(COSEBilkent);
const graphLayout = {
    name: 'cose-bilkent',
};

// cytoscape graph stylesheet
const graphStylesheet = [

    // makes platform hidden
    {
        selector: 'node[eleType="platform"]',
        css: {
            'display': 'none',
            'visibility': 'hidden'
        }
    },

    // style for host nodes on graph
    {
        selector: 'node[eleType="host"]',
        css: {
            'shape': 'data(shape)',
            'label': 'data(label)',
            'background-color': '#FF69B4',
        }
    },

    // style for router nodes on graph
    {
        selector: 'node[eleType="router"]',
        css: {
            'shape': 'data(shape)',
            'label': 'data(label)',
            'background-color': '#4169E1',
        }
    },

    // style for cluster router nodes on graph test
    {
        selector: 'node[eleType="cluster_router"]',
        css: {
            'shape': 'data(shape)',
            'label': 'data(label)',
            'background-color': '#6495ED',
        }
    },

    // style for link nodes on graph
    {
        selector: 'node[eleType="link"]',
        css: {
            'shape': 'data(shape)',
            'label': 'data(label)',
            'background-color': '#7CFC00',
        }
    },

    // style for link ctn nodes on graph
    {
        selector: '[eleType="link_ctn"]',
        css: {
            'curve-style': 'bezier',
            'width': 1,
        }
    },

    // style for zone nodes on graph
    {
        selector: '[eleType="zone"]',
        css: {
            'label': 'data(label)',
        }
    },

    // style for cluster zone nodes on graph
    {
        selector: '[eleType="cluster_zone"]',
        css: {
            'label': 'data(label)',
        }
    },

    // style for disk nodes on graph
    {
        selector: '[eleType="disk"]',
        css: {
            'shape': 'rectangle',
            'background-image': `url(${cylinderImage})`,
            'background-color': 'white',
            'height': 30,
            'width': 30,
            'background-fit': 'contain',
        }
    },

    // style for backbone cluster nodes on graph
    {
        selector: '[eleType="cluster"][cluster_type="backbone"]',
        css: {
            'shape': 'rectangle',
            'background-image': `url(${backboneImage})`,
            'background-color': 'white',
            'height': 80,
            'width': 80,
            'background-fit': 'contain',
        }
    },

    // style for crossbar cluster nodes on graph
    {
        selector: '[eleType="cluster"][cluster_type="crossbar"]',
        css: {
            'shape': 'rectangle',
            'background-image': `url(${crossbarImage})`,
            'background-color': 'white',
            'height': 80,
            'width': 80,
            'background-fit': 'contain',
        }
    },

    // style for typology cluster nodes on graph
    {
        selector: '[eleType="cluster"][cluster_type="topology"]',
        css: {
            'shape': 'rectangle',
            'background-image': `url(${topologyImage})`,
            'background-color': 'white',
            'height': 80,
            'width': 80,
            'background-fit': 'contain',
        }
    },
];

// default location for panning
const pan = {
    x: '725',
    y: '300'
}

// style for cytoscape graphing area
const graphStyle = {
    height: '100vh',
    width: '75vw',
    marginLeft: '25vw',
    border: 'ridge thick',
    padding: '10px',
    backgroundColor: 'lightgray',
};

// style for navigation sidebar
const sidenav = {
    height: '100vh',
    width: '25vw',
    position: 'fixed',
    border: 'ridge thick',
    padding: '10px',
    backgroundColor: 'lightblue'
}

// object storing properties shown in modal
let modalObj = {};

// main
function App() {

    // Modal Handles
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    // Element Handles
    const [elements, setElements] = useState([]);
    const handleElements = (newElements) => {
        setElements(newElements);
    }

    // Handles file content
    const [preParseData, setPreParseData] = useState();
    const handlePPD = (data) => {
        setPreParseData(data);
    }

    // ensures graph does not re-render after clicking on nodes
    const cyRef = useRef(null);
    useEffect(() => {
        if (cyRef.current) {
            runLayout(cyRef.current)
        }} ,[elements]);

    const runLayout = (cy) => {
        cy.layout({name: 'cose-bilkent', randomize: false}).run();
    };

    // prop for XML download
    const dlProp = {preParseData, elements}

    // render
    return (
        <>
            <PopUp obj={modalObj} open={open} handleElements={handleElements} close={handleClose}/>
            <div style={sidenav}>
                <FileUploadButton handleElements={handleElements} handlePPD={handlePPD}/>
                <DownloadXMLButton props={{dlProp}}/>
                <ExportIMG cyRef={cyRef}/>
                <br/>
                <PanZoom cyRef={cyRef}/>
            </div>
            <CytoscapeComponent
                // Cytoscape graph properties
                elements={elements}
                layout={graphLayout}
                stylesheet={graphStylesheet}
                style={graphStyle}
                pan={pan}
                // opens modal when clicking graph nodes
                cy={cy => {
                    cyRef.current = cy;
                    cy.on("tap", evt => {
                        try {
                            modalObj = evt.target.data();
                            if (!(isEmpty(modalObj))) {
                                handleOpen();
                            }
                        } catch (error) {
                            console.log("Error; Not a node")
                        }
                    })
                }}
            />
        </>
    );
}

export default App;
