export interface StrapiResponse<T> {
  data: T[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

export interface Datum {
  id: string;
  attributes: {
    label: string;
    url: string;
    repository: string;
    screenshot?: {
      data: {
        attributes: {
          formats: {
            thumbnail: {
              url: string;
              width: number;
              height: number;
            };
          };
        };
      };
    };
    techs: {
      data: Array<{
        id: string;
        attributes: {
          label: string;
          icon_name: string;
          family: string;
          color: string;
        };
      }>;
    };
  };
} 