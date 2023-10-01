import cors from 'cors';

export const config = {
  runtime: 'edge',
}

export default function handler(req, res) {
  return new Response(JSON.stringify( 'Nextjs Proxy Nih BOSS!!' ), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  })

}