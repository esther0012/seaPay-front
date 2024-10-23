import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from "../../enviroment/enviroment";
import {Router} from "@angular/router";

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private apiUrl = environment.apiUrl;

    constructor(private http: HttpClient,
                private router: Router) {}

    register(email: string, password: string, accountType: string, name: string, registration: string): Observable<any> {
        const body = { email, password, account_type: accountType, name, registration };
        return this.http.post(`${environment.apiUrl}/auth/signup`, body);
    }

    login(cpf: string, password: string): Observable<any> {
        const body = {
            login: cpf,
            password: password
        };
        return this.http.post(`${this.apiUrl}/auth/signin`, body);
    }


    getAuthenticatedUser(): Observable<any> {
        return this.http.get(`${this.apiUrl}/auth/user`);
    }

    refreshToken() {
        return this.http.post<{ token: string }>(`${this.apiUrl}/auth/refresh-token`, {});
    }


    saveToken(token: string): void {
        localStorage.setItem('token', token);
    }

    logout() {
        localStorage.removeItem('token');
        this.router.navigate(['/login']);
    }

}
