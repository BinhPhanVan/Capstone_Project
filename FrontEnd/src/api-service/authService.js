
import httpRequest from "./httpRequest";

const login = async (email, password) => {
    const res = await   httpRequest.post('users/login/', {
        email,
        password,
    }) ;
    return res;
}

const signup = async (account) => {
    const res = await httpRequest.post("users/register/", account);
    return res;
};

const authService = {login, signup};

export default authService;