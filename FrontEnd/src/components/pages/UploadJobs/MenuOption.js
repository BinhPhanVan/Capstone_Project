import React from 'react';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
export default function MenuOption({job}) {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    event.stopPropagation();
  };

  const handleClose = (event) => {
    setAnchorEl(null);
    event.stopPropagation();
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
        ?<MenuItem onClick={handleClose}>Deactive</MenuItem>
        :<MenuItem onClick={handleClose}>Active</MenuItem>}
        <MenuItem onClick={handleClose}>Delete Job</MenuItem>
      </Menu>
    </div>
  );
}
