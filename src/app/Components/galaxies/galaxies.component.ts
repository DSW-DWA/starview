import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Galaxy } from 'src/app/Interfaces/galaxy';
import { Universe } from 'src/app/Interfaces/universe';
import { StarService } from 'src/app/Services/star.service';
import { GalaxyCreateDialogComponent } from '../galaxy-create-dialog/galaxy-create-dialog.component';
import { AlertDialogComponent } from '../alert-dialog/alert-dialog.component';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-galaxies',
  templateUrl: './galaxies.component.html',
  styleUrls: ['./galaxies.component.css']
})
export class GalaxiesComponent {
  displayedColumns: string[] = ['name', 'size', 'shape', 'composition', 'distance_from_earth', 'universe', 'actions'];
  dataSource = new MatTableDataSource<Galaxy>([]);
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
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  deleteGalaxy(id: string) {
    this.starService.deleteGalaxy(id).subscribe(data => {
      this.getDataSource()
      this.dialog.open(AlertDialogComponent, {
        data: {msg: 'Элемент удален'}
      })
    });
  }

  editGalaxy(index: number) {
    //this.editGalaxyNum = index;
    let newGalaxy = this.dataSource.data[index];

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
        this.dialog.open(AlertDialogComponent, {
          data: {msg: 'Элемент изменен'}
        })
      })
    });
  }

  saveGalaxy(index: number) {
    this.starService.updateGalaxy(this.dataSource.data[index].id, this.dataSource.data[index]).subscribe(data => {
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
        this.dialog.open(AlertDialogComponent, {
          data: {msg: 'Элемент добавлен'}
        })
      })
    });
  }

  getDataSource() {
    this.starService.getAllGalaxies().subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
    });

    this.starService.getAllUniverse().subscribe(data => {
      this.universeList = data;
    });
  }
}
