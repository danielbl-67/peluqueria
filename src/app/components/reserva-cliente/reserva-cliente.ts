import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Peluquero } from '../../services/citas';

@Component({
  selector: 'app-reserva-cliente',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reserva-cliente.html',
  styleUrls: ['./reserva-cliente.css']
})
export class ReservaClienteComponent {
  // Recibimos los datos desde el componente Padre
  @Input() peluqueros: Peluquero[] = [];
  @Input() horariosDisponibles: string[] = [];
  @Input() fechaSeleccionada: string = '';
  @Input() horaSeleccionada: string = '';

  // Registramos el objeto interno para los selectores del HTML
  datos = {
    peluqueroId: 1,
    fecha: ''
  };

  // Enviamos los eventos de vuelta al Padre
  @Output() onCambioFiltro = new EventEmitter<{ peluqueroId: number, fecha: string }>();
  @Output() onHoraElegida = new EventEmitter<string>();
  @Output() onConfirmar = new EventEmitter<void>();

  ngOnInit() {
    this.datos.peluqueroId = 1;
    this.datos.fecha = this.fechaSeleccionada;
  }

  notificarCambios() {
    this.onCambioFiltro.emit({
      peluqueroId: Number(this.datos.peluqueroId),
      fecha: this.datos.fecha
    });
  }

  seleccionarHora(hora: string) {
    this.onHoraElegida.emit(hora);
  }

  lanzarConfirmacion() {
    this.onConfirmar.emit();
  }

  obtenerNombrePeluquero(): string {
    const p = this.peluqueros.find(p => p.id === Number(this.datos.peluqueroId));
    return p ? p.nombre : 'No seleccionado';
  }
}