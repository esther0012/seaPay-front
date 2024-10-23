import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from '../services/auth.service';
import {environment} from "../../enviroment/enviroment";

describe('AuthService', () => {
    let service: AuthService;
    let httpMock: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],  // Inclui o HttpClientTestingModule
            providers: [AuthService]  // O serviço a ser testado
        });
        service = TestBed.inject(AuthService);
        httpMock = TestBed.inject(HttpTestingController);  // Injeta o HttpTestingController
    });

    afterEach(() => {
        httpMock.verify();  // Verifica se não há requisições pendentes
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should register a new user', () => {
        const mockResponse = { token: 'mock-jwt-token' };
        const userData = {
            email: 'test@test.com',
            password: 'password',
            accountType: 'standard',
            name: 'Test User',
            registration: '123456789'
        };

        service.register(userData.email, userData.password, userData.accountType, userData.name, userData.registration)
            .subscribe(response => {
                expect(response.token).toEqual(mockResponse.token);
            });

        const req = httpMock.expectOne(`${environment.apiUrl}/signup`);
        expect(req.request.method).toBe('POST');
        req.flush(mockResponse);  // Simula a resposta da API
    });

    it('should login and return a token', () => {
        const mockResponse = { token: 'mock-jwt-token' };
        const loginData = { email: 'test@test.com', password: 'password' };

        service.login(loginData.email, loginData.password).subscribe(response => {
            expect(response.token).toEqual(mockResponse.token);
        });

        const req = httpMock.expectOne(`${environment.apiUrl}/signin`);
        expect(req.request.method).toBe('POST');
        req.flush(mockResponse);
    });

    it('should get authenticated user', () => {
        const mockUser = { id: 1, name: 'Test User' };

        service.getAuthenticatedUser().subscribe(user => {
            expect(user.name).toEqual(mockUser.name);
        });

        const req = httpMock.expectOne(`${environment.apiUrl}/user`);
        expect(req.request.method).toBe('GET');
        req.flush(mockUser);
    });
});
