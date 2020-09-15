import { Injectable } from '@angular/core';
import { OdataService } from '../odata.service';
import { HttpHeaders, HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MaterialStockService extends OdataService {

  private headers_object: HttpHeaders;

  constructor(private http: HttpClient) {
    super('https://example.com/sap/opu/odata/sap/API_MATERIAL_STOCK_SRV/');

    this.headers_object = new HttpHeaders({
      "Content-Type": "application/json",
      "Accept": "application/json",
      "Authorization": "Basic " + this._authService.getBTOA(),
      "Cache-Control": "no-cache",
      "X-Requested-With": "*"
    })

  }


  getMatStockByMatnr(matnr: any) {
    const httpOptions = {
      headers: this.headers_object
    };

    return this.http
      .get(this.url + "A_MaterialStock('" + matnr + "')?$expand=to_MatlStkInAcctMod", httpOptions)
  }

  getAllMatStock() {
    const httpOptions = {
      headers: this.headers_object,
    };

    return this.http
      .get(this.url + 'A_MaterialStock?$expand=to_MatlStkInAcctMod', httpOptions)

  }
}