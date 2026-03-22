import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CrudService } from 'src/app/services/crud.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-capture-id',
  standalone: false,
  templateUrl: './capture-id.component.html',
  styleUrls: ['./capture-id.component.scss']
})
export class CaptureIdComponent {
  @Output() onIneProcessed = new EventEmitter<any>();
  
  form: FormGroup;
  result: any = null;
  frontalImage: string | null = null;
  validationSuccessful: boolean = false;
  loading: boolean = false; // Variable para controlar el estado del loader

  constructor(
    private fb: FormBuilder,
    private crud: CrudService
  ) {
    this.form = this.fb.group({
      id: ['', Validators.required],
      idReverso: ['', Validators.required]
    });
  }

  onFileChange(event: any, field: string) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];

      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result as string;
        const control = this.form.get(field);
        if (control) {
          control.setValue(base64.split(',')[1]);

          if (field === 'id') {
            this.frontalImage = base64; // Guardar la imagen frontal para mostrarla
          }
        }
      };
      reader.readAsDataURL(file);
    }
  }

  submit() {
    if (this.form.valid) {
      this.loading = true; // Mostrar el loader

      this.crud.save('clientes/obtener-datos-ine', this.form.value).subscribe(
        (response: any) => {
          this.loading = false; // Ocultar el loader
          this.result = response;
          
          this.onIneProcessed.emit({ success: true, result: response });
        },
        (error: any) => {
          this.loading = false; // Ocultar el loader en caso de error
          this.result = null;

          this.onIneProcessed.emit({ success: false });
        }
      );
    }
  }

  validateINE() {
    const { cic, identificadorCiudadano } = this.result;
    this.crud.save('clientes/ine/validate', {
      cic,
      identificadorCiudadano,
      previousINEData: this.result
    }).subscribe(
      (response: any) => {
        this.validationSuccessful = response.message === 'INE validado correctamente y todos los datos coinciden.';

        Swal.fire({
          title: 'Resultado de la Validación',
          text: response.message,
          icon: this.validationSuccessful ? 'success' : 'warning',
          confirmButtonText: 'Aceptar'
        });
      },
      (error: any) => {
        Swal.fire({
          title: 'Error',
          text: 'Error al validar el INE',
          icon: 'error',
          confirmButtonText: 'Aceptar'
        });
      }
    );
  }

  clearData() {
    this.result = null;
    this.frontalImage = null;
    this.validationSuccessful = false;
    this.form.reset();
  }

}
