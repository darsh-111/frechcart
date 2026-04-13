interface ICartProduct {
    count: number;
    _id: string;
    product: {
        id: string;
        _id: string;
        title: string;
        imageCover: string;
        category?: {
            name: string;
        };
    };
    price: number;
}

export interface ICartData {
    numOfCartItems: number;
    data: {
        products: ICartProduct[];
        totalCartPrice: number;
        _id: string;
        cartOwner: string;
    };
}