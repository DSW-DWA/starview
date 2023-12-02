import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

interface dataDialog {
  msg: String
}

@Component({
  selector: 'app-alert-dialog',
  templateUrl: './alert-dialog.component.html',
  styleUrls: ['./alert-dialog.component.css']
})
export class AlertDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<AlertDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: dataDialog) { }

    onNoClick(): void {
      this.dialogRef.close();
    }
    //
    // ngOnInit(): void {
    //   // setTimeout(() => {
    //   //   this.dialogRef.close();
    //   // }, 3000);
    // }
}
