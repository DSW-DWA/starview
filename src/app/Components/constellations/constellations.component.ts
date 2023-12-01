import { Component, OnInit } from '@angular/core';
import { Constellation } from 'src/app/Interfaces/constellation';
import { StarService } from 'src/app/Services/star.service';
import { FormsModule,  NgModel } from "@angular/forms";
import { Galaxy } from 'src/app/Interfaces/galaxy';
import { MatDialog } from '@angular/material/dialog';
import { ConstellationCreateDialogComponent } from '../constellation-create-dialog/constellation-create-dialog.component';
import { AlertDialogComponent } from '../alert-dialog/alert-dialog.component';
import { DataSource } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-constellations',
  templateUrl: './constellations.component.html',
  styleUrls: ['./constellations.component.css']
})
export class ConstellationsComponent implements OnInit {
  displayedColumns: string[] = ['name', 'shape', 'abbreviation', 'history', 'galaxy', 'actions'];
  dataSource = new MatTableDataSource<Constellation>([]);
  editElementNum = -1;
  editElementDef: Constellation | undefined;
  galaxyList: Galaxy[] = [];

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

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
      this.getDataSource()
      this.dialog.open(AlertDialogComponent, {
        data: {msg: 'Элемент удален'}
      })
    })
  }

  editElement(id: number){
    // this.editElementNum = id;
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
        this.dialog.open(AlertDialogComponent, {
          data: {msg: 'Элемент изменен'}
        })
      })
    });
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
        id: '',
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
        this.dialog.open(AlertDialogComponent, {
          data: {msg: 'Элемент добавлен'}
        })
      })
    });
  }
  getDataSource() {
    this.starService.getAllConstellations().subscribe(data => {
      this.dataSource = new MatTableDataSource<Constellation>(data)
    })

    this.starService.getAllGalaxies().subscribe(data => {
      this.galaxyList = data
    })
  }
}
