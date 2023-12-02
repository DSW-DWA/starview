import {AfterViewInit, Component, EventEmitter, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {Galaxy} from 'src/app/Interfaces/galaxy';
import {Star} from 'src/app/Interfaces/star';
import {StarService} from 'src/app/Services/star.service';
import {StarCreateDialogComponent} from '../star-create-dialog/star-create-dialog.component';
import {AlertDialogComponent} from '../alert-dialog/alert-dialog.component';
import {MatTableDataSource} from '@angular/material/table';
import {MatSort} from "@angular/material/sort";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-stars',
  templateUrl: './stars.component.html',
  styleUrls: ['./stars.component.css']
})
export class StarsComponent implements AfterViewInit, OnInit, OnDestroy {
  displayedColumns: string[] = ['name', 'spectral_type', 'luminosity', 'distance_from_earth', 'temperature', 'galaxy', 'actions'];
  dataSource = new MatTableDataSource<Star>([]);
  editElementNum = -1;
  galaxyList: Galaxy[] = [];
  @Output() popUpEvent = new EventEmitter<string>();
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  selectedColumn: string = this.displayedColumns[0];

  constructor(
    private starService: StarService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
  ){}

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

  getDataSource() {
    this.starService.getAllStars().subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.sort = this.sort;
    });

    this.starService.getAllGalaxies().subscribe(data => {
      this.galaxyList = data;
      this.dataSource.sort = this.sort;
    });
  }

  deleteElement(id: string){
    let dialogRef = this.dialog.open(AlertDialogComponent, {
      data: {msg: 'Удалить элемент?'}
    })

    dialogRef.afterClosed().subscribe(result => {
      if (result)
      this.starService.deleteStar(id).subscribe(data => {
        this.getDataSource()
        this.popUpEvent.emit('Элемент удален')
        this.updateLocalStorage();
      })
    })
  }

  editElement(id: number){
    let netStar = this.dataSource.data[id];

    const dialogRef = this.dialog.open(StarCreateDialogComponent, {
      data: {star: netStar, galaxyList: this.galaxyList},
    });

    dialogRef.afterClosed().subscribe(result => {
      netStar.name = result.name
      netStar.spectral_type = result.spectral_type
      netStar.luminosity = result.luminosity
      netStar.distance_from_earth = result.distance_from_earth
      netStar.temperature = result.temperature
      netStar.galaxy = result.galaxy
      this.starService.updateStar(netStar.id, netStar).subscribe(data => {
        this.getDataSource()
        this.popUpEvent.emit('Элемент изменен')
        this.updateLocalStorage();
      })
    });
  }

  saveElement(i: number){
    this.starService.updateStar(this.dataSource.data[i].id, this.dataSource.data[i]).subscribe(data => {
      this.getDataSource()
      this.editElementNum = -1;
    });
  }

  addElement() {
    let netStar: Star = {
      id: '',
      name: '',
      spectral_type: '',
      luminosity: 0,
      distance_from_earth: 0,
      temperature: 0,
      galaxy: {
        id: this.galaxyList[0].id,
        name: ''
      }
    };
    const dialogRef = this.dialog.open(StarCreateDialogComponent, {
      data: {star: netStar, galaxyList: this.galaxyList},
    });

    dialogRef.afterClosed().subscribe(result => {
      netStar.name = result.name
      netStar.spectral_type = result.spectral_type
      netStar.luminosity = result.luminosity
      netStar.distance_from_earth = result.distance_from_earth
      netStar.temperature = result.temperature
      netStar.galaxy = result.galaxy
      this.starService.addStar(netStar).subscribe(data => {
        this.getDataSource()
        this.popUpEvent.emit('Элемент добавлен')
        this.updateLocalStorage();
      })
    });
  }
}
