import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { OrderStatus} from '../../models/orderstatus.enum';
import {OrderResponse} from '../../models/responses/order.response';
import {PedidoService} from '../../services/pedido.service';


@Component({
  selector: 'app-entregador',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './entregador.component.html',
  styleUrls: ['./entregador.component.css']
})
export class EntregadorComponent implements OnInit {
  orderResponses: OrderResponse[] = [];
  OrderStatus = OrderStatus; // Para usar o enum no template

  constructor(private pedidoService: PedidoService) {}

  ngOnInit() {
    this.carregarPedidosProntos();
  }

  carregarPedidosProntos() {
    this.pedidoService.listaPedidosPronto().subscribe({
      next: (pedidos) => {
        this.orderResponses = pedidos;
      },
      error: (error) => {
        console.error('Erro ao carregar pedidos:', error);
      }
    });
  }


  iniciarEntrega(orderId: number) {
    this.pedidoService.trocarStatusParaEnviando(orderId).subscribe({
      next: () => {
        this.carregarPedidosProntos();
      },
      error: (error) => {
        console.error('Erro ao iniciar entrega:', error);
      }
    });
  }
}
