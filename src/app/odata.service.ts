import { Injectable } from '@angular/core';
import { AuthService } from './services/auth.service';

@Injectable({
  providedIn: 'root'
})
export abstract class OdataService {

  protected _authService: AuthService;

  constructor(protected url: string) {
    this._authService = new AuthService();

  }

}
