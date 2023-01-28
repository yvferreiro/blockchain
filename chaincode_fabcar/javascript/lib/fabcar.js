/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Contract } = require('fabric-contract-api');

class FabCar extends Contract {

    async initLedger(ctx) {
        console.info('============= START : Initialize Ledger ===========');
        const diamonds = [
            {
                digitalid: '001',
                minername: 'John Appleseed',
                miningdate: 'January 5 2021',
                mininglocation: 'South Africa',
            },
            {
                digitalid: '002',
                minername: 'Sam Smith',
                miningdate: 'January 9 2021',
                mininglocation: 'Russia',
            },
            {
                digitalid: '003',
                minername: 'Frederick Japp',
                miningdate: 'February 7 2021',
                mininglocation: 'South Africa',
            },
            {
                digitalid: '004',
                minername: 'Liam Neeson',
                miningdate: 'March 8 2021',
                mininglocation: 'Botswana',
            },
            {
                digitalid: '005',
                minername: 'Elon Tusk',
                miningdate: 'April 4 2021',
                mininglocation: 'Canada',
            },
            {
                digitalid: '006',
                minername: 'Parry Sound',
                miningdate: 'April 27 2021',
                mininglocation: 'South Africa',
            },
            {
                digitalid: '007',
                minername: 'Bobby Hull',
                miningdate: 'May 16 2021',
                mininglocation: 'Canada',
            },
            {
                digitalid: '008',
                minername: 'Jerry Orange',
                miningdate: 'June 5 2021',
                mininglocation: 'Botswana',
            },
            {
                digitalid: '009',
                minername: 'Yolanda Ferreiro',
                minindate: 'July 29 2021',
                mininglocation: 'Botswana',
            },
            {
                digitalid: '010',
                minername: 'Holden Caufield',
                miningdate: 'August 14 2021',
                mininglocation: 'Canada',
            },
        ];

        for (let i = 0; i < diamonds.length; i++) {
            diamonds[i].docType = 'dia';
            await ctx.stub.putState('DIA' + i, Buffer.from(JSON.stringify(diamonds[i])));
            console.info('Added <--> ', diamonds[i]);
        }
        console.info('============= END : Initialize Ledger ===========');
    }

    async queryDiamond(ctx, diaNumber) {
        const diaAsBytes = await ctx.stub.getState(diaNumber); // get the car from chaincode state
        if (!diaAsBytes || diaAsBytes.length === 0) {
            throw new Error(`${diaNumber} does not exist`);
        }
        console.log(diaAsBytes.toString());
        return diaAsBytes.toString();
    }

    async createDiamond(ctx, diaNumber, minername, miningdate, digitalid, mininglocation) {
        console.info('============= START : Create Diamond ===========');

        const dia = {
            digitalid,
            docType: 'dia',
            minername,
            miningdate,
            mininglocation,
        };

        await ctx.stub.putState(diaNumber, Buffer.from(JSON.stringify(dia)));
        console.info('============= END : Create Diamond ===========');
    }

    async queryAllDiamonds(ctx) {
        const startKey = 'DIA0';
        const endKey = 'DIA999';

        const iterator = await ctx.stub.getStateByRange(startKey, endKey);

        const allResults = [];
        while (true) {
            const res = await iterator.next();

            if (res.value && res.value.value.toString()) {
                console.log(res.value.value.toString('utf8'));

                const Key = res.value.key;
                let Record;
                try {
                    Record = JSON.parse(res.value.value.toString('utf8'));
                } catch (err) {
                    console.log(err);
                    Record = res.value.value.toString('utf8');
                }
                allResults.push({ Key, Record });
            }
            if (res.done) {
                console.log('end of data');
                await iterator.close();
                console.info(allResults);
                return JSON.stringify(allResults);
            }
        }
    }

    async changeDiamondOwner(ctx, diaNumber, newOwner) {
        console.info('============= START : changeDiamondOwner ===========');

        const diaAsBytes = await ctx.stub.getState(diaNumber); // get the car from chaincode state
        if (!diaAsBytes || diaAsBytes.length === 0) {
            throw new Error(`${diaNumber} does not exist`);
        }
        const dia = JSON.parse(diaAsBytes.toString());
        dia.owner = newOwner;

        await ctx.stub.putState(diaNumber, Buffer.from(JSON.stringify(dia)));
        console.info('============= END : changeDiamondOwner ===========');
    }

}

module.exports = FabCar;
