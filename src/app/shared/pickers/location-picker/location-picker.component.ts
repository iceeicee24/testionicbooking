import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { MapModalComponent } from '../../map-modal/map-modal.component';
import { HttpClient } from '@angular/common/http';
import { map, switchMap } from 'rxjs/operators';
import { PlaceLocation } from 'src/app/places/location.model';
import { of } from 'rxjs';

@Component({
  selector: 'app-location-picker',
  templateUrl: './location-picker.component.html',
  styleUrls: ['./location-picker.component.scss'],
})
export class LocationPickerComponent implements OnInit {

  selectedLocationImage: string;
  isLoading = false;

  constructor(
    private modalCtrl: ModalController,
    private http: HttpClient) { }

  ngOnInit() {}

  onPickLocation() {
    this.modalCtrl.create({component: MapModalComponent})
    .then(modalEl => {
      modalEl.onDidDismiss().then(modalData => {
        if (!modalData.data) {
          return;
        }

        const pickedLocation: PlaceLocation = {
          lat: modalData.data.lat,
          lng: modalData.data.lng,
          address: null,
          statitMapImageUrl: null
        };
        this.isLoading = true;
        this.getAddress(modalData.data.lat, modalData.data.lng)
        .pipe(
          switchMap(address => {
            pickedLocation.address = address;
            return of(this.getMapImage(pickedLocation.lat, pickedLocation.lng, 14));
          })
        ).subscribe(staticMapImagrUrl => {
          pickedLocation.statitMapImageUrl = staticMapImagrUrl;
          this.selectedLocationImage = staticMapImagrUrl;
          this.isLoading = false;
        });

        console.log(modalData);
      });
      modalEl.present();
    });
  }

  private getAddress(lat: number, lng: number) {
    return this.http.get<any>(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},
    ${lng}&key=AIzaSyAW9S4GdM2YYSuyFJFvvhs-8S3DeFgDPyg`)
    .pipe(map((geoData: any) => {
      if (!geoData || !geoData.results || geoData.results.length === 0) {
        return null;
      }

      return geoData.results[0].formatted_address;
      console.log(geoData);
    }));

  }

  private getMapImage(lat: number, lng: number, zoom: number) {
     return `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=${zoom}&size=500x300&maptype=roadmap
     &markers=color:red%7Clabel:Place%7C${lat},${lng}&key=AIzaSyAW9S4GdM2YYSuyFJFvvhs-8S3DeFgDPyg`;
  }
}
