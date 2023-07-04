import React, { useEffect, useRef, useState } from 'react';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Box from '@mui/material/Box';
import SendIcon from '@mui/icons-material/Send';
import LinkIcon from '@mui/icons-material/Link';
import { Tooltip, Modal, ListItemSecondaryAction } from '@mui/material';
import firebaseService from '../../../api-service/firebaseService';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { selectUserInfo } from '../../../store/UserSlice';
import { selectIsAdmin } from '../../../store/AuthSlice';
import { Button, Typography } from '@material-ui/core';
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { get_all_jobs_owner, selectJobsOwner } from '../../../store/JobSlice';
function SendMessage() {
  const { chatId } = useParams();
  const [message, setMessage] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const user_info = useSelector(selectUserInfo);
  const isAdmin = useSelector(selectIsAdmin);
  const inputRef = useRef(null);
  const dispatch = useDispatch();
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
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      sendMessage();
    }
  };
  const handleSendResume = (e) => {
    e.preventDefault();
    setMessage("My resume: " + user_info.pdf_file);
  };

  const [modalOpen, setModalOpen] = useState(false);

  const handleSendJD = (e) => {
    e.preventDefault();
    setModalOpen(true);
  };

  const handleCloseModal = (e) => {
    setModalOpen(false);
  };
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
  const sendMessage = () => {
    if (message.trim() !== '') {
      firebaseService.sendMessage1(chatId, user_info, message, 'message');
      setMessage('');
    }
  };
  useEffect(()=> {
    if(isAdmin)
    {
      dispatch(get_all_jobs_owner());
    }
  }, [dispatch, isAdmin]);
  return (
    <TextField
        className='input-send-container'
        label="Type a message..."
        variant="outlined"
        value = {message}
        ref={inputRef}
        onChange={(e) => setMessage(e.target.value)}
        onKeyPress={handleKeyPress}
        fullWidth
        InputProps={{
        endAdornment: (
            <InputAdornment position="end">
                <Box display="flex" alignItems="center">
                    {isAdmin ? 
                    <Tooltip title="Job Description">
                        <LinkIcon className='link-icon icon' onClick={handleSendJD}/>
                    </Tooltip> :
                    <Tooltip title="Attach CV">
                        <LinkIcon className='link-icon icon' onClick={handleSendResume}/>
                    </Tooltip>}
                    <SendIcon className='send-icon icon' 
                    onClick={sendMessage}
                    />
                </Box>
                <div className='modal-container'>
                  <Modal open={modalOpen} onClose={handleCloseModal} className='modal-list-job'>
                    <div className="job_upload_item-content  job_upload_item_container ">
                    <button className='close-button' onClick={handleCloseModal}>X</button>
                    <Typography variant="h6">Select a job</Typography>
                    {activeJobs.map((job) => (
                      <div className={`job_upload_item-content ${selectedItem?.id === job.id ? 'job_upload_item_selected' : ''}`} 
                        key={job.id} 
                        onClick={() => handleItemClick(job)}>
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
                      <Button className="btn-cancel" variant="contained" color="default" onClick={(e) => 
                      {
                          e.stopPropagation();
                          handleCloseModal();
                      }}>
                      Cancel
                      </Button>
                      <Button className="btn-select" variant="contained" color="primary" disabled={selectedItem === null} onClick={(e) => {
                          e.stopPropagation();
                          setMessage(selectedItem?.job_name + ": " +selectedItem?.pdf_upload);
                          setSelectedItem(null);
                          inputRef.current.focus();
                          handleCloseModal();
                      }}>
                      Select
                      </Button>
                  </ListItemSecondaryAction>
                    </div>
                  </Modal>
                </div>
          </InputAdornment>
        ),
      }}
    />
  );
}

export default SendMessage;
