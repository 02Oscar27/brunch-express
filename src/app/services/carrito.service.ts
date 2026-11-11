import { Injectable } from '@angular/core';

import type { Producto } from '../models/producto.model';

export interface ItemCarrito {
  producto: Producto;

  cantidad: number;
}

@Injectable({
  providedIn: 'root',
})
export class CarritoService {
  private items: ItemCarrito[] = [];

  agregarProducto(producto: Producto): void {
    const existente = this.items.find((item) => item.producto.id === producto.id);

    if (existente) {
      existente.cantidad++;
    } else {
      this.items.push({
        producto: producto,
        cantidad: 1,
      });
    }
  }

  obtenerCantidadTotal(): number {
    return this.items.reduce((total, item) => total + item.cantidad, 0);
  }

  obtenerProductos(): ItemCarrito[] {
    return this.items.map((item) => ({ ...item }));
  }

  aumentarCantidad(id: number): void {
    const item = this.items.find((item) => item.producto.id === id);

    if (item) {
      item.cantidad++;
    }
  }

  disminuirCantidad(id: number): void {
    const item = this.items.find((item) => item.producto.id === id);

    if (!item) {
      return;
    }

    if (item.cantidad > 1) {
      item.cantidad--;
    } else {
      this.eliminarProducto(id);
    }
  }

  eliminarProducto(id: number): void {
    this.items = this.items.filter((item) => item.producto.id !== id);
  }

  obtenerTotal(): number {
    return this.items.reduce((total, item) => total + item.producto.precio * item.cantidad, 0);
  }

  vaciarCarrito(): void {
    this.items = [];
  }
}
