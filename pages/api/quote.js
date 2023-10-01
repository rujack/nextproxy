import { NextRequest, NextResponse } from 'next/server'
import cors from 'edge-cors';

export const config = {
    runtime: 'edge',
}


export default async function handler(req = NextRequest, res = NextResponse) {
    const apiUrl = "https://api.1inch.dev/swap/v5.2/56/quote";

    cors(req, res, {
        methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
        origin: '*',
        optionsSuccessStatus: 200,
    })

    const url = new URL(req.url)
    const query = new URLSearchParams(url.search);
    const src = query.get("src");
    const dst = query.get("dst");
    const amount = query.get("amount");

    const params = {
        src: src,
        dst: dst,
        amount: amount,
    };

    const queryString = Object.keys(params)
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
        .join('&');


    const token = req.headers.get("Authorization");

    const apiUrlWithParams = `${apiUrl}?${queryString}`;


    try {
        const response = await fetch(apiUrlWithParams, {
            mode: 'cors',
            headers: {
                Authorization: token,
            },
        });

        switch (response.status) {
            case 401:
                return cors(req, new Response(JSON.stringify({ statusCode: 401, description: "Unauthorized" }), {
                    status: 401,
                    headers: {
                        'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
                    },
                }));
            case 429:
                return new Response(JSON.stringify({ statusCode: 429, description: "Too Many Requests" }), {
                    status: 429,
                    headers: {
                        'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
                    },
                });
            case 400:
                return new Response(JSON.stringify({ statusCode: 400, description: "Insufficient liquidity" }), {
                    status: 400,
                    headers: {
                        'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
                    },
                });
        }

        const data = await response.json();
        // console.log(data);
        return new Response(JSON.stringify(data), {
            status: response.status,
            headers: {
                'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            },
        });
    } catch (error) {
        // console.error(error);
        return new Response(JSON.stringify({ statusCode: 500, description: "Internal Server Error" }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            },
        });
    }
}