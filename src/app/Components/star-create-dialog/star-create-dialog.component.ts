import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Galaxy } from 'src/app/Interfaces/galaxy';
import { Star } from 'src/app/Interfaces/star';

interface dataDialog {
  star: Star,
  galaxyList: Galaxy[]
}

@Component({
  selector: 'app-star-create-dialog',
  templateUrl: './star-create-dialog.component.html',
  styleUrls: ['./star-create-dialog.component.css']
})
export class StarCreateDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<StarCreateDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: dataDialog) { }

    onNoClick(): void {
      this.dialogRef.close();
    }
}
