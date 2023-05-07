import React from 'react';
import { ListItem, ListItemSecondaryAction, Button, Typography } from '@material-ui/core';

const JobItem = ({ job, onJobClick }) => {
  return (
    <div className='jobitem-container' onClick= {(e) => 
        {
            e.preventDefault();
            onJobClick(job);
            console.log(job.name);
        }}>
        <ListItem key={job.id} >
            <div className='jobitem-content'>
                <Typography variant="h6">{job.name}</Typography>
                <Typography variant="body1" className='skill-text'>{`Skill: ${job.skill}`}</Typography>
                <Typography variant="body1" className='company-loc-text'>{`Company: ${job.company} | Location: ${job.location}`}</Typography>
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

export default JobItem;
