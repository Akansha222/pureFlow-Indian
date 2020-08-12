import { Component,Inject, OnInit } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {DatabaseService} from '../../_services/DatabaseService';
import {ActivatedRoute, Router} from '@angular/router';
import {DialogComponent} from '../../dialog/dialog.component';

@Component({
  selector: 'app-complaints-nature-problem',
  templateUrl: './complaints-nature-problem.component.html',
})
export class ComplaintsNatureProblemComponent implements OnInit {
  data: any = {};
  loading_list:any = false;
  mode:any;
  savingData = false;
  gift_id;
  complaint:any = {};
  
  constructor(public db: DatabaseService, private route: ActivatedRoute, private router: Router,  public dialog: DialogComponent,
    @Inject(MAT_DIALOG_DATA) public model_data: any, public dialogRef: MatDialogRef<ComplaintsNatureProblemComponent>) {
      //console.log(model_data);
      
      this.data.id = model_data.id; 
      this.data.nature_problem = model_data.nature_problem; 
      
    }
    ngOnInit() {
      this.route.params.subscribe(params => {
        this.gift_id = params['gift_id'];
        this.complaint.nature_problem = this.data.nature_problem; 
//console.log( this.complaint );

      });
    }
   
    addCompalintStatus(form:any)
    {
      this.savingData = true;
      this.complaint.created_by = this.db.datauser.id;

      this.db.post_rqst( { 'status' : this.complaint ,'id': this.data.id }, 'karigar/updateNatureProblem')
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
  