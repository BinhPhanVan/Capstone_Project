import React, { useState } from 'react';
import { List} from '@mui/material';
import JobItem from './JobItem';
import ModalJob from './ModalJob';

const ListJob = ({ jobs }) => {
const [openModal, setOpenModal] = useState(false);
const [selectedJob, setSelectedJob] = useState(null);
const handleJobClick = (job) => {
    setSelectedJob(job);
    setOpenModal(true);
  };
const handleCloseModal = () => {
    setSelectedJob(null);
    setOpenModal(false);
  };
return (
    <List key="job-item">
      {jobs.map((job, index) => (
        <JobItem key={index}  job={job} onJobClick={handleJobClick}/>
      ))}
      {selectedJob && (
        <ModalJob job={selectedJob} open={openModal} handleClose={handleCloseModal} />
      )}
    </List>
    
  );
};

export default ListJob;
