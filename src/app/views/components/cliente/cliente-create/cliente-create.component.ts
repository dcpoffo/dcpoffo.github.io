import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Cliente } from 'src/app/models/cliente';
import { ClienteService } from 'src/app/services/cliente.service';

@Component({
  selector: 'app-cliente-create',
  templateUrl: './cliente-create.component.html',
  styleUrls: ['./cliente-create.component.css']
})
export class ClienteCreateComponent implements OnInit {

  cliente: Cliente = {
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
    private service: ClienteService
  ) { }

  ngOnInit(): void {
  }

  cancel(): void {
    this.route.navigate(['clientes'])
  }

  create(): void {
    this.service.create(this.cliente).subscribe((
      resposta) => {
      this.route.navigate(['clientes']);
      this.service.message('Cliente criado com sucesso');
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
