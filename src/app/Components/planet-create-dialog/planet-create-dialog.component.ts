import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Planet } from 'src/app/Interfaces/planet';
import { Star } from 'src/app/Interfaces/star';

interface dataDialog {
  planet: Planet, 
  starList: Star[]
}

@Component({
  selector: 'app-planet-create-dialog',
  templateUrl: './planet-create-dialog.component.html',
  styleUrls: ['./planet-create-dialog.component.css']
})
export class PlanetCreateDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<PlanetCreateDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: dataDialog) { }

    onNoClick(): void {
      this.dialogRef.close();
    }
}
