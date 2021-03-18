import React, {useEffect, useState} from 'react'
import notebook from '../images/notebook.svg'
import {Link, useHistory, useLocation} from 'react-router-dom'
import {Button} from 'reactstrap'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faUser} from '@fortawesome/free-solid-svg-icons'
import Cookies from 'js-cookie'
function Header( props ) {
    const loc = useLocation().pathname
    var history = useHistory()
    const [btn, setBtn] = useState( 0 )

    useEffect( () => {
        ( loc === '/register' ) ? setBtn( 1 ) : ( loc === '/home' ) ? setBtn( 2 ) : setBtn( 0 )
        // eslint-disable-next-line
    }, [] )
    const logout = () => {
        Cookies.remove( "token" )
        history.push( "/" )
    }
    return (
        <div className="navbar bg-mine fixed-top">
            <img src={notebook} alt="logo" height="50px" width="50px" />
            <Link className="navbar-brand text-light" to="/"><h3>KeepNote</h3></Link>
            {btn === 0 ? <Link className="text-light ml-auto" to="/register">
                <Button className="btn-round">Register</Button></Link> : ( btn === 1 ) ?
                <Link className="ml-auto text-light" to="/"><Button className="btn-round">Login</Button></Link> : <div className="ml-auto text-light">
                    <FontAwesomeIcon icon={faUser} size="lg" className="mr-1" /> Hi, {props.name} [
                    {props.email}] <Button className="btn-round ml-auto text-light" onClick={logout}>Logout</Button></div>}
        </div>
    )
}

export default Header
