# Baidu Translation API Setup Guide

## Obtaining API Keys

1. Visit the Baidu Translation Open Platform: http://api.fanyi.baidu.com/
2. Click "Register Now" (if you don't have an account) or "Login" (if you already have an account)
3. After logging in, click "Management Console"
4. Select "Enable General Translation API"
5. Fill in the application information:
   - Application Name: YouTube Subtitle Helper
   - Application Type: Select "Web Application"
   - Fill in other information as prompted
6. After submitting for review, you will receive:
   - APP ID
   - Secret Key

## Configuring the Extension

1. Open the `config.js` file
2. Replace the following values:
   ```javascript
   const CONFIG = {
     BAIDU_APP_ID: 'your_APP_ID',
     BAIDU_SECRET_KEY: 'your_secret_key'
   };
   ```

## Usage Limitations

- Standard Version:
  - Monthly Free Quota: 50,000 characters
  - QPS Limit: 10 requests/second
  - Supports 28 languages
  - Request Length Limit: 6000 bytes
  
- Advanced Version:
  - Starting from 2 million characters per month
  - QPS Limit: Customizable
  - Supports 200+ languages
  - Request Length Limit: 6000 bytes

## Important Notes

1. Keep your API keys secure and do not share them with others
2. It is recommended to monitor usage to avoid exceeding the free quota
3. If your usage is high, consider upgrading to the advanced version
4. For issues, refer to the help documentation on the Baidu Translation Open Platform

## Error Code Descriptions

- 52001: Request timeout
- 52002: System error
- 52003: Unauthorized user
- 54000: Required parameter is empty
- 54001: Signature error
- 54003: Access frequency limited
- 54004: Insufficient account balance
- 54005: Frequent long query requests
- 58000: Client IP not allowed
- 58001: Translation language direction not supported
- 58002: Service currently closed