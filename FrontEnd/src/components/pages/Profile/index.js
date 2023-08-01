import React, { useEffect, useLayoutEffect, useState } from 'react';
import { Button, Container, Grid, TextField, Typography } from '@material-ui/core';
import { Form } from 'react-bootstrap';
import Avatar from '@material-ui/core/Avatar';
import { useDispatch, useSelector } from 'react-redux';
import { get_information, selectIsLoading, selectUserInfo, upload_employee_profile, upload_recruiter_profile } from '../../../store/UserSlice';
import SpinnerLoading from '../../commons/SpinnerLoading';
import EditIcon from '@mui/icons-material/Edit';
import { selectIsAdmin } from '../../../store/AuthSlice';
import { toast } from 'react-toastify';

const Profile = () => {
  const dispatch = useDispatch();
  const user_info = useSelector(selectUserInfo);
  const [email, setEmail] = useState('');
  const [avatar, setAvatar] = useState('');
  const [fileA, setFileA] = useState(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [isChange, setIsChange] = useState(false);
  const [companyName, setCompanyName] = useState('');
  const [address, setAddress] = useState('');
  const isAdmin = useSelector(selectIsAdmin);
  const loading = useSelector(selectIsLoading);
  useLayoutEffect(() => {
    if(user_info)
    {
        setAvatar(user_info.avatar_url) 
        setEmail(user_info.account.email);
        setFirstName(user_info.account.first_name);
        setLastName(user_info.account.last_name);
        setCompanyName(user_info?.company_name);
        setAddress(user_info?.address);
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
    setFileA(e.target.files[0]);
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
  const handleUploadProfile = async (e) => {
    e.preventDefault();
    if(isAdmin)
    {
        const data = {
            "first_name": firstName.trim(),
            "last_name": lastName.trim(),
            "company_name": companyName.trim(),
            "address": address.trim(),
            "avatar_img": fileA,
        }

        const actionResult = await dispatch(upload_recruiter_profile(data));
        if (upload_recruiter_profile.fulfilled.match(actionResult)) {
            toast.success(actionResult.payload.message);
        }
        else if (upload_recruiter_profile.rejected.match(actionResult)) {
            toast.error("Invalid data");
            dispatch(get_information());
        }
    }
    else 
    {
        const data = {
            "first_name": firstName.trim(),
            "last_name": lastName.trim(),
            "avatar_img": fileA,
        }

        const actionResult = await dispatch(upload_employee_profile(data));
        if (upload_employee_profile.fulfilled.match(actionResult)) {
            toast.success(actionResult.payload.message);
        }
        if (upload_employee_profile.rejected.match(actionResult)) {
            toast.error("Invalid data");
            dispatch(get_information());
        }
    }
    setIsChange(false);
  };

  return user_info ? (
    <>
    <SpinnerLoading loading={loading}/>
    <div className="profile-page">
        <Form onSubmit={handleUploadProfile}>
            <Grid container justifyContent="flex-end" className="profile-container">
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
                                placeholder="First Name (10)"
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
                                placeholder="Last Name (10)"
                                fullWidth
                                required
                                />
                            </Grid>
                            { isAdmin && 
                                <>
                                    <Grid item xs={12}>
                                        <TextField
                                        label="Company Name"
                                        value={companyName}
                                        onChange={(e) => 
                                            {
                                                setIsChange(true)
                                                setCompanyName(e.target.value)
                                            }
                                        }
                                        placeholder="Company Name"
                                        fullWidth
                                        required
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                        label="Address"
                                        value={address}
                                        onChange={(e) => 
                                            {
                                                setIsChange(true)
                                                setAddress(e.target.value)
                                            }
                                        }
                                        placeholder="Address"
                                        fullWidth
                                        required
                                        />
                                    </Grid>
                                </>
                            }
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
    </div></>
  ) : <SpinnerLoading loading='true'/>;
};

export default Profile;
