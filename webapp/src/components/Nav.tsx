import React, { useState } from 'react';
import { Container, Navbar } from 'react-bulma-components';
import { Link } from 'react-router-dom';

function Nav() {
    const [isMobileMenuActive, setIsMobileMenuActive] = useState(false);

    function toggleMenu() {
        setIsMobileMenuActive(!isMobileMenuActive);
    }
    return (
        <Navbar color="black" className="mb-6">
            <Container breakpoint="desktop">
                <Navbar.Brand>
                    <Link className="navbar-item has-text-primary is-size-4" to="/">
                        Pi Display
                    </Link>
                    <Navbar.Burger onClick={() => toggleMenu()} />
                </Navbar.Brand>
                <Navbar.Menu className={isMobileMenuActive ? 'show' : ''}>
                    <Navbar.Container>
                        <Link className="navbar-item has-text-link pl-5 pr-5" to="/log">
                            Log
                        </Link>
                        <Link className="navbar-item has-text-link pl-5 pr-5" to="/calendar">
                            Calendar
                        </Link>
                    </Navbar.Container>
                </Navbar.Menu>
            </Container>
        </Navbar>
    );
}

export default Nav;
