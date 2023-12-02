import {Component, OnInit} from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';

import { StarService } from 'src/app/Services/star.service';
import { Galaxy } from 'src/app/Interfaces/galaxy';
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-other',
  templateUrl: './other.component.html',
  styleUrls: ['./other.component.css']
})
export class OtherComponent implements OnInit {
  displayedColumns: string[] = ['name', 'shape', 'size', 'stars', 'planets', 'composition'];
  selectedUid: string | undefined;
  galaxyList: Galaxy[] | undefined;
  dataSource = new MatTableDataSource<GalaxyTableData>();

  constructor(
    private universeService: StarService,
    public dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.loadGalaxies();
  }

  private loadGalaxies(): void {
    this.universeService.getAllGalaxies().subscribe(data => {
      this.galaxyList = data;
      if (this.galaxyList?.length > 0) {
        this.selectFirstGalaxy();
      }
    });
  }

  private selectFirstGalaxy(): void {
    this.selectedUid = this.galaxyList[0].id;
    this.loadGalaxyData(this.selectedUid);
  }

  loadGalaxyData(galaxyId: string): void {
    this.universeService.getAllReports(galaxyId).subscribe(data => {
      this.dataSource.data = this.formatTableData(data);
    });
  }

  private formatTableData(data: any): GalaxyTableData[] { // Update the 'any' type with an appropriate type
    return [
      { category: 'Название галактики', description: data.name },
      { category: 'Тип галактики', description: data.shape },
      { category: 'Размер галактики', description: `${data.size} млн. км` },
      { category: 'Основные звезды', description: data.stars },
      { category: 'Известные планеты', description: data.planets },
      { category: 'Состав', description: data.composition }
    ];
  }

  generateExcelReport(galaxyId: string): void {
    this.universeService.getExcelReport(galaxyId).subscribe(data => {
      window.open("http://localhost:8000" + data.link, "_blank");
    });
  }

  generateWordReport(galaxyId: string): void {
    this.universeService.getWordReport(galaxyId).subscribe(data => {
      window.open("http://localhost:8000" + data.link, "_blank");
    });
  }
}

export interface GalaxyTableData {
  category: string;
  description: string;
}
