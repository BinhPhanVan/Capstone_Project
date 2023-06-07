import React from 'react';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useDispatch } from 'react-redux';
import { delete_job, update_job_status } from '../../../store/JobSlice';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
export default function MenuOption({job}) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    event.stopPropagation();
  };

  const handleClose = (event) => {
    setAnchorEl(null);
    event.stopPropagation();
  };
  const handleUpdateStatus = async (job) => {
    const actionResult = await dispatch(update_job_status(job.id));
    if (update_job_status.fulfilled.match(actionResult)) {
      toast.success(actionResult.payload['message']);
      navigate("/recruiter/upload-jobs");
    }
    if (update_job_status.rejected.match(actionResult)) {
      toast.error(actionResult.payload['message']);
    }
  };

  const handleDeleteJob = async (job) => {
    const actionResult = await dispatch(delete_job(job.id));
    if (delete_job.fulfilled.match(actionResult)) {
      toast.success("Deleted successfully");
      navigate("/recruiter/upload-jobs");
    }
    if (delete_job.rejected.match(actionResult)) {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="menu-container">
      <div aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick} className='menu-eclipse'>
        <MoreVertIcon fontSize='2rem'/>
      </div>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={handleClose}>Edit Job</MenuItem>
        {job.active 
        ?<MenuItem onClick={() => handleUpdateStatus(job)}>Deactive</MenuItem>
        :<MenuItem onClick={() => handleUpdateStatus(job)}>Active</MenuItem>}
        <MenuItem onClick={() => handleDeleteJob(job)}>Delete Job</MenuItem>
      </Menu>
    </div>
  );
}
