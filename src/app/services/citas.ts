import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { supabaseConfig } from '../config/supabase.config/supabase.config';
import { BehaviorSubject } from 'rxjs';

export interface Peluquero {
  id: number;
  nombre: string;
  especialidad: string;
  foto_url?: string;
}

@Injectable({
  providedIn: 'root'
})
export class CitasService {
  private supabase: SupabaseClient;
  
  private citasActualizadas = new BehaviorSubject<void>(undefined);
  citas$ = this.citasActualizadas.asObservable();

  constructor() {
    this.supabase = createClient(supabaseConfig.url, supabaseConfig.key);
  }

  // TRAER STAFF DESDE SUPABASE: Ya no están fijos en Angular
  async obtenerPeluqueros(): Promise<Peluquero[]> {
    const { data, error } = await this.supabase
      .from('peluqueros')
      .select('*')
      .order('id', { ascending: true });
      
    if (error) {
      console.error('Error al traer peluqueros:', error);
      return [];
    }
    return data || [];
  }

  // OBTENER CITAS EXCLUSIVAS DE UN PELUQUERO (La clave de lo que pides)
  async obtenerCitasPorPeluquero(peluqueroId: number): Promise<any[]> {
    const { data, error } = await this.supabase
      .from('appointments')
      .select('*')
      .eq('peluquero_id', peluqueroId)
      .order('fecha_de_reserva', { ascending: true })
      .order('hora_de_reserva', { ascending: true });

    if (error) {
      console.error('Error al obtener agenda del peluquero:', error);
      return [];
    }
    return data || [];
  }

  // Trae las horas ocupadas para el proceso de reserva del cliente
  async obtenerHorasOcupadas(peluqueroId: number, fecha: string): Promise<string[]> {
    const { data, error } = await this.supabase
      .from('appointments')
      .select('hora_de_reserva')
      .eq('peluquero_id', peluqueroId)
      .eq('fecha_de_reserva', fecha);

    if (error) return [];
    return data ? data.map((c: any) => c.hora_de_reserva.substring(0, 5)) : [];
  }

  async generarHorariosDisponibles(peluqueroId: number, fecha: string): Promise<string[]> {
    const horariosTodoElDia = [
      '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', 
      '12:00', '12:30', '13:00', '13:30', '16:00', '16:30', 
      '17:00', '17:30', '18:00'
    ];
    const ocupadas = await this.obtenerHorasOcupadas(peluqueroId, fecha);
    return horariosTodoElDia.filter(hora => !ocupadas.includes(hora));
  }

  async reservarCita(peluqueroId: number, fecha: string, hora: string, nombreCliente: string): Promise<boolean> {
    const { error } = await this.supabase
      .from('appointments')
      .insert([
        { 
          peluquero_id: peluqueroId, 
          fecha_de_reserva: fecha, 
          hora_de_reserva: hora,
          nombre_cliente: nombreCliente
        }
      ]);

    if (error) return false;
    this.citasActualizadas.next();
    return true;
  }
  // === GESTIÓN DE PELUQUEROS (ADMIN) ===

  async agregarPeluquero(nombre: string, especialidad: string, fotoUrl: string): Promise<boolean> {
    const { error } = await this.supabase
      .from('peluqueros')
      .insert([{ nombre, especialidad, foto_url: fotoUrl }]);
    
    if (error) return false;
    this.citasActualizadas.next(); // Refresca las listas globales
    return true;
  }

  async modificarPeluquero(id: number, nombre: string, especialidad: string, fotoUrl: string): Promise<boolean> {
    const { error } = await this.supabase
      .from('peluqueros')
      .update({ nombre, especialidad, foto_url: fotoUrl })
      .eq('id', id);

    if (error) return false;
    this.citasActualizadas.next();
    return true;
  }

  async eliminarPeluquero(id: number): Promise<boolean> {
    const { error } = await this.supabase
      .from('peluqueros')
      .delete()
      .eq('id', id);

    if (error) return false;
    this.citasActualizadas.next();
    return true;
  }

  // === GESTIÓN DE CITAS (ADMIN: Mover cita de peluquero) ===

  async reasignarPeluqueroCita(citaId: number, nuevoPeluqueroId: number): Promise<boolean> {
    const { error } = await this.supabase
      .from('appointments')
      .update({ peluquero_id: nuevoPeluqueroId })
      .eq('id', citaId);

    if (error) {
      console.error('Error al mover la cita:', error);
      return false;
    }
    this.citasActualizadas.next();
    return true;
  }
}