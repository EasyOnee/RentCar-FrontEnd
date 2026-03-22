import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { CrudService } from 'src/app/services/crud.service';
import { FunctionsService } from 'src/app/services/functions.service';

@Component({
  selector: 'app-new-marca',
  standalone: false,
  templateUrl: './new-marca.component.html',
  styleUrl: './new-marca.component.scss'
})
export class NewMarcaComponent implements OnInit {
  form: any;
  loading: boolean | undefined;

  marca: any = {
    id: ''
  };

  constructor(
    private crud: CrudService,
    private formBuilder: UntypedFormBuilder,
    private fun: FunctionsService,
    private activatedRoute: ActivatedRoute,
    private auth: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      nombre: ['', Validators.required]
    });

    if (this.activatedRoute.snapshot.paramMap.get('id')) {
      this.getMarca(this.activatedRoute.snapshot.paramMap.get('id'));
    }
  }

  submit(): void {
    if (this.form.dirty && this.form.valid) {
      if (this.marca.id) {
        this.onUpdate();
      } else {
        this.onSave();
      }
    } else {
      for (let i in this.form.controls) this.form.controls[i].markAsTouched();
    }
  }

  getMarca(id: any): void {
    this.loading = true;

    this.crud.getList(`crud/marcas/${id}`).subscribe((response: any) => {
      this.marca = response;
    
      this.form.markAsDirty();

      this.form.get('nombre').setValue(this.marca.nombre);

      this.loading = false;
    });
  }

  onSave(): void {
    this.loading = true;

    const formData = {
      ...this.form.value,
      agente_id: this.auth.user.id
    }

    this.crud.save("crud/marcas", formData).subscribe((response) => {
      this.loading = false;

      this.fun.presentAlert(response.message);
      this.router.navigateByUrl("component/vehiculos/marcas/list");
    });
  }

  onUpdate(): void {
    // Implement update logic
  }

}
