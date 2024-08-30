const express = require('express');
const socketIoClient = require('socket.io-client');
const fs = require('fs');
const path = require('path');

const router = express.Router();
const YOUR_SOCKET_SERVER_PORT = 8080;

// Define the route to trigger socket events
router.post('/test-socket', async (req, res) => {
  try{  
        // Check if a file is included in the request
        // if (!req.files || !req.files.file) {
        //     return res.status(400).json({ error: 'No file uploaded' });
        // }

        // Extract the file data from the request
        const file = req.files.file;
        console.log("hii")

        // Create a socket connection to the server
        const socket = socketIoClient(`http://localhost:${YOUR_SOCKET_SERVER_PORT}`);

        // Emit the file to the socket server
        socket.emit('uploadFile', { file, type: req.body.type || 'image' });

        // Listen for events from the socket server
        socket.on('uploadStarted', (data) => {
            console.log('Upload started:', data);
        });

        socket.on('chunkUploaded', (data) => {
            console.log('Chunk uploaded:', data);
        });

        socket.on('uploadComplete', (data) => {
            console.log('Upload complete:', data);
            res.status(200).json(data);
            socket.disconnect(); // Disconnect from the socket server after receiving response
        });

        socket.on('uploadError', (error) => {
            console.error('Upload error:', error);
            res.status(500).json({ error: 'Upload error', details: error });
            socket.disconnect(); // Disconnect from the socket server on error
        });
    }
    catch(error){
    res.status(400).send(error)
    }
});

module.exports = router;