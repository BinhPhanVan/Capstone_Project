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

const userService = {get_information, find_job, get_active};
export default  userService;
