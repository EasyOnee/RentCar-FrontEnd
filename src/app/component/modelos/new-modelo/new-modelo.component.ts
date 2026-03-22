import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { CrudService } from 'src/app/services/crud.service';
import { FunctionsService } from 'src/app/services/functions.service';

@Component({
  selector: 'app-new-modelo',
  standalone: false,
  templateUrl: './new-modelo.component.html',
  styleUrl: './new-modelo.component.scss'
})
export class NewModeloComponent implements OnInit {
  form: any;
  loading: boolean | undefined;

  modelo: any = {
    id: ''
  };

  brands: any;

  constructor(
    private crud: CrudService,
    private formBuilder: UntypedFormBuilder,
    private fun: FunctionsService,
    private activatedRoute: ActivatedRoute,
    private auth: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadData();

    this.form = this.formBuilder.group({
      nombre: ['', Validators.required],
      marca_id: ['', Validators.required]
    });

    if (this.activatedRoute.snapshot.paramMap.get('id')) {
      this.getModelo(this.activatedRoute.snapshot.paramMap.get('id'));
    }
  }

  loadData() {
    this.crud.getList("vehiculos/data").subscribe((data) => {
      this.brands = data.brands;
    });
  }

  submit(): void {
    if (this.form.dirty && this.form.valid) {
      if (this.modelo.id) {
        this.onUpdate();
      } else {
        this.onSave();
      }
    } else {
      for (let i in this.form.controls) this.form.controls[i].markAsTouched();
    }
  }

  getModelo(id: any): void {
    this.loading = true;

    this.crud.getList(`crud/modelos/${id}`).subscribe((response: any) => {
      this.modelo = response;
    
      this.form.markAsDirty();

      this.form.get('nombre').setValue(this.modelo.nombre);
      this.form.get('marca_id').setValue(this.modelo.marca_id);

      this.loading = false;
    });
  }

  onSave(): void {
    this.loading = true;

    const formData = {
      ...this.form.value,
      agente_id: this.auth.user.id
    }

    this.crud.save("crud/modelos", formData).subscribe((response) => {
      this.loading = false;

      this.fun.presentAlert(response.message);
      this.router.navigateByUrl("component/vehiculos/modelos/list");
    });
  }

  onUpdate(): void {
    // Implement update logic
  }

}
