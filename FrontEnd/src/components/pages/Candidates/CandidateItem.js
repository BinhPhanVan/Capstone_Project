import React from 'react';
import { ListItem, ListItemSecondaryAction, Button, Typography, ListItemAvatar } from '@material-ui/core';
import BiotechIcon from '@mui/icons-material/Biotech';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import MailIcon from '@mui/icons-material/Mail';
import PhoneIcon from '@mui/icons-material/Phone';
import { Avatar } from '@mui/material';
import { useSelector } from 'react-redux';
import { selectUserInfo } from '../../../store/UserSlice';
import firebaseService from '../../../api-service/firebaseService';
import { useNavigate } from 'react-router-dom';

const CandidateItem = ({ candidate, onCandidateClick }) => {
    const user_info = useSelector(selectUserInfo);
    const navigate = useNavigate();
    return (
    <div className='candidate_item-container' onClick= {(e) => 
        {
            e.preventDefault();
            onCandidateClick(candidate);
            console.log(candidate.name);
        }}>
        <ListItem key={candidate.id} >
            <ListItemAvatar>
                <Avatar alt={candidate.name} src={candidate.avatar_url} className="candidate-avatar"/>
            </ListItemAvatar>
            <div className='candidate_item-content'>
                <Typography variant="h6">{candidate.name}</Typography>
                <Typography variant="body1" className='email-text'><MailIcon/>{`: ${candidate.email}`}</Typography>
                <Typography variant="body1" className='company-loc-text'><LocationOnIcon/>{`: ${candidate.location} | `}<PhoneIcon/>{`: +${candidate.phone_number}`}</Typography>
                <Typography variant="body1" className='skill-text'><BiotechIcon/>{`: ${candidate.skills}`}</Typography>
            </div>
            <ListItemSecondaryAction className="btn-container">
                <Button className="btn-apply" variant="contained" color="primary" onClick={(e) => 
                {
                    console.log('Apply clicked')
                    firebaseService.getAllUsersInChatWithUser(user_info.account.id)
                    .then((users) => {
                        // Log the user list with all information
                        users.forEach((user) => {
                        console.log('User ID:', user.id);
                        console.log('User Name:', user.name);
                        console.log('User Avatar:', user.avatar);
                        console.log('Last Message:', user.lastMessage.text);
                        console.log('----------------------------------');
                        });
                    })
                    .catch((error) => {
                        console.error('Error retrieving users:', error);
                    });
                    e.stopPropagation();
                }}>
                Invite
                </Button>
                <Button className="btn-message" variant="contained" color="secondary" onClick={(e) => {
                    e.preventDefault();
                    console.log('Message clicked');
                    firebaseService.initializeConversation(
                        candidate.id, 
                        user_info.account.id, 
                        candidate.name, 
                        candidate.avatar_url, 
                        user_info.account.first_name + " " + user_info.account.last_name, 
                        user_info.avatar_url);
                    navigate(`/chat/${candidate.id}_${user_info.account.id}`);
                    e.stopPropagation();
                }}>
                Message
                </Button>
            </ListItemSecondaryAction>
        </ListItem>
    </div>
  );
}

export default CandidateItem;
