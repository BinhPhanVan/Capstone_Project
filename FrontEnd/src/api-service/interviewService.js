import httpRequest from "./httpRequest";

const setup_interview =  async (data) => {
    console.log(data);
    const res = await  httpRequest.post('interviews/set-up/', {
        ...data
    });
    return res;
}

const interviewService = {setup_interview};
export default  interviewService;
