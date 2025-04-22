import { ProductType } from "@/types/type.global";
import Image from "next/image";

type cardProps = {
  data: ProductType;
};

const Card = ({ data }: cardProps) => {
  return (
    <div className="card w-96 shadow-sm h-fit bg-gray-600 ">
      <figure className="h-56">
        <Image
          className="h-full object-contain"
          src={data.Image}
          width={550}
          height={550}
          alt="Shoes"
        />
      </figure>
      <div className="card-body">
        <h2 className="card-title">{data.ProductName}</h2>
        <p>{data.Price}</p>
        <div className="card-actions justify-end">
          <button className="btn btn-primary">
            {!data.Stock ? "no item" : "add"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Card;
