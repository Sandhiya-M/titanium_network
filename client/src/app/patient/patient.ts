export interface Timestamp {
  nanos: number;
  seconds: ISeconds;
}

export interface ISeconds {
  high: number;
  low: number;
  unsigned: boolean;
}

export interface PatientRecord {
  patientId: string;
  firstname: string;
  lastname: string;
  address: string;
  age: number;
  gender:string;
  emergencynumber: string;
  phonenumber: string;
  bloodgroup: string;
  lefteyepower: number;
  righteyepower: number;
  lefteyeimage:string;
  righteyeimage:string;
  symptoms: string;
  prescription: string;
  riskfactors: string;
  lefteyekeywords: string;
  righteyekeywords: string;
  examinationdate: Timestamp;
  changedby: string;  
  output:string;
}

/*export interface ResRecord {
  Key: string;
  Record: PatientRecord;
}*/

export class PatientViewRecord {
  patientId = '';
  firstname = '';
  lastname = '';
  address = '';
  age = 0;
  gender='';
  emergencynumber = '';
  phonenumber = '';
  bloodgroup = '';
  lefteyepower=0;
  righteyepower=0;
  lefteyeimage='';
  righteyeimage='';
  symptoms='';
  prescription='';
  riskfactors='';
  lefteyekeywords='';
  righteyekeywords=''
  examinationdate='';
  changedby='';
  output='';

  constructor(readonly patientRecord: PatientRecord) {
    this.patientId = patientRecord.patientId;
    this.firstname = patientRecord.firstname;
    this.lastname = patientRecord.lastname;
    this.address = patientRecord.address;
    this.gender=patientRecord.gender;
    this.age = patientRecord.age;
    this.emergencynumber = patientRecord.emergencynumber;
    this.phonenumber = patientRecord.phonenumber;
    this.bloodgroup = patientRecord.bloodgroup;
    this.lefteyepower= patientRecord.lefteyepower;
    this.righteyepower = patientRecord.righteyepower;
    this.lefteyeimage=patientRecord.lefteyeimage;
    this.righteyeimage=patientRecord.righteyeimage;
    this.symptoms = patientRecord.symptoms;   
    this.prescription = patientRecord.prescription;
    this.riskfactors = patientRecord.riskfactors;
    this.lefteyekeywords = patientRecord.lefteyekeywords;
    this.righteyekeywords= patientRecord.righteyekeywords;
    this.examinationdate= patientRecord.examinationdate? new Date(patientRecord.examinationdate.seconds.low * 1000).toDateString() : '';
    this.changedby=patientRecord.changedby;
    this.output=patientRecord.output;
  }
}

export class PatientAdminViewRecord {
  patientId = '';
  firstname = '';
  lastname = '';
  gender = '';
  emergencynumber = '';
  phonenumber = '';

  constructor(readonly patientRecord: PatientRecord) {
    this.patientId = patientRecord.patientId;
    this.firstname = patientRecord.firstname;
    this.lastname = patientRecord.lastname;
    this.gender=patientRecord.gender;
    this.emergencynumber = patientRecord.emergencynumber;
    this.phonenumber = patientRecord.phonenumber;
  }
}

export class PatientDoctorViewRecord {
  patientId = '';
  firstname = '';
  lastname = '';
  gender='';
  bloodgroup = '';
  lefteyepower=0;
  righteyepower=0;
  symptoms='';
  prescription='';
  riskfactors='';
  lefteyekeywords='';
  righteyekeywords='';
  lefteyeimage='';
  righteyeimage='';
  examinationdate='';
  leftocularpressure='';
  rightocularpressure='';
  output='';
  constructor(readonly patientRecord: PatientRecord) {
    this.patientId = patientRecord.patientId;
    this.firstname = patientRecord.firstname;
    this.lastname = patientRecord.lastname;
    this.gender=patientRecord.gender;
    this.bloodgroup = patientRecord.bloodgroup;
    this.lefteyepower= patientRecord.lefteyepower;
    this.righteyepower = patientRecord.righteyepower;
    this.lefteyeimage=patientRecord.lefteyeimage;
    this.righteyeimage=patientRecord.righteyeimage;
    this.symptoms = patientRecord.symptoms.toString();    
    this.prescription = patientRecord.prescription;
    this.riskfactors = patientRecord.riskfactors;
    this.lefteyekeywords = patientRecord.lefteyekeywords.toString();
    this.righteyekeywords= patientRecord.righteyekeywords.toString();
    this.examinationdate= patientRecord.examinationdate.toString();
    this.output=patientRecord.output;
  }
}

export class DisplayVal {
  keyName: string | number | boolean;
  displayName: string;

  constructor(key: string | number | boolean, value: string) {
    this.keyName = key;
    this.displayName = value;
  }
}
