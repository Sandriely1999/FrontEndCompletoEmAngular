import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import {NewOrderRequest} from '../../../models/requests/order.request';
import {NewUserRequest} from '../../../models/requests/user.request';
import { Pagamento } from '../../../models/pagamentos.enum';
import {PedidoService} from '../../../services/pedido.service';

@Component({
  selector: 'app-delivery-info',
  standalone: true,
  imports: [ReactiveFormsModule, InputTextModule, ButtonModule, MatCardModule],
  templateUrl: './delivery-info.component.html',
  styleUrls: ['./delivery-info.component.css']
})
export class DeliveryInfoComponent implements OnInit {
  @Output() pedidoEnviado = new EventEmitter<NewOrderRequest>(); // Emissor de evento

  form!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private pedidoService: PedidoService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      nome: [null, Validators.required],
      telefone: [null, Validators.required],
      endereco: [null, Validators.required]
    });
  }

  // Método para enviar o pedido
  enviarPedido(event: Event) {
    event.preventDefault();
    if (this.form.valid) {
      const newUserRequest: NewUserRequest = {
        name: this.form.get('nome')?.value,
        phone: this.form.get('telefone')?.value,
        address: this.form.get('endereco')?.value
      };
      const newOrderRequest: NewOrderRequest = new NewOrderRequest(
        [],
        newUserRequest,
        undefined
      );

      this.pedidoService.criarPedido(newOrderRequest).subscribe({
        next: (response) => {
          console.log('Pedido criado com sucesso:', response);
          this.router.navigate(['/order-status'], {
            queryParams: {
              nome: this.form.get('nome')?.value,
              telefone: this.form.get('telefone')?.value,
              endereco: this.form.get('endereco')?.value
            }
          });
        },
        error: (error) => {
          console.error('Erro ao criar o pedido:', error);
        }
      });
    } else {
      console.log('Por favor, preencha todos os campos obrigatórios');
    }
  }
}


