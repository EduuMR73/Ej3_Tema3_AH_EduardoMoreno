import { Component, OnInit, OnDestroy } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { GeolocationService } from '../services/geolocation';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [IonicModule],
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy {
  lat: number | undefined;
  lng: number | undefined;
  watchId: string | undefined;
  darkMode = false;

  constructor(private geoService: GeolocationService) {}

  ngOnInit() {
    this.getLocation();
    this.watchPosition();
    this.darkMode = document.body.classList.contains('dark');
  }

  ngOnDestroy() {
    if (this.watchId) {
      this.geoService.clearWatch(this.watchId);
    }
  }

  async getLocation() {
    try {
      const position = await this.geoService.getCurrentPosition();
      this.lat = position.coords.latitude;
      this.lng = position.coords.longitude;
    } catch (err) {
      this.lat = undefined;
      this.lng = undefined;
    }
  }

  async watchPosition() {
    this.watchId = await this.geoService.watchPosition((position: any) => {
      if (position && position.coords) {
        this.lat = position.coords.latitude;
        this.lng = position.coords.longitude;
      }
    });
  }

  toggleDarkMode() {
    this.darkMode = !this.darkMode;
    document.body.classList.toggle('dark', this.darkMode);
  }
}
