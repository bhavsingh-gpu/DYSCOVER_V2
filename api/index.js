import app from '../backend/server.js';

export default function handler(req, res) {
    // Bridge the request to the Express app
    return app(req, res);
}
