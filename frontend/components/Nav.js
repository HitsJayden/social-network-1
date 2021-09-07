import React, { Component } from 'react';
import Link from 'next/link';
import cookie from 'react-cookies';

import Logout from '../components/Logout';
import { FaCogs } from 'react-icons/fa';
import Notifications from '../components/Notifications';
import NavDiv from './styles/NavStyle';

class Nav extends Component {
    render() {
        return(
            <NavDiv>

            {cookie.load('authCookie') && <Link href="/"><button>Home</button></Link>}
            {cookie.load('authCookie') && <Link href="/auth/my-profile"><button>Profile</button></Link>}
            {!cookie.load('authCookie') && <Link href="/auth/login"><button>Login</button></Link>}
            {!cookie.load('authCookie') && <Link href="/auth/signup"><button>Signup</button></Link>}
            {cookie.load('authCookie') &&  <Link href="/auth/settings"><button><FaCogs /></button></Link>}
            {cookie.load('authCookie') && <Notifications />}
            {cookie.load('authCookie') && <Logout />}

            </NavDiv>
        )
    }
};

export default Nav;