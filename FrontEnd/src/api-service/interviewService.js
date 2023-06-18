import httpRequest from "./httpRequest";

const setup_interview =  async (data) => {
    console.log(data);
    const res = await  httpRequest.post('interviews/set-up/', {
        ...data
    });
    return res;
}

const get_interview =  async (data) => {
    const res = await  httpRequest.get('interviews/get-interview/', {
        params: data
    });
    return res;
}

const update_interview_status = async (data) => {
    const res = await httpRequest.put(`interviews/${data.id}`, {
        "status": data.status,
    });
    return  res;
};

const interviewService = {setup_interview, get_interview, update_interview_status};
export default  interviewService;
