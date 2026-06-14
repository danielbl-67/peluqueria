import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Peluquero } from '../../services/citas';

@Component({
  selector: 'app-panel-empleados',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './panel-empleados.html',
  styleUrls: ['./panel-empleados.css']
})
export class PanelEmpleadosComponent implements OnInit {
  @Input() peluqueros: Peluquero[] = [];
  @Input() agendaPeluquero: any[] = [];

  empleadoId: number = 1;

  @Output() onCambioEmpleado = new EventEmitter<number>();

  ngOnInit() {
    if (this.peluqueros.length > 0) {
      this.empleadoId = this.peluqueros[0].id;
      this.onSeleccionCambiada(); // Carga la agenda inicial del primer peluquero
    }
  }

  onSeleccionCambiada() {
    this.onCambioEmpleado.emit(Number(this.empleadoId));
  }
}