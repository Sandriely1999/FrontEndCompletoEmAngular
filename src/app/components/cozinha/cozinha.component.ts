import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NewDishRequest } from '../../models/requests/dish.request';
import {CozinhaService} from '../../services/cozinha.service';
import {OrderResponse} from '../../models/responses/order.response';
import {DishResponse} from '../../models/responses/dish.response';

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

  constructor(
    private cozinhaService: CozinhaService,
    private fb: FormBuilder
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
      imageUrl: ['']
    });
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

  openDishModal(dish?: DishResponse) {
    this.selectedDish = dish || null;
    if (dish) {
      this.dishForm.patchValue(dish);
    } else {
      this.dishForm.reset();
    }
    this.showDishModal = true;
  }

  saveDish() {
    if (this.dishForm.valid) {
      const dishData: NewDishRequest = this.dishForm.value;

      if (this.selectedDish) {
        this.cozinhaService.editDish(this.selectedDish.dishId, dishData).subscribe({
          next: () => {
            this.loadDishes();
            this.showDishModal = false;
          },
          error: (error) => console.error('Error updating dish:', error)
        });
      } else {
        this.cozinhaService.createDish(dishData).subscribe({
          next: () => {
            this.loadDishes();
            this.showDishModal = false;
          },
          error: (error) => console.error('Error creating dish:', error)
        });
      }
    }
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
