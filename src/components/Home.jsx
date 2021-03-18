import axios from 'axios'
import Cookies from 'js-cookie'
import React, {useEffect, useState} from 'react'
import {Redirect, useLocation} from 'react-router-dom'
import {toast} from 'react-toastify'
import {Col, Container, Row} from 'reactstrap'
import base_url from '../bootapi'
import Header from './Header'
import Menu from './Menu'
import UpdateNote from './UpdateNote'


const Home = ( props ) => {
    const [user, setUser] = useState( {} )
    const loc = useLocation().pathname
    if ( props.location !== undefined )
        var cId = props.location.about.id
    useEffect( () => {
        const token = Cookies.get( "token" )
        if ( token == null ) {
            return <Redirect to="/" />
        }
        if ( token != null ) {
            axios.get( `${base_url}/getuser`, {
                headers: {
                    'x-access-token': token
                }
            } ).then(
                res => {
                    setUser( res.data.user )
                },
                error => {
                    toast.error( error.response.data.message, {position: 'bottom-left'} )
                }
            )
        }

    }, [] )
    if ( Cookies.get( "token" ) == null )
        return <Redirect to="/" />

    return (
        <>
            <Header email={user.email_id} name={user.name} />
            <div style={{marginTop: "12vh"}}>
                <Container>
                    <Row>
                        <Col md={4}>
                            <Menu />
                        </Col>
                        <Col md={8}>
                            {loc === '/update-note' ? <UpdateNote id={cId} /> : props.comp}
                        </Col>
                    </Row>
                </Container>
            </div>
        </>
    )
}

export default Home
