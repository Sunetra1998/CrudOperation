import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit {
  propertyForm !: FormGroup;
  actionBtn : string = "Save";
  constructor(private formBuilder: FormBuilder, 
    private api: ApiService, 
    @Inject(MAT_DIALOG_DATA) public editData :any,
    private dialogRef: MatDialogRef<DialogComponent>) { }

  ngOnInit(): void {
    this.propertyForm = this.formBuilder.group({
      propertyName : ['', Validators.required],
      description : ['', Validators.required],
      size : ['', Validators.required],
    });
      if(this.editData){
        this.actionBtn = "Update";
        this.propertyForm.controls["propertyName"].setValue(this.editData.propertyName);
        this.propertyForm.controls["description"].setValue(this.editData.description);
        this.propertyForm.controls["size"].setValue(this.editData.size);
      }
  }
  addProperty(){
    if(!this.editData){
      if(this.propertyForm.valid){
        this.api.postProperty(this.propertyForm.value)
        .subscribe({
          next:(res)=>{
            alert("Property added successfully");
            this.propertyForm.reset();
            this.dialogRef.close("save");
          },
          error:()=>{
            alert("Error while adding the  property")
          }
        })
      }
    }else{
      this.updateProperty()
    }
  }
    updateProperty(){
      this.api.putProperty(this.propertyForm.value, this.editData.id)
      .subscribe({
        next:(res)=>{
          console.log("//",res);
          alert("Property updated Successfully");
          this.propertyForm.reset();
          this.dialogRef.close("update");
        },
        error:(err)=>{
          console.log("//",err);
          alert("Error while updating the Property");
        }
      })
    }
  }
