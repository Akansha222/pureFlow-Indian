import { Component, OnInit } from '@angular/core';
import {MatDialog, MatDatepicker} from '@angular/material';
import {DatabaseService} from '../../_services/DatabaseService';
import {ActivatedRoute, Router} from '@angular/router';
import {DialogComponent} from '../../dialog/dialog.component';
import {SessionStorage} from '../../_services/SessionService';
import { ProductImageModuleComponent } from '../../master//product-image-module/product-image-module.component';
import {ChangeKarigarStatusComponent} from '../../karigar/change-karigar-status/change-karigar-status.component';
import { KarigarBalanceModelComponent } from '../../karigar/karigar-balance-model/karigar-balance-model.component';
import * as moment from 'moment';
import {ChangeStatusComponent} from '../../gift-gallery/change-status/change-status.component';


@Component({
    selector: 'app-karigar-detail',
    templateUrl: './karigar-detail.component.html',
})
export class KarigarDetailComponent implements OnInit {
    
    karigar_id;
    loading_list = false;
    
    filtering : any = false;
    filter:any = {};
    last_page: number ;
    current_page = 1;
    search: any = '';
    mindate :any = new Date();  
    constructor(public db: DatabaseService, private route: ActivatedRoute, private router: Router, public ses: SessionStorage,
        public dialog: DialogComponent, public alrt:MatDialog ) {}
        mode:any=1;
        
        ngOnInit() {
            this.route.params.subscribe(params => {

                console.log(params);

                console.log((params['karigar_id'].toString()).length);

                if ((params['karigar_id'].toString()).length > 4) {

                    this.karigar_id = this.db.crypto(params['karigar_id'],false);

                } else {

                     this.karigar_id = params['karigar_id'];
                }
              
                console.log(this.karigar_id);
                if (this.karigar_id) {
                    this.getKarigarDetails();
                    this.getScannedList();
                }
            });
        }
        
        toInt(i){
            return parseInt(i);
        }
        openDatePicker(picker : MatDatepicker<Date>)
        {
            picker.open();
        }
        edit(){
            this.router.navigate(['/karigar-add/' +this.db.crypto(this.karigar_id)]);
        }
        getData:any = {};
        total_points:any=0;
        getKarigarDetails() {
            this.loading_list = true;
            this.db.post_rqst(  {'karigar_id':this.karigar_id}, 'karigar/karigarDetail')
            .subscribe(d => {
                this.loading_list = false;
                console.log(d);

                if(d.karigar.profile == 'Array') {

                     d.karigar.profile = '';
                }
                this.getData = d.karigar;
                this.total_points = parseInt(this.getData.balance_point)+parseInt(this.getData.referal_point_balance);
            });
        }
        
        karigarsSatus()
        {
            if( this.getData.status == 'Reject' ||  this.getData.status == 'Suspect' || this.getData.status == 'Verified' || this.getData.status == 'Pending')
            {
                this.model();
                return;
            }
        }
        
        model()
        {
            const dialogRef = this.alrt.open(ChangeKarigarStatusComponent,{
                width: '500px',
                height:'500px',
                
                data: {
                    karigar_id:  this.getData.id ,
                    status    :  this.getData.status,
                }
            });
            dialogRef.afterClosed().subscribe(result => {
                if( result ){
                    this.getKarigarDetails();
                }
                if( result ){
                    this.getKarigarDetails();
                }else{
                    this.getKarigarDetails();
                }
            });
            
        }
        
        coupandetail:any = [];
        couponDetail()
        {
            this.loading_list = true;
            this.db.post_rqst({ 'karigar_id':this.karigar_id }, 'karigar/coupanDetail')
            .subscribe(d => {
                this.loading_list = false;
                //console.log(d);
                this.coupandetail = d.coupan;
                //console.log( this.coupandetail );
            });
        }
        
        redirect_previous1() {
            this.current_page--;
            this.getScannedList();
        }
        redirect_next1() {
            if (this.current_page < this.last_page) { this.current_page++; }
            else { this.current_page = 1; }
            this.getScannedList();
        }
        
        redirect_previous2() {
            this.current_page--;
            this.getComplaintsList();
        }
        redirect_next2() {
            if (this.current_page < this.last_page) { this.current_page++; }
            else { this.current_page = 1; }
            this.getComplaintsList();
        }
        
        coupon_scanned_count:any = 0;
        scanned_coupon:any=[];
        getScannedList() 
        {
            this.loading_list = true;
            this.filter.date = this.filter.date  ? this.db.pickerFormat(this.filter.date) : '';
            this.filter.used_date = this.filter.used_date  ? this.db.pickerFormat(this.filter.used_date) : '';
            this.filter.end_date = this.filter.end_date  ? this.db.pickerFormat(this.filter.end_date) : '';
            if( this.filter.date  || this.filter.used_date || this.filter.end_date)this.filtering = true;
            
            this.filter.karigar_id = this.karigar_id;
            this.db.post_rqst(  {  'filter': this.filter }, 'offer/couponScannedList?page=' + this.current_page)
            .subscribe( d => {
                this.loading_list = false;
                //console.log(d);
                
                this.current_page = d.scanned_coupon.current_page;
                this.last_page = d.scanned_coupon.last_page;
                this.scanned_coupon = d.scanned_coupon.data;

                this.coupon_scanned_count = this.getData.reg;
                for (let index = 0; index < this.scanned_coupon.length; index++) {

                    this.coupon_scanned_count += this.scanned_coupon[index].coupon_value;
                    
                }
                
                // this.coupon_scanned_count = d.scanned_coupon.total;
                this.complaint_total = d.complaint_total;
                
                
            });
        }
        
        complaint:any = [];
        complaint_total:any = 0;
        getComplaintsList() 
        {
            //console.log(this.filter);
            this.loading_list = true;
            this.filter.date = this.filter.date  ? this.db.pickerFormat(this.filter.date) : '';
            if( this.filter.date)this.filtering = true;
            this.filter.mode = 0;
            this.filter.karigar_id = this.karigar_id;
            
            this.db.post_rqst(  {'filter': this.filter , 'login':this.db.datauser}, 'karigar/complaintList?page=' + this.current_page)
            .subscribe( d => {
                this.loading_list = false;
                //console.log(d);
                
                this.current_page = d.karigars.current_page;
                this.last_page = d.karigars.last_page;
                this.complaint = d.karigars.data;
                this.complaint_total = d.karigars.total;
                
                
            });
        }
        
        // submit_manual_permission() {
        //   this.loading_list = true;
        
        //   this.db.post_rqst({ 'manual' : this.getData  }, 'karigar/manual_permission')
        //   .subscribe(d => {
        //     //console.log(d);
        //     this.loading_list = false;
        //     this.dialog.warning('Permission set Successfully!');
        
        //     this.getKarigarDetails();
        //   });
        // }
        
        
        
        step = 1;
        setStep(index: number) {
            this.step = index;
        }
        nextStep() {
            this.step++;
        }
        prevStep() {
            this.step--;
        }
        openDialog(id ,string ) {
            const dialogRef = this.alrt.open(ProductImageModuleComponent,
                {
                    width: '1024px',
                    
                    data: {
                        'id' : id,
                        'mode' : string,
                    }
                });
                dialogRef.afterClosed().subscribe(result => {
                    //console.log(`Dialog result: ${result}`);
                });
            }
            
            // changeStatus(id)
            // {
            //   const dialogRef = this.alrt.open(ChangeKarigarStatusComponent,
            //     {
            //       width: '500px',
            //       height:'500px',
            
            //     data: {
            //       'id' : id,
            //       }
            //     });
            //     dialogRef.afterClosed().subscribe(result => {
            //       if( result ){
            //         this.getReedamList();
            //       }
            //     });
            //   }
            
            // requestchangeStatus(i,id,status)
            // {
            //   //console.log(status);
            
            //   const dialogRef = this.alrt.open(ChangeStatusComponent,
            //     {
            //       width: '500px',
            //       height:'500px',
            
            //       data: {
            //         'id' : id,
            //         'status' : status,
            //       }
            //     });
            //     dialogRef.afterClosed().subscribe(result => {
            //       if( result ){
            //         this.getReedamList();
            //       }
            //     });
            
            //   }
            
            balanceModel(id)
            {
                const dialogRef = this.alrt.open(KarigarBalanceModelComponent,
                    {
                        width: '650px',
                        height:'500px',
                        
                        data: {
                            'id' : id,
                            // 'offer_id'  :   this.offer_id,
                        }
                    });
                    dialogRef.afterClosed().subscribe(result => {
                        //console.log(`Dialog result: ${result}`);
                    });
                    
                }
                complaint_status:any ={};
                karigarsComplaintSatus() {
                    
                    
                    
                    this.loading_list = true;
                    
                    this.db.post_rqst( { 'complaint_status' : this.complaint_status ,'karigar_id': this.getData.id  }, 'karigar/karigarsComplaintSatus')
                    .subscribe( d => {
                        this.loading_list = false;
                        this.dialog.success('Plumber Compaint Status successfully Change');
                        
                    });
                }
                redeem(id)
                {
                    this.loading_list = true;
                    console.log(id);
                    this.db.post_rqst( { 'karigar_id': this.getData.id  }, 'karigar/redeem')
                    .subscribe( d => {
                        this.loading_list = false;
                        this.dialog.success('Wallet Updated');
                        
                    },err=>
                    {
                        this.loading_list = false;
                        this.dialog.error('Error,Please Try Again');
                    });
                    setTimeout(() => {
                        this.loading_list = false;
                        this.getKarigarDetails()
                    }, 100);
                }
            }
            