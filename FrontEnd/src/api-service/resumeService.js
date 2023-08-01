import httpRequest from "./httpRequest";

const upload_resume = async (pdf_file) => {
    const formData = new FormData();
    formData.append("pdf_file", pdf_file);
    const res = await   httpRequest.post('employee/pdf-upload/', 
    formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }
    ) ;
    return res;
}

const deactive_resume= async () => {
    const res = await  httpRequest.get('employee/deactive/');
    return res;
}

const resumeService = {upload_resume, deactive_resume};

export default  resumeService;
