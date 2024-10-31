export class NewDishRequest {
  name: string;
  description: string;
  price: number;
  image: string;


  constructor(name: string, description: string, price: number, image: string) {
    this.name = name;
    this.description = description;
    this.price = price;
    this.image = image;

  }
}
