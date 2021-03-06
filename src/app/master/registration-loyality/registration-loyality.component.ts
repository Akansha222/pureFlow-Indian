import {Component,OnInit } from '@angular/core';
import { DomSanitizer } from "@angular/platform-browser";
import {DatabaseService} from '../../_services/DatabaseService';
import {ActivatedRoute, Router} from '@angular/router';
import {DialogComponent} from '../../dialog/dialog.component';
import {SessionStorage} from '../../_services/SessionService';
import { DeactiveStatusComponent } from 'src/app/deactive-status/deactive-status.component';
import { MatDialog } from '@angular/material';




@Component({
  selector: 'app-registration-loyality',
  templateUrl: './registration-loyality.component.html',
})
export class RegistrationLoyalityComponent implements OnInit {

  loading_list = false;
  getData: any = {};


  constructor(public db: DatabaseService, private route: ActivatedRoute, private router: Router, public ses: SessionStorage,
    public dialog: DialogComponent,public alrt:MatDialog) {}

  ngOnInit() {
    this.getProductList();

  }

  getProductList() 
  {
    this.loading_list = true;
    this.db.post_rqst( '', 'master/getloyaliti' )
    .subscribe( d => {
      //console.log(d);
      this.loading_list = false;
      this.loyaliti.wallet_point = d.getData.wallet_point;
      
    });
  }
  

  

 
  loyaliti:any= {};
  saveloyality() {

    this.db.post_rqst( { 'loyaliti' : this.loyaliti }, 'master/loyalitiadd')
    .subscribe( d => {
      //console.log( d );
      if(d['status'] == 'SUCCESS' ){
        this.dialog.success( 'Wallet Point Successfully Updated');
      }
    });
  }

  numeric_Number(event: any) {
    const pattern = /[0-9\+\-\ ]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  

}
