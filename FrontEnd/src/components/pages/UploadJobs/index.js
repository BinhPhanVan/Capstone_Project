import React from "react";
import { Outlet } from "react-router-dom";
import ButtonCreate from "./ButtonCreate";
function UploadJobs() 
{
    return (
        <div className="upload-jobs-container">
            <ButtonCreate/>
            <Outlet/>
        </div>
    );
}
export default UploadJobs;
