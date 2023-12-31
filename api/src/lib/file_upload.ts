import multer from "multer"
import { v4 as uuid } from "uuid"
import { PATH } from "./env"

const storage = multer.diskStorage({
	destination: function(req, file, cb) {
		cb(null, PATH.UPLOAD)
	},
	filename: function (req, file, cb) {
    const name = uuid()
    const ext = file.originalname.split('.').pop()
    const theFilename = `${name}.${ext}`

    file.filename = theFilename

    cb(null, theFilename)
  }
})

export const upload = multer({ storage })

export type FileObject = {
	image: Express.Multer.File[],
	audio: Express.Multer.File[],
	video: Express.Multer.File[],
}