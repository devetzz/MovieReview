import React from 'react';
import { Modal, Button, Form, Container } from 'react-bootstrap';

const InfoModal = ({ show, onHide, title, content, callbackFn }) => {
  return (
    <Modal show={show} onHide={onHide} size="sm" aria-labelledby="contained-modal-title-vcenter" centered >
      <Container>
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="d-flex justify-content-center">
              <Form.Label>{content}</Form.Label>
            </Form.Group>
            <div className="d-flex justify-content-center">
              <Button block variant="info" type="button" className="my-3" onClick={callbackFn} >CLOSE</Button>
            </div>
          </Form>
        </Modal.Body>
      </Container>
    </Modal>
  );
};

export default InfoModal;