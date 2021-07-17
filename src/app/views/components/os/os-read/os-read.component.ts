import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { OS } from 'src/app/models/os';
import { ClienteService } from 'src/app/services/cliente.service';
import { OsService } from 'src/app/services/os.service';
import { TecnicoService } from 'src/app/services/tecnico.service';

@Component({
  selector: 'app-os-read',
  templateUrl: './os-read.component.html',
  styleUrls: ['./os-read.component.css']
})
export class OsReadComponent implements AfterViewInit {

  listaOs: OS[] = [];

  displayedColumns: string[] = ['tecnico', 'cliente', 'abertura', 'prioridade', 'status', 'action'];
  dataSource = new MatTableDataSource<OS>(this.listaOs); //somente para o paginator

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private service: OsService,
    private router: Router,
    private tecnicoService: TecnicoService,
    private clienteService: ClienteService
  ) { }

  ngAfterViewInit() {
    this.findAll();
  }

  findAll(): void {
    this.service.findAll().subscribe((resposta) => {
      resposta.forEach(x => {
        if (x.status != "ENCERRADO") {
          this.listaOs.push(x);
        }
      })
      //this.listaOs = resposta;
      this.listarTecnicos();
      this.listarClientes();
      this.dataSource = new MatTableDataSource<OS>(this.listaOs);
      this.dataSource.paginator = this.paginator;
    })
  }

  navigateToCreate(): void {
    this.router.navigate(['os/create']);
  }

  listarTecnicos(): void {
    this.listaOs.forEach(x => {
      this.tecnicoService.findById(x.tecnico).subscribe(resposta => {
        x.tecnico = resposta.nome;
      })
    })
  }

  listarClientes(): void {
    this.listaOs.forEach(x => {
      this.clienteService.findById(x.cliente).subscribe(resposta => {
        x.cliente = resposta.nome;
      })
    })
  }

  prioridade(x: any) {
    if (x == 'BAIXA') {
      return 'baixa'
    } else if (x == 'MEDIA') {
      return 'media'
    } else {
      return 'alta'
    }
  }

}
