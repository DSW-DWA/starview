import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Universe } from 'src/app/Interfaces/universe';
import { StarService } from 'src/app/Services/star.service';
import { UniverseCreateDialogComponent } from '../universe-create-dialog/universe-create-dialog.component';

@Component({
  selector: 'app-universes',
  templateUrl: './universes.component.html',
  styleUrls: ['./universes.component.css']
})
export class UniversesComponent {
  displayedColumns: string[] = ['name', 'size', 'composition', 'actions'];
dataSource: Universe[] = [];
editUniverseNum = -1;
editUniverseDef: Universe | undefined;

constructor(
  private universeService: StarService,
  public dialog: MatDialog
) {}

ngOnInit() {
  this.getDataSource();

  this.universeService.getAllUniverse().subscribe(data => {
    this.dataSource = data;
  });
}

deleteUniverse(id: string) {
  this.universeService.deleteUniverse(id).subscribe(data => {
    this.getDataSource()
  });
}

editUniverse(id: number) {
  //this.editUniverseNum = id;
  let newUniverse = this.dataSource[id];

  const dialogRef = this.dialog.open(UniverseCreateDialogComponent, {
    data: { universe: newUniverse },
  });

  dialogRef.afterClosed().subscribe(result => {
    newUniverse.name = result.name
    newUniverse.size = result.size
    newUniverse.composition = result.composition
    this.universeService.updateUniverse(newUniverse.id, newUniverse).subscribe(data => {
      this.getDataSource();
    })
  });
}

saveUniverse(i: number) {
  this.universeService.updateUniverse(this.dataSource[i].id, this.dataSource[i]).subscribe(data => {
    this.dataSource[i] = data;
    this.editUniverseNum = -1;
  });
}

addUniverse() {
  let newUniverse: Universe = {
    id: '',
    name: '',
    size: 0,
    composition: ''
  };
  const dialogRef = this.dialog.open(UniverseCreateDialogComponent, {
    data: { universe: newUniverse },
  });

  dialogRef.afterClosed().subscribe(result => {
    newUniverse.name = result.name
    newUniverse.size = result.size
    newUniverse.composition = result.composition
    this.universeService.addUniverse(newUniverse).subscribe(data => {
      this.getDataSource();
    })
  });
}

  getDataSource() {
    this.universeService.getAllUniverse().subscribe(data => {
      this.dataSource = data;
    });
  }
}
