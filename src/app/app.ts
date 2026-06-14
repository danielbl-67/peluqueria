import { Component, signal } from '@angular/core';
import { Navbar } from './components/navbar/navbar';
import { Inicio } from './components/inicio/inicio';
import { SobreNosotros } from './components/sobre-nosotros/sobre-nosotros';
import { Citas } from './components/citas/citas';

@Component({
  selector: 'app-root',
  imports: [Navbar, Inicio, SobreNosotros, Citas],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('peluqueria');
}
