import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { Observable, Subscription } from 'rxjs';

import { PatientService } from '../patient.service';
import { DisplayVal, PatientViewRecord } from '../patient';
import { RoleEnum } from '../../utils';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-patient-history',
  templateUrl: './patient-history.component.html',
  styleUrls: ['./patient-history.component.scss']
})
export class PatientHistoryComponent implements OnInit, OnDestroy {
  public patientID: any;
  public patientRecordHistoryObs$?: Observable<Array<PatientViewRecord>>;
  public data: any;
  private sub?: Subscription;
  headerNames = [
    
    new DisplayVal(PatientViewRecord.prototype.changedby, 'Last changed by'),
    new DisplayVal(PatientViewRecord.prototype.firstname, 'First Name'),
    new DisplayVal(PatientViewRecord.prototype.lastname, 'Last Name'),
    new DisplayVal(PatientViewRecord.prototype.age, 'Age'),
    new DisplayVal(PatientViewRecord.prototype.bloodgroup, 'Blood Group'),
  ];

  constructor(
    private readonly route: ActivatedRoute,
    private readonly patientService: PatientService,
    private readonly authService: AuthService
  ) { }

  ngOnInit(): void {
    if (this.isPatient()) {
      this.headerNames.push(
        new DisplayVal(PatientViewRecord.prototype.address, 'Address'),
        new DisplayVal(PatientViewRecord.prototype.phonenumber, 'Contact number'),
        new DisplayVal(PatientViewRecord.prototype.emergencynumber, 'Emergency number')
      );
    }
    this.headerNames.push(
      new DisplayVal(PatientViewRecord.prototype.lefteyepower, 'Left Eye power'),
      new DisplayVal(PatientViewRecord.prototype.righteyepower, 'Right Eye Power'),
      new DisplayVal(PatientViewRecord.prototype.symptoms, 'symptoms'),
      new DisplayVal(PatientViewRecord.prototype.prescription , 'Prescription'),
      new DisplayVal(PatientViewRecord.prototype.riskfactors, 'Risk factors'),
    
      new DisplayVal(PatientViewRecord.prototype.examinationdate , 'Examination Date'),
    );
    this.sub = this.route.params
      .subscribe((params: Params) => {
        this.patientID = params.patientId;
        this.refresh();
      });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  public refresh(): void {
    this.patientRecordHistoryObs$ = this.patientService.getPatientHistoryByKey(this.patientID);
  }

  public isPatient(): boolean {
    return this.authService.getRole() === RoleEnum.PATIENT;
  }

  public convertToDate(val: any): string{
    return new Date(val.seconds.low * 1000).toDateString();
  }
}
