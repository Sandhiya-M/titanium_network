
const crypto = require('crypto');
class Patient {
    constructor(patientId, firstname, lastname, password, age,gender, phonenumber, emergencynumber, address, bloodgroup,
        lefteyepower,righteyepower,lefteyeimage,righteyeimage,prescription='',riskfactors='',lefteyekeywords='',righteyekeywords='',  changedby = '',symptoms = '',exmainationdate='',leftoutput='',rightoutput='',leftclass='',rightclass='',report='')
    {
                 
        this.patientId = patientId;
        this.firstname = firstname;
        this.lastname = lastname;
        this.password = crypto.createHash('sha256').update(password).digest('hex');
        this.age = age;
        this.gender=gender;
        this.phonenumber = phonenumber;
        this.emergencynumber = emergencynumber;
        this.address = address;
        this.bloodgroup = bloodgroup;
        this.lefteyepower=lefteyepower;
        this.righteyepower=righteyepower;
        this.lefteyeimage=lefteyeimage,
        this.righteyeimage=righteyeimage,
        this.prescription=prescription;
        this.riskfactors=riskfactors;
        this.lefteyekeywords=lefteyekeywords;
        this.righteyekeywords=righteyekeywords;
        this.exmainationdate=exmainationdate;
        this.changedby = changedby;
        this.symptoms = symptoms;
        this.pwdTemp = true;
        this.permissiongranted = [];
        this.leftoutput=leftoutput;
        this.rightoutput=rightoutput;
        this.leftclass=leftclass;
        this.rightclass=rightclass;
        this.report=report;
        return this;
    }
}
module.exports = Patient