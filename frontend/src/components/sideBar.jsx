import React from 'react';
import { Nav } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import '../styles/sideBar.css'; 

const Sidebar = () => {
  return (
    <div className="sidebar">
      <h2>Search Engine</h2>
      <Nav defaultActiveKey="/" className="flex-column">
        <LinkContainer to="/">
          <Nav.Link>Home</Nav.Link>
        </LinkContainer>
        <LinkContainer to="/target-websites">
          <Nav.Link>Target Websites</Nav.Link> 
        </LinkContainer>
        <LinkContainer to="/website-groups">
          <Nav.Link>Website Groups</Nav.Link>
        </LinkContainer>
        <LinkContainer to="/search-configuration">
          <Nav.Link>Search Configurations</Nav.Link>
        </LinkContainer>
        <LinkContainer to="/history">
          <Nav.Link>Search Results</Nav.Link>
        </LinkContainer>
        <LinkContainer to="/settings">
          <Nav.Link>Settings</Nav.Link>
        </LinkContainer>
        <LinkContainer to="/profile">
          <Nav.Link>Profile</Nav.Link>
        </LinkContainer>
        <LinkContainer to="/help">
          <Nav.Link>Help</Nav.Link>
        </LinkContainer>
      </Nav>
    </div>
  );
};

export default Sidebar;
