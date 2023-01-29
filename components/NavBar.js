import { AiFillLinkedin, AiFillGithub } from "react-icons/ai";
import { Image } from "next/image";


export function NavBar() {
  return (
    <nav className=" flex justify-between bg-white py-5 sticky z-10 top-0 shadow-md px-3">
      <p className="text-2xl">WEIGHT CALC</p>
      <ul className="flex items-center">
        <li className="px-2">
          <a target={"_blank"}
            rel="noreferrer"
            href="https://github.com/alejandrojortiz"
            className="flex items-center">
            <AiFillGithub className="text-3xl" />
          </a>
        </li>
        <li className="px-2">
          <a target={"_blank"}
            rel="noreferrer"
            href="https://www.linkedin.com/in/alejandrojortiz/"
            className="flex items-center">
            <AiFillLinkedin className="text-3xl" />
          </a>
        </li>
      </ul>
    </nav>
  );
}
