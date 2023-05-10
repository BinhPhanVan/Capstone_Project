import React from 'react';
import { Modal, Backdrop, Button, Typography, ListItemSecondaryAction } from '@material-ui/core';
import PDFViewer from '../Jobs/PDFViewer';


const ModalCandidate = ({ candidate, open, handleClose }) => {

  return (
    <>
      <div className="modal-container">
        <Modal
          className="modal-candidate-container"
          open={open}
          onClose={handleClose}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
          <div className='modal-candidate-content buttons-container'>
            <button className='close-button' onClick={handleClose}>X</button>
            <Typography variant="h5">{candidate.name}</Typography>
            <Typography variant="body1" className='skill-text'>{`Skill: ${candidate.skill}`}</Typography>
            <Typography variant="body1" className='company-loc-text'>{`Location: ${candidate.location}`}</Typography>
              <PDFViewer 
                file="https://res.cloudinary.com/dq6avgw6n/image/upload/v1683190137/o7pran26mqn0pxak4zwx.pdf" />
            <ListItemSecondaryAction className="modal-btn-container">
                <Button className="btn-sent" variant="contained" color="primary" onClick={(e) => 
                {
                    console.log('Apply clicked')
                    e.stopPropagation();
                }}>
                Sent
                </Button>
                <Button className="btn-message" variant="contained" color="secondary" onClick={(e) => {
                    console.log('Message clicked')
                    e.stopPropagation();
                }}>
                Message
                </Button>
            </ListItemSecondaryAction>
          </div>
        </Modal>
      </div>
    </>
  );
};

export default ModalCandidate;
