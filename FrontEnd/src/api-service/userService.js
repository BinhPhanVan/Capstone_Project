import httpRequest from "./httpRequest";

const get_information = async () => {
    const res = await   httpRequest.get('user/get-information/');
    return res;
}

const userService = {get_information};
export default  userService;
