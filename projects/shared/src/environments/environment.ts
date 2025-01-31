export const environment = {
  apiUrl: 'http://localhost:8080/api'
};

export const urlResources = {
  clients: `${environment.apiUrl}/clientes`,
  restaurant: `${environment.apiUrl}/restaurant`,
  ordenes: `${environment.apiUrl}/ordenes`,
  dishes: `${environment.apiUrl}/dish`,
  clientsOperationsById: (clientId: string) => `${environment.apiUrl}/clientes/${clientId}`,
  ordenesOperationsById: (ordenId: string) => `${environment.apiUrl}/ordenes/${ordenId}`,
  dishesOperationsById: (dishId: string) => `${environment.apiUrl}/dish/${dishId}`


}
