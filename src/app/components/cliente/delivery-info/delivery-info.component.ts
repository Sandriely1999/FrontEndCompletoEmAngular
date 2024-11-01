import { Component, OnInit, Output, EventEmitter, Input, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatIconModule } from '@angular/material/icon';
import { ButtonModule } from 'primeng/button';
import { Observable, Subscription, take } from 'rxjs';
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';

import { NewOrderRequest } from '../../../models/requests/order.request';
import { NewUserRequest } from '../../../models/requests/user.request';
import { NewOrderItemRequest } from '../../../models/requests/orderItem.request';
import { OrderItemsResponse } from '../../../models/responses/orderItems.response';
import { DishResponse } from '../../../models/responses/dish.response';
import { UserResponse } from '../../../models/responses/user.response';
import { Pagamento } from '../../../models/pagamentos.enum';

@Component({
  selector: 'app-delivery-info',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatRadioModule,
    MatIconModule,
    ButtonModule,
    NgxMaskDirective,
    NgxMaskPipe
  ],
  templateUrl: './delivery-info.component.html',
  styleUrls: ['./delivery-info.component.css']
})
export class DeliveryInfoComponent implements OnInit, OnDestroy {
  @Input() selectedItems$?: Observable<OrderItemsResponse[]>;
  @Output() startOrder = new EventEmitter<NewOrderRequest>();

  form!: FormGroup;
  private subscription?: Subscription;
  hasItems: boolean = false;
  totalValue: number = 0;
  paymentMethods = Object.values(Pagamento).filter(value => typeof value === 'number');

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(3)]],
      telefone: ['', [Validators.required, Validators.pattern(/^\d{10,11}$/)]],
      endereco: ['', [Validators.required, Validators.minLength(5)]],
      paymentMethod: [null, Validators.required]
    });

    if (this.selectedItems$) {
      this.subscription = this.selectedItems$.subscribe(items => {
        this.hasItems = items.length > 0;
        this.calculateTotal(items);
      });
    }
  }

  calculateTotal(items: OrderItemsResponse[]): void {
    this.totalValue = items.reduce((total, item) =>
      total + (item.dishResponse.price * item.quantity), 0);
  }

  getPaymentIcon(method: Pagamento): string {
    switch (method) {
      case Pagamento.CARTAO:
        return 'credit_card';
      case Pagamento.PIX:
        return 'qr_code';
      case Pagamento.DINHEIRO:
        return 'payments';
      default:
        return 'help_outline';
    }
  }

  getPaymentLabel(method: Pagamento): string {
    switch (method) {
      case Pagamento.CARTAO:
        return 'Cartão de Crédito/Débito';
      case Pagamento.PIX:
        return 'PIX';
      case Pagamento.DINHEIRO:
        return 'Dinheiro';
      default:
        return 'Método desconhecido';
    }
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  private convertToOrderItemRequest(items: OrderItemsResponse[]): NewOrderItemRequest[] {
    return items.map(item => new NewOrderItemRequest(
      item.dishResponse.dishId,
      item.quantity
    ));
  }

  private createNewUserRequest(): NewUserRequest {
    return new NewUserRequest(
      this.form.get('nome')?.value.trim(),
      this.form.get('telefone')?.value.replace(/\D/g, ''), // Remove não-dígitos do telefone
      this.form.get('endereco')?.value.trim()
    );
  }

  enviarPedido(event: Event) {
    event.preventDefault();

    if (!this.selectedItems$) {
      console.error('Nenhum item selecionado');
      return;
    }

    if (this.form.valid) {
      const newUserRequest = this.createNewUserRequest();
      const paymentMethod = this.form.get('paymentMethod')?.value as Pagamento;

      this.selectedItems$.pipe(
        take(1)
      ).subscribe({
        next: (items) => {
          if (items.length === 0) {
            console.error('Carrinho vazio');
            return;
          }

          // Verifica se todos os pratos estão disponíveis
          const unavailableDishes = items
            .filter(item => !item.dishResponse.availability)
            .map(item => item.dishResponse.name);

          if (unavailableDishes.length > 0) {
            console.error('Alguns pratos não estão mais disponíveis:', unavailableDishes);
            return;
          }

          const orderItems = this.convertToOrderItemRequest(items);

          const newOrderRequest = new NewOrderRequest(
            orderItems,
            newUserRequest,
            paymentMethod
          );

          this.startOrder.emit(newOrderRequest);
          this.form.reset();
        },
        error: (error) => {
          console.error('Erro ao processar pedido:', error);
        }
      });
    } else {
      Object.keys(this.form.controls).forEach(key => {
        const control = this.form.get(key);
        if (control?.invalid) {
          control.markAsTouched();
        }
      });
    }
  }
}
