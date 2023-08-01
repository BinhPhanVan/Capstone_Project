import httpRequest from "./httpRequest";

const upload_job = async (data) => {
    const formData = new FormData();
    formData.append("pdf_file", data.pdf_file);
    formData.append("job_name", data.job_name);
    formData.append("location", data.location);
    const res = await   httpRequest.post('recruiter/upload-job/', 
    formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }
    ) ;
    return res;
}
const get_all_jobs= async () => {
    const res = await  httpRequest.get('employee/get-all-jobs/');
    return res;
}

const get_all_jobs_owner= async () => {
    const res = await  httpRequest.get('recruiter/get-all-jobs-owner/');
    return res;
}

const update_job_status = async (id) => {
    const res = await httpRequest.put(`recruiter/job/${id}`, {
        "job_requirement_id": id,
    });
    return  res;
};

const delete_job = async (id) => {
    const res = await httpRequest.delete(`recruiter/job/${id}`, {
        "job_requirement_id": id,
    });
    return  res;
};

const jobService = {upload_job, get_all_jobs, get_all_jobs_owner, update_job_status, delete_job};
export default  jobService;
