import axios from 'axios';
import NextCors from 'nextjs-cors';


export default async function handler(req, res) {
    try {
        await NextCors(req, res, {
            methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
            origin: '*',
            optionsSuccessStatus: 200, 
         });

        const apiUrl = 'https://api.1inch.dev/swap/v5.2/56/quote';
        const params = {
            src: req.query.src,
            dst: req.query.dst,
            amount: req.query.amount,
        };
        const token = req.headers;
        const headers = {
            Authorization: token.authorization,
        };

        const response = await axios.get(apiUrl, { params, headers });

        res.json(response.data);
    } catch (error) {
        if (error.response.status == 401) {
            res.status(error.response.status).json({
                "statusCode": error.response.status,
                "description": "Unauthorized"
            });
        }
        else if (error.response.status == 400) {
            res.status(error.response.status).json(error.response.data);
        } else if (error.response.status == 429) {
            res.status(error.response.status).json({
                "statusCode": error.response.status,
                "description": "Too Many Requests"
            })
        }
        else {
            res.status(500).json({ error:"Internal Server Error" });
        }
        // res.status(400).json(error.response)
    }
}