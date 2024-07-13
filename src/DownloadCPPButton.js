// button for downloading C++ code zip package
import JSZip from "jszip";
import FileSaver from 'file-saver';
import {cmakelist} from "./cmakelist.js";
import {findsimgrid} from "./findsimgrid";
import {maincpp} from "./maincpp.js"

export default function DownloadCPPButton(props) {
    // passed C++ elements
    const cppElements  = props.props;

    // handles clicking of C++ download button
    const handleClick = () => {
        // checks for no graph XML submission
        if (cppElements.length === 0) {
            alert("No Graph XML Was Submitted!");
            return;
        }

        // converts C++ array elements to string of C++ code
        const cppCode = convertArr(cppElements);

        // string content for other files in package
        const main = maincpp;
        const cmlist = cmakelist;
        const findsgrid = findsimgrid;

        // creates zip download package
        const zip = new JSZip();
        let main_folder = zip.folder("SimGrid_CPP_Platform")
        main_folder.file("platform_creator.cpp", cppCode);
        main_folder.file("main.cpp", main);
        main_folder.file("CMakeLists.txt", cmlist);
        let CMakeModules = main_folder.folder("CMakeModules")
        CMakeModules.file("FindSimGrid.cmake", findsgrid);
        zip.generateAsync({type: "blob"})
            .then(function(content) {
                FileSaver.saveAs(content, "SimGrid_CPP_Platform.zip");
        });
    };

    // render
    return (
    <>
        <button onClick={handleClick}>Export C++</button>
    </>
    )
}

// takes an array of lines of C++ code and convert to a concatenated string
function convertArr(arr) {
    let cppCode = '';

    arr.forEach(item => {
        Object.values(item).forEach(value => {
            cppCode += value + '\n';
        });
    });

    return cppCode;
}