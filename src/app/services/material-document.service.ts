import { Injectable } from '@angular/core';
import { OdataService } from '../odata.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MaterialDocumentService extends OdataService {

  constructor(private http: HttpClient) {
    super('https://example.com/sap/opu/odata/sap/API_MATERIAL_DOCUMENT_SRV/');
  }

  addStock() {
    var headers_object = new HttpHeaders({
      "Content-Type": "application/json",
      "Accept": "application/json",
      "Authorization": "Basic " + this._authService.getBTOA(),
      "Cache-Control": "no-cache",
      "X-Requested-With": "*",
      "X-CSRF-Token": "Fetch"
    })


    const httpOptions: any = {
      headers: headers_object,
      observe: 'response'
    };

    var oData = {
      PostingDate: "/Date(1596410686791)/",
      GoodsMovementCode: "01",
      to_MaterialDocumentItem: [{
        Material: 'TG11',
        Plant: '1010',
        StorageLocation: '101A',
        GoodsMovementType: "501",
        QuantityInEntryUnit: '1'
      }]
    };

    this.http
      .get(this.url, httpOptions).subscribe(
        function handle(resp: any) { // json data
          var headers_object_new = new HttpHeaders({
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": "Basic " + this._authService.getBTOA(),
            "Cache-Control": "no-cache",
            "X-Requested-With": "*",
            "X-CSRF-Token": resp.headers.get('x-csrf-token')
          })

          var httpOptions_new: any = {
            headers: headers_object_new,
            observe: 'body'
          };

          var that = this;
          return this.http
            .post(this.url + "A_MaterialDocumentHeader", oData, httpOptions_new)
            .subscribe(
              data => { // json data
                console.log('Success: ', data);
              },
              error => {
                console.log('Error: ', error);
              });

        }.bind(this),
        error => {
          console.log('Error: ', error);
        });
  }



}
