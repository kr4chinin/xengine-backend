import express from 'express'
import cors from 'cors'
import fileUpload from 'express-fileupload'
import { config } from 'dotenv'
import models from './models/index.js'
import sequelize from './db.js'
import apiRouter from './routes/index.js'
import { __dirname } from './helpers/dirname.js'
import path from 'path'

config()

const PORT = process.env.PORT || 5000

const app = express()

app.use(cors())
app.use(express.json())
app.use(fileUpload({}))

// To make server understand static files
app.use(express.static(path.resolve(__dirname, '..', 'static')))

app.use('/api', apiRouter)

app.get('/', (_, res) => {
	res.status(200).json({
		message: 'Server is working!'
	})
})

const start = async () => {
	try {
		await sequelize.authenticate()
		await sequelize.sync()
		app.listen(PORT, () => {
			console.log(`Server is running on port ${PORT}...`)
		})
	} catch (e) {
		console.log(e)
	}
}

start()
