export const handlePhone = (phoneNumber) =>{

    var phonePattern = /^(?:0|84)\d{9}$/; // Allows 10 or 11 digits starting with "0" or "84"
  
    // Remove any non-digit characters from the input phoneNumber
    var numericPhoneNumber = phoneNumber.replace(/\D/g, '');

    // Check if the numericPhoneNumber matches the phonePattern and has the same length as the original phoneNumber
    return phonePattern.test(numericPhoneNumber) && numericPhoneNumber.length === phoneNumber.length;
}
