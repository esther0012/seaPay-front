import {Component, OnInit} from '@angular/core';
import {AuthService} from "../services/auth.service";
import {CommonModule, NgFor, NgIf} from "@angular/common";
import {NgxMaskDirective, NgxMaskPipe, provideNgxMask} from "ngx-mask";
import {CardModule} from "primeng/card";
import {TableModule} from "primeng/table";
import {MenuItem} from "primeng/api";
import {TabMenuModule} from "primeng/tabmenu";
import {Router} from "@angular/router";
import {Button} from "primeng/button";
import {StepsModule} from "primeng/steps";
import {DialogModule} from "primeng/dialog";
import {FormsModule} from "@angular/forms";
import {ConfirmDialogModule} from "primeng/confirmdialog";

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
    styleUrls: ['./home.component.css'],
    imports: [CommonModule, NgIf, NgFor, NgxMaskDirective, NgxMaskPipe, CardModule, TableModule, TabMenuModule, Button, StepsModule, DialogModule, FormsModule, ConfirmDialogModule],
    providers: [provideNgxMask()]
})
export class HomeComponent implements OnInit {
  user: any;
    accountNumber: string = '';
    accountKey: string = '';
    accountBalance: number = 0;
    transactions: any[] = [];
    account: any;
    contacts: any[] = [];
    isKeyVisible: boolean = false;

    items: MenuItem[] | undefined;
    activeItem: MenuItem | undefined;
    stepsItems: MenuItem[] | undefined;
    displayModal: boolean = false;
    displayModalTransferencia: boolean = false;

    activeTab: string = 'inicio';

    currentStep: number = 1;
    selectedAccount: string = '';
    transferValue: number = 0;

    saveContact: boolean = false;
    transferAmount: string = '';

    constructor(private authService: AuthService, private router: Router) {
    }

    ngOnInit() {
    this.loadUser();
        this.loadContacts();
        this.loadTransactions();
        this.items = [
            {label: 'Início', icon: 'pi pi-fw pi-home', command: () => this.changeTab('inicio')},
            {label: 'Transferência', icon: 'pi pi-fw pi-send', command: () => this.changeTab('transferencia')},
            {label: 'Transações', icon: 'pi pi-fw pi-list', command: () => this.changeTab('transacoes')}
        ];
        this.activeItem = this.items[0];

        this.stepsItems = [
            {label: 'Conta'},
            {label: 'Valor'},
            {label: 'Revisão'}
        ];
  }

    nextStep() {
        if (this.currentStep < 3) {
            this.currentStep++;
        } else {
            console.log('Transferência completa');
        }
    }

    goBack() {
        if (this.currentStep > 1) {
            this.currentStep--;
        }
    }

    changeTab(tabName: string) {
        this.activeTab = tabName;
    }

    onTabChange(event: MenuItem) {
        this.activeItem = event;
    }

    // copyToClipboard(text: string) {
    //     this.clipboard.writeText(text);
    //     console.log('Texto copiado para a área de transferência:', text);
    // }
    //
    toggleKeyVisibility(): void {
        this.isKeyVisible = !this.isKeyVisible;
    }

    loadUser() {
        this.authService.getAuthenticatedUser().subscribe(
            (response: any) => {
                this.user = response;
                if (this.user.account) {
                    this.accountNumber = this.user.account.account_number;
                    this.accountBalance = this.user.account.amount;
                    this.accountKey = this.user.account.key;
                }
                console.log(this.user);
            },
            (error) => {
                console.error('Erro ao carregar usuário', error);
            }
        );
    }

    loadContacts() {
        this.authService.getMyContacts().subscribe(
            (response: any) => {
                this.contacts = response.map((contact: any) => ({
                    id: contact.id,
                    userId: contact.user_id,
                    contactId: contact.contact_id,
                    name: contact.contact_user.name,
                    key: contact.contact_user.account.key
                }));
            },
            (error) => {
                console.error('Erro ao carregar contatos', error);
            }
        );
    }

    newContact = {user_id: ''};

    addContact() {
        const userIdNumber = Number(this.newContact.user_id);
        if (userIdNumber) {
            this.authService.addContact({ user_id: userIdNumber }).subscribe(
                (response: any) => {
                    console.log('Contato adicionado com sucesso:', response);
                    this.loadContacts();
                    this.newContact = { user_id: '' };
                },
                (error) => {
                    console.error('Erro ao adicionar contato:', error);
                }
            );
        } else {
            console.log('O user_id é obrigatório');
        }
    }


    loadTransactions() {
        this.authService.getRecentTransactions().subscribe(
            (response: any) => {
                this.transactions = response.transactions;
            },
            (error) => {
                console.error('Erro ao carregar transações', error);
            }
        );
    }

    logout() {
        localStorage.removeItem('token');
        this.router.navigate(['/login']);
    }

    confirmarTransferencia() {
        this.displayModalTransferencia = true;
    }

    novaTransferencia() {
        this.displayModalTransferencia = false;
        this.currentStep = 1;
    }

    finalizarTransferencia() {
        this.displayModalTransferencia = false;
        window.location.reload();
    }
}