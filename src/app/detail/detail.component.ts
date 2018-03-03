import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { FirebaseApp } from 'angularfire2';
import { Observable } from 'rxjs/Observable';
import { Horse } from '../horse';
import { SafeUrl } from '@angular/platform-browser';
import { DomSanitizer } from '@angular/platform-browser';
import { AgmCoreModule } from '@agm/core';
import * as jQuery from 'jquery';

import { AngularFireAuth } from 'angularfire2/auth'
import PhotoSwipe from 'photoswipe';
import PhotoSwipeUI_Default from 'photoswipe/dist/photoswipe-ui-default';
//import { NgxGalleryOptions, NgxGalleryImage, NgxGalleryAnimation } from 'ngx-gallery'
import { ViewChild, ElementRef, Input } from '@angular/core';


declare var jQuery: any;

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css']
})
export class DetailComponent {
  @ViewChild('photoSwipe') photoSwipe: ElementRef;
  @Input() indexValueFromParent: number;

  horseDoc: AngularFirestoreDocument<Horse>;
  horse: Observable<Horse>;
  iSspinnerActive: boolean = true;
  videoUrl: SafeUrl;
  hasVideo: boolean;
  images: any[] = [];
  isEditable: boolean = false;

  iframe_html: any;
  lat: number;
  lng: number;
  hasCoordinates: boolean;
  uid: string;

  processedImageIndexes: number[] = new Array(10)


  constructor(private afs: AngularFirestore, private route: ActivatedRoute, private router: Router, private sanitizer: DomSanitizer, private auth: AngularFireAuth) {
    var h = this.afs.doc<Horse>("horses/" + this.route.snapshot.paramMap.get("id") + "/");
    this.horse = h.valueChanges();

    if(auth.auth.currentUser != null){
      this.uid = auth.auth.currentUser.uid;
    }
    
    this.horse.subscribe(x => {
      this.iSspinnerActive = false;
      window.scrollTo(0, 0)
      if(x.videoUrl != null && x.videoUrl != ''){
        this.videoUrl =this.sanitizer.bypassSecurityTrustResourceUrl(x.videoUrl);
        this.hasVideo = true;
      }
      if(x.lat != null && x.lat != ''){
        this.hasCoordinates = true;
        this.lat = Number(x.lat);
        this.lng = Number(x.lng);
      }
      
      if(x.image1 != null && x.image1 != ''){
        this.images.push(x.image1);
        //this.galleryImages.push({ small: x.image1, medium: x.image1, big: x.image1 });
      }

      if(x.image2 != null && x.image2 != ''){
      //   this.galleryImages.push({ small: x.image2, medium: x.image2, big: x.image2 });
      this.images.push(x.image2);        
       }
      
       if(x.image3 != null && x.image3 != ''){
        this.images.push(x.image3);
      //   this.galleryImages.push({ small: x.image3, medium: x.image3, big: x.image3 });
       }
      
       if(x.image4 != null && x.image4 != ''){
        this.images.push(x.image4);
      //   this.galleryImages.push({ small: x.image4, medium: x.image4, big: x.image4});
       }

       if(this.uid == x.uid){
        this.isEditable = true;        
       }

       this.horse.share();

    });
    }

  imagesLoaded(event:any) {
    console.log(event);
}

  ngAfterViewInit(): void {
    document.body.scrollTop = 0;
  }

  ngOnInit(){
    document.body.scrollTop = 0;
    
  }

  onClick(i){
    var images = this.images.map(x =>  {
      return {
        src: x,
        w: 600,
        h: 600
      }
    })
    // define options (if needed)
    const options = {
        index: i // start at first slide
    };

  // Initializes and opens PhotoSwipe
  const gallery = new PhotoSwipe(this.photoSwipe.nativeElement, PhotoSwipeUI_Default, images, options);
  gallery.init();

  gallery.listen('imageLoadComplete', function (index, item) {

    if(!item.initialLayout){
      var img = new Image();
      img.onload = function () {
        item.w = img.width;
        item.h = img.height;
      
        item.initialPosition = true;
      
        gallery.updateSize(true);

      }
      img.src = item.src;
    
      item.initialLayout = true
    }

});


  }
  
}
