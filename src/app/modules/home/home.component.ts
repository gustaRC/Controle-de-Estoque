import { MessageService } from 'primeng/api';
import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { AutenticarRequest } from 'src/app/models/interfaces/autenticar/Autenticar-request';
import { CadastroUserRequest } from 'src/app/models/interfaces/user/CadastroUser-request';
import { UserService } from 'src/app/services/user/user.service';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild('inputEmail') emailInputRef!: ElementRef;
  @ViewChild('inputPassword') passwordInputRef!: ElementRef;

  loginCard: boolean = true

  loginForm = this.formBuilder.group({
    email: ['', Validators.required],
    password: ['', Validators.required]
  })

  cadastroForm = this.formBuilder.group({
    name: ['', Validators.required],
    email: ['', Validators.required],
    password: ['', Validators.required]
  })

  private destroy$ = new Subject<void>();

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private cookieService: CookieService,
    private messageService : MessageService,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.emailInputRef.nativeElement.value = 'Seu e-mail aqui'
    this.passwordInputRef.nativeElement.value = 'Sua senha aqui'
    console.log('EMAIL INPUT', this.emailInputRef)
    console.log('PASSWORD INPUT', this.passwordInputRef)
  }

  resetarFormularios() {
    this.loginForm.reset();
    this.cadastroForm.reset();
  }

  submitLoginForm() {
    if(this.loginForm.value && this.loginForm.valid) {
      this.userService.autenticarUser(this.loginForm.value as AutenticarRequest)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: response => {
            if(response) {
              this.cookieService.set('USER_TOKEN', response?.token);
              this.resetarFormularios();
              this.router.navigate(['/dashboard'])

              this.messageService.add({
                severity: 'success',
                summary: 'Sucesso',
                detail: `Bem Vindo de Volta ${response?.name}!`,
                life: 1400
              })
            }

          },
          error: err => {
            this.messageService.add({
              severity: 'error',
              summary: 'Erro',
              detail: `Erro ao fazer login!`,
              life: 1400
            })
            console.log(err)
          }
        })
    }
  }

  submitCadatroForm() {
      if (this.cadastroForm.value && this.cadastroForm.valid) {
      this.userService.cadastroUser(this.cadastroForm.value as CadastroUserRequest)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            if (response) {
              this.resetarFormularios();
              this.loginCard = !this.loginCard;

              this.messageService.add({
                severity: 'success',
                summary: 'Sucesso',
                detail: `Cadastro realizado com sucesso!`,
                life: 2000
              })
            };

          },
          error: err => {
            this.messageService.add({
              severity: 'error',
              summary: 'Erro',
              detail: `Erro ao fazer o cadastro!`,
              life: 1400
            })
            console.log(err)
          }
        })
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }


}
