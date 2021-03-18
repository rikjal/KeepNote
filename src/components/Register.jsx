import {faPenAlt, faUserAstronaut} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import axios from 'axios'
import Cookies from 'js-cookie'
import React, {useEffect, useState} from 'react'
import {Link, Redirect} from 'react-router-dom'
import {toast} from 'react-toastify'
import {
    Card, CardBody, CardHeader, Col, Container, Form, FormGroup, Input, Row, Carousel,
    CarouselItem,
    CarouselControl,
    CarouselIndicators,
    CarouselCaption
} from 'reactstrap'
import base_url from '../bootapi'
import Header from './Header'
const items = [
    {
        src: 'https://source.unsplash.com/1000x600/?notes',
        altText: 'Always at your service',
        caption: 'SAVE YOUR NOTES ANYWHERE, ANYTIME!'
    },
    {
        src: 'https://source.unsplash.com/1000x600/?newspaper',
        altText: 'KeepNote helps to capture ideas and find them at your ease',
        caption: 'CAPTURE WHAT MATTERS!'
    },
    {
        src: 'https://source.unsplash.com/1000x600/?notebook',
        altText: 'Express yourself with formatting tools that help you write how you think',
        caption: 'YOUR NOTES, YOUR WAY!'
    }
]

const Register = ( props ) => {
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
                <CarouselCaption captionText={item.altText} captionHeader={item.caption} className="d-block" />
            </CarouselItem>
        )
    } )

    const [user, setUser] = useState( {} )
    const [loggedIn, setLoggedIn] = useState()
    useEffect( () => {
        document.title = "KeepNote | Register"
    }, [] )

    const handleChange = e => {
        setUser( {...user, [e.target.name]: e.target.value} )
    }
    const handleSubmit = e => {
        e.preventDefault()
        if ( user.password !== user.confPass ) {
            setUser( {password: '', confPass: ''} )
            toast.error( "Passwords didn't match!", {position: 'top-center'} )
        }
        else if ( user.password.length < 6 ) {
            setUser( {password: '', confPass: ''} )
            toast.warning( "Password length must be 6 characters or more!", {position: 'top-center'} )
        }
        else {
            //register
            axios.post( `${base_url}/user`, user ).then(
                res => {
                    toast.success( res.data.message, {position: 'top-center'} )
                    //login
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
                },
                error => {toast.error( error.response.data.message, {position: 'bottom-center'} )}
            )

        }
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
                                <CardHeader className="text-center text-success"><FontAwesomeIcon
                                    icon={faPenAlt} size="3x" /><h3>New User Registration</h3></CardHeader>
                                <CardBody>
                                    <h5>Please register yourself to continue ➡️</h5>
                                    <Form onChange={handleChange} onSubmit={handleSubmit}>
                                        <FormGroup className="text-center">
                                            <FontAwesomeIcon className="mb-2 text-danger"
                                                icon={faUserAstronaut} size="4x" />
                                            <p>Hey Astronaut!</p>
                                            <Input type="text" name="name"
                                                id="name" placeholder="👨 Enter your name" autoComplete="off" value={user.name} required />
                                        </FormGroup>
                                        <FormGroup className="text-center">
                                            <Input type="email" name="email_id" value={user.email_id} id="email" placeholder="📧 Enter your email" required autoComplete="off" />
                                        </FormGroup>
                                        <FormGroup className="text-center">
                                            <Input type="password" name="password"
                                                id="password" placeholder="🔒 Enter your password" value={user.password} required />
                                        </FormGroup>
                                        <FormGroup className="text-center">
                                            <Input type="password" name="confPass"
                                                id="password" placeholder="🔏 Confirm your password" value={user.confPass} required />
                                        </FormGroup>
                                        <FormGroup className="text-center">
                                            <Input type="submit" value="Register ✅" className="btn btn-primary w-50" />
                                        </FormGroup>
                                        <FormGroup className="text-center">
                                            <p>Already a member?<Link to="/" className="text-decoration-none"> Login now!</Link></p>
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

export default Register
