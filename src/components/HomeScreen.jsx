import {faBook} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import React, {useEffect} from 'react'
import {Link} from 'react-router-dom/cjs/react-router-dom.min'
import {Container, Jumbotron} from 'reactstrap'
const HomeScreen = () => {
    useEffect( () => {
        document.title = "Home"
    }, [] )
    return (
        <div>
            <Jumbotron className="text-center">
                <FontAwesomeIcon icon={faBook} size="4x" className="text-danger mb-2" />
                <h1 className="text-success">KeepNote</h1>
                <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Maiores rem autem quod debitis adipisci, harum nihil in, aliquam iure quaerat, temporibus dolorum architecto eius? Eveniet inventore distinctio cumque possimus quod.
                </p>
                <Container>
                    <Link to="/add-note" className="btn btn-outline-primary">Start Using Now!</Link>
                </Container>
            </Jumbotron>
        </div>
    )
}

export default HomeScreen
