import React from 'react';
import { Container } from 'react-bulma-components';
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Calendar from './Calendar';
import HomePage from './HomePage';
import Log from './Log';
import Nav from './Nav';

/**
 * A component for displaying the main dashboard of display controls
 * @returns The dashboard element
 */
function Dashboard(): JSX.Element {
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
