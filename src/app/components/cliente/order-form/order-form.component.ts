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
import {MatIcon} from '@angular/material/icon';

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
    CommonModule,
    MatIcon
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
      name: ['', [Validators.required, Validators.minLength(3)]],
      phone: ['', [
        Validators.required,
        Validators.pattern(/^[1-9]{2}9?[0-9]{8}$/)
      ]],
      address: ['', [Validators.required, Validators.minLength(10)]],
      pagamento: ['', Validators.required]
    });
  }

  ngOnInit() {
    if (this.orderItems.length === 0) {
      this.snackBar.open('Adicione pelo menos um item ao pedido', 'OK', {
        duration: 3000
      });
    }
  }

  resetForm() {
    this.orderForm.reset();
  }

  onSubmit() {
    if (this.orderForm.valid && this.orderItems.length > 0) {
      const formValue = this.orderForm.value;

      // Formatar o telefone para remover caracteres não numéricos
      const cleanPhone = formValue.phone.replace(/\D/g, '');

      const userRequest = new NewUserRequest(
        formValue.name,
        cleanPhone,
        formValue.address
      );

      const orderRequest = new NewOrderRequest(
        this.orderItems,
        userRequest,
        formValue.pagamento
      );

      this.pedidoService.criarPedido(orderRequest).subscribe({
        next: (response) => {
          this.snackBar.open('Pedido criado com sucesso!', 'Fechar', {
            duration: 3000,
            panelClass: ['success-snackbar']
          });

          this.orderForm.reset();
          this.orderCreated.emit(response.orderId);

          this.dialog.open(OrderStatusComponent, {
            data: { orderId: response.orderId },
            width: '500px',
            disableClose: false
          });
        },
        error: (error) => {
          this.snackBar.open(
            'Erro ao criar pedido. Tente novamente.',
            'Fechar',
            {
              duration: 5000,
              panelClass: ['error-snackbar']
            }
          );
        }
      });
    } else {
      this.markFormGroupTouched(this.orderForm);
    }
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  getErrorMessage(fieldName: string): string {
    const control = this.orderForm.get(fieldName);

    if (control?.hasError('required')) {
      return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} é obrigatório`;
    }

    if (control?.hasError('minlength')) {
      const requiredLength = control.errors?.['minlength'].requiredLength;
      return `Mínimo de ${requiredLength} caracteres`;
    }

    if (control?.hasError('pattern') && fieldName === 'phone') {
      return 'Telefone inválido. Digite um número válido';
    }

    return '';
  }
}
