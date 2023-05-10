import React from "react";
import { Link, Outlet } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { Button, Typography } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
  },
  title: {
    marginBottom: theme.spacing(2),
  },
  link: {
    margin: theme.spacing(1),
    textDecoration: "none",
  },
}));

const DevideSignUp = () => {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <Typography variant="h4" component="h2" className={classes.title}>
        Choose your account type:
      </Typography>
      <Button
        component={Link}
        to="/register/recruiter"
        variant="contained"
        color="primary"
        size="large"
        className={classes.link}
      >
        Register as a Recruiter
      </Button>
      <Button
        component={Link}
        to="/register/candidate"
        variant="contained"
        color="primary"
        size="large"
        className={classes.link}
      >
        Register as a Candidate
      </Button>
      <Outlet />
    </div>
  );
};

export default DevideSignUp;
