import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Observable, Subscription } from 'rxjs';

import { DoctorService } from '../doctor.service';
import { DoctorRecord, DoctorViewRecord } from '../doctor';
import { DisplayVal } from '../../patient/patient';


@Component({
  selector: 'app-doctor-list-for-admin',
  templateUrl: './doctor-list-for-admin.component.html',
  styleUrls: ['./doctor-list-for-admin.component.scss']
})
export class DoctorListForAdminComponent implements OnInit, OnDestroy {
 
  public doctorRecords: Array<DoctorViewRecord> = [];
  public hospId=0;
  private allSubs = new Subscription();
  public headerNames = [
    new DisplayVal(DoctorViewRecord.prototype.doctorId, 'Doctor Id'),
    new DisplayVal(DoctorViewRecord.prototype.firstname, 'First Name'),
    new DisplayVal(DoctorViewRecord.prototype.lastname, 'Last Name')
  ];

  constructor(
    private readonly route: ActivatedRoute,
    private readonly doctorService: DoctorService,
    
  ) { }

  ngOnInit(): void {
    this.allSubs.add(
      this.route.params.subscribe((params: Params) => {
        this.hospId = params.self.charAt(4);
        this.refresh();
      })
    );
  }

  ngOnDestroy(): void {
    this.allSubs.unsubscribe();
  }

  public refresh(): void {
    this.doctorRecords = [];
    console.log("-----------------I am in---------------------");
    this.allSubs.add(      
        this.fetchDoctorData()     
    );
  }
  public fetchDoctorData(): void {
    this.allSubs.add(
      this.doctorService.getDoctorsByHospitalId(this.hospId).subscribe(x => {
        const data = x as Array<DoctorRecord>;
        data.map(y => this.doctorRecords.push(new DoctorViewRecord(y)));
        
      })
    );}
   public isDoctorPresent(doctorId: string): boolean {
    // @ts-ignore
    return this.permissions.includes(doctorId);
  }
  
}
