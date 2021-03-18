import React, {useEffect, useState} from 'react'
import Note from './Note'
import base_url from '../bootapi'
import axios from 'axios'
import {toast} from 'react-toastify'
import Cookies from 'js-cookie'
import {Col, Row} from 'reactstrap'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faBookReader} from '@fortawesome/free-solid-svg-icons'

const AllNotes = () => {
    useEffect( () => {
        document.title = "All Notes"
    }, [] )
    const [notes, setNotes] = useState( [] )
    async function getAllNotes() {
        await axios.get( `${base_url}/note`, {
            headers: {
                "x-access-token": Cookies.get( "token" )
            }
        } ).then(
            ( response ) => {
                toast.success( "Notes have been loaded!", {position: 'bottom-left'} )
                setNotes( response.data )
            },
            ( error ) => {
                toast.error( "Error while loading", {position: 'bottom-left'} )
            }
        )
    }
    const updateNotes = ( id ) => {
        setNotes( notes.filter( ( c ) => c.id !== id ) )
    }
    useEffect( () => {
        getAllNotes()
    }, [] )
    return (
        <div className="text-light text-center">
            <FontAwesomeIcon icon={faBookReader} size="3x" className="mb-2" />
            <h2 className="mb-3">All Notes</h2>
            <Row>
                {notes.length > 0 ? notes.map( ( item ) => <Col md="6"><Note key={item.id} note={item} update={updateNotes} /></Col> ).reverse() :
                    <p className="text-warning h5 ml-auto mr-auto">No note found!</p>}
            </Row>
        </div>
    )
}

export default AllNotes
