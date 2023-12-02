import {AfterViewInit, Component, EventEmitter, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {Constellation} from 'src/app/Interfaces/constellation';
import {StarService} from 'src/app/Services/star.service';
import {Galaxy} from 'src/app/Interfaces/galaxy';
import {MatDialog} from '@angular/material/dialog';
import {ConstellationCreateDialogComponent} from '../constellation-create-dialog/constellation-create-dialog.component';
import {AlertDialogComponent} from '../alert-dialog/alert-dialog.component';
import {MatTableDataSource} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-constellations',
  templateUrl: './constellations.component.html',
  styleUrls: ['./constellations.component.css']
})
export class ConstellationsComponent implements AfterViewInit, OnInit, OnDestroy {
  displayedColumns: string[] = ['name', 'shape', 'abbreviation', 'history', 'galaxy', 'actions'];
  dataSource = new MatTableDataSource<Constellation>([]);
  editElementNum = -1;
  galaxyList: Galaxy[] = [];
  selectedColumn: string = this.displayedColumns[0];

  @ViewChild(MatSort)sort: MatSort;
  @Output() popUpEvent = new EventEmitter<string>();

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filterPredicate = (data, filter) =>
      (data[this.selectedColumn]?.toString().toLowerCase().includes(filter) ?? false);
    this.dataSource.filter = filterValue;
  }

  constructor(
    private starService: StarService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    ){}

  ngAfterViewInit() {
    this.getDataSource()
  }

  deleteElement(id: string){
    let dialogRef = this.dialog.open(AlertDialogComponent, {
      data: {msg: 'Удалить элемент?'}
    })

    dialogRef.afterClosed().subscribe(result => {
      if (result)
      this.starService.deleteConstellation(id).subscribe(data => {
        this.getDataSource()
        this.popUpEvent.emit('Элемент удален')
      })
    })
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

  editElement(id: number){
    let netConst = this.dataSource.data[id];

    const dialogRef = this.dialog.open(ConstellationCreateDialogComponent, {
      data: {const: netConst, galaxyList: this.galaxyList},
    });

    dialogRef.afterClosed().subscribe(result => {
      netConst.name = result.name
      netConst.shape = result.shape
      netConst.abbreviation = result.abbreviation
      netConst.history = result.history
      netConst.galaxy = result.galaxy
      this.starService.updateConstellation(netConst.id, netConst).subscribe(data => {
        this.getDataSource()
        this.popUpEvent.emit('Элемент изменен')
        this.updateLocalStorage();
      })
    })
  }

  saveElement(i: number){
    this.starService.updateConstellation(this.dataSource.data[i].id, this.dataSource.data[i]).subscribe(data => {
      this.getDataSource()
      this.editElementNum = -1;
    })

  }

  addElement() {
    let netConst: Constellation = {
      id: '',
      name: '',
      shape: '',
      abbreviation: '',
      history: '',
      galaxy: {
        id: this.galaxyList[0].id,
        name: ''
      }
    }
    const dialogRef = this.dialog.open(ConstellationCreateDialogComponent, {
      data: {const: netConst, galaxyList: this.galaxyList},
    });

    dialogRef.afterClosed().subscribe(result => {
      netConst.name = result.name
      netConst.shape = result.shape
      netConst.abbreviation = result.abbreviation
      netConst.history = result.history
      netConst.galaxy = result.galaxy
      this.starService.addConstellation(netConst).subscribe(data => {
        this.getDataSource()
        this.popUpEvent.emit('Элемент добавлен')
        this.updateLocalStorage();
      })
    });
  }
  getDataSource() {
    this.starService.getAllConstellations().subscribe(data => {
      this.dataSource = new MatTableDataSource<Constellation>(data)
      this.dataSource.sort = this.sort
    })

    this.starService.getAllGalaxies().subscribe(data => {
      this.galaxyList = data
    })
  }
}
