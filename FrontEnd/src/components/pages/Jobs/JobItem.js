import React from 'react';
import { ListItem, ListItemSecondaryAction, Button, Typography } from '@material-ui/core';
import BadgeIcon from '@mui/icons-material/Badge';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import BiotechIcon from '@mui/icons-material/Biotech';
import MailIcon from '@mui/icons-material/Mail';
import { useDispatch, useSelector } from 'react-redux';
import { selectIsLoading, selectUserInfo, send_email_with_cv } from '../../../store/UserSlice';
import firebaseService from '../../../api-service/firebaseService';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import SpinnerLoading from '../../commons/SpinnerLoading';


const JobItem = ({ job, onJobClick }) => {
    const user_info = useSelector(selectUserInfo);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const loading = useSelector(selectIsLoading);
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
    return loading?<SpinnerLoading loading={loading}/> 
    :(<div className='jobitem-container' onClick= {(e) => 
        {
            e.preventDefault();
            onJobClick(job);
            console.log(job.name);
        }}>
        <ListItem key={job.index} >
            <div className='jobitem-content'>
                <Typography variant="h6">{job.job_name}</Typography>
                <Typography variant="body1" className='company-loc-text'><BadgeIcon/>{`: ${job.company_name} | `}<LocationOnIcon/>{`: ${job.location}`}</Typography>
                <Typography variant="body1" className='email-text'><MailIcon/>{`: ${job.email}`}</Typography>
                <Typography variant="body1" className='skill-text'><BiotechIcon/>{`: ${job.skills}`}</Typography>
            </div>
            <ListItemSecondaryAction className="btn-container">
                <Button className="btn-apply" variant="contained" color="primary" onClick={(e) => 
                {
                    SendCV(job, user_info);
                    e.stopPropagation();
                    const chatId = `${user_info.account.id}_${job.id}`;
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
                    firebaseService.sendMessage1(chatId, user_info, `Sent your job application for ${job.job_name} position.`, 'message');
                }}>
                Apply
                </Button>
                <Button className="btn-message" variant="contained" color="secondary" onClick={(e) => {
                    e.stopPropagation();
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
                }}>
                Message
                </Button>
            </ListItemSecondaryAction>
        </ListItem>
    </div>
  );
}

export default JobItem;
