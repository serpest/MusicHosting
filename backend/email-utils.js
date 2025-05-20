// E-mail are sent using Google Apps Script, where the following function has been defined:
// function doGet(e) {
//     MailApp.sendEmail("abc@gmail.com", e.parameter.subject, e.parameter.to + "\n" + e.parameter.body);
//     return HtmlService.createHtmlOutput("<h1>Done!</h1>")
// }
// For security reasons, the recipient is a fixed address, but the real recipient is specified in the e-mail body
const baseEMailURL = 'https://script.google.com/macros/s/AKfycbynuhej9rSrfeX-bSchQ4sV5VGLhMHXFM0JyLOq8ued3gFdIBvmCZ6gDgQa3JyXYGI/exec'

function sendEMail(to, subject, body) {
    const encodedTo = encodeURIComponent(to);
    const encodedSubject = encodeURIComponent(subject);
    const encodedBody = encodeURIComponent(body);        
    const url = `${baseEMailURL}?to=${encodedTo}&subject=${encodedSubject}&body=${encodedBody}`;
    fetch(url);
}

module.exports = {
  sendEMail
};
