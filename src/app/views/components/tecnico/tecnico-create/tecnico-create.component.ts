import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Tecnico } from 'src/app/models/tecnico';
import { TecnicoService } from 'src/app/services/tecnico.service';

@Component({
  selector: 'app-tecnico-create',
  templateUrl: './tecnico-create.component.html',
  styleUrls: ['./tecnico-create.component.css']
})
export class TecnicoCreateComponent implements OnInit {

  tecnico: Tecnico = {
    id: '',
    nome: '',
    cpf: '',
    telefone: ''
  }

  nome = new FormControl('', [Validators.minLength(3)]);
  cpf = new FormControl('', [Validators.minLength(14)]);
  telefone = new FormControl('', [Validators.minLength(11)]);

  constructor(
    private route: Router,
    private service: TecnicoService
  ) { }

  ngOnInit(): void {
  }

  cancel(): void {
    this.route.navigate(['tecnicos'])
  }

  create(): void {
    this.service.create(this.tecnico).subscribe((
      resposta) => {
      this.route.navigate(['tecnicos']);
      this.service.message('Técnico criado com sucesso');
    }, err => {
      //mostra diretamente a mensagem do "back end"
      //this.service.message(err.error.error);

      //aqui verifica se a mensagem de erro contém determinada sequencia de palavras
      if (err.error.error.match('já cadastrado')) {
        this.service.message(err.error.error);
      } else if (err.error.errors[0].message === "número do registro de contribuinte individual brasileiro (CPF) inválido") {
        this.service.message("CPF inválido");
        console.log(err);
      }
    })
  }

  errorValidName() {
    if (this.nome.invalid) {
      return 'O nome deve ter entre 3 e 50 caracteres';
    }
    else
      return false;
  }

  errorValidCpf() {
    if (this.cpf.invalid) {
      return 'O CPF deve ter 14 caracteres e deve ser preenchido com "." e "-". Exemplo: 123.123.123-88';
    }
    else
      return false;
  }

  errorValidTelefone() {
    if (this.telefone.invalid) {
      return 'O telefone deve ter entre 11 e 18 caracteres';
    }
    else
      return false;
  }

}
