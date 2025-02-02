import { ImageDoc } from '@core/Interfaces/ImageInterface';

export interface StrapiResponse {
  data: Datum[];
  meta: Meta;
}

export interface Datum {
  id?:          number;
  documentId?:  string;
  label?:       string;
  streamer?:    string;
  slug?:        string;
  screenshot?:  ImageDoc;
  creators?:  any[];
  url?: string;
  repository?: string;
  techs?:       any;
  createdAt?:   Date;
  updatedAt?:   Date;
  publishedAt?: Date;
}

export interface Meta {
  pagination: Pagination;
}

export interface Pagination {
  page:      number;
  pageSize:  number;
  pageCount: number;
  total:     number;
}
