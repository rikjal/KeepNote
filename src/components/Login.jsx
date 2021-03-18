import {faLock, faUserNinja} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import React, {useEffect, useState} from 'react'
import {Link} from 'react-router-dom'
import {Redirect} from 'react-router-dom'
import axios from 'axios'
import base_url from '../bootapi'
import {Card, CardBody, CardHeader, Col, Container, Form, FormGroup, Input, Row, Carousel, CarouselItem, CarouselControl, CarouselIndicators, CarouselCaption} from 'reactstrap'
import {toast} from 'react-toastify'
import Header from './Header'
import Cookies from 'js-cookie'

const items = [
    {
        src: 'https://source.unsplash.com/1000x600/?notes',
        altText: 'Always at your service',
        caption: 'SAVE YOUR NOTES ANYWHERE, ANYTIME!'
    },
    {
        src: 'https://source.unsplash.com/1000x600/?pen',
        altText: 'KeepNote helps to capture ideas and find them at your ease',
        caption: 'CAPTURE WHAT MATTERS!'
    },
    {
        src: 'https://source.unsplash.com/1000x600/?notebook',
        altText: 'Express yourself with formatting tools that help you write how you think',
        caption: 'YOUR NOTES, YOUR WAY!'
    }
]

const Login = () => {
    const [activeIndex, setActiveIndex] = useState( 0 )
    const [animating, setAnimating] = useState( false )

    const next = () => {
        if ( animating ) return
        const nextIndex = activeIndex === items.length - 1 ? 0 : activeIndex + 1
        setActiveIndex( nextIndex )
    }

    const previous = () => {
        if ( animating ) return
        const nextIndex = activeIndex === 0 ? items.length - 1 : activeIndex - 1
        setActiveIndex( nextIndex )
    }

    const goToIndex = ( newIndex ) => {
        if ( animating ) return
        setActiveIndex( newIndex )
    }
    const slides = items.map( ( item ) => {
        return (
            <CarouselItem
                onExiting={() => setAnimating( true )}
                onExited={() => setAnimating( false )}
                key={item.src}
            >
                <img src={item.src} alt={item.altText} />
                <CarouselCaption captionText={item.altText} className="d-block" captionHeader={item.caption} />
            </CarouselItem>
        )
    } )
    useEffect( () => {
        document.title = "KeepNote | Login"
    }, [] )

    const [user, setUser] = useState( {} )
    const [loggedIn, setLoggedIn] = useState( false )
    useEffect( () => {
        if ( Cookies.get( "token" ) == null )
            setLoggedIn( false )
        else
            setLoggedIn( true )
    }, [] )
    const handleChange = e => {
        setUser( {...user, [e.target.name]: e.target.value} )
    }
    const handleSubmit = e => {
        e.preventDefault()
        axios.post( `${base_url}/login`, {user} ).then(
            res => {
                Cookies.set( "token", res.data.token )
                setLoggedIn( true )
            },
            err => {
                toast.error( err.response.data.message, {position: 'bottom-left'} )
                setLoggedIn( false )
            }
        )
    }

    if ( loggedIn )
        return <Redirect to="/home" />

    return (
        <>
            <Header />
            <div className="mb-3" style={{marginTop: "10vh"}}>
                <Container fluid>
                    <Row className="flex-column-reverse flex-md-row">
                        <Col md="8" className="mt-3">
                            <Carousel
                                activeIndex={activeIndex}
                                next={next}
                                previous={previous}
                            >
                                <CarouselIndicators items={items} activeIndex={activeIndex} onClickHandler={goToIndex} />
                                {slides}
                                <CarouselControl direction="prev" directionText="Previous" onClickHandler={previous} />
                                <CarouselControl direction="next" directionText="Next" onClickHandler={next} />
                            </Carousel>
                        </Col>
                        <Col className="ml-auto mt-3" md="4">
                            <Card className="bg-1">
                                <CardHeader className="text-center text-primary"><FontAwesomeIcon
                                    icon={faLock} size="3x" /><h3>User Login</h3></CardHeader>
                                <CardBody>
                                    <h5>Please login to continue ➡️</h5>
                                    <Form onSubmit={handleSubmit} onChange={handleChange}>
                                        <FormGroup className="text-center">
                                            <FontAwesomeIcon className="mb-2 text-danger"
                                                icon={faUserNinja} size="4x" />
                                            <Input type="email" name="email_id" id="email"
                                                placeholder="✉️ Enter email here" autoComplete="off" required />
                                        </FormGroup>
                                        <FormGroup className="text-center">
                                            <Input type="password" name="password"
                                                id="password" placeholder="🔒 Enter your password" required />
                                        </FormGroup>
                                        <FormGroup className="text-center">
                                            <input value="🔑 Login 🔑" className="btn btn-success w-50" type="submit" />
                                        </FormGroup>
                                        <FormGroup className="text-center">
                                            <p>Not a member?<Link to="/register" className="text-decoration-none"> Create your account now!</Link></p>
                                        </FormGroup>
                                    </Form>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>
        </>
    )
}

export default Login
