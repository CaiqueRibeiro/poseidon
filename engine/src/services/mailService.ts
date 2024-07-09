import mailer from 'nodemailer';
import Config from '../config';

export default async (to: string, subject: string, text: string) => {
    const smtpTransport = mailer.createTransport(Config.MAILER_TRANSPORT);

    const mail = {
        from: Config.DEFAULT_FROM,
        to,
        subject,
        text
    }

    const response = await smtpTransport.sendMail(mail);
    smtpTransport.close();

    return response;
}