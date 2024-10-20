import nodemailer, {Transporter} from "nodemailer"
import dotenv from 'dotenv';
import ejs from "ejs"

dotenv.config();
const transporter: Transporter = nodemailer.createTransport({
	service: "gmail",
	host: "smtp.gmail.com",
	port: 587,
	secure: false, // use TLS
	auth: {
            type: 'OAuth2',
            user: process.env.EMAIL_USERNAME,
            clientId: process.env.CLIENT_ID,
            clientSecret:  process.env.CLIENT_SECRET,
            refreshToken: process.env.REFRESH_TOKEN,
            accessToken: process.env.ACCESS_TOKEN,
  
	}
})
// const transporter: Transporter = nodemailer.createTransport({

// 	host: "mxslurp.click",
// 	port: 2525,
// 	secure: false, // use TLS
// 	auth: {  
//             user: "user-fdf27e0d-dcf7-402e-8a1f-e78b9f43bdbf@mailslurp.net",
//             pass:"RfiGtXyqQq2M1gRq0POa57MbKYjTkukQ"
  
// 	}
// })


const buildHTML = (path:string, data:any = {}) => {
	return new Promise((resolve, reject) => {
		ejs.renderFile(__dirname=`views/emails/${path}.ejs`, data, async (err:any, html:string) => {
			if (err) {
				console.log(err)
				reject(err)
			} else {
				resolve(html)
			}
		})
	})
}

const sendEmailService = async ({ to, data, path, subject, from = 'mopos25@gmail.com' }:{to:string; data:any; path:string; subject:string, from:string}) => {
	try {
		const html :any = await buildHTML(path, data)
        console.log(to, data, path, subject, from )
	const rests =	await transporter.sendMail({
			to,
			from:from,
			subject,
			html
		})
		console.log(rests )
       return rests
	} catch (error:any) {
		console.log(error)
		if (error.response) {
			// console.log(error.response.body)
		}
	}
}

export default sendEmailService