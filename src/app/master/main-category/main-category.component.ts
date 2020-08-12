import {Component,OnInit} from '@angular/core';
import {DatabaseService} from '../../_services/DatabaseService';
import {ActivatedRoute, Router} from '@angular/router';
import {DialogComponent} from '../../dialog/dialog.component';
import {SessionStorage} from '../../_services/SessionService';
import { ProductImageModuleComponent } from '../product-image-module/product-image-module.component';
import { MatDialog } from '@angular/material';
import { CategoryModelComponent } from '../category-model/category-model.component';

@Component({
    selector: 'app-main-category',
    templateUrl: './main-category.component.html',
})
export class MainCategoryComponent implements OnInit {
    
    // toggle = false;
    savingData = false;
    category: any = {};
    loading_list = false;
    total_categories:any = 0;
    categories:any =[];
    sub_categories:any =[];
    last_page: number ;
    current_page = 1;
    search: any = '';
    source: any = '';
    searchData = true;
    isInvoiceDataExist = false;
    filter:any = {};
    filtering : any = false;
    toggle:any;
    toggle1:any;
    selected_image :any = [];
    
    
    
    
    constructor(public db: DatabaseService, private route: ActivatedRoute, private router: Router, public ses: SessionStorage,public dialog: DialogComponent, public alrt:MatDialog) {}
    
    ngOnInit() {
        this.getCategoryList();
        this.getSubCategoryList();
        this.category.image = [];
    }
    
    
    redirect_previous() {
        this.current_page--;
        this.getCategoryList();
        this.getSubCategoryList();
        
    }
    
    redirect_next() {
        if (this.current_page < this.last_page) { this.current_page++; }
        else { this.current_page = 1; }
        this.getCategoryList();
        this.getSubCategoryList();
        
    }
    
    editCategory(main_category)
    {
        console.log(this.categories);
        this.category = this.categories.filter( x => x.main_category == main_category)[0];    
        console.log(this.category);
    }
    
    savecategory(form:any)
    {
        console.log(this.category.id);
        this.savingData = true;
        this.db.post_rqst( { 'category' : this.category }, 'master/addMainCategorynew')
        .subscribe( d => {
            this.savingData = false;
            console.log( d );
            
            this.toggle = "false"
            console.log(this.selected_image);
            
            this.router.navigate(['main-catefory-list']);
            this.dialog.success( 'Main Category successfully save');
            this.getCategoryList();
        });
    }
    
    addCategory()
    {
        this.category={};
        //console.log("dscds");
        
    }
    
    catdata:any='';
    
    
    getData:any = {};
    getCategoryList() {
        //console.log(this.db.datauser);
        
        this.loading_list = true;
        if( this.filter.date || this.filter.location_id )this.filtering = true;
        this.db.post_rqst({ 'filter': this.filter}, 'master/mainCategoryForProduct' )
        .subscribe(d => {
            //console.log(d);
            
            this.loading_list = false;
            //console.log(this.loading_list);
            
            
            this.categories = d.category;
            // this.selected_image=d.categories.image;
            
            //console.log( this.categories );
            
        });
    }
    
    
    onUploadChange1(evt: any) {
        console.log(evt);
        const file = evt.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = this.handleReaderLoaded1.bind(this);
            reader.readAsBinaryString(file);
            console.log(reader);
            console.log('in if')
        }
        
    }
    onUploadChange(evt: any) {
        console.log(evt);
        const file = evt.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = this.handleReaderLoaded1.bind(this);
            reader.readAsBinaryString(file);
            console.log(reader);
            console.log('in if')
        }
    }
    handleReaderLoaded1(e) {
        this.category.image = 'data:image/png;base64,' + btoa(e.target.result) ;
        console.log(this.category.image)
        console.log(this.selected_image)
    }
    
    deleteProduct(main_category) {
        this.dialog.delete('Category').then((result) => {
            if(result) {
                this.db.post_rqst({main_category : main_category}, 'master/addMainCategoryImageDelete')
                .subscribe(d => {
                    console.log(d);
                    this.getCategoryList();
                    this.dialog.successfully();
                });
            }
        });
    } 
    
    deleteProductImage(index)
    {
        this.category.image.splice(index,1)
    }
    
    
    active:any='';
    ProductProfile(index)
    {
        this.active=index;
        this.category.profile_selected=index;
    }
    openDialog(id ,string ) {
        
        const dialogRef = this.alrt.open(ProductImageModuleComponent,{
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
    
    exportMainCategory()
    {
        this.filter.mode = 1;
        this.db.post_rqst(  {'filter': this.filter , 'login':this.db.datauser}, 'master/exportMainCategory')
        .subscribe( d => {
            document.location.href = this.db.myurl+'/app/uploads/exports/MainCategory.csv';
            //console.log(d);
        });
    }
    
    
    getSubCategoryList() {
        //console.log(this.db.datauser);
        
        this.loading_list = true;
        if( this.filter.date || this.filter.location_id )this.filtering = true;
        this.db.post_rqst({ 'filter': this.filter}, 'master/categoryList' )
        .subscribe(d => {
            //console.log(d);
            
            this.loading_list = false;
            //console.log(this.loading_list);
            
            
            this.sub_categories = d.categories;
            this.selected_image=d.categories.image;
            
            console.log( this.categories );
            
        });
    }
    
    
    addSubCategory(main_category)
    {
        this.category={};
        this.category.main_category = main_category;
        
    }
    
    editSubCategory(id,index)
    {
        console.log(this.sub_categories   ,id );
        this.category = this.sub_categories.filter( x => x.id==id)[0];
        this.category.profile_selected = 0;
        
        this.selected_image = [];
        for(let i=0;i<this.category.image.length;i++)
        {
            
            if( parseInt( this.category.image[i].profile ) == 1  )
            {
                
                this.category.profile_selected = i;
            }
            this.selected_image.push(this.category.image[i].image);
        }
        
        
    }
    
    
    saveSubcategory(form:any)
    {
        console.log(this.category.image);
        this.savingData = true;
        if(this.category.id){
            this.category.edit_cat_id = this.category.id;
        }
        this.category.created_by = this.db.datauser.id;
        
        // this.category.image = this.selected_image ? this.selected_image : [];
        // console.log(this.selected_image);
        console.log(this.category.image);
        this.db.insert_rqst( { 'category' : this.category ,'created_by':this.db.datauser.id }, 'master/addCategory')
        .subscribe( (d) => {
            this.savingData = false;
            //console.log( d );
            if(d['status'] == 'EXIST' ){
                this.dialog.error( 'This Category Already exists');
                return;
            }
            this.toggle1 = "false";
            this.selected_image=[];
            //console.log(this.selected_image);
            
            this.router.navigate(['main-catefory-list']);
            this.dialog.success( 'Category successfully save');
            this.getCategoryList();
        });
    }
    
    deleteSubCategory(id) {
        this.dialog.delete('Sub Category').then((result) => {
            if(result) {
                this.db.post_rqst({category_id : id}, 'master/categoryDelete')
                .subscribe(d => {
                    console.log(d);
                    this.getCategoryList();
                    this.dialog.successfully();
                });
            }
        });
    } 
    
    clearData()
    {
        //console.log('close');
        this.selected_image=[];
    }
    
    deleteSubCategoryImage(index)
    {
        this.selected_image.splice(index,1)
    }  
    
}
