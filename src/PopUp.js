import { useState, useRef } from "react";
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import { omit } from 'lodash';

// modal style
// Src and demo - https://codesandbox.io/s/766my2?file=/demo.js:546-587
const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '25vw',
    backgroundColor: 'lightblue',
    border: 'ridge thick #000',
    boxShadow: 24,
    padding: 4,
};

// Takes in a node object, data elements, and state variables from app.js
export default function PopUp({ obj, open, close, handleElements }) {
    const [editedObj, setEditedObj] = useState(obj);
    const [editing, setEditing] = useState(false);

    // eliminates box de-selection and cursor disappearance
    const inputRef = useRef(null);

    // Setting the edited object to its key
    const handleEdit = (key, value) => {
        setEditedObj({
            ...editedObj,
            [key]: value
        });
    };

    // handles editing
    const handleStartEditing = () => {
        setEditing(true);
        setEditedObj(obj);
        if (inputRef.current) {
            inputRef.current.focus();
        }
    };

    // handles cancel of editing
    const handleCancelEditing = () => {
        setEditing(false);
        setEditedObj(obj);
    };

    // if data.id === editedObj.id, save the new value if edited
    const handleSave = () => {
        handleElements(prevElements => {
            return prevElements.map(el => {
                if (el.data.id === editedObj.id) {
                    return {
                        ...el,
                        data: {
                            ...el.data,
                            ...editedObj
                        }
                    };
                }
                return el;
            });
        });
        close();
        setEditing(false);
    };

    // Takes node object from props, passes to const DisplayObject as attribute
    // Loops through object attribute. (Should be object data). Display in a <p> tag
    const DisplayObject = ({ obj }) => {
        const doNotShow = ['eleType', 'parent', 'type', 'shape'];
        let newObj = omit(obj, doNotShow); // Deletes keys

        // Edit ID to exclude parentHost
        // This is intended for the <disk>, but will apply to any other modified id for 'uniqueness'
        if (obj.eleType === 'disk') {
            let newStr = newObj.id;
            newStr = newStr.substring(newStr.indexOf(' ') + 1);
            newObj.id = newStr;
        }

        return (
            <div>
                {Object.entries(newObj).map(([key, val]) => (
                    <div key={key}>
                        <label htmlFor={key}>{key.toUpperCase()}: </label>
                        {key === "id" ? (
                            <span>{val}</span>
                        ) : !editing ? (
                            <span>{val}</span>
                        ) : (
                            <input
                                id={key}
                                type="text"
                                defaultValue={editedObj[key]}
                                onBlur={(e) => handleEdit(key, e.target.value)}
                                ref={inputRef}
                            />
                        )}
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div>
            <Modal open={open} onClose={close}>
                <Box sx={style}>
                    <h2>{obj.eleType ? (obj.eleType.toUpperCase()) : (obj.eleType)} PROPERTIES</h2>
                    <DisplayObject obj={obj} />
                    <br/>
                    {!editing ? (
                        <button onClick={handleStartEditing}>EDIT</button>
                    ) : (
                        <div>
                            <button onClick={handleSave}>SAVE</button>
                            <button onClick={handleCancelEditing}>CANCEL</button>
                        </div>
                    )}
                </Box>
            </Modal>
        </div>
    );
}
