import {Component,OnInit} from '@angular/core';
import {DatabaseService} from '../../_services/DatabaseService';
import {ActivatedRoute, Router} from '@angular/router';
import {DialogComponent} from '../../dialog/dialog.component';
import {SessionStorage} from '../../_services/SessionService';
import { MatDialog, MatDatepicker} from '@angular/material';


@Component({
  selector: 'app-coupon-code-upload',
  templateUrl: './coupon-code-upload.component.html',
})
export class CouponCodeUploadComponent implements OnInit {
  
  loading_list = false;
  coupon: any = {};
  history: any = {};
  savingData = false;
  date1;
  
  
  constructor(public db: DatabaseService, private route: ActivatedRoute, private router: Router, public ses: SessionStorage,
    public matDialog: MatDialog,  public dialog: DialogComponent) { this.date1 = new Date();
    console.log(this.db.datauser)
    }
    
    ngOnInit() {
      this.getCouponDetail();
      this.history.current_page = 1;
    }

    filter:any = {};
    filtering : any = false;

    redirect_previous() {
      this.history.current_page--;
      this.getCouponDetail();
    }
    redirect_next() {
      if (this.history.current_page < this.history.last_page) { this.history.current_page++; }
      else { this.history.current_page = 1; }
      this.getCouponDetail();
    }
    openDatePicker(picker : MatDatepicker<Date>)
    {
      picker.open();
    }
    getData:any = {};
    getCouponDetail() {
      this.filter.date = this.filter.date  ? this.db.pickerFormat(this.filter.date) : '';
      console.log(this.filter);
      
      this.loading_list = true;
      this.db.post_rqst(  { 'filter': this.filter }, 'offer/coupon_history?page=' + this.history.current_page)
      .subscribe(d => {
        this.loading_list = false;
        this.history = d.coupon;
      });
    }
    
    saveCouponfrom(form:any) {
     
     if(this.coupon.total_coupon<=2500) {
        this.loading_list = true;
      this.savingData = true;
      this.coupon.created_by = this.db.datauser.id;
      
      this.db.post_rqst( { 'coupon' : this.coupon }, 'offer/generateCoupon')
      .subscribe( d => {
        if(d['status'] == 'Fields Reqired' ){
          this.dialog.error( 'Fields Reqired!');
          return;
        }
        form.resetForm();
        this.dialog.success( 'Coupon has been successfully Generated');
        this.savingData = false;
        this.loading_list = false;
        this.getCouponDetail();
      });
    }
    else
    {
      this.dialog.error( 'Can not Generate more than 2500 coupon codes at once!');

    }
    }

    downloadCoupon(id)
    {
      this.filter.mode = 1;
      this.db.post_rqst(  { 'id':  id }, 'offer/exportCoupon')
      .subscribe( d => {
        this.loading_list = false;
        document.location.href = this.db.myurl+'/app/uploads/exports/coupons.csv';
        //console.log(d);
      });
    }

    deleteCoupon(id) {
      this.dialog.delete('Coupon').then((result) => {
        if(result) {
      this.db.post_rqst({'id': id}, 'offer/deleteCoupon')
      .subscribe(d => {
        //console.log(d);
        this.getCouponDetail();
        this.dialog.successfully();
      });
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
  