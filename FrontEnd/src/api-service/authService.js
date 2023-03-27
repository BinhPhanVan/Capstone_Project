
import httpRequest from "./httpRequest";

const login = async (email, password) => {
    const res = await   httpRequest.post('users/login/', {
        email,
        password,
    }) ;
    return res;
}

const authService = {login};

export default authService;