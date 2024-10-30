export class DishResponse {
  dishId : number;
  name: string;
  description : string;
  price: number;
  image: string;
  availability: boolean

  constructor(dishId: number, name: string, description: string, price: number, image: string, availability: boolean) {
    this.dishId = dishId;
    this.name = name;
    this.description = description;
    this.price = price;
    this.image = image;
    this.availability = availability;
  }

}
