# Razorpay Developer Account Setup

To integrate Razorpay into our e-commerce platform, follow these steps to set up a Razorpay developer account and obtain your API keys.

## Steps:

1. **Sign Up on Razorpay**
   - Go to the [Razorpay Signup Page](https://dashboard.razorpay.com/signup) and create a new account.

2. **Complete KYC**
   - Follow the instructions to complete the Know Your Customer (KYC) verification.

3. **Access Dashboard**
   - Once the account is verified, log in to the [Razorpay Dashboard](https://dashboard.razorpay.com/).

4. **Generate API Keys**
   - Navigate to the *'API Keys'* section in the dashboard.
   - Click on *'Generate Live Key'* to obtain live API keys.
   - Optionally, generate test API keys for development by selecting the *'Test Mode'*.

5. **Store API Keys Safely**
   - Note down the Key Id and Key Secret.
   - Add these to your environment variables to ensure the security of your application.

## Environment Variables

- Ensure that your `.env` file includes the following entries replacing the placeholders with your actual Key Id and Key Secret:

  env
  RAZORPAY_KEY_ID=<Your_Key_Id>
  RAZORPAY_KEY_SECRET=<Your_Key_Secret>
  

- Update your `next.config.js` to load these environment variables:

   javascript
   // next.config.js
   module.exports = {
     env: {
       RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID,
       RAZORPAY_KEY_SECRET: process.env.RAZORPAY_KEY_SECRET,
     }
   }
   