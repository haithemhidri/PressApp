import React, { useState, useEffect } from 'react';
import { Button, Modal, Form, Table } from 'react-bootstrap';
import axios from 'axios';

const WebsiteGroupComponent = () => {
    const [showGroupModal, setShowGroupModal] = useState(false);
    const [groupName, setGroupName] = useState('');
    const [description, setDescription] = useState('');
    const [selectedWebsites, setSelectedWebsites] = useState([]);
    const [allWebsites, setAllWebsites] = useState([]);
    const [groups, setGroups] = useState([]);
    const [editGroupId, setEditGroupId] = useState(null);
    const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
    const [groupToDelete, setGroupToDelete] = useState(null);
    const [groupSearchQuery, setGroupSearchQuery] = useState('');
    const [showAddWebsitesModal, setShowAddWebsitesModal] = useState(false); 
    const [websiteSearchQuery, setWebsiteSearchQuery] = useState('');


    // Fetch all website groups with populated websites
    const fetchGroups = async () => {
        try {
            const { data } = await axios.get('/api/website-groups');
            console.log('Fetched groups:', data); // Debugging: Check the fetched data
            setGroups(data); // Populate groups with their websites
        } catch (error) {
            console.error('Error fetching groups:', error);
        }
    };

    useEffect(() => {
        fetchGroups();
    }, []);

    // Fetch all websites for selection
    useEffect(() => {
        const fetchWebsites = async () => {
            try {
                const { data } = await axios.get('/api/target-websites');
                setAllWebsites(data);
            } catch (error) {
                console.error('Error fetching websites:', error);
            }
        };
        fetchWebsites();
    }, []);

    const handleAddGroup = async () => {
        const newGroup = {
            name: groupName,
            description: description,
            websites: selectedWebsites,
        };
        try {
            if (editGroupId) {
                await axios.put(`/api/website-groups/${editGroupId}`, newGroup);
            } else {
                await axios.post('/api/website-groups', newGroup);
            }
            setShowGroupModal(false);
            setEditGroupId(null);
            setGroupName('');
            setDescription('');
            setSelectedWebsites([]);
            fetchGroups(); // Fetch updated groups after adding/updating
        } catch (error) {
            console.error('Error adding/updating group:', error);
        }
    };

    const handleEditGroup = (group) => {
        setEditGroupId(group._id);
        setGroupName(group.name);
        setDescription(group.description);
        setSelectedWebsites(group.websites.map((site) => site._id)); // Map website IDs
        setShowGroupModal(true);
    };

    const handleDeleteGroup = async () => {
        try {
            await axios.delete(`/api/website-groups/${groupToDelete}`);
            setGroups(groups.filter((group) => group._id !== groupToDelete));
            setShowDeleteConfirmModal(false);
        } catch (error) {
            console.error('Error deleting group:', error);
        }
    };

    const handleWebsiteSelection = (websiteId) => {
        if (selectedWebsites.includes(websiteId)) {
            setSelectedWebsites(selectedWebsites.filter((id) => id !== websiteId));
        } else {
            setSelectedWebsites([...selectedWebsites, websiteId]);
        }
    };

    const handleAddWebsites = () => {
        setShowAddWebsitesModal(true); // Show the Add Websites modal
    };

    const handleCloseAddWebsitesModal = () => {
        setShowAddWebsitesModal(false); // Close the Add Websites modal
    };

    return (
        <div className="container">
            <h1 className="title">Website Groups</h1>
            <Button onClick={() => setShowGroupModal(true)}>Add New Group</Button>

            <Form.Control
                type="text"
                placeholder="Search groups..."
                value={groupSearchQuery}
                onChange={(e) => setGroupSearchQuery(e.target.value)}
                className="mt-3"
            />

            <Table striped bordered hover className="mt-4">
                <thead>
                    <tr>
                        <th>Group Name</th>
                        <th>Description</th>
                        <th>Websites</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {groups
                        .filter((group) =>
                            group.name.toLowerCase().includes(groupSearchQuery.toLowerCase())
                        )
                        .map((group) => (
                            <tr key={group._id}>
                                <td>{group.name}</td>
                                <td>{group.description}</td>
                                <td>
                                    {group.websites && group.websites.length > 0 ? (
                                        group.websites.map((website, index) => {
                                            console.log('Website:', website); // Check the website object structure
                                            return (
                                                <div key={index}>
                                                    {website.url ? website.url : 'No URL'}
                                                </div>
                                            );
                                        })
                                    ) : (
                                        'No websites'
                                    )}
                                </td>
                                <td>
                                    <Button
                                        variant="warning"
                                        style={{ marginRight: '10px' }}
                                        onClick={() => handleEditGroup(group)}
                                    >
                                        Edit 
                                    </Button>
                                    <Button
                                        variant="danger"
                                        onClick={() => {
                                            setGroupToDelete(group._id);
                                            setShowDeleteConfirmModal(true);
                                        }}
                                    >
                                        Delete
                                    </Button>
                                </td>
                            </tr>
                        ))}
                </tbody>
            </Table>

            {/* Add/Edit Group Modal */}
            <Modal show={showGroupModal} onHide={() => setShowGroupModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>{editGroupId ? 'Edit Group' : 'Add New Group'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="formGroupName">
                            <Form.Label>Group Name</Form.Label>
                            <Form.Control
                                type="text"
                                value={groupName}
                                onChange={(e) => setGroupName(e.target.value)}
                                placeholder="Enter group name"
                            />
                        </Form.Group>

                        <Form.Group controlId="formGroupDescription" className="mt-3">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Enter group description"
                            />
                        </Form.Group>

                        <Form.Group controlId="formGroupWebsites" className="mt-3">
                            <Form.Label>Selected Websites</Form.Label>
                            <div>
                                {selectedWebsites.length > 0
                                    ? selectedWebsites.map((id) => {
                                          const website = allWebsites.find((site) => site._id === id);
                                          return website ? <div key={id}>{website.url}</div> : null;
                                      })
                                    : 'No websites selected'}
                            </div>
                            <Button onClick={handleAddWebsites} className="mt-2">
                                Add Websites
                            </Button>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowGroupModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleAddGroup}>
                        {editGroupId ? 'Update Group' : 'Add Group'}
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Add Websites Modal */}
            <Modal show={showAddWebsitesModal} onHide={handleCloseAddWebsitesModal}>
              <Modal.Header closeButton>
                  <Modal.Title>Select Websites</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                  <Form.Control
                      type="text"
                      placeholder="Search websites..."
                      onChange={(e) => setWebsiteSearchQuery(e.target.value)}
                      className="mb-3"
                  />
                  <Form>
                      {allWebsites
                          .filter((website) =>
                              website.url.toLowerCase().includes(websiteSearchQuery.toLowerCase())
                          )
                          .map((website) => (
                              <Form.Check
                                  key={website._id}
                                  type="checkbox"
                                  label={website.url}
                                  checked={selectedWebsites.includes(website._id)}
                                  onChange={() => handleWebsiteSelection(website._id)}
                              />
                          ))}
                  </Form>
              </Modal.Body>
              <Modal.Footer>
                  <Button variant="secondary" onClick={handleCloseAddWebsitesModal}>
                      Close
                  </Button>
              </Modal.Footer>
          </Modal>

            {/* Delete Confirm Modal */}
            <Modal
                show={showDeleteConfirmModal}
                onHide={() => setShowDeleteConfirmModal(false)}
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Delete</Modal.Title>
                </Modal.Header>
                <Modal.Body>Are you sure you want to delete this group?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDeleteConfirmModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={handleDeleteGroup}>
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default WebsiteGroupComponent;
