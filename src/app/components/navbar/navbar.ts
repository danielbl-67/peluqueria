import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Asegúrate de tenerlo si usas standalone

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css']
})
export class NavbarComponent implements OnInit {
  seccionActiva: string = 'inicio';

  ngOnInit() {
    // Al arrancar, comprobamos si hay algún hash en la URL
    const hash = window.location.hash.replace('#', '');
    if (hash) {
      this.seccionActiva = hash;
    }
  }

  // Escucha el movimiento del scroll para iluminar el menú automáticamente
  @HostListener('window:scroll', [])
  onWindowScroll() {
    const secciones = ['inicio', 'sobre-nosotros', 'citas'];
    const scrollPosition = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;

    for (const seccion of secciones) {
      const elemento = document.getElementById(seccion);
      if (elemento) {
        // Si la sección está visible en la pantalla (ajusta el offset si es necesario)
        const top = elemento.offsetTop - 150; 
        const bottom = top + elemento.offsetHeight;

        if (scrollPosition >= top && scrollPosition < bottom) {
          this.seccionActiva = seccion;
          break;
        }
      }
    }
  }

  // Cambia la sección activa de forma manual al hacer clic
  fijarActiva(seccion: string) {
    this.seccionActiva = seccion;
  }
}