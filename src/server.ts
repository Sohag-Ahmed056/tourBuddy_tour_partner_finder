import { Server } from 'http';
import http from 'http'; // <-- Import the http module
import app from './app.js';
import config from './config/index.js';
import { initSocket } from './socket.js'; // <-- Import the socket initializer

async function bootstrap() {
    let server: Server; // This will now correctly hold the HTTP server instance
    const port = config.port;

    // 1. Create the HTTP server from the Express app
    const httpServer = http.createServer(app); 

    // 2. Initialize Socket.io by attaching it to the HTTP server
    initSocket(httpServer);

    try {
        // 3. Start the server (using httpServer, not app.listen)
        server = httpServer.listen(port, () => { 
            console.log(`🚀 Server is running on http://localhost:${port}`);
        });

        // Function to gracefully shut down the server
        const exitHandler = () => {
            if (server) {
                server.close(() => {
                    console.log('Server closed gracefully.');
                    // Exit gracefully after the server stops accepting new connections
                    process.exit(0); // Exit with a success code (0) for graceful exit
                });
            } else {
                process.exit(1);
            }
        };

        // Handle unhandled promise rejections
        process.on('unhandledRejection', (error) => {
            console.log('Unhandled Rejection is detected, closing server...');
            // Close the server and then exit if a rejection occurs
            if (server) {
                server.close(() => {
                    console.error(error);
                    process.exit(1);
                });
            } else {
                process.exit(1);
            }
        });
        
        // Handle SIGTERM (used by hosting environments like Heroku/Vercel)
        process.on('SIGTERM', () => {
            console.log('SIGTERM received. Shutting down gracefully.');
            exitHandler();
        });

    } catch (error) {
        console.error('Error during server startup:', error);
        process.exit(1);
    }
}

bootstrap();