import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { CrudService } from 'src/app/services/crud.service';
import { FunctionsService } from 'src/app/services/functions.service';
import { ValidationService } from 'src/app/services/validation.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-new-cliente',
  standalone: false,
  templateUrl: './new-cliente.component.html',
  styleUrl: './new-cliente.component.scss'
})
export class NewClienteComponent implements OnInit {
  form: any;
  loading: boolean | undefined;

  isFormVisible: boolean = false;
  autoFillEnabled: boolean = false;
  isUpdateMode: boolean = false;

  cliente: any = {
    id: ''
  };

  display: boolean = false;

  constructor(
    private crud: CrudService,
    private formBuilder: UntypedFormBuilder,
    private fun: FunctionsService,
    private activatedRoute: ActivatedRoute,
    private auth: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();

    const id = this.activatedRoute.snapshot.paramMap.get('id');
    if (id) {
        this.getCliente(id);
        this.isFormVisible = true; // Mostrar el formulario directamente si es una actualización
        this.isUpdateMode = true;
    }
  }
  
  initForm(): void {
    this.form = this.formBuilder.group({
      nombre: ['', Validators.required],
      paterno: ['', Validators.required],
      materno: ['', Validators.required],
      correo_electronico: ['', [Validators.required, ValidationService.emailValidator]],
      telefono: ['', Validators.required],
      telefono_alternativo: [''],
      fecha_nacimiento: ['', Validators.required],
      curp: ['', Validators.required],
      cic: ['', Validators.required],
      identificadorCiudadano: ['', Validators.required],
      genero: ['', Validators.required]
    });
  }

  showDialog(): void {
    this.display = true;
  }

  submit(): void {
    if (this.form.dirty && this.form.valid) {
      this.loading = true;
      if (this.cliente.id) {
        this.onUpdate();
      } else {
        this.onSave();
      }
    } else {
      for (let i in this.form.controls) this.form.controls[i].markAsTouched();
    }
  }

  handleIneProcessed(data: any): void {
    if (data.success) {
      this.fillFormWithIneData(data.result);
      this.isFormVisible = true;
    } else {
      Swal.fire({
        title: 'Error al procesar INE',
        text: '¿Deseas reintentarlo o hacerlo manualmente?',
        icon: 'error',
        showCancelButton: true,
        confirmButtonText: 'Reintentar',
        cancelButtonText: 'Capturación manual'
      }).then((result) => {
        if (result.isConfirmed) {
          this.retryIneProcess();
        } else {
          this.showFormManually();
        }
      });
    }
  }

  retryIneProcess(): void {
    // Logic to retry INE processing
  }

  showFormManually(): void {
    this.isFormVisible = true;
  }

  resetToIneCapture(): void {
    this.form.reset();
    this.isFormVisible = false;
  }

  fillFormWithIneData(data: any): void {
    this.form.get('curp').setValue(data.curp);
    this.form.get('nombre').setValue(data.nombres);
    this.form.get('paterno').setValue(data.primerApellido);
    this.form.get('materno').setValue(data.segundoApellido);

    // Convertir la fecha de nacimiento a formato YYYY-MM-DD
    const [day, month, year] = data.fechaNacimiento.split('/');
    const formattedDate = `${year}-${month}-${day}`;
    this.form.get('fecha_nacimiento').setValue(formattedDate);

    this.form.get('cic').setValue(data.cic);
    this.form.get('identificadorCiudadano').setValue(data.identificadorCiudadano);
    this.form.get('genero').setValue(data.sexo === 'H' ? 'M' : 'F');
  }

  getCliente(id: any): void {
    this.loading = true;

    this.crud.getList(`crud/clientes/${id}`).subscribe((response: any) => {
      this.cliente = response;
    
      this.form.markAsDirty();

      this.form.get('nombre').setValue(this.cliente.nombre);
      this.form.get('paterno').setValue(this.cliente.paterno);
      this.form.get('materno').setValue(this.cliente.materno);
      this.form.get('correo_electronico').setValue(this.cliente.correo_electronico);
      this.form.get('telefono').setValue(this.cliente.telefono);
      this.form.get('telefono_alternativo').setValue(this.cliente.telefono_alternativo);
      this.form.get('fecha_nacimiento').setValue(this.cliente.fecha_nacimiento);
      this.form.get('curp').setValue(this.cliente.curp);
      this.form.get('cic').setValue(this.cliente.cic);
      this.form.get('identificadorCiudadano').setValue(this.cliente.identificadorCiudadano);
      this.form.get('genero').setValue(this.cliente.genero);

      // Incluir desarrollo de muestreo de fotografía

      this.loading = false;
    });
  }

  onSave(): void {
    this.loading = true;

    const formData = {
      ...this.form.value,
      agente_id: this.auth.user.id
    }

    this.crud.save("clientes", formData).subscribe((response) => {
      this.loading = false;
      this.fun.presentAlert(response.message);
      this.router.navigateByUrl("component/clientes/list");
    }, (error) => {
      this.loading = false; // Ocultar el loader antes de mostrar la alerta

      if (error.error.message === "El INE no está vigente o los datos no son correctos") {
        // Mostrar SweetAlert con tres botones
        Swal.fire({
          title: 'INE no válida',
          text: 'El INE no es válida o los datos son incorrectos. Puede usar la herramienta de validación. ¿Desea continuar y registrar sin validar el INE bajo su responsabilidad?',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Guardar sin validar INE',
          cancelButtonText: 'Cancelar',
          showDenyButton: true,
          denyButtonText: 'Herramienta de Validación'
        }).then((result) => {
          if (result.isConfirmed) {
            // Si el usuario confirma, intenta guardar sin validar INE
            this.saveWithoutINEValidation();
          } else if (result.isDenied) {
            // Si el usuario selecciona la herramienta de validación, redirigir a la página correspondiente
            this.router.navigateByUrl('component/clientes/capture');
          }
        });
      }
    });
  }

  onUpdate(): void {
    // Implement update logic
  }

  saveWithoutINEValidation(): void {
    const formData = {
        ...this.form.value,
        agente_id: this.auth.user.id,
        skipINEValidation: true // Enviar un indicador al backend para omitir la validación del INE
    };

    this.loading = true;

    this.crud.save("clientes", formData).subscribe(
        (response) => {
            this.loading = false;
            
            this.fun.presentAlert(response.message);
            this.router.navigateByUrl("component/clientes/list");
        },
        (error) => {
            this.loading = false; // Ocultar el loader ante un error
        }
    );
  }

  onCurpChange(): void {
    if (this.autoFillEnabled) {
      const curpValue = this.form.get('curp').value;

      if (curpValue) {
        this.loading = true; // Mostrar el loader

        this.crud.save('clientes/curp/validate', { curp: curpValue }).subscribe((response: any) => {
          this.loading = false; // Ocultar el loader

          if (response.estatus === 'OK') {
            this.form.get('nombre').setValue(response.nombre);
            this.form.get('paterno').setValue(response.apellidoPaterno);
            this.form.get('materno').setValue(response.apellidoMaterno);
            this.form.get('fecha_nacimiento').setValue(response.fechaNacimiento);
            this.form.get('genero').setValue(response.sexo === 'HOMBRE' ? 'M' : 'F');
          }
        }, (error) => {
          this.loading = false; // Ocultar el loader ante un error
        });
      }
    }
  }

}
