import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { CitasService, Peluquero } from '../../services/citas'; // Ajusta la ruta si es necesario
import { AuthService, RolUsuario } from '../../services/auth'; 

import { ReservaClienteComponent } from '../reserva-cliente/reserva-cliente';
import { PanelEmpleadosComponent } from '../panel-empleados/panel-empleados';

@Component({
  selector: 'app-citas',
  standalone: true,
  imports: [CommonModule, FormsModule, ReservaClienteComponent, PanelEmpleadosComponent],
  templateUrl: './citas.html',
  styleUrls: ['./citas.css']
})
export class CitasComponent implements OnInit {
  rolActivo: RolUsuario = 'cliente';

  peluqueros: Peluquero[] = [];
  horariosDisponibles: string[] = [];
  peluqueroSeleccionado: number = 1;
  fechaSeleccionada: string = ''; 
  horaSeleccionada: string = '';
  
  // === VARIABLES DE ADMINISTRACIÓN ===
  empleadoFiltroId: number = 1;
  agendaPeluquero: any[] = []; // La usará tanto el panel empleado como la tabla logística admin
  editandoPeluquero: boolean = false;
  
  formPeluquero = { id: 0, nombre: '', specialty: '', fotoUrl: '' };

  constructor(
    private citasService: CitasService, 
    private authService: AuthService,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  async ngOnInit() {
    this.peluqueros = await this.citasService.obtenerPeluqueros();
    if (this.peluqueros.length > 0) {
      this.peluqueroSeleccionado = this.peluqueros[0].id;
      this.empleadoFiltroId = this.peluqueros[0].id;
    }
    this.fechaSeleccionada = this.obtenerFechaActual();
    
    this.authService.rolActual$.subscribe(rol => {
      this.rolActivo = rol;
      if (rol === 'administrador') {
        this.cargarAgendaAdminActual();
      }
      this.changeDetectorRef.detectChanges();
    });

    this.citasService.citas$.subscribe(() => {
      this.cargarHorarios();
      this.cargarAgendaAdminActual();
    });
  }

  obtenerFechaActual(): string {
    const hoy = new Date();
    return `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, '0')}-${String(hoy.getDate()).padStart(2, '0')}`;
  }

  // Carga la agenda del peluquero que esté seleccionado actualmente en el panel admin
  async cargarAgendaAdminActual() {
    this.agendaPeluquero = await this.citasService.obtenerCitasPorPeluquero(Number(this.empleadoFiltroId));
    this.changeDetectorRef.detectChanges();
  }

  // Al hacer clic en un peluquero de la lista izquierda
  seleccionarPeluqueroAdmin(p: Peluquero) {
    this.empleadoFiltroId = p.id;
    this.editandoPeluquero = true;
    this.formPeluquero = { id: p.id, nombre: p.nombre, specialty: p.especialidad, fotoUrl: p.foto_url || '' };
    
    // Al elegirlo, la derecha carga instantáneamente sus citas
    this.cargarAgendaAdminActual();
  }

  limpiarFormPeluquero() {
    this.editandoPeluquero = false;
    this.formPeluquero = { id: 0, nombre: '', specialty: '', fotoUrl: '' };
    this.changeDetectorRef.detectChanges();
  }

  async guardarPeluqueroAdmin() {
    if (!this.formPeluquero.nombre || !this.formPeluquero.specialty) return;
    
    let exito = false;
    if (this.editandoPeluquero) {
      exito = await this.citasService.modificarPeluquero(this.formPeluquero.id, this.formPeluquero.nombre, this.formPeluquero.specialty, this.formPeluquero.fotoUrl);
    } else {
      exito = await this.citasService.agregarPeluquero(this.formPeluquero.nombre, this.formPeluquero.specialty, this.formPeluquero.fotoUrl);
    }

    if (exito) {
      alert('🌿 Cambios guardados en el staff.');
      this.limpiarFormPeluquero();
      this.peluqueros = await this.citasService.obtenerPeluqueros();
    }
  }

  async borrarPeluqueroAdmin(id: number, event: Event) {
    event.stopPropagation(); // Evita que se dispare la selección de la tarjeta
    if (confirm('⚠️ ¿Eliminar a este estilista? Se cancelarán todas sus citas asociadas.')) {
      const exito = await this.citasService.eliminarPeluquero(id);
      if (exito) {
        this.peluqueros = await this.citasService.obtenerPeluqueros();
        if (this.peluqueros.length > 0) this.empleadoFiltroId = this.peluqueros[0].id;
        this.cargarAgendaAdminActual();
      }
    }
  }

  // === ACCIONES SOBRE LAS CITAS EN LA TABLA DERECHA ===

  async moverCitaAdmin(citaId: number, event: any) {
    const nuevoPeluqueroId = Number(event.target.value);
    const exito = await this.citasService.reasignarPeluqueroCita(citaId, nuevoPeluqueroId);
    if (exito) {
      // Como se movió a otro peluquero, desaparece de la vista actual de este peluquero
      this.cargarAgendaAdminActual();
    }
  }

  async eliminarCitaAdmin(citaId: number) {
    if (confirm('❌ ¿Estás seguro de que deseas cancelar de forma permanente esta cita de la base de datos?')) {
      // Llamada directa a Supabase para eliminar la cita
      const { error } = await (this.citasService as any).supabase
        .from('appointments')
        .delete()
        .eq('id', citaId);

      if (!error) {
        alert('Cita cancelada correctamente.');
        this.cargarAgendaAdminActual();
      }
    }
  }

  async modificarCitaAdmin(cita: any) {
    const nuevaFecha = prompt('Introduce la nueva fecha (AAAA-MM-DD):', cita.fecha_de_reserva);
    const nuevaHora = prompt('Introduce la nueva hora (HH:MM):', cita.hora_de_reserva.substring(0,5));

    if (nuevaFecha && nuevaHora) {
      const { error } = await (this.citasService as any).supabase
        .from('appointments')
        .update({ fecha_de_reserva: nuevaFecha, hora_de_reserva: nuevaHora })
        .eq('id', cita.id);

      if (!error) {
        alert('📅 Cita reprogramada con éxito.');
        this.cargarAgendaAdminActual();
      } else {
        alert('Hubo un error al modificar el tiempo.');
      }
    }
  }

  // Métodos del hijo reserva
  recargarHorariosPadre(filtros: { peluqueroId: number, fecha: string }) {
    this.peluqueroSeleccionado = filtros.peluqueroId;
    this.fechaSeleccionada = filtros.fecha;
    this.cargarHorarios();
  }

  fijarHoraPadre(hora: string) {
    this.horaSeleccionada = hora;
    this.changeDetectorRef.detectChanges();
  }

  filtrarAgendaPadre(idEmpleado: number) {
    this.empleadoFiltroId = idEmpleado;
    this.cargarAgendaAdminActual();
  }

  async cargarHorarios() {
    try {
      this.horariosDisponibles = await this.citasService.generarHorariosDisponibles(Number(this.peluqueroSeleccionado), this.fechaSeleccionada);
    } catch (error) {
      this.horariosDisponibles = ['09:00', '10:00', '11:00'];
    }
    this.changeDetectorRef.detectChanges();
  }

  async procesarReservaPadre() {
    const exito = await this.citasService.reservarCita(Number(this.peluqueroSeleccionado), this.fechaSeleccionada, this.horaSeleccionada, 'Cliente Registrado');
    if (exito) {
      this.horaSeleccionada = '';
    }
  }

  alternarRolPrueba(nuevoRol: RolUsuario) {
    this.authService.cambiarRolSimulado(nuevoRol);
  }
}