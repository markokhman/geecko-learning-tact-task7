import { toNano } from 'ton-core';
import { GameTask7 } from '../wrappers/GameTask7';
import { NetworkProvider } from '@ton-community/blueprint';

export async function run(provider: NetworkProvider) {
    const gameTask7 = provider.open(await GameTask7.fromInit());

    await gameTask7.send(
        provider.sender(),
        {
            value: toNano('0.05'),
        },
        {
            $$type: 'Deploy',
            queryId: 0n,
        }
    );

    await provider.waitForDeploy(gameTask7.address);

    // run methods on `gameTask7`
}
