import httpRequest from "./httpRequest";

const get_information = async () => {
    const res = await   httpRequest.get('user/get-information/');
    return res;
}

const find_job = async () => {
    const res = await  httpRequest.get('employee/find-job/');
    return res;
}

const get_active = async () => {
    const res = await  httpRequest.get('employee/get-active/');
    return res;
}

const get_all_candidate= async () => {
    const res = await  httpRequest.get('recruiter/get-all-candidates/');
    return res;
}

const send_email_with_job =  async (data) => {

    const res = await  httpRequest.post('recruiter/send-email/', {
        ...data
    });
    return res;
}

const send_email_with_cv =  async (data) => {
    console.log(data);
    const res = await  httpRequest.post('employee/send-email/', {
        ...data
    });
    return res;
}

const verify_cv =  async (data) => {
    const res = await  httpRequest.post('employee/verify-cv/', {
        ...data
    });
    return res;
}

const upload_employee_profile = async (data) => {
    const formData = new FormData();
    formData.append("first_name", data.first_name);
    formData.append("last_name", data.last_name);
    formData.append("avatar_img", data.avatar_img);
    const res = await  httpRequest.post('user/upload-employee-profile/', 
    formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }
    ) ;
    return res;
}

const upload_recruiter_profile = async (data) => {
    const formData = new FormData();
    formData.append("first_name", data.first_name);
    formData.append("last_name", data.last_name);
    formData.append("avatar_img", data.avatar_img);
    formData.append("company_name", data.company_name);
    formData.append("address", data.address);
    const res = await  httpRequest.post('user/upload-recruiter-profile/', 
    formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }
    ) ;
    return res;
}

const userService = {get_information, find_job, get_active, get_all_candidate, send_email_with_job, send_email_with_cv, verify_cv, upload_employee_profile, upload_recruiter_profile};
export default  userService;
