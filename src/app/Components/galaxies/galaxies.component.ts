import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Galaxy } from 'src/app/Interfaces/galaxy';
import { Universe } from 'src/app/Interfaces/universe';
import { StarService } from 'src/app/Services/star.service';
import { GalaxyCreateDialogComponent } from '../galaxy-create-dialog/galaxy-create-dialog.component';

@Component({
  selector: 'app-galaxies',
  templateUrl: './galaxies.component.html',
  styleUrls: ['./galaxies.component.css']
})
export class GalaxiesComponent {
  displayedColumns: string[] = ['name', 'size', 'shape', 'composition', 'distance_from_earth', 'universe', 'actions'];
  dataSource: Galaxy[] = [];
  editGalaxyNum = -1;
  editGalaxyDef: Galaxy | undefined;
  universeList: Universe[] = [];

  constructor(
    private starService: StarService,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
    this.getDataSource();

    this.starService.getAllUniverse().subscribe(data => {
      this.universeList = data;
    });
  }

  deleteGalaxy(id: string) {
    this.starService.deleteGalaxy(id).subscribe(data => {
      this.getDataSource()
    });
  }

  editGalaxy(index: number) {
    //this.editGalaxyNum = index;
    let newGalaxy = this.dataSource[index];

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
      })
    });
  }

  saveGalaxy(index: number) {
    this.starService.updateGalaxy(this.dataSource[index].id, this.dataSource[index]).subscribe(data => {
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
        id: '',
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
      })
    });
  }

  getDataSource() {
    this.starService.getAllGalaxies().subscribe(data => {
      this.dataSource = data;
    });

    this.starService.getAllUniverse().subscribe(data => {
      this.universeList = data;
    });
  }
}
