import Image from "next/image";
import Link from "next/link";
import React from "react";

type Props = {};

const Nav = (props: Props) => {
  return (
    <div className="flex items-center justify-between space-x-10 bg-white h-14 sticky top-0 z-50 border-b border-gray-400">
      <div className="flex items-center justify-center">
        <Link className="p-6" href={"/"}>
          <Image
            src={"/logo.png"}
            alt="logo"
            width={125}
            height={125}
            className="hover:scale-105 duration-300"
          />
        </Link>
      </div>
    </div>
  );
};

export default Nav;
