const socketIo = require('socket.io');
const fs = require('fs');
const io = socketIo();
const Upload = require("../models/upload");
const path = require('path');
const UPLOADS_FOLDER = path.join(__dirname, '../uploads');
console.log(UPLOADS_FOLDER)

// Socket.IO connection
io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('uploadFile', (file, type) => {
    if (type === 'video') {
      handleVideoUpload(socket, file);
    } else if (type === 'image') {
      handleImageUpload(socket, file);
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

// Function to handle video uploads
function handleVideoUpload(socket, file) {
  const upload = new Upload({
    filename: file.filename,
    type: 'video',
    status: 'in-progress', 
    bytesRead: 0 // Initialize bytesRead to 0
  });
  upload.save()
    .then(() => {
      socket.emit('uploadStarted', { filename: file.filename });

      const fileSize = fs.statSync(file.path).size;
      const chunkSize = Math.ceil(fileSize / 5); // Divide file into 5 parts

      let bytesRead = 0;
      const readStream = fs.createReadStream(file.path, { highWaterMark: chunkSize });

      readStream.on('data', (chunk) => {
        bytesRead += chunk.length;
        socket.emit('chunkUploaded', { chunk, bytesRead, fileSize });
      });

      readStream.on('end', () => {
        const uploadUrl = `http://localhost:8080/uploads/${file.filename}`;
        socket.emit('uploadComplete', { filename: file.filename, uploadUrl });
        Upload.findOneAndUpdate({ filename: file.filename }, { status: 'completed', bytesRead: fileSize })
          .then(() => console.log('Upload status updated in database'))
          .catch(err => {
            console.error('Error updating upload status in database:', err);
            socket.emit('uploadError', { filename: file.filename, error: 'Error updating upload status in database' });
          });
      });

      socket.on('pauseUpload', () => {
        readStream.pause();
        // Save bytesRead to the database
        Upload.findOneAndUpdate({ filename: file.filename }, { bytesRead })
          .then(() => console.log('Upload paused, bytesRead saved to database'))
          .catch(err => {
            console.error('Error saving bytesRead to database:', err);
            socket.emit('uploadError', { filename: file.filename, error: 'Error saving bytesRead to database' });
          });
      });

      socket.on('resumeUpload', () => {
        readStream.resume();
        // Retrieve bytesRead from the database and seek to that position
        Upload.findOne({ filename: file.filename })
          .then((uploadData) => {
            if (uploadData) {
              bytesRead = uploadData.bytesRead;
              readStream.seek(bytesRead);
            }
          })
          .catch(err => {
            console.error('Error retrieving bytesRead from database:', err);
            socket.emit('uploadError', { filename: file.filename, error: 'Error retrieving bytesRead from database' });
          });
      });

      socket.on('cancelUpload', () => {
        readStream.destroy();
        Upload.deleteOne({ filename: file.filename })
          .then(() => console.log('Upload cancelled and removed from database'))
          .catch(err => {
            socket.emit('uploadError', { filename: file.filename, error: 'Error deleting upload from database' });
            console.error('Error deleting upload from database:', err);
          });
      });
    })
    .catch(err => {
        console.error('Error saving upload details to database:', err);
        socket.emit('uploadError', { filename: file.filename, error: 'Error saving upload details to database' });
    });
}


function handleImageUpload(socket, file) {
    const uploadFolder = path.join(__dirname, 'uploads'); // Specify the upload folder
  
    const uploadPath = path.join(uploadFolder, file.filename);
  
    fs.writeFile(uploadPath, file.buffer, (err) => {
      if (err) {
        console.error('Error uploading image:', err);
        socket.emit('uploadError', { filename: file.filename, error: 'Error uploading image' });
      } else {
        const uploadUrl = `http://localhost:8080/uploads/${file.filename}`;
        socket.emit('uploadComplete', { filename: file.filename, uploadUrl });
      }
    });
  }
module.exports = io;
