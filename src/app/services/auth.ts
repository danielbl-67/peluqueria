import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { supabaseConfig } from '../config/supabase.config/supabase.config';
import { BehaviorSubject } from 'rxjs';

export type RolUsuario = 'administrador' | 'peluquero' | 'cliente' | null;

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private supabase: SupabaseClient;
  
  // BehaviorSubject para que toda la web sepa el rol en tiempo real
  private rolActualSubject = new BehaviorSubject<RolUsuario>(null);
  rolActual$ = this.rolActualSubject.asObservable();

  constructor() {
    this.supabase = createClient(supabaseConfig.url, supabaseConfig.key);
    this.evaluarSesionActiva();
  }

  // Comprueba si el usuario ya estaba logueado al recargar la página
  async evaluarSesionActiva() {
    const { data: { session } } = await this.supabase.auth.getSession();
    if (session?.user) {
      this.obtenerRolDeUsuario(session.user.id);
    } else {
      // Si no está logueado, por defecto ve la web como cliente público
      this.rolActualSubject.next('cliente');
    }
  }

  // Consulta el rol real en la tabla 'perfiles' de Supabase
  async obtenerRolDeUsuario(uid: string) {
    const { data, error } = await this.supabase
      .from('perfiles')
      .select('rol')
      .eq('id', uid)
      .single();

    if (data && !error) {
      this.rolActualSubject.next(data.rol as RolUsuario);
    } else {
      this.rolActualSubject.next('cliente');
    }
  }

  // Función simulada para tus pruebas locales: Cambia el rol con un botón
  cambiarRolSimulado(nuevoRol: RolUsuario) {
    this.rolActualSubject.next(nuevoRol);
  }

  obtenerRolActual(): RolUsuario {
    return this.rolActualSubject.value;
  }
}