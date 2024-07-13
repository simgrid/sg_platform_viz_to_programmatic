// reads json and converts to C++
import isEqual from 'lodash/isEqual';

let count = 0; // recursion counter
let varDict = {}; // dict for XML IDs to C++ variable names
let routeDict = {}; // dict for keeping track of duplicate routes

export function convertCPP(json, cppCodeArr, parentZone, parentHost, propParent, lastChild) {
    count++;

    // iterates through keys in json
    for (const key in json) {
        // values for each key
        if (json.hasOwnProperty(key)) {
            const value = json[key];
            // performs operations based on each key
            switch (key) {
                // elements for each key
                case "name":
                    if (!["DOCTYPE", "--", "---"].includes(value)) {
                        // pushes line of C++ code to array for each respective element
                        switch (value) {
                            case "platform":
                                cppCodeArr.push({
                                    cpp: 'void load_platform(const sg4::Engine &e) {'
                                });
                                convertCPP(value, cppCodeArr, parentZone, parentHost, propParent, lastChild);
                                break;

                            case "zone":
                                // error-checking
                                if (typeof json.attributes.id === "undefined" ) {
                                    alert(`Error: Make sure all zones have IDs!`)
                                }
                                if (typeof json.attributes.routing === "undefined" ) {
                                    alert(`Error: No routing algorithm set for ${json.attributes.id}!`)
                                }

                                // push C++ code for zone according to respective routing algorithm
                                if (json.attributes.routing === 'Full') {
                                    cppCodeArr.push({
                                        cpp: `\tauto ${value + count} = sg4::create_full_zone("${value + count}");`
                                    });
                                } else if (json.attributes.routing === 'None') {
                                    cppCodeArr.push({
                                        cpp: `\tauto ${value + count} = sg4::create_empty_zone("${value + count}");`
                                    });
                                } else if (json.attributes.routing === 'Dijkstra') {
                                    cppCodeArr.push({
                                        cpp: `\tauto ${value + count} = sg4::create_dijkstra_zone("${value + count}");`
                                    });
                                } else if (json.attributes.routing === 'Floyd') {
                                    cppCodeArr.push({
                                        cpp: `\tauto ${value + count} = sg4::create_floyd_zone("${value + count}");`
                                    });
                                } else if (json.attributes.routing === 'Vivaldi') {
                                    cppCodeArr.push({
                                        cpp: `\tauto ${value + count} = sg4::create_vivaldi_zone("${value + count}");`
                                    });
                                } else if (json.attributes.routing === 'Wifi') {
                                    cppCodeArr.push({
                                        cpp: `\tauto ${value + count} = sg4::create_wifi_zone("${value + count}");`
                                    });
                                    alert('Wifi zones are not supported in C++ yet!')
                                }

                                // if parent zone exists, set parent to zone
                                if (typeof parentZone !== 'undefined') {
                                    cppCodeArr.push({
                                        cpp: `\t${value + count}->set_parent(${parentZone});`
                                    });
                                }

                                // Variables
                                varDict[json.attributes.id] = value + count
                                parentZone = value + count
                                propParent = value + count
                                lastChild = json.children[json.children.length - 1]
                                break;

                            case "host":
                                // error-checking
                                if (typeof json.attributes.id === "undefined" ) {
                                    alert(`Error: Make sure all hosts have IDs!`)
                                }

                                if (json.attributes.speed !== 'undefined') {
                                    // checks for list of speeds
                                    if (json.attributes.speed.includes(',')) {
                                        // applies C++ syntax
                                        let speedList = json.attributes.speed.split(',').map(function (item) {
                                            return '"' + item + '"';
                                        });
                                        cppCodeArr.push({
                                            cpp: `\tauto ${value + count} = ${parentZone}->create_host("${value + count}", ${speedList});`
                                        });
                                    } else {
                                        cppCodeArr.push({
                                            cpp: `\tauto ${value + count} = ${parentZone}->create_host("${value + count}", "${json.attributes.speed}");`
                                        });
                                    }
                                } else {
                                    alert(`Error: No speed set for ${json.attributes.id}!`)
                                }

                                // set core count, default is 1
                                cppCodeArr.push({
                                    cpp: `\t${value + count}->set_core_count(${typeof json.attributes.core !== 'undefined' ? json.attributes.core : 1});`
                                });

                                // set state profile if exists
                                if (typeof json.attributes.availability_file !== 'undefined') {
                                    cppCodeArr.push({
                                        cpp: `\t${value + count}->set_state_profile(simgrid::kernel::profile::ProfileBuilder::from_file("${json.attributes.availability_file}"));`
                                    });
                                }

                                // set speed profile if exists
                                if (typeof json.attributes.state_file !== 'undefined') {
                                    cppCodeArr.push({
                                        cpp: `\t${value + count}->set_speed_profile(simgrid::kernel::profile::ProfileBuilder::from_file("${json.attributes.state_file}"));`
                                    });
                                }

                                // set coordinates if exists
                                if (typeof json.attributes.coordinates !== 'undefined') {
                                    cppCodeArr.push({
                                        cpp: `\t${value + count}->set_coordinates("${json.attributes.coordinates}");`
                                    });
                                }

                                // set pstate if exists
                                if (typeof json.attributes.pstate !== 'undefined') {
                                    alert('XML configurations have pstates!')
                                    /*
                                    cppCodeArr.push({
                                        cpp: `${value + count}->set_pstate(${json.attributes.pstate});`
                                    });
                                    */
                                }

                                // Variables
                                varDict[json.attributes.id] = value + count
                                parentHost = value + count
                                propParent = value + count
                                break;

                            case "disk":
                                // error-checking
                                if (typeof json.attributes.id === "undefined" ) {
                                    alert(`Error: Make sure all disks have IDs!`)
                                }
                                if (typeof json.attributes.read_bw === "undefined" ) {
                                    alert(`Error: No read bandwidth set for ${json.attributes.id}!`)
                                }
                                if (typeof json.attributes.write_bw === "undefined" ) {
                                    alert(`Error: No write bandwidth set for ${json.attributes.id}!`)
                                }

                                cppCodeArr.push({
                                    cpp: `\tauto ${value + count} = ${parentHost}->create_disk("${value + count}", "${json.attributes.read_bw}", "${json.attributes.write_bw}");`
                                });

                                // Variables
                                varDict[json.attributes.id] = value + count
                                propParent = value + count
                                break;

                            case "link":
                                // error-checking
                                if (typeof json.attributes.id === "undefined" ) {
                                    alert(`Error: Make sure all links have IDs!`)
                                }
                                if (typeof json.attributes.bandwidth === "undefined" ) {
                                    alert(`Error: No bandwidth set for ${json.attributes.id}!`)
                                }

                                // check for list of bandwidths
                                if (json.attributes.bandwidth.includes(',')) {
                                    let bwList = json.attributes.bandwidth.split(',').map(function (item) {
                                        return '"' + item + '"';
                                    });
                                    cppCodeArr.push({
                                        cpp: `\tauto ${value + count} = ${parentZone}->create_link("${value + count}", {${bwList}})->set_latency("${json.attributes.latency}");`
                                    });
                                } else {
                                    cppCodeArr.push({
                                        cpp: `\tauto ${value + count} = ${parentZone}->create_link("${value + count}", "${json.attributes.bandwidth}")->set_latency("${json.attributes.latency}");`
                                    });
                                }

                                // set sharing policy if exists, links with no sharing policy set have splitduplex policy by default
                                if ((typeof json.attributes.sharing_policy !== 'undefined') && (json.attributes.sharing_policy !== 'SPLITDUPLEX')) {
                                    cppCodeArr.push({
                                        cpp: `\t${value + count}->set_sharing_policy(simgrid::s4u::Link::SharingPolicy::${json.attributes.sharing_policy});`
                                    });
                                }

                                // set bandwidth profile if exists
                                if (typeof json.attributes.bandwidth_file !== 'undefined') {
                                    cppCodeArr.push({
                                        cpp: `\t${value + count}->set_bandwidth_profile(simgrid::kernel::profile::ProfileBuilder::from_file("${json.attributes.bandwidth_file}"));`
                                    });
                                }

                                // set latency profile if exists
                                if (typeof json.attributes.latency_file !== 'undefined') {
                                    cppCodeArr.push({
                                        cpp: `\t${value + count}->set_latency_profile(simgrid::kernel::profile::ProfileBuilder::from_file("${json.attributes.latency_file}"));`
                                    });
                                }

                                // set state profile if exists
                                if (typeof json.attributes.state_file !== 'undefined') {
                                    cppCodeArr.push({
                                        cpp: `\t${value + count}->set_state_profile(simgrid::kernel::profile::ProfileBuilder::from_file("${json.attributes.state_file}"));`
                                    });
                                }

                                // seal if parent zone's routing is full
                                if (parentZone.routing !== 'Full') {
                                    cppCodeArr.push({
                                        cpp: `\t${value + count}->seal();`
                                    });
                                }

                                // Variable
                                varDict[json.attributes.id] = value + count
                                propParent = value + count
                                break;

                            case "router":
                                // error-checking
                                if (typeof json.attributes.id === "undefined" ) {
                                    alert(`Error: Make sure all routers have IDs!`)
                                }

                                // set coordinates if exists
                                if (typeof json.attributes.coordinates !== 'undefined') {
                                    cppCodeArr.push({
                                        cpp: `\t${value + count}->set_coordinates("${json.attributes.coordinates}");`
                                    });
                                }

                                // Variable
                                varDict[json.attributes.id] = value + count
                                propParent = value + count
                                break;

                            case "route":
                                // error-checking
                                if (typeof json.attributes.src === "undefined" ) {
                                    alert(`Error: Make sure all routes have a source!`)
                                }
                                if (typeof json.attributes.dst === "undefined" ) {
                                    alert(`Error: Make sure all routes have a destination!`)
                                }

                                // for each child routes
                                let routeParent = parentZone;
                                json.children.forEach(child => {
                                    // checks for symmetric and duplicate routes
                                    if ((child.attributes.src !== child.attributes.dst) || (routeDict[child.attributes.src] !== child.attributes.dst) || (routeDict[child.attributes.dst] !== child.attributes.src)) {
                                        cppCodeArr.push({
                                            cpp: `\t${routeParent}->add_route(${varDict[child.attributes.src]}, ${varDict[child.attributes.dst]}, {${varDict[child.attributes.id]}});`
                                        });
                                        routeDict[child.attributes.src] = child.attributes.dst
                                        routeDict[child.attributes.dst] = child.attributes.src
                                    } else {
                                        // logs to console all duplicate routes
                                        console.log(`Duplicate Route From ${json.attributes.src} to ${json.attributes.dst} Will be Removed From C++ Export`);
                                    }
                                })

                                // Variables
                                propParent = value + count
                                break;

                            case "zoneRoute":
                                let zoneRouteParent = parentZone

                                json.children.forEach(child => {
                                    cppCodeArr.push({
                                        cpp: `\t${zoneRouteParent}->add_route(${varDict[json.attributes.src]}, ${varDict[json.attributes.dst]}, {${varDict[child.attributes.id]}});`
                                    });
                                })

                                // Variables
                                propParent = value + count
                                break;

                            case "config":
                                propParent = json.name
                                break;

                            case "prop":
                                // error-checking
                                if (typeof json.attributes.id === "undefined" ) {
                                    alert(`Error: Make sure all props have IDs!`)
                                }
                                if (typeof json.attributes.value === "undefined" ) {
                                    alert(`Error: Make sure all props have values!`)
                                }

                                // non-config props
                                if ((typeof propParent !== 'undefined') && (propParent !== 'config')) {
                                    cppCodeArr.push({
                                        cpp: `\t${propParent}->set_property("${json.attributes.id}", "${json.attributes.value}");`
                                    });
                                }

                                // config props
                                if (propParent === 'config') {
                                    cppCodeArr.push({
                                        cpp: `\tsimgrid::s4u::Engine::set_config("${json.attributes.id}:${json.attributes.value}");`
                                    });
                                }

                                break;

                            case "cluster":

                                if (json.attributes.topology === 'TORUS' || json.attributes.topology === 'DRAGONFLY' || json.attributes.topology === 'FAT_TREE') {
                                    alert("No C++ Export Support for Torus, Dragonfly, and Fat Tree Clusters Yet!")
                                }

                                cppCodeArr.push({
                                    cpp: `\tauto ${value + count} = sg4::create_star_zone("${value + count}");`
                                })

                                // if cluster is child of world zone, set parent to world
                                if (typeof parentZone !== 'undefined') {
                                    cppCodeArr.push({
                                        cpp:`\t${value + count}->set_parent(${parentZone});`
                                    });
                                }

                                // backbone cluster
                                if (typeof json.attributes.bb_bw !== 'undefined' && typeof json.attributes.bb_lat !== 'undefined') {
                                    cppCodeArr.push({
                                        cpp: `\tauto ${value + count}Router = ${value + count}->create_router("${json.attributes.prefix + value + count + '_router' + json.attributes.suffix}");\n`
                                            + `\tauto ${value + count}L_bb = ${value + count}->create_link("${value + count}backbone${json.attributes.suffix}", "${json.attributes.bb_bw}")->set_latency("${json.attributes.bb_lat}");\n`
                                            + `\tfor (int i = 0; i < 10; i++) {\n`
                                            + `\t\tstd::string ${value + count}Hostname = "${value + count} + ${json.attributes.prefix}" + std::to_string(i) + "${json.attributes.suffix}";`
                                    })
                                } else {
                                    cppCodeArr.push({
                                        cpp: `\tauto ${value + count}Router = ${value + count}->create_router("${typeof json.attributes.router_id !== 'undefined' ? json.attributes.router_id : json.attributes.prefix + value + count + '_router' + json.attributes.suffix}");\n`
                                            + `\t${value + count}->set_gateway(${value + count}Router);\n`
                                            + `\tfor (int i = 0; i < 10; i++) {\n`
                                            + `\t\tstd::string ${value + count}Hostname = "${value + count} + ${json.attributes.prefix}" + std::to_string(i) + "${json.attributes.suffix}";`
                                    })
                                }

                                // check for list of speeds
                                if (json.attributes.speed.includes(',')) {
                                    let speedList = json.attributes.speed.split(',').map(function (item) {
                                        return '"' + item + '"';
                                    });
                                    cppCodeArr.push({
                                        cpp: `\t\tauto ${value + count}Host = ${value + count}->create_host(${value + count}Hostname, {${speedList}});`
                                    });
                                } else {
                                    cppCodeArr.push({
                                        cpp: `\t\tauto ${value + count}Host = ${value + count}->create_host(${value + count}Hostname, "${json.attributes.speed}");`
                                    });
                                }

                                if (typeof json.attributes.bb_bw !== 'undefined' && typeof json.attributes.bb_lat !== 'undefined') {
                                    cppCodeArr.push({
                                        cpp: `\t\tauto ${value + count}Link = ${value + count}->create_link(${value + count}Hostname + "-link", "${json.attributes.bw}")->set_latency("${json.attributes.lat}");\n`
                                            + `\t\tsg4::LinkInRoute ${value + count}My_link(${value + count}Link);\n`
                                            + `\t\tsg4::LinkInRoute ${value + count}Bb_link(${value + count}L_bb);\n`
                                            + `\t\t${value + count}->add_route(${value + count}Host, nullptr, {${value + count}My_link, ${value + count}Bb_link}, true);\n`
                                            + `\t}\n`
                                            + `\t${value + count}->set_gateway(${value + count}Router);`
                                    });
                                } else {
                                    cppCodeArr.push({
                                        cpp: `\t\tauto ${value + count}Link = ${value + count}->create_link(${value + count}Hostname + "-link", "${json.attributes.bw}")->set_latency("${json.attributes.lat}");\n`
                                            + `\t\tsg4::LinkInRoute ${value + count}My_link(${value + count}Link);\n`
                                            + `\t\t${value + count}->add_route(${value + count}Host, nullptr, {${value + count}My_link}, true);\n`
                                            + `\t}`
                                    });
                                }

                                varDict[json.attributes.id] = value + count
                                propParent = value + count
                                break;

                            default:
                                break;
                        }
                    }
                    break;
                default:
                    // If the value is an object, recursively iterate through its keys
                    if (typeof value === "object") {
                        convertCPP(value, cppCodeArr, parentZone, parentHost, propParent, lastChild);
                        // if last child of a zone
                        if (isEqual(lastChild, value)) {
                            // for each type of last child, push respective C++ code
                            switch (lastChild.name) {
                                // if last child of zone is a host, set gateway
                                case "host":
                                    cppCodeArr.push({
                                        cpp: `\t${parentZone}->set_gateway(${varDict[value.attributes.id]}->get_netpoint());\n`
                                            + `\t${parentZone}->seal();`
                                    })
                                    break;
                                default:
                                    cppCodeArr.push({
                                        cpp: `\t${parentZone}->seal();`
                                    })
                                    break;
                            }
                        }
                    }
                    break;
            }
        }
    }
}
console.log("XML IDs are converted to C++ appropriate variables; varDict is a dict that shows the conversions")
console.log(varDict)

// cpp code starting lines
export function startCPP(cppCodeArr) {
    cppCodeArr.push({
        cpp: '#include <simgrid/s4u.hpp>\n'
            + '#include <simgrid/kernel/ProfileBuilder.hpp>\n'
            + 'namespace sg4 = simgrid::s4u;\n'
            + 'extern "C" void load_platform(const sg4::Engine &e);'
    });
}

// cpp code closing lines
export function closeCPP(cppCodeArr) {
    cppCodeArr.push({
        cpp: '};'
    });
}