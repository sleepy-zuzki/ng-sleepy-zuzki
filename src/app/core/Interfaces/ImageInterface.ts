export interface ImageDoc {
  id:                number;
  documentId:        string;
  name:              string;
  alternativeText:   null;
  caption:           null;
  width:             number;
  height:            number;
  formats:           Format;
  hash:              string;
  ext:               string;
  mime:              string;
  size:              number;
  url:               string;
  previewUrl:        null;
  provider:          string;
  provider_metadata: null;
  createdAt:         Date;
  updatedAt:         Date;
  publishedAt:       Date;
}

export interface Format {
  large:     Image;
  small:     Image;
  medium:    Image;
  thumbnail: Image;
}

interface Image {
  ext:         string;
  url:         string;
  hash:        string;
  mime:        string;
  name:        string;
  path:        null;
  size:        number;
  width:       number;
  height:      number;
  sizeInBytes: number;
}
