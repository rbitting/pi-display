import React, { useState } from 'react';
import { Navbar, Container } from 'react-bulma-components';
import {
    Link
} from 'react-router-dom';

function Header() {
    const [isMobileMenuActive, setIsMobileMenuActive] = useState(false);

    function toggleMenu() {
        console.log('toggle');
        setIsMobileMenuActive(!isMobileMenuActive);
    }
    return (<Navbar color='black' className='mb-6'>
        <Container breakpoint='desktop'>
            <Navbar.Brand>
                <Link className='navbar-item has-text-primary' to='/'>Control Center</Link>
                <Navbar.Burger onClick={toggleMenu} />
            </Navbar.Brand>
            <Navbar.Menu className={isMobileMenuActive ? 'show' : ''}>
                <Navbar.Container>
                    <Link className='navbar-item has-text-link' to='/log'>Log</Link>
                    <Link className='navbar-item has-text-link' to='/send-message'>Send Message</Link>
                </Navbar.Container>
            </Navbar.Menu>
        </Container>
    </Navbar>
    );
}

export default Header;
