const app = require('./app')
const port = process.env.PORT
const multer = require('multer')
const path =require('path')
const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const methodOverride = require('method-override');
const crypto = require('crypto');
const mongoose = require('mongoose');


/*const mongoURI= 'mongodb://localhost:27017/?readPreference=primary&appname=MongoDB%20Compass&ssl=false';
const conn = mongoose.createConnection(mongoURI);

let gfs;
conn.once('open' , () => {
    gfs = Grid(conn.db, mongoose.mongo)
    gfs.collection('uploads');
});


const storage = new GridFsStorage({
    url:mongoURI,
    file: (req, file) => {
        return new Promise((resolve, reject) => {
            crypto.randomBytes(16, (err, buf) => {
                if(err) {
                    return reject(err);
                }
                const filename = buf.toString('hex') + path.extname(file.originalname);
                const fileInfo = {
                    filename: filename,
                    bucketName: 'uploads'
                }
                resolve(fileInfo)
            })
        })
    }
})

const upload = multer({ storage });

app.post('uploadfile', upload.single('file'), (req, res) => {
    res.redirect('/');
})*/

app.listen(port, () => {
    console.log('Server is up on port '+port)

})