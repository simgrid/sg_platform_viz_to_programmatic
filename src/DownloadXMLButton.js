import {omit} from 'lodash';

// button for downloading XML file for current Cytoscape graph
export default function DownloadXMLButton(props) {

    // @data = Content of original file from beginning to line BEFORE <platform version='xx.xx'>
    // @eleArr = Array of element defined by author for cytoscape
    // const data = props.props.dlProp.preParseData
    // const modData = data.substring(0, data.indexOf('<platform '))
    const eleArr = props.props.dlProp.elements

    const handleClick = () => {
        // checks for no graph XML submission
        if (eleArr.length === 0) {
            alert("No Graph XML Was Submitted!");
            return;
        }

        // removes non-XML Cytoscape elements
        const newArr = cleanArr(eleArr);

        // stores parent data
        const parent = [];
        const parentNode = [];

        // creates XML doc
        const doc = document.implementation.createDocument(null, "platform", null);

        // converts Cytoscape elements to XML
        const xmlStr = initializeXml(newArr, parent, parentNode, doc)

        // download blob
        const blob = new Blob([xmlStr], {type: 'text/xml'});
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'elements.xml';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    // converts Cytoscape elements to XML elements
    function initializeXml(arr, parent, parentNode, doc) {

        // platform node for XML
        const platformNode = doc.documentElement;
        platformNode.setAttribute("version", "4.1");

        // world zone node for XML
        for (const key in arr) {
            if (arr[key].data.eleType === 'zone' && arr[key].data.parent === undefined) {
                const wZoneNode = doc.createElement("zone");
                wZoneNode.setAttribute("id", arr[key].data.id);
                wZoneNode.setAttribute("routing", arr[key].data.routing);
                platformNode.appendChild(wZoneNode);
                parent = arr[key];
                parentNode = wZoneNode;
                arr.splice(0, arr.indexOf(arr[key]) + 1)
            }
        }

        // converts to XML for elements that are not platform, world zone, and route
        toXml(arr, parent, parentNode, doc)

        // converts to XML for routes
        return toXmlRoutes(arr, doc, parentNode.id)
    }

    // converts to XML for elements that are not platform, world zone, and route
    function toXml(arr, parent, parentNode, doc) {
        // for each element in array
        for (const key in arr) {

            // converts to XML zone node
            if (arr[key].data.eleType === 'zone' && arr[key].data.parent === parent.data.id) {
                const zoneNode = doc.createElement("zone");
                zoneNode.setAttribute("id", arr[key].data.id);
                zoneNode.setAttribute("routing", arr[key].data.routing);
                parentNode.appendChild(zoneNode);
                toXml(arr, arr[key], zoneNode, doc);
                continue;
            }

            // converts to XML prop node
            if (arr[key].data.eleType === "prop" && arr[key].data.parent === parent.data.id) {
                const propNode = doc.createElement("prop");
                propNode.setAttribute("id", arr[key].data.id);
                propNode.setAttribute("value", arr[key].data.value);
                parentNode.appendChild(propNode);
            }

            // converts to XML host node
            if (arr[key].data.eleType === "host" && arr[key].data.parent === parent.data.id) {
                const hostNode = doc.createElement("host");
                hostNode.setAttribute("id", arr[key].data.id);
                hostNode.setAttribute("speed", arr[key].data.speed);
                parentNode.appendChild(hostNode);
                toXml(arr, arr[key], hostNode, doc);
                continue;
            }

            // converts to XML disk node
            if (arr[key].data.eleType === "disk" && arr[key].data.parent === parent.data.id) {
                const diskNode = doc.createElement("disk");
                let newStr = arr[key].data.id;
                newStr = newStr.substring(newStr.indexOf(' ') + 1);
                arr[key].data.id = newStr;
                diskNode.setAttribute("id", arr[key].data.id);
                diskNode.setAttribute("read_bw", arr[key].data.read_bw);
                diskNode.setAttribute("write_bw", arr[key].data.write_bw);
                parentNode.appendChild(diskNode);
                toXml(arr, arr[key], diskNode, doc);
                continue;
            }

            // converts to XML router node
            if (arr[key].data.eleType === "router" && arr[key].data.parent === parent.data.id) {
                const routerNode = doc.createElement("router");
                routerNode.setAttribute("id", arr[key].data.id);
                parentNode.appendChild(routerNode);
                toXml(arr, arr[key], routerNode, doc);
                continue;
            }

            // // converts to XML link node
            if (arr[key].data.eleType === "link" && arr[key].data.parent === parent.data.id) {
                const linkNode = doc.createElement("link");
                linkNode.setAttribute("id", arr[key].data.id);
                linkNode.setAttribute("bandwidth", arr[key].data.bandwidth);
                linkNode.setAttribute("latency", arr[key].data.latency);
                parentNode.appendChild(linkNode);
                toXml(arr, arr[key], linkNode, doc);
                continue;
            }

            // converts to XML cluster node
            if (arr[key].data.eleType === "cluster" && arr[key].data.host === parent.data.id) {
                const clusterNode = doc.createElement("cluster");
                clusterNode.setAttribute("id", arr[key].data.id);
                clusterNode.setAttribute("prefix", arr[key].data.prefix);
                clusterNode.setAttribute("suffix", arr[key].data.suffix);
                clusterNode.setAttribute("radical", arr[key].data.radical);
                clusterNode.setAttribute("speed", arr[key].data.speed);
                clusterNode.setAttribute("bw", arr[key].data.bw);
                clusterNode.setAttribute("lat", arr[key].data.lat);
                clusterNode.setAttribute("router_id", arr[key].data.router_id);
                parentNode.appendChild(clusterNode);
                toXml(arr, arr[key], clusterNode, doc);
            }

        }

        // returns edited XML doc
        return new XMLSerializer().serializeToString(doc);
    }

    // converts to XML for routes
    function toXmlRoutes (arr, doc, parentID) {
        // for each element in array
        arr.forEach(key => {

            // route nodes
            if (key.data.eleType === "link_ctn" && key.data.path === "route") {
                // gets all routes
                const routes = getRoutes(arr);
                routes.forEach(route => {
                    if (key.data.source === route.start) {
                        const startParent = getParent(arr, route.start)
                        const routeNode = doc.createElement("route");
                        routeNode.setAttribute("src", route.start);
                        routeNode.setAttribute("dst", route.end);
                        const linkCtnNode = doc.createElement("link_ctn");
                        linkCtnNode.setAttribute("id", key.data.target);
                        routeNode.appendChild(linkCtnNode);
                        doc.getElementById(startParent).appendChild(routeNode);
                    }
                })
            }

            // zone route nodes
            if (key.data.eleType === "link_ctn" && key.data.path === "zoneRoute") {
                const routes = getRoutes(arr);
                routes.forEach(route => {
                    if (key.data.source === route.start) {
                        const startParent = getParent(arr, route.start)
                        const endParent = getParent(arr, route.end)
                        const routeNode = doc.createElement("zoneRoute");
                        routeNode.setAttribute("src", startParent);
                        routeNode.setAttribute("dst", endParent);
                        routeNode.setAttribute("gw_src", route.start);
                        routeNode.setAttribute("gw_dst", route.end);
                        const linkCtnNode = doc.createElement("link_ctn");
                        linkCtnNode.setAttribute("id", key.data.target);
                        routeNode.appendChild(linkCtnNode);
                        doc.getElementById(parentID).appendChild(routeNode);
                    }
                })
            }
        })

        return new XMLSerializer().serializeToString(doc);
    }

    // get parent of a child node
    function getParent (arr, child) {
        for (const src in arr) {
            if (arr[src].data.router_id === child && arr[src].data.eleType === "cluster") {
                return arr[src].data.id;
            } else if (arr[src].data.id === child && arr[src].data.eleType !== "cluster") {
                return arr[src].data.parent;
            }
        }
    }

    // finds all routes
    function getRoutes (arr) {
        // Add routes
        const routes = new Map();
        for (const src in arr) {
            if (arr[src].data.eleType === "link_ctn" && arr[src].data.source !== undefined && arr[src].data.target !== undefined) {
                for (const dst in arr) {
                    if (arr[dst].data.eleType === "link_ctn" && arr[src].data.target === arr[dst].data.source) {
                        const start = arr[src].data.source;
                        const end = arr[dst].data.target;
                        const id = start + " -> " + end;
                        routes.set(id, {
                            start: start,
                            end: end
                        });
                    }
                }
            }
        }
        return routes;
    }

    return (
        <>
        <button onClick={handleClick}>Export XML</button>
        </>
    )
}

// takes an array of Cytoscape elements and removes non-XML elements
function cleanArr(arr) {
    // elements to remove
    const delAttribute = ['label', 'shape', 'host']
    const delEleType = ['cluster_router','cluster_edge', 'cluster_zone']

    const newArr = [];

    arr.forEach(element => {
        let data = element.data
        omit(element.data, delAttribute) // Takes out attributes not found in original XML file
        if (!(delEleType.includes(data.eleType))) {  // Takes out items not found in original XML file
            newArr.push(element)
        }
    });

    return newArr;
}