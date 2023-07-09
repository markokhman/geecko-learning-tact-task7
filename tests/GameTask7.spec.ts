import { Blockchain, SandboxContract, Treasury } from '@ton-community/sandbox';
import { fromNano, toNano } from 'ton-core';
import { GameTask7 } from '../wrappers/GameTask7';
import '@ton-community/test-utils';

describe('GameTask7', () => {
    let blockchain: Blockchain;
    let gameTask7: SandboxContract<GameTask7>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();
        const deployer = await blockchain.treasury('deployer');

        gameTask7 = blockchain.openContract(await GameTask7.fromInit(deployer.address));

        const deployResult = await gameTask7.send(
            deployer.getSender(),
            {
                value: toNano('0.05'),
            },
            {
                $$type: 'Deploy',
                queryId: 0n,
            }
        );

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: gameTask7.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and gameTask7 are ready to use
    });

    it('should increase counter with secret message', async () => {
        const messager = await blockchain.treasury('deployer');

        const counterBefore = await gameTask7.getBalance();

        const incrementResult = await gameTask7.send(
            messager.getSender(),
            {
                value: toNano('0.05'),
            },
            {
                $$type: 'Secret',
                count: 300n,
            }
        );

        expect(incrementResult.transactions).toHaveTransaction({
            from: messager.address,
            to: gameTask7.address,
            success: true,
        });

        const counterAfter = await gameTask7.getBalance();

        expect(counterAfter).toBe(counterBefore * 300n);
    }),
        it('should fail with error message of forbidden sender', async () => {
            const messager = await blockchain.treasury('forbidden');
            const incrementResult = await gameTask7.send(
                messager.getSender(),
                {
                    value: toNano('0.05'),
                },
                {
                    $$type: 'Secret',
                    count: 300n,
                }
            );

            expect(incrementResult.transactions).toHaveTransaction({
                from: messager.address,
                to: gameTask7.address,
                success: false,
                exitCode: 4429,
            });
        });
});
