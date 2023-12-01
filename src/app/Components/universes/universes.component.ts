import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Universe } from 'src/app/Interfaces/universe';
import { StarService } from 'src/app/Services/star.service';
import { UniverseCreateDialogComponent } from '../universe-create-dialog/universe-create-dialog.component';
import { AlertDialogComponent } from '../alert-dialog/alert-dialog.component';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-universes',
  templateUrl: './universes.component.html',
  styleUrls: ['./universes.component.css']
})
export class UniversesComponent {
displayedColumns: string[] = ['name', 'size', 'composition', 'actions'];
dataSource = new MatTableDataSource<Universe>([]);
editUniverseNum = -1;
editUniverseDef: Universe | undefined;

constructor(
  private universeService: StarService,
  public dialog: MatDialog
) {}

applyFilter(event: Event) {
  const filterValue = (event.target as HTMLInputElement).value;
  this.dataSource.filter = filterValue.trim().toLowerCase();
}

ngOnInit() {
  this.getDataSource();

  this.universeService.getAllUniverse().subscribe(data => {
    this.dataSource = new MatTableDataSource<Universe>(data);
  });
}

deleteUniverse(id: string) {
  this.universeService.deleteUniverse(id).subscribe(data => {
    this.getDataSource()
    this.dialog.open(AlertDialogComponent, {
      data: {msg: 'Элемент удален'}
    })
  });
}

editUniverse(id: number) {
  //this.editUniverseNum = id;
  let newUniverse = this.dataSource.data[id];

  const dialogRef = this.dialog.open(UniverseCreateDialogComponent, {
    data: { universe: newUniverse },
  });

  dialogRef.afterClosed().subscribe(result => {
    newUniverse.name = result.name
    newUniverse.size = result.size
    newUniverse.composition = result.composition
    this.universeService.updateUniverse(newUniverse.id, newUniverse).subscribe(data => {
      this.getDataSource();
      this.dialog.open(AlertDialogComponent, {
        data: {msg: 'Элемент изменен'}
      })
    })
  });
}

saveUniverse(i: number) {
  this.universeService.updateUniverse(this.dataSource.data[i].id, this.dataSource.data[i]).subscribe(data => {
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
      this.dialog.open(AlertDialogComponent, {
        data: {msg: 'Элемент добавлен'}
      })
    })
  });
}

  getDataSource() {
    this.universeService.getAllUniverse().subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
    });
  }
}
