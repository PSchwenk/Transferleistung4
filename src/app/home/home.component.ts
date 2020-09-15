import { Component, OnInit } from '@angular/core';

import { CustomerMaterialService } from '../services/customer-material.service';
import { MaterialStockService } from '../services/material-stock.service';
import { MaterialDocumentService } from '../services/material-document.service';

import "@ui5/webcomponents/dist/Button";
import "@ui5/webcomponents/dist/Assets";
import "@ui5/webcomponents/dist/List.js";
import "@ui5/webcomponents/dist/StandardListItem.js";
import "@ui5/webcomponents/dist/CustomListItem.js";
import "@ui5/webcomponents/dist/GroupHeaderListItem.js";
import "@ui5/webcomponents/dist/Input.js";
import "@ui5/webcomponents/dist/features/InputSuggestions.js";
import "@ui5/webcomponents/dist/Table.js";
import "@ui5/webcomponents/dist/TableColumn.js";
import "@ui5/webcomponents/dist/TableRow.js";
import "@ui5/webcomponents/dist/TableCell.js";
import "@ui5/webcomponents/dist/Label.js";
import "@ui5/webcomponents-icons/dist/icons/product";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  public dataArray: Array<any>;
  public stockData: any;
  public customerMaterial: any;
  private chosenMatItem: any;
  private custMatArray: any;


  constructor(private _custMatService: CustomerMaterialService, private _materialStockService: MaterialStockService, private _materialDocumentService: MaterialDocumentService) {

  }

  ngOnInit(): void {
    this._custMatService.getAllCustomerMaterial()
      .subscribe(
        function success(data: any) { // json data
          console.log(data);

          var input: any = document.getElementById("inputMatnr");

          this.custMatArray = data.d.results;


          // listen for the input event
          input.addEventListener("input", event => {
            var value = input.value;
            var suggestionItems = [];

            if (value) {
              suggestionItems = data.d.results.filter(item => {
                return item.MaterialByCustomer.toUpperCase().indexOf(value.toUpperCase()) >= 0;
              });
            }

            // remove the previous suggestions
            [].slice.call(input.children).forEach(child => {
              input.removeChild(child);
            });

            // add the new suggestions according to the  user input
            suggestionItems.forEach(item => {
              // console.log("Test");

              var li: any = document.createElement("ui5-suggestion-item");
              li.icon = "product";
              li.info = "auswählen";
              li.infoState = "Info";
              li.description = item.MaterialDescriptionByCustomer;
              li.text = item.MaterialByCustomer;
              input.appendChild(li);
            });
          });



          input.addEventListener("suggestionItemSelect", function handle(item) {
            var custMat = item.detail.item.getAttribute('text');

            console.log(this.custMatArray);
            console.log(custMat);



            this.customerMaterial = this.custMatArray.filter(item => {
              return item.MaterialByCustomer === custMat
            })[0];

            console.log(this.customerMaterial);


            this.chosenMatItem = this.customerMaterial;
            console.log(this);
            this.loadStockForMatnr(this.customerMaterial.Material);
          }.bind(this));
        }.bind(this),
        error => {
          console.log('Error: ', error);
        });
  }

  loadCustomerMaterialInformationByMatnr(matnr) {
    this._custMatService.getCustomerMaterialByMatnr(matnr).subscribe(
      function success(data: any) { // json data
        this.customerMaterial = data.d;
      }.bind(this));
  }

  loadStockForMatnr(matnr) {
    this._materialStockService.getMatStockByMatnr(matnr).subscribe(
      function success(data: any) { // json data
        console.log(data.d);

        this.stockData = data.d;
        console.log(this.stockData.to_MatlStkInAcctMod.results);


        this.stockData.to_MatlStkInAcctMod.results = this.stockData.to_MatlStkInAcctMod.results.filter(item => {
          return item.StorageLocation != "" && item.Plant != "";
        });

        setTimeout(() => {
          var stockTable = document.getElementById("stockTable");

          stockTable.addEventListener("rowClick", function handleEvent(row: any) {
            stockTable.querySelectorAll('.checkbox').forEach(element => {
              element.querySelector('ui5-checkbox').removeAttribute('checked')
            });

            row.detail.row.querySelector('.checkbox').querySelector('ui5-checkbox').setAttribute('checked', true);
            console.log(row);
          });
        }, 0);

      }.bind(this),
      error => {
        console.log('Error: ', error);
      });
  }


  postMaterialDocument() {
    console.log("Post");
    this._materialDocumentService.addStock();
    this.loadStockForMatnr(this.customerMaterial.Material);
  }

}
