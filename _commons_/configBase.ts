import * as dotenv from 'dotenv';
dotenv.config();

export default class ConfigBase {
    // system
    static NODE_ENV: string = `${process.env.NODE_ENV || "development"}`;
    static DEV_ENV: boolean = ConfigBase.NODE_ENV === "development";
    static SITE_URL: string = `${process.env.SITE_URL || "http://localhost:3000"}`;
    static MAILER_TRANSPORT: string = `${process.env.MAILER_TRANSPORT}`;
    static MAILER_USER: string = `${process.env.MAILER_USER}`;
    static MAILER_PASS: string = `${process.env.MAILER_PASS}`;
    static MAILER_HOST: string = `${process.env.MAILER_HOST}`;
    static MAILER_PORT: number = parseInt(`${process.env.MAILER_PORT}`);
    static DEFAULT_FROM: string = ConfigBase.getDefaultFrom(ConfigBase.MAILER_TRANSPORT);
    static SWAP_GRAPH_URL: string = `${process.env.SWAP_GRAPH_URL}`;
    static SWAP_ROUTER: string = `${process.env.SWAP_ROUTER}`;

    // database 
    static DATABASE_URL: string = `${process.env.DATABASE_URL}`;

    // blockchain
    static POSEIDON_PAY_CONTRACT: string = `${process.env.POSEIDON_PAY_CONTRACT}`;
    static RPC_NODE: string = `${process.env.RPC_NODE || "http://127.0.0.1:8545"}`;
    static ADMIN_PRIVATE_KEY: string = `${process.env.ADMIN_PRIVATE_KEY}`;

    // security
    static CORS_ORIGIN: string = `${process.env.CORS_ORIGIN || "*"}`;
    static JWT_SECRET: string = `${process.env.JWT_SECRET}`;
    static JWT_EXPIRES: number = parseInt(`${process.env.JWT_EXPIRES}`);
    static AES_KEY: string = `${process.env.AES_KEY}`;

    static getDefaultFrom(transport: string): string {
        if(!transport) return '';
        const spl = transport.split('//');
        return spl[spl.length - 1].split(':')[0];
    }
}