import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { FunctionsService } from 'src/app/services/functions.service';
import { ValidationService } from 'src/app/services/validation.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  form: any;
  loading: boolean | undefined;

  currentWord: string = 'Eficaces';
  words: string[] = ['Eficaces', 'Honestos', 'Profesionales', 'Innovadores', 'Responsables'];
  wordIndex: number = 0;
  animate: boolean = false;

  
  constructor(
    public api: ApiService,
    private formBuilder: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private fun: FunctionsService
  ) {
    if (this.auth.is_login) {
      this.navigate();
    }
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, ValidationService.emailValidator]],
      password: ['', Validators.required],
    });

    setInterval(() => {
      this.animate = false; // Remove animation class
      setTimeout(() => {
        this.wordIndex = (this.wordIndex + 1) % this.words.length;
        this.currentWord = this.words[this.wordIndex];
        this.animate = true; // Add animation class
      }, 50); // Small delay to trigger animation
    }, 4000);


  }
  
  submit() {
    if (this.form.dirty && this.form.valid) {
      this.login();
    } else {
      for (let i in this.form.controls) this.form.controls[i].markAsTouched();
    }
  }

  login() {
    this.loading = true;

    this.api.post_('auth/users', this.form.value).subscribe({
      complete: () => { },
      error: (error) => {
        this.loading = false;

        this.fun.presentAlertError(error.error.message);
      },
      next: (response) => {
        this.loading = false;

        this.auth.setLogin(response);

        this.navigate();
      },
    });
  }

  navigate() {
    this.router.navigateByUrl('/dashboard');
  }

}
