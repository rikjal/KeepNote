import {faStickyNote} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import axios from 'axios'
import Cookies from 'js-cookie'
import React, {useEffect, useState} from 'react'
import {useHistory} from 'react-router-dom'
import {toast} from 'react-toastify'
import {Container, Form, FormGroup, Input, Button, Card, CardHeader, CardBody} from 'reactstrap'
import base_url from '../bootapi'
import {Editor} from 'react-draft-wysiwyg'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import {EditorState, convertToRaw} from 'draft-js'
import draftToHtml from 'draftjs-to-html'


const AddNote = () => {
    const history = useHistory()
    useEffect( () => {
        document.title = "Add new note"
    }, [] )
    const [editorState, setEditorState] = useState( EditorState.createEmpty() )
    const onEditorStateChange = ( e ) => {
        setEditorState( e )
        setNote( {...note, text: draftToHtml( convertToRaw( editorState.getCurrentContent() ) )} )
    }
    const [note, setNote] = useState( {} )
    const handleForm = ( e ) => {
        postData( note )
        e.preventDefault()
    }
    async function postData( data ) {
        await axios.post( `${base_url}/note`, data, {
            headers: {'x-access-token': Cookies.get( "token" )}
        } ).then(
            ( response ) => {
                setNote( {title: '', text: ''} )
                toast.dark( "Note has been added!", {position: 'bottom-right'} )
                history.push( `/view-notes` )
            },
            ( error ) => {toast.error( error, {position: 'bottom-left'} )}
        )
    }

    return (
        <React.Fragment>
            <Container>
                <Card className="bg-card">
                    <div className="text-light">
                        <CardHeader className="bg-card-header text-center">
                            <FontAwesomeIcon icon={faStickyNote} size="3x" />
                            <h2 className="text-center my-3">Add your note</h2>
                        </CardHeader>
                    </div>
                    <CardBody>
                        <Form onSubmit={handleForm}>
                            <FormGroup>
                                <label className="text-light" for="title">Note Title:</label>
                                <Input type="text" placeholder="Enter title here" name="title" id="title" value={note.title} onChange={
                                    ( e ) => {setNote( {...note, title: e.target.value} )}
                                } required />
                            </FormGroup>
                            <FormGroup>
                                <label for="desc" className="text-light">Note Description:</label>
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
                                {/* <Editor placeholder="Enter description here (CTRL+ENTER to submit)" name="desc" id="desc"
                                    style={{height: '30vh'}} value={note.text}
                                    onChange={( e ) => {setNote( {...note, text: e.target.value} )}}
                                    onKeyDown={ctrlEnter} required /> */}
                            </FormGroup>
                            <Container className="mb-2 mt-4 text-right">
                                <input onClick={handleForm} className="btn btn-success" type="submit" value="➕ Add Note" />
                                <Button color="warning ml-2" type="reset" onClick={() => {setNote( {} )}}>🗑️ Clear</Button>
                            </Container>
                        </Form>
                    </CardBody>
                </Card>
            </Container>
        </React.Fragment>
    )
}

export default AddNote
