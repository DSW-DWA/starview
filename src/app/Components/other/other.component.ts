import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Universe } from 'src/app/Interfaces/universe';
import { StarService } from 'src/app/Services/star.service';
import { AlertDialogComponent } from '../alert-dialog/alert-dialog.component';
import { Audit } from 'src/app/Interfaces/audit';
import { MatTableDataSource } from '@angular/material/table';
import { ReportsInfo } from 'src/app/Interfaces/ReportsInfo';
import { Galaxy } from 'src/app/Interfaces/galaxy';

@Component({
  selector: 'app-other',
  templateUrl: './other.component.html',
  styleUrls: ['./other.component.css']
})
export class OtherComponent {
  displayedColumns: string[] = ['name', 'shape', 'size', 'stars', 'planets', 'composition'];
  selectedUid: string | undefined;
  universeList: Galaxy[] | undefined;
  wordUrl: string = '';
  excelUrl: string = '';
  auditList: Audit[] | undefined;
  dataSource = new MatTableDataSource<ReportsInfo>([]);
  constructor(
    private universeService: StarService,
    public dialog: MatDialog,
    private http: HttpClient
  ) {}
  
  ngOnInit() {
    this.universeService.getAllGalaxies().subscribe(data => {
      this.universeList = data;
      this.selectedUid = this.universeList[0].id
    });

    this.universeService.getAllAudits().subscribe(data => {
      this.auditList = data;
    })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  generateExcelReport() {
    if (!this.selectedUid) {
      return;
    }
    this.universeService.getAllReports(this.selectedUid).subscribe(data => {
      this.dataSource = new MatTableDataSource<ReportsInfo>([data]);
      this.universeService.getExcelReport(this.selectedUid).subscribe(data => {
        this.excelUrl = "http://localhost:8000" + data.link
      })
    })
  }

  generateWordReport() {
    if (!this.selectedUid) {
      return;
    }

    this.universeService.getAllReports(this.selectedUid).subscribe(data => {
      this.dataSource = new MatTableDataSource<ReportsInfo>([data]);
      this.universeService.getWordReport(this.selectedUid).subscribe(data => {
        this.wordUrl = "http://localhost:8000" + data.link
      })
    })
  }
}
