import WebSocket, { WebSocketServer } from "ws";
import Config from "./config";
import { IncomingMessage } from "http";
import jwt from 'jsonwebtoken';
import { JWT } from 'commons/models/jwt';

let whitelist = Config.CORS_ORIGIN.split(',');

class PoseidonWS extends WebSocket {
    id: string;

    constructor(address: string) {
        super(address);
        this.id = '';
    }
}

export class PoseidonWSS extends WebSocketServer {
    isConnected(userId: string): boolean {
        if(!this.clients || !this.clients.size) return false;
        return ([...this.clients] as PoseidonWS[]).some(client => client.id === userId);
    }

    getConnections(): string[] {
        if(!this.clients || !this.clients.size) return [];
        return ([...this.clients] as PoseidonWS[]).map(client => client.id);
    }

    direct(userId: string, message: Object) {
        console.log(`Sending a direct message to ${userId}`);
        if(!this.clients || !this.clients.size) return;
        ([...this.clients] as PoseidonWS[]).forEach(client => {
            if(client.id === userId && client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify(message));
                return;
            }
        })
    }

    broadcast(message: Object) {
        if(!this.clients || !this.clients.size) return;
        ([...this.clients] as PoseidonWS[]).forEach(client => {
            if(client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify(message));
            }
        })
    }
}

let wss: PoseidonWSS;

function corsValidation(origin: string) {
    return whitelist[0] === '*' || whitelist.includes(origin);
}

export default (): PoseidonWSS => {
    if(wss) return wss;

    wss = new PoseidonWSS({
        port: Config.WS_PORT,
    });

    wss.on('connection', (ws: PoseidonWS, req: IncomingMessage) => {
        if(!req.url || !req.headers.origin || !corsValidation(req.headers.origin)) {
            throw new Error('CORS Policy');
        };

        const token = req.url.split('token=')[1];
        if (!token) return;
        const decoded = jwt.verify(token, Config.JWT_SECRET) as JWT;
        if(!decoded) return;

        if(!wss.isConnected(decoded.userId)) {
            ws.id = decoded.userId;
            ws.on('message', data => {
                console.log(data);
            });
            ws.on('error', error => {
                console.error(error);
            });
            console.log(`ws.onConnection: ${req.url}`);
        }

    });

    console.log(`Poseidon WebSocket listening on port ${Config.WS_PORT}`);

    return wss;
}