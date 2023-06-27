import React from 'react';
import { Modal, Backdrop, Button, Typography, ListItemSecondaryAction, Link } from '@material-ui/core';
import PDFViewer from './PDFViewer';
import BadgeIcon from '@mui/icons-material/Badge';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import BiotechIcon from '@mui/icons-material/Biotech';
import MailIcon from '@mui/icons-material/Mail';
import ContactPageIcon from '@mui/icons-material/ContactPage';
import { useDispatch, useSelector } from 'react-redux';
import { selectUserInfo, send_email_with_cv } from '../../../store/UserSlice';
import firebaseService from '../../../api-service/firebaseService';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const ModalJob = ({ job, open, handleClose }) => {
  const user_info = useSelector(selectUserInfo);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const SendCV = async (job, user_info) =>
    {
        console.log(job, user_info);
        const data = 
        {
            'email': job.email,
            'job_name': job.job_name,
            'company_name': job.company_name,
            'pdf_file': user_info.pdf_file,
            'name': user_info.account.first_name + " " + user_info.account.last_name,
            'email_user': user_info.account.email,
        }
        const actionResult = await dispatch(send_email_with_cv(data));
        if (send_email_with_cv.fulfilled.match(actionResult)) {
            toast.success(actionResult.payload["message"]);
        }
        if (send_email_with_cv.rejected.match(actionResult)) {
            toast.error(actionResult.payload["message"]);
        }
    };
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
                  handleClose();
                  SendCV(job, user_info);
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
                        user_info.account.email, 
                        job.name, 
                        job.avatar_url,
                        job.email);
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
