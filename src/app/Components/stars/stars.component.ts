import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Galaxy } from 'src/app/Interfaces/galaxy';
import { Star } from 'src/app/Interfaces/star';
import { StarService } from 'src/app/Services/star.service';
import { StarCreateDialogComponent } from '../star-create-dialog/star-create-dialog.component';

@Component({
  selector: 'app-stars',
  templateUrl: './stars.component.html',
  styleUrls: ['./stars.component.css']
})
export class StarsComponent {
  displayedColumns: string[] = ['name', 'spectral_type', 'luminosity', 'distance_from_earth', 'temperature', 'galaxy', 'actions'];
  dataSource: Star[] = [];
  editElementNum = -1;
  editElementDef: Star | undefined;
  galaxyList: Galaxy[] = [];
  
  constructor(
    private starService: StarService,
    public dialog: MatDialog
  ){}

  ngOnInit() {
    this.getDataSource();

    this.starService.getAllGalaxies().subscribe(data => {
      this.galaxyList = data;
    });
  }

  deleteElement(id: string){
    this.starService.deleteStar(id).subscribe(data => {
      this.getDataSource()
    });
  }

  editElement(id: number){
    //this.editElementNum = id;
    let netStar = this.dataSource[id];

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
      })
    });
  }

  saveElement(i: number){
    this.starService.updateStar(this.dataSource[i].id, this.dataSource[i]).subscribe(data => {
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
        id: '',
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
      })
    });
  }

  getDataSource() {
    this.starService.getAllStars().subscribe(data => {
      this.dataSource = data;
    });

    this.starService.getAllGalaxies().subscribe(data => {
      this.galaxyList = data;
    });
  }
}
