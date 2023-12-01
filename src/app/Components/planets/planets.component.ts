import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Planet } from 'src/app/Interfaces/planet';
import { Star } from 'src/app/Interfaces/star';
import { StarService } from 'src/app/Services/star.service';
import { PlanetCreateDialogComponent } from '../planet-create-dialog/planet-create-dialog.component';

@Component({
  selector: 'app-planets',
  templateUrl: './planets.component.html',
  styleUrls: ['./planets.component.css']
})
export class PlanetsComponent {
  displayedColumns: string[] = ['name', 'mass', 'diameter', 'distance_from_star', 'surface_temperature', 'star', 'actions'];
  dataSource: Planet[] = [];
  editPlanetNum = -1;
  editPlanetDef: Planet | undefined;
  starList: Star[] = [];

  constructor(
    private planetService: StarService,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    this.getDataSource();

    this.planetService.getAllStars().subscribe(data => {
      this.starList = data;
    });
  }

  deletePlanet(id: string) {
    this.planetService.deletePlanet(id).subscribe(data => {
      this.getDataSource()
    });
  }

  editPlanet(id: number) {
    //this.editPlanetNum = id;
    let newPlanet = this.dataSource[id];

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
      })
    });
  }

  savePlanet(i: number) {
    this.planetService.updatePlanet(this.dataSource[i].id, this.dataSource[i]).subscribe(data => {
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
        id: '',
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
      })
    });
  }

  getDataSource() {
    this.planetService.getAllPlanets().subscribe(data => {
      this.dataSource = data;
    });

    this.planetService.getAllStars().subscribe(data => {
      this.starList = data;
    });
  }
}
