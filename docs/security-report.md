# Security Report

Security testing for this application was performed using OWASP ZAP 2.6 on Mac OS using the https://fs-epermit-dev.herokuapp.com URL. The security testing tool simulates attacks on the website, analyzes the results, and presents a report on the website's vulnerabilities. 

Testing of this URL resulted in a single alert: "Web Browser XSS Protection Not Enabled." This alert should be disregarded, however. Helmet, an npm package used with this application, uses the cross-site scripting (abbreviated "XSS") flag if it is safe to do so. However, as the [Helmet documentation](https://helmetjs.github.io/docs/xss-filter/) explains, this "header causes some even worse security vulnerabilities in older versions of Internet Explorer, so it’s wise to disable it there." In other words, the header's absence, which OWASP ZAP has flagged, is necessary for security. We have also inspected the issue in modern browsers and verified that the XSS flag is properly set.

The full results of the OWASP ZAP vulnerability test are provided below for reference. They are also available in [this screenshot](https://github.com/nci-ats/fs-middlelayer-api/blob/feat/reports/docs/security_screenshot.png). 

## ZAP Scanning Report

### Summary of Alerts

| Risk Level | Number of Alerts |
| --- | --- |
| High | 0 |
| Medium | 0 |
| Low | 1 |
| Informational | 0 |

### Alert Detail

#### Web Browser XSS Protection Not Enabled

##### Low (Medium)
  
##### Description

Web Browser XSS Protection is not enabled, or is disabled by the configuration of the 'X-XSS-Protection' HTTP response header on the web server
  
- URL: [https://fs-epermit-dev.herokuapp.com/](https://fs-epermit-dev.herokuapp.com/)
- Method: `GET`
- Parameter: `X-XSS-Protection`
- Evidence: `X-XSS-Protection: 0`
  
Instances: 1
  
### Solution

Ensure that the web browser's XSS filter is enabled, by setting the X-XSS-Protection HTTP response header to '1'.
  
##### Other information

The X-XSS-Protection HTTP response header allows the web server to enable or disable the web browser's XSS protection mechanism. The following values would attempt to enable it: 

X-XSS-Protection: 1; mode=block

X-XSS-Protection: 1; report=http://www.example.com/xss

The following values would disable it: 

X-XSS-Protection: 0

The X-XSS-Protection HTTP response header is currently supported on Internet Explorer, Chrome and Safari (WebKit).

Note that this alert is only raised if the response body could potentially contain an XSS payload (with a text-based content type, with a non-zero length).</p>
  
#### Reference

- https://www.owasp.org/index.php/XSS_(Cross_Site_Scripting)_Prevention_Cheat_Sheet
- https://blog.veracode.com/2014/03/guidelines-for-setting-security-headers/

##### CWE Id : 933
  
##### WASC Id : 14
  
##### Source ID : 3
