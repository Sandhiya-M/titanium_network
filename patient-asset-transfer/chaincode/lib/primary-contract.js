'use strict';
const { Contract } = require('fabric-contract-api');
let Patient = require('./Patient.js');
let initPatients = require('./initLedger.json');
class PrimaryContract extends Contract {
    async initLedger(ctx) {
        console.log('============= START : Initialize Ledger ===========');
        for (let i = 0; i < initPatients.length; i++) {
            initPatients[i].docType = 'patient';
            await ctx.stub.putState('PID' + i, Buffer.from(JSON.stringify(initPatients[i])));
            console.info('Added <--> ', initPatients[i]);
        }
        console.log('============= END : Initialize Ledger ===========');
    }
    async readPatient(ctx, patientId) {
        const exists = await this.patientExists(ctx, patientId);
        if (!exists) {
            throw new Error(`The patient ${patientId} does not exist`);
        }
        const buffer = await ctx.stub.getState(patientId);
        let asset = JSON.parse(buffer.toString());
        asset = ({
            patientId: patientId,
            firstname: asset.firstname,
            lastname: asset.lastname,
            age: asset.age,
            gender: asset.gender,
            phonenumber: asset.phonenumber,
            emergencynumber: asset.emergencynumber,
            address: asset.address,
            bloodgroup: asset.bloodgroup,
            righteyepower: asset.righteyepower,
            lefteyepower: asset.lefteyepower,
            prescription: asset.prescription,
            symptoms: asset.symptoms,
            riskfactors: asset.riskfactors,
            lefteyekeywords: asset.lefteyekeywords,
            righteyekeywords: asset.righteyekeywords,
            examinationdate: asset.examinationdate,
            password: asset.password,
            permissiongranted: asset.permissiongranted,
            pwdTemp:asset.pwdTemp,
            changedby:asset.changedby         
        });
        return asset;
    }
    async patientExists(ctx, patientId) {
        const buffer = await ctx.stub.getState(patientId);
        return (!!buffer && buffer.length > 0);
    }
    async getQueryResultForQueryString(ctx, queryString) {
        let resultsIterator = await ctx.stub.getQueryResult(queryString);
        console.info('getQueryResultForQueryString <--> ', resultsIterator);
        let results = await this.getAllPatientResults(resultsIterator, false);
        return JSON.stringify(results);
    }
    async getAllPatientResults(iterator, isHistory) {
        let allResults = [];
        while (true) {
            let res = await iterator.next();
            if (res.value && res.value.value.toString()) {
                let jsonRes = {};
                console.log(res.value.value.toString('utf8'));

                if (isHistory && isHistory === true) {
                    jsonRes.Timestamp = res.value.timestamp;
                }
                jsonRes.Key = res.value.key;
                try {
                    jsonRes.Record = JSON.parse(res.value.value.toString('utf8'));
                } catch (err) {
                    console.log(err);
                    jsonRes.Record = res.value.value.toString('utf8');
                }
                allResults.push(jsonRes);
            }
            if (res.done) {
                console.log('end of data');
                await iterator.close();
                console.info(allResults);
                return allResults;
            }
        }
    }
    async queryAllPatients(ctx) {
        let resultsIterator = await ctx.stub.getStateByRange('', '');
        let asset = await this.getAllPatientResults(resultsIterator, false);

        return this.fetchLimitedFields(asset);
    }

    fetchLimitedFields = asset => {
        for (let i = 0; i < asset.length; i++) {
            const obj = asset[i];
            asset[i] = {
                patientId: obj.Key,
                firstname: obj.Record.firstname,
                lastname: obj.Record.lastname,
                phonenumber: obj.Record.phonenumber,
                emergencynumber: obj.Record.emergenynumber
            };
        }

        return asset;
    }
    
}
module.exports = PrimaryContract;