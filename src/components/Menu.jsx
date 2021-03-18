import axios from 'axios'
import Cookies from 'js-cookie'
import React, {useState} from 'react'
import {Link} from 'react-router-dom'
import {useHistory} from 'react-router-dom/cjs/react-router-dom.min'
import {toast} from 'react-toastify'
import {ListGroup} from 'reactstrap'
import {Button, Form, FormGroup, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader} from 'reactstrap'
import base_url from '../bootapi'

const Menu = () => {
    const history = useHistory()
    const [modal, setModal] = useState( false )
    const [user, setUser] = useState( {} )
    const toggle = () => {
        axios.get( `${base_url}/getuser`, {
            headers: {
                'x-access-token': Cookies.get( "token" )
            }
        } ).then(
            res => {
                setUser( {name: res.data.user.name, email_id: res.data.user.email_id} )
            },
            error => {
                toast.error( error.response.data.message, {position: 'bottom-left'} )
            }
        )
        setModal( !modal )
    }
    const handleChange = e => setUser( {...user, [e.target.name]: e.target.value} )
    const handleSubmit = ( e ) => {
        e.preventDefault()
        if ( user.password == null || user.password.length >= 6 )
            axios.patch( `${base_url}/user`, user, {
                headers: {
                    'x-access-token': Cookies.get( 'token' )
                }
            } ).then(
                res => {
                    toast.success( res.data.message, {position: 'bottom-left'} )
                    toggle()
                    history.push( '/' )
                },
                error => {toast.error( error.response.data.message, {position: 'bottom-left'} )}
            )
        else {
            if ( user.password.length < 6 ) {
                setUser( {...user, password: ''} )
                console.log( user )
                toast.warning( "Password length must be 6 characters or more!", {position: 'top-center'} )
            }
        }
    }
    return (
        <div>
            <ListGroup className="bg-me2 mb-3 p-3">
                <Link className="list-group list-group-item-action pb-3" to="/home">🏠 Home</Link>
                <Link className="list-group list-group-item-action pb-3" to="/add-note" action>🖊️ Add a Note</Link>
                <Link className="list-group list-group-item-action pb-3" to="/view-notes" action>📓 View Notes</Link>
                <Link className="list-group list-group-item-action pb-3" to="#" onClick={toggle} action>👨 Your Profile</Link>
                <Link className="list-group list-group-item-action pb-2" to="#" action>💻 About Me</Link>
            </ListGroup>
            <Modal isOpen={modal} toggle={toggle}>
                <Form onChange={handleChange} onSubmit={handleSubmit}>
                    <ModalHeader toggle={toggle}>Update Profile</ModalHeader>
                    <ModalBody>
                        <FormGroup>
                            <Label for="name">Name:</Label>
                            <Input type="text" name="name"
                                id="name" placeholder="👨 Update your name" autoComplete="off" value={user.name} />
                        </FormGroup>
                        <FormGroup className="text-center">
                            <Input type="email" name="email_id" value={user.email_id} id="email"
                                placeholder="📧 Update your email" autoComplete="off" />
                        </FormGroup>
                        <FormGroup>
                            <Input type="password" name="password"
                                id="password" placeholder="🔒 Update your password" value={user.password} />
                        </FormGroup>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="success" type="submit">🌍 Update</Button>
                        <Button color="secondary" onClick={toggle}>⛔ Cancel</Button>
                    </ModalFooter>
                </Form>
            </Modal>
        </div >
    )
}

export default Menu
