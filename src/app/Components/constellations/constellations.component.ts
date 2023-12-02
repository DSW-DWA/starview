import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { Constellation } from 'src/app/Interfaces/constellation';
import { StarService } from 'src/app/Services/star.service';
import { Galaxy } from 'src/app/Interfaces/galaxy';
import { MatDialog } from '@angular/material/dialog';
import { ConstellationCreateDialogComponent } from '../constellation-create-dialog/constellation-create-dialog.component';
import { AlertDialogComponent } from '../alert-dialog/alert-dialog.component';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import {Audit} from "../../Interfaces/audit";

@Component({
  selector: 'app-constellations',
  templateUrl: './constellations.component.html',
  styleUrls: ['./constellations.component.css']
})
export class ConstellationsComponent implements OnInit {
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
    public dialog: MatDialog
    ){}
  ngOnInit() {
    this.getDataSource()

    this.starService.getAllGalaxies().subscribe(data => {
      this.galaxyList = data
    })
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
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
