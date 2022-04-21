import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CartItem } from 'src/app/common/cart-item';
import { Product } from 'src/app/common/product';
import { CartService } from 'src/app/services/cart.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list-grid.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  // products
  products: Product[] = [];
  currentCategoryId: number = 1;
  previousCategoryId: number = 1;
  searchMode: boolean = false;

  // pagination
  thePageNumber: number = 1;
  thePageSize: number = 5;
  theTotalElements: number = 0;

  previousKeyword: string = null;


  constructor(private productService: ProductService, private route: ActivatedRoute, private cartService: CartService) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.listProducts();
    })
  }

  listProducts() {
    this.searchMode = this.route.snapshot.paramMap.has('keyword');
    if (this.searchMode) {
      this.handleSearchProducts();
    } else {
      this.handleListProducts();
    }
  }

  handleSearchProducts() {
    // @ts-ignore: Object is possibly 'null'.
    const theKeyword: string = this.route.snapshot.paramMap.get('keyword');

    /**
     * if we have a different keyword than previous
     * then set thePageNumber to 1
     */
    if (theKeyword != this.previousKeyword) {
      this.thePageNumber = 1;
    }
    this.previousKeyword = theKeyword;
    console.log(`keyword=${theKeyword}`);
    this.productService.searchProductsPaginate(this.thePageNumber - 1,
      this.thePageSize, theKeyword).subscribe(
        this.processResult()
      );
  }

  handleListProducts() {
    // check if "id" parameter is available
    // route - use the activated route
    // snapshot - State of route at this given moment in time
    // paramMap - Map of all the route parameters
    // 'id' - Read the id parameter, came from the link <a routerLink="/category/:id"> in app.component.html
    const isCategoryIdValid: boolean = this.route.snapshot.paramMap.has('id');
    // && this.route.snapshot.paramMap.get('id') !== null
    // && this.route.snapshot.paramMap.has('id') !== undefined
    if (isCategoryIdValid) {
      // get the "id" param string, convert the string to a number.
      // @ts-ignore: Object is possibly 'null'.
      this.currentCategoryId = +this.route.snapshot.paramMap.get('id');
    } else {
      this.currentCategoryId = 1;
    }
    /**
     * Check if we have a different category than previous
     * Note: Angular will reuse a component if it is currently being viewd
     */

    /**
     * if we have a different category id than previous
     * then set thePageNumber back to 1
     */
    if (this.previousCategoryId != this.currentCategoryId) {
      this.thePageNumber = 1;
    }

    this.previousCategoryId = this.currentCategoryId;

    console.log(`this.currentCategoryId=${this.currentCategoryId}, this.thePageNumber=${this.thePageNumber}`);
    // now get the products for the given category id
    this.productService.getProductListPaginate(this.thePageNumber - 1,
      this.thePageSize,
      this.currentCategoryId).subscribe( // Method is invoked once you "subscribe"
        this.processResult());
  }

  private processResult() {
    //@ts-ignore
    return data => {
      this.products = data._embedded.products;
      this.thePageNumber = data.page.number + 1;
      this.thePageSize = data.page.size;
      this.theTotalElements = data.page.totalElements;
    };
  }

  addToCart(product: Product) {
    console.log(`Adding to cart: ${product.name}, ${product.unitPrice}`);
    const theCartItem = new CartItem(product);
    this.cartService.addToCart(theCartItem);
  }

  updatePageSize(newPageSize: number) {
    this.thePageSize = newPageSize;
    this.thePageNumber = 1;
    this.listProducts();
  }


}
