
import httpRequest from "./httpRequest";

const login = async (email, password) => {
    const res = await   httpRequest.post('employee/login/', {
        email,
        password,
    }) ;
    return res;
}

const signup = async (account) => {
    const res = await httpRequest.post("employee/register/", account);
    return res;
};

const recruiter_signup = async (data) => {
    const res = await httpRequest.post("recruiter/register/", data);
    return res;
};

const verify_email = async (email, otp) => {
    const res = await httpRequest.post("employee/verify-email/", {
        email,
        otp
    });
    return res;
};

const authService = {login, signup, verify_email, recruiter_signup};

export default authService;