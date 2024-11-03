import { Component, Input } from '@angular/core';
import { DishResponse } from '../../../models/responses/dish.response';
import { ButtonModule } from 'primeng/button';
import { CarouselModule } from 'primeng/carousel';
import { Observable, of } from 'rxjs';
import { CartStateService } from '../../../services/cart-state.service';

@Component({
  selector: 'app-product-carousel',
  standalone: true,
  imports: [CarouselModule, ButtonModule],
  templateUrl: './product-carousel.component.html',
  styleUrls: ['./product-carousel.component.css']
})
export class ProductCarouselComponent {
  @Input() dishes$: Observable<DishResponse[]> = of([]);

  constructor(private cartState: CartStateService) {}

  addToOrder(product: DishResponse) {
    this.cartState.addToOrder(product);
  }
}

