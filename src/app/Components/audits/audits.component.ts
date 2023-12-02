import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { Audit } from 'src/app/Interfaces/audit';
import { StarService } from 'src/app/Services/star.service';

@Component({
  selector: 'app-audits',
  templateUrl: './audits.component.html',
  styleUrls: ['./audits.component.css']
})
export class AuditsComponent implements AfterViewInit {
  displayedColumns: string[] = ['operation_type', 'table_name', 'row_id', 'old_value', 'new_value', 'timestamp'];
  dataSource = new MatTableDataSource<Audit>([]);
  selectedColumn: string = this.displayedColumns[0];

  columnDisplayNames: { [key: string]: string } = {
    operation_type: 'Тип операции',
    table_name: 'Название таблицы',
    row_id: 'Идентификатор строки',
    old_value: 'Старое значение',
    new_value: 'Новое значение',
    timestamp: 'Временная метка'
  };

  @ViewChild(MatSort, { static: true }) sort!: MatSort;

  constructor(
    private auditService: StarService,
    public dialog: MatDialog
  ) {}

  ngAfterViewInit() {
    this.getDataSource();
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filterPredicate = (data: Audit, filter: string) =>
      (data[this.selectedColumn]?.toString().toLowerCase().includes(filter) ?? false);
    this.dataSource.filter = filterValue;
  }

  private getDataSource(): void {
    this.auditService.getAllAudits().subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.sort = this.sort;
    });
  }
}
