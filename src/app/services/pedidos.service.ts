import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';

import type { ItemCarrito } from './carrito.service';

export interface Pedido {
  id: number;
  cliente: string;
  fecha: string;
  productos: ItemCarrito[];
  total: number;
}

@Injectable({
  providedIn: 'root',
})
export class PedidosService {
  private readonly clave = 'brunch_pedidos';

  async obtenerPedidos(): Promise<Pedido[]> {
    const resultado = await Preferences.get({
      key: this.clave,
    });

    if (!resultado.value) {
      return [];
    }

    const datos = JSON.parse(resultado.value);

    return Array.isArray(datos) ? datos : [];
  }

  async guardarPedido(pedido: Pedido): Promise<void> {
    const pedidos = await this.obtenerPedidos();

    pedidos.push(pedido);

    await Preferences.set({
      key: this.clave,
      value: JSON.stringify(pedidos),
    });
  }
}
