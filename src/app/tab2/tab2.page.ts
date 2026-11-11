import { Component, inject, ChangeDetectorRef } from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonButton,
} from '@ionic/angular';

import type { Producto } from '../models/producto.model';
import { CarritoService } from '../services/carrito.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  imports: [
    IonButton,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonCardContent,
  ],
})
export class Tab2Page {
  readonly carrito = inject(CarritoService);
  private readonly cdr = inject(ChangeDetectorRef);

  productos: Producto[] = [
    {
      id: 1,
      nombre: 'Pancakes',
      descripcion: 'Pancakes con frutas frescas y miel.',
      precio: 18000,
      categoria: 'Desayunos',
    },
    {
      id: 2,
      nombre: 'Waffles',
      descripcion: 'Waffles con fresas y chocolate.',
      precio: 20000,
      categoria: 'Desayunos',
    },
    {
      id: 3,
      nombre: 'Café americano',
      descripcion: 'Café caliente recién preparado.',
      precio: 5000,
      categoria: 'Bebidas',
    },
    {
      id: 4,
      nombre: 'Jugo natural',
      descripcion: 'Jugo de fruta natural.',
      precio: 18000,
      categoria: 'Bebidas',
    },
    {
      id: 5,
      nombre: 'Omelette',
      descripcion: 'Omelette con queso y jamón.',
      precio: 16000,
      categoria: 'Desayunos',
    },
  ];

  // Ionic conserva las pestañas: actualizar sus datos al volver a entrar.
  ionViewWillEnter(): void {
    this.cdr.markForCheck();
  }

  formatearPrecio(precio: number): string {
    return '$' + precio.toLocaleString('es-CO');
  }

  agregarAlCarrito(producto: Producto): void {
    this.carrito.agregarProducto(producto);
  }
}
