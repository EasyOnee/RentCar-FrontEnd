import { Component, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { CrudService } from 'src/app/services/crud.service';
import { FunctionsService } from 'src/app/services/functions.service';
import { ValidationService } from 'src/app/services/validation.service';
import { Message, MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-users',
  standalone: false,
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
  providers: [MessageService]
})
export class UsersComponent implements OnInit, OnDestroy {
  private deleteSubscription: Subscription | undefined;

  loading: boolean | undefined;
  results: any;

  cols: any[] = [];
  exportColumns: any[] = [];

  //// 
  form: any;

  user: any = {
    id: ''
  };

  visible: boolean = false;
  isModalOpen: boolean = false;
  isEditMode: boolean = false;

  note: Message[] = [];

  constructor(
    public fun: FunctionsService,
    public auth: AuthService,
    public crud: CrudService,
    private formBuilder: UntypedFormBuilder,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.getList();
    this.subscribeToDeleteEvent();
    
    this.cols = [
      { field: "email", header: "Correo electrónico" },
      { field: "role", header: "Rol" },
      { field: "isActive", header: "Estado" },
      { field: "createdAt", header: "Creado el" },
      { field: "updatedAt", header: "Actualizado el" }
    ];

    this.exportColumns = this.cols.map(col => ({
      title: col.header,
      dataKey: col.field
    }));

    this.form = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, ValidationService.emailValidator]],
      password: [''],
      role: ['', Validators.required]
    });
  }

  ngOnDestroy() {
    if (this.deleteSubscription) {
      this.deleteSubscription.unsubscribe();
    }
  }

  getList() {
    this.loading = true;

    this.crud.getList('users').subscribe((response: any) => {      
      // Ordena los resultados por la fecha de actualización en orden descendente
      this.results = response.sort((a: any, b: any) => {
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      });

      this.results.forEach((result: any) => {
        result.createdAt = this.fun.transformDateTime2(result.createdAt);
        result.updatedAt = this.fun.transformDateTime2(result.updatedAt);
      });

      this.loading = false;
    });
  }

  toggleUserStatus(user: any) {
    if (user.id === this.auth.user.id) {
      this.fun.presentAlertError('No puedes cambiar el estado de tu propia cuenta.');
      return;
    }

    const updatedStatus = user.isActive === 'Activo' ? false : true; // Convertir a booleano
    const updateData = { isActive: updatedStatus };
  
    this.crud.update(`users/${user.id}`, updateData).subscribe(
      (response: any) => {
        const statusText = updatedStatus ? 'activado' : 'desactivado';
        this.fun.presentAlert(`El usuario ha sido ${statusText} correctamente.`);
        this.getList(); // Actualiza la lista para reflejar los cambios
      },
      (error: any) => {
        this.fun.presentAlertError('No se pudo cambiar el estado del usuario.');
      }
    );
  }
  
  showDialog() {
    this.visible = true;
    this.isModalOpen = true;
  }

  hideDialog() {
    this.visible = false;
    this.isModalOpen = false;
    this.isEditMode = false;
    this.form.reset();
  }

  editUser(user: any) {
    this.user = { ...user };
  
    this.form.markAsDirty();
    this.form.get('name').setValue(this.user.name);
    this.form.get('email').setValue(this.user.email);
    this.form.get('role').setValue(this.user.role);
  
    this.isEditMode = true; // Establece el modo de edición
    
    this.showDialog();
  }

  submit() {
    if (this.form.dirty && this.form.valid) {
      if (this.isEditMode) {
        this.update();
      } else {
        this.save();
      }
    } else {
      for (let i in this.form.controls) this.form.controls[i].markAsTouched();
    }
  }

  save() {
    this.loading = true;
    
    this.crud.save('users', this.form.value).subscribe((response: any) => {
      this.loading = false;

      this.fun.presentAlert(response.message);

      this.getList();
      
      this.hideDialog();
    });
  }
  
  update() {
    this.loading = true;
    
    const updateData = { ...this.form.value };

    if (updateData.password === '') {
      delete updateData.password;
    }

    this.crud.update(`users/${this.user.id}`, updateData).subscribe((response: any) => {
      this.loading = false;

      this.fun.presentAlert(response.message);
      this.getList();
      
      this.hideDialog();
    });
  }

  confirmDelete(item: any) {
    if (item.id == this.auth.user.id) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No puedes eliminarte a ti mismo' });
      return;
    }

    // Si el role del usuario es 'ESTUDIANTE', que entre otro confirm si deseamos continuar por que al eliminar el usuario eliminará de la tabla Alumnos también y no se podrá recuperar.
    if (item.role === 'ESTUDIANTE') {
      this.fun.presentConfirm((res: boolean) => {
        if (res) {
          this.crud.confirmDelete(item, 'users');
        }
      }, '¿Estás seguro de que deseas eliminar este usuario? Por que al eliminar este usuario, se eliminará de la tabla Alumnos y no se podrá recuperar.');
    } else {
      this.crud.confirmDelete(item, 'users');
    }
  }
  
  delete(item: any) {
    this.crud.delete(item, 'users');
  }

  subscribeToDeleteEvent() {
    this.deleteSubscription = this.crud.getDeleteObservable().subscribe(() => {
      this.getList();
    });
  }

}
