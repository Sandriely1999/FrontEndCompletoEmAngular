import { Component } from '@angular/core';
import {DeliveryInfoComponent} from "../../components/cliente/delivery-info/delivery-info.component";
import {OrderSummaryComponent} from "../../components/cliente/order-summary/order-summary.component";
import {ProductCarouselComponent} from "../../components/cliente/product-carousel/product-carousel.component";
import {ClientTotalComponent} from '../../components/cliente/client-total.component';

@Component({
  selector: 'app-client-view',
  standalone: true,
  imports: [
    DeliveryInfoComponent,
    OrderSummaryComponent,
    ProductCarouselComponent,
    ClientTotalComponent
  ],
  templateUrl: './client-view.component.html',
  styleUrl: './client-view.component.css'
})
export class ClientViewComponent {

}
