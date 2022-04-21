import { Component, OnInit } from '@angular/core';
import { ProductCategory } from 'src/app/common/product-category';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-category-menu',
  templateUrl: './product-category-menu.component.html',
  styleUrls: ['./product-category-menu.component.css']
})
export class ProductCategoryMenuComponent implements OnInit {

  productCategories: ProductCategory[] | undefined; // Define property

  constructor(private productService: ProductService) { } // inject the service

  ngOnInit(): void {
    this.listProductCategories();
  }

  listProductCategories() {
    this.productService.getProductCategories().subscribe( // invoke the service
      data => {
        console.log('Product Categories=' + JSON.stringify(data)); //log data returned from service
        this.productCategories = data; //assign data to our property
      }
    )
  }

}
