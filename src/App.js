import './App.css'
import {BrowserRouter as Router, Redirect, Route, Switch} from 'react-router-dom'
import {ToastContainer} from 'react-toastify'
import Login from './components/Login'
import Register from './components/Register'
import Home from './components/Home'
import Footer from './components/Footer'
import ErrorPage from './components/ErrorPage'
import AddNote from './components/AddNote'
import Cookies from 'js-cookie'
import HomeScreen from './components/HomeScreen'
import AllNotes from './components/AllNotes'
function App() {
  return (
    <div className="App">
      <Router>
        <ToastContainer />
        <Switch>
          <Route exact path="/" component={Login} />
          <Route exact path="/register" render={() => ( Cookies.get( "token" ) != null ? <Redirect to="/home" /> : <Register /> )} />
          <Route exact path="/home" render={() => ( <Home comp={<HomeScreen />} /> )} />
          <Route path="/add-note" render={() => ( Cookies.get( "token" ) != null ? <Home comp={<AddNote />} /> : <Redirect to="/" /> )} />
          <Route path="/view-notes" render={() => ( Cookies.get( "token" ) != null ? <Home comp={<AllNotes />} /> : <Redirect to="/" /> )} />
          {/* <Route path='/update-note' */}
          {/* render={() => ( Cookies.get( "token" ) != null ? <Home /> : <Redirect to="/" /> )} /> */}
          <Route path="/update-note" component={Home} />
          <Route component={ErrorPage} />
        </Switch>
        <Footer />
      </Router>

    </div>
  )
}

export default App
