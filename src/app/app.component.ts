import { Component, OnInit, ViewChild } from '@angular/core';
import {MatDialog, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { DialogComponent } from './dialog/dialog.component';
import { ApiService } from './services/api.service';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'CrudOperation';
  displayedColumns: string[] = ['propertyName', 'description', 'size', 'action'];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private dialog: MatDialog, private api: ApiService){

  }
  ngOnInit(): void {
    this.getAllProperty();
  }

  openDialog() {
    this.dialog.open(DialogComponent, {
     width:"40%"
    }).afterClosed().subscribe((value)=>{
      if(value === 'save'){
        this.getAllProperty();
      }
    })
  }

  getAllProperty(){
    this.api.getProperty()
    .subscribe({
      next:(res)=>{
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error:(err)=>{
        alert("Error while fetching the properties!!");
      }
    })
  }

  editProperty(row : any){
    this.dialog.open(DialogComponent,{
      width:"40%",
      data:row
    }).afterClosed().subscribe(value=>{
      if(value === 'update'){
        this.getAllProperty();
      }
    })
  }

  deleteProperty(id:number){
    this.api.deleteProperty(id).subscribe({
      next:(res)=>{
        alert("Deleted Successfully");
        this.getAllProperty();
      },
      error:()=>{
        alert("Error while deleting the property!");
      }
    })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
