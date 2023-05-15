import React from 'react';
import { List} from '@mui/material';
import JobItem from './JobUploadItem';


const ListJobUpload = ({ jobs }) => {
return (
    <List key="job_upload-item">
      {jobs.map((job) => (
        <JobItem key={job.id}  job={job}/>
      ))}
    </List>
  );
};

export default ListJobUpload;
