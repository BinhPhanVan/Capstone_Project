import React from 'react';
import { ListItem, ListItemSecondaryAction, Button, Typography } from '@material-ui/core';
import BadgeIcon from '@mui/icons-material/Badge';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import BiotechIcon from '@mui/icons-material/Biotech';
import MailIcon from '@mui/icons-material/Mail';
import { useSelector } from 'react-redux';
import { selectUserInfo } from '../../../store/UserSlice';
import firebaseService from '../../../api-service/firebaseService';
import { useNavigate } from 'react-router-dom';


const JobItem = ({ job, onJobClick }) => {
    const user_info = useSelector(selectUserInfo);
    const navigate = useNavigate();
    return (
    <div className='jobitem-container' onClick= {(e) => 
        {
            e.preventDefault();
            onJobClick(job);
            console.log(job.name);
        }}>
        <ListItem key={job.id} >
            <div className='jobitem-content'>
                <Typography variant="h6">{job.job_name}</Typography>
                <Typography variant="body1" className='company-loc-text'><BadgeIcon/>{`: ${job.company_name} | `}<LocationOnIcon/>{`: ${job.location}`}</Typography>
                <Typography variant="body1" className='email-text'><MailIcon/>{`: ${job.email}`}</Typography>
                <Typography variant="body1" className='skill-text'><BiotechIcon/>{`: ${job.skills}`}</Typography>
            </div>
            <ListItemSecondaryAction className="btn-container">
                <Button className="btn-apply" variant="contained" color="primary" onClick={(e) => 
                {
                    console.log('Apply clicked')
                    e.stopPropagation();
                }}>
                Apply
                </Button>
                <Button className="btn-message" variant="contained" color="secondary" onClick={(e) => {
                    e.stopPropagation();
                    
                    // console.log(user_info.account.id);
                    // console.log(job.id);
                    firebaseService.initializeConversation(user_info.account.id, job.id);
                    navigate(`/chat/${user_info.account.id}_${job.id}`);

                    // firebaseService.getMessagesForUser(user_info.account.id);
                    // firebaseService.sendMessage1(user_info.account.id, job.id, "ksfsjfkfjskfjskfjsfksfksfsf");
                    // console.log(firebaseService.getConversationId(user_info.account.id, job.id));
                    // console.log(firebaseService.getAllMessage(user_info.account.id, job.id));
                    // firebaseService.getAllMessage(user_info.account.id, job.id).then((messages) => {
                    //     // Handle the messages
                    //     console.log(messages);
                    // })
                    // .catch((error) => {
                    //     console.error('Error getting messages:', error);
                    // });
                }}>
                Message
                </Button>
            </ListItemSecondaryAction>
        </ListItem>
    </div>
  );
}

export default JobItem;
