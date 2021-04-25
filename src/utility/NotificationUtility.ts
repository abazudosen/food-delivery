

// IsEmail


// Notifications

// OTP
export const GenerateOTP = () => {
  const otp = Math.floor(100000 + Math.random() * 900000)
  let expiry = new Date()
  expiry.setTime(new Date().getTime() + (30 * 60 * 1000))

  return {otp, expiry}
}

export const onRequestOTP = async(otp: number, toPhoneNumber: string) => {
  const accountSID = 'AC25022d8a62bc9f89f1de447e984506c6';  
  const authToken = 'f8625f84ae43367ccb637a4f063c70ee';
  const client = require('twilio')(accountSID, authToken)

  const response = await client.messages.create({
    body: `Your OTP is ${otp}`,
    from: '+13865164296',
    to: `+234${toPhoneNumber}`,
  })
  return response;
}



// Payment notification or emails