
'use strict';

const { parse } = require('path');
let Patient = require('./Patient.js');
const PrimaryContract = require('./primary-contract.js');

class AdminContract extends PrimaryContract {

    //Returns the last patientId in the set
    async getLatestPatientId(ctx) {
        let allResults = await this.queryAllPatients(ctx);

        return allResults.length;
    }

    //Create patient in the ledger
    async createPatient(ctx, args) {
        args = JSON.parse(args);

        if (args.password === null || args.password === '') {
            throw new Error(`Empty or null values should not be passed for password parameter`);
        }
        console.log("New id:----"+this.getLatestPatientId(ctx)+1);

        let newPatient = await new Patient(args.patientId, args.firstname, args.lastname, args.password, args.age,args.gender,
            args.phonenumber, args.emergencynumber, args.address,args.bloodgroup,args.lefteyepower,args.righteyepower,args.lefteyeimage,args.righteyeimage,args.prescription,args.riskfactors,args.lefteyekeywords,args.righteyekeywords,args.changedby, args.symptoms);
        const exists = await this.patientExists(ctx, newPatient.patientId);
        if (exists) {
            throw new Error(`The patient ${newPatient.patientId} already exists`);
        }
        const buffer = Buffer.from(JSON.stringify(newPatient));
        await ctx.stub.putState(newPatient.patientId, buffer);
    }

    //Read patient details based on patientId
    async readPatient(ctx, patientId) {
        let asset = await super.readPatient(ctx, patientId)

        asset = ({
            patientId: patientId,
            firstname: asset.firstname,
            lastname: asset.lastname,
            phonenumber: asset.phonenumber,
            emergencynumber: asset.emergencynumber
        });
        return asset;
    }

    //Delete patient from the ledger based on patientId
    async deletePatient(ctx, patientId) {
        const exists = await this.patientExists(ctx, patientId);
        if (!exists) {
            throw new Error(`The patient ${patientId} does not exist`);
        }
        await ctx.stub.deleteState(patientId);
    }

    //Read patients based on lastname
    async queryPatientsByLastName(ctx, lastname) {
        let queryString = {};
        queryString.selector = {};
        queryString.selector.docType = 'patient';
        queryString.selector.lastname = lastname;
        const buffer = await this.getQueryResultForQueryString(ctx, JSON.stringify(queryString));
        let asset = JSON.parse(buffer.toString());

        return this.fetchLimitedFields(asset);
    }

    //Read patients based on firstName
    async queryPatientsByFirstName(ctx, firstname) {
        let queryString = {};
        queryString.selector = {};
        queryString.selector.docType = 'patient';
        queryString.selector.firstname = firstname;
        const buffer = await this.getQueryResultForQueryString(ctx, JSON.stringify(queryString));
        let asset = JSON.parse(buffer.toString());

        return this.fetchLimitedFields(asset);
    }

    //Retrieves all patients details
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
module.exports = AdminContract;