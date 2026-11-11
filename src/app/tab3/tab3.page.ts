import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonButton,
  AlertController,
  ToastController,
  IonInput,
} from '@ionic/angular';

import { CarritoService } from '../services/carrito.service';
import { PedidosService } from '../services/pedidos.service';
import type { Pedido } from '../services/pedidos.service';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonButton,
    RouterLink,
    IonInput,
    FormsModule,
  ],
})
export class Tab3Page {
  readonly carrito = inject(CarritoService);
  readonly pedidos = inject(PedidosService);

  private readonly cdr = inject(ChangeDetectorRef);
  private readonly alertCtrl = inject(AlertController);
  private readonly toastCtrl = inject(ToastController);

  nombreCliente: string = '';

  aumentar(id: number): void {
    this.carrito.aumentarCantidad(id);
  }

  disminuir(id: number): void {
    this.carrito.disminuirCantidad(id);
  }

  eliminar(id: number): void {
    this.carrito.eliminarProducto(id);
  }

  vaciar(): void {
    this.carrito.vaciarCarrito();
  }

  // Ionic conserva las pestañas: actualizar sus datos al volver a entrar.
  ionViewWillEnter(): void {
    this.cdr.markForCheck();
  }

  formatearPrecio(precio: number): string {
    return '$' + precio.toLocaleString('es-CO');
  }

  async confirmarPedido(): Promise<void> {
    const nombre = this.nombreCliente.trim();

    // Validar que existan productos
    if (this.carrito.obtenerCantidadTotal() === 0) {
      await this.mostrarMensaje('El carrito está vacío');
      return;
    }

    // Validar el nombre del cliente
    if (nombre.length < 3) {
      await this.mostrarMensaje('Ingresa un nombre de al menos 3 caracteres');
      return;
    }

    // Crear el pedido con sus datos
    const pedido: Pedido = {
      id: Date.now(),
      cliente: nombre,
      fecha: new Date().toISOString(),
      productos: this.carrito.obtenerProductos(),
      total: this.carrito.obtenerTotal(),
    };

    // Mostrar confirmación
    const alerta = await this.alertCtrl.create({
      header: 'Confirmar pedido',
      message: `Cliente: ${nombre}. Total: ${this.formatearPrecio(pedido.total)}`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Confirmar',
          role: 'confirm',
        },
      ],
    });

    await alerta.present();

    const resultado = await alerta.onDidDismiss();

    // Si cancela, no guardar nada
    if (resultado.role !== 'confirm') {
      return;
    }

    try {
      await this.pedidos.guardarPedido(pedido);

      this.carrito.vaciarCarrito();
      this.nombreCliente = '';

      // Solicitar a Angular actualizar la pantalla
      this.cdr.markForCheck();

      await this.mostrarMensaje('Pedido guardado correctamente');
    } catch {
      await this.mostrarMensaje('No fue posible guardar el pedido');
    }
  }

  async mostrarMensaje(mensaje: string): Promise<void> {
    const toast = await this.toastCtrl.create({
      message: mensaje,
      duration: 2500,
      position: 'bottom',
    });

    await toast.present();
  }
}
