import React from 'react';
import { ListItem, ListItemSecondaryAction, Button, Typography, ListItemAvatar } from '@material-ui/core';
import { Avatar } from '@mui/material';

const CandidateItem = ({ candidate, onCandidateClick }) => {
  return (
    <div className='candidate_item-container' onClick= {(e) => 
        {
            e.preventDefault();
            onCandidateClick(candidate);
            console.log(candidate.name);
        }}>
        <ListItem key={candidate.id} >
            <ListItemAvatar>
                <Avatar alt={candidate.name} src={candidate.avartar_url} className="candidate-avatar"/>
            </ListItemAvatar>
            <div className='candidate_item-content'>
                <Typography variant="h6">{candidate.name}</Typography>
                <Typography variant="body1" className='skill-text'>{`Skill: ${candidate.skill}`}</Typography>
                <Typography variant="body1" className='company-loc-text'>{`Location: ${candidate.location}`}</Typography>
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
