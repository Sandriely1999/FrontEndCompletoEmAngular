import { Component, Input } from '@angular/core';
import {DishResponse} from '../../../models/responses/dish.response';
import {ButtonModule} from 'primeng/button';
import {CarouselModule} from 'primeng/carousel';
import {Observable, of} from 'rxjs';


@Component({
  selector: 'app-product-carousel',
  standalone: true,
  imports: [CarouselModule, ButtonModule],
  templateUrl: './product-carousel.component.html',
  styleUrls: ['./product-carousel.component.css']
})

export class ProductCarouselComponent {
  @Input() dishes$: Observable<DishResponse[]> = of([]);
  @Input() addToOrder!: (product: DishResponse) => void;
}





