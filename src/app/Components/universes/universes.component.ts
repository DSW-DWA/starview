import {Component, EventEmitter, AfterViewInit, Output} from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { Universe } from 'src/app/Interfaces/universe';
import { StarService } from 'src/app/Services/star.service';
import { UniverseCreateDialogComponent } from '../universe-create-dialog/universe-create-dialog.component';
import { AlertDialogComponent } from '../alert-dialog/alert-dialog.component';
import { MatTableDataSource } from '@angular/material/table';
import { ViewChild } from '@angular/core';

@Component({
  selector: 'app-universes',
  templateUrl: './universes.component.html',
  styleUrls: ['./universes.component.css']
})
export class UniversesComponent implements AfterViewInit {
  displayedColumns: string[] = ['name', 'size', 'composition', 'actions'];
  dataSource = new MatTableDataSource<Universe>([]);
  editUniverseNum = -1;
  selectedColumn: string = this.displayedColumns[0];

  @Output() popUpEvent = new EventEmitter<string>();

  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(
    private universeService: StarService,
    public dialog: MatDialog
  ) {}

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filterPredicate = (data, filter) =>
      (data[this.selectedColumn]?.toString().toLowerCase().includes(filter) ?? false);
    this.dataSource.filter = filterValue;
  }

  ngAfterViewInit() {
    this.getDataSource();
  }

  deleteUniverse(id: string) {
    let dialogRef = this.dialog.open(AlertDialogComponent, {
      data: {msg: 'Удалить элемент?'}
    })

    dialogRef.afterClosed().subscribe(result => {
      if (result)
      this.universeService.deleteUniverse(id).subscribe(data => {
        this.getDataSource()
        this.popUpEvent.emit('Элемент удален')
      })
    })
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
        this.popUpEvent.emit('Элемент изменен')
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
        this.popUpEvent.emit('Элемент добавлен')
      })
    });
  }

  getDataSource() {
    this.universeService.getAllUniverse().subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.sort = this.sort;
    });
  }
}
