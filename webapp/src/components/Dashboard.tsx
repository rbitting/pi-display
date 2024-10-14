import React from 'react';
import { Container } from 'react-bulma-components';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Calendar from './Calendar';
import HomePage from './HomePage';
import Log from './Log';
import Nav from './Nav';

function Dashboard() {
  return (
    <Router>
      <Nav />
      <div className="pl-3 pr-3">
        <Container breakpoint="desktop">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/log" element={<Log />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/*" element={<Navigate to="/" />} />
          </Routes>
        </Container>
      </div>
      <footer className="mt-6 mb-6 pt-5 pb-5" />
    </Router>
  );
}

export default Dashboard;
