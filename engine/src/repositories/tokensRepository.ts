import connect from './db';
import { Token } from 'commons/models/token';
import { ChainId } from 'commons/models/chainId';

async function countTokens(network: ChainId): Promise<number> {
    const db = await connect();

    const tokensCount = await db.tokens.count({
        where: { network }
    });

    return tokensCount
}

async function getToken(id: string): Promise<Token | null> {
    const db = await connect();

    const token = await db.tokens.findUnique({
        where: { id }
    });

    return token
}

async function addToken(token: Token): Promise<Token> {
    if(!token.id) {
        throw new Error("Token id is required");
    }

    const db = await connect();
    const createdToken = await db.tokens.create({
        data: token
    });

    return createdToken;
}

export default {
    countTokens,
    getToken,
    addToken
};