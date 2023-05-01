import React, { useEffect } from 'react';
import { Container, Grid, Paper, Typography } from '@material-ui/core';
import { Card, ListGroup } from 'react-bootstrap';
import Avatar from '@material-ui/core/Avatar';
import { useDispatch, useSelector } from 'react-redux';
import { get_information, selectUserInfo } from '../../../store/UserSlice';


const Profile = () => {
    const dispatch = useDispatch();
    const user_info = useSelector(selectUserInfo);
    console.log(user_info);
    useEffect(() => {
        dispatch(get_information());
    }, [dispatch]);
    useEffect(() => {
        document.title = "Profile | Hire IT";
    }, []);

    return (
    <div>
        <Avatar alt="John Doe" 
            style={{ width: '100px', height: '100px' }}
            src={user_info.avatar_url} />
        
        <Container maxWidth="md" sx={{ marginTop: 2 }}>
            <Grid container spacing={2}>
            
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 2 }}>
                        <Typography variant="h6" gutterBottom>
                            {user_info.account.first_name + " " + user_info.account.last_name}
                        </Typography>
                        <Card>
                            <Card.Header>Personal Info</Card.Header>
                                <ListGroup variant="flush">
                                    <ListGroup.Item>Name: {user_info.account.first_name + " " + user_info.account.last_name}</ListGroup.Item>
                                    <ListGroup.Item>Email: {user_info.account.email} </ListGroup.Item>
                                    <ListGroup.Item>Phone: 123-456-7890</ListGroup.Item>
                                </ListGroup>
                        </Card>
                </Paper>
                </Grid>
            </Grid>
        </Container>
    </div>
    
  );
};

export default Profile;
