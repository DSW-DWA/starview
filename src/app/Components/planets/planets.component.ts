import {AfterViewInit, Component, EventEmitter, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Planet } from 'src/app/Interfaces/planet';
import { Star } from 'src/app/Interfaces/star';
import { StarService } from 'src/app/Services/star.service';
import { PlanetCreateDialogComponent } from '../planet-create-dialog/planet-create-dialog.component';
import { AlertDialogComponent } from '../alert-dialog/alert-dialog.component';
import { MatTableDataSource } from '@angular/material/table';
import {MatSort} from "@angular/material/sort";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-planets',
  templateUrl: './planets.component.html',
  styleUrls: ['./planets.component.css']
})
export class PlanetsComponent implements AfterViewInit, OnInit, OnDestroy {
  displayedColumns: string[] = ['name', 'mass', 'diameter', 'distance_from_star', 'surface_temperature', 'star', 'actions'];
  dataSource = new MatTableDataSource<Planet>([]);
  editPlanetNum = -1;
  starList: Star[] = [];
  selectedColumn: string = this.displayedColumns[0];
  @Output() popUpEvent = new EventEmitter<string>();

  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(
    private planetService: StarService,
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

  deletePlanet(id: string) {
    let dialogRef = this.dialog.open(AlertDialogComponent, {
      data: {msg: 'Удалить элемент?'}
    })

    dialogRef.afterClosed().subscribe(result => {
      if (result)
      this.planetService.deletePlanet(id).subscribe(data => {
        this.getDataSource()
        this.popUpEvent.emit('Элемент удален')
        this.updateLocalStorage();
      })
    })
  }

  editPlanet(id: number) {
    let newPlanet = this.dataSource.data[id];

    const dialogRef = this.dialog.open(PlanetCreateDialogComponent, {
      data: { planet: newPlanet, starList: this.starList }
    });

    dialogRef.afterClosed().subscribe(result => {
      newPlanet.name = result.name
      newPlanet.mass = result.mass
      newPlanet.diameter = result.diameter
      newPlanet.distance_from_star = result.distance_from_star
      newPlanet.surface_temperature = result.surface_temperature
      newPlanet.star = result.star

      this.planetService.updatePlanet(newPlanet.id, newPlanet).subscribe(data => {
        this.getDataSource()
        this.popUpEvent.emit('Элемент изменен')
        this.updateLocalStorage();
      })
    });
  }

  savePlanet(i: number) {
    this.planetService.updatePlanet(this.dataSource.data[i].id, this.dataSource.data[i]).subscribe(data => {
      this.getDataSource()
      this.editPlanetNum = -1;
    });
  }

  addPlanet() {
    let newPlanet: Planet = {
      id: '',
      name: '',
      mass: 0,
      diameter: 0,
      distance_from_star: 0,
      surface_temperature: 0,
      star: {
        id: this.starList[0].id,
        name: ''
      }
  };

    const dialogRef = this.dialog.open(PlanetCreateDialogComponent, {
      data: { planet: newPlanet, starList: this.starList }
    });

    dialogRef.afterClosed().subscribe(result => {
      newPlanet.name = result.name
      newPlanet.mass = result.mass
      newPlanet.diameter = result.diameter
      newPlanet.distance_from_star = result.distance_from_star
      newPlanet.surface_temperature = result.surface_temperature
      newPlanet.star = result.star

      this.planetService.addPlanet(newPlanet).subscribe(data => {
        this.getDataSource()
        this.popUpEvent.emit('Элемент добавлен')
        this.updateLocalStorage();
      })
    });
  }

  getDataSource() {
    this.planetService.getAllPlanets().subscribe(data => {
      this.dataSource = new MatTableDataSource<Planet>(data);
      this.dataSource.sort = this.sort;
    });

    this.planetService.getAllStars().subscribe(data => {
      this.starList = data;
      this.dataSource.sort = this.sort;
    });
  }
}
