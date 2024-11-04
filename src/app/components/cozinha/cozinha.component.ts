import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NewDishRequest } from '../../models/requests/dish.request';
import {CozinhaService} from '../../services/cozinha.service';
import {OrderResponse} from '../../models/responses/order.response';
import {DishResponse} from '../../models/responses/dish.response';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-cozinha',
  templateUrl: './cozinha.component.html',
  styleUrls: ['./cozinha.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ]
})
export class CozinhaComponent implements OnInit {
  orders: OrderResponse[] = [];
  dishes: DishResponse[] = [];
  dishForm: FormGroup;
  selectedDish: DishResponse | null = null;
  showDishModal = false;
  imagePreview: string | null = null;

  constructor(
    private cozinhaService: CozinhaService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    this.dishForm = this.createDishForm();
  }

  ngOnInit() {
    this.loadOrders();
    this.loadDishes();
  }

  createDishForm(): FormGroup {
    return this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(0)]],
      image: ['']
    });
  }

  async onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      try {
        const base64String = await this.convertToBase64(file);
        this.dishForm.patchValue({
          image: base64String // Atualizando o campo correto do formulário
        });
        this.imagePreview = base64String;
      } catch (error) {
        this.snackBar.open('Erro ao processar a imagem', 'Fechar', {
          duration: 3000
        });
        console.error('Erro na conversão da imagem:', error);
      }
    }
  }

  private convertToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = () => {
        resolve(reader.result as string);
      };

      reader.onerror = (error) => {
        reject(error);
      };
    });
  }

  openDishModal(dish?: DishResponse) {
    this.selectedDish = dish || null;

    if (dish) {
      this.dishForm.patchValue({
        name: dish.name,
        description: dish.description,
        price: dish.price,
        image: dish.image
      });
      this.imagePreview = dish.image;
    } else {
      this.dishForm.reset();
      this.imagePreview = null;
    }

    this.showDishModal = true;
  }

  closeModal() {
    this.showDishModal = false;
    this.imagePreview = null;
    this.dishForm.reset();
  }

  saveDish() {
    if (this.dishForm.valid) {
      const dishData: NewDishRequest = {
        name: this.dishForm.get('name')?.value,
        description: this.dishForm.get('description')?.value,
        price: this.dishForm.get('price')?.value,
        image: this.dishForm.get('image')?.value
      };

      if (this.selectedDish) {
        this.cozinhaService.editDish(this.selectedDish.dishId, dishData).subscribe({
          next: () => {
            this.loadDishes();
            this.closeModal(); // Usando o novo método para fechar o modal
            this.snackBar.open('Prato atualizado com sucesso!', 'Fechar', {
              duration: 3000
            });
          },
          error: (error) => {
            this.snackBar.open('Erro ao atualizar o prato', 'Fechar', {
              duration: 3000
            });
            console.error('Erro ao atualizar prato:', error);
          }
        });
      } else {
        this.cozinhaService.createDish(dishData).subscribe({
          next: () => {
            this.loadDishes();
            this.closeModal(); // Usando o novo método para fechar o modal
            this.snackBar.open('Prato criado com sucesso!', 'Fechar', {
              duration: 3000
            });
          },
          error: (error) => {
            this.snackBar.open('Erro ao criar o prato', 'Fechar', {
              duration: 3000
            });
            console.error('Erro ao criar prato:', error);
          }
        });
      }
    }
  }


  loadOrders() {
    this.cozinhaService.getPreparingOrders().subscribe({
      next: (orders) => {
        this.orders = orders;
      },
      error: (error) => console.error('Error loading orders:', error)
    });
  }

  loadDishes() {
    this.cozinhaService.getAllValidDishes().subscribe({
      next: (dishes) => {
        this.dishes = dishes;
      },
      error: (error) => console.error('Error loading dishes:', error)
    });
  }

  markOrderAsReady(orderId: number) {
    this.cozinhaService.changeOrderStatusToReady(orderId).subscribe({
      next: () => {
        this.loadOrders();
      },
      error: (error) => console.error('Error updating order status:', error)
    });
  }


  toggleDishAvailability(id: number) {
    this.cozinhaService.updateDishAvailability(id).subscribe({
      next: () => {
        this.loadDishes();
      },
      error: (error) => console.error('Error updating dish availability:', error)
    });
  }
}
