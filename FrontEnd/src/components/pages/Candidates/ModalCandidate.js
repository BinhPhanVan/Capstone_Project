import React from 'react';
import { Modal, Backdrop, Button, Typography, ListItemSecondaryAction, Link } from '@material-ui/core';
import PDFViewer from '../Jobs/PDFViewer';
import BiotechIcon from '@mui/icons-material/Biotech';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import MailIcon from '@mui/icons-material/Mail';
import PhoneIcon from '@mui/icons-material/Phone';
import ContactPageIcon from '@mui/icons-material/ContactPage';

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
            <Typography variant="body1" className='email-text'><MailIcon/>{`: ${candidate.email}`}</Typography>
            <Typography variant="body1" className='company-loc-text'><LocationOnIcon/>{`: ${candidate.location} | `}<PhoneIcon/>{`: +${candidate.phone_number}`}</Typography>
            <Typography variant="body1" className='skill-text'><BiotechIcon/>{`: ${candidate.skills}`}</Typography>
            <Typography variant="body1" className='resume-text'><ContactPageIcon/>{`: `}
            <Link href={candidate.pdf_file} target="_blank" rel="noopener">
              Open resume
            </Link>
            </Typography>
            <PDFViewer 
                file={candidate.pdf_file} />
            <ListItemSecondaryAction className="modal-btn-container">
                <Button className="btn-down" variant="contained" color="primary" onClick={(e) => 
                {
                    console.log('Down clicked')
                    e.stopPropagation();
                }}>
                Download
                </Button>
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
