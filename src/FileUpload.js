import {useState} from "react";
import XMLParser from 'react-xml-parser';
import convertCyto from "./ConvertCyto";
import {convertCPP, startCPP, closeCPP} from "./ConvertCPP";
import DownloadCPPButton from "./DownloadCPPButton";

// file upload button and operations
function FileUploadButton(props) {
    // use state variables for selected file to be uploaded
    const [selectedFile, setSelectedFile] = useState();

    // use state variables for elements in C++ code download
    const [cppDlElements, setCppDlElements] = useState([]);

    // target file to be selected
    const changeHandler = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    // reads file
    const handleSubmission = () => {
        const allowedExtensions =
            /(xml)/;
        let preParseData;
        const reader = new FileReader();

        // validates readability of file
        try {
            reader.readAsText(selectedFile);
        } catch (error) {
            alert("Invalid Input!");
            console.log(error);
            return;
        }

        // validates extension of file
        if (!allowedExtensions.exec(selectedFile['type'])) {
            alert('Invalid File Type');
            return;
        }

        reader.onload = function (e) {
            preParseData = e.target.result;
            props.handlePPD(preParseData)
            parseData(preParseData);
        }
    };

    // parse file data from XML to json
    const parseData = (data) => {
        const jsonDataFromXml = new XMLParser().parseFromString(data);

        // array for parsed graph elements
        const graphElements = [];
        // parsing function for json
        convertCyto(jsonDataFromXml, graphElements);
        // passes graph elements
        props.handleElements(graphElements);

        // array for parsed C++ code
        const cppCodeArr = [];
        // function for parsing json to C++ code
        startCPP(cppCodeArr);
        convertCPP(jsonDataFromXml, cppCodeArr);
        closeCPP(cppCodeArr);

        // sets C++ download elements to C++ code array
        setCppDlElements(cppCodeArr);

    };

    //render
    return (
      <div>
           <h5>
           Display Graph of System:
           </h5>
           <input type="file" name="file" onChange={changeHandler} />
           <div>
               <button onClick={handleSubmission}>Submit</button>
           </div>
          <br/>
          <DownloadCPPButton props={cppDlElements}/>
       </div>
    );
}

export default FileUploadButton;
