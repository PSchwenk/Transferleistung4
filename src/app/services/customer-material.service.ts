import { Injectable } from '@angular/core';
import { OdataService } from '../odata.service';

import { HttpHeaders, HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class CustomerMaterialService extends OdataService {

  private headers_object: HttpHeaders;

  constructor(private http: HttpClient) {
    super('https://example.com/sap/opu/odata/sap/API_CUSTOMER_MATERIAL_SRV/');

    this.headers_object = new HttpHeaders({
      "Content-Type": "application/json",
      "Accept": "application/json",
      "Authorization": "Basic " + this._authService.getBTOA(),
      "Cache-Control": "no-cache",
      "X-Requested-With": "*"
    })
  }

  getCustomerMaterialByMatnr(matnr: any) {
    const httpOptions = {
      headers: this.headers_object
    };

    return this.http
      .get(this.url + "A_CustomerMaterial('" + matnr + "')", httpOptions)
  }

  getAllCustomerMaterial() {
    const httpOptions = {
      headers: this.headers_object,
    };

    return this.http
      .get(this.url + 'A_CustomerMaterial', httpOptions)
  }

}
