import React from 'react';
import { ListItem, ListItemSecondaryAction, Button, Typography, ListItemAvatar } from '@material-ui/core';
import BiotechIcon from '@mui/icons-material/Biotech';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import MailIcon from '@mui/icons-material/Mail';
import PhoneIcon from '@mui/icons-material/Phone';
import { Avatar } from '@mui/material';

const CandidateItem = ({ candidate, onCandidateClick }) => {
  return (
    <div className='candidate_item-container' onClick= {(e) => 
        {
            e.preventDefault();
            onCandidateClick(candidate);
            console.log(candidate.name);
        }}>
        <ListItem key={candidate.email} >
            <ListItemAvatar>
                <Avatar alt={candidate.name} src={candidate.avatar_url} className="candidate-avatar"/>
            </ListItemAvatar>
            <div className='candidate_item-content'>
                <Typography variant="h6">{candidate.name}</Typography>
                <Typography variant="body1" className='skill-text'><BiotechIcon/>{`: ${candidate.skills}`}</Typography>
                <Typography variant="body1" className='email-text'><MailIcon/>{`: ${candidate.email}`}</Typography>
                <Typography variant="body1" className='company-loc-text'><LocationOnIcon/>{`: ${candidate.location} | `}<PhoneIcon/>{`: +${candidate.phone_number}`}</Typography>
            </div>
            <ListItemSecondaryAction className="btn-container">
                <Button className="btn-apply" variant="contained" color="primary" onClick={(e) => 
                {
                    console.log('Apply clicked')
                    e.stopPropagation();
                }}>
                Invite
                </Button>
                <Button className="btn-message" variant="contained" color="secondary" onClick={(e) => {
                    console.log('Message clicked')
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
