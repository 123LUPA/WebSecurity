import nodemailer from 'nodemailer';

class Mailer{
    constructor(){
        const mailerSettings = {
            host: 'smtp.ethereal.email',
            port: 587,
            auth: {
                user: 'rlpveprc34b6yehh@ethereal.email',
                pass: 'NEbuhrJmQmxba8CBSu'
            }
        };
       return this.mailer = nodemailer.createTransport(mailerSettings);
    }
}
const  mailer = new Mailer();
export default mailer;