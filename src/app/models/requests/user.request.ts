
export class NewUserRequest {
  name: string;
  phone: string;
  address: string;


  constructor(name: string, phone: string, address: string) {
    this.name = name;
    this.phone = phone;
    this.address = address;
  }
}
