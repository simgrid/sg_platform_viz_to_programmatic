// reads json and performs operations
export default function convertCyto(json, elements, parentZone, parentHost) {
    // defData - Properties/Attributes of object
    // cytoData - Data for Cytoscape/Popup to render
    // propData - Unique user defined data that user implement in XML file (<prop> tag)
    // otherData - Properties/Attributes of object that WAS NOT Explicitly defined, but SHOULD HAVE default value.
    // <host> tags MIGHT not have cores defined, but default is 1 core.
    // <cluster> tags will always come with a router defined as '${prefix}${clusterId}_router${suffix}'
    // mergeData - Combined all data above. This data is to be passed in the elements array
    let defData, cytoData, mergeData, otherData, propData

    // iterates through keys in json
    for (const key in json) {
        // values for each key
        if (json.hasOwnProperty(key)) {
            const value = json[key];

            switch (key) {
                case "name":
                    // elements for each key
                    if (!["DOCTYPE", "--", "---"].includes(value)) {

                        const element = {
                            name: value,
                            attributes: json.attributes,
                        };

                        switch (element.name) {
                            // Nodes
                            case "platform":
                                // Variables
                                defData = json.attributes
                                cytoData = {
                                    eleType: element.name
                                }

                                elements.push({
                                    data: {...defData, ...cytoData}
                                })
                                break;

                            case "zone":
                                // Variables
                                defData = json.attributes
                                cytoData = {
                                    label: json.attributes.id,
                                    eleType: element.name,
                                    parent: parentZone
                                }
                                propData = getProp(json.children)
                                mergeData = {...defData, ...cytoData, ...propData}
                                parentZone = json.attributes.id;

                                // Push
                                elements.push({
                                    data: mergeData
                                });
                                break;

                            case "host":
                                // Variables
                                defData = json.attributes
                                cytoData = {
                                    label: json.attributes.id,
                                    eleType: element.name,
                                    parent: parentZone,
                                    shape: "rectangle",
                                }
                                otherData = {core: getCores(json.attributes.core)}
                                propData = getProp(json.children)
                                mergeData = {...defData, ...cytoData, ...otherData, ...propData}
                                parentHost = json.attributes.id

                                // Push
                                elements.push({
                                    data: mergeData
                                });
                                break;

                            case "disk":
                                // Variables
                                defData = json.attributes
                                cytoData = {
                                    id: parentHost + " " + json.attributes.id,
                                    parent: parentHost,
                                    host: parentHost,
                                    eleType: element.name,
                                    label: json.attributes.id,
                                }
                                propData = getProp(json.children)
                                mergeData = {...defData, ...cytoData, ...propData}

                                // Push
                                elements.push({
                                    data: mergeData,
                                });
                                break;

                            case "link":
                                // Variable
                                defData = json.attributes
                                cytoData = {
                                    label: json.attributes.id,
                                    eleType: element.name,
                                    parent: parentZone,
                                    shape: "rhomboid",
                                }
                                propData = getProp(json.children)
                                mergeData = {...defData, ...cytoData, ...propData}

                                // Push
                                elements.push({
                                    data: mergeData
                                });
                                break;

                            case "router":
                                // Variable
                                defData = json.attributes
                                cytoData = {
                                    eleType: element.name,
                                    label: json.attributes.id,
                                    parent: parentZone,
                                    shape: "diamond",
                                }
                                propData = getProp(json.children)
                                mergeData = {...defData, ...cytoData, ...propData}

                                // Push
                                elements.push({
                                    data: mergeData
                                });
                                break;

                            case "cluster":
                                // Variable (cluster)
                                defData = json.attributes;
                                // Add a new zone for the cluster
                                const clusterZoneData = {
                                    eleType: "cluster_zone",
                                    id: json.attributes.id + "_zone",
                                    parent: parentZone,
                                    label: json.attributes.id
                                };
                                elements.push({data: clusterZoneData});

                                cytoData = {
                                    eleType: element.name,
                                    cluster_type: getClusterType(json.attributes),
                                    parent: clusterZoneData.id,
                                    host: parentZone,
                                };
                                propData = getProp(json.children);
                                mergeData = {...defData, ...cytoData, ...propData};

                                // Variable (cluster_router)
                                // New router node based on cluster router
                                const cytoRCData = {
                                    id: getRouterID(json.attributes),
                                    eleType: "cluster_router",
                                    label: getRouterID(json.attributes),
                                    shape: "diamond",
                                    parent: clusterZoneData.id, // Set the parent to the new zone
                                    cluster_based: defData.id,
                                };

                                // Variable (edge: cluster -> cluster_router)
                                const src = defData.id;
                                const dst = cytoRCData.id;
                                const edgeRCData = {
                                    id: `${src}-${dst}`,
                                    label: `${src} to ${dst}`,
                                    eleType: "cluster_edge",
                                    source: src,
                                    target: dst,
                                };

                                elements.push(
                                    {data: mergeData},
                                    {data: cytoRCData},
                                    {data: edgeRCData}
                                );
                                break;

                            case "route":
                            case "link-ctn":
                            case "zoneRoute":
                                getEdges(json.attributes, json.children, elements)
                                break;

                            case "peer":
                                alert("Alert: No Visual and Export Support for Peers!");
                                break;

                            case "bypassRoute":
                                alert("Alert: No Visual and Export Support for Bypass Routes!");
                                break;

                            case "backbone":
                                alert("Alert: No Visual and Export Support for Backbone Configurations!");
                                break;

                            case "trace_connect":
                                alert("Alert: No C++ Export Support for Trace Connect!");
                                break;

                            default:
                                break;
                        }
                    }
                    break;
                default:
                    // If the value is an object, recursively iterate through its keys
                    if (typeof value === "object") {
                        convertCyto(value, elements, parentZone, parentHost);
                    }
                    break;
            }
        }
    }
}

// @core (host) = obj.core
// Returns 1 (default). Otherwise, number of cores specified
function getCores(core) {
    if (core > 1) {
        return core
    } else {
        return 1
    }
}

// @child = obj.children
// Returns an object of unique keys:values defined by user
function getProp(children) {
    let props = {}

    children.forEach(child => {
        // check the child name
        if (child.name === "prop") {
            // id: value
            props[child.attributes.id] = child.attributes.value
        }
    })

    return props
}

// @data (cluster) = obj.attributes
// Returns topology type
// topology = 't'
function getClusterType(data) {
    const bb_bw = data.hasOwnProperty('bb_bw')
    const bb_lat = data.hasOwnProperty('bb_lat')
    const top = data.hasOwnProperty('topology')

    if (bb_bw && bb_lat && !top) {
        return 'backbone'
    } else if (!bb_bw && !bb_lat && !top) {
        return 'crossbar'
    } else if (top) {
        return 'topology'
    }
}

// @data (cluster) = obj.attributes
// Returns user-defined or default routerID
function getRouterID(data) {
    const hasRouter = data.hasOwnProperty('router_id')

    if (hasRouter) {
        return data.router_id
    } else {
        const pre = data.prefix
        const id = data.id
        const suf = data.suffix
        const routerID = pre + id + '_router' + suf
        return routerID
    }
}

// @data = obj.attributes (src/dst gw_src/gw_dst)
// @children = obj.children (link_ctn...) (array of obj [{...},{...}...])
function getEdges(data, children, eleArray) {
    const gw = (data.hasOwnProperty('gw_src') && data.hasOwnProperty('gw_dst'))
    const arrID = [];
    let path;

    // Populate array with ID(s) in order
    if (!gw) { // Route. In order, [src, child[0].id, child[1].id, ..., child[length-1].id, dst]
        arrID.push(data.src)
        children.forEach(child => {
            arrID.push(child.attributes.id)
        })
        arrID.push(data.dst)
        path = 'route'
    } else { // zoneRoute. In order, [gw_src, child[0].id, child[1].id, ..., child[length-1].id, gw_dst]
        arrID.push(data.gw_src)
        children.forEach(child => {
            arrID.push(child.attributes.id)
        })
        arrID.push(data.gw_dst)
        path = 'zoneRoute'
    }

    // Connect each id to the next as an edge
    for (let i = 0; i !== (arrID.length - 1); i++) {
        let src = arrID[i]
        let dst = arrID[i + 1]
        eleArray.push({
            data: {
                id: `${src} -> ${dst}`,
                label: `${src} to ${dst}`,
                path: path,
                eleType: 'link_ctn',
                source: src,
                target: dst
            }
        })
    }
}
