import connect from './db';
import { Status } from 'commons/models/status';
import { User } from 'commons/models/user';
import { decrypt } from 'commons/services/cryptoService';


async function updateUserStatus(address: string, status: Status): Promise<User> {
    const db = await connect();

    const user = await db.users.update({
        where: { address },
        data: { status }
    });

    return user;
}

async function getUserById(userId: string): Promise<User | null> {
    const db = await connect();

    const user = await db.users.findUnique({
        where: { id: userId }
    });

    if(!user) return null;

    if(user.privateKey) {
        user.privateKey = decrypt(user.privateKey);
    }

    return user;
}

export default {
    updateUserStatus,
    getUserById
};