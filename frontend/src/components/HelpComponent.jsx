import React from 'react';
import { Container, Row, Col, Card, ListGroup } from 'react-bootstrap';

const HelpComponent = () => {
  return (
    <Container className="mt-4">
      <Row>
        <Col>
          <Card>
            <Card.Header as="h5">Help & Support</Card.Header>
            <Card.Body>
              <Card.Text>
                For assistance with any issues or questions, please contact us via email at&nbsp; 
                <a href="mailto:help@pressapp.com">help@pressapp.com</a>.
              </Card.Text>
              <Card.Text>
                Here are some additional resources to help you:
              </Card.Text>
              <ListGroup>
                <ListGroup.Item>
                  <strong>FAQs:</strong> Find answers to common questions and issues.
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Troubleshooting Guide:</strong> Step-by-step solutions for common problems.
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Contact Support:</strong> Reach out to our support team directly.
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>User Manual:</strong> Comprehensive guide to using our application.
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default HelpComponent;
