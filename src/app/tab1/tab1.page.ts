import { Component } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { map } from "rxjs/operators";
import { Observable } from 'rxjs';
import { Camera, CameraOptions } from "@ionic-native/camera/ngx";
import { AlertController } from '@ionic/angular';


export interface Todo {
  id?: string;
  name: string;
}

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  private dbColl: AngularFirestoreCollection<Todo>;
  names: Observable<Todo[]>;

  input : Todo = {
    name: "Ahmed"
  };
  base64: string;

  constructor(private db: AngularFirestore, private camera: Camera, private alertCtr: AlertController){
    this.dbColl = db.collection('names');
    this.names = this.dbColl.snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return {id, ...data};
        });
      })
    );
  }

  ngOnInit(){

  }
  addInput(){
    return this.dbColl.add(this.input);
  }

  takePicture(){
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.FILE_URI,
      sourceType: this.camera.PictureSourceType.CAMERA,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    };
    this.camera.getPicture(options).then((imgData) => {
      this.base64 = 'data:image/jpeg;base64,' + imgData;
      this.alertCtr.create({
        header: "Picture Taked",
        message: this.base64,
        buttons: ["OK"]
      }).then(alert => alert.present());
    }, (err) => {
      console.log(err);
    });
  }

  uploadPhoto(){
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.FILE_URI,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    };
    this.camera.getPicture(options).then((imgData) => {
      this.base64 = 'data:image/jpeg;base64,' + imgData;
      this.alertCtr.create({
        header: "Picture Taked",
        message: this.base64,
        buttons: ["OK"]
      }).then(alert => alert.present());
    }, (err) => {
      console.log(err);
    });

  }
}
