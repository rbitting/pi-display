import React from 'react';
import Header from './Header';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Main from './Main';
import Log from './Log';
import { Container } from 'react-bulma-components';
import SendMessageForm from './SendMessageForm';

const Dashboard = () => {
    return (
        <Router>
            <Header />
            <div className="pl-3 pr-3">
                <Container breakpoint="desktop">
                    <Routes>
                        <Route exact path='/' element={<Main />}/>
                        <Route exact path='/send-message' element={<SendMessageForm />}/>
                        <Route path='/*' element={<Log />}/>
                    </Routes>
                </Container>
            </div>
        </Router>
    );
};

export default Dashboard;
