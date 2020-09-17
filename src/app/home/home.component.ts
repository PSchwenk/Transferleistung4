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
  public inputAmount: number;


  constructor(private _custMatService: CustomerMaterialService, private _materialStockService: MaterialStockService, private _materialDocumentService: MaterialDocumentService) {

  }

  ngOnInit(): void {
    this.inputAmount = 1;
    this.hideAmountInput();

    this._custMatService.getAllCustomerMaterial()
      .subscribe(
        function success(data: any) { // json data
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

            this.customerMaterial = this.custMatArray.filter(item => {
              return item.MaterialByCustomer === custMat
            })[0];

            this.chosenMatItem = this.customerMaterial;
            this.loadStockForMatnr(this.customerMaterial.Material);
          }.bind(this));
        }.bind(this),
        error => {
          console.log('Error: ', error);
        });
  }

  showAmountInput() {
    var input = document.getElementById("inputAmountArea");
    input.style.visibility = "visible";
  }

  hideAmountInput() {
    var input = document.getElementById("inputAmountArea");
    input.style.visibility = "hidden";
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

        this.showAmountInput();

        this.stockData = data.d;

        this.stockData.to_MatlStkInAcctMod.results = this.stockData.to_MatlStkInAcctMod.results.filter(item => {
          return item.StorageLocation != "" && item.InventorySpecialStockType == "" && item.InventoryStockType == "01";
        });

        setTimeout(() => {
          var stockTable = document.getElementById("stockTable");

          stockTable.addEventListener("rowClick", function handleEvent(row: any) {
            stockTable.querySelectorAll('.checkbox').forEach(element => {
              element.querySelector('ui5-checkbox').removeAttribute('checked')
            });

            row.detail.row.querySelector('.checkbox').querySelector('ui5-checkbox').setAttribute('checked', true);
          });
        }, 0);

      }.bind(this),
      error => {
        console.log('Error: ', error);
      });
  }


  postMaterialDocument() {
    this._materialDocumentService.addStock();
    this.loadStockForMatnr(this.customerMaterial.Material);
  }

}
