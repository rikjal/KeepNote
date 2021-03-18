import {faPlane} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import axios from 'axios'
import {ContentState, convertFromHTML, convertToRaw, EditorState} from 'draft-js'
import {Editor} from 'react-draft-wysiwyg'
import Cookies from 'js-cookie'
import React, {useState, useEffect} from 'react'
import {useHistory} from 'react-router-dom'
import {toast} from 'react-toastify'
import {Button, Container, Form, FormGroup, Input, Label} from 'reactstrap'
import base_url from '../bootapi'
import draftToHtml from 'draftjs-to-html'


const UpdateNote = ( props ) => {
    const history = useHistory()
    const [note, setNote] = useState( {} )
    const [editorState, setEditorState] = useState()
    const cId = props.id
    async function fetchDetails() {
        await axios.get( `${base_url}/note/${cId}`, {
            headers: {'x-access-token': Cookies.get( "token" )}
        } ).then(
            ( res ) => {
                const nt = convertFromHTML( res.data.text )
                console.log( nt + "kusjdfhaosfrikuajsplfjalsfjaslfjkialxfkhjaslfkha" )
                const state = ContentState.createFromBlockArray(
                    nt.contentBlocks,
                    nt.entityMap,
                )
                setEditorState( EditorState.createWithContent( state ) )
                setNote( {id: cId, title: res.data.title} )
            },
            ( error ) => {
                toast.error( "Error occured!", {position: 'bottom-left'} )
            }
        )
    }
    async function updateNote() {
        await axios.patch( `${base_url}/note/${cId}`, note, {
            headers: {'x-access-token': Cookies.get( "token" )}
        } ).then(
            ( res ) => {
                toast.warning( "Updated successfully!", {position: 'bottom-left'} )
                history.push( '/view-notes' )
            },
            ( error ) => {
                toast.error( "Error ocurred while updating!", {position: 'bottom-left'} )
            }
        )
    }
    useEffect( () => {
        document.title = 'KeepNote|Update Note'
        fetchDetails()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [] )
    const handleForm = ( e ) => {
        e.preventDefault()
        updateNote()
    }

    const onEditorStateChange = ( e ) => {
        setEditorState( e )
        setNote( {...note, text: draftToHtml( convertToRaw( editorState.getCurrentContent() ) )} )
    }
    // const ctrlEnter = e => e.keyCode === 13 && e.ctrlKey && updateNote( note )
    return (
        <React.Fragment>
            <Container>
                <FontAwesomeIcon className="text-light" icon={faPlane} size="2x" pull="left" />
                <h2 className=" my-3 text-light">Update Note: <span style={{color: "maroon"}}>{note.title}</span></h2>
                <Form onSubmit={handleForm}>
                    <FormGroup>
                        <Label className="text-light">Note Title:</Label >
                        <Input type="text" placeholder="Enter title here" name="title" id="title" value={note.title} onChange={
                            ( e ) => {setNote( {...note, title: e.target.value} )}
                        } required />
                    </FormGroup>
                    <FormGroup>
                        <Label className="text-light">Note Text:</Label>
                        <div style={{borderRadius: "25px", height: "25vh", background: "#FFFDD0"}}>
                            <Editor
                                editorState={editorState}
                                toolbarClassName="toolbarClassName"
                                wrapperClassName="wrapperClassName"
                                editorClassName="editorClassName"
                                onEditorStateChange={onEditorStateChange}
                                placeholder="Write your note here"
                            />
                        </div>
                        {/* <Input type="textarea" placeholder="Enter description here" name="text" id="text"
                            style={{height: '40vh'}} value={note.text}
                            onChange={( e ) => {setNote( {...note, text: e.target.value} )}} onKeyDown={ctrlEnter} required /> */}
                    </FormGroup>
                    <Container className="mb-5 text-center">
                        <Button color="success" type="submit">🌍Update Note</Button>
                        <Button color="warning ml-2" type="reset" onClick={() => {setNote( {title: "", text: ""} )}}>Clear</Button>
                    </Container>
                </Form>
            </Container>
        </React.Fragment>
    )
}

export default UpdateNote
