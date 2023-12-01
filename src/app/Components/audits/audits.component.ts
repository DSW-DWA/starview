import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Audit } from 'src/app/Interfaces/audit';
import { StarService } from 'src/app/Services/star.service';

@Component({
  selector: 'app-audits',
  templateUrl: './audits.component.html',
  styleUrls: ['./audits.component.css']
})
export class AuditsComponent {
  displayedColumns: string[] = ['operationType', 'tableName', 'rowId', 'oldValue', 'newValue', 'timestamp'];
  dataSource = new MatTableDataSource<Audit>([]);
  editElementNum = -1;
  editElementDef: Audit | undefined;

  constructor(
    private auditService: StarService,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    this.getDataSource();
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  getDataSource() {
    this.auditService.getAllAudits().subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
    });
  }
}
