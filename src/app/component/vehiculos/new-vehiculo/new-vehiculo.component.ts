import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { WebcamImage } from 'ngx-webcam';
import { Observable, Subject } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { CrudService } from 'src/app/services/crud.service';
import { FileUploadService } from 'src/app/services/file-upload.service';
import { FunctionsService } from 'src/app/services/functions.service';
import { ImageService } from 'src/app/services/image.service';

@Component({
  selector: 'app-new-vehiculo',
  standalone: false,
  templateUrl: './new-vehiculo.component.html',
  styleUrl: './new-vehiculo.component.scss'
})
export class NewVehiculoComponent implements OnInit {
  form: any;
  loading: boolean | undefined;

  vehiculo: any = {
    id: ''
  };

  activeIndex: number = 0;
  
  brands: any;
  models: any;
  types: any;
  
  items = [
    { label: 'Datos Básicos' },
    { label: 'Detalles del Vehículo' },
    { label: 'Detalles 2' },
    { label: 'Detalles 3' }
  ];

  // Nuevas variables
  editVehiculo: boolean = false;
  imageUrl: any;
  fileSelected = false;
  selectedFiles?: FileList;
  previsualizacion: string = '';
  imageSelected = false;
  status: any = null;
  stream: any = null;
  trigger: Subject<void> = new Subject();
  previewImage: string = '';

  constructor(
    private crud: CrudService,
    private formBuilder: UntypedFormBuilder,
    private fun: FunctionsService,
    private activatedRoute: ActivatedRoute,
    private auth: AuthService,
    private router: Router,
    private upload: FileUploadService,
    private image: ImageService
  ) {}

  ngOnInit(): void {
    this.loadData();

    this.form = this.formBuilder.group({
      marca_id: ['', Validators.required],
      modelo_id: ['', Validators.required],
      deposito: ['0.00', [Validators.required, Validators.pattern(/^\d{0,10}(\.\d{0,2})?$/)]],
      color: ['', Validators.required],
      num_serie: ['', [Validators.required, Validators.minLength(17), Validators.maxLength(17)]],
      placa: ['', Validators.required],
      kms: ['', Validators.required],
      ano: ['', Validators.required],
      cilindros: ['', Validators.required],
      estado: ['', Validators.required],
      combustible: ['', Validators.required],
      tipo_id: ['', Validators.required],
      tarifa_diaria: ['0.00', [Validators.required, Validators.pattern(/^\d{0,10}(\.\d{0,2})?$/)]],
      dia_adicional: ['0.00', [Validators.required, Validators.pattern(/^\d{0,10}(\.\d{0,2})?$/)]],
      hora_adicional: ['0.00', [Validators.required, Validators.pattern(/^\d{0,10}(\.\d{0,2})?$/)]],
      foto: ['']
    });

    
    if (this.activatedRoute.snapshot.paramMap.get('id')) {
      this.getVehiculo(this.activatedRoute.snapshot.paramMap.get('id'));
      this.editVehiculo = true;
    }
  }

  submit(): void {
    if (this.form.dirty && this.form.valid) {
      if (this.vehiculo.id) {
        this.onUpdate();
      } else {
        this.onSave();
      }
    } else {
      for (let i in this.form.controls) this.form.controls[i].markAsTouched();
    }
  }

  getVehiculo(id: any): void {
    this.loading = true;

    this.crud.getList(`crud/vehiculos/${id}`).subscribe((response: any) => {
      this.vehiculo = response;
      
      this.form.markAsDirty();

      this.form.get('marca_id').setValue(this.vehiculo.marca_id);
      this.form.get('modelo_id').setValue(this.vehiculo.modelo_id);
      this.form.get('deposito').setValue(this.vehiculo.deposito);
      this.form.get('color').setValue(this.vehiculo.color);
      this.form.get('num_serie').setValue(this.vehiculo.num_serie);
      this.form.get('placa').setValue(this.vehiculo.placa);
      this.form.get('kms').setValue(this.vehiculo.kms);
      this.form.get('ano').setValue(this.vehiculo.ano);
      this.form.get('cilindros').setValue(this.vehiculo.cilindros);
      this.form.get('estado').setValue(this.vehiculo.estado);
      this.form.get('combustible').setValue(this.vehiculo.combustible);
      this.form.get('tipo_id').setValue(this.vehiculo.tipo_id);
      this.form.get('tarifa_diaria').setValue(this.vehiculo.tarifa_diaria);
      this.form.get('dia_adicional').setValue(this.vehiculo.dia_adicional);
      this.form.get('hora_adicional').setValue(this.vehiculo.hora_adicional);
      
      if (this.vehiculo.foto) {
        this.getImage(this.vehiculo.foto);
      }

      this.loading = false;
    });
  }

  getImage(foto: any) {
    if (!foto) {
      console.error('No valid image path provided.');
      return; // Salir del método si no hay una foto válida
    }
  
    try {
      this.upload.getImage(foto).subscribe({
        next: (response: any) => {
          this.image.convertBlobToSafeUrl(response).subscribe({
            next: (safeUrl: any) => {
              this.imageUrl = safeUrl;
            },
            error: (error: any) => {
              console.error('Error converting image to SafeUrl: ', error);
            }
          });
        },
        error: (error: any) => {
          console.error('Error fetching image: ', error);
        }
      });
    } catch (error) {
      console.error('Error getting image: ', error);
    }
  }  

  get $trigger(): Observable<void>{
    return this.trigger.asObservable();
  }

  checkPermissions(){
    this.imageSelected = true;
    navigator.mediaDevices.getUserMedia({
      video: {
        width: 500,
        height: 500
      }
    }).then((res) => {
      this.stream = res;
      this.status = 'Conectado';
    }).catch(err => {
      if(err?.message === 'Permission denied') {
        this.status = 'Permiso denegado, por favor aprueba el permiso de la cámara.'
      } else {
        this.status = '¡Tú cámara no está disponible!'
      }
    })
  }

  captureImage(){
    this.trigger.next();
  }

  snapshot(event: WebcamImage) {
    this.previewImage = event.imageAsDataUrl;
  }

  loadData() {
    this.crud.getList("vehiculos/data").subscribe((data) => {
      this.brands = data.brands;
      this.models = data.models;
      this.types = data.types;
    });
  }

  onNext() {
    if (this.activeIndex < this.items.length - 1) {
      this.activeIndex++;
    }
  }

  onPrev() {
    if (this.activeIndex > 0) {
      this.activeIndex--;
    }
  }

  selectFile(event: any): void {
    this.fileSelected = true;
    this.selectedFiles = event.target.files;
    
    const archivoCapturado = event.target.files[0];
    
    this.image.extractBase64(archivoCapturado).then((Imagen: any) => {
      this.previsualizacion = Imagen.base;
    });
  }

  deleteImage(): void {
    this.imageUrl = null;
    this.form.get('foto').setValue('');
    this.editVehiculo = false;
  }

  onSave(): void {
    const formData = new FormData();
    Object.keys(this.form.value).forEach(key => {
      formData.append(key, this.form.value[key]);
    });
  
    if (this.selectedFiles) {
      const file: File | null = this.selectedFiles.item(0);
      if (file) {
        formData.append('foto', file);
      }
    } else if (this.previewImage) {
      try {
        const blob = this.image.dataURItoBlob(this.previewImage, 'image/jpeg') as Blob;
        const file = new File([blob], 'foto.jpg', { type: 'image/jpeg' });
        formData.append('foto', file);
      } catch (error) {
        console.error('Error converting image: ', error);
      }
    }
  
    formData.append('agente_id', this.auth.user.id);

    this.crud.save("vehiculos", formData).subscribe((response) => {
      this.loading = false;
      this.fun.presentAlert(response.message);
      this.router.navigateByUrl("component/vehiculos/list");
    });
  }  

  onUpdate(): void {
    // Implement update logic
  }

}
