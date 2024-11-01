import { Component } from '@angular/core';
import {OrderStatusComponent} from "../../components/cliente/order-status/order-status.component";

@Component({
  selector: 'app-status-view',
  standalone: true,
    imports: [
        OrderStatusComponent
    ],
  templateUrl: './status-view.component.html',
  styleUrl: './status-view.component.css'
})
export class StatusViewComponent {

}
