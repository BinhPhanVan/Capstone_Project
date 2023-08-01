export const handleError = (error) => {
    switch (error.response.status) {
      case 400 || 403:
        return error.response.data.detail;
      case 500:
        return "Đang có lỗi ở Server";
      default:
        return "Error";
    }
  }