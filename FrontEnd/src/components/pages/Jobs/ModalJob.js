import React from 'react';
import { Modal, Backdrop, Button, Typography, ListItemSecondaryAction, Link } from '@material-ui/core';
import PDFViewer from './PDFViewer';
import BadgeIcon from '@mui/icons-material/Badge';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import BiotechIcon from '@mui/icons-material/Biotech';
import MailIcon from '@mui/icons-material/Mail';
import ContactPageIcon from '@mui/icons-material/ContactPage';
import { useSelector } from 'react-redux';
import { selectUserInfo } from '../../../store/UserSlice';
import firebaseService from '../../../api-service/firebaseService';
import { useNavigate } from 'react-router-dom';

const ModalJob = ({ job, open, handleClose }) => {
  const user_info = useSelector(selectUserInfo);
  const navigate = useNavigate();
  return (
    <>
      <div className="modal-container">
        <Modal
          className="modal-job-container"
          open={open}
          onClose={handleClose}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
          <div className='modal-job-content buttons-container'>
            <button className='close-button' onClick={handleClose}>X</button>
            <Typography variant="h5">{job.job_name}</Typography>
            <Typography variant="body1" className='company-text'><BadgeIcon/>{`: ${job.company_name}`}</Typography>
            <Typography variant="body1" className='company-loc-text'><MailIcon/>{`: ${job.email} | `} <LocationOnIcon/>{`: ${job.location}`}</Typography>  
            <Typography variant="body1" className='skill-text'><BiotechIcon/>{`: ${job.skills}`}</Typography>
            <Typography variant="body1" className='jd-text'><ContactPageIcon/>{`: `}
            <Link href={job.pdf_upload} target="_blank" rel="noopener">
              Open job description
            </Link>
            </Typography>
            <PDFViewer 
                file={job.pdf_upload} />
            <ListItemSecondaryAction className="modal-btn-container">
                <Button className="btn-apply" variant="contained" color="primary" onClick={(e) => 
                {
                    console.log('Apply clicked')
                    e.stopPropagation();
                }}>
                Apply
                </Button>
                <Button className="btn-message" variant="contained" color="secondary" onClick={(e) => {
                    firebaseService.initializeConversation(
                        user_info.account.id, 
                        job.id, 
                        user_info.account.first_name + " " + user_info.account.last_name, 
                        user_info.avatar_url, 
                        job.name, 
                        job.avatar_url);
                    navigate(`/chat/${user_info.account.id}_${job.id}`);
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

export default ModalJob;
