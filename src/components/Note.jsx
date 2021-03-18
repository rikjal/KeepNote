import axios from 'axios'
import Cookies from 'js-cookie'
import React from 'react'
import {Link} from 'react-router-dom'
import {toast} from 'react-toastify'
import {Card, CardBody, CardTitle, CardText, Container, Button, CardHeader} from 'reactstrap'
import base_url from '../bootapi'
import ReactHtmlParser from 'react-html-parser'
const Note = ( {note, update} ) => {
    async function deleteNote( id ) {
        await axios.delete( `${base_url}/note/${id}`, {
            headers:
            {
                'x-access-token': Cookies.get( 'token' )
            }
        } ).then(
            ( res ) => {
                toast.warning( "Deleted!", {position: 'bottom-left'} )
                update( id )
            },
            ( error ) => {
                toast.error( "Error occured while deleting the note!", {position: 'bottom-left'} )
            }
        )
    }

    return (
        <Card className="w-100 text-dark mb-3 bg-note">
            <CardHeader className="bg-card-top">
                <CardTitle className="h4 text-light text-left">{note.title}</CardTitle>
            </CardHeader>
            <CardBody>
                <CardText className="text-left">{ReactHtmlParser( note.text )}</CardText>
                <Container className="text-center">
                    <Link className="btn btn-warning mr-3" to={{
                        pathname: '/update-note',
                        about: {
                            id: note.id
                        }
                    }}>Update</Link>
                    <Button color="danger" onClick={() => {deleteNote( note.id )}}>Delete</Button>
                </Container>
            </CardBody>
        </Card >
    )
}

export default Note
