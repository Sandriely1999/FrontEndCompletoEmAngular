

export class UserResponse {
  id : number;
  name: string;
  phone: string;
  address: string;


  constructor(id: number, name: string, phone: string, address: string) {
    this.id = id;
    this.name = name;
    this.phone = phone;
    this.address = address;
  }
}
