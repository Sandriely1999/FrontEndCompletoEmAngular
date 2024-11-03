import {Component, Input, Output, EventEmitter, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatCard, MatCardActions, MatCardContent, MatCardHeader, MatCardTitle} from '@angular/material/card';
import {MatError, MatFormField, MatLabel} from '@angular/material/form-field';
import {MatOption, MatSelect} from '@angular/material/select';
import {Pagamento} from '../../../models/pagamentos.enum';
import {NewOrderItemRequest} from '../../../models/requests/orderItem.request';
import {PedidoService} from '../../../services/pedido.service';
import {NewUserRequest} from '../../../models/requests/user.request';
import {NewOrderRequest} from '../../../models/requests/order.request';
import {MatInput} from '@angular/material/input';
import {MatButton} from '@angular/material/button';
import {CommonModule} from '@angular/common';
import {MatDialog} from '@angular/material/dialog';
import {OrderStatusComponent} from '../order-status/order-status.component';

@Component({
  selector: 'app-order-form',
  standalone: true,
  imports: [
    MatCardActions,
    MatLabel,
    MatSelect,
    MatFormField,
    MatOption,
    MatCardContent,
    MatCardTitle,
    MatCardHeader,
    MatCard,
    ReactiveFormsModule,
    MatInput,
    MatButton,
    MatError,
    CommonModule
  ],
  templateUrl: './order-form.component.html',
  styleUrl: './order-form.component.css'
})
export class OrderFormComponent implements OnInit {
  @Input() orderItems: NewOrderItemRequest[] = [];
  @Output() orderCreated = new EventEmitter<number>();

  orderForm: FormGroup;
  Pagamento = Pagamento;

  constructor(
    private fb: FormBuilder,
    private pedidoService: PedidoService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {
    this.orderForm = this.fb.group({
      name: ['', Validators.required],
      phone: ['', Validators.required],
      address: ['', Validators.required],
      pagamento: ['', Validators.required]
    });
  }

  ngOnInit() {}

  onSubmit() {
    if (this.orderForm.valid && this.orderItems.length > 0) {
      const formValue = this.orderForm.value;

      const userRequest = new NewUserRequest(
        formValue.name,
        formValue.phone,
        formValue.address
      );

      const orderRequest = new NewOrderRequest(
        this.orderItems,
        userRequest,
        formValue.pagamento
      );

      this.pedidoService.criarPedido(orderRequest).subscribe({
        next: (response) => {
          this.snackBar.open('Pedido criado com sucesso!', 'Fechar', { duration: 3000 });
          this.orderForm.reset();

          // Emite o ID do pedido para o componente pai
          this.orderCreated.emit(response.orderId);

          // Abre o diálogo de status do pedido
          this.dialog.open(OrderStatusComponent, {
            data: { orderId: response.orderId },
            width: '500px',
            disableClose: false
          });
        },
        error: (error) => {
          this.snackBar.open('Erro ao criar pedido', 'Fechar', { duration: 3000 });
        }
      });
    }
  }
}
