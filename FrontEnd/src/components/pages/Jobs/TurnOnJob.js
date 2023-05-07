import { Container, Typography, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

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
  return (
    <Container maxWidth="sm" className={classes.container}>
        <Typography variant="h5" align="center" gutterBottom className={classes.title}>
            Find Your Dream Job
        </Typography>
        <Button variant="contained" className={classes.button}>
            Turn on job search
        </Button>
    </Container>
  );
}

export default TurnOnJob;
