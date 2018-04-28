import nodemailer from 'nodemailer';



export function sender(){

    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'palkovicova.lucia@gmail.com',
            pass: 'Klucinka007'
        }

    });
    return transporter;


    /*    }

        const mailerSettings =({
                service: 'Gmail',
                auth: {
                    user: 'palkovicova.lucia@gmail.com',
                    pass: 'Klucinka007'
                }
            });
           return this.mailer = nodemailer.createTransport(mailerSettings);*/

}

