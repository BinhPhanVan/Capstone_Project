import { Container, Typography, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { find_job, get_active, selectIsActive, selectIsLoading, verify_cv } from '../../../store/UserSlice';
import SpinnerLoading from '../../commons/SpinnerLoading';
import { ListItemSecondaryAction, Modal } from '@mui/material';
import { Col, Form, Row } from 'react-bootstrap';
import { PROVINCES } from '../../../constants/locations';
import { handlePhone } from '../../../utils/handlePhone';

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
  const [phone_number, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [skills, setSkills] = useState("");
  const handleExtractCV = async (e) => {
    e.preventDefault();
    const actionResult = await dispatch(find_job());
    if (find_job.fulfilled.match(actionResult)) {
      setLocation(actionResult.payload.data['location'] === null ? "" :actionResult.payload.data['location']);
      setPhone(actionResult.payload.data['phone_number'] === null ? "" : actionResult.payload.data['phone_number']);
      setSkills(actionResult.payload.data['skills']);
      toast.success(actionResult.payload.message);
      setModalOpen(true);
    }
    else{
      toast.warning(actionResult.payload.message);
    }
  }
  const handleTurnOnJob = async (e) => {
    e.preventDefault();
    const data = {
      'location': location,
      'phone_number': phone_number,
      'skills': skills
    }
    console.log(handlePhone(phone_number));
    if (handlePhone(phone_number))
    {
      const actionResult = await dispatch(verify_cv(data));
      if (verify_cv.fulfilled.match(actionResult)) {
        dispatch(get_active())
        toast.success(actionResult.payload.message);
        setModalOpen(false);
        navigate("/jobs/search/");
      }
      else{
        toast.warning(actionResult.payload.message);
      }
    }
    else{
      toast.warning("Incorrect phone number.");
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
  const [modalOpen, setModalOpen] = useState(false);
  const handleCloseModal = (e) => {
    setModalOpen(false);
  };
  return (
    <div>
      <SpinnerLoading loading={loading}/>
      <Container maxWidth="sm" className={classes.container}>
          <Typography variant="h5" align="center" gutterBottom className={classes.title}>
              Find Your Dream Job
          </Typography>
          <Button variant="contained" className={classes.button} onClick={handleExtractCV}>
              Turn on job search
          </Button>
      </Container>
      <div className='modal-container'>
        <Modal open={modalOpen} onClose={handleCloseModal} className='modal-list-job'>
          <div className="job_upload_item-content  job_upload_item_container info_cv_item-content">
            
            <div className="info-cv-page">
              {/* <div className="info-cv-container"> */}
                <div className="form">
                <Form className="info-cv-form" onSubmit={handleTurnOnJob}>
                    <button className='close-button' onClick={handleCloseModal}>X</button>
                    <h3>Verify Information</h3>
                    <Form.Group
                      as={Row}
                      className="mb-3"
                      controlId="formHorizontalEmail"
                    >
                      <Form.Label>
                        Phone number
                      </Form.Label>
                      <Col sm={20}>
                        <Form.Control
                          type="text"
                          onChange={(e) => setPhone(e.target.value)}
                          name="job_name"
                          placeholder="Enter phone number"
                          value={phone_number}
                          required
                        />
                      </Col>
                    </Form.Group>

                    <Form.Group
                      as={Row}
                      className="mb-3"
                      controlId="formHorizontalLocation"
                    >
                      <Form.Label>
                        Location
                      </Form.Label>
                      <Col sm={20}>
                        <Form.Control
                          as="select"
                          name="location"
                          placeholder="Choose location"
                          required
                          sx={{ height: "100%" }}
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                        >
                          <option value="">Select a location</option>
                          {PROVINCES.map((province) => (
                            <option key={province} value={province}>
                              {province}
                            </option>
                          ))}
                        </Form.Control>
                      </Col>
                    </Form.Group>
                    <Form.Group
                      as={Row}
                      className="mb-3"
                      controlId="formHorizontalDescription" 
                      style={{ display: "none" }}
                    >
                      <Form.Label>Skills</Form.Label>
                      <Col sm={20}>
                        <Form.Control
                          as="textarea"
                          name="description"
                          placeholder="Enter skills"
                          value={skills}
                          onChange={(e) => setSkills(e.target.value)}
                          required
                        />
                      </Col>
                    </Form.Group>
                    <ListItemSecondaryAction className="modal-btn-container">
                        <Button className="btn-cancel" variant="contained" color="default" onClick={handleCloseModal} >
                          Cancel
                        </Button>
                        <Button type='submit' className="btn-select" variant="contained" color="primary">
                          Confirm
                        </Button>
                    </ListItemSecondaryAction>
                  </Form>
                </div>
              {/* </div> */}
            </div>
          </div>
        </Modal>
      </div>
    </div>

  );
}

export default TurnOnJob;
