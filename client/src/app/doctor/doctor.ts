export interface DoctorRecord {
  id: string;
  firstname: string;
  lastname: string;
  role: string;
  speciality: string,
}

export class DoctorViewRecord {
  doctorId = '';
  firstname = '';
  lastname = '';
  speciality = '';
  role = '';

  constructor(readonly doctorRecord: DoctorRecord) {
    this.doctorId = doctorRecord.id;
    this.firstname = doctorRecord.firstname;
    this.speciality=doctorRecord.speciality;
    this.lastname = doctorRecord.lastname;
    this.role = doctorRecord.role;
  }
}
