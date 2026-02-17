import app from '../backend/server.js';

export default (req, res) => {
    // Clear any existing listeners to prevent leaks in serverless warm starts
    return app(req, res);
};
