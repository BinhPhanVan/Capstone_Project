import { Container, Typography, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { find_job, selectIsActive, selectIsLoading } from '../../../store/UserSlice';
import SpinnerLoading from '../../commons/SpinnerLoading';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '80vh',
  },
  title: {
    marginBottom: '2rem',
    fontWeight: 'bold',
  },
  button: {
    padding: '0.75rem 2rem',
    borderRadius: '0.5rem',
    backgroundColor: '#2196f3',
    color: '#fff',
    transition: 'background-color 0.3s ease',
    '&:hover': {
      backgroundColor: '#1976d2',
    },
  },
});

function TurnOnJob() {
  const classes = useStyles();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const loading = useSelector(selectIsLoading);
  const is_active = useSelector(selectIsActive);
  const handleTurnOnJob = async (e) => {
    e.preventDefault();
    const actionResult = await dispatch(find_job());
    console.log(actionResult);
    if (find_job.fulfilled.match(actionResult)) {
      toast.success(actionResult.payload.message);
      navigate("/jobs/search/")
    }
    else{
      toast.warning(actionResult.payload.message);
    }
  }
  useEffect(() => {
    if(is_active)
    {
      navigate("/jobs/search/");
    }
    else
    {
      navigate("/jobs/turn-on/");
    }
  }, [is_active, navigate]);

  return (
    <div>
      <SpinnerLoading loading={loading}/>
      <Container maxWidth="sm" className={classes.container}>
          <Typography variant="h5" align="center" gutterBottom className={classes.title}>
              Find Your Dream Job
          </Typography>
          <Button variant="contained" className={classes.button} onClick={handleTurnOnJob}>
              Turn on job search
          </Button>
      </Container>
    </div>

  );
}

export default TurnOnJob;
