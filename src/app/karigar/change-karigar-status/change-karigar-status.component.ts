import { Component,Inject, OnInit } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {DatabaseService} from '../../_services/DatabaseService';
import {ActivatedRoute, Router} from '@angular/router';
import {DialogComponent} from '../../dialog/dialog.component';

@Component({
  selector: 'app-change-karigar-status',
  templateUrl: './change-karigar-status.component.html',
})
export class ChangeKarigarStatusComponent implements OnInit {
  id: any = {};
  loading_list:any = false;
  mode:any;
  savingData = false;
  gift_id;
  complaint:any = {};
  
  constructor(public db: DatabaseService, private route: ActivatedRoute, private router: Router,  public dialog: DialogComponent,
    @Inject(MAT_DIALOG_DATA) public model_data: any, public dialogRef: MatDialogRef<ChangeKarigarStatusComponent>) {
      //console.log(model_data);
      
      this.id = model_data.karigar_id; 
      this.complaint.status = model_data.status; 
      
    }
    ngOnInit() {
    }
   
    addCompalintStatus(form:any)
    {
      // this.savingData = true;
      this.complaint.created_by = this.db.datauser.id;
      this.complaint.karigar_id = this.id;

      this.db.post_rqst( { 'status' : this.complaint }, 'karigar/karigarStatus')
      .subscribe( d => {
        this.savingData = false;
        this.dialog.success( 'Status successfully Change');
        this.dialogRef.close(true);
        //console.log( d );
      });
    }

    onNoClick(): void{
    this.dialogRef.close();
    }
  }
  