import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Universe } from 'src/app/Interfaces/universe';
import { StarService } from 'src/app/Services/star.service';
import { AlertDialogComponent } from '../alert-dialog/alert-dialog.component';
import { Audit } from 'src/app/Interfaces/audit';

@Component({
  selector: 'app-other',
  templateUrl: './other.component.html',
  styleUrls: ['./other.component.css']
})
export class OtherComponent {
  selectedUid: string | undefined;
  universeList: Universe[] | undefined;
  wordUrl: string = '';
  excelUrl: string = '';
  auditList: Audit[] | undefined;
  constructor(
    private universeService: StarService,
    public dialog: MatDialog,
    private http: HttpClient
  ) {}
  
  ngOnInit() {
    this.universeService.getAllUniverse().subscribe(data => {
      this.universeList = data;
      this.selectedUid = this.universeList[0].id
    });

    this.universeService.getAllAudits().subscribe(data => {
      this.auditList = data;
    })
  }

  generateExcelReport() {
    if (!this.selectedUid) {
      return;
    }

    this.universeService.getExcelReport(this.selectedUid).subscribe(data => {
      this.dialog.open(AlertDialogComponent, {
        data: {msg: 'Отчет сгенерирован'}
      })
      this.excelUrl = "http://localhost:8000" + data.link
    })
  }

  generateWordReport() {
    if (!this.selectedUid) {
      return;
    }

    this.universeService.getWordReport(this.selectedUid).subscribe(data => {
      this.dialog.open(AlertDialogComponent, {
        data: {msg: 'Отчет сгенерирован'}
      })
      this.wordUrl = "http://localhost:8000" + data.link
    })
  }
}
