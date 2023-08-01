import React from 'react';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import { useNavigate } from 'react-router-dom';

const ButtonCreate = () => {
    const navigate = useNavigate();
    const handleCreate = (e) => {
        e.preventDefault();
        navigate("/recruiter/create-jobs");
    }
  return (
    <div className="button-container">
      <Button
        className="create-button"
        variant="contained"
        component="span"
        startIcon={<AddIcon />}
        onClick={handleCreate}
      >
        Create Job
      </Button>
    </div>
  );
};

export default ButtonCreate;
