import React, { useState, useEffect } from 'react';
import { Button, Modal, Form, Dropdown, Table } from 'react-bootstrap';
import axios from 'axios';

const SearchConfigurationComponent = () => {
  const [searchConfigurations, setSearchConfigurations] = useState([]);
  const [websites, setWebsites] = useState([]);
  const [groups, setGroups] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showWebsiteModal, setShowWebsiteModal] = useState(false);
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [websiteSearchQuery, setWebsiteSearchQuery] = useState('');
  const [groupSearchQuery, setGroupSearchQuery] = useState('');

  const [newSearchConfiguration, setNewSearchConfiguration] = useState({
    searchTerm: '',
    websites: [],
    group: null,
    isScheduled: false,
    scheduleTime: '',
  });
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    const fetchWebsitesAndGroups = async () => {
      try {
        const [websitesRes, groupsRes] = await Promise.all([
          axios.get('/api/target-websites'),
          axios.get('/api/website-groups'),
        ]);
        setWebsites(websitesRes.data);
        setGroups(groupsRes.data);
      } catch (error) {
        console.error('Error fetching websites or groups:', error);
      }
    };

    const fetchSearchConfigurations = async () => {
      try {
        const response = await axios.get('/api/search-configurations');
        setSearchConfigurations(response.data);
      } catch (error) {
        console.error('Error fetching search configurations:', error);
      }
    };

    fetchWebsitesAndGroups();
    fetchSearchConfigurations();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewSearchConfiguration((prev) => ({ ...prev, [name]: value }));
  };

  const handleWebsiteSelect = (websiteId) => {
    setNewSearchConfiguration((prev) => {
      if (prev.websites.includes(websiteId)) {
        return { ...prev, websites: prev.websites.filter((id) => id !== websiteId) };
      }
      return { ...prev, websites: [...prev.websites, websiteId] };
    });
  };

  const handleGroupSelect = (groupId) => {
    setNewSearchConfiguration((prev) => ({
      ...prev,
      group: groupId,
    }));
  };

  const handleAddSearchConfiguration = async () => {
  try {
    // Gather the website URLs from the selected websites
    const selectedWebsiteUrls = websites
      .filter((website) => newSearchConfiguration.websites.includes(website._id))
      .map((website) => website.url);

    // Gather the website URLs from the selected group if applicable
    const groupWebsites = newSearchConfiguration.group
      ? groups.find((group) => group._id === newSearchConfiguration.group)?.websites || []
      : [];

    const groupWebsiteUrls = websites.filter((website) =>
      groupWebsites.includes(website._id)
    ).map((website) => website.url);

    // Combine the URLs from selected websites and selected group
    const websiteUrls = [...selectedWebsiteUrls, ...groupWebsiteUrls];

    const payload = {
      ...newSearchConfiguration,
      group: newSearchConfiguration.group || null,
      websiteUrls, // Use the defined websiteUrls variable here
    };

    if (editMode) {
      await axios.put(`/api/search-configurations/${newSearchConfiguration._id}`, payload);
    } else {
      await axios.post('/api/search-configurations', payload);
    }

    fetchSearchConfigurations(); // Fetch the updated list after add/edit

    setShowModal(false);
    setNewSearchConfiguration({
      searchTerm: '',
      websites: [],
      group: null,
      isScheduled: false,
      scheduleTime: '',
    });
    setEditMode(false);
  } catch (error) {
    console.error('Error adding/updating search configuration:', error);
  }
};


  const fetchSearchConfigurations = async () => {
    try {
      const response = await axios.get('/api/search-configurations');
      setSearchConfigurations(response.data);
    } catch (error) {
      console.error('Error fetching search configurations:', error);
    }
  };

  const handleEditClick = (config) => {
    setNewSearchConfiguration({
      _id: config._id,
      searchTerm: config.searchTerm,
      websites: config.websites.map((website) => website._id),
      group: config.group ? config.group._id : null,
      isScheduled: config.isScheduled,
      scheduleTime: config.scheduleTime,
    });
    setEditMode(true);
    setShowModal(true);
  };

  const handleDeleteClick = async (id) => {
    if (window.confirm('Are you sure you want to delete this configuration?')) {
      try {
        await axios.delete(`/api/search-configurations/${id}`);
        setSearchConfigurations((prev) => prev.filter((config) => config._id !== id));
      } catch (error) {
        console.error('Error deleting search configuration:', error);
      }
    }
  };

  const launchSearch = async (config) => {
    const { searchTerm, websiteUrls } = config; // Use websiteUrls directly from config
    const apiKey = 'AIzaSyBcZoTzdNgFSgU4Gu2gnlrrN7wy2QxhnGk'; // Google API key
    const searchEngineId = 'c0fc3bc788f9d4655'; // Custom Search Engine ID
    // Show alert on search launch
    alert('Search launched! Check search history for results.');
  
    const searchResults = []; // Array to store results for each website
  
    try {
      // Loop through each website URL and perform a search
      for (const website of websiteUrls) {
        const query = `${searchTerm} site:${website}`; // Restrict search to this website
  
        const response = await axios.get('https://www.googleapis.com/customsearch/v1', {
          params: {
            key: apiKey,
            cx: searchEngineId,
            q: query,
          },
        });
  
        if (response.data.items && response.data.items.length > 0) {
          const firstResultLink = response.data.items[0].link; // Get the first result link
          console.log(`Results for ${website}:`, firstResultLink);
          
          // Store the result in the array
          searchResults.push({
            websiteUrl: website,
            firstResultLink: firstResultLink,
          });
        } else {
          console.log(`No Results for ${website}`);
          searchResults.push({
            websiteUrl: website,
            firstResultLink: 'No article found',
          });
        }
      }
  
      // Send search results to the backend for storage
      await axios.post('/api/result', {
        launchDateTime: new Date(), // Current date and time
        searchTerm: searchTerm,
        target: { websites: websiteUrls }, // Assuming websiteUrls are ObjectIds
        results: searchResults,
      });
  
    } catch (error) {
      console.error('Error during search:', error);
    }
  };
  
  
  return (
    <div className="container">
      <div>
        <h1 className="title">Search Configurations</h1>
        <Button
          onClick={() => {
            setNewSearchConfiguration({
              searchTerm: '',
              websites: [],
              group: null,
              isScheduled: false,
              scheduleTime: '',
            });
            setEditMode(false);
            setShowModal(true);
          }}
        >
          Add New Search Configuration
        </Button>

        <Table striped bordered hover className="mt-4">
          <thead>
            <tr>
              <th>#</th>
              <th>Search Term</th>
              <th>Target</th>
              <th>Scheduled</th>
              <th>Schedule Time</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {searchConfigurations.map((config, index) => (
              <tr key={config._id}>
                <td>{index + 1}</td>
                <td>{config.searchTerm}</td>
                <td>
                  Websites: {config.websites.map((website) => website.url).join(', ')}<br />
                  Group: {config.group ? config.group.name : 'None'}
                </td>
                <td>{config.isScheduled ? 'Yes' : 'No'}</td>
                <td>{config.scheduleTime ? new Date(config.scheduleTime).toLocaleString() : 'N/A'}</td>
                <td>
                  <Button onClick={() => launchSearch(config)}>
                    Launch Search
                  </Button>{' '}
                  <Button variant="warning" onClick={() => handleEditClick(config)}>Edit</Button>{' '}
                  <Button variant="danger" onClick={() => handleDeleteClick(config._id)}>Delete</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        {/* Add/Edit Search Configuration Modal */}
        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>{editMode ? 'Edit Search Configuration' : 'Add Search Configuration'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="formSearchTerm">
                <Form.Label>Search keywords:</Form.Label>
                <Form.Control
                  type="text"
                  name="searchTerm"
                  value={newSearchConfiguration.searchTerm}
                  onChange={handleInputChange}
                  placeholder="Enter search term"
                />
              </Form.Group>

              <Form.Group controlId="formTargetWebsites" className="mt-3">
                <Form.Label>Target Websites:</Form.Label>
                <div>
                  <Button variant="primary" onClick={() => setShowWebsiteModal(true)}>
                    Add Websites
                  </Button>
                </div>
                <div className="mt-2">
                  <strong>Selected Websites:</strong>
                  <ul>
                    {newSearchConfiguration.websites.map((websiteId) => {
                      const website = websites.find((w) => w._id === websiteId);
                      return website ? <li key={websiteId}>{website.url}</li> : null;
                    })}
                  </ul>
                </div>
              </Form.Group>

              <Form.Group controlId="formTargetGroups" className="mt-3">
                <Form.Label>Target Group:</Form.Label>
                <div>
                  <Button variant="primary" onClick={() => setShowGroupModal(true)}>
                    Add Groups
                  </Button>
                </div>
                <div className="mt-2">
                  <strong>Selected Group:</strong>
                  {newSearchConfiguration.group
                    ? groups.find((g) => g._id === newSearchConfiguration.group)?.name
                    : 'None'}
                </div>
              </Form.Group>

              <Form.Group controlId="formIsScheduled" className="mt-3">
                <Form.Check
                  type="checkbox"
                  label="Is Scheduled"
                  checked={newSearchConfiguration.isScheduled}
                  onChange={(e) => setNewSearchConfiguration({ ...newSearchConfiguration, isScheduled: e.target.checked })}
                />
              </Form.Group>

              {newSearchConfiguration.isScheduled && (
                <Form.Group controlId="formScheduleTime" className="mt-3">
                  <Form.Label>Schedule Time:</Form.Label>
                  <Form.Control
                    type="datetime-local"
                    name="scheduleTime"
                    value={newSearchConfiguration.scheduleTime}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              )}

              <Button variant="primary" onClick={handleAddSearchConfiguration}>
                {editMode ? 'Update' : 'Add'}
              </Button>
            </Form>
          </Modal.Body>
        </Modal>

        {/* Add Websites Modal */}
        <Modal show={showWebsiteModal} onHide={() => setShowWebsiteModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Add Websites</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="websiteSearch">
                <Form.Label>Search Websites:</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter website URL or name"
                  value={websiteSearchQuery}
                  onChange={(e) => setWebsiteSearchQuery(e.target.value)}
                />
              </Form.Group>

              <div className="mt-3">
                {websites.filter(website => website.url.includes(websiteSearchQuery)).map((website) => (
                  <div key={website._id}>
                    <Form.Check
                      type="checkbox"
                      label={website.url}
                      checked={newSearchConfiguration.websites.includes(website._id)}
                      onChange={() => handleWebsiteSelect(website._id)}
                    />
                  </div>
                ))}
              </div>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowWebsiteModal(false)}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Add Groups Modal */}
        <Modal show={showGroupModal} onHide={() => setShowGroupModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Add Groups</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="groupSearch">
                <Form.Label>Search Groups:</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter group name"
                  value={groupSearchQuery}
                  onChange={(e) => setGroupSearchQuery(e.target.value)}
                />
              </Form.Group>

              <div className="mt-3">
                {groups.filter(group => group.name.includes(groupSearchQuery)).map((group) => (
                  <div key={group._id}>
                    <Form.Check
                      type="checkbox"
                      label={group.name}
                      checked={newSearchConfiguration.group === group._id}
                      onChange={() => handleGroupSelect(group._id)}
                    />
                  </div>
                ))}
              </div>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowGroupModal(false)}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
};

export default SearchConfigurationComponent;
