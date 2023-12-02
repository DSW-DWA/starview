import {Component, EventEmitter, AfterViewInit, Output, ViewChild, OnInit, OnDestroy} from '@angular/core';
import { MatSort } from "@angular/material/sort";
import { MatDialog } from '@angular/material/dialog';
import { Galaxy } from 'src/app/Interfaces/galaxy';
import { Universe } from 'src/app/Interfaces/universe';
import { StarService } from 'src/app/Services/star.service';
import { GalaxyCreateDialogComponent } from '../galaxy-create-dialog/galaxy-create-dialog.component';
import { AlertDialogComponent } from '../alert-dialog/alert-dialog.component';
import { MatTableDataSource } from '@angular/material/table';
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-galaxies',
  templateUrl: './galaxies.component.html',
  styleUrls: ['./galaxies.component.css']
})
export class GalaxiesComponent implements AfterViewInit, OnInit, OnDestroy {
  displayedColumns: string[] = ['name', 'size', 'shape', 'composition', 'distance_from_earth', 'universe', 'actions'];
  dataSource = new MatTableDataSource<Galaxy>([]);
  editGalaxyNum = -1;
  universeList: Universe[] = [];
  @Output() popUpEvent = new EventEmitter<string>();
  selectedColumn: string = this.displayedColumns[0];

  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(
    private starService: StarService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
  ) { }

  ngAfterViewInit() {
    this.getDataSource();
    this.starService.getAllUniverse().subscribe(data => {
      this.universeList = data;
    });
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

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filterPredicate = (data, filter) =>
      (data[this.selectedColumn]?.toString().toLowerCase().includes(filter) ?? false);
    this.dataSource.filter = filterValue;
  }

  deleteGalaxy(id: string) {
    let dialogRef = this.dialog.open(AlertDialogComponent, {
      data: {msg: 'Удалить элемент?'}
    })

    dialogRef.afterClosed().subscribe(result => {
      if (result)
      this.starService.deleteGalaxy(id).subscribe(data => {
        this.getDataSource()
        this.popUpEvent.emit('Элемент удален')
        this.updateLocalStorage();
      })
    })
  }

  editGalaxy(index: number) {
    let newGalaxy = this.dataSource.data[index];

    const dialogRef = this.dialog.open(GalaxyCreateDialogComponent, {
      data: { galaxy: newGalaxy, universeList: this.universeList },
    });

    dialogRef.afterClosed().subscribe(result => {
      newGalaxy.name = result.name
      newGalaxy.size = result.size
      newGalaxy.shape = result.shape
      newGalaxy.composition = result.composition
      newGalaxy.distance_from_earth = result.distance_from_earth
      newGalaxy.universe = result.universe

      this.starService.updateGalaxy(newGalaxy.id,newGalaxy).subscribe(data => {
        this.getDataSource();
        this.popUpEvent.emit('Элемент изменен')
        this.updateLocalStorage();
      })
    });
  }

  saveGalaxy(index: number) {
    this.starService.updateGalaxy(this.dataSource.data[index].id, this.dataSource.data[index]).subscribe(data => {
      this.getDataSource();
      this.editGalaxyNum = -1;
    });
  }

  addGalaxy() {
    let newGalaxy: Galaxy = {
      id: '',
      name: '',
      size: 0,
      shape: '',
      composition: '',
      distance_from_earth: 0,
      universe: {
        id: this.universeList[0].id,
        name: '',
        size: 0,
        composition: ''
      }
    };

    const dialogRef = this.dialog.open(GalaxyCreateDialogComponent, {
      data: { galaxy: newGalaxy, universeList: this.universeList },
    });

    dialogRef.afterClosed().subscribe(result => {
      newGalaxy.name = result.name
      newGalaxy.size = result.size
      newGalaxy.shape = result.shape
      newGalaxy.composition = result.composition
      newGalaxy.distance_from_earth = result.distance_from_earth
      newGalaxy.universe = result.universe

      this.starService.addGalaxy(newGalaxy).subscribe(data => {
        this.getDataSource();
        this.popUpEvent.emit('Элемент добавлен')
        this.updateLocalStorage();
      })
    });
  }

  getDataSource() {
    this.starService.getAllGalaxies().subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.sort = this.sort;
    });

    this.starService.getAllUniverse().subscribe(data => {
      this.universeList = data;
      this.dataSource.sort = this.sort;
    });
  }
}
