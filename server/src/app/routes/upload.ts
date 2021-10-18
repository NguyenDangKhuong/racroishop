import express from 'express'
import cloudinary from 'cloudinary'
import multer from 'multer'
const route = express.Router()

const storage = multer.diskStorage({
  filename: function (_req: any, file: any, cb: any) {
    cb(null, file.fieldname + '-' + Date.now())
  }
})
const upload = multer({ storage })

cloudinary.v2.config({
  cloud_name: 'ndk',
  api_key: '289726382347229',
  api_secret: '1ZVIqT3UPAOt3nBjlW5go0cW640'
})

//upload nhiều file cùng lúc
route.post('/upload', upload.array('files', 10), async (req, res) => {
  try {
    const imageFiles = req.files
    //Check if files exist
    if (!imageFiles)
      return res.status(400).json({ message: 'Không có hình được thêm!' })
    //map through images and create a promise array using cloudinary upload function
    const multiplePicturePromise = Array.from(imageFiles).map(image =>
      cloudinary.v2.uploader.upload(
        image.path,
        {
          folder: 'racroishop/products/'
        }
        // callback function
        // function (error, result) {
        //   console.log(result, error)
        // }
      )
    )

    // await all the cloudinary upload functions in promise.all, exactly where the magic happens
    const imageResponses = await Promise.all(multiplePicturePromise)
    return res.status(200).json({ images: imageResponses })
  } catch (error) {
    return res.status(500).json({
      message: error
    })
  }
})

route.post('/delete', (req, res) => {
  try {
    const publicId = req.body.publicId
    cloudinary.v2.uploader.destroy(publicId)
    return res.status(200).json({
      status: 'success',
      message: 'Sản phẩm đã bị xoá'
    })
  } catch (error) {
    return res.status(500).json({
      message: error
    })
  }
})

// upload 1 file duy nhat
// uploadRoute.post('/uploadfile', upload.single('myFile'), (req, res, next) => {
//   const file = req.file
//   if (!file) {
//     const error = new Error('Please upload a file')
//     error.httpStatusCode = 400
//     return next(error)
//   }
//   res.send(file)
// })

export default route
