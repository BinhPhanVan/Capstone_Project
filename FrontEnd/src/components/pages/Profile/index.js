import React, { useEffect, useLayoutEffect } from 'react';
import { Button, Container, Grid, TextField, Typography } from '@material-ui/core';
import { Form } from 'react-bootstrap';
import Avatar from '@material-ui/core/Avatar';
import { useDispatch, useSelector } from 'react-redux';
import { get_information, selectUserInfo } from '../../../store/UserSlice';
import SpinnerLoading from '../../commons/SpinnerLoading';
import EditIcon from '@mui/icons-material/Edit';


const Profile = () => {
  const dispatch = useDispatch();
  const user_info = useSelector(selectUserInfo);
  const [email, setEmail] = React.useState('');
  const [avatar, setAvatar] = React.useState('');
  const [firstName, setFirstName] = React.useState('');
  const [lastName, setLastName] = React.useState('');
  const [isChange, setIsChange] = React.useState(false);
  useLayoutEffect(() => {
    if(user_info)
    {
        setAvatar(user_info.avatar_url) 
        setEmail(user_info.account.email);
        setFirstName(user_info.account.first_name);
        setLastName(user_info.account.last_name);
    }
  }, [user_info ]);

  useEffect(() => {
    dispatch(get_information());
  }, [dispatch]);

  useEffect(() => {
    document.title = "Profile | Hire IT";
  }, []);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      const imageUrl = event.target.result;
      setAvatar(imageUrl); // Update the avatar image URL
      if(file)
      {
        setIsChange(true)
      }
    };
    reader.readAsDataURL(file);
  };

  return user_info ? (
    <div className="profile-page">
        <Form>
            <Grid className="profile-container">
                <Grid item xs={12} md={12} className="profile-avatar">
                    <Avatar
                        alt="John Doe"
                        className="avatar-image"
                        src={avatar}
                        onChange={(e) => {
                            setIsChange(true);
                        }}
                    />
                    <div className="edit-icon-container">
                        <label htmlFor="avatar-upload">
                            <EditIcon className="edit-icon" />
                        </label>
                    <input
                        id="avatar-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarChange}
                        style={{ display: 'none' }}
                    />
                    </div>
                </Grid>
                <Grid item xs={12} md={12} className="profile-content">
                <Container maxWidth="md" sx={{ marginTop: 2 }}>
                    <Grid container spacing={2}>
                    <Grid item xs={12} md={12}>
                        <Typography variant="h6" gutterBottom>
                            Information
                        </Typography>
                            <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                label="Email"
                                type="email"
                                value={email}
                                onChange={(e) => 
                                    {
                                        setIsChange(true)
                                        setEmail(e.target.value)
                                    }
                                }
                                placeholder="Enter your email"
                                fullWidth
                                disabled
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                label="First Name"
                                value={firstName}
                                onChange={(e) => 
                                    {
                                        setIsChange(true)
                                        setFirstName(e.target.value)
                                    }
                                }
                                placeholder="First Name"
                                fullWidth
                                required
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                label="Last Name"
                                value={lastName}
                                onChange={(e) => 
                                    {
                                        setIsChange(true)
                                        setLastName(e.target.value)
                                    }
                                }
                                placeholder="Last Name"
                                fullWidth
                                required
                                />
                            </Grid>
                            { isChange && (
                            <Grid item xs={12} justifyContent="flex-end">
                                <Button type="submit" variant="contained" color="primary">
                                    Update
                                </Button>
                            </Grid>)}
                            </Grid>
                    </Grid>
                    </Grid>
                </Container>
                </Grid>
            </Grid>
        </Form>
    </div>
  ) : <SpinnerLoading loading='true'/>;
};

export default Profile;
