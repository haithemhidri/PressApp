import React, { useState, useEffect } from 'react';
import { Button, Modal, Form, Table } from 'react-bootstrap';
import axios from 'axios';
import '../styles/styles.css';

const SearchResultComponent = () => {
  const [results, setResults] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);
  const [showResultsModal, setShowResultsModal] = useState(false);
  const [selectedResult, setSelectedResult] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const { data } = await axios.get('/api/search-result');
        const sortedData = data.sort((a, b) => new Date(b.launchDateTime) - new Date(a.launchDateTime));
        setResults(sortedData);
        setFilteredResults(sortedData);
      } catch (error) {
        console.error('Error fetching search results:', error);
      }
    };

    fetchResults();
  }, []);

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    const filtered = results.filter((result) =>
      result.searchTerm.toLowerCase().includes(query) ||
      result.target.websites.some((website) => website.url.toLowerCase().includes(query)) ||
      result.target.groups.some((group) => group.name.toLowerCase().includes(query))
    );
    setFilteredResults(filtered);
  };

  const handleShowResults = (result) => {
    setSelectedResult(result);
    setShowResultsModal(true);
  };

  return (
    <div className="container">
      <h1 className="title">Search Results</h1>
      <Form.Control
        type="text"
        placeholder="Search..."
        value={searchQuery}
        onChange={handleSearch}
        className="mt-3"
      />

      <Table striped bordered hover className="mt-4">
        <thead>
          <tr>
            <th>Date</th>
            <th>Search Term</th>
            <th>Target</th>
            <th>Results</th>
          </tr>
        </thead>
        <tbody>
          {filteredResults.map((result) => (
            <tr key={result._id}>
              <td>{new Date(result.launchDateTime).toLocaleString()}</td>
              <td>{result.searchTerm}</td>
              <td>
                Websites: {result.target.websites.map((website) => website.url).join(', ')}<br />
                Group: {result.target.groups.length > 0 ? result.target.groups.map(group => group.name).join(', ') : 'None'}
              </td>
              <td>
                <Button variant="primary" onClick={() => handleShowResults(result)}>
                  View Results
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Results Modal */}
      <Modal 
        show={showResultsModal} 
        onHide={() => setShowResultsModal(false)} 
        size="xl"  
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Search Results</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedResult && (
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Website</th>
                  <th>Link</th>
                </tr>
              </thead>
              <tbody>
                {selectedResult.results.map((result, index) => (
                  <tr key={index}>
                  <td>{result.websiteUrl}</td>
                  <td className="wide-link">
                    {result.firstResultLink === 'No article found' ? (
                      'No article found'  // Display as plain text if no article
                    ) : (
                      <a href={result.firstResultLink} target="_blank" rel="noopener noreferrer">
                        {result.firstResultLink}
                      </a>
                    )}
                  </td>
                </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowResultsModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default SearchResultComponent;
