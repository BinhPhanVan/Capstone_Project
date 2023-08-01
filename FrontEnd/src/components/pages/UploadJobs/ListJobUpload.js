import React, { useState } from 'react';
import { List} from '@mui/material';
import JobItem from './JobUploadItem';
import { FaAngleRight , FaChevronDown } from 'react-icons/fa';

const ListJobUpload = ({ jobs }) => {
  const [showActiveJobs, setShowActiveJobs] = useState(true);
  const [showDeactiveJobs, setShowDeactiveJobs] = useState(false);

  const handleToggleActiveJobs = () => {
    setShowActiveJobs(!showActiveJobs);
  };
  const handleToggleDeactiveJobs = () => {
    setShowDeactiveJobs(!showDeactiveJobs);
  };
  const activeJobs = jobs.filter(job => job.active === true);
  const inactiveJobs = jobs.filter(job => job.active === false);
return (
  <div>
      <div>
         <List key="job_upload-item">
            <div onClick={handleToggleActiveJobs} className='active-chevrondown'>
              Active {showActiveJobs ? <FaChevronDown  className='custom-chevron' />: <FaAngleRight  className='custom-chevron' /> }
            </div>
            {showActiveJobs && activeJobs.map((job) => (
              <JobItem key={job.id}  job={job}/>
            ))}
            <div onClick={handleToggleDeactiveJobs}  className='active-chevrondown' style={{ marginTop: '2rem' }}>
              Deactive  {showDeactiveJobs ? <FaChevronDown  className='custom-chevron' />: <FaAngleRight  className='custom-chevron' /> }
            </div>
            {showDeactiveJobs && inactiveJobs.map((job) => (
              <JobItem key={job.id}  job={job}/>
            ))}
          </List>
      </div>
  </div>
  );
};

export default ListJobUpload;
