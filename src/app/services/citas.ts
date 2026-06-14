import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Peluquero {
  id: number;
  nombre: string;
  especialidad: string;
  foto: string;
}

export interface CitaReservada {
  peluqueroId: number;
  fecha: string; // Formato YYYY-MM-DD
  hora: string;  // Formato HH:MM
}

@Injectable({
  providedIn: 'root'
})
export class CitasService {
  // Lista fija de peluqueros para elegir
  private peluqueros: Peluquero[] = [
    { id: 1, nombre: 'Carlos Madera', especialidad: 'Cortes Clásicos y Estilo', foto: 'assets/p1.jpg' },
    { id: 2, nombre: 'Elena Verde', especialidad: 'Colorimetría y Tratamientos', foto: 'assets/p2.jpg' },
    { id: 3, nombre: 'Sofía Arena', especialidad: 'Estilismo Moderno y Visagismo', foto: 'assets/p3.jpg' }
  ];

  // Base de datos simulada de citas ya ocupadas
  private citasOcupadas: CitaReservada[] = [
    { peluqueroId: 1, fecha: '2026-06-15', hora: '10:00' },
    { peluqueroId: 1, fecha: '2026-06-15', hora: '10:30' }
  ];

  // BehaviorSubject para hacer el calendario reactivo en tiempo real
  private citasSubject = new BehaviorSubject<CitaReservada[]>(this.citasOcupadas);
  citas$ = this.citasSubject.asObservable();

  getPeluqueros(): Peluquero[] {
    return this.peluqueros;
  }

  // Genera bloques de 30 minutos desde las 09:00 hasta las 18:00
  generarHorariosDisponibles(peluqueroId: number, fecha: string): string[] {
    const horariosTodoElDia = [
      '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', 
      '12:00', '12:30', '13:00', '13:30', '16:00', '16:30', 
      '17:00', '17:30', '18:00'
    ];

    // Filtramos las horas que ya están cogidas para ese peluquero en ese día específico
    const ocupadas = this.citasSubject.value.filter(
      cita => cita.peluqueroId === peluqueroId && cita.fecha === fecha
    ).map(cita => cita.hora);

    return horariosTodoElDia.filter(hora => !ocupadas.includes(hora));
  }

  // Registra la cita y actualiza automáticamente a todos los componentes que estén escuchando
  reservarCita(peluqueroId: number, fecha: string, hora: string): boolean {
    const nuevaCita: CitaReservada = { peluqueroId, fecha, hora };
    const actuales = this.citasSubject.value;
    
    this.citasSubject.next([...actuales, nuevaCita]);
    return true;
  }
}