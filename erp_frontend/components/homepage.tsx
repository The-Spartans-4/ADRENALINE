import React, {Component} from 'react'
import {Link} from "react-router-dom"
import ReactDOM from 'react-dom'
import { Button } from 'evergreen-ui'
import Navbar from './navbar'


class HomePage extends Component {
    render(){
        return (
            <div>
                <Link to={'/adminview'}>
                <Button>Click this button to be taken to the AdminPage</Button>
                </Link>
            </div>
        );
    }
}

export default HomePage;
