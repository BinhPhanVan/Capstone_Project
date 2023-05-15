import React from "react";
import {
    ListItem,
    Typography,
} from "@material-ui/core";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import MenuOption from "./MenuOption";

const JobUploadItem = ({ job, onJobClick }) => {
    return (
        <div
            className="job_upload_item-container"
            onClick={(e) => {
                e.preventDefault();
                onJobClick(job);
                console.log(job.name);
            }}
        >
            <ListItem key={job.id}>
                <div className="job_upload_item-content">
                    <Typography variant="h6">{job.job_name}</Typography>
                    <Typography variant="body1" className="company-loc-text">
                        <LocationOnIcon />
                        {`${job.location}`}
                    </Typography>
                </div>
                <MenuOption/>
            </ListItem>
        </div>
    );
};

export default JobUploadItem;
