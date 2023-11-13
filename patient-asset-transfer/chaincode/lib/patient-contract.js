
'use strict';
let Patient = require('./Patient.js');
const crypto = require('crypto');
const PrimaryContract = require('./primary-contract.js');
const { Context } = require('fabric-contract-api');

class PatientContract extends PrimaryContract {

    //Read patient details based on patientId
    async readPatient(ctx, patientId) {
        return await super.readPatient(ctx, patientId);
    }

    //Delete patient from the ledger based on patientId
    async deletePatient(ctx, patientId) {
        const exists = await this.patientExists(ctx, patientId);
        if (!exists) {
            throw new Error(`The patient ${patientId} does not exist`);
        }
        await ctx.stub.deleteState(patientId);
    }

    //This function is to update patient personal details. This function should be called by patient.
    async updatePatientPersonalDetails(ctx, args) {
        args = JSON.parse(args);
        let isDataChanged = false;
        let patientId = args.patientId;
        let newfirstname = args.firstname;
        let newlastname = args.lastname;
        let newAge = args.age;
        let updatedBy = args.changedby;
        let newphonenumber = args.phonenumber;
        let newEmergphonenumber = args.emergencynumber;
        let newAddress = args.address;
       

        const patient = await this.readPatient(ctx, patientId)
        if (newfirstname !== null && newfirstname !== '' && patient.firstname !== newfirstname) {
            patient.firstname = newfirstname;
            isDataChanged = true;
        }

        if (newlastname !== null && newlastname !== '' && patient.lastname !== newlastname) {
            patient.lastname = newlastname;
            isDataChanged = true;
        }

        if (newAge !== null && newAge !== '' && patient.age !== newAge) {
            patient.age = newAge;
            isDataChanged = true;
        }

        

        if (newphonenumber !== null && newphonenumber !== '' && patient.phonenumber !== newphonenumber) {
            patient.phonenumber = newphonenumber;
            isDataChanged = true;
        }

        if (newEmergphonenumber !== null && newEmergphonenumber !== '' && patient.emergencynumber !== newEmergphonenumber) {
            patient.emergencynumber = newEmergphonenumber;
            isDataChanged = true;
        }

        if (newAddress !== null && newAddress !== '' && patient.address !== newAddress) {
            patient.address = newAddress;
            isDataChanged = true;
        }

        
        if (isDataChanged === false) return;
         patient.changedby=args.patientId;
        const buffer = Buffer.from(JSON.stringify(patient));
        await ctx.stub.putState(patientId, buffer);
    }

    //This function is to update patient password. This function should be called by patient.
    async updatePatientPassword(ctx, args) {
        args = JSON.parse(args);
        let patientId = args.patientId;
        let newPassword = args.newPassword;

        if (newPassword === null || newPassword === '') {
            throw new Error(`Empty or null values should not be passed for newPassword parameter`);
        }
        console.log(newPassword);
        const patient = await this.readPatient(ctx, patientId);
        patient.password = crypto.createHash('sha256').update(newPassword).digest('hex');
        if(patient.pwdTemp){
            patient.pwdTemp = false;
            patient.changedby = patientId;
        }
        const buffer = Buffer.from(JSON.stringify(patient));
        await ctx.stub.putState(patientId, buffer);
    }

    //Returns the patient's password
    async getPatientPassword(ctx, patientId) {
        let patient = await this.readPatient(ctx, patientId);
        patient = ({
            password: patient.password,
            pwdTemp: patient.pwdTemp})
            console.log("Pwd: "+ patient.password);
        return patient;
    }

    //Retrieves patient medical history based on patientId
    async getPatientHistory(ctx, patientId) {
        let resultsIterator = await ctx.stub.getHistoryForKey(patientId);
        let asset = await this.getAllPatientResults(resultsIterator, true);

        return this.fetchLimitedFields(asset, true);
    }

    fetchLimitedFields = (asset, includeTimeStamp = false) => {
        for (let i = 0; i < asset.length; i++) {
            const obj = asset[i];
            asset[i] = {
                patientId: obj.Key,
                firstname: obj.Record.firstname,
                lastname: obj.Record.lastname,
                age: obj.Record.age,
                address: obj.Record.address,
                phonenumber: obj.Record.phonenumber,
                emergencynumber: obj.Record.emergencynumber,
                bloodgroup: obj.Record.bloodgroup,
                lefteyeimage: obj.Record.lefteyeimage,
                righteyeimage:obj.Record.righteyeimage,
                lefteyepower: obj.Record.lefteyepower,
                righteyepower: obj.Record.righteyepower,
                riskfactors: obj.Record.riskfactors,
                prescription:obj.Record.prescription,
                examinationdate: obj.Record.examinationdate,
                changedby: obj.Record.changedb,
                symptoms: obj.Record.symptoms,
                output: obj.Record.output
            };
            if (includeTimeStamp) {
                asset[i].changedby = obj.Record.changedby;
                asset[i].Timestamp = obj.Timestamp;
            }
        }

        return asset;
    };

    
    async grantAccessToDoctor(ctx, args) {
        args = JSON.parse(args);
        let patientId = args.patientId;
        let doctorId = args.doctorId;
        console.log("P: "+patientId+ "d: "+doctorId);
        
        // Get the patient asset from world state
        const patient = await this.readPatient(ctx, patientId);
       console.log(patient);
       // console.log("*****IN PC: P DID: "+patient.permissiongranted[0]);
        // unique doctorIDs in permissiongranted
        if (!patient.permissiongranted.includes(doctorId)) {            
            patient.permissiongranted.push(doctorId);
            patient.changedby = patientId;
        }
        const buffer = Buffer.from(JSON.stringify(patient));
        // Update the ledger with updated permissiongranted
        await ctx.stub.putState(patientId, buffer);
    };

    async revokeAccessFromDoctor(ctx, args) {
        args = JSON.parse(args);
        let patientId = args.patientId;
        let doctorId = args.doctorId;

        // Get the patient asset from world state
        const patient = await this.readPatient(ctx, patientId);
        // Remove the doctor if existing
        if (patient.permissiongranted.includes(doctorId)) {
            patient.permissiongranted = patient.permissiongranted.filter(doctor => doctor !== doctorId);
            patient.changedby = patientId;
        }
        const buffer = Buffer.from(JSON.stringify(patient));
        // Update the ledger with updated permissiongranted
        await ctx.stub.putState(patientId, buffer);
    };
}
module.exports = PatientContract;