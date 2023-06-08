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
        data
    });
    return res;
}

const userService = {get_information, find_job, get_active, get_all_candidate, send_email_with_job};
export default  userService;
