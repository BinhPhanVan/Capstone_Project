import React from 'react';
import { ListItem, ListItemSecondaryAction, Button, Typography } from '@material-ui/core';
import BadgeIcon from '@mui/icons-material/Badge';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import BiotechIcon from '@mui/icons-material/Biotech';
import MailIcon from '@mui/icons-material/Mail';

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
