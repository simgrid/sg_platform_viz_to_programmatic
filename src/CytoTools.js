// button for exporting Cytoscape graph as a png (cy.jpg() for jpg)
export function ExportIMG(cyRef) {
    // passed Cytoscape graph reference
    const cy = cyRef.cyRef.current;

    const exportPNG = () => {
        // checks for no graph XML submission
        if (cy == null) {
            alert("No Graph XML Was Submitted!");
            return;
        }

        // creates png of cytoscape graph
        const png = cy.png();

        // creates download of png
        const link = document.createElement('a');
        link.href = png;
        link.download = 'graph.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // render
    return (
        <div>
            <button onClick={exportPNG}>Export PNG</button>
        </div>
    )
}

// buttons for zooming Cytoscape graph
export function PanZoom(cyRef) {
    const cy = cyRef.cyRef.current;

    const zoomIn = () => {
        if (cy == null) {
            alert("No Graph XML Was Submitted!");
            return;
        }

        // alters zoom of cytoscape graph
        cy.zoom(cy.zoom() * 1.1);
    };

    const zoomOut = () => {
        if (cy == null) {
            alert("No Graph XML Was Submitted!");
            return;
        }

        cy.zoom(cy.zoom() * 0.9);
    };

    const fit = () => {
        if (cy == null) {
            alert("No Graph XML Was Submitted!");
            return;
        }

        // centers and fits cytoscape graph on screen
        cy.center();
        cy.fit();
    };

    // render
    return (
        <>
            <div><button onClick={zoomIn}>Zoom In</button></div>
            <div><button onClick={zoomOut}>Zoom Out</button></div>
            <div><button onClick={fit}>Zoom Reset</button></div>
        </>
    )
}
