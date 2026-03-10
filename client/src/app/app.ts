import { Component, inject, OnInit, signal } from '@angular/core';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { RouterOutlet } from '@angular/router';
import { Header } from './layout/header/header';
import { HttpClient } from '@angular/common/http';
import { Product } from './shared/models/product';
import { Pagination } from './shared/models/pagination';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MatSlideToggleModule, Header],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  baseUrl = 'https://localhost:5091/api/';
  private http = inject(HttpClient);
  title = 'SkiNet';
  products: Product[] = [];

  ngOnInit(): void {
    this.http.get<Pagination<Product>>(this.baseUrl + 'products').subscribe({
      next: (response) => {
        console.log(response);
        this.products = response.data;
      },
      error: (error) => console.log(error),
      complete: () => console.log('Request completed'),
    });
  }
}
