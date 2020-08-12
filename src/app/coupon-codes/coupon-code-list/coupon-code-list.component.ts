import {Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatTableDataSource} from '@angular/material';
import {DatabaseService} from '../../_services/DatabaseService';
import {DialogComponent} from '../../dialog/dialog.component';
import { MatDialog, MatDatepicker } from '@angular/material';
import { ImportStatusModelComponent } from '../../offer/import-status-model/import-status-model.component';

@Component({
  selector: 'app-coupon-code-list',
  templateUrl: './coupon-code-list.component.html',
})
export class CouponCodeListComponent implements OnInit {
  
  loading_list = false;
  coupon: any = [];
  total_coupon = 0;
  
  last_page: number ;
  current_page = 1;
  search: any = '';
  searchData = true;
  filter:any = {};
  filtering : any = false;
  redeem_coupon:any=[];
  
  coupon_all:any =0;
  coupon_available_count : any = 0;
  coupon_scanned_count : any = 0;
  coupon_redeem_count : any = 0;
  
  constructor(public db: DatabaseService, public dialog: DialogComponent,public alrt:MatDialog ) {}
  
  mode:any='1';
  ngOnInit() {
    this.getAvailableCoupanList();
    // this. getScannedList();
    this.filter.status = '';
  }
  openDatePicker(picker : MatDatepicker<Date>)
  {
    picker.open();
  }
  
  redirect_previous1() {
    this.current_page--;
    this.getAvailableCoupanList();
  }
  redirect_next1() {
    if (this.current_page < this.last_page) { this.current_page++; }
    else { this.current_page = 1; }
    this.getAvailableCoupanList();
  }
  
  redirect_previous2() {
    this.current_page--;
    this.getScannedList();
  }
  redirect_next2() {
    if (this.current_page < this.last_page) { this.current_page++; }
    else { this.current_page = 1; }
    this.getScannedList();
  }
  
  
  avialable_coupon_count:any=0;
  redeem_coupon_count:any=0;
  sccaned_coupon_count:any=0;
  
  getAvailableCoupanList() 
  {
    //console.log( 'INN');
    
    this.loading_list = true;
    this.filtering = false;
    this.filter.date = this.filter.date  ? this.db.pickerFormat(this.filter.date) : '';
    this.filter.scan_date = this.filter.scan_date  ? this.db.pickerFormat(this.filter.scan_date) : '';
    this.filter.end_date = this.filter.end_date  ? this.db.pickerFormat(this.filter.end_date) : '';
    if( this.filter.date || this.filter.scan_date || this.filter.end_date  || this.filter.search || this.filter.coupon_code || this.filter.offer_title || this.filter.points)this.filtering = true;
    
    this.db.post_rqst(  {  'filter': this.filter , 'login':this.db.datauser}, 'offer/couponAvailableList?page=' + this.current_page)
    .subscribe( d => {
      this.loading_list = false;
      //console.log(d);
      
      this.current_page = d.avialable_coupon.current_page;
      this.last_page = d.avialable_coupon.last_page;
      this.total_coupon =d.avialable_coupon.total;
      this.coupon = d.avialable_coupon.data;
      this.avialable_coupon_count = d.avialable_coupon.total;
      this.sccaned_coupon_count = d.coupon_scanned_count;
    });
  }
  
  exportAvailableCouponList()
  {
    this.filter.mode = 1;
    this.db.post_rqst(  {'filter': this.filter , 'login':this.db.datauser}, 'offer/exportAvailableCouponList')
    .subscribe( d => {
      this.loading_list = false;
      document.location.href = this.db.myurl+'/app/uploads/exports/Available-coupon-code.csv';
      //console.log(d);
    });
  }
  scanned_coupon:any=[];
  total_scanned_coupon:any={};
  
  getScannedList() 
  {
    
    this.loading_list = true;
    this.filter.date = this.filter.date  ? this.db.pickerFormat(this.filter.date) : '';
    this.filter.scan_date = this.filter.scan_date  ? this.db.pickerFormat(this.filter.scan_date) : '';
    this.filter.end_date = this.filter.end_date  ? this.db.pickerFormat(this.filter.end_date) : '';
    if( this.filter.date || this.filter.scan_date || this.filter.end_date  || this.filter.search || this.filter.coupon_code || this.filter.offer_title || this.filter.points || this.filter.mobile || this.filter.used_by)this.filtering = true;
    this.filter.mode = 0;
    
    this.db.post_rqst(  {  'filter': this.filter , 'login':this.db.datauser}, 'offer/couponScannedList?page=' + this.current_page)
    .subscribe( d => {
      this.loading_list = false;
      //console.log(d);
      
      this.current_page = d.scanned_coupon.current_page;
      this.last_page = d.scanned_coupon.last_page;
      this.total_scanned_coupon =d.scanned_coupon.total;
      this.scanned_coupon = d.scanned_coupon.data;
      this.sccaned_coupon_count = d.scanned_coupon.total;
      this.avialable_coupon_count = d.coupon_available_count;
      
    });
  }
  exportScannedCouponList()
  {
    this.filter.mode = 1;
    this.db.post_rqst(  {'filter': this.filter , 'login':this.db.datauser}, 'offer/exportScannedCouponList')
    .subscribe( d => {
      this.loading_list = false;
      document.location.href = this.db.myurl+'app/uploads/exports/scanned-coupon-list.csv';
      //console.log(d);
    });
  }
  
  coupon_ex:any = '';
  file:any = {};
  onUploadChange1(evt: any,f) {
      //console.log(f);
  
      this.file = evt.target.files[0];
      f.resetForm();
  
      //console.log(this.file);
  
      this.uploadCoupon();
  
  }
  
  
  formData = new FormData();
  exist_coupon:any=[];
  uploadCoupon(){
      this.loading_list = true; 
      this.formData.append('coupon', this.file, this.file.name);
  
      // this.formData.append('offer_id', this.offer_id);
  
      this.db.fileData( this.formData, 'app_master/couponExcel')
      .subscribe(d => {  
          this.loading_list = false;
          this.formData = new FormData();
          if(d['status'] == 'BLANK'){
              this.dialog.success('File is Blank');
              return;
          }
  
          if(d['status'] == 'INCORRECT FILE'){
              this.dialog.success('File Data is incorrect');
              return;
          }
  
  
          if(d['status'] == 'INCORRECT FORMAT'){
              this.dialog.success('File Format is incorrect! only CSV Support');
              return;
          }
  
          if(d['status'] == 'SIZE SHORT'){
              this.dialog.success('CSV File To Sort ');
              return;
          }
  
          if(d['status'] == 'UPLOAD' ){
  
  
              if( d['exist_coupon'].length > 0 )
              {
                  const dialogRef = this.alrt.open(ImportStatusModelComponent,
                      {
                          width: '650px',
                          height:'500px',
                          data: {
                              'exist_coupon' : d['exist_coupon'],
                          }
                      });
                      dialogRef.afterClosed().subscribe(result => {   
                          //console.log(`Dialog result: ${result}`);
                      });
  
                      if(d['upload_count'] > 0   ){
  
  
                      }else{
                          this.dialog.success(d['exist_coupon'].length+' Coupon Already Exist!');
  
                      }
  
  
                  }
  
  
                  if(d['upload_count'] > 0   ){
                      this.dialog.success(d['upload_count']+' Coupon Upload Successfully!');
                      this.getAvailableCoupanList();
  
                  }
  
  
              }
              this.getAvailableCoupanList();
  
              this.dialog.success( 'Coupon upload successfully!');
  
          },err => {
            //console.log(err); 
             this.formData = new FormData(); this.loading_list = false; });
  
  
      }

      deleteCoupon(id) {
        this.dialog.delete('Coupon').then((result) => {
          if(result) {
        this.db.post_rqst({'id': id}, 'offer/removeCoupon')
        .subscribe(d => {
          //console.log(d);
          this.getAvailableCoupanList();
          this.dialog.successfully();
        });
      }
        });
      } 
  
}
