import { Component, OnInit } from '@angular/core';
import { Constellation } from 'src/app/Interfaces/constellation';
import { StarService } from 'src/app/Services/star.service';
import { FormsModule,  NgModel } from "@angular/forms";
import { Galaxy } from 'src/app/Interfaces/galaxy';
import { MatDialog } from '@angular/material/dialog';
import { ConstellationCreateDialogComponent } from '../constellation-create-dialog/constellation-create-dialog.component';

@Component({
  selector: 'app-constellations',
  templateUrl: './constellations.component.html',
  styleUrls: ['./constellations.component.css']
})
export class ConstellationsComponent implements OnInit {
  displayedColumns: string[] = ['name', 'shape', 'abbreviation', 'history', 'galaxy', 'actions'];
  dataSource: Constellation[] = [];
  editElementNum = -1;
  editElementDef: Constellation | undefined;
  galaxyList: Galaxy[] = [];
  
  constructor(
    private starService: StarService,
    public dialog: MatDialog
    ){}
  ngOnInit() {
    this.getDataSource()

    this.starService.getAllGalaxies().subscribe(data => {
      this.galaxyList = data
    })
  }

  deleteElement(id: string){
    this.starService.deleteConstellation(id).subscribe(data => {
      console.log(data)
    })

    this.getDataSource()
  }

  editElement(id: number){
    this.editElementNum = id;
    this.editElementDef = this.dataSource[id];
  }

  saveElement(i: number){
    this.starService.updateConstellation(this.dataSource[i].id, this.dataSource[i]).subscribe(data => {
      this.dataSource[i] = data
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
        id: '',
        name: ''
      }
    }
    const dialogRef = this.dialog.open(ConstellationCreateDialogComponent, {
      data: {const: netConst, galaxyList: this.galaxyList},
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);

    });
  }
  getDataSource() {
    this.starService.getAllConstellations().subscribe(data => {
      this.dataSource = data
    })

    this.starService.getAllGalaxies().subscribe(data => {
      this.galaxyList = data
    })
  }
}