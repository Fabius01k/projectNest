// import nodemailer from "nodemailer";
// import {Request, Response, Router} from "express";
//
//
// export const emailAdapter = {
//     async sendEmail(email: string, subject: string, message: string) {
//
//         const transport = nodemailer.createTransport({
//             host: 'smtp.yandex.ru',
//             // port: 465,
//             // secure: true,
//             auth: {
//                 user: "pav.murashckin@yandex.ru",
//                 pass: "nhrdmesfbmhzfktd",
//             },
//         })
//
//         let info = await transport.sendMail({
//             from: 'Pavel <pav.murashckin@yandex.ru>',
//             to: email,
//             subject: subject,
//             html: message,
//         })
//
//         return info
//     },
//
// }

// const transport = nodemailer.createTransport({
//     service: 'google',
//     host: 'smtp.gmail.com',
//     port: 465,
//     secure: true,
//     auth: {
//         user: "muraskinpavel5@gmail.com",
//         pass: "P14v22p18j4aP",
//     },
// })
