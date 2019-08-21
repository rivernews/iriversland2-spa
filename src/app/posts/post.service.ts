import { Injectable } from '@angular/core';

import { Post } from "./post";

import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private post_api_url = '//localhost:8000/api/posts';

  constructor(private http: HttpClient) { }

  getPost(): Observable<Post[]> {
    return this.http.get<Post[]>(this.post_api_url);
  }
}
