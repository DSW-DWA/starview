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
      console.log(data);
    });

    this.getDataSource();
  }

  editPlanet(id: number) {
    this.editPlanetNum = id;
    this.editPlanetDef = this.dataSource[id];
  }

  savePlanet(i: number) {
    this.planetService.updatePlanet(this.dataSource[i].id, this.dataSource[i]).subscribe(data => {
      this.dataSource[i] = data;
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
      console.log(result);
      // Perform actions with the result if needed
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
