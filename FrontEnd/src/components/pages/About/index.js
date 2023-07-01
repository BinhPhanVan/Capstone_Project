import React from "react";
import { Typography, makeStyles, Avatar, Grid } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  aboutContainer: {
    margin: theme.spacing(2),
  },
  paragraph: {
    marginBottom: theme.spacing(2),
  },
  avatar: {
    width: theme.spacing(30),
    height: theme.spacing(30),
    border: "4px solid #fff",
    boxShadow: "1px 2px 8px rgba(0, 0, 0, 0.15)",
  },
  root: {
    flexGrow: 1,
  },
  cap: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
}));

const images = [
  'https://codelearn.io/Upload/Blog/react-js-co-ban-phan-1-63738082145.3856.jpg',
  'https://files.dimagi.com/wp-content/uploads/2016/01/Django.png',
  'https://cloudinary-res.cloudinary.com/image/upload/website/cloudinary_web_favicon.png',
  'https://cdn-media-1.freecodecamp.org/images/0*CPTNvq87xG-sUGdx.png',
  'https://spacy.io/_next/static/media/social_default.96b04585.jpg',
  'https://numfocus.org/wp-content/uploads/2016/07/pandas-logo-300.png',

];
const images1 = [
  'http://dut.udn.vn/Files/admin/images/Tin_tuc/Khac/2020/LogoDUT/image002.jpg',
  'https://scontent.fdad3-4.fna.fbcdn.net/v/t39.30808-6/308181803_453974736759567_4516344133144668315_n.jpg?_nc_cat=105&cb=99be929b-59f725be&ccb=1-7&_nc_sid=09cbfe&_nc_ohc=izR6NgCR4gsAX-oG-kn&_nc_ht=scontent.fdad3-4.fna&oh=00_AfB0UUMRd78gRWijRvxpO2mewnUq24OT-MhborSN7wit5A&oe=64A5621E',

];


function About() {
  const classes = useStyles();

  return (
    <div className={`${classes.aboutContainer} about`}>
      <Grid container spacing={2} alignItems="center">
        <Grid item>
          <Avatar
            alt="Avatar"
            src="https://res.cloudinary.com/dq6avgw6n/image/upload/v1688060777/6f38bd12f72619784037_kqkgay.jpg"
            className={classes.avatar}
          />
        </Grid>
        <Grid item xs>
          <Typography variant="body1" className="about-content">
            Welcome to our recruitment system! We provide a powerful and efficient solution for businesses to streamline their hiring processes. Our system offers features for job posting, applicant tracking, interview scheduling, and candidate evaluation. With a user-friendly interface and advanced search capabilities, you can quickly find and hire the best talents. We prioritize data security and privacy to safeguard your sensitive information. Job seekers can explore employment opportunities and connect with companies actively hiring. Our scalable and customizable system caters to small startups and large enterprises. Let us help you build a winning team and find your dream job!
          </Typography>
        </Grid>
      </Grid>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12}>
          <h2 className="tech-about">TECHNOLOGY</h2>
        </Grid>
        <div className={classes.root}>
          <Grid container spacing={2}>
            {images.map((cap, index) => (
              <Grid key={index} item xs={12} sm={6} md={4} lg={3}>
                <img src={cap} alt='Caption' className={`${classes.cap} images-about`}/>
              </Grid>
            ))}
          </Grid>
        </div>
      </Grid>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12}>
          <h2 className="tech-about">SUPPORT UNIT</h2>
        </Grid>
        <Grid item xs={12}>
          <div className={classes.root}>
            <Grid container spacing={2}>
              {images1.map((cap, index) => (
                <Grid key={index} item xs={12} sm={6} md={4} lg={3}>
                  <img src={cap} alt='Caption' className={`${classes.cap} images-about`} />
                </Grid>
              ))}
            </Grid>
          </div>
        </Grid>
      </Grid>
    </div>
  );
}

export default About;
