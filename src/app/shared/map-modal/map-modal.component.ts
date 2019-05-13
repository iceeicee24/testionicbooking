import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, Renderer2, OnDestroy } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Renderer3 } from '@angular/core/src/render3/interfaces/renderer';
import { Listener } from 'selenium-webdriver';

@Component({
  selector: 'app-map-modal',
  templateUrl: './map-modal.component.html',
  styleUrls: ['./map-modal.component.scss'],
})
export class MapModalComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('map') mapElementRef: ElementRef;
  clickListener: any;
  googleMaps: any;

  constructor(
    private modalCtrl: ModalController,
    private renderer: Renderer2
  ) { }

  ngOnInit() {}

  ngOnDestroy() {
    if (this.clickListener) {
      this.googleMaps.event.removeListener(this.clickListener);
    }
  }

  ngAfterViewInit() {
    this.getGoogleMaps().then(googleMaps => {
    this.googleMaps = googleMaps;
    const mapEl = this.mapElementRef.nativeElement;
    const map = new googleMaps.Map(mapEl, {
        center: {
          lat: -33.808519,
          lng: 151.105392
        },
        zoom: 16
      });
    googleMaps.event.addListenerOnce(map, 'idle', () => {
      this.renderer.addClass(mapEl, 'visible');
    });

    this.clickListener = map.addListener('click', event => {
      const selectedCoords = {
        lat: event.latLng.lat(),
        lng: event.latLng.lng()
      };
      this.modalCtrl.dismiss(selectedCoords);
    });

    }).catch(err => {
      console.log(err);
    });

  }

  private getGoogleMaps(): Promise <any> {
    const win = window as any;
    const googleModule = win.google;

    if (googleModule && googleModule.maps) {
      return Promise.resolve(googleModule.maps);
    }

    return new Promise ((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyAW9S4GdM2YYSuyFJFvvhs-8S3DeFgDPyg';
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
      script.onload = () => {
        const loadedGoogleModule = win.google;
        if (loadedGoogleModule && loadedGoogleModule.maps) {
          resolve(loadedGoogleModule.maps);
        } else {
          reject('google maps not available.')
        }
      };
    });
  }

  onCancel() {
    this.modalCtrl.dismiss();
  }
}
