import Config from './config';
import { getCustomers, getCustomerNextPayment, pay } from 'commons/services/poseidonPayService';
import usersRepository from './repositories/usersRepository';
import { Status } from 'commons/models/status';
import sendMail from './services/mailService';

async function executionCycle() {
    console.log("Executing payment cycle...");
    
    const customers = await getCustomers();
    console.log(`${customers.length} customers loaded.`);

    for (let i = 0; i < customers.length; i++) {
        const customerAddress = customers[0];
        if(/0x0+/.test(customerAddress)) continue;

        const nextPayment = await getCustomerNextPayment(customerAddress); // timestamp in seconds
        if(nextPayment > Date.now() / 1000) continue; // Date.now is timestamp in milliseconds

        try {
            console.log(`Charging customer ${customerAddress}`);
            await pay(customerAddress);
        } catch (error) {
            const user = await usersRepository.updateUserStatus(customerAddress, Status.BLOCKED);
            if (!user) continue;

            await sendMail(user.email, "Poseidon - Account blocked", `
                    Hi, ${user.name}!

                    You acccount was blocked due to  insufficient balance or allowance.
                    Please, click in the link below (or copy-paste in the browser) to update you payment info.

                    ${Config.SITE_URL}/pay/${user.address}

                    See ya!

                    Admin.
                `);
        }
    }
}

export default () => {
    setInterval(executionCycle, Config.CHARGE_INTERVAL);
    executionCycle();
    console.log("Poseidon Pay started");
}