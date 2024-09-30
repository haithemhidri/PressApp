import React, { useState, useEffect } from 'react';
import { Button, Modal, Form, Table, Dropdown } from 'react-bootstrap';
import axios from 'axios';
import '../styles/styles.css'

const TargetWebsitesComponent = () => {
  const [websites, setWebsites] = useState([]);
  const [filteredWebsites, setFilteredWebsites] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [newWebsite, setNewWebsite] = useState({
    url: '',
    owner: '',
    country: '',
    language: [],
    category: '',
  });
  const [deleteId, setDeleteId] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const languages = ['Arabic', 'English', 'French', 'German', 'Spanish', 'Italian', 'Other'];
  const countries = [
    "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina", "Armenia",
    "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium",
    "Belize", "Benin", "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria",
    "Burkina Faso", "Burundi", "Cabo Verde", "Cambodia", "Cameroon", "Canada", "Central African Republic", "Chad",
    "Chile", "China", "Colombia", "Comoros", "Congo", "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czech Republic",
    "Denmark", "Djibouti", "Dominica", "Dominican Republic", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea",
    "Eritrea", "Estonia", "Eswatini", "Ethiopia", "Fiji", "Finland", "France", "Gabon", "Gambia", "Georgia", "Germany",
    "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana", "Haiti", "Honduras", "Hungary",
    "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy", "Jamaica", "Japan", "Jordan",
    "Kazakhstan", "Kenya", "Kiribati", "Korea (North)", "Korea (South)", "Kosovo", "Kuwait", "Kyrgyzstan", "Laos",
    "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Madagascar",
    "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico",
    "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar", "Namibia",
    "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Macedonia", "Norway",
    "Oman", "Pakistan", "Palau", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland",
    "Portugal", "Qatar", "Romania", "Russia", "Rwanda", "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines",
    "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone",
    "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Sudan", "Spain", "Sri Lanka",
    "Sudan", "Suriname", "Sweden", "Switzerland", "Syria", "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Timor-Leste",
    "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Tuvalu", "Uganda", "Ukraine",
    "United Arab Emirates", "United Kingdom", "United States", "Uruguay", "Uzbekistan", "Vanuatu", "Vatican City",
    "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe"
  ];

  useEffect(() => {
    const fetchWebsites = async () => {
      try {
        const { data } = await axios.get('/api/target-websites');
        setWebsites(data);
        setFilteredWebsites(data);
      } catch (error) {
        console.error('Error fetching websites:', error);
      }
    };

    fetchWebsites();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewWebsite((prev) => ({ ...prev, [name]: value }));
  };

  const handleLanguageChange = (language) => {
    setNewWebsite((prev) => {
      if (prev.language.includes(language)) {
        return { ...prev, language: prev.language.filter((lang) => lang !== language) };
      } else {
        return { ...prev, language: [...prev.language, language] };
      }
    });
  };

  const handleAddWebsite = async () => {
    try {
      let response;
      if (editMode) {
        // Update existing website
        response = await axios.put(`/api/target-websites/${newWebsite._id}`, newWebsite);
        setWebsites((prev) => {
          const updatedWebsites = prev.map((website) =>
            website._id === newWebsite._id ? response.data : website
          );
          return updatedWebsites;
        });
        setFilteredWebsites((prev) => {
          const updatedWebsites = prev.map((website) =>
            website._id === newWebsite._id ? response.data : website
          );
          return updatedWebsites;
        });
      } else {
        // Add new website
        response = await axios.post('/api/target-websites', newWebsite);
        const updatedWebsites = [...websites, response.data];
        setWebsites(updatedWebsites);
        setFilteredWebsites(updatedWebsites);
      }
  
      setShowModal(false);
      setNewWebsite({ url: '', owner: '', country: '', language: [], category: '' });
      setEditMode(false);
    } catch (error) {
      console.error('Error adding/updating website:', error);
    }
  };
  
  

  const handleDelete = async () => {
    try {
      await axios.delete(`/api/target-websites/${deleteId}`);
      const updatedWebsites = websites.filter((website) => website._id !== deleteId);
      setWebsites(updatedWebsites);
      setFilteredWebsites(updatedWebsites);
      setShowConfirmDelete(false);
      setDeleteId(null);
    } catch (error) {
      console.error('Error deleting website:', error.response ? error.response.data : error.message);
    }
  };

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    const filtered = websites.filter((website) =>
      website.url.toLowerCase().includes(query) ||
      website.owner.toLowerCase().includes(query) ||
      website.country.toLowerCase().includes(query) ||
      website.language.join(', ').toLowerCase().includes(query) ||
      website.category.toLowerCase().includes(query)
    );
    setFilteredWebsites(filtered);
  };

  const handleEditClick = (website) => {
    setNewWebsite(website);
    setEditMode(true);
    setShowModal(true);
  };

  return (
    <div className="container">
      <div>
        <h1 className="title">Target Websites</h1>
        <Button onClick={() => {
          setNewWebsite({ url: '', owner: '', country: '', language: [], category: '' });
          setEditMode(false);
          setShowModal(true);
        }}>
          Add New Website
        </Button>

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
              <th>#</th>
              <th>Website URL</th>
              <th>Owner</th>
              <th>Country</th>
              <th>Languages</th>
              <th>Category</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredWebsites.map((website, index) => (
              <tr key={website._id}>
                <td>{index + 1}</td>
                <td>{website.url}</td>
                <td>{website.owner}</td>
                <td>{website.country}</td>
                <td>{website.language.join(', ')}</td>
                <td>{website.category}</td>
                <td>
                  <Button
                    variant="warning"
                    onClick={() => handleEditClick(website)}
                  >
                    Edit
                  </Button>{' '}
                  <Button
                    variant="danger"
                    onClick={() => {
                      setDeleteId(website._id);
                      setShowConfirmDelete(true);
                    }}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        {/* Add/Edit Website Modal */}
        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>{editMode ? 'Edit Website' : 'Add Website'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="formWebsiteUrl">
                <Form.Label>Website URL</Form.Label>
                <Form.Control
                  type="text"
                  name="url"
                  value={newWebsite.url}
                  onChange={handleInputChange}
                  placeholder="Enter website URL"
                />
              </Form.Group>

              <Form.Group controlId="formWebsiteOwner" className="mt-3">
                <Form.Label>Owner</Form.Label>
                <Form.Control
                  type="text"
                  name="owner"
                  value={newWebsite.owner}
                  onChange={handleInputChange}
                  placeholder="Enter website owner"
                />
              </Form.Group>

              <Form.Group controlId="formWebsiteCountry" className="mt-3">
                <Form.Label>Country</Form.Label>
                <Form.Control
                  as="select"
                  name="country"
                  value={newWebsite.country}
                  onChange={handleInputChange}
                >
                  <option value="">Select country</option>
                  {countries.map((country, index) => (
                    <option key={index} value={country}>
                      {country}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>

              <Form.Group controlId="formWebsiteCategory" className="mt-3">
                <Form.Label>Category</Form.Label>
                <Form.Control
                  as="select"
                  name="category"
                  value={newWebsite.category}
                  onChange={handleInputChange}
                >
                  <option value="">Select Category</option>
                  <option value="Press">Press</option>
                  <option value="Media">Media</option>
                  <option value="Government">Government</option>
                  <option value="Other">Other</option>
                </Form.Control>
              </Form.Group>

              <Form.Group controlId="formWebsiteLanguage" className="mt-3">
                <Form.Label>Language</Form.Label>
                <Dropdown>
                  <Dropdown.Toggle variant="light">
                    {newWebsite.language.length > 0
                      ? newWebsite.language.join(', ')
                      : 'Select Languages'}
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    {languages.map((language, index) => (
                      <Form.Check
                        key={index}
                        type="checkbox"
                        label={language}
                        value={language}
                        checked={newWebsite.language.includes(language)}
                        onChange={() => handleLanguageChange(language)}
                      />
                    ))}
                  </Dropdown.Menu>
                </Dropdown>
              </Form.Group>

            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Close
            </Button>
            <Button variant="primary" onClick={handleAddWebsite}>
              {editMode ? 'Update Website' : 'Add Website'}
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Confirm Delete Modal */}
        <Modal show={showConfirmDelete} onHide={() => setShowConfirmDelete(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Confirm Delete</Modal.Title>
          </Modal.Header>
          <Modal.Body>Are you sure you want to delete this website?</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowConfirmDelete(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDelete}>
              Delete
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
};

export default TargetWebsitesComponent;