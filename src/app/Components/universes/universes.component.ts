import {AfterViewInit, Component, EventEmitter, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {MatSort} from '@angular/material/sort';
import {MatDialog} from '@angular/material/dialog';
import {Universe} from 'src/app/Interfaces/universe';
import {StarService} from 'src/app/Services/star.service';
import {UniverseCreateDialogComponent} from '../universe-create-dialog/universe-create-dialog.component';
import {AlertDialogComponent} from '../alert-dialog/alert-dialog.component';
import {MatTableDataSource} from '@angular/material/table';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-universes',
  templateUrl: './universes.component.html',
  styleUrls: ['./universes.component.css']
})
export class UniversesComponent implements AfterViewInit, OnInit, OnDestroy {
  displayedColumns: string[] = ['name', 'size', 'composition', 'actions'];
  dataSource = new MatTableDataSource<Universe>([]);
  editUniverseNum = -1;
  selectedColumn: string = this.displayedColumns[0];

  @Output() popUpEvent = new EventEmitter<string>();

  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(
    private universeService: StarService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
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

  ngOnInit() {
    window.addEventListener('storage', this.handleStorageEvent.bind(this));
  }

  ngOnDestroy() {
    window.removeEventListener('storage', this.handleStorageEvent.bind(this));
  }

  handleStorageEvent(event: StorageEvent) {
    if (event.key === 'update') {
      let snackBarRef = this.snackBar.open('Данные обновлены. Пожалуйста, обновите страницу.', 'Обновить');
      snackBarRef.onAction().subscribe(() => {
        this.getDataSource(); // Перезагрузить данные
      });
      // snackBarRef.dismissWithAction(); // автоматически обновляет страницу
    }
  }

  updateLocalStorage() {
    localStorage.setItem('update', Date.now().toString());
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
        this.updateLocalStorage();
      })
    })
  }

  editUniverse(id: number) {
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
        this.updateLocalStorage();
      })
    });
  }

  saveUniverse(i: number) {
    this.universeService.updateUniverse(this.dataSource.data[i].id, this.dataSource.data[i]).subscribe(data => {
      this.editUniverseNum = -1;
      this.updateLocalStorage();
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
        this.updateLocalStorage();
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
