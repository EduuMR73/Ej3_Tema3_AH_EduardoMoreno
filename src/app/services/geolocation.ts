import { Injectable } from '@angular/core';
import { Geolocation } from '@capacitor/geolocation';

@Injectable({
  providedIn: 'root'
})
export class GeolocationService {

  // Obtener la posición actual, pidiendo permiso y usando timeout largo (mejora compatibilidad Android)
  async getCurrentPosition(): Promise<any> {
    try {
      await Geolocation.requestPermissions();
      const coordinates = await Geolocation.getCurrentPosition({
        timeout: 10000 // 10 segundos para evitar 'timeout' en emulador Android
      });
      console.log('Coordenadas:', coordinates); // Debug útil
      return coordinates;
    } catch (err) {
      console.error('Error getCurrentPosition:', err);
      throw err;
    }
  }

  // Seguir posición, devuelve el id para limpiar luego (importante para standalone Angular)
  async watchPosition(callback: (position: any) => void): Promise<any> {
    const watchId = await Geolocation.watchPosition({ enableHighAccuracy: true }, (position, err) => {
      if (err) {
        console.error('Error watching position:', err);
        return;
      }
      if (position) {
        callback(position);
      }
    });
    return watchId;
  }

  // Detener el seguimiento de posición
  clearWatch(watchId: string) {
    try {
      Geolocation.clearWatch({ id: watchId });
    } catch (err) {
      console.warn('Error clearing watch:', err);
    }
  }
}
