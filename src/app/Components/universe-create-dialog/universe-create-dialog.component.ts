import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Universe} from 'src/app/Interfaces/universe';

interface dataDialog {
  universe: Universe
}

@Component({
  selector: 'app-universe-create-dialog',
  templateUrl: './universe-create-dialog.component.html',
  styleUrls: ['./universe-create-dialog.component.css']
})
export class UniverseCreateDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<UniverseCreateDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: dataDialog) { }

    onNoClick(): void {
      this.dialogRef.close();
    }
}
