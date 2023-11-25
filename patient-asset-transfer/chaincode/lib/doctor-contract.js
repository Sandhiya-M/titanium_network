
'use strict';

let Patient = require('./Patient.js');
const AdminContract = require('./admin-contract.js');
const PrimaryContract = require("./primary-contract.js");
const { Context } = require('fabric-contract-api');

class DoctorContract extends AdminContract {

    //Read patient details based on patientId
    async readPatient(ctx, patientId) {

        let asset = await PrimaryContract.prototype.readPatient(ctx, patientId)

        // Get the doctorID, retrieves the id used to connect the network
        const doctorId = await this.getClientId(ctx);
        // Check if doctor has the permission to read the patient
        const permissionArray = asset.permissiongranted;
        if(!permissionArray.includes(doctorId)) {
            throw new Error(`The doctor ${doctorId} does not have permission to patient ${patientId}`);
        }
        asset = ({
            patientId: patientId,
            firstname: asset.firstname,
            lastname: asset.lastname,
            age: asset.age,
            bloodgroup: asset.bloodgroup,
            righteyepower: asset.righteyepower,
            lefteyepower: asset.lefteyepower,
            prescription: asset.prescription,
            symptoms: asset.symptoms,
            riskfactors: asset.riskfactors,
            lefteyekeywords: asset.lefteyekeywords,
            righteyekeywords: asset.righteyekeywords,
            lefteyeimage:asset.lefteyeimage,
            righteyeimage:asset.righteyeimage,
            examinationdate: asset.examinationdate,
            chanedby: asset.chanedby,
            gender: asset.gender,
            output:asset.output
        });
        return asset;
    }
    //This function is to update patient medical details. This function should be called by only doctor.
    async updatePatientMedicalDetails(ctx, args) {
        args = JSON.parse(args);
        let isDataChanged = false;
        let patientId = args.patientId;
        let newrighteyepower=args.righteyepower;
        let newlefteyepower=args.lefteyepower;
        let newprescription=args.prescription;
        let newsymptoms=args.symptoms;
        let newriskfactors=args.riskfactors;
        let newlefteyekeywords=args.lefteyekeywords;
        let newrighteyekeywords=args.righteyekeywords;
        let newexaminationdate=args.examinationdate;
        let updatedBy= args.changedby;     
        const patient = await PrimaryContract.prototype.readPatient(ctx, patientId);
        if (newsymptoms !== null && newsymptoms !== '' && patient.symptoms !== newsymptoms) {
            patient.symptoms = newsymptoms;
            isDataChanged = true;
        }
        if (newrighteyepower !== null && newrighteyepower !== '' && patient.righteyepower !== newrighteyepower) {
            patient.righteyepower = newrighteyepower;
            isDataChanged = true;
        }
        if (newlefteyepower !== null && newlefteyepower !== '' && patient.lefteyepower!== newlefteyepower) {
            patient.lefteyepower = newlefteyepower;
            isDataChanged = true;
        }
        if (newprescription!== null && newprescription !== '' && patient.prescription !== newprescription) {
            patient.prescription= newprescription;
            isDataChanged = true;
        }
        if (newlefteyekeywords !== null && newlefteyekeywords!== '' && patient.lefteyekeywords !== newlefteyekeywords) {
            patient.lefteyekeywords = newlefteyekeywords;
            isDataChanged = true;
        }
        if (newrighteyekeywords !== null && newrighteyekeywords!== '' && patient.righteyekeywords !== newrighteyekeywords) {
            patient.righteyekeywords = newrighteyekeywords;
            isDataChanged = true;
        }
        if (newriskfactors !== null && newriskfactors!== '' && patient.riskfactors !== newriskfactors) {
            patient.riskfactors = newriskfactors;
            isDataChanged = true;
        }


        if(updatedBy!== null && updatedBy!== '') {
            patient.changedby = updatedBy;
        }

        if (isDataChanged === false) return;
       patient.examinationdate=(new Date()).toString();
        const buffer = Buffer.from(JSON.stringify(patient));
        await ctx.stub.putState(patientId, buffer);
    }

    //Read patients based on lastname
    async queryPatientsByLastName(ctx, lastname) {
        return await super.queryPatientsByLastName(ctx, lastname);
    }

    //Read patients based on firstName
    async queryPatientsByFirstName(ctx, firstname) {
        return await super.queryPatientsByFirstName(ctx, firstname);
    }

    //Retrieves patient medical history based on patientId
    async getPatientHistory(ctx, patientId) {
        let resultsIterator = await ctx.stub.getHistoryForKey(patientId);
        let asset = await this.getAllPatientResults(resultsIterator, true);

        return this.fetchLimitedFields(asset, true);
    }

    //Retrieves all patients details
    async queryAllPatients(ctx, doctorId) {
        let resultsIterator = await ctx.stub.getStateByRange('', '');
        let asset = await this.getAllPatientResults(resultsIterator, false);
        const permissionedAssets = [];
        for (let i = 0; i < asset.length; i++) {
            const obj = asset[i];
            if ('permissiongranted' in obj.Record && obj.Record.permissiongranted.includes(doctorId)) {
                permissionedAssets.push(asset[i]);
            }
        }

        return this.fetchLimitedFields(permissionedAssets);
    }

    fetchLimitedFields = (asset, includeTimeStamp = false) => {
        for (let i = 0; i < asset.length; i++) {
            const obj = asset[i];
            asset[i] = {
                patientId: obj.Key,
                firstname: obj.Record.firstname,
                lastname: obj.Record.lastname,
                age: obj.Record.age,
                bloodgroup: obj.Record.bloodgroup,
                righteyepower: obj.Record.righteyepower,
                lefteyepower: obj.Record.lefteyepower,
                prescription: obj.Record.prescription,
                symptoms: obj.Record.symptoms,
                riskfactors: obj.Record.riskfactors,
                lefteyekeywords: obj.Record.lefteyekeywords,
                righteyekeywords: obj.Record.righteyekeywords,
                lefteyeimage: obj.Record.lefteyeimage,
                righteyeimage: obj.Record.righteyeimage,
                examinationdate: obj.Record.examinationdate,
                leftclass: obj.Record.leftclass,
                rightclass: obj.Record.rightclass,
                leftoutput: obj.Record.leftoutput,
                rightoutput: obj.Record.rightoutput,
                report: obj.Record.output,
                changedby: obj.Record.changedby               
                
            };
            if (includeTimeStamp) {
                asset[i].changedby = obj.Record.changedby;
                
            }
        }

        return asset;
    };


    
    async getClientId(ctx) {
        const clientIdentity = ctx.clientIdentity.getID();
        // Ouput of the above - 'x509::/OU=client/CN=hosp1admin::/C=US/ST=North Carolina/L=Durham/O=hosp1.titanium.com/CN=ca.hosp1.titanium.com'
        let identity = clientIdentity.split('::');
        identity = identity[1].split('/')[2].split('=');
        return identity[1].toString('utf8');
    }
}
module.exports = DoctorContract;