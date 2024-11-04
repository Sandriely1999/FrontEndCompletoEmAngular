import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { OrderStatus } from '../../models/orderstatus.enum';
import { OrderResponse } from '../../models/responses/order.response';
import { PedidoService } from '../../services/pedido.service';

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
  ordersPronto: OrderResponse[] = [];
  ordersEnviando: OrderResponse[] = [];
  OrderStatus = OrderStatus;

  constructor(private pedidoService: PedidoService) {}

  ngOnInit() {
    this.carregarPedidos();
  }

  carregarPedidos() {
    // Carregar pedidos prontos
    this.pedidoService.listaPedidosPronto().subscribe({
      next: (pedidos) => {
        this.ordersPronto = pedidos;
      },
      error: (error) => {
        console.error('Erro ao carregar pedidos prontos:', error);
      }
    });

    // Carregar pedidos em entrega
    this.pedidoService.listaPedidosEnviando().subscribe({
      next: (pedidos) => {
        this.ordersEnviando = pedidos;
      },
      error: (error) => {
        console.error('Erro ao carregar pedidos em entrega:', error);
      }
    });
  }

  iniciarEntrega(orderId: number) {
    this.pedidoService.trocarStatusParaEnviando(orderId).subscribe({
      next: () => {
        this.carregarPedidos(); // Recarrega ambas as listas
      },
      error: (error) => {
        console.error('Erro ao iniciar entrega:', error);
      }
    });
  }
}
