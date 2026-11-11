import {
  Component,
  inject,
  ChangeDetectorRef
} from '@angular/core';
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
  IonInput,
  AlertController,
  ToastController
} from '@ionic/angular';

import { CarritoService } from '../services/carrito.service';

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
    IonInput,
    FormsModule,
    RouterLink
  ]
})
export class Tab3Page {

  readonly carrito = inject(CarritoService);

  private readonly alertCtrl = inject(AlertController);
  private readonly toastCtrl = inject(ToastController);
  private readonly cdr = inject(ChangeDetectorRef);

  nombreCliente: string = '';

  // Aumentar cantidad
  aumentar(id: number): void {
    this.carrito.aumentarCantidad(id);
  }

  // Disminuir cantidad
  disminuir(id: number): void {
    this.carrito.disminuirCantidad(id);
  }

  // Eliminar producto
  eliminar(id: number): void {
    this.carrito.eliminarProducto(id);
  }

  // Vaciar carrito
  vaciar(): void {
    this.carrito.vaciarCarrito();
  }

  // Formatear precios
  formatearPrecio(precio: number): string {
    return '$' + precio.toLocaleString('es-CO');
  }

  // Confirmar pedido
  async confirmarPedido(): Promise<void> {

    const nombre = this.nombreCliente.trim();

    // Validar el carrito
    if (this.carrito.obtenerCantidadTotal() === 0) {
      await this.mostrarMensaje('El carrito está vacío');
      return;
    }

    // Validar el nombre
    if (nombre.length < 3) {
      await this.mostrarMensaje(
        'Ingresa un nombre de al menos 3 caracteres'
      );
      return;
    }

    // Calcular el total
    const total = this.carrito.obtenerTotal();

    // Crear la ventana de confirmación
    const alerta = await this.alertCtrl.create({
      header: 'Confirmar pedido',
      message: `Cliente: ${nombre}. Total: ${this.formatearPrecio(total)}`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Confirmar',
          role: 'confirm'
        }
      ]
    });

    await alerta.present();

    const resultado = await alerta.onDidDismiss();

    // Comprobar si el usuario confirmó
    if (resultado.role !== 'confirm') {
      return;
    }

    // Limpiar el carrito
    this.carrito.vaciarCarrito();
    this.nombreCliente = '';

    // Actualizar la pantalla
    this.cdr.detectChanges();

    // Mostrar mensaje
    await this.mostrarMensaje(
      'Pedido confirmado correctamente'
    );
  }

  // Mostrar notificaciones
  async mostrarMensaje(mensaje: string): Promise<void> {

    const toast = await this.toastCtrl.create({
      message: mensaje,
      duration: 2500,
      position: 'bottom'
    });

    await toast.present();
  }

}
