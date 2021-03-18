import {faStickyNote} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import axios from 'axios'
import Cookies from 'js-cookie'
import React, {useEffect, useState} from 'react'
import {useHistory} from 'react-router-dom'
import {toast} from 'react-toastify'
import {Container, Form, FormGroup, Input, Button, Card, CardHeader, CardBody} from 'reactstrap'
import base_url from '../bootapi'

const AddNote = () => {
    const history = useHistory()
    useEffect( () => {
        document.title = "Add new note"
    }, [] )
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
    const ctrlEnter = ( e ) => e.keyCode === 13 && e.ctrlKey && postData( note )
    return (
        <React.Fragment>
            <Container>
                <Card className="bg-card text-light">
                    <CardHeader className="bg-card-header text-center">
                        <FontAwesomeIcon icon={faStickyNote} size="3x" />
                        <h2 className="text-center my-3">Add your note</h2>
                    </CardHeader>
                    <CardBody>
                        <Form onSubmit={handleForm}>
                            <FormGroup>
                                <label for="title">Note Title</label>
                                <Input type="text" placeholder="Enter title here" name="title" id="title" value={note.title} onChange={
                                    ( e ) => {setNote( {...note, title: e.target.value} )}
                                } required />
                            </FormGroup>
                            <FormGroup>
                                <label for="desc">Note Description</label>
                                <Input type="textarea" placeholder="Enter description here (CTRL+ENTER to submit)" name="desc" id="desc"
                                    style={{height: '30vh'}} value={note.text}
                                    onChange={( e ) => {setNote( {...note, text: e.target.value} )}}
                                    onKeyDown={ctrlEnter} required />
                            </FormGroup>
                            <Container className="mb-5 text-center">
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
