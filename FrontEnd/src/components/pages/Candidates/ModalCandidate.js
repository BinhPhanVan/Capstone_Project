import React, { useState } from 'react';
import { Modal, Backdrop, Button, Typography, ListItemSecondaryAction, Link } from '@material-ui/core';
import PDFViewer from '../Jobs/PDFViewer';
import BiotechIcon from '@mui/icons-material/Biotech';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import MailIcon from '@mui/icons-material/Mail';
import PhoneIcon from '@mui/icons-material/Phone';
import ContactPageIcon from '@mui/icons-material/ContactPage';
import { selectUserInfo, send_email_with_job } from '../../../store/UserSlice';
import firebaseService from '../../../api-service/firebaseService';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { selectJobsOwner } from '../../../store/JobSlice';
import { toast } from 'react-toastify';

const ModalCandidate = ({ candidate, open, handleClose }) => {
  const user_info = useSelector(selectUserInfo);
  const [modalOpen, setModalOpenJob] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const dispatch = useDispatch();
  const handleCloseModalJob = (e) => {
      e.stopPropagation();
      setModalOpenJob(false);
  };
  const data = useSelector(selectJobsOwner);
  const jobs = [];
    data.forEach(job => {
        const { job_name, location, pdf_upload, recruiter, skills, active, id } = job;
        const { company_name, avatar_url, account } = recruiter;
        const { first_name, last_name, email } =  account;
        const shortenedJob = {
            id,
            active,
            name: `${first_name} ${last_name}`,
            email,
            location,
            skills,
            avatar_url,
            pdf_upload, company_name, job_name
        };
    jobs.push(shortenedJob);
    });
  const activeJobs = jobs.filter(job => job.active === true);
  const handleItemClick = (job) => {
      if(selectedItem?.id !== job?.id)
      {
          setSelectedItem(job);
      }
      else if(selectedItem !== null)
      {
          setSelectedItem(null);
      }
      else
      {
          setSelectedItem(job);
      }
  };
  const SendJob = async (job, candidate) =>
    {
        const data = 
        {
            'email': candidate.email,
            'job_name': job.job_name,
            'company_name': job.company_name,
            'pdf_upload': job.pdf_upload,
            'name_candidate': candidate.name,
            'name': job.name,
            'email_user': job.email
        }
        const actionResult = await dispatch(send_email_with_job(data));
        if (send_email_with_job.fulfilled.match(actionResult)) {
            toast.success(actionResult.payload["message"]);
        }
        if (send_email_with_job.rejected.match(actionResult)) {
            toast.error(actionResult.payload["message"]);
        }
  };
  const handleSelectItem = (e) => {
        e.stopPropagation();
        SendJob(selectedItem, candidate);
        setModalOpenJob(false);
        handleClose();
        const chatId = `${candidate.id}_${user_info.account.id}`;
        firebaseService.initializeConversation(
          candidate.id, 
          user_info.account.id, 
          candidate.name, 
          candidate.avatar_url,
          candidate.email, 
          user_info.account.first_name + " " + user_info.account.last_name, 
          user_info.avatar_url,
          user_info.account.email);
          navigate(`/chat/${candidate.id}_${user_info.account.id}`);
        firebaseService.sendMessage1(chatId, user_info, `Send invitation for ${selectedItem.job_name} position.`, 'message');
  }
const navigate = useNavigate();
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
                <Button className="btn-sent" variant="contained" color="primary" onClick={(e) => 
                {
                    e.stopPropagation();
                    setModalOpenJob(true);
                }}>
                Invite
                </Button>
                <Button className="btn-message" variant="contained" color="secondary" onClick={(e) => {
                    firebaseService.initializeConversation(
                        candidate.id, 
                        user_info.account.id, 
                        candidate.name, 
                        candidate.avatar_url,
                        candidate.email, 
                        user_info.account.first_name + " " + user_info.account.last_name, 
                        user_info.avatar_url,
                        user_info.account.email);
                    navigate(`/chat/${candidate.id}_${user_info.account.id}`);
                    e.stopPropagation();
                }}>
                Message
                </Button>
            </ListItemSecondaryAction>
          </div>
        </Modal>
        <div className='modal-container' onClick={(e) => {e.stopPropagation();}}>
            <Modal open={modalOpen} onClose={handleCloseModalJob} className='modal-list-job'>
            <div className="job_upload_item-content  job_upload_item_container ">
            <button className='close-button' onClick={handleCloseModalJob}>X</button>
            <Typography variant="h6">Select a job</Typography>
            {activeJobs.map((job) => (
                <div className={`job_upload_item-content ${selectedItem?.id === job.id ? 'job_upload_item_selected' : ''}`} 
                key={job.id} 
                onClick={(e) => 
                    {
                        e.stopPropagation();
                        handleItemClick(job);
                    }
                }>
                <Typography variant="subtitle1">
                    {job.job_name}
                </Typography>
                    <Typography variant="body1" className="company-loc-text">
                        <LocationOnIcon />
                        {job.location}
                    </Typography>
                </div>
            ))}
            <ListItemSecondaryAction className="modal-btn-container">
                <Button className="btn-cancel" variant="contained" color="default" onClick={handleCloseModalJob}>
                Cancel
                </Button>
                <Button className="btn-select" variant="contained" color="primary" disabled={selectedItem === null} onClick={handleSelectItem}>
                Select
                </Button>
            </ListItemSecondaryAction>
            </div>
            </Modal>
        </div>
      </div>
    </>
  );
};

export default ModalCandidate;
