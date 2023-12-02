import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Constellation} from 'src/app/Interfaces/constellation';
import {Galaxy} from 'src/app/Interfaces/galaxy';

interface dataDialog {
  const: Constellation,
  galaxyList: Galaxy[]
}

@Component({
  selector: 'app-constellation-create-dialog',
  templateUrl: './constellation-create-dialog.component.html',
  styleUrls: ['./constellation-create-dialog.component.css']
})
export class ConstellationCreateDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<ConstellationCreateDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: dataDialog) { }

    onNoClick(): void {
      this.dialogRef.close();
    }
}
