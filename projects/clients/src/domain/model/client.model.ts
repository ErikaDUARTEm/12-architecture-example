export interface IClient {
  id: number;
  name: string;
  email: string;
  numberPhone: string;
  isFrecuent?: boolean;
}
export interface IPagedClients {
  content: IClient[];
  totalPages: number;
  totalElements: number;
  pageNumber: number;
  size: number;
  }
