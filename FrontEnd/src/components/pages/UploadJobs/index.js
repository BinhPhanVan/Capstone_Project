import React from "react";
import ButtonCreate from "./ButtonCreate";
import SearchJobUpload from "./SearchJobUpload";
function UploadJobs() 
{
    return (
        <div className="upload-jobs-container">
            <ButtonCreate/>
            <SearchJobUpload/>
        </div>
    );
}
export default UploadJobs;
